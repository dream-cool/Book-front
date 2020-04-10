<template>
  <div class="content">
      <el-dialog title="修改权限" style="margin-left: 20%;width: 60%" :visible.sync="dialogFormVisible">
        <el-form :model="user" label-width="120px" :inline="true"  class="demo-form-inline" >

          <el-form-item label="浏览书籍">
              <el-switch
                v-model="user.bookR"
                >
              </el-switch>
          </el-form-item>
          <el-form-item label="修改书籍">
              <el-switch
                v-model="user.bookW"
                >
              </el-switch>
          </el-form-item>
          <el-form-item label="浏览借阅">
              <el-switch
                v-model="user.borrowingR"
                >
              </el-switch>
          </el-form-item>
          <el-form-item label="处理借阅">
              <el-switch
                v-model="user.borrowingW"
                >
              </el-switch>
          </el-form-item>
          <el-form-item label="浏览用户">
              <el-switch
                v-model="user.userR"
                >
              </el-switch>
          </el-form-item>
          <el-form-item label="修改用户">
              <el-switch
                v-model="user.userW"
                >
              </el-switch>
          </el-form-item>
           <el-form-item label="查看统计">
              <el-switch
                v-model="user.statisticsR"
                >
              </el-switch>
          </el-form-item>
           <el-form-item label="修改类别">
              <el-switch
                v-model="user.categoryW"
                >
              </el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleCommit">确 定</el-button>
        </div>
      </el-dialog>
       <el-table
          border
          :highlight-current-row="true"
          :data="privilegePage.list"
          style="width: 100%">
          <el-table-column
            label="管理员姓名"
            width="150">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="查看书籍"
            align='center'
            width="100">
            <template slot-scope="scope">
              <i v-if="scope.row.bookR == 1" class="el-icon-check"></i>
            </template>
          </el-table-column>
          <el-table-column
            label="修改书籍"
            align='center'
            width="100">
            <template slot-scope="scope">
                <i v-if="scope.row.bookW == 1" class="el-icon-check"></i>
            </template>
          </el-table-column>
          <el-table-column
            label="查看用户"
            align='center'
            width="100">
            <template slot-scope="scope">
             <i v-if="scope.row.userR == 1" class="el-icon-check"></i>
            </template>
          </el-table-column>
          <el-table-column
            label="修改用户"
            align='center'
            width="100">
            <template slot-scope="scope">
              <i v-if="scope.row.userW == 1" class="el-icon-check"></i>
            </template>
          </el-table-column>
          <el-table-column
            label="查看借阅"
            align='center'
            width="100">
            <template slot-scope="scope">
              <i v-if="scope.row.borrowingR == 1" class="el-icon-check"></i>
            </template>
          </el-table-column>
          <el-table-column
            label="处理借阅"
            align='center'
            width="100">
            <template slot-scope="scope">
               <i v-if="scope.row.borrowingW == 1" class="el-icon-check"></i>
            </template>
          </el-table-column>
          <el-table-column
            label="修改类别"
            align='center'
            width="100">
            <template slot-scope="scope">
              <i v-if="scope.row.categoryW == 1" class="el-icon-check"></i>
            </template>
          </el-table-column>
          <el-table-column
            label="查看统计"
            align='center'
            width="100">
            <template slot-scope="scope">
               <i v-if="scope.row.statisticsR == 1" class="el-icon-check"></i>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="pageNum"
              :page-size="pageSize"
              layout="total, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      privilegePage: {
      },
      value1: true,
      value2: true,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      value: true,
      dialogFormVisible: false,
      user: {}
    }
  },
  created () {
    this.getAllUserPrivilegeInfo(this.pageNum, this.pageSize)
  },
  methods: {
    handleCommit () {
      this.dialogFormVisible = false
      axios.put('/permission', this.user).then(res => {
        if (res.data.code === 200) {
          this.user = res.data.data
          this.$message(res.data.message)
          this.getAllUserPrivilegeInfo(this.pageNum, this.pageSize)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    handleEdit (index, row) {
      this.dialogFormVisible = true
      axios.get('/permission/' + row.userId).then(res => {
        if (res.data.code === 200) {
          this.user = res.data.data
          console.log(this.user)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },

    handleSizeChange (val) {

    },
    handleCurrentChange (pageNum) {
      this.getAllUserPrivilegeInfo(pageNum, this.privilegePage.pageSize)
    },
    getAllUserPrivilegeInfo (pageNum, pageSize) {
      axios.get('/permission?pageNum=' + pageNum + '&pageSize=' + pageSize)
        .then(res => {
          if (res.data.code === 200) {
            this.privilegePage = res.data.data
            this.pageNum = res.data.data.pageNum
            this.pageSize = res.data.data.pageSize
            this.total = res.data.data.total
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
