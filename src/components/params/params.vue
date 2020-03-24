<template>
    <el-card>
        <!-- 1， 导航栏 -->
     <div slot="header" class="clearfix">
      <Mylist listname1='商品管理' listname2='分类参数'/>
     </div>
     <el-alert
       title="只允许为第三方设置参数"
       type="error">
     </el-alert>
      <!-- 级联选择器 -->
       <el-form  label-position="left" label-width="80px" style="margin-top:20px">
       <el-form-item label="商品名称">
            <el-cascader
               clearable
               v-model="value"
               :options="options"
               :props="cascaderProps"
               @change="handleChange"></el-cascader>
            </el-cascader>  
        </el-form-item>
        </el-form>
        <!-- tab选项 -->
         <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
           <el-tab-pane label="动态参数" name="1">
            <el-button type="danger">设置动态参数</el-button>
            <!-- 表格 --> 
            <el-table :data="checkList" style="width: 100%">
            <el-table-column type="expand" label='#' width="80px">
                <template slot-scope="scope">
                     <el-tag
                        :key="tag"
                        v-for="(tag,i) in scope.row.attr_vals"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(scope.row,i)">
                        {{tag}}
                      </el-tag>
                      <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"  
                      >
                       </el-input>
                       <el-button v-else class="button-new-tag"
                                  size="small"
                                  @click="showInput"
                                  >+ New Tag</el-button>
                </template>
            </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作" prop="name">
            <template slot-scope="scope">
               <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
               <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
            </template>
            </el-table-column>
           </el-table>
           <!-- ---------------------------- -->
           </el-tab-pane>
           <el-tab-pane label="静态参数" name="2">
            <el-button type="danger">设置静态参数</el-button>
                <!-- 表格 --> 
            <el-table :data="onlyArrData" style="width: 100%">
            <el-table-column label='#' type='index' width="80px">
             </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="属性值" prop="attr_vals">
            </el-table-column>
            <el-table-column label="操作" prop="name">
              <template slot-scope="scope">
               <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
               <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
              </template>
            </el-table-column>
           </el-table>
           <!-- ---------------------------- -->

           </el-tab-pane>
         </el-tabs>
    </el-card>
</template>

<script>
    export default {
        data() {
            return {
                options:[],
                value:[],
                cascaderProps:{
                    expandTrigger: 'hover',
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children'
                },
                checkList:[],
                activeName:'1',
                inputVisible: false,
                inputValue: '',
                onlyArrData:[]
                

            }
        },

        methods:{
            //级联选择器触发事件
          async  handleChange() {
                  //请求动态参数
                  if(this.value.length === 3) {
                         const res = await this.$http.get(`categories/${this.value[2]}/attributes?sel=many`)
                          this.checkList = res.data.data
                          this.checkList.forEach(item => {
                          item.attr_vals =  
                          item.attr_vals.length === 0 ?[]
                           : item.attr_vals.trim().split(',')
                        });

                         const res2 = await this.$http.get(`categories/${this.value[2]}/attributes?sel=only`)
                        //  console.log(res)
                         this.onlyArrData = res2.data.data
                         
                   }
            },
            async  getGoodslist() {
              const res = await this.$http.get('categories')
              this.options = res.data.data
            },
            handleClick() {
                console.log('111')
            },
            //点击x移除
          async  handleClose(v,i){
                 v.attr_vals.splice(i, 1);
                 //发送请求
                //  categories/:id/attributes/:attrId
                //   attr_name   attr_sel  attr_vals
                const res = await this.$http.put(`categories/${this.value[2]}/attributes/${v.attr_id}`,{
                    attr_name:v.attr_name,
                    attr_sel:'many',
                    attr_vals:v.attr_vals.join(',')

                })
                
                
            },
         async   handleInputConfirm(v) {
                // this.checkList.attr_vals.push(this.inputValue)
                 let inputValue = this.inputValue;
                 if (inputValue) {
                   v.attr_vals.push(inputValue);
                   //添加参数网络请求
                    const res = await this.$http.put(`categories/${this.value[2]}/attributes/${v.attr_id}`,{
                    attr_name:v.attr_name,
                    attr_sel:'many',
                    attr_vals:v.attr_vals.join(',')
                    })
                    console.log(res)

                  }
                 this.inputVisible = false;
                 this.inputValue = '';
                    },
             showInput() {
                this.inputVisible = true
                this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
        });
            }
        },
        created() {
            this.getGoodslist()
        }
    }
</script>

<style>
 .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
    
</style>