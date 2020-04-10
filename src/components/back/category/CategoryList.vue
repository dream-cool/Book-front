<template>
  <div class="content">
       <el-table
          :data="categoryPage.list"
          style="width: 100%">
          <el-table-column
            label="类别ID"
            width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="类别名称"
            width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="父类名称"
            width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.pname }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="级别"
            width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.level }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            width="300">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="pageNum"
              :page-size="categoryPage.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="categoryPage.total">
            </el-pagination>
          </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      categoryPage: {
        pageSize: 10
      },
      pageNum: 1
    }
  },
  created () {
    this.getAllCategoryInfo(this.pageNum, this.categoryPage.pageSize)
  },
  methods: {
    handleEdit (index, row) {
      this.$prompt('请新的输入类别名称', row.title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '类别名称不能为空'
      }).then(({ value }) => {
        row.title = value
        axios.put('/type', row).then(res => {
          if (res.data.code === 200) {
            this.$message(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    handleDelete (index, row) {
      this.$confirm('确认删除？')
        .then(_ => {
          axios.delete('/type/' + row.id).then(res => {
            if (res.data.code === 200) {
              this.$message(res.data.message)
            } else {
              this.$message.error(res.data.message)
            }
          })
        })
        .catch(_ => {})
    },
    handleSizeChange (val) {

    },
    handleCurrentChange (pageNum) {
      this.getAllCategoryInfo(pageNum, this.categoryPage.pageSize)
    },
    getAllCategoryInfo (pageNum, pageSize) {
      axios.get('/type?pageNum=' + pageNum + '&pageSize=' + pageSize)
        .then(res => {
          if (res.data.code === 200) {
            this.categoryPage = res.data.data
            this.pageNum = res.data.data.pageNum
          } else {
            this.$message.error(res.data.message)
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
