<template>
  <div class="content">
      <el-container>
          <el-form :model="book" :inline="true"  label-width="100px" class="demo-form-inline">
          <el-form-item label="书籍名称">
            <el-input v-model="book.bookName" placeholder="模糊查询书籍名和作者名" ></el-input>
          </el-form-item>

          <el-form-item label="书籍价格大于" prop="price">
            <el-input-number v-model="book.price" controls-position="right"
                :min="0" :max="10000"></el-input-number>
          </el-form-item>

          <el-form-item label="书籍状态" prop="status">
            <el-select v-model="book.bookStatus" placeholder="全部" clearable>
              <el-option label="在库" value="0"></el-option>
              <el-option label="已借" value="1"></el-option>
              <el-option label="损坏" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="书籍类型" prop="ebook">
            <el-select v-model="book.ebook" placeholder="全部" clearable>
              <el-option label="纸质书" value="0"></el-option>
              <el-option label="电子书" value="1"></el-option>
            </el-select>
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
            label="书籍名称"
            width="250">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>书籍编号: {{ scope.row.bookId }}</p>
                <p>价格: {{ scope.row.price }}</p>
                <p>得分: {{ scope.row.score }}</p>
                <p>出版社: {{ scope.row.published }}</p>
                <p>点赞数: {{ scope.row.zanNumber }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.bookName }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="author"
            label="书籍作者"
            width="140">
          </el-table-column>
          <el-table-column
            prop="price"
            label="价格(￥)"
            width="80">
          </el-table-column>
          <el-table-column
            prop="zanNumber"
            label="点赞"
            width="80">
          </el-table-column>
          <el-table-column
            prop="score"
            label="得分"
            width="80">
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
            width="60">
          </el-table-column>

          <el-table-column
            prop="bookStatus"
            label="书籍状态"
            :formatter="bookStatusFormatter"
            width="80">
          </el-table-column>
          <el-table-column
            prop="location"
            label="书籍位置"
            :formatter="bookLocatFormatter"
            width="160">
          </el-table-column>
          <el-table-column
            prop="inputTime"
            label="录入时间"
            width="110">
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="修改时间"
            width="150">
          </el-table-column>
          <el-table-column
            label="操作"
            width="220"
            >
            <template slot-scope="scope">
              <!-- <el-button @click="handleQuery(scope.row)" size="mini">查看</el-button> -->
              <el-button @click="handleEdit(scope.row)" icon="el-icon-edit" type="primary" >编辑</el-button>
              <el-button @click="handleDelete(scope.row)" type="danger" icon="el-icon-delete"  >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
          background
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
const Qs = require('qs')
export default {
  data () {
    return {
      category: [''],
      bookList: [],
      pageNum: 1,
      pageSize: 12,
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
        label: 'title'
      },
      none: {
        id: '',
        title: '所有',
        children: []
      },
      multipleSelection: [],
      locationOptions: []
    }
  },
  created () {
    this.getAllCategory()
    this.getBookInfo(this.pageNum, this.pageSize, this.book)
    this.getLocationInfo()
  },

  methods: {
    dateFiltter (date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    deleteBatch () {
      if (this.multipleSelection == null || this.multipleSelection.length == 0) {
        this.$message.error('请选择书籍')
        return false
      }
      this.$confirm('确认删除？')
        .then(_ => {
          var idArray = []
          this.multipleSelection.forEach(book => {
            idArray.push(book.bookId)
          })
          axios.get('/book/delete/batch', {
            params: {ids: idArray},
            paramsSerializer: function (params) {
              return Qs.stringify(params, {arrayFormat: 'repeat'})
            }
          }).then(res => {
            if (res.data.code === 200) {
              this.$message(res.data.message)
              this.getBookInfo(this.pageNum, this.pageSize, this.book)
            } else {
              this.$message.error(res.data.message)
            }
          })
        })
        .catch(_ => {})
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleQuery (row) {
      this.$router.push({path: '/back/book/bookDetail/' + row.bookId})
    },
    handleEdit (row) {
      console.log(row)
      if (row.ebook == 1) {
        this.$router.push({path: '/back/book/updateEbook/' + row.bookId})
      } else {
        this.$router.push({path: '/back/book/updateBook/' + row.bookId})
      }
    },
    handleDelete (row) {
      this.$confirm('确认删除？')
        .then(_ => {
          axios.delete('/book/' + row.bookId).then(res => {
            if (res.data.code === 200) {
              this.$message(res.data.message)
              this.getBookInfo(this.pageNum, this.pageSize, this.book)
            } else {
              this.$message.error(res.data.message)
            }
          })
        })
        .catch(_ => {})
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
          // this.categoryList.push(this.none)
          this.categoryList = this.getTreeData(this.categoryList)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getTreeData (data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children)
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
    },
    getLocationInfo () {
      axios.get('/dictionaryData/book/getLocationInfo').then(res => {
        if (res.data.code == 200) {
          this.locationOptions = res.data.data
          if (this.locationOptions != null && this.locationOptions != undefined) {
            this.locationOptions = this.getTreeData(this.locationOptions)
          }
        }
      })
    },
    bookLocatFormatter (row, column, cellValue, index) {
      if (row.location != null && row.ebook == '0') {
        var locationObj = JSON.parse(row.location)
        var { locationOptions } = this
        if (locationObj != null && locationObj.length > 0 && locationOptions.length > 0) {
          var locationStr = ''
          var oo
          locationObj.forEach(code => {
            oo = locationOptions.filter(item => item.value == code)
            locationStr += oo[0].label + ' '
            locationOptions = oo[0].children
          })
          return locationStr
        } else {
          return '未知'
        }
      } else {
        return '无'
      }
    },
    bookStatusFormatter (row, column, cellValue, index) {
      if (row && row.bookStatus == 0) {
        return '在库'
      }
      if (row && row.bookStatus == 1) {
        return '借出'
      }
      if (row && row.bookStatus == 2) {
        return '损坏'
      }
      return '未知'
    }
  }
}
</script>

<style scoped>

.el-header{
  height: 300px;
}

</style>
