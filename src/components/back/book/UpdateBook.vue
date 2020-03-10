<template>
  <div class="content">
    <el-main>
      <div class="book">
        <div class="bookImg" style="float:left">
          <el-form :model="book" :rules="bookRules" ref="bookRuleForm" label-width="100px" class="demo-ruleForm">
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
                  <el-date-picker  
                  value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                  type="date" placeholder="选择日期" v-model="book.inputTime"></el-date-picker>
                </el-form-item>
            </el-form-item>
            <el-form-item label="书籍分类" prop="category">
              <el-cascader
                v-model="category"
                :options="categoryList"
                :filterable="true"
                change-on-select
                @change="handleBookChange"
                :props="optionProps"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="书籍封面" prop="img">
              <el-image  v-if="book.img != null && !uploadBookImgSuccess" :src="book.img" style="float:left">
              </el-image>
                  <el-upload 
                    :multiple="false"
                    :action="server_URL"
                    list-type="picture-card"
                    accept="image/png,image/jpg,image/jpeg"
                    :class="{disabled:uploadBookImgDisabled}"
                    :on-remove="handleBookImgRemove"
                    :on-success="handleBookImgUploadSuccess"
                    :before-upload="beforeBookImgUpload">
                    <div class="el-upload__tip" slot="tip">只支持jpg/png文件</div>
                    <i class="el-icon-plus"></i>
                  </el-upload>
              
            </el-form-item>
            <el-form-item label="书籍位置" prop="location">
              <el-input v-model="book.location"></el-input>
            </el-form-item>
            <el-form-item label="书籍描述" prop="bookDescribe">
              <el-input :rows="4" maxlength="100"
                  show-word-limit type="textarea" v-model="book.bookDescribe"
                  style="width: 500px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('bookRuleForm')">修改</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script>
import bookList from './BookList'
import axios from 'axios'

export default {
  data () {
    return {
      server_URL: 'http://localhost:8090/file',
      activeName: 'first',
      fileList: [],
      category: [],
      optionProps: {
        value: 'id',
        label: 'title',
        children: 'child'
      },
      categoryList: [],
      id: '',
      book: { },
      uploadBookImgDisabled: false,
      uploadBookImgSuccess: false,
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
          { type: 'string', required: true, message: '请选择日期', trigger: 'change' }
        ],
        category: [      
        ],
        bookDescribe: [
          { required: true, message: '请填写书籍描述', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.id = this.$route.params.id
    this.getAllCategory()
    this.getBookInfo(this.id)
  },
  methods: {
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.book.img === ''){
            this.$message.error("书籍封面为空")
            return false
          } else {
            this.update(this.book)
          }
        } else {
          return false
        }
      })
    },
    update (book) {
      axios.put('/book', book).then(res => {
        if (res.data.code === 200) {
          this.book = res.data.data.book
          this.category = res.data.data.typeList
          this.$message(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getBookInfo (id) {
      axios.get('/book/detail/'+ id)
        .then(res => {
          if (res.data.code === 200) {
            this.book = res.data.data.book
            this.category = res.data.data.typeList
            console.log(this.book)
          } else {
            this.$message.error(res.data.message)
          }
        })
    },
    getAllCategory () {
      axios.get('/type/cascade').then(res => {
        if (res.data.code === 200) {
          this.categoryList = res.data.data
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
    handleBookChange (value){
      this.book.categoryId = value[value.length-1]
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
      this.$message('书籍封面上传成功,请提交修改')
    }
  }
}
</script>

<style scoped>
.el-main{
  margin-left: 20%
}

.el-image{
  width: 185px;
  height: 250px;
}
</style>
