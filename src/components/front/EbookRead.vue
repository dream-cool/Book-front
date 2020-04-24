<template>
  <div class="content" :style="backgroundStyle" >
     <el-button icon="el-icon-back" @click="backBookDeatil" style="margin-left: 15%; margin-top: 2%;">返回书籍详情</el-button>
    <el-main>
      <div class="header">
        <span class="demonstration" style="float:left;margin-left: 15%;">背景颜色</span>
        <span class="demonstration" style="float:left;margin-left: 20%;">字体大小</span>
        <span class="demonstration" style="float:left;margin-left: 23%;">字体颜色</span>
        <br>
        <el-color-picker v-model="backgroundColor" @change="handleBackgroundColorChange" style="float:left;margin-left: 15%;"></el-color-picker>
        <div class="block" style="float:left;margin-left: 16%; width:200px;">
          <el-slider :max="50" show-stops @input="handleFontChange" v-model="fontSize"></el-slider>
        </div>
        <el-color-picker v-model="fontColor" @change="handleFontChange" style="float:left;margin-left: 18%;"></el-color-picker>
        <br>
        <br>
        <span class="demonstration" style="float:left;margin-left: 10%;">作者:  {{data.book.author}}</span>
        <span class="demonstration" style="float:left;margin-left: 14%;">上传时间: {{data.book.inputTime}} </span>
        <span class="demonstration" style="float:left;margin-left: 14%;">大小: {{data.fileSize}}</span>
        <span class="demonstration" style="float:left;margin-left: 0%;">
          <el-link type="primary" :href = 'URL'>下载</el-link>
        </span>
        <br>
        <br>
        <br>
        <br>
      </div>
     <p :style="fontStyle" v-html="data.content"></p>

     <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageNum"
            :page-size="pageSize"
            :page-sizes="[100, 200, 300, 400]"
            layout="total, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </el-main>

    <div class="dashboard">
      <el-progress type="dashboard" :percentage="percentage" color="#C19393"></el-progress>
      <div>
        <el-button-group>
          <el-button icon="el-icon-minus" @click="decrease"></el-button>
          <el-button icon="el-icon-plus" @click="increase"></el-button>
        </el-button-group>
      </div>
    </div>
    <el-button type="info" icon="el-icon-top" circle  style="position:fixed;right:0;bottom:0"  @click="toTop"></el-button>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  data () {
    return {
      data: {
        content: '',
        book: {
          author: '',
          inputTime: null
        }
      },
      loading: true,
      URL: axios.defaults.baseURL + '/download/',
      pageNum: 1,
      pageSize: 100,
      total: 0,
      fontSize: 20,
      backgroundColor: '#C8B9B9',
      fontColor: '#000000',
      fontStyle: {
        'font-size': '20px',
        'color': '#510D0D'
      },
      backgroundStyle: {
        'background': '#C8B9B9'
      },
      percentage: 0,
      user: {}
    }
  },
  created () {
    this.user = JSON.parse(window.localStorage.getItem('userDetail'))
    if (this.user == null) {
      this.goToLogin()
    }
    this.getEbookContent(this.pageNum, this.pageSize)
    this.checkReadEBookRecord()
  },
  methods: {
    checkReadEBookRecord () {
      axios.post('/record/all?pageNum=1&pageSize=10000',
        {
          userId: this.user.userId,
          bookId: this.id
        }
      )
        .then(res => {
          if (res.data.code == 200) {
            debugger
            if (res.data.data.list != null && res.data.data.list.length > 0) {
              let recordNum = res.data.data.list[0].bookPage
              if (recordNum <= 1) {
                return
              }
              this.$confirm('记忆您上次阅读到第' + recordNum + '页,是否跳转?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
              }).then(() => {
                this.handleCurrentChange(recordNum)
              }).catch(() => {
                this.addReadEBookRecord(this.pageNum)
              })
            }
          } else {
            this.addReadEBookRecord(this.pageNum)
          }
        })
    },
    addReadEBookRecord (pageNum) {
      axios.post('/record', {userId: this.user.userId, bookId: this.id, bookPage: pageNum}).then(res => {})
    },
    handleBackgroundColorChange () {
      this.backgroundStyle.background = this.backgroundColor
    },
    handleFontChange () {
      this.fontStyle = {
        'font-size': this.fontSize + 'px',
        'color': this.fontStyle.color
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getEbookContent(this.pageNum, this.pageSize)
      this.toTop()
    },
    decrease () {
      this.pageNum--
      if (this.pageNum < 1) {
        return
      }
      this.toTop()
      this.getEbookContent(this.pageNum, this.pageSize)
    },
    increase () {
      if (this.pageNum >= (this.total / this.pageSize)) {
        return
      }
      this.toTop()
      this.pageNum++
      this.getEbookContent(this.pageNum, this.pageSize)
    },
    handleCurrentChange (pageNum) {
      this.getEbookContent(pageNum, this.pageSize)
      this.addReadEBookRecord(pageNum)
      this.toTop()
      this.percentage = (this.pageNum / (this.total / this.pageSize) * 100)
      this.percentage = Number(this.percentage.toFixed(2))
    },
    toTop () {
      document.body.scrollTop = document.documentElement.scrollTop = 0
    },
    backBookDeatil () {
      this.$router.push({ path: '/front/bookDetail/' + this.$route.params.id })
    },
    getEbookContent (pageNum, pageSize) {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      axios.get('/book/ebook/' + this.$route.params.id + '?pageNum=' + pageNum + '&pageSize=' + pageSize)
        .then(res => {
          if (res.data.code === 200) {
            this.data = res.data.data
            this.pageNum = res.data.data.pageIndex
            this.data.content = this.data.content.replace(/[\n\r]/g, '<br>')
            this.pageNum = res.data.data.pageNum
            this.pageSize = res.data.data.pageSize
            this.total = res.data.data.total
            this.URL = this.URL + res.data.data.book.location
            this.percentage = (this.pageNum / (this.total / this.pageSize) * 100)
            this.percentage = Number(this.percentage.toFixed(2))
          } else {
            this.$message.error(res.data.$message)
          }
          loading.close()
        })
    },
    goToLogin () {
      this.$router.push({path: '/login'})
    }

  }
}
</script>

<style scoped>
.el-main{
  margin-left: 15%;
  margin-right: 15%;
}
.dashboard{
  margin-left: 90%;
  position:fixed;
  bottom:0;
}

</style>
