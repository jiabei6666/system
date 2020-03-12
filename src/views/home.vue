<template>
  <el-container class="content">
    <el-header class="header">
      <div class="header-item-left">
        <img src="~assets/logo.png" alt />
        <h3>电商后台管理系统</h3>
      </div>
      <div class="header-item-right">
        <el-button type="info" @click="outlogin">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside class="aside" width="210px">
        <!-- --------------------------- -->
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :router='true'
        >
          <!-- 1 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>

            <el-menu-item index="user">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 2-->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>

            <el-menu-item index="1-1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 3-->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>

            <el-menu-item index="1-1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 4-->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>

            <el-menu-item index="1-1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 5-->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>

            <el-menu-item index="1-1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
            </el-menu-item>
          </el-submenu>

          
        </el-menu>

        <!-- ---------------------------- -->
      </el-aside>

      <el-main class="main">
          <!-- 显示子路由 -->
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: true
      
    };
  },
  methods: {
      //退出登录
    outlogin () {
        //1，  清除token
          localStorage.clear()
        //2， 弹出提示框
        this.$message.success('退出成功')
        // 3，跳转登录页面 
        this.$router.push('/login')
          
      }
    
  },
  beforeCreate() {
      
     const token = localStorage.getItem('token')
      if(!token) {
          this.$router.push('/login')
      }
  }
};
</script>


<style lang="less" scoped>
.content {
  height: 100%;
}
.header {
  display: flex;
  background-color: #373f41;
  color: #fff;
  text-align: center;
  align-items: center;
  justify-content: space-between;
  .header-item-left {
    display: flex;
    align-items: center;
    img {
      height: 40px;
    }
  }
  .header-item-right {
    line-height: 40px;
  }
}

.aside {
  background-color: #333744;
}
.main {
  background-color: #eaedf1;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
</style>