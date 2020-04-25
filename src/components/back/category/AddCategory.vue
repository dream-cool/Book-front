<template>
  <div class="content">
    <el-dialog :lock-scroll="false"
      title="新增类别"
      :visible.sync="dialog.dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form label-width="100px">
        <el-form-item label="选择父类" >
          <el-cascader 
                  :options="categoryList"
                  :props="optionProps"
                  :show-all-levels="false"
                  placeholder="搜索"
                  :filterable="true"
                  change-on-select
                  @change="handleChange">
            </el-cascader>
        </el-form-item>
        <el-form-item label="类别名称">
          <el-input  v-model="category.title" placeholder="请输入类别名称" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="排序号">
          <el-input-number  v-model="category.sort" style="width: 150px"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">新增</el-button>
          <el-button type="primary" @click="dialog.dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: ['dialog'],
  data () {
    return {
      categoryList: [
      ],
      optionProps: {
        value: 'id',
        label: 'title',
      },
      none: {
        id: '',
        title: '无',
        children: []
      },
      category: {
        pid: '',
        id: '',
        sort: 1,
        title: ''
      }
    }
  },

  created () {
    this.getAllCategory()
  },

  methods: {
    getAllCategory () {
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
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children)
        }
      }
      return data
    },
    handleChange (value) {
      this.category.pid = value[value.length - 1]
    },
    submit () {
      if (this.category.title == null || this.category.title == '') {
        this.$message.error('请输入类别名称')
        return false
      }
      axios.post('/type', this.category).then(res => {
        if (res.data.code === 200) {
          this.$message(res.data.message)
          this.getAllCategory()
          this.dialog.dialogVisible=false
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
