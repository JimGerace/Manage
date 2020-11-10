<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- Card卡片 -->
        <el-card>
            <!-- 添加分类按钮 -->
            <el-button type="primary" @click="addCate">添加分类</el-button>
            <!-- ZkTable表格 -->
            <zk-table :data="cateList" :selection-type='false' show-index :expand-type="false" :show-row-hover="false" border stripe :columns="columns">
                <template slot="isok" slot-scope="scope">
                    <i style="color:lightgreen" v-if="scope.row.cat_deleted === false" class="el-icon-success"></i>
                    <i style="color:red" v-else class="el-icon-error"></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
                    <el-tag v-else-if="scope.row.cat_level === 1" type="success" size="mini">二级</el-tag>
                    <el-tag v-else type="warning" size="mini">三级</el-tag>
                </template>
                <template slot="operate" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCate(scope.row)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="delCate(scope.row.cat_id)">删除</el-button>
                </template>
            </zk-table>

            <!-- Pagination分页 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 8, 10, 15]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类对话框 -->
        <el-dialog
        @close="addCateClose"
        title="添加分类"
        :visible.sync="addCateVisible"
        width="50%">
        <span>
            <el-form :model="cateForm" :rules="cateFormRules" ref="cateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="cateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader 
                    @change="selectedCate" 
                    clearable change-on-select 
                    v-model="cateValue" 
                    :options="cateOptions" 
                    :props='cateProps' 
                    expand-trigger='hover'></el-cascader>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCateVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitCate">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 编辑对话框 -->
        <el-dialog
        @close="editCateClose"
        title="编辑"
        :visible.sync="editCateVisible"
        width="50%">
        <span>
            <el-form :model="editCateForm" :rules="cateFormRules" ref="editCateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="editCateForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editCateVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitEditCate">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            cateList: [],
            total: 0,
            columns: [{
                label: '产品名称',
                prop: 'cat_name'
            },{
                label: '是否有效',
                type: 'template',
                template: 'isok'
            },{
                label: '排序',
                type: 'template',
                template: 'order'
            },{
                label: '操作',
                type: 'template',
                template: 'operate'
            }],
            addCateVisible: false,
            cateForm: {
                cat_pid: 0,
                cat_name: '',
                cat_level: 0
            },
            cateFormRules: {
                cat_name: [
                    {required:true, message: '请输入分类名称', trigger: 'blur'},
                    {min:2, message: '至少2位字符', trigger: 'blur'}
                ]
            },
            cateValue: [],
            cateOptions: [],
            cateProps: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            editCateForm: {
                id: '',
                cat_name: ''
            },
            editCateVisible: false
        }
    },
    mounted(){
        this.getCateList();
    },
    methods: {
        //获取父级分类的数据
        async getParentCate(){
            var {data: res} = await this.$http.get('categories', {params: {type: 2}});
            if(res.meta.status !== 200){
                return this.$message.error('获取父级分类数据失败');
            }
            this.cateOptions = res.data;
        },
        //获取商品分类的数据
        async getCateList(){
            var {data: res} = await this.$http.get('categories',{params: this.queryInfo});
            if(res.meta.status !== 200){
                return this.$message.error('获取商品分类数据失败');
            }
            this.cateList = res.data.result;
            this.total = res.data.total;
        },
        //监听下一页操作
        handleCurrentChange(val){
            this.queryInfo.pagenum = val;
            this.getCateList();
        },
        //监听每页显示几条数据
        handleSizeChange(val){
            this.queryInfo.pagesize = val;
            this.getCateList();
        },
        //监听添加分类按钮
        addCate(){
            this.getParentCate();
            this.addCateVisible = true;
        },
        //监听添加分类对话框关闭
        addCateClose(){
            this.$refs.cateFormRef.resetFields();
            this.cateValue = [];
        },
        //提交添加分类
        submitCate(){
            this.$refs.cateFormRef.validate(async(valid)=>{
                if(!valid){
                    return;
                }
                var {data: res} = await this.$http.post('categories', this.cateForm);
                if(res.meta.status !== 201){
                    return this.$message.error('添加分类失败');
                }
                this.$message.success('添加分类成功');
                this.getCateList();
            });
            this.addCateVisible = false;
        },
        //监听级联选择器
        selectedCate(){
            if(this.cateValue.length > 0){
                this.cateForm.cat_pid = this.cateValue[this.cateValue.length-1];
                this.cateForm.cat_level = this.cateValue.length;
            }else{
                this.cateForm.cat_pid = 0;
                this.cateForm.cat_level = 0;
            }
        },
        //监听编辑按钮
        editCate(node){
            this.editCateForm.id = node.cat_id;
            this.editCateForm.cat_name = node.cat_name;
            console.log(this.editCateForm);
            this.editCateVisible = true;
        },
        //提交编辑信息
        submitEditCate(){
            this.$refs.editCateFormRef.validate(async(valid)=>{
                if(!valid){
                    return;
                }
                var {data: res} = await this.$http.put(`categories/${this.editCateForm.id}`,{cat_name: this.editCateForm.cat_name});
                if(res.meta.status !== 200){
                    return this.$message.error('编辑分类信息失败');
                }
                this.$message.success('编辑分类信息成功');
                this.getCateList();
                this.editCateVisible = false;
            })
        },
        //监听编辑对话框关闭
        editCateClose(){
            this.$refs.editCateFormRef.resetFields();
        },
        //监听删除分类
        async delCate(id){
            var result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch((error)=>{
                return error;
            });
            if(result === 'confirm'){
                var {data: res} = await this.$http.delete(`categories/${id}`);
                if(res.meta.status !== 200){
                    return this.$message.error('删除分类失败');
                }
                this.$message.success('删除分类成功');
                this.getCateList();
            }else if(result === 'cancel'){
                this.$message.info('已取消删除');
            }
        }
    }
}
</script>

<style lang="less" scoped>
.zk-table{
    margin-top: 15px;
    min-width: 1235px;
}
.el-cascader{
    width: 100%;
}
</style>