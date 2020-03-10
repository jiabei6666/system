<template>
  <div class="login">
    <el-form  label-position="top" 
              label-width="80px" 
              :model="formname"
              class="login-main"
              >
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formname.name"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formname.region"></el-input>
      </el-form-item>
      <el-button class="button" type="primary">登录</el-button>
    </el-form>
  </div>
</template>



<script>
export default {
  data() {
    return {
      formname: {}
    };
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