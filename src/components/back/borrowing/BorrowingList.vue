<template>
<div class="content">
   <div class="borrowingDetail">
        <el-dialog  :lock-scroll="false" title="借阅流程" :visible.sync="dialogFormVisible" >
           <el-timeline style="width:700px">
              <el-timeline-item v-if="borrowingDetail.returnOperator != null" :timestamp="borrowingDetail.returnTime" placement="top">
                <el-card>
                  <h4>归还书籍</h4>
                  <p>管理员{{borrowingDetail.returnOperator}} 于 {{borrowingDetail.returnTime}}
                    处理了用户 {{borrowingDetail.userName}} 归还 《 {{borrowingDetail.bookName}} 》书籍，
                    书籍编号为 {{borrowingDetail.bookId}}</p>
                  <p v-if="borrowingDetail.borrowingStatus == '5'">逾期归还, 逾期 {{borrowingDetail.overdueDays}} 天</p>
                  <p v-if="borrowingDetail.borrowingStatus == '6'"> 正常归还</p>
                </el-card>
              </el-timeline-item>
              <el-timeline-item v-if="borrowingDetail.handleTime != null && borrowingDetail.handleTime != undefined" :timestamp="borrowingDetail.handleTime" placement="top">
                <el-card>
                  <h4>处理借阅</h4>
                  <p>管理员 {{borrowingDetail.borrowingOperator}} 于 {{borrowingDetail.handleTime}} 进行处理 </p>
                   <p v-if="borrowingDetail.note == null">同意借阅</p>
                    <p v-if="borrowingDetail.note != null">已驳回，驳回理由：{{borrowingDetail.note}}</p>
                </el-card>
              </el-timeline-item>
              <el-timeline-item v-if="borrowingDetail.cancelTime != null" :timestamp="borrowingDetail.cancelTime" placement="top">
                <el-card>
                  <h4>取消借阅</h4>
                  <p>用户 {{borrowingDetail.userName}} 于 {{borrowingDetail.cancelTime}} 取消了,
                  借阅 《 {{borrowingDetail.bookName}} 》 书籍的申请。
                  </p>
                </el-card>
              </el-timeline-item>
              <el-timeline-item :timestamp="borrowingDetail.applicationTime" placement="top">
                <el-card>
                  <h4>申请借阅</h4>
                  <p>用户 {{borrowingDetail.userName}} 于 {{borrowingDetail.applicationTime}} 发起申请,
                  借阅书籍 《 {{borrowingDetail.bookName}} 》,从 {{borrowingDetail.borrowingTime}} 开始借阅,
                    借阅{{borrowingDetail.duration}}天。
                  </p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div>
        </el-dialog>
    </div>

  <el-container>
          <el-form :model="borrowing" :inline="true"  label-width="100px" class="demo-form-inline">
          <el-form-item label="书籍名称">
            <el-input v-model="borrowing.bookName" placeholder="模糊查询书籍名称" ></el-input>
          </el-form-item>
          <el-form-item label="借阅人">
            <el-input v-model="borrowing.userName" placeholder="模糊查询借阅人"></el-input>
          </el-form-item>
          <el-form-item label="书籍状态">
            <el-select v-model="borrowing.borrowingStatus" clearable placeholder="全部">
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
          <el-form-item  style="margin-left: 100px;">
            <el-button type="primary" @click="search()" icon="el-icon-search"  >搜索</el-button>
            <el-button @click="resetForm()" type="info">重置</el-button>
          </el-form-item>          
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
            width="300">
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
            width="150">
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
            width="150">
          </el-table-column>
          <el-table-column
            prop="borrowingTime"
            label="借阅日期"
            width="100">
          </el-table-column>
          <el-table-column
            prop="duration"
            label="借阅时长"
            width="80">
          </el-table-column>
          <el-table-column
            prop="handleTime"
            label="处理时间"
            width="150">
          </el-table-column>
          <el-table-column
            prop="borrowingOperator"
            label="借阅处理人"
            width="130">
          </el-table-column>
          <el-table-column
            prop="returnTime"
            label="归还时间"
            width="150">
          </el-table-column>
          <el-table-column
            prop="returnOperator"
            label="归还处理人"
            width="130">
          </el-table-column>
          <el-table-column
            label="操作"
            width="120"
            >
            <template slot-scope="scope">
              <el-button @click="handleQuery(scope.row)"  type="info" icon="el-icon-view">查看流程</el-button>
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
      borrowingList: [],
      borrowing: {},
      pageNum: 1,
      pageSize: 10,
      total: 0,
      borrowingStatusInfo: {
        list: [],
        obj: {}
      },
      borrowingDetail: {},
      dialogFormVisible: false
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
    handleQuery (row) {
      axios.get(
        '/borrowing/' + row.borrowingId
      ).then(res => {
        if (res.data.code === 200) {
          this.borrowingDetail = res.data.data
          console.log(this.borrowingDetail.returnTime)
          // this.borrowingDetail.overdueDays =
        } else {
          this.$message.error(res.data.message)
        }
      })
      this.dialogFormVisible = true
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
