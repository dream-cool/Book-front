<template>
  <div class="content">
    <el-main>
      <div class="book">
        <div class="bookImg" style="float:left">
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
                <el-cascader style="width: 300px"
                    v-model="category"
                    :options="categoryList"
                    :filterable="true"
                    change-on-select
                    @change="handleEbookChange"
                    :props="optionProps"
                ></el-cascader>
              </el-form-item>
               <el-form-item label="书籍封面" prop="img">
                    <el-upload
                      :multiple="false"
                      :action="server_URL+'/file'"
                      accept="image/png,image/jpg,image/jpeg"
                      list-type="picture-card"
                      :on-success="handleEbookImgUploadSuccess">
                      <div class="el-upload__tip" slot="tip">只支持jpg/png/jpeg文件</div>
                          <el-avatar v-if="ebook.img != null "  shape="square"
                          :size="150"  :src='ebook.img.substring(0, 7) == "http://" ? ebook.img  : server_URL+"/download/"+ebook.img' style="float:left">{{ebook.bookName}}</el-avatar>
                    </el-upload>
                </el-form-item>
              <el-form-item label="书籍描述" prop="bookDescribe">
                <el-input :rows="4" maxlength="100"
                    show-word-limit type="textarea" v-model="ebook.bookDescribe"
                    style="width: 500px"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ebookRuleForm')">修改</el-button>
              </el-form-item>
          </el-form>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      server_URL: axios.defaults.baseURL,
      activeName: 'first',
      fileList: [],
      category: [],
      optionProps: {
        value: 'id',
        label: 'title',
      },
      categoryList: [],
      id: '',
      ebook: {
        bookName: '',
        author: '',
        published: '',
        categoryId: '',
        location: '',
        bookDescribe: '',
        ebook: '1'
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
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ebook.img === '') {
            this.$message.error('书籍封面为空')
            return false
          } else {
            this.update(this.ebook)
          }
        } else {
          return false
        }
      })
    },
    update (book) {
      axios.put('/book', book).then(res => {
        if (res.data.code === 200) {
          this.ebook = res.data.data.book
          this.category = res.data.data.typeList
          this.$message(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getBookInfo (id) {
      axios.get('/book/detail/' + id)
        .then(res => {
          if (res.data.code === 200) {
            this.ebook = res.data.data.book
            this.category = res.data.data.typeList
            console.log(this.ebook)
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
    handleEbookChange (value) {
      this.ebook.categoryId = value[value.length - 1]
    },
    handleEbookImgUploadSuccess (response, file, fileList) {
      this.ebook.img = response.data
      axios.put('/book', this.ebook).then(res => {
        if (res.data.code === 200) {
          this.book = res.data.data
          location.reload()
        } else {
          this.$message.error(res.data.message)
        }
      })
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
  height: 300px;
}

.disabled >>> .el-upload--picture-card{
  display: none;
}

</style>
