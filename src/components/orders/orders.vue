<template>
    <el-card>
        <!-- 1， 导航栏 -->
     <div slot="header" class="clearfix">
      <Mylist listname1="订单管理" listname2="订单列表" />
     </div>
     <!-- 表格 -->
    <el-table :data="orderslist" style="width: 100%">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="order_number" label="订单编号"></el-table-column>
      <el-table-column prop="order_price" label="订单价格"></el-table-column>
      <el-table-column label="是否付款">
          <template slot-scope="scope">
              <el-tag v-if="scope.row.pay_status == '0'" type="success">未付款</el-tag>
              <el-tag v-if="scope.row.pay_status == '1'" type="danger">已付款</el-tag>
            </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货"></el-table-column>
      <el-table-column label="下单时间">
        <template slot-scope="orderslist">{{ orderslist.row.create_time|fmtdata }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
           <el-button @click='updateorders(scope.row)' size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
        </template>
        
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 对话框 -->
      <el-dialog
        title="修改订单地址"
        :visible.sync="dialogVisible"
        >
      <el-form :model="form">
          <el-form-item label="省市区" label-width="100px">
            <el-cascader
               clearable
               v-model="values"
               :options="citydata"
               :props="cascaderProps"
               @change="handleChange"></el-cascader>
            </el-cascader>  
           </el-form-item>
           <el-form-item label="详细地址" label-width="100px">
               <el-input clearable v-model="form.cat_name" autocomplete="off"></el-input>
           </el-form-item>
           
       </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
      </el-dialog>
    </el-card>
</template>

<script>
 import citydata from 'assets/js/citydata'
    export default {
        data() {
            return {
                pagenum:1,
                pagesize:4,
                orderslist:[],
                total:null,
                dialogVisible:false,
                form:{
                    cat_name:''

                },
                citydata:[],
                cascaderProps:{
                    expandTrigger: 'hover',
                    label: 'label',
                    value: 'value',
                    children: 'children'
                },
                values:[]

            }
        },
        
        created() {
            this.getList()
        },
        methods:{
           async getList() {
               const res = await this.$http.get(`orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
                this.orderslist = res.data.data.goods
                this.total = res.data.data.total
                console.log(res)
            },
            handleSizeChange(e) {
                this.pagesize = e
                this.pagenum = 1;
                this.getList()
            },
            handleCurrentChange(e) {
                // console.log(e)
                this.pagenum = e
                this.getList()
            },
            //修改订单
            updateorders() {
                this.citydata = citydata
                this.dialogVisible = true
            },
            handleChange() {
                console.log(this.values)
            }

        }
    }
</script>

<style>
    
</style>