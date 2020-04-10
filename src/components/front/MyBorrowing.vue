<template>
  <div class="hello" >
    <el-tabs type="border-card"  v-model="active"
        @tab-click="handleTabChange">
        <el-tab-pane v-for="(item,index) in borrowingGroup" :key="index"
            :label="item.name" :name="item.name">
          <el-timeline >
                <el-timeline-item placement="top"
                    v-for="(userBorrowingList,index) in userBorrowingInfoGroupTime"
                    :key="index"
                    :timestamp="index"
                    >
                    <el-card>
                      <el-row :gutter="20" bodar style="margin-top: -30px">
                        <el-col :span="4" v-for="(userBorrowing,index) in userBorrowingList" :key="index"  >
                            <el-card :body-style="{ padding: '0px' }" style="width: 220px">
                              <el-image v-if="userBorrowing.bookImg != null"  style="margin-left: 20px"
                                :src='Sever_URL+"/download/"+userBorrowing.bookImg'
                                @click="goToBookDetail(userBorrowing.bookId)"
                                ></el-image>
                              <div style="padding-left: 20px;padding-right: 20px;">
                                <p style="color: #000;font-size: 14px;font-weight: bold  " >  {{userBorrowing.bookName}}  </p>
                                <p style="font-size: 14px;color: #AEA7A7">{{userBorrowing.applicationTime}}  </p>

                                <el-link @click="handleQueryBorrowingDetail(userBorrowing.borrowingId)" type="primary" :underline="false"> 详情</el-link>
                                <el-link v-if="userBorrowing.borrowingStatus == '申请中'" @click="cancelBorrowing(userBorrowing)" :underline="false" type="primary"> 取消申请</el-link>
                                <p style="font-size: 14px;color: #AEA7A7;margin-top: 0px;float:right"> {{ userBorrowing.borrowingStatus }} </p>
                              </div>
                            </el-card>
                        </el-col>
                      </el-row>
                    </el-card>
                </el-timeline-item>
                <!-- <el-link @click="loadMore" v-if="messageList.length < total" type="primary">加载更多</el-link>
                <p v-if="messageList.length == total">我也是有底线的</p> -->
            </el-timeline>
            </el-tab-pane>
      </el-tabs>

            <div class="borrowing-detail">
                <el-dialog title="借阅流程" :visible.sync="dialogFormVisible" >
                    <el-timeline style="width:700px">
                        <el-timeline-item v-if="borrowingDetail.returnOperator != null" :timestamp="borrowingDetail.returnTime" placement="top">
                          <el-card>
                            <h4>归还书籍</h4>
                            <p>管理员{{borrowingDetail.returnOperator}} 于 {{borrowingDetail.returnTime}}
                              处理了用户 {{borrowingDetail.userName}} 归还 {{borrowingDetail.bookName}}书籍，
                              书籍编号为 {{borrowingDetail.bookId}}</p>
                            <p v-if="borrowingDetail.borrowingStatus == '5'">逾期归还, 逾期 {{borrowingDetail.overdueDays}} 天</p>
                            <p v-if="borrowingDetail.borrowingStatus == '6'"> 正常归还</p>
                          </el-card>
                        </el-timeline-item>
                        <el-timeline-item v-if="borrowingDetail.handleTime != null && borrowingDetail.handleTime != undefined" :timestamp="borrowingDetail.handleTime" placement="top">
                          <el-card >
                            <h4>处理借阅</h4>
                            <p>管理员 {{borrowingDetail.borrowingOperator}} 于 {{borrowingDetail.handleTime}} 进行处理 </p>
                            <p v-if="borrowingDetail.note == null">同意借阅</p>
                              <p v-if="borrowingDetail.note != null">已驳回，驳回理由：{{borrowingDetail.note}}</p>
                          </el-card>
                        </el-timeline-item>
                        <el-timeline-item v-if="borrowingDetail.cancelTime != null && borrowingDetail.cancelTime != undefined" :timestamp="borrowingDetail.cancelTime" placement="top">
                          <el-card >
                            <h4>取消借阅</h4>
                            <p>用户 {{borrowingDetail.userName}} 于 {{borrowingDetail.cancelTime}} 取消了申请 </p>
                          </el-card>
                        </el-timeline-item>
                        <el-timeline-item :timestamp="borrowingDetail.applicationTime" placement="top">
                          <el-card>
                            <h4>申请借阅</h4>
                            <p>用户 {{borrowingDetail.userName}} 于 {{borrowingDetail.applicationTime}} 发起申请,
                            借阅书籍 {{borrowingDetail.bookName}} ,从 {{borrowingDetail.borrowingTime}} 开始借阅,
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
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'Hello',
  data () {
    return {
      Sever_URL: axios.defaults.baseURL,
      pageNum: 1,
      pageSize: 30,
      total: 0,
      userBorrowingInfoGroupTime: [],
      user: {},
      dialogFormVisible: false,
      borrowingDetail: {},
      active: '借阅中',
      borrowingGroup: [{name: '全部'}, {name: '申请中'}, {name: '已取消'}, {name: '借阅中'}],
      borrowingStatusInfo: {}
    }
  },
  created () {
    this.user = JSON.parse(window.localStorage.getItem('userDetail'))
    this.getBorrowingStatusInfo()
    this.getUserBorrowingInfoGroupTime(this.user.userId, '3')
  },
  methods: {
    handleTabChange () {
      if (this.active == '全部') {
        this.getUserBorrowingInfoGroupTime(this.user.userId, null)
      }
      if (this.active == '已取消') {
        debugger
        this.getUserBorrowingInfoGroupTime(this.user.userId, '0')
      }
      if (this.active == '申请中') {
        this.getUserBorrowingInfoGroupTime(this.user.userId, '1')
      }
      if (this.active == '借阅中') {
        this.getUserBorrowingInfoGroupTime(this.user.userId, '3')
      }
    },
    handleQueryBorrowingDetail (borrowingId) {
      axios.get(
        '/borrowing/' + borrowingId
      ).then(res => {
        if (res.data.code === 200) {
          this.borrowingDetail = res.data.data
          console.log(this.borrowingDetail.returnTime)
        } else {
          this.$message.error(res.data.message)
        }
      })
      this.dialogFormVisible = true
    },
    getBorrowingStatusInfo () {
      axios('/borrowing/get/borrowingStatus').then(res => {
        if (res.data.code === 200) {
          this.borrowingStatusInfo = res.data.data.obj
          this.checkOverdue()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getUserBorrowingInfoGroupTime (userId, borrowingStatus) {
      axios.post(
        '/borrowing/userBorrowingInfo', {userId: userId, borrowingStatus: borrowingStatus}
      ).then(res => {
        if (res.data.code === 200) {
          this.userBorrowingInfoGroupTime = res.data.data
          this.checkOverdue()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    cancelBorrowing (borrowing) {
      this.$confirm('取消申请将扣除10点信誉分，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (borrowing.borrowingStatus != '1') {
          this.$message.error('取消失败, 该书籍已不在申请列表')
          return
        }
        axios.get(
          '/borrowing/cancelApplying/' + borrowing.borrowingId
        ).then(res => {
          if (res.data.code === 200) {
            this.getUserBorrowingInfoGroupTime(this.user.userId, '1')
            this.$message(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        })
      }).catch(() => {

      })
    },
    checkOverdue () {
      if (this.userBorrowingInfoGroupTime != null && this.userBorrowingInfoGroupTime != undefined) {
        for (let key in this.userBorrowingInfoGroupTime) {
          var userBorrowingList = this.userBorrowingInfoGroupTime[key]
          userBorrowingList.forEach(borrowingResult => {
            if (borrowingResult.borrowingStatus == '3') {
              borrowingResult.borrowingStatus = '借阅中'
            } else {
              borrowingResult.borrowingStatus = this.borrowingStatusInfo[borrowingResult.borrowingStatus]
            }
            if (borrowingResult.overdueDays > 0) {
              this.$notify({
                title: '归还书籍',
                message: '您借阅的书籍《' + borrowingResult.bookName + '》已逾期' + borrowingResult.overdueDays + '天，已扣除' + borrowingResult.overdueDays + '点信誉分，请及时归还',
                type: 'warning',
                duration: 0
              })
            }
          })
        }
      }
    },
    goToBookDetail (bookId) {
      document.body.style.overflow = null
      this.$router.push({path: '/front/bookDetail/' + bookId})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >

.el-col{
  margin-top: 5%;
  margin-left: 5%;
}
.el-row{
  margin-left: 5%;
}
.el-image{
  width: 180px;
  height: 180px;
}

.el-tabs{
  height: 100%;
}

.el-tabs__item  is-left{
  height: 200px;
}

</style>
