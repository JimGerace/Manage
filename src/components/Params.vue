<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- Card卡片 -->
        <el-card>
            <!-- Alert警告 -->
            <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon></el-alert>
            <p>选择商品分类：
                <el-cascader v-model="cateValue" :options="cateList" expandTrigger='hover' :props="cateOptions" @change="selectedCate"></el-cascader>
            </p>
            <!-- Tabs标签页 -->
            <el-tabs v-model="paramsSel">
                <el-tab-pane label="动态参数" name="many">
                    <el-button :disabled='isChange' type="primary" size="mini" @click="addmanyParams">添加参数</el-button>
                    <!-- Table表格-->
                    <el-table border stripe :data="manyParams">
                        <!-- 折叠 -->
                        <el-table-column type="expand" width="80px">
                            <template slot-scope="scope">
                                <el-tag @close='tagClose(scope.row, index)' closable v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="序号" width="80px"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editManyParams(scope.row)">修改</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="delManyParams(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态参数" name="only">
                    <el-button :disabled='isChange' type="primary" size="mini" @click="addOnlyParams">添加属性</el-button>
                    <!-- Table表格-->
                    <el-table border stripe :data="onlyParams">
                        <el-table-column type="expand" width="80px">
                            <template slot-scope="scope">
                                <el-tag @close='tagClose(scope.row, index)' closable v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="序号" width="80px"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editOnlyParams(scope.row)">修改</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="delOnlyParams(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加参数对话框 -->
        <el-dialog
        @close='manyDialogClose'
        title="添加参数"
        :visible.sync="addManyVisible"
        width="50%">
        <span>
            <el-form :model="manyForm" :rules="manyFormRules" ref="manyFormRef" label-width="100px">
                <el-form-item label="动态参数" prop="attr_name">
                    <el-input v-model="manyForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addManyVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitManyParams">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 添加静态属性对话框 -->
         <el-dialog
        @close='onlyDialogClose'
        title="添加参数"
        :visible.sync="addOnlyVisible"
        width="50%">
        <span>
            <el-form :model="onlyForm" :rules="onlyFormRules" ref="onlyFormRef" label-width="100px">
                <el-form-item label="静态属性" prop="attr_name">
                    <el-input v-model="onlyForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addOnlyVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitOnlyParams">确 定</el-button>
        </span>
        </el-dialog>

         <!-- 编辑动态参数对话框 -->
         <el-dialog
        @close='editManyDialogClose'
        title="修改"
        :visible.sync="editManyVisible"
        width="50%">
        <span>
            <el-form :model="editManyForm" :rules="editManyFormRules" ref="editManyFormRef" label-width="100px">
                <el-form-item label="参数名称" prop="attr_name">
                    <el-input v-model="editManyForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editManyVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitEditMany">确 定</el-button>
        </span>
        </el-dialog>

         <!-- 编辑静态属性对话框 -->
         <el-dialog
        @close='editOnlyDialogClose'
        title="修改"
        :visible.sync="editOnlyVisible"
        width="50%">
        <span>
            <el-form :model="editOnlyForm" :rules="editOnlyFormRules" ref="editOnlyFormRef" label-width="100px">
                <el-form-item label="属性名称" prop="attr_name">
                    <el-input v-model="editOnlyForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editOnlyVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitEditOnly">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data () {
        return {
            cateList: [],
            cateValue: [],
            cateOptions: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            paramsSel: 'many',
            isChange: true,
            selectedValue: 0,
            manyParams: [],
            onlyParams: [],
            addManyVisible: false,
            manyForm: {
                id: '',
                attr_name: '',
                attr_sel: 'many'
            },
            manyFormRules: {
                attr_name:[
                    {required:true, message:'请输入动态参数', trigger:'blur'}
                ]
            },
            addOnlyVisible: false,
            onlyForm: {
                id: '',
                attr_name: '',
                attr_sel: 'only'
            },
            onlyFormRules: {
                attr_name: [
                    {required:true, message:'请输入静态属性', trigger:'blur'}
                ]
            },
            editManyVisible: false,
            editManyForm: {
                id: '',
                attr_name: '',
                attr_sel: 'many',
                attrId: ''
            },
            editManyFormRules: {
                attr_name: [
                    {required:true, message:'请输入参数名称', trigger:'blur'}
                ]
            },
            editOnlyVisible: false,
            editOnlyForm: {
                id: '',
                attr_name: '',
                attr_sel: 'only',
                attrId: ''
            },
            editOnlyFormRules: {
                attr_name: [
                    {required:true, message:'请输入参数名称', trigger:'blur'}
                ]
            }
        }
    },
    mounted(){
        this.getcateList();
    },
    methods: {
        //获取参数列表
        async getParamsList(){
            if(this.cateValue.length !== 3){
                this.cateValue = [];
                this.onlyParams = [];
                this.manyParams = [];
                return ;
            }
            this.selectedValue = this.cateValue[this.cateValue.length-1];
            //获取动态参数列表
            var {data: manyP} = await this.$http.get(`categories/${this.selectedValue}/attributes`,{params: {sel: 'many'}});
            if(manyP.meta.status !== 200){
                return this.$message.error('获取动态参数列表失败');
            }
            manyP.data.forEach((item)=>{
                if(item.attr_vals === ''){
                    item.inputVisible = false;
                    item.inputValue = '';
                    return item.attr_vals = [];
                }
                item.attr_vals = item.attr_vals.split(' ');
                item.inputVisible = false;
                item.inputValue = '';
            });
            this.manyParams = manyP.data;
            //获取静态属性
            var {data: onlyP} = await this.$http.get(`categories/${this.selectedValue}/attributes`,{params: {sel: 'only'}});
            if(onlyP.meta.status !== 200){
                return this.$message.error('获取静态属性参数列表失败');
            }
            onlyP.data.forEach((item)=>{
                if(item.attr_vals === ''){
                    item.inputVisible = false;
                    item.inputValue = '';
                    return item.attr_vals = [];
                }
                item.attr_vals = item.attr_vals.split(' ');
                item.inputVisible = false;
                item.inputValue = '';
            });
            this.onlyParams = onlyP.data;
        },
        //获取商品分类
        async getcateList(){
            var {data: res} = await this.$http.get('categories');
            if(res.meta.status !== 200){
                return this.$message.error('获取商品分类数据失败');
            }
            this.cateList = res.data;
        },
        //监听级联选择器
        selectedCate(){
            this.getParamsList();
            if(this.cateValue.length === 0){
                this.isChange = true;
                return;
            }
            this.isChange = false;
        },
        //监听添加参数
        addmanyParams(){
            this.manyForm.id = this.selectedValue;
            this.addManyVisible = true;
        },
        //监听动态参数对话框关闭
        manyDialogClose(){
            this.$refs.manyFormRef.resetFields();
        },
        //提交动态参数
        submitManyParams(){
            this.$refs.manyFormRef.validate(async(valid)=>{
                if(!valid){
                    return;
                }
            var {data:res} = await this.$http.post(`categories/${this.manyForm.id}/attributes`,this.manyForm);
            if(res.meta.status !== 201){
                return this.$message.error('添加动态参数失败');
            }
            this.$message.success('添加动态参数成功');
            this.getParamsList();
            this.addManyVisible = false;
            })
        },
        //监听添加静态属性
        addOnlyParams(){
            this.onlyForm.id = this.selectedValue;
            this.addOnlyVisible = true;
        },
        //监听静态属性对话框关闭
        onlyDialogClose(){
            this.$refs.onlyFormRef.resetFields();
        },
        //提交添加静态属性
        submitOnlyParams(){
            this.$refs.onlyFormRef.validate(async(valid)=>{
                if(!valid){
                    return;
                }
            var {data:res} = await this.$http.post(`categories/${this.onlyForm.id}/attributes`,{attr_name: this.onlyForm.attr_name, attr_sel: 'only'});
            if(res.meta.status !== 201){
                return this.$message.error('添加静态属性失败');
            }
            this.$message.success('添加静态属性成功');
            this.addOnlyVisible = false;
            this.getParamsList();
            })
        },
        //动态参数修改按钮
        editManyParams(node){
            this.editManyForm.id = node.cat_id;
            this.editManyForm.attr_id = node.attr_id;
            this.editManyForm.attr_name = node.attr_name;
            this.editManyVisible = true;
        },
        //监听编辑动态参数对话框关闭
        editManyDialogClose(){
            this.$refs.editManyFormRef.resetFields();
        },
        //提交编辑动态参数
        submitEditMany(){
            this.$refs.editManyFormRef.validate(async(valid)=>{
                if(!valid){
                    return;
                }
                var {data:res} = await this.$http.put(`categories/${this.editManyForm.id}/attributes/${this.editManyForm.attr_id}`,this.editManyForm);
                if(res.meta.status !== 200){
                    return this.$message.error('修改动态参数信息失败');
                }
                this.$message.success('修改动态参数信息成功');
                this.getParamsList();
                this.editManyVisible = false;
            })
        },
        //静态属性修改按钮
        editOnlyParams(node){
            console.log(node);
            this.editOnlyForm.id = node.cat_id;
            this.editOnlyForm.attr_id = node.attr_id;
            this.editOnlyForm.attr_name = node.attr_name;
            this.editOnlyVisible = true;
        },
        //监听编辑静态属性对话框的关闭
        editOnlyDialogClose(){
            this.$refs.editOnlyFormRef.resetFields();
        },
        //提交静态属性
        submitEditOnly(){
            this.$refs.editOnlyFormRef.validate(async(valid)=>{
                if(!valid){
                    return;
                }
                var {data:res} = await this.$http.put(`categories/${this.editOnlyForm.id}/attributes/${this.editOnlyForm.attr_id}`,this.editOnlyForm);
                if(res.meta.status !== 200){
                    return this.$message.error('修改静态属性信息失败');
                }
                this.$message.success('修改静态属性成功');
                this.getParamsList();
                this.editOnlyVisible = false;
            })
        },
        //删除动态参数
        async delManyParams(node){
            var result = await this.$confirm('此操作将永久删除该动态参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch((error)=>{
                    return error;
            });
            if(result === 'confirm'){
                var {data:res} = await this.$http.delete(`categories/${node.cat_id}/attributes/${node.attr_id}`);
                if(res.meta.status !== 200){
                    return this.$message.error('删除动态参数失败');
                }
                this.$message.success('删除动态参数成功');
                this.getParamsList();
            }else if(result === 'cancel'){
                this.$message.info('已取消删除');
            }
        },
        //删除静态属性
        async delOnlyParams(node){
            var result = await this.$confirm('此操作将永久删除该静态属性, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch((error)=>{
                    return error;
            });
            if(result === 'confirm'){
                var {data:res} = await this.$http.delete(`categories/${node.cat_id}/attributes/${node.attr_id}`);
                if(res.meta.status !== 200){
                    return this.$message.error('删除动态参数失败');
                }
                this.$message.success('删除动态参数成功');
                this.getParamsList();
            }else if(result === 'cancel'){
                this.$message.info('已取消删除');
            }
        },
        //切换文本框与输入框
        showInput(node){
            console.log(node);
            node.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        //当输入框失去焦点触发
        handleInputConfirm(node){
            if(node.inputValue.trim().length === 0){
                node.inputVisible = false;
                node.inputValue= '';
                return;
            }
            node.attr_vals.push(node.inputValue);
            this.savaParams(node);
            node.inputValue= '';
            node.inputVisible = false;
        },
        //编辑可选项添加
        async savaParams(node){
            var {data: res} = await this.$http.put(`categories/${node.cat_id}/attributes/${node.attr_id}`,{
                attr_name: node.attr_name,
                attr_sel: node.attr_sel,
                attr_vals: node.attr_vals.join(' ')
            });
            if(res.meta.status !== 200){
                return this.$message.error('编辑可选项失败');
            }
            this.$message.success('编辑可选项成功');
        },
        //Tag标签关闭
        tagClose(node,index){
            node.attr_vals.splice(index,1);
            this.savaParams(node);
        }
    }
}
</script>

<style lang="less" scoped>
.el-tag{
    margin: 0px 5px;
}
.input-new-tag{
    width: 120px;
}
</style>