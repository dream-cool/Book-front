<template>
  <div class="content">
    <el-main>
      <el-steps :active="active" finish-status="success">
          <el-step title="选择父类"></el-step>
          <el-step title="填写类别名称"></el-step>
          <el-step title="提交"></el-step>
      </el-steps>
      <div class="step">
          <el-cascader v-if="active == 0"
                :options="categoryList"
                :props="optionProps"
                :show-all-levels="false"
                placeholder="搜索："
                :filterable="true"
                v-model="selectedOptions"
                change-on-select
                @change="handleChange">
          </el-cascader>
          <el-input v-if="active == 1"  v-model="category.title" placeholder="请输入类别名称"></el-input>
          <el-button v-if="active == 2" type="primary" @click="submit">提交</el-button>
      </div>
      <div class="button">      
        <el-button v-if="active > 0" style="margin-top: 12px;" @click="last">上一步</el-button>            
        <el-button v-if="active < 2" style="margin-top: 12px;" @click="next">下一步</el-button>    
      </div>            
    </el-main>     
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
      return {
        active: 0,
        categoryList:[
           
        ],

        optionProps: {
          value: 'id',
          label: 'title',
          children: 'child'
        },
        

        none: {
            id : '',
            title : '无',
            child: []
        },

        category: {
          pid: '',
          id: '',
          title: ''
        }

      }
  },

  created(){
    this.getAllCategory()
  },

  methods: {
    getAllCategory (){
       axios.get('/type/cascade').then(res => {
        if (res.data.code === 200) {
          this.categoryList = res.data.data
          this.categoryList.push(this.none)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },

    selectedOptions (){

    },

    handleChange (value){
      this.category.pid = value[value.length-1]
    },

    next () {
      this.active++ 
    },

    last () {
      this.active--
    },

    submit (){
      console.log(this.category)
      axios.post('/type', this.category).then(res => {
        if (res.data.code === 200) {
          this.$message(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  }
}
</script>

<style scoped>
.el-main{
  margin-left: 20%;
  margin-right: 20%
}

.step{
  margin-top: 10%;
  margin-left: 10%;
  height: 300px;
  width: 500px;
}

.button{
  position: absolute;
  margin-left: 20%;
}


</style>
