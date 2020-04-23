<template>
  <div class="content">
    <template>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="纸质书录入" name="first">
          <el-form :model="book" :rules="bookRules" ref="bookRuleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="书籍编号" prop="bookId">
              <el-input v-model="book.bookId" placeholder="请输入书籍编号，为空则系统生成UUID"></el-input>
            </el-form-item>
            <el-form-item label="书籍名称" prop="bookName">
              <el-input v-model="book.bookName"></el-input>
            </el-form-item>
            <el-form-item label="书籍作者" prop="author">
              <el-input v-model="book.author"></el-input>
            </el-form-item>
            <el-form-item label="书籍出版社" prop="published">
              <el-input v-model="book.published"></el-input>
            </el-form-item>
            <el-form-item label="书籍价格" prop="price">
               <el-input-number v-model="book.price" controls-position="right"
                :min="0" :max="10000"></el-input-number>
            </el-form-item>
            <el-form-item label="书籍状态" prop="bookStatus">
              <el-radio-group v-model="book.bookStatus">
                <el-radio :label="'0'">在库</el-radio>
                <el-radio :label="'1'">借出</el-radio>
                <el-radio :label="'2'">损坏</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="入馆时间">
                <el-form-item prop="inputTime">
                  <el-date-picker value-format="timestamp" type="date" placeholder="选择日期" v-model="book.inputTime" style="width: 30%;"></el-date-picker>
                </el-form-item>
            </el-form-item>
            <el-form-item label="书籍分类" prop="category">
              <el-cascader style="width: 400px"
                    :options="categoryList"
                    :props="optionProps"
                    change-on-select
                    @change="handleBookChange">
              </el-cascader>
            </el-form-item>
            <el-form-item label="书籍封面" prop="img">
              <el-upload
                :multiple="false"
                :action="server_URL"
                list-type="picture-card"
                :class="{disabled:uploadBookImgDisabled}"
                :on-remove="handleBookImgRemove"
                :on-success="handleBookImgUploadSuccess"
                :before-upload="beforeBookImgUpload">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="书籍位置" prop="location">
              <el-cascader style="width: 300px"
                    :options="locationOptions"
                    v-model="book.location"
                   >
              </el-cascader>
            </el-form-item>
            <el-form-item label="书籍描述" prop="bookDescribe">
              <el-input :rows="4" maxlength="100"
                  show-word-limit type="textarea" v-model="book.bookDescribe"
                  style="width: 500px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('bookRuleForm')">立即录入</el-button>
              <el-button type="info" @click="resetForm('bookRuleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
          <el-tab-pane label="电子书录入" name="second">
            <el-form :model="ebook" :rules="ebookRules" ref="ebookRuleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="书籍名称" prop="bookName">
                <el-input v-model="ebook.bookName"></el-input>
              </el-form-item>
              <el-form-item label="书籍作者" prop="author">
                <el-input v-model="ebook.author"></el-input>
              </el-form-item>
              <el-form-item label="书籍出版社" prop="published">
                <el-input v-model="ebook.published"></el-input>
              </el-form-item>
              <el-form-item label="书籍分类" prop="category">
                <el-cascader style="width: 400px"
                      :options="categoryList"
                      :props="optionProps"
                      change-on-select
                      @change="handleEbookChange">
                </el-cascader>
              </el-form-item>
              <el-form-item label="书籍封面" prop="img">
                <el-upload
                  :action="server_URL"
                  list-type="picture-card"
                  :class="{disabled:uploadEbookImgDisabled}"
                  :on-remove="handleEbookImgRemove"
                  :on-success="handleEbookImgUploadSuccess"
                  :before-upload="beforeEbookImgUpload"
                  >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="书籍文件" prop="location">
                <el-upload
                  :action="server_URL"
                  list-type="picture-card"
                  :class="{disabled:uploadEbookFileDisabled}"
                  :on-remove="handleEbookFileRemove"
                  :on-success="handleEbookFileUploadSuccess"
                  :before-upload="beforeEbookFileUpload"
                  :file-list="fileList">
                  <i class="el-icon-plus"></i>
                  <div class="el-upload__tip" slot="tip">只能上传txt文件</div>
                </el-upload>
              </el-form-item>
              <el-form-item label="书籍描述" prop="bookDescribe">
                <el-input :rows="4" maxlength="100"
                    show-word-limit type="textarea" v-model="ebook.bookDescribe"
                    style="width: 500px"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ebookRuleForm')">立即录入</el-button>
                <el-button type="info" @click="resetForm('ebookRuleForm')" >重置</el-button>
              </el-form-item>
            </el-form>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script>

