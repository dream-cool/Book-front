<template>
  <div class="hello" >
      <el-row>
        <el-input suffix-icon="el-icon-search" placeholder="搜索" 
        v-model="book.bookName" @input="getBookInfo(pageNum, pageSize, book)" > </el-input>
      </el-row>
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
                <p v-if="book.ebook == 0" style="font-size: 14px;color: #AEA7A7;margin-top: -10px;float:right">借阅: {{book.borrowingNumber}}</p>
              </div>
            </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-pagination
          style="margin-top: 30px"
          background
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-row>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'Hello',
  props: ['bookCondition'],
  data () {
    return {
      Sever_URL: axios.defaults.baseURL,
      bookList: [],
      pageNum: 1,
      pageSize: 30,
      total: 0,
      book: {
        ebook: 0,
        bookStatus: '0',
        bookName: null,
      },
      url: ''
    }
  },
  created () {
    if (this.bookCondition != null && this.bookCondition != 'undenfied') {
      this.book = this.bookCondition
    }
    console.log(this.bookCondition)
    this.getBookInfo(this.pageNum, this.pageSize, this.book)
  },
  methods: {
    goToBookDetail (bookId) {
      document.body.style.overflow = null
      this.$router.push({path: '/front/bookDetail/' + bookId})
    },
    handleCurrentChange (val) {
      this.getBookInfo(val, this.pageSize, this.book)
    },
    getBookInfo (pageNum, pageSize, book) {
      axios.post(
        '/book/all?pageNum=' + pageNum + '&pageSize=' + pageSize, book
      ).then(res => {
        if (res.data.code === 200) {
          this.bookList = res.data.data.list
          this.bookList.map(book => {
            book.inputTime = moment(book.inputTime).format('YYYY-MM-DD')
            return book
          })
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
.el-input{
  margin-top: 20px;
  width: 400px;
  border-style:solid;
  border-width:1px;
  border-color: #409EFF;
  border-top-left-radius:6px;
  border-top-right-radius: 6px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px
}
</style>
