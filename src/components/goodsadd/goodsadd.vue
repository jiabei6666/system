<template>
  <el-card>
    <!-- 1， 导航栏 -->
    <div slot="header" class="clearfix">
      <Mylist listname1='商品管理' listname2='商品列表'/>
    </div>
    <el-alert
    title="添加商品的信息"
    type="success"
    center
    show-icon>
  </el-alert>
  <el-steps style="margin-top:20px" :active="1*active" finish-status="success">
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>
  </el-steps>
  <div style="margin-top:20px"></div>
  <!-- 表单 -->
  <el-form  label-position="top" label-width="80px" :model="form">
    <el-tabs  v-model="active"  
             tab-position="left" 
             style="height: auto;"
             @tab-click='tabClick'>
      <el-tab-pane name="1" label="基本信息">
          <el-form-item label="名称">
              <el-input v-model="form.goods_name"></el-input>
           </el-form-item>
          <el-form-item label="价格">
              <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="重量">
              <el-input v-model="form.goods_weight"></el-input>  
          </el-form-item>  
          <el-form-item label="数量">
              <el-input v-model="form.goods_number"></el-input>  
          </el-form-item>  
          <el-form-item label="商品分类">
            
              <el-cascader
              clearable
               v-model="value"
               :options="options"
               :props="cascaderProps"
               @change="handleChange"></el-cascader>
               
              </el-cascader>  
             </el-form-item>  
      </el-tab-pane>
      <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item.attr_name" v-for="(item,index) in checkList" :key="index">

            <el-checkbox-group  v-model="item.attr_vals">
              <el-checkbox border :label="item2"
              v-for='(item2,i) in item.attr_vals' :key="i"
              ></el-checkbox>
             </el-checkbox-group>
              
           </el-form-item>
      </el-tab-pane>
      <el-tab-pane name="3" label="商品属性">
           <el-form-item :label="item.attr_name" v-for="(item,index) in onlyArrData" :key="index">
              <el-input v-model="item.attr_vals"></el-input>
           </el-form-item>
      </el-tab-pane>
      <el-tab-pane name="4" label="商品图片">
         <el-form-item>
              <el-upload
               action="http://47.105.168.115:8888/api/private/v1/upload"
               :on-preview="handlePreview"
               :on-remove="handleRemove"
               :on-success='handlesuccess'
               :headers='headers'
               list-type="picture">
               <el-button size="small" type="primary">点击上传</el-button>
               <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
             </el-upload>
         </el-form-item>  
        
      </el-tab-pane>
    <el-tab-pane name="5" label="商品内容">
         <el-form-item>
              <el-button type="primary"
                         @click="addGoods">添加商品</el-button> 
               <quillEditor v-model="form.goods_introduce"></quillEditor>
          </el-form-item>
          <!-- npm install vue-quill-editor --save  -->
    </el-tab-pane>
  </el-tabs>
 </el-form>
  
  </el-card>
</template>




<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
 
import { quillEditor } from 'vue-quill-editor'
  export default {
    components:{
        quillEditor
    },
    data() {
      return {
        active:'1',
        form:{
          goods_name:'',
          goods_price:'',
          goods_weight:'',
          goods_number:'',
          goods_introduce:'',
          goods_cat:'',
          pics:[],
          attrs:[]

        },
        //级联选择器数据
        value:[1,3,6],
        options:[],
        cascaderProps:{
          expandTrigger: 'hover',
          label: 'cat_name',
          value: 'cat_id',
          children: 'children'

        },
        checkList:[],
        onlyArrData:[],
        headers:{
          Authorization:localStorage.getItem('token')
        }
          
        

      }
    },
    created() {
          this.getGoodslist()
    },
    methods:{
      //级联选择器事件
        handleChange() {
          console.log(this.value)
        },
        //获取商品分类列表
      async  getGoodslist() {
              const res = await this.$http.get('categories')
              this.options = res.data.data
            },
      async  tabClick() {
           if(this.active === '2') {
             if(this.value.length !== 3){
                this.$message.warning('请选择三级分类')
                
                return
             }
             //获取参数数据
              const res = await this.$http.get(`categories/${this.value[2]}/attributes?sel=many`)
              // console.log(res)
               this.checkList = res.data.data
               this.checkList.forEach(item => {
               item.attr_vals =  
               item.attr_vals.length === 0 ?[]
                : item.attr_vals.trim().split(',')
             });
         
            }else if(this.active === '3'){
                 if(this.value.length !== 3){
                  this.$message.warning('请选择三级分类')
                  return
                 }
                 const res = await this.$http.get(`categories/${this.value[2]}/attributes?sel=only`)
                //  console.log(res)
                 this.onlyArrData = res.data.data
            }
           
           
        },
            //图片上传用到事件
        handlePreview(e) {
          //  console.log(e)
        },
        handleRemove(e) {
          //response.data.tmp_path
           let index = this.form.pics.findIndex(item=>{
              return  item.pics === e.response.data.tmp_path
           })
           this.form.pics.splice(index,1)
           
        },
        handlesuccess(e) {
          //上传成功临时路径
          //  data.tmp_path
          this.form.pics.push({
            'pic':e.data.tmp_path
          })
          
              
        },
        //添加商品
       async addGoods () {
           //处理添加的数据
            this.form.goods_cat = this.value.join(',')
            //处理动态商品参数的数组
            // console.log(this.checkList)
          let arr1 =  this.checkList.map(item=>{
              return {
                "attr_id":item.attr_id,
                "attr_value":item.attr_vals
              }
            })
          let arr2 =  this.onlyArrData.map(item=>{
              return {
                "attr_id":item.attr_id,
                "attr_value":item.attr_vals
              }
            })
            this.form.attrs.push(...arr1,...arr2)
            // console.log(this.form.attrs)
            const res = await this.$http.post('goods',this.form)
            console.log(res)
             const {data,meta} = res.data
             if(meta.status == 201) {
               this.$message.success(meta.msg);
               this.$router.push('goods')
             }else{
               this.$message.warning(meta.msg)
             }
                
            
          
        }
        
    }
    
  }
</script>

<style>
.ql-editor {
 min-height: 300px;
}
  
</style>