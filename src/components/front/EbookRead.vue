<template>
  <div class="content">
    <el-main>
      <div class="header">
      </div>
     <p v-html="data.content"></p>

     <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageNum"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </el-main>

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
      pageNum: 1,
      pageSize: 100,
      total: 0
    }
  },
  created () {
    this.getEbookContent(this.pageNum, this.pageSize)
  },
  methods: {
    handleSizeChange (val) {

    },
    handleCurrentChange (pageNum) {
      this.getEbookContent(pageNum, this.pageSize)
    },
    getEbookContent (pageNum, pageSize) {
      axios.get('/book/ebook/fd05624d73214dedaabe3dc0f00cd1f8?pageNum='+pageNum,'&pageSize='+pageSize)
        .then(res => {
          if (res.data.code === 200) {
            this.data = res.data.data
            this.pageNum = res.data.data.pageIndex
            this.data.content = this.data.content.replace(/[\n\r]/g, '<br>')
            this.pageNum = res.data.data.pageNum
            this.pageSize = res.data.data.pageSize
            this.total = res.data.data.total
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
}

</style>
