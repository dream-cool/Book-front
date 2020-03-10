<template>
  <div class="hello">
      <el-row :gutter="20" bodar>
        <el-col :span="4" v-for="(book,index) in bookList" :key="index" > 
            {{book.bookName}}
             <el-image v-if="book.img != null" 
              :src="'http://localhost:8090/download/'+book.img" style="float:left"
              :href="'/back/book/bookDetail/'+book.bookId"
              ></el-image>
        </el-col>
         
      </el-row>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'HelloWorld',
  data () {
    return {
      Sever_URL: 'localhost:8090/download/',
      bookList: [],
      pageNum: 1,
      pageSize: 30,
      total: 0,
      book: {},
    }
  },
  created() {
    this.getBookInfo(this.pageNum, this.pageSize, this.book)
  },
  methods: {
    getBookInfo (pageNum, pageSize, book) {
      axios.post(
        '/book/all?pageNum=' + pageNum + '&pageSize=' + pageSize,
        book
      ).then(res => {
        if (res.data.code === 200) {
          this.bookList = res.data.data.list
          this.bookList.map(book => {
            book.inputTime = moment(book.inputTime).format('YYYY-MM-DD')
            return book
          })
          console.log(this.bookList)
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
  height: 300px;
  margin-left: 5%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
.el-row{
  margin-left: 5%;
}
.el-image{
  width: 185px;
  height: 250px;
}
</style>
