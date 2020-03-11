<template>
  <div class="login">
    <el-form  label-position="top" 
              label-width="80px" 
              :model="formname"
              class="login-main"
              >
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formname.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formname.password"></el-input>
      </el-form-item>
      <el-button class="button"
                 type="primary" 
                 @click.prevent="commitlogin"
                 >登录</el-button>
    </el-form>
  </div>
</template>



<script>
import { gethome } from 'network/home'
export default {
  data() {
    return {
      formname: {
          username:'admin',
          password:'123456'
      }
    }

  },
  created() {
    //   gethome().then(res=>{
    //       console.log(res)
    //   })
     
  },
  methods:{
      commitlogin() {
        this.$http.post('login',this.formname)
        .then(res=>{
          let {data,meta} = res.data
          if(meta.status == 200) {
            this.$message({
              showClose: true,
              message: meta.msg,
              type: 'success'
            })
            if(this.$router.push({name:'home'})){
              this.$message.close()
            }
              
            
          }else {
             this.$message({
              showClose: true,
              message: meta.msg,
              type: 'error'
            })
          }
        })
      }
  }
};
</script>


<style scoped>
.login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #324152;
  
}
.login .login-main {
  width: 400px;
  padding: 30px;
  border-radius: 5%;
  background-color: #fff;
}
.button {
  width: 100%;

}
</style>