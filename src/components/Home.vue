<template>
    <div class="home">
        <!-- 布局容器 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <img src="../assets/heima.png" >
                <span>后台管理系统</span>
            </el-header>
            <el-container class="container_next">
                <!-- 左侧区域 -->
                <el-aside :width="asideWidth">
                    <!-- 折叠按钮 -->
                    <span class="toggle_button" @click="toggleCollapse">|||</span>
                    <!-- 导航菜单 -->
                    <el-menu
                    :default-active="activePath"
                    router
                    :collapse-transition="false"
                    :collapse="isCollapse"
                    unique-opened
                    background-color="rgb(64, 115, 158)"
                    text-color="#fff"
                    active-text-color="rgb(64, 158, 255)">
                        <!-- 一级菜单 -->
                        <el-submenu :index="item.id+''"icon-shuju v-for="(item,index) in navList" :key="item.id">
                            <template slot="title">
                                <i :class="fontPic[item.id]"></i>
                                <span>{{item.authName}}</span>
                            </template>
                            <!-- 二级菜单 -->
                            <el-menu-item :index="'/'+option.path" v-for="(option,index) in item.children" :key="option.id" @click="savaPath('/'+option.path)">
                                <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span>{{option.authName}}</span>
                                </template>
                            </el-menu-item>
                        </el-submenu>
                        <el-menu-item class="tuichu" :index="path" @click="goodBye">
                            <i class="iconfont icon-tuichudenglu"></i>
                            <span>退出登录</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <!-- 右侧区域 -->
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    data(){
        return {
            navList: [],
            fontPic: {
                '125': 'iconfont icon-usergroup1',
                '103': 'iconfont icon-quanxian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-weibiaoti--',
                '145': 'iconfont icon-shuju'
            },
            isCollapse: false,
            asideWidth: 200 + 'px',
            activePath: '',
            path: ''
        }
    },
    mounted(){
        this.getNavList();
        this.activePath = window.sessionStorage.getItem('activePath');
    },
    methods: {
        // 获取左侧菜单数据
        async getNavList() {
            var {data : res} = await this.$http.get('menus');
            if(res.meta.status !== 200){
                this.$message.error('获取导航菜单数据失败');
            }
            this.navList = res.data;
        },
        // 折叠效果
        toggleCollapse(){
            this.isCollapse = !this.isCollapse;
            if(this.isCollapse === true){
                this.asideWidth = 60 + 'px';
            }else{
                this.asideWidth = 200 + 'px';
            }
        },
        // 保存左侧菜单选项的path
        savaPath(activePath){
            window.sessionStorage.setItem('activePath', activePath);
            this.activePath = activePath;
        },
        //退出登录
        async goodBye(){
            var result = await this.$confirm('此操作将退出登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).catch((error)=>{
                            return error;
                        });
            if(result === 'confirm'){
                window.sessionStorage.clear();
                this.$router.push('/login');
                this.$message.success('成功退出登录');
            }else{
                this.$message.info('已取消退出登录');
            }
        }
    }
}
</script>

<style lang="less" scoped>
.home{
    width: 100%;
    height: 100%;
}
.el-header{
    display: flex;
    padding: 0;
    align-items: center;
    background-color: #3498db;

    img{
        width: 40px;
        height: 40px;
        margin-left: 30px;
    }
    span{
        color: #fff;
        font-size: 20px;
        margin-left: 10px;
    }
}
.el-container{
    width: 100%;
    height: 100%;
}
.el-aside{
    background-color: #487eb0;
}
.el-submenu{
    width: 200px;
}
.el-submenu.is-opened{
    width:200px;
}
.el-submenu__title{
    width:200px;
}
.iconfont{
    color: #fff;
    font-size: 16px;
    margin-right: 10px;
}
.toggle_button{
    cursor: pointer;
    display: block;
    font-size: 12px;
    color: #fff;
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    letter-spacing: 0.2em;
}
.el-main{
    overflow: visible;
    background-color: #ecf0f1;
}
.tuichu{
    width: 200px;
}
</style>