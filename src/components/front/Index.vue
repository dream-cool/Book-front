<template>
  <div class="hello" >
      <el-row :gutter="20" bodar>
        <el-col :span="3" v-for="(book,index) in bookList" :key="index" >  
            <el-card :body-style="{ padding: '0px' }" style="width: 220px">
              <el-image v-if="book.img != null"  style="margin-left: 20px"
                :src='"http://localhost:8090/download/"+book.img' 
                @click="goToBookDetail(book.bookId)"
                ></el-image>
              <div style="padding-left: 20px;padding-right: 20px;">
                <p style="color: #000;font-size: 14px;font-weight: bold margin-top: -20px; " >  {{book.bookName}}  </p>
                <p style="font-size: 14px;color: #AEA7A7;margin-top: -10px;float:left ">{{book.author}}</p>
                <p style="font-size: 14px;color: #AEA7A7;margin-top: -10px;float:right">借阅:100</p>
              </div>
            </el-card>
        </el-col>
      </el-row>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'Hello',
  data () {
    return {
      Sever_URL: 'localhost:8090/download/',
      bookList: [],
      pageNum: 1,
      pageSize: 30,
      total: 0,
      book: {},
      url: ''
    }
  },
  created() {
    this.getBookInfo(this.pageNum, this.pageSize, this.book)
  },
  methods: {
    goToBookDetail(bookId){
      document.body.style.overflow = null
      this.$router.push({path: '/front/bookDetail/'+bookId})
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
    },
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
}
</style>
