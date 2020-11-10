<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- Card卡片 -->
        <el-card>
            <!-- Alert警告 -->
            <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
            <!-- Steps步骤条 -->
            <el-steps :active="activeNum - 0" align-center finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- 基本信息区域 -->
            <el-form label-position='top' :model="BasicInfoForm" :rules="BasicInfoFormRules" ref="BasicInfoFormRef" label-width="100px">
                <!-- Tabs标签页 -->
                <el-tabs @tab-click='tabClicked' :before-leave="beforeTabLeave" v-model="activeNum" tab-position="left">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="BasicInfoForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="BasicInfoForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="BasicInfoForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="BasicInfoForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader v-model="BasicInfoForm.goods_cat" :options="cateList" :props='cateProps' expandTrigger='hover' @change="selectChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :label="option" v-for="(option,index) in item.attr_vals" :key="index"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                        :action="uploadURL"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="uploadSuccess"
                        :headers="headersObj"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="BasicInfoForm.goods_introduce"></quill-editor>
                        <el-button class="addBtn" type="primary" @click="addGoodsList">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <!-- 预览图对话框 -->
        <el-dialog
        title="预览图"
        :visible.sync="pictureVisible"
        width="50%">
        <span>
            <img class="pic" :src="temporaryPic" >
        </span>
        </el-dialog>

    </div>
</template>

<script>
import _ from 'lodash'
export default {
    data () {
        return {
            BasicInfoForm: {
                goods_name: '',
                goods_cat: '',
                goods_price: 0,
                goods_number: 0,
                goods_weight: 0,
                pics: [],
                goods_introduce: '',
                attrs: []
            },
            BasicInfoFormRules: {
                goods_name:[
                    {required:true, message:'请输入商品名称', trigger:'blur'},
                    {min:1, message:'至少1位', trigger:'blur'}
                ],
                goods_cat:[
                    {required:true, trigger:'blur'}
                ],
                goods_price:[
                    {required:true, message:'请输入商品价格', trigger:'blur'}
                ],
                goods_number:[
                    {required:true, message:'请输入商品数量', trigger:'blur'},
                    {min:1, message:'至少1位', trigger:'blur'}
                ],
                goods_weight:[
                    {required:true, message:'请输入商品重量', trigger:'blur'},
                    {min:1, message:'至少1位', trigger:'blur'}
                ]
            },
            cateList: [],
            selectedValue: [],
            cateProps: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            activeNum: '0',
            manyData: [],
            onlyData: [],
            uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
            headersObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            pictureVisible: false,
            temporaryPic: ''
        }
    },
    mounted(){
        this.getCateList();
    },
    methods: {
        //获取商品分类的名称
        async getCateList(){
            var {data:res} = await this.$http.get(`categories`);
            if(res.meta.status !== 200){
                return this.$message.error('获取商品分类信息失败');
            }
            this.cateList = res.data;
        },
        //监听级联选择器变化
        selectChange(){
            if(this.BasicInfoForm.goods_cat.length !== 3){
                this.BasicInfoForm.goods_cat = [];
            }
        },
        //监听Tabs的选择
        beforeTabLeave(newName, oldName){
            if(oldName === '0'){
                if(this.BasicInfoForm.goods_cat.length !== 3){
                    this.$message.error('请选择商品分类');
                    return false;
                }
            }
        },
        //监听Tabs的切换
        async tabClicked(){
            if(this.activeNum === '1'){
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel: 'many'}});
                if(res.meta.status !== 200){
                    return this.$message.error('获取动态参数数据失败');
                }
                res.data.forEach((item)=>{
                    item.attr_vals = item.attr_vals.split(' ');
                });
                this.manyData = res.data;
            }else if(this.activeNum === '2'){
                const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel: 'only'}});
                if(res.meta.status !== 200){
                    return this.$message.error('获取静态属性数据失败');
                }
                this.onlyData = res.data;
            }
        },
        //图片上传--预览效果
        handlePreview(file){
            this.temporaryPic = file.response.data.url;
            this.pictureVisible = true;
        },
        //图片上传--移除图片
        handleRemove(file){
            const picPath = file.response.data.tmp_path;
            var index = this.BasicInfoForm.pics.findIndex((item)=>{
                return item.pic === picPath;
            });
            this.BasicInfoForm.pics.splice(index, 1);
        },
        //图片上传--上传成功
        uploadSuccess(response){
            const picPath = {
                pic: response.data.tmp_path
            };
            this.BasicInfoForm.pics.push(picPath);
        },
        //监听添加商品
        addGoodsList(){
            this.$refs.BasicInfoFormRef.validate(async(valid)=>{
                if(!valid){
                    return;
                }
                //处理动态参数
                this.manyData.forEach((item)=>{
                    const newValue = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals.join(' ')
                    }
                    this.BasicInfoForm.attrs.push(newValue);
                });
                //处理静态属性
                this.onlyData.forEach((item)=>{
                    const newValue= {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals
                    };
                    this.BasicInfoForm.attrs.push(newValue);
                });
                const form = _.cloneDeep(this.BasicInfoForm);
                form.goods_cat = form.goods_cat.join(',');
                const {data:res} = await this.$http.post('goods',form);
                if(res.meta.status !== 201){
                    return this.$message.error('添加商品信息失败');
                }
                this.$message.success('添加商品成功');
                this.$router.push('/goods');
            })
        }
    },
    //分类ID
    computed: {
        cateId(){
            if(this.BasicInfoForm.goods_cat.length === 3){
                return this.BasicInfoForm.goods_cat[2];
            }
            return null;
        }
    }
}
</script>

<style lang="less" scoped>
.el-steps{
    margin-top: 20px;
}
.el-tabs{
    margin-top: 20px;
}
.el-checkbox{
    margin: 0;
}
.pic{
    width: 100%;
    height: 100%;
}
.addBtn{
    margin-top: 15px;
}
</style>