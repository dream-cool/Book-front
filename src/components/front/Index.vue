<template>
  <div class="hello" >
    <el-form :model="book" :inline="true"  label-width="100px" class="demo-form-inline">
          <el-form-item label="书籍名称">
            <el-input suffix-icon="el-icon-search" placeholder="搜索"
               v-model="book.bookName" >
            </el-input>
          </el-form-item>

          <el-form-item label="价格大于" prop="price">
            <el-input-number v-model="book.price" controls-position="right"
                :min="0" :max="10000"></el-input-number>
          </el-form-item>

          <el-form-item label="点赞超过" prop="price">
            <el-input-number v-model="book.price" controls-position="right"
                :min="0" :max="10000"></el-input-number>
          </el-form-item>

          <el-form-item label="书籍分类" prop="category">
            <el-cascader
                  clearable
                  placeholder="全部"
                  v-model="category"
                  :options="categoryList"
                  :props="optionProps"
                  :show-all-levels="false"
                  change-on-select
                  @change="handleCategoryChange">
            </el-cascader>
          </el-form-item>

          <el-form-item label="录入日期早于">
              <el-form-item prop="inputTime">
                <el-date-picker  value-format="timestamp" type="date" placeholder="选择日期" v-model="time" ></el-date-picker>
              </el-form-item>
          </el-form-item>

          <el-form-item style="margin-left: 100px">
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button type="info" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      <el-row>
      </el-row>
        <el-row :gutter="20" bodar>
          <el-col :span="3" v-for="(book,index) in bookList" :key="index" >
              <el-card :body-style="{ padding: '0px' }" style="width: 220px;height:300px">
                <el-image  style="margin-left: 20px"
                  :src='book.img != null && book.img.substring(0, 7) == "http://" ? book.img : Sever_URL + "/download/"+book.img'
                  @click="goToBookDetail(book.bookId)"
                  ></el-image>
                <div style="padding-left: 20px;padding-right: 20px;">
                  <p style="color: #000;font-size: 14px;font-weight: bold margin-top: -0px;height: 30px " >  {{ book.bookName.trim().length > 30 ? book.bookName.substring(0,30) + '......' : book.bookName}}  </p>
                  <p style="font-size: 14px;color: #AEA7A7;margin-bottom: 0px;float:left ">{{book.author}}</p>
                  <p v-if="book.ebook == 0" style="font-size: 14px;color: #AEA7A7;margin-bottom: 0px;float:right">借阅: {{book.borrowingNumber}}</p>
                  <p v-if="book.ebook == 1" style="font-size: 14px;color: #AEA7A7;margin-bottom: 0px;float:right">{{book.categoryId}}</p>
                </div>
              </el-card>
          </el-col>
        </el-row>
      <el-row style="margin-left: 45%;margin-top:3%">
        <el-link @click="loadMore" v-if="bookList.length < total" type="primary">加载更多</el-link>
                <p v-if="bookList.length == total">我也是有底线的</p>
        <!-- <el-pagination
          style="margin-top: 30px"
          background
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination> -->
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
      pageSize: 20,
      total: 0,
      book: {
        ebook: 0,
        bookName: null
      },
      url: ''
    }
  },
  mounted () {
    // window.addEventListener('scroll', this.scrollBottom)
  },
  created () {
    if (this.bookCondition != null && this.bookCondition != 'undenfied') {
      this.book = this.bookCondition
    }
    this.getBookInfo(this.pageNum, this.pageSize, this.book)
  },
  // destroyed () {
  //   window.removeEventListener('scroll', this.scrollBottom)
  // },
  methods: {
    loadMore () {
      this.pageNum = this.pageNum + 1
      this.getBookInfo(this.pageNum, this.pageSize, this.book)
    },
    scrollBottom () {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      if (scrollTop + windowHeight >= (scrollHeight - 10)) {
        this.pageNum = this.pageNum + 1
        this.getBookInfo(this.pageNum, this.pageSize, this.book)
      }
    },
    goToBookDetail (bookId) {
      document.body.style.overflow = null
      this.$router.push({path: '/bookDetail/' + bookId})
    },
    handleCurrentChange (val) {
      this.getBookInfo(val, this.pageSize, this.book)
    },
    search () {

    },
    getBookInfo (pageNum, pageSize, book) {
      axios.post(
        '/book/all?pageNum=' + pageNum + '&pageSize=' + pageSize, book
      ).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.list == null || res.data.data.list.length == 0) {
            this.$message('暂无数据')
          }
          this.bookList = this.bookList.concat(res.data.data.list)
          // this.bookList = res.data.data.list
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
  width: 400px;
  border-width:1px;
  border-top-left-radius:6px;
  border-top-right-radius: 6px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px
}
</style>
