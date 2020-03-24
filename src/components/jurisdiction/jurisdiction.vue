<template>
  <div>
    <el-card class="box-card">
      <Mylist listname1="权限管理" listname2="权限列表" />
      <!-- 表格 -->
      <el-table class="rightsList" :data="rightsList" border style="width: 100%" height="500">
        <el-table-column type="index" label="#" width="60"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
        <el-table-column prop="path" label="路径" width="180"></el-table-column>
        <el-table-column label="层级">
           <template slot-scope="scope">
               <span v-if="scope.row.level == 0">一级</span>
               <span v-if="scope.row.level == 1">二级</span>
               <span v-if="scope.row.level == 2">三级</span>
               
           </template>
        </el-table-column>
      </el-table>
     
    </el-card>
  </div>
</template>

<script>
export default {
    data() {
        return {
           rightsList:[]
        }
    },
  created() {
    this.getuserrights();
  },
  methods: {
    async getuserrights() {
      let res = await this.$http.get("rights/list");
       this.rightsList = res.data.data
    //    console.log(res)
    }
  }
};
</script>

<style lang="less" scoped>
  .rightsList {
      margin-top: 20px;
  }
</style>