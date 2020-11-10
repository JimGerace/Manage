<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- Card卡片 -->
        <el-card>
            <!-- 搜索栏 -->
            <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
            </el-input>
            <!-- Table表格 -->
            <el-table border stripe :data="orderlist">
                <el-table-column type="index" label='序号' width="60px"></el-table-column>
                <el-table-column label="订单编号" prop="order_number" width="500px"></el-table-column>
                <el-table-column label="订单价格" prop="order_price" width="100px"></el-table-column>
                <el-table-column label="是否付款" width="120px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.order_pay === '1'" type="success">已付款</el-tag>
                        <el-tag v-else type="danger">未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send" width="100px">
                </el-table-column>
                <el-table-column label="下单时间">
                    <template slot-scope="scope">
                        {{scope.row.create_time | format(scope.row.create_time)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editClick"></el-button>
                        <el-button type="success" icon="el-icon-location" size="mini"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- Pagination分页 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>

        <!-- 编辑对话框 -->
        <el-dialog
        @close='editDialogClose'
        title="修改地址"
        :visible.sync="editVisible"
        width="50%">
        <span>
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader clearable :options="cityData" v-model="editForm.address1"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="editForm.address2"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editVisible = false">取 消</el-button>
            <el-button type="primary" @click="editVisible = false">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 快递对话框 -->
        <el-dialog
        title="物流进度"
        :visible.sync="progressVisible"
        width="50%">
        <!-- <el-timeline>
            <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
            </el-timeline-item>
        </el-timeline> -->
        </el-dialog>
    </div>
</template>

<script>
import cityData from '../assets/citydata'
export default {
    data () {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            total: 0,
            orderlist: [],
            editForm: {
                address1: [],
                address2: ''
            },
            editFormRules: {
                address1: [
                    {required:true, message:'请选择省市区/县', trigger:'blur'}
                ],
                address2: [
                    {required:true, message:'请输入详细地址', trigger:'blur'}
                ]
            },
            cityData: cityData,
            editVisible: false,
            progressVisible: false,
            progressInfo: []
        }
    },
    mounted(){
        this.getOrderList();
    },
    methods: {
        // 获取订单列表
        async getOrderList(){
            const {data:res} = await this.$http.get('orders',{params: this.queryInfo});
            if(res.meta.status !== 200){
                return this.$message.error('获取订单列表失败');
            }
            this.orderlist = res.data.goods;
            this.total = res.data.total;
        },
        //监听当前页数的变化
        handleCurrentChange(val){
            this.queryInfo.pagenum = val;
            this.getOrderList();
        },
        //监听一页显示的数据变化
        handleSizeChange(val){
            this.queryInfo.pagesize = val;
            this.getOrderList();
        },
        //监听编辑按钮
        editClick(){
            this.editVisible = true;
        },
        //监听对话框关闭
        editDialogClose(){
            this.$refs.editFormRef.resetFields();
        }
    },
    filters: {
        format(time){
            var date = new Date(time);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
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
            if(second < 10){
                second = '0'+second;
            }
            return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
        }
    }
}
</script>

<style lang="less" scoped>
.input-with-select{
    width: 500px;
}
.el-cascader{
    width: 100%;
}
</style>