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
            <el-input-number v-model="book.price" controls-position="right"
                :min="0" :max="10000"></el-input-number>
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
                  v-model="category"
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
          tooltip-effect="dark"
          :data="bookList"
          @selection-change="handleSelectionChange"
          :show-overflow-tooltip="true"

          style="width: 100%">
          <el-table-column
            label="书籍名称"
            width="250">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>书籍编号: {{ scope.row.bookId }}</p>
                <p>书籍作者: {{ scope.row.author }}</p>
                <p>出版社: {{ scope.row.published }}</p>
                <p>价格: {{ scope.row.price }}</p>
                <p>书籍位置: {{ scope.row.location }}</p>
                <p>书籍状态: {{ scope.row.bookStatus }}</p>
                <p>点赞数: {{ scope.row.zanNumber }}</p>
                <p>得分: {{ scope.row.score }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.bookName }}</el-tag>
                </div>
              </el-popover>
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
            width="150">
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="修改时间"
            width="200">
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
        
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  data () {
    return {
      category: [''],
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
      categoryList: [],
      optionProps: {
        value: 'id',
        label: 'title',
        children: 'child'
      },
      none: {
        id: '',
        title: '所有',
        child: []
      },
      multipleSelection: []
    }
  },
  created () {
    this.getAllCategory()
    this.getBookInfo(this.pageNum, this.pageSize, this.book)
  },

  methods: {
    dateFiltter (date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    
    handleSizeChange (val) {

    },
    handleCurrentChange (pageNum) {
      this.pageNum = pageNum
      this.getBookInfo(pageNum, this.pageSize, this.book)
    },
    getAllCategory () {
      axios.get('/type/cascade').then(res => {
        if (res.data.code === 200) {
          this.categoryList = res.data.data
          this.categoryList.push(this.none)
          this.categoryList = this.getTreeData(this.categoryList)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getTreeData (data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].child.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].child = undefined
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].child)
        }
      }
      return data
    },
    getBookInfo (pageNum, pageSize, book) {
      axios.post(
        '/book/all?pageNum=' + pageNum + '&pageSize=' + pageSize,
        book
      ).then(res => {
        if (res.data.code === 200) {
          this.bookList = res.data.data.list
          this.bookList.map(book => {
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
    bookTypeFormatter (row, column, cellValue, index) {
      if (row.ebook === 0) {
        return '纸质书'
      } else {
        return '电子书'
      }
    },
    handleCategoryChange (value) {
      this.book.categoryId = value[value.length - 1]
    },
    search () {
      if (this.time != null) {
        this.book.inputTime = this.dateFiltter(this.time)
      }
      this.getBookInfo(this.pageNum, this.pageSize, this.book)
    },
    resetForm () {
      this.book = {
        bookName: null,
        categoryId: null,
        author: null,
        price: 0,
        ebook: null,
        bookStatus: null
      }
      this.time = null
      this.book.inputTime = null
      this.category = [''],
      this.search()
    }
  }
}
</script>

<style scoped>

.el-header{
  height: 300px;
}

</style>
