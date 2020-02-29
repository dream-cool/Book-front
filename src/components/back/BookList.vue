<template>
  <div class="content">
      <el-table
          border
          :data="bookList"
          style="width: 100%">
          <el-table-column
            fixed
            label="书籍编号"
            width="310">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.bookId }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="书籍名称"
            width="200">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.bookName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="categoryId"
            label="类别"
            width="120">
          </el-table-column>
          <el-table-column
            prop="ebook"
            :formatter="bookTypeFormatter"
            label="类型"
            width="120">
          </el-table-column>
          <el-table-column
            prop="inputTime"
            label="入馆时间"
            width="200">
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="修改时间"
            width="200">
          </el-table-column> 
          <el-table-column
            label="操作"
            width="250">
            <template slot-scope="scope">
              <el-button @click="handleQuery(scope.row)" size="mini">查看</el-button>
              <el-button @click="handleEdit(scope.row)"   size="small">编辑</el-button>
              <el-button @click="handleDelete(scope.row)" type="danger"  size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
         <div class="block">
           
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="pageNum"
              :page-size="pageSize"
              layout="prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  
    data() {
      return {
        bookList: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        book: {
        },
        categoryList:[]
      }
    },
    created (){
      this.getBookInfo(this.pageNum, this.pageSize, this.book)
      
    },

    methods: {
      
      handleQuery(row) {
        console.log(row);
      },
      handleEdit(row) {
        console.log(row);
      },
      handleDelete(row) {
        console.log(row);
      },
      handleSizeChange(val) {  

      },
      handleCurrentChange(pageNum) {
        this.pageNum = pageNum
        this.getBookInfo(pageNum,this.pageSize,this.book)
      },
      getBookInfo (pageNum, pageSize, book){
        axios.get('/book').then(res => {
          if (res.data.code === 200) {
            this.bookList = res.data.data.list
            this.pageNum = res.data.data.pageNum
            this.pageSize = res.data.data.pageSize
            this.total = res.data.data.total
          } else {
            this.$message.error(res.data.message)
          }
        })
      },

      bookTypeFormatter(row, column, cellValue, index){
        if (row.ebook === 0){
          return '纸质书'
        } else {
          return '电子书'
        }
      },
    },
  }
</script>

<style scoped>

</style>
