<template>
  <div class="content">
  <el-container>
          <el-form :model="borrowing" :inline="true"  label-width="100px" class="demo-form-inline">
          <el-form-item label="书籍名称">
            <el-input v-model="borrowing.bookName" placeholder="模糊查询书籍名称" ></el-input>
          </el-form-item>
          <el-form-item label="借阅人">
            <el-input v-model="borrowing.userName" placeholder="模糊查询借阅人"></el-input>
          </el-form-item>
          <el-form-item label="借阅时长小于">
               <el-input-number v-model="borrowing.duration" controls-position="right"
                :min="1" :max="365"></el-input-number>
          </el-form-item>
          <el-form-item label="借阅时间早于">
              <el-form-item prop="borrowingTime">
                <el-date-picker
                 value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                 type="date" placeholder="选择日期" v-model="borrowing.borrowingTime" ></el-date-picker>
              </el-form-item>
          </el-form-item>
            <div class="operation" style="float:right; margin-right: 10%;">
              <el-button type="primary" @click="search()" icon="el-icon-search">搜索</el-button>
              <el-button @click="resetForm()">重置</el-button>
            </div>
        </el-form>
      </el-container>
      <el-table
          size="small"
          tooltip-effect="dark"
          :data="borrowingList"
          style="width: 100%">
          <el-table-column
             fixed
            label="书籍名称"
            width="310">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>书籍编号: {{ scope.row.bookId }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.bookName }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column
            label="借阅人"
            width="250">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>用户id: {{ scope.row.userId }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.userName }}</el-tag>
                </div>
               </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="borrowingTime"
            label="借阅时间"
            width="150">
          </el-table-column>
          <el-table-column
            label="借阅时长"
            width="100">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.duration }}天</span>
            </template>
          </el-table-column>

          <el-table-column
            label="逾期天数"
            width="100">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.overdueDays }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button type="success" @click="handleReturn(scope.row)">归还</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            background
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
import moment from 'moment'
export default {
  data () {
    return {
      value: 4.5,
      borrowingList: [],
      borrowing: {
        borrowingStatus: 3,
        duration: 365
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      borrowingStatusInfo: {
        list: [],
        obj: {}
      },
      user: {}
    }
  },
  created () {
    this.user = JSON.parse(window.localStorage.getItem('userDetail'))
    this.getBorrowingInfo(this.pageNum, this.pageSize, this.borrowing)
  },
  methods: {
    handleSizeChange () {
    },
    handleCurrentChange () {
    },
    handleReturn (row) {
      this.$confirm('确认归还？')
        .then(_ => {
          axios('/borrowing/handleReturn/' + row.borrowingId + '?userName='+this.user.userName)
            .then(res => {
              if (res.data.code === 200) {
                this.book = res.data.data
                this.$message(res.data.message)
                this.getBorrowingInfo(this.pageNum, this.pageSize, this.borrowing)
              } else {
                this.$message.error(res.data.message)
              }
            })
        })
        .catch(_ => {})
    },
    search () {
      this.getBorrowingInfo(this.pageNum, this.pageSize, this.borrowing)
    },
    resetForm () {
      this.borrowing = {
        bookName: null,
        userName: null,
        applicationTime: null,
        borrowingTime: null,
        borrowingStatus: 1,
        duration: 365
      }
      this.search()
    },
    getBorrowingInfo (pageNum, pageSize, borrowing) {
      axios.post(
        '/borrowing/all?pageNum=' + pageNum + '&pageSize=' + pageSize, borrowing
      ).then(res => {
        if (res.data.code === 200) {
          this.borrowingList = res.data.data.list
          console.log(this.borrowingList)
          this.pageNum = res.data.data.pageNum
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
