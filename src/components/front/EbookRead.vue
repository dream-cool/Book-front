<template>
  <div class="content">

    <el-main >
      <div>
        {{data.content}}
      </div>

    </el-main>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageNum"
            :page-size="data.rows"
            layout="prev, pager, next, jumper"
            :total="data.total">
        </el-pagination>
  </div>
</template>

<script>
import  axios from 'axios'
export default {
  data () {
    return {
      data: {
        content: ''
      },
      pageNum: 1,
      pageSize: 100,
      msg: ''

      
    }
  },
  created (){
   
      this.getEbookContent(this.pageNum, this.pageSize)
  },
  methods: {
      handleSizeChange(val) {
        
      },
      handleCurrentChange(pageNum) {
        this.getEbookContent(pageNum,this.pageSize)
      },
      getEbookContent(pageNum, pageSize) {
         
         axios.get('/book/ebook/10fb3f')
          .then(res => {
            if (res.data.code === 200) {
              this.data = res.data.data
              this.pageNum = res.data.data.pageIndex
              this.data.content = this.data.content.replace("\n", "<br />")       
            } else {
              this.$message.error(res.data.$message)
            }
          })
      }  
  },
}
</script>

<style scoped>

</style>
