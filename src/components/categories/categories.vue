<template>
  <el-card>
    <!-- 1， 导航栏 -->
    <div slot="header" class="clearfix">
      <Mylist listname1="商品管理" listname2="商品分类" />
    </div>
    <el-button type="success" @click="addCategories">添加分类</el-button>
    <el-table :data="categories"  style="width: 100%">
      <!-- <el-table-column prop="cat_name" label="分类名称"></el-table-column> -->
      <el-tree-grid
       prop='cat_name'
       label='分类名称'
       treeKey='cat_id'
       parentKey='cat_pid'
       levelKey='cat_level'
       chiidKey='children'
      >

      </el-tree-grid>
      <el-table-column label="级别">
          <template slot-scope="scope">
             <span v-if="scope.row.cat_level == 0">一级</span>
             <span v-if="scope.row.cat_level == 1">二级</span>
             <span v-if="scope.row.cat_level == 2">三级</span>

          </template>
      </el-table-column>
      <el-table-column label="是否有效">
          <template slot-scope="scope">
             <span v-if="scope.row.cat_deleted === true">有</span>
             <span v-if="scope.row.cat_deleted === false">无</span>
             

          </template>
         
      </el-table-column>
      <el-table-column  label="操作">
          <template slot-scope="scope">
           <el-button  size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
           <el-button @click="deleteCategories(scope.row)"  size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
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
        title="添加分类"
        :visible.sync="dialogVisible"
        width="50%"
        >
      <el-form :model="form">
           <el-form-item label="分类名称" label-width="100px">
               <el-input clearable v-model="form.cat_name" autocomplete="off"></el-input>
           </el-form-item>
           <el-form-item label="分类" label-width="100px">
            <el-cascader
               clearable
               v-model="form.value"
               :options="options"
               :props="cascaderProps"
               @change="handleChange"></el-cascader>
            </el-cascader>  
        </el-form-item>
       </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="clickAdd">确 定</el-button>
      </span>
      </el-dialog>
  </el-card>
</template>

<script>
var ElTreeGrid = require('element-tree-grid')
export default {
  components:{
     ElTreeGrid
  },
  data() {
    return {
      categories: [],
      pagenum:1,
      pagesize:4,
      total:0,
      dialogVisible:false,
      value:[],
      form:{
         cat_name:'',
         cat_level:0,
         cat_pid:0
      },
      options:[],
      cascaderProps:{
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      }
    };
  },
  created() {
    this.getcategoriesList();
  },
  methods: {
    async getcategoriesList() {
      const res = await this.$http.get(`categories?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
            const {data,meta} = res.data
            this.categories = data.result
            // console.log(res)
             
             this.total = data.total
    },
    handleSizeChange(e) {
      this.pagesize = e
      this.pagenum = 1;
      this.getcategoriesList();
    },
    handleCurrentChange(e) {
      this.pagenum = e
      this.getcategoriesList();
    },
    //添加分类
  async  addCategories() {
       this.dialogVisible = true
       const res = await this.$http.get(`categories?type=2`)
        this.options = res.data.data
    },
    async clickAdd() {
      this.dialogVisible = false
       if(this.value.length === 0) {
           this.form.cat_pid = 0;
           this.form.cat_level = 0
          }else if(this.value.length === 1) {
             this.form.cat_pid = this.value[0];
             this.form.cat_level = 1
          }else if(this.value.length === 2) {
             this.form.cat_pid = this.value[1];
             this.form.cat_level = 2
          }
       
      const res = await this.$http.post('categories',this.form)
      this.getcategoriesList();
      this.form = {}

    },
    handleClose() {
      // console.log('qqq')
    },
    handleChange() {
      // console.log(this.value)
    },
    async deleteCategories(e) {
        // console.log(e.cat_id)
        const res = await this.$http.delete(`categories/${e.cat_id}`)
           let {data,meta} = res.data
           if(meta.status === 200){
              this.$message.success(meta.msg);
              this.getcategoriesList();
           }
    }
  }
};
</script>

<style>
</style>