<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- Card卡片 -->
        <el-card>
            <!-- 添加用户按钮 -->
            <el-button type="primary" @click="addRolesVisible=true">添加角色</el-button>
            <!-- Table表单 -->
            <el-table :data="rolesList" border stripe>
                <!-- 折叠 -->
                <el-table-column type="expand" width="50px">
                    <template slot-scope="scope">
                        <el-row :class="[bbtmClass,index === 0 ? btopClass : '']" v-for="(item1,index) in scope.row.children" :key="item1.id">
                            <el-col :span="5">
                                <el-tag>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row :class="[index===0?'': btopClass]" v-for="(item2,index) in item1.children" :key="item2.id">
                                    <el-col :span="8">
                                        <el-tag type="success">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="16">
                                        <el-tag @close='delRolesRights(scope.row,item3.id)' closable v-for="(item3,index) in item2.children" :key="item3.id" type="warning">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作" width="370px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoles(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="delRoles(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加角色对话框 -->
        <el-dialog
        @close='addRolesClose'
        title="添加角色"
        :visible.sync="addRolesVisible"
        width="50%">
        <span>
            <!-- Form表单 -->
            <el-form :model="rolesForm" :rules="rolesFormRules" ref="rolesFormRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="rolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="rolesForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addRolesVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitAddRoles">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 修改角色信息对话框 -->
        <el-dialog
        @close='addRolesClose'
        title="修改角色信息"
        :visible.sync="editRolesVisible"
        width="50%">
        <span>
            <!-- Form表单 -->
            <el-form :model="editForm" :rules="rolesFormRules" ref="rolesFormRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editRolesVisible = false">取 消</el-button>
            <el-button type="primary" @click="submiteditRoles">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 分配权限对话框 -->
        <el-dialog
        @close='setRightClose'
        title="修改角色信息"
        :visible.sync="setRightVisible"
        width="50%">
        <span>
            <!-- Tree树形控件 -->
            <el-tree ref="treeRef" 
            :default-checked-keys='rightsKey' 
            node-key="id" 
            :data="rightList" 
            default-expand-all 
            :props="rightProps" show-checkbox></el-tree>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setRightVisible = false">取 消</el-button>
            <el-button type="primary" @click="submiteditRoles">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data () {
        return {
            rolesList: [],
            bbtmClass: 'bbtm',
            btopClass: 'btop',
            addRolesVisible: false,
            rolesForm: {
                roleName: '',
                roleDesc: ''
            },
            rolesFormRules: {
                roleName: [
                    {required: true, message: '请输入角色名称', trigger: 'blur'},
                    {min:2,max:10, message: '至少2字符', trigger: 'blur'}
                ],
                roleDesc: [
                    {required: true, message: '请输入角色描述', trigger: 'blur'}
                ]
            },
            editForm: {
                id: '',
                roleName: '',
                roleDesc: ''
            },
            editRolesVisible: false,
            setRightVisible: false,
            rightList: [],
            rightProps: {
                children: 'children',
                label: 'authName' 
            },
            rightsKey: [],
            nodeId: ''
        }
    },
    mounted(){
        this.getRolesList();
    },
    methods: {
        //获取角色列表数据
        async getRolesList(){
            var {data: res} = await this.$http.get('roles');
            this.rolesList = res.data;
        },
        //监听添加角色对话框关闭
        addRolesClose(){
            this.$refs.rolesFormRef.resetFields();
        },
        //确定添加角色
        submitAddRoles(){
            this.$refs.rolesFormRef.validate(async(valid)=>{
                if(!valid){
                    return;
                }
                var {data:res} = await this.$http.post('roles',this.rolesForm);
                if(res.meta.status !== 201){
                   return this.$message.error('添加角色失败');
                }
                this.$message.success('添加成功');
                this.addRolesVisible = false;
                this.getRolesList();
            })
        },
        //删除角色
        async delRoles(id){
           var result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch((error)=>{
                    return error;
                });
            if(result === 'confirm'){
                var {data:res} = await this.$http.delete('roles/'+id);
                if(res.meta.status !== 200){
                   return this.$message.error('删除角色失败');
                }
                this.getRolesList();
            }else if(result === 'cancel'){
                this.$message.info('已取消删除');
            }
        },
        //编辑角色
        editRoles(node){
            this.editRolesVisible = true;
            this.editForm.id = node.id;
            this.editForm.roleName = node.roleName;
            this.editForm.roleDesc = node.roleDesc;
        },
        //提交编辑角色信息
        submiteditRoles(){
            this.$refs.rolesFormRef.validate(async(valid)=>{
                if(!valid){
                    return;
                }
                var {data: res} = await this.$http.put(`roles/${this.editForm.id}`,this.editForm);
                if(res.meta.status !== 200){
                    return this.$message.error('提交编辑角色信息失败');
                }
                this.$message.success('编辑角色信息成功');
                this.getRolesList();
                this.editRolesVisible = false;
            })
        },
        //删除角色指定权限
        async delRolesRights(role,rightId){
            var result = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch((error)=>{
                    return error;
                });
                if(result === 'confirm'){
                    var {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
                    if(res.meta.status !== 200){
                        return this.$message.error('删除指定权限失败');
                    }
                    this.$message.success('删除指定权限成功');
                    role.children = res.data;
                }else if(result === 'cancel'){
                    this.$message.info('已取消删除');
                }
        },
        //展示分配权限的对话框
        async showSetRightDialog(node){
            var {data:res} = await this.$http.get('rights/tree');
            if(res.meta.status !== 200){
                return this.$message.error('获取所有权限失败');
            }
            this.rightList = res.data;
            this.findChildren(node, this.rightsKey);
            this.nodeId = node.id;
            this.setRightVisible = true;
        },
        //递归找数组
        findChildren(node,arr){
            if(!node.children){
               return arr.push(node.id);
            }
            node.children.forEach((item)=> {
                this.findChildren(item, arr);
            })
        },
        //监听分配权限对话框关闭
        setRightClose(){
            this.rightsKey = [];
        },
        //提交分配权限
        async submiteditRoles(){
            var keys = [];
            var arr1 = this.$refs.treeRef.getCheckedKeys();
            var arr2 = this.$refs.treeRef.getHalfCheckedKeys();
            keys = arr1.concat(arr2);
            keys = keys.join(',');
            var {data: res} = await this.$http.post(`roles/${this.nodeId}/rights`,{rids:keys});
            if(res.meta.status !== 200){
                this.$message.error('分配权限失败');
            }
            this.$message.success('分配权限成功');
            this.getRolesList();
            this.setRightVisible = false;
        }
    }
}
</script>

<style lang="less" scoped>
.el-row{
    display: flex;
    align-items: center;
}
.el-tag{
    margin: 10px;
}
.btop{
    border-top: 1px solid #EBEEF5;
}
.bbtm{
    border-bottom: 1px solid #EBEEF5;
}
</style>