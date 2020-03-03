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
                placeholder="默认为无                   搜索："
                :filterable="true"
                change-on-select
                @change="handleChange">
          </el-cascader>
          <el-input v-if="active == 1"  v-model="category.title" placeholder="请输入类别名称"></el-input>
          <el-button v-if="active == 2" type="primary" @click="submit">提交</el-button>
      </div>
      <div class="button">      
        <el-button style="position:fixed;right:0; margin-right:55%;" v-if="active > 0"  @click="last">上一步</el-button>            
        <el-button style="position:fixed;left:0; margin-left:55%;" v-if="active < 2"  @click="next">下一步</el-button>    
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
          this.categoryList = this.getTreeData(this.categoryList)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getTreeData (data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].child.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].child = undefined
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].child)
        }
      }
      return data
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
      if (this.category.title == null || this.category.title == ''){
        this.$message.error("请输入类别名称")
        return false;
      }
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
