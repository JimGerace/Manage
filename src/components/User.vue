<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- Card卡片 -->
        <el-card>
            <!-- 搜索框 -->
            <el-input class="user_input" placeholder="请输入内容" v-model="queryUser.query" clearable @clear='searchClear'>
                <el-button slot="append" icon="el-icon-search" @click='searchInfo'></el-button>
            </el-input>
            <!-- 添加用户按钮 -->
            <el-button class="addUser" type="primary" @click="addUserVisible=true">添加用户</el-button>
            <!-- Table表格 -->
            <el-table :data="userList" border stripe style="width: 100%">
                <el-table-column type="index" label="#" width="50">
                </el-table-column>
                <el-table-column prop="username" label="用户名"  width="180">
                </el-table-column>
                <el-table-column  prop="mobile"  label="手机号"  width="180">
                </el-table-column>
                <el-table-column  prop="email"  label="邮箱地址">
                </el-table-column>
                <el-table-column  prop="role_name"  label="用户身份">
                </el-table-column>
                <el-table-column  label="状态">
                    <template slot-scope="scope">
                        <el-switch @change="userSwitch(scope.row)" v-model="scope.row.mg_state">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column  label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary"  @click="editUser(scope.row)" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" @click="delUser(scope.row)" icon="el-icon-delete" size="mini"></el-button>
                         <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button @click="SetRolesDialog(scope.row)" type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryUser.pagenum"
            :page-sizes="[1, 2, 4]"
            :page-size="queryUser.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加用户Dialog对话框 -->
        <el-dialog
        @close="userDialogClosed"
        title="添加用户"
        :visible.sync="addUserVisible"
        width="50%">
        <span>
            <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addUserForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addUserVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUserInfo">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 修改按钮Dialog对话框 -->
        <el-dialog
        title="修改"
        :visible.sync="editVisible"
        width="50%">
        <span>
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="用户名">
                    <el-input disabled v-model="editForm.username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitEidt">确 定</el-button>
        </span>
        </el-dialog>

         <!-- 分配角色Dialog对话框 -->
        <el-dialog
        @close='setRoleClose'
        title="分配角色"
        :visible.sync="showSetRolesDialog"
        width="50%">
        <span>
            <p>
                <span>当前的用户: </span>
                <span>{{allotRoles.username}}</span>
            </p>
            <p>
                <span>当前的角色: </span>
                <span>{{allotRoles.role_name}}</span>
            </p>
            <span>分配新角色: </span>
            <el-select v-model="roleValue" placeholder="请选择角色">
                <el-option v-for="item in roleslist" :key="item.id" :label="item.roleName" :value="item.id">
                </el-option>
            </el-select>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showSetRolesDialog = false">取 消</el-button>
            <el-button type="primary" @click="submitSetRole">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data () {
        var validateEmail = (rule, value, callback) => {
            var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            if(value === ''){
                callback('请输入邮箱');
            }
            else if(!reg.test(value)){
                callback('请输入正确的邮箱');
            }
            callback();
        }
        var validateMobile = (rule, value, callback) => {
            var reg = /^[1]{1}[3-9]+([0-9]){9}$/;
            if(value === ''){
                callback('请输入手机号码');
            }else if(!reg.test(value)){
                callback('请输入正确的手机号码');
            }
            callback();
        }
        return {
            queryUser: {
                query: '',
                pagenum: 1,
                pagesize: 2
            },
            userList: [],
            total: 0,
            addUserVisible: false,
            addUserForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            addUserFormRules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {min:3, max:10, message: '长度在3-10范围内', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {min:6, max:30, message: '至少6位数', trigger: 'blur'}
                ],
                email: [
                    {required: true, message: '请输入邮箱', trigger: 'blur'},
                    {validator: validateEmail, trigger: 'blur'}
                ],
                mobile: [
                    {required: true, message: '请输入手机号码', trigger: 'blur'},
                    {validator: validateMobile, trigger: 'blur' }
                ]
            },
            editVisible: false,
            editForm: {
                id: '',
                username: '',
                email: '',
                mobile: ''
            },
            editFormRules: {
                email: [
                    {required: true, message: '请输入邮箱', trigger: 'blur'},
                    {validator: validateEmail, trigger: 'blur'}
                ],
                mobile: [
                    {required: true, message: '请输入手机号码', trigger: 'blur'},
                    {validator: validateMobile, trigger: 'blur'}
                ]
            },
            showSetRolesDialog: false,
            allotRoles: {
                id: '',
                username: '',
                role_name: ''
            },
            roleValue: '',
            roleslist: []
        }
    },
    mounted() {
        this.getUserList();
        this.getRolesList();
    },
    methods: {
        //获取角色列表信息
        async getRolesList(){
            var {data: res} = await this.$http.get('roles');
            if(res.meta.status !== 200){
                return this.$message.error('获取角色列表数据失败');
            }
            this.roleslist = res.data;
            console.log(this.roleslist);
        },
        //获取用户数据列表信息
        async getUserList(){
            var {data: res} = await this.$http.get('users', {params: this.queryUser});
            if(res.meta.status !== 200){
                this.$message.error('获取用户列表信息失败');
            }
            this.userList = res.data.users;
            this.total = res.data.total;
        },
        //点击状态开关
        async userSwitch(userInfo){
            var {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
            if(res.meta.status !== 200){
                userInfo.mg_state = !userInfo.mg_state;
                this.$message.error('修改用户状态失败');
            }
            this.$message.success('更新用户状态成功');
        },
        //切换每页条数
        handleSizeChange(val){
            this.queryUser.pagesize = val;
            this.getUserList();
        },
        //切换当前页数
        handleCurrentChange(val){
            this.queryUser.pagenum = val;
            this.getUserList();
        },
        //搜索功能
        searchInfo(){
            this.getUserList();
        },
        //监听搜索框清空
        searchClear(){
            this.getUserList();
        },
        //添加新用户
        addUserInfo(){
            this.$refs.addUserFormRef.validate(async (valid)=> {
                if(!valid){
                    return;
                }
                var {data: res} = await this.$http.post('users', this.addUserForm);
                if(res.meta.status !== 201){
                this.$message.error('添加用户失败');
                }
                this.$message.success('添加新用户成功');
                this.getUserList();
            });
            this.addUserVisible = false;
        },
        //对话框关闭
        userDialogClosed(){
            this.$refs.addUserFormRef.resetFields();
        },
        //点击修改按钮
        editUser(node){
            this.editVisible = true;
            this.editForm.id = node.id;
            this.editForm.username = node.username;
            this.editForm.email = node.email;
            this.editForm.mobile = node.mobile;
        },
        //提交编辑用户信息
        submitEidt(){
            this.$refs.editFormRef.validate(async (valid)=> {
                if(!valid){
                    return;
                }
                var {data: res} = await this.$http.put(`users/${this.editForm.id}`, this.editForm);
                if(res.meta.status !== 200){
                    this.$message.error('更新用户信息失败');
                }
                this.$message.success('更新用户信息成功');
                this.getUserList();
                this.editVisible = false;
            })
        },
        //删除用户
        async delUser(node){
            var result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch((error)=> {
                return error;
            })
            if(result === 'confirm'){
                var {data: res} = await this.$http.delete(`users/${node.id}`);
                if(res.meta.status !== 200){
                    this.$message.error('删除失败');
                }
                this.$message.success('删除用户成功');
                this.getUserList();
            }else if(result === 'cancel'){
                this.$message.info('已取消删除');
            }
        },
        //展示分配角色对话框
        SetRolesDialog(node){
            this.allotRoles.id = node.id;
            this.allotRoles.username = node.username;
            this.allotRoles.role_name = node.role_name;
            this.showSetRolesDialog = true;
        },
        //提交分配角色信息
        async submitSetRole(){
            if(this.roleValue === ''){
                return this.$message.error('请选择角色')
            }
            var {data: res} = await this.$http.put(`users/${this.allotRoles.id}/role`, {rid: this.roleValue});
            if(res.meta.status !== 200){
                return this.$message.error('分配角色失败');
            }
            this.$message.success('分配角色成功');
            this.getUserList();
            this.showSetRolesDialog = false;
        },
        //监听分配角色对话框关闭
        setRoleClose(){
            this.roleValue = '';
        }
    }    
}
</script>

<style lang="less" scoped>
.user_input{
    width: 500px;
}
.addUser{
    margin-left: 15px;
}
</style>