import axios from 'axios'
export default {
  data () {
    return {
      server_URL: axios.defaults.baseURL + '/file',
      activeName: 'first',
      fileList: [],
      book: {
        bookName: '',
        author: '',
        published: '',
        price: '',
        bookStatus: '',
        inputTime: '',
        categoryId: '',
        bookDescribe: '',
        ebook: '0',
        location: ''
      },
      categoryList: [

      ],
      locationOptions:{},
      optionProps: {
        value: 'id',
        label: 'title',
      },
      none: {
        id: '',
        title: '无',
        child: []
      },
      ebook: {
        bookName: '',
        author: '',
        published: '',
        categoryId: '',
        location: '',
        bookDescribe: '',
        ebook: '1',
        imgFile: ''
      },
      bookRules: {
        bookName: [
          { required: true, message: '请输入书籍名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入书籍作者', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        published: [
          { required: true, message: '请输入书籍出版社', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入书籍出版社', trigger: 'blur' },
          { type: 'number', message: '价格必须为数字', trigger: 'blur' }
        ],
        inputTime: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        category: [
        ],
        bookDescribe: [
          { required: true, message: '请填写书籍描述', trigger: 'blur' }
        ]
      },
      ebookRules: {
        bookName: [
          { required: true, message: '请输入书籍名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入书籍作者', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        category: [
          // { type: 'array', required: true, message: '请至少选择类别', trigger: 'change' }
        ],
        bookDescribe: [
          { required: true, message: '请填写书籍描述', trigger: 'blur' }
        ]
      },
      uploadBookImgDisabled: false,
      uploadEbookImgDisabled: false,
      uploadEbookFileDisabled: false,
      uploadBookImgSuccess: false,
      uploadEbookImgSuccess: false,
      uploadEbookFileSuccess: false
    }
  },
  created () {
    this.getAllCategory()
    this.getLocationInfo()
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === 'bookRuleForm') {
            if (this.book.categoryId === '') {
              this.$message.error('书籍所属类别为空')
              return false
            }
            if (this.book.img === '') {
              this.$message.error('书籍封面为空')
              return false
            } else {
              this.addBook(this.book)
            }
          } else {
            if (this.ebook.categoryId === '') {
              this.$message.error('书籍所属类别为空')
              return false
            }
            if (this.ebook.img === '') {
              this.$message.error('电子书封面为空')
              return false
            } else if (this.ebook.location === '') {
              this.$message.error('电子书文件为空')
              return false
            } else {
              this.addBook(this.ebook)
            }
          }
        } else {
          return false
        }
      })
    },
    getAllCategory () {
      axios.get('/type/cascade').then(res => {
        if (res.data.code === 200) {
          this.categoryList = res.data.data
          this.categoryList = this.getTreeData(this.categoryList)
          this.categoryList.push(this.none)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    addBook (book) {
      if(book.location != null && book.ebook == '0'){
        book.location = JSON.stringify(book.location)
      }
      axios.post('/book', book).then(res => {
        if (res.data.code === 200) {
          this.$message(res.data.message)
          this.book = {}
        } else {
          this.$message.error(res.data.message)
          book.location  = JSON.parse(book.location)
        }
        book.location = null
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },

    handleClick (tab, event) {
    },

    handleBookChange (value) {
      this.book.categoryId = value[value.length - 1]
    },

    handleEbookChange (value) {
      this.ebook.categoryId = value[value.length - 1]
    },

    handleBookImgRemove (file, fileList) {
      this.book.img = ''
      this.uploadBookImgDisabled = false
    },
    beforeBookImgUpload () {
      this.uploadBookImgDisabled = true
    },
    handleBookImgUploadSuccess (response, file, fileList) {
      this.uploadBookImgSuccess = true
      this.book.img = response.data
      this.$message('书籍封面上传成功')
    },

    handleEbookImgRemove (file, fileList) {
      this.ebook.img = ''
      this.uploadEbookImgDisabled = false
    },
    beforeEbookImgUpload () {
      this.uploadEbookImgDisabled = true
    },
    handleEbookImgUploadSuccess (response, file, fileList) {
      this.uploadEbookImgSuccess = true
      this.ebook.img = response.data
      this.$message('电子书封面上传成功')
    },

    handleEbookFileRemove (file, fileList) {
      this.ebook.location = ''
      this.uploadEbookFileDisabled = false
    },
    beforeEbookFileUpload () {
      this.uploadEbookFileDisabled = true
    },
    handleEbookFileUploadSuccess (response, file, fileList) {
      this.ebook.location = response.data
      this.uploadEbookFileSuccess = true
      this.$message('书籍文件上传成功')
    },
    getLocationInfo () {
      axios.get('/dictionaryData/book/getLocationInfo').then(res => {
        if (res.data.code == 200) {
          this.locationOptions = res.data.data
          if(this.locationOptions != null && this.locationOptions != undefined){
            this.locationOptions = this.getTreeData(this.locationOptions)
          }
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
    }
  }
}
</script>

<style scoped>
.el-input{
  width: 350px;
}

.el-date-picker{
  width: 350px;
}

.el-form{
  margin-left: 20%
}

.disabled >>> .el-upload--picture-card{
  display: none;
}

</style>
