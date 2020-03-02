<template>
  <div class="content">
      <el-container>
          <el-form :model="book" :inline="true"  label-width="100px" class="demo-form-inline">
          <el-form-item label="书籍名称">
            <el-input v-model="book.bookName" placeholder="模糊查询书籍名称" ></el-input>
          </el-form-item>

          <el-form-item label="书籍作者" prop="author">
            <el-input v-model="book.author" placeholder="模糊查询书籍作者"></el-input>
          </el-form-item>

          <el-form-item label="书籍价格大于" prop="price">
            <el-input v-model.number="book.price"></el-input>
          </el-form-item>
          
          <el-form-item label="书籍状态" prop="status">
            <el-select v-model="book.bookStatus" placeholder="书籍状态">
              <el-option label="所有" :value='null'></el-option>
              <el-option label="在库" value="0"></el-option>
              <el-option label="已借" value="1"></el-option>
              <el-option label="损坏" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="书籍类型" prop="ebook">
            <el-select v-model="book.ebook" placeholder="书籍类型">
              <el-option label="所有" :value='null'></el-option>
              <el-option label="纸质书" value="0"></el-option>
              <el-option label="电子书" value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="书籍分类" prop="category">
            <el-cascader 
                  :options="categoryList"
                  :props="optionProps"
                  :show-all-levels="false"
                  change-on-select
                  @change="handleCategoryChange">
            </el-cascader>
          </el-form-item>

          <el-form-item label="入馆日期早于">
              <el-form-item prop="inputTime">
                <el-date-picker  value-format="timestamp" type="date" placeholder="选择日期" v-model="time" ></el-date-picker>
              </el-form-item>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="search()">搜索</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-container>
      
      <el-table
          border
          size="small"
          ref="multipleTable"
          tooltip-effect="dark"
          :data="bookList"
          @selection-change="handleSelectionChange"
          :show-overflow-tooltip="true"
          
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
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
            width="250">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.bookName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="categoryId"
            label="类别"
            width="150">
          </el-table-column>
          <el-table-column
            prop="ebook"
            :formatter="bookTypeFormatter"
            label="类型"
            width="80">
          </el-table-column>
          <el-table-column
            prop="inputTime"
            label="入馆时间"
            width="100">
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="修改时间"
            width="150">
          </el-table-column> 
          <el-table-column
            label="操作"
            width="250"
            >
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
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
        <div style="margin-top: 20px">
          <el-button type="danger"  size="large" @click="deleteBatch()">批量删除</el-button>
        </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  
    data() {
      return {
        bookList: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        time: null,
        book: {
          bookName: null,
          categoryId: null,
          author: null,
          price: 0,
          ebook: null,
          bookStatus: null,
          inputTime: null
        },
        categoryList:[],
        optionProps: {
          value: 'id',
          label: 'title',
          children: 'child'
        },
        none: {
            id : '',
            title : '所有',
            child: []
        },
        multipleSelection: []
      }
    },
    created (){
      this.getAllCategory()
      this.getBookInfo(this.pageNum, this.pageSize, this.book)
    },

    methods: {
      dateFiltter(date){
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      },
      deleteBatch() {
        if (this.multipleSelection == null || this.multipleSelection.length == 0){
          this.$message.error('请选择书籍')
          return false;
        }
        this.$confirm('确认删除？')
          .then(_ => {
            var idArray = []
            this.multipleSelection.forEach( book => {
              ids.push(book.bookId)
            })
            // todo
            axios.get({
                   url: '/book/delete/batch',
                   params: { ids:[1,2,3]}
                  }).then(res => {
                    
                if (res.data.code === 200) {
                  this.$message(res.data.message)
                  this.getBookInfo(this.pageNum,this.pageSize,this.book)
                } else {
                  this.$message.error(res.data.message)
                }
            })
          })
          .catch(_ => {});
      },
      handleSelectionChange (val){
        this.multipleSelection = val;
      },
      handleQuery(row) {
        this.$router.push({ path:'/back/bookDetail/'+row.bookId})
      },
      handleEdit(row) {
        console.log(row)
        if (row.ebook == 1){
          this.$router.push({ path:'/back/updateEbook/'+row.bookId})
        } else {
          this.$router.push({ path:'/back/updateBook/'+row.bookId})
        }
        
      },
      handleDelete(row) {
        this.$confirm('确认删除？')
          .then(_ => {
            axios.delete('/book/'+row.bookId).then(res => {
                if (res.data.code === 200) {
                  this.$message(res.data.message)
                  this.getBookInfo(this.pageNum,this.pageSize,this.book)
                } else {
                  this.$message.error(res.data.message)
                }
            })
          })
          .catch(_ => {});
      },
      handleSizeChange(val) {  

      },
      handleCurrentChange(pageNum) {
        this.pageNum = pageNum
        this.getBookInfo(pageNum,this.pageSize,this.book)
      },
      getAllCategory (){
        axios.get('/type/cascade').then(res => {
          if (res.data.code === 200) {
            this.categoryList = res.data.data
            this.categoryList.push(this.none)
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      getBookInfo (pageNum, pageSize, book){
        axios({
                url: '/book?pageNum='+pageNum+'&pageSize='+pageSize,
                params: book
              }).then(res => {
                if (res.data.code === 200) {
                  this.bookList = res.data.data.list
                  this.bookList.map( book => {
                    book.inputTime = moment(book.inputTime).format('YYYY-MM-DD')
                    book.updateTime = this.dateFiltter(book.updateTime)
                    return book
                  })
                  this.pageNum = res.data.data.pageNum
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
      handleCategoryChange(value){
          this.book.categoryId = value[value.length-1]
      },
      search (){
        console.log(this.book)
        if (this.time != null){
          this.book.inputTime = this.dateFiltter(this.time)  
        }
        this.getBookInfo(this.pageNum,this.pageSize,this.book)
      },
      resetForm (){
        this.book = {
                  bookName: null,
                  categoryId: null,
                  author: null,
                  price: 0,
                  ebook: null,
                  bookStatus: null,
                }
        this.time = null
        this.book.inputTime = null
        this.search()
      }
    },
  }
</script>

<style scoped>

.el-header{
  height: 300px;
}

</style>
