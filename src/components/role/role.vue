<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <Mylist listname1="权限列表" listname2="角色列表" />
    </div>
    <el-row>
      <el-col>
        <el-button @click="addRole" type="info">添加</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%" height="300">
      <el-table-column type="expand" width="150">
        <template slot-scope="scope">
          <el-row v-for="(item1,index) in scope.row.children" :key="index">
            <el-col :span="4">
              <el-tag
                @close="deleteRights(scope.row,item1.id)"
                type="success"
                closable
              >{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2,index) in item1.children" :key="index">
                <el-col :span="4">
                  <el-tag
                    @close="deleteRights(scope.row,item2.id)"
                    type="info"
                    closable
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="deleteRights(scope.row,item3.id)"
                    type="warning"
                    closable
                    v-for="(item3,index) in item2.children"
                    :key="index"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <span v-if="scope.row.children.length == 0">未分配权限</span>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
          <el-button
            size="mini"
            @click="showTree(scope.row)"
            plain
            type="success"
            icon="el-icon-check"
            circle
          ></el-button>
          <el-button
            size="mini"
            @click="deleterole(scope.row)"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 树形结构弹框 -->
    <el-dialog title="提示" :visible.sync="dialogVisibletree">
      <!-- 树形结构 -->
      <el-tree
        ref="tree"
        :data="treeData"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkeds"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibletree = false">取 消</el-button>
        <el-button type="primary" @click="setroleright">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加角色的对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleadd">
      <el-form :model="formUser">
        <el-form-item label="角色名称" label-width="100px">
          <el-input clearable v-model="formUser.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px">
          <el-input clearable v-model="formUser.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleadd = false">取 消</el-button>
        <el-button type="primary" @click="clickAddUser">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      dialogVisibletree: false,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      checkeds: [],
      currentID: -1,
      dialogFormVisibleadd: false,
      formUser: {
        roleName: "",
        roleDesc: ""
      }
    };
  },
  created() {
    this.getUserRole();
  },
  methods: {
    //添加角色
    addRole() {
      this.dialogFormVisibleadd = true;
    },
    async clickAddUser() {
      const res = await this.$http.post("roles", this.formUser);
      console.log(res);
      const { data, meta } = res.data;
      if (meta.status === 201) {
        this.getUserRole();
        this.$message.success(meta.msg);
        this.dialogFormVisibleadd = false;
        this.formUser = {};
      } else {
        this.$message.warning(meta.msg);
      }
    },
    //删除角色
    deleterole(e) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`roles/${e.id}`);
          if (res.data.meta.status == 200) {
            this.getUserRole();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //角色授权
    async setroleright() {
      // 请求路径：roles/:roleId/rights
      let arr1 = this.$refs.tree.getCheckedKeys();
      let arr2 = this.$refs.tree.getHalfCheckedKeys();
      let arr = [...arr1, ...arr2];
      const roleId = this.currentID;
      const res = await this.$http.post(`roles/${roleId}/rights`, {
        rids: arr.join(",")
      });
      this.getUserRole();
      this.dialogVisibletree = false;
    },
    //显示树形结构
    async showTree(e) {
      this.currentID = e.id;
      const res = await this.$http.get("rights/tree");
      // console.log(res)
      this.treeData = res.data.data;
      this.dialogVisibletree = true;
      const listId = [];
      e.children.forEach(item => {
        item.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            listId.push(item3.id);
          });
        });
      });
      this.checkeds = listId;
    },
    async getUserRole() {
      const res = await this.$http.get("roles");
      this.tableData = res.data.data;
    },
    async deleteRights(role, rightId) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      console.log(res);
      if (res.data.meta.status == 200) {
        this.$message.success(res.data.meta.msg);
        role.children = res.data.data;
      }
    }
  }
};
</script>

<style>
</style>