<template>
  <el-card class="box-card">
     <!-- 1， 导航栏 -->
  <div slot="header" class="clearfix">
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <!-- 2，输入框 -->
  <div class="user-input">
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="primary">添加用户</el-button>
  </div>
  
  <!-- 3，表格 -->
  <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
       type="index"
        label="#"
        width="60">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="80">
      </el-table-column>
      <el-table-column
        prop="address"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="address"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="address"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="address"
        label="用户状态">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
      </el-table-column>
    </el-table>
  <!-- 4，分页 -->
</el-card>
</template>

<script>
export default {
    data() {
        return {
            query:'',
            pagenum:1,
            pagesize:5,
            tableData: [{
          
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
        }
    },
    created() {
        this.getUserList()
        
    },
    methods:{
        async getUserList() {
            //需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
            const AUTH_TOKEN = localStorage.getItem('token') 
            this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN;
        //   const  res = await  this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
           const  res = await  this.$http.get('users',{
              params:{
                  query:this.query,
                  pagenum:this.pagenum,
                  pagesize:this.pagesize
              }
          })
          console.log(res)
        }
        
    }
};
</script>

<style lang="less" scoped>
  .user-input {
      display: flex;
      .input-with-select {
          width: 400px;
          margin-right: 10px;
      }
  }

</style>