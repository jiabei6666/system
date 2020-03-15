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
      <el-input @clear='findUser' clearable placeholder="请输入内容" v-model="query" class="input-with-select">
        <el-button @click="findUser" slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="primary" @click="dialogFormVisible">添加用户</el-button>
    </div>

    <!-- 3，表格 -->
    <el-table :data="userlist" style="width: 100%">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="username" label="姓名" width="80"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="userlist">{{ userlist.row.create_time|fmtdata }}</template>
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="userlist">
          <el-switch
            @change="userSwitch(userlist.row)"
            v-model="userlist.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
           <el-button @click='userAmend(scope.row)' size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
           <el-button @click="userRole(scope.row)" size="mini" plain type="success" icon="el-icon-check" circle></el-button>
           <el-button @click="detail(scope.row.id)" size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
        </template>
        
      </el-table-column>
    </el-table>
    <!-- 4，分页 -->
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
    <!-- 5，添加用户的对话框 -->
  <el-dialog title="添加用户" :visible.sync="dialogFormVisibleadd">
  <el-form :model="formUser">
    <el-form-item label="用户名" label-width="100px">
      <el-input clearable v-model="formUser.username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" label-width="100px">
      <el-input clearable v-model="formUser.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" label-width="100px">
      <el-input clearable v-model="formUser.emaill" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="电话" label-width="100px">
      <el-input clearable v-model="formUser.mobile" autocomplete="off"></el-input>
    </el-form-item>
   </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleadd = false">取 消</el-button>
    <el-button type="primary" @click="clickAddUser">确 定</el-button>
  </div>
</el-dialog>

<!-- 6，修改用户的对话框 -->
  <el-dialog title="编辑用户" :visible.sync="userisshow">
  <el-form :model="formUser">
    <el-form-item label="用户名" label-width="100px">
      <el-input disabled clearable v-model="formUser.username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" label-width="100px">
      <el-input clearable v-model="formUser.email" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="电话" label-width="100px">
      <el-input clearable v-model="formUser.mobile" autocomplete="off"></el-input>
    </el-form-item>
   </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="userisshow = false">取 消</el-button>
    <el-button type="primary" @click="clickAmendUser()">确 定</el-button>
  </div>
</el-dialog>
 <!-- 分配角色 -->
 <el-dialog title="分配角色" :visible.sync="dialogFormVisibles">
  <el-form >
    <el-form-item label="用户名" label-width="100px">
      {{currentName}}
    </el-form-item>
    <el-form-item label="角色" label-width="100px">

      <el-select v-model="rid">
        <el-option label="请选择" :value="-1"></el-option>
        <el-option 
        v-for="(item,index) in AlluserRole" 
        :label="item.roleName" 
        :value="item.id"
        :key="index"
        ></el-option>
       </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibles = false">取 消</el-button>
    <el-button type="primary" @click="RoleUserChange">确 定</el-button>
  </div>
</el-dialog>
</el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 4,
      userlist: [],
      total: null,
      dialogFormVisibleadd : false,
      formUser:{
          username:null,
          password:null,
          email:null,
          mobile:null
      },
      dialogFormVisibles:false,
      userisshow:false,
      rid:-1,
      currentName:'',
      AlluserRole:[],
      currentId:0
    };
  },
  created() {
    this.pagenum = 1;
    this.getUserList();
  },
  methods: {
    async getUserList() {
      //需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      //   const  res = await  this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      const res = await this.$http.get("users", {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      // console.log(res);
      let { data, meta } = res.data;
      if (meta.status == 200) {
        this.userlist = data.users;
        this.total = data.total;
        this.$message.success(meta.msg);
      } else {
        this.$message.warning(meta.msg);
      }
    },
    //分页
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pagesize = val;
        this.pagenum = 1;
        this.getUserList();
    },
    handleCurrentChange(val) {
        this.pagenum = val
        this.getUserList();
        console.log(`当前页: ${val}`);
    },
    //查找用户
    findUser() {
        this.getUserList();
    },
    //对话框添加用户
    dialogFormVisible() {
      this.formUser = {}
      this.dialogFormVisibleadd = true
    },
    
    //点击添加用户按钮
  async  clickAddUser() {
        const res = await this.$http.post('users',this.formUser)
        console.log(res)
        const {data,meta} = res.data
        if(meta.status == 201) {
            this.$message.success(meta.msg);
            this.dialogFormVisibleadd = false
            this.getUserList();
            this.formUser = {}
        }else {
            this.$message.warning(meta.msg);
        }
        
        
    },
    //删除个人账户
    detail(userId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$http.delete(`users/${userId}`) 
          // console.log(res)
          let {data,meta} = res.data;
          if(meta.status == 200) {
               this.$message({
               type: 'success',
               message: meta.msg
               });
               this.pagenum = 1;
               this.getUserList();
          }
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //修改用户
     userAmend(e) {
      // console.log(e)
        this.userisshow = true
        this.formUser = e
      
  },
  async clickAmendUser() {
      
      const res = await this.$http.put(`users/${this.formUser.id}`,this.formUser)
      let {data,meta} = res.data
     if(meta.status==200) {
        this.$message.success(meta.msg)
        this.userisshow = false
        this.getUserList();
      }
      
    },
    //用户状态开关
   async userSwitch(user) {
      // 请求路径：users/:uId/state/:type
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
       let {data,meta} = res.data
       if(meta.status==200) {
        this.$message.success(meta.msg)
        
      }
    },
    //选择角色
  async  userRole(e) {
      this.currentId = e.id
      this.dialogFormVisibles = true
      //  console.log(e)
       //当前用户名
      this.currentName = e.username;
      //请求所有的角色
      const res1 = await this.$http.get('roles')
      // console.log(res1)
      this.AlluserRole = res1.data.data
      //根据用户id查找角色请求
      const res = await this.$http.get(`users/${e.id}`)
      // console.log(res)
       this.rid = res.data.data.rid
    },
    //更改角色
    async RoleUserChange() {
       const res = await this.$http.put(`users/${this.currentId}/role`,{
         rid:this.rid
       })
       this.dialogFormVisibles = false
      
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