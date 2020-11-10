<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- Card卡片 -->
        <el-Card>
            <!-- Form表单 -->
            <el-table :data="rightsList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="authName" label="权限名称"></el-table-column>
                <el-table-column prop="path" label="路径"></el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template slot-scope="scope">
                        <!-- Tag标签 -->
                        <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                        <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
                        <el-tag v-else type="warning">三级</el-tag>
                    </template>                
                </el-table-column>
            </el-table>
        </el-Card>
    </div>
</template>

<script>
export default {
    data () {
        return {
            rightsList: []
        }
    },
    mounted() {
        this.getRightsList();
    },
    methods: {
        // 获取所有权限列表
        async getRightsList() {
           var {data: res} = await this.$http.get('rights/list');
           if(res.meta.status !== 200){
               this.$message.error('获取所有权限列表失败');
           }
           this.rightsList = res.data;
        }
    }
}
</script>

<style lang="less" scoped>

</style>