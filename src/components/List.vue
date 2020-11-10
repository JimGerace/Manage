<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- Card卡片 -->
        <el-card>
            <!-- 搜索栏 -->
            <el-input @clear='getGoodsList()' clearable placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
            </el-input>
            <!-- 添加商品按钮 -->
            <el-button type="primary" @click="addGoods">添加商品</el-button>
            <el-table border stripe :data="goodsList">
                <el-table-column type="index" label="序号" width="50px"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="80px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="60px"></el-table-column>
                <el-table-column label="创建时间" width="180px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | format(scope.row.add_time)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="delGoods(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- Pagination分页 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[10, 30, 50]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    data () {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            total: 0,
            goodsList: []
        }
    },
    mounted(){
        this.getGoodsList();
    },
    methods: {
        //获取商品列表
        async getGoodsList(){
            var {data: res} = await this.$http.get('goods',{params: this.queryInfo});
            if(res.meta.status !== 200){
                return this.$message.error('获取商品列表数据失败');
            }
            this.goodsList = res.data.goods;
            this.total = res.data.total;
        },
        //监听当前页数变化
        handleCurrentChange(val){
            this.queryInfo.pagenum = val;
            this.getGoodsList();
        },
        //监听每页显示多少数据变化
        handleSizeChange(val){
            this.queryInfo.pagesize = val;
            this.getGoodsList();
        },
        //删除商品
        async delGoods(node){
            var result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch((error)=>{
                return error;
            });
            if(result === 'confirm'){
                var {data: res} = await this.$http.delete(`goods/${node.goods_id}`);
                if(res.meta.status !== 200){
                    return this.$message.error('删除商品失败');
                }
                this.$message.success('删除商品成功');
                this.getGoodsList();
            }else if(result === 'cancel'){
                this.$message.info('已取消删除');
            }
        },
        //添加商品
        addGoods(){
            this.$router.push('/goods/add');
        }
    },
    filters: {
        format(data){
            var date = new Date(data);
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var seconds = date.getSeconds();
            if(minute < 10){
                minute = '0'+minute;
            }
            if(month < 10){
                month = '0'+month;
            }
            if(day < 10){
                day = '0'+day;
            }
            if(hour < 10){
                hour = '0'+hour;
            }
            if(seconds < 10){
                seconds = '0'+seconds;
            }
            return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+seconds;
        }
    }
}
</script>

<style lang="less" scoped>
.input-with-select{
    width: 600px;
    margin-right: 20px;
}
</style>