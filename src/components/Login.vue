<template>
    <div class="loginMain">
        <div class="login_container">
            <!-- 头像区域 -->
            <div class="header_pic">
                <img src="../assets/logo.png" >
            </div>

            <!-- 表单区域 -->
            <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm" class="login_form">
                <!-- 用户名区域 -->
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-yonghu" v-model="loginForm.username"></el-input>
                </el-form-item>
                <!-- 密码区域 -->
                <el-form-item prop="password">
                    <el-input type="password"  prefix-icon="iconfont icon-mima" v-model="loginForm.password"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="submitLoginForm">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            loginForm: {
                username: '',
                password: ''
            },
            loginFormRules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {min: 2, max: 11, message: '请输入正确的用户名', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {min: 6, max: 20, message: '请输入正确的密码', trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        //重置表单数据
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
        },
        //登录按钮
        submitLoginForm(){
            this.$refs.loginFormRef.validate( async (valid) => {
                if(!valid){
                    return ;
                }
                var {data: res} = await this.$http.post('login', {username: this.loginForm.username, password: this.loginForm.password});
                // result.then(function(data){
                //     console.log(data);
                // })
                if(res.meta.status !== 200){
                    return this.$message.error('登录失败')
                }
                this.$message.success('登录成功');
                window.sessionStorage.setItem('token', res.data.token);
                this.$router.push('/home');
            })
        }
    }
}
</script>

<style lang="less" scoped>
.loginMain{
    width: 100%;
    height: 100%;
    background-color: #2b4b6b;
}
.login_container{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 450px;
    height: 320px;
    background-color: #fff;
    transform: translate(-50%,-50%);
}
.header_pic{
    padding: 10px;
    position: absolute;
    left: 50%;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 0 10px #ddd;
    transform: translate(-50%,-50%);
    img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }
}
.login_form{
    padding: 0px 20px;
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
}
.btns{
    display: flex;
    justify-content: flex-end;
}
</style>