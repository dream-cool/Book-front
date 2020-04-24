<template>
  <div class="hello" >
      <el-row :gutter="20" bodar>
        <el-col :span="3" v-for="(book,index) in bookList" :key="index" >
            <el-card :body-style="{ padding: '0px' }" style="width: 220px">
              <el-image v-if="book.img != null"  style="margin-left: 20px"
                :src='Sever_URL + "/download/"+book.img'
                @click="goToBookDetail(book.bookId)"
                ></el-image>
              <div style="padding-left: 20px;padding-right: 20px;">
                <p style="color: #000;font-size: 14px;font-weight: bold margin-top: -20px; " >  {{book.bookName}}  </p>
                <p style="font-size: 14px;color: #AEA7A7;margin-top: -10px;float:left ">{{book.author}}</p>
                <p style="font-size: 14px;color: #AEA7A7;margin-top: -10px;float:right">浏览: {{book.totalBrowse}}</p>
              </div>
            </el-card>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-pagination
          style="margin-top: 30px"
          background
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-row> -->
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  data () {
    return {
      Sever_URL: axios.defaults.baseURL,
      bookList: [],
      pageNum: 1,
      pageSize: 30,
      total: 0,
      url: ''
    }
  },
  mounted () {
    window.addEventListener('scroll', this.scrollBottom)
  },
  created () {
    this.getBookInfo(this.pageNum, this.pageSize)
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollBottom)
  },
  methods: {
    scrollBottom () {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      if (scrollTop + windowHeight == scrollHeight) {
        this.pageNum = this.pageNum + 1
        this.getBookInfo(this.pageNum, this.pageSize, this.book)
      }
    },
    goToBookDetail (bookId) {
      document.body.style.overflow = null
      this.$router.push({path: '/front/bookDetail/' + bookId})
    },
    handleCurrentChange (val) {
      this.getBookInfo(val, this.pageSize)
    },
    getBookInfo (pageNum, pageSize) {
      axios.get(
        '/book/query/popularBook'
      ).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.list == null || res.data.data.list.length == 0) {
            this.$message('暂无数据')
          }
          if (res.data.data.pageNum != this.pageNum) {
            this.$message('没有更多了')
            return
          }
          this.bookList = this.bookList.concat(res.data.data.list)
          this.bookList.map(book => {
            book.inputTime = moment(book.inputTime).format('YYYY-MM-DD')
            return book
          })
        //   this.pageNum = res.data.data.pageNum
        //   this.total = res.data.data.total
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  border-radius:10px 10px;
}
</style>
