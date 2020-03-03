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
          <el-form-item label="书籍状态">
            <el-select v-model="borrowing.borrowingStatus" placeholder="书籍状态">
              <el-option
                v-for="item in borrowingStatusInfo.list"
                :key="item.code"
                :label="item.message"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间早于">
              <el-form-item prop="applicationTime">
                <el-date-picker
                 value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
                 type="date" placeholder="选择日期" v-model="borrowing.applicationTime" ></el-date-picker>
              </el-form-item>
          </el-form-item>
          <el-form-item label="处理时间早于">
              <el-form-item prop="handleTime">
                <el-date-picker
                 value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
                 type="date" placeholder="选择日期" v-model="borrowing.handleTime" ></el-date-picker>
              </el-form-item>
          </el-form-item>
          <el-form-item label="归还时间早于">
              <el-form-item prop="returnTime">
                <el-date-picker
                value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
                type="date" placeholder="选择日期" v-model="borrowing.returnTime" ></el-date-picker>
              </el-form-item>
          </el-form-item>
          <div class="operation" style="float:right; margin-right: 10%;">
            <el-button type="primary" @click="search()">搜索</el-button>
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
            prop="borrowingStatus"
            :formatter="borrowingSatatusFormatter"
            label="状态"
            width="120">
          </el-table-column>
          <el-table-column
            prop="applicationTime"
            label="申请时间"
            width="220">
          </el-table-column>
          <el-table-column
            prop="handleTime"
            label="处理时间"
            width="220">
          </el-table-column>
          <el-table-column
            prop="returnTime"
            label="归还时间"
            width="220">
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
import moment from 'moment'
export default {
  data () {
    return {
      borrowingList: [],
      borrowing: {},
      pageNum: 1,
      pageSize: 10,
      total: 0,
      borrowingStatusInfo: {
        list: [],
        obj: {}
      }
    }
  },
  created () {
    this.getBorrowingInfo(this.pageNum, this.pageSize, this.borrowing)
    this.getBorrowingStatusInfo()
  },
  methods: {
    handleSizeChange () {

    },
    handleCurrentChange () {

    },
    search () {
      this.getBorrowingInfo(this.pageNum, this.pageSize, this.borrowing)
    },
    resetForm () {
      this.borrowing = {
        bookName: null,
        userName: null,
        applicationTime: null,
        handleTime: null,
        borrowingTime: null,
        returnTime: null,
        borrowingStatus: null
      }
      this.search()
    },
    getBorrowingInfo (pageNum, pageSize, borrowing) {
      axios.post(
        '/borrowing/all?pageNum=' + pageNum + '&pageSize=' + pageSize, borrowing
      ).then(res => {
        if (res.data.code === 200) {
          this.borrowingList = res.data.data.list
          this.pageNum = res.data.data.pageNum
          this.total = res.data.data.total
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getBorrowingStatusInfo () {
      axios('/borrowing/get/borrowingStatus').then(res => {
        if (res.data.code === 200) {
          this.borrowingStatusInfo = res.data.data
          var obj = {code: null, message: '所有'}
          this.borrowingStatusInfo.list.push(obj)
          this.borrowing.borrowingStatus = null
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    borrowingSatatusFormatter (row, column, cellValue, index) {
      return this.borrowingStatusInfo.obj[row.borrowingStatus]
    }
  }
}
</script>

<style scoped>

</style>
