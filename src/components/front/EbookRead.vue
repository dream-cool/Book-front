<template>
  <div class="content" :style="backgroundStyle" >
    <el-main>
      <div class="header">
        <span class="demonstration" style="float:left;margin-left: 15%;">背景颜色</span>
        <span class="demonstration" style="float:left;margin-left: 20%;">字体大小</span>
        <span class="demonstration" style="float:left;margin-left: 23%;">字体颜色</span>
        <br>
        <el-color-picker v-model="backgroundColor" @change="handleBackgroundColorChange" style="float:left;margin-left: 15%;"></el-color-picker>
        <div class="block" style="float:left;margin-left: 16%; width:200px;">
          <el-slider :max="50" show-stops @change="handleFontChange" v-model="fontSize"></el-slider>
        </div>
        <el-color-picker v-model="fontColor" @change="handleFontChange" style="float:left;margin-left: 18%;"></el-color-picker>
        <br>
        <br>
        <span class="demonstration" style="float:left;margin-left: 10%;">作者:  {{data.book.author}}</span>
        <span class="demonstration" style="float:left;margin-left: 18%;">上传时间: {{data.book.inputTime}} </span>
        <span class="demonstration" style="float:left;margin-left: 24%;">大小: {{data.fileSize}}</span>
        <span class="demonstration" style="float:left;margin-left: 0%;">
          <el-link type="primary" :href = 'URL'>下载</el-link>
        </span>
        <br>
        <br>
       

        <br>
        <br>
      </div>
     <p :style="fontStyle"  v-html="data.content"></p>
      
     <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageNum"
            :page-size="pageSize"
            :page-sizes="[100, 200, 300, 400]"
            layout="total, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </el-main>
    <el-button type="info" icon="el-icon-top" circle  style="position:fixed;right:0;bottom:0"  @click="toTop"></el-button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      data: {
        content: ''
      },
      URL: 'localhost:8090/download/',
      pageNum: 1,
      pageSize: 100,
      total: 0,
      fontSize: 20,
      backgroundColor: '#C8B9B9',
      fontColor: '#000000',
      fontStyle:{
                'font-size': '20px',
                'color': '#510D0D'
            },
      backgroundStyle: {
          'background': '#C8B9B9'
      }
    }
  },
  created () {
    this.getEbookContent(this.pageNum, this.pageSize)
   
  },
  methods: {
    handleBackgroundColorChange () {
      this.backgroundStyle.background = this.backgroundColor
    },
    handleFontChange (){
      this.fontStyle = {
        'font-size': this.fontSize+'px',
        'color': this.fontColor
        }
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getEbookContent(this.pageNum, this.pageSize)
      this.toTop()
    },
    handleCurrentChange (pageNum) {
      this.getEbookContent(pageNum, this.pageSize)
      this.toTop()
    },
    toTop (){
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    getEbookContent (pageNum, pageSize) {
      console.log(pageSize)
      axios.get('/book/ebook/ac24efded0df436b85aa5812c1dbf319?pageNum='+pageNum+ '&pageSize='+pageSize)
        .then(res => {
          if (res.data.code === 200) {
            this.data = res.data.data
            this.pageNum = res.data.data.pageIndex
            this.data.content = this.data.content.replace(/[\n\r]/g, '<br>')
            this.pageNum = res.data.data.pageNum
            this.pageSize = res.data.data.pageSize
            this.total = res.data.data.total
            this.URL = this.URL + res.data.data.book.location    
            console.log(res.data.data)
          } else {
            this.$message.error(res.data.$message)
          }
        })
    }
  }
}
</script>

<style scoped>
.el-main{
  margin-left: 15%;
  margin-right: 15%;
}
.el-pagination{
  margin-left: 40%;
  position:fixed;
  bottom:0;
  background-color: antiquewhite
}

</style>
