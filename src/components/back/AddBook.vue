<template>
  <div class="content">
    <template>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="纸质书录入" name="first">
          <el-form :model="book" :rules="bookRules" ref="bookRuleFor" label-width="100px" class="demo-ruleForm">
            <el-form-item label="书籍名称" prop="name">
              <el-input v-model="book.name"></el-input>
            </el-form-item>
            <el-form-item label="书籍作者" prop="author">
              <el-input v-model="book.author"></el-input>
            </el-form-item>
            <el-form-item label="书籍出版社" prop="published">
              <el-input v-model="book.published"></el-input>
            </el-form-item>
            <el-form-item label="书籍价格" prop="price">
              <el-input v-model="book.price"></el-input>
            </el-form-item>
            <el-form-item label="书籍状态" prop="status">
              <el-select v-model="book.status" placeholder="请选择书籍状态">
                <el-option label="在库" value="在库"></el-option>
                <el-option label="借出" value="借出"></el-option>
                <el-option label="损坏" value="损坏"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="入馆时间">
                <el-form-item prop="inputTime">
                  <el-date-picker type="date" placeholder="选择日期" v-model="book.inputTime" style="width: 30%;"></el-date-picker>
                </el-form-item>
            </el-form-item>
            <el-form-item label="书籍分类" prop="category">
              <el-select v-model="book.category" placeholder="请选择书籍分类">
              </el-select>
            </el-form-item>      
            <el-form-item label="书籍封面" prop="img">
              <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                multiple
                :limit="3"
                :on-exceed="handleExceed"
                :file-list="fileList">
                <el-button size="small" type="primary">上传封面</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="书籍描述" prop="desc">
              <el-input :rows="4" maxlength="100"
                  show-word-limit type="textarea" v-model="book.desc"
                  style="width: 500px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('bookRuleFor')">立即创建</el-button>
              <el-button @click="resetForm('bookRuleFor')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
          <el-tab-pane label="电子书录入" name="second">
            <el-form :model="ebook" :rules="ebookRules" ref="ebookRuleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="书籍名称" prop="name">
                <el-input v-model="ebook.name"></el-input>
              </el-form-item>
              <el-form-item label="书籍作者" prop="author">
                <el-input v-model="ebook.author"></el-input>
              </el-form-item>
              <el-form-item label="书籍出版社" prop="published">
                <el-input v-model="ebook.published"></el-input>
              </el-form-item>
              <el-form-item label="书籍分类" prop="category">
                <el-select v-model="ebook.category" placeholder="请选择书籍分类">
                </el-select>
              </el-form-item>      
              <el-form-item label="书籍封面" prop="img">
                <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  multiple
                  :limit="3"
                  :on-exceed="handleExceed"
                  :file-list="fileList">
                  <el-button size="small" type="primary">上传封面</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="书籍文件" prop="location">
                <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  multiple
                  :limit="3"
                  :on-exceed="handleExceed"
                  :file-list="fileList">
                  <el-button size="small" type="primary">上传文件</el-button>           
                </el-upload>
              </el-form-item>
              <el-form-item label="书籍描述" prop="desc">
                <el-input :rows="4" maxlength="100"
                    show-word-limit type="textarea" v-model="ebook.desc"
                    style="width: 500px"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ebookRuleForm')">立即录入</el-button>
                <el-button @click="resetForm('ebookRuleForm')">重置</el-button>
              </el-form-item>
            </el-form>      
        </el-tab-pane>
      </el-tabs>
    </template>  
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'first',
      fileList: [],
      book: {
        name: '',
        author: '',
        published: '',
        price: '',
        status: '',
        inputTime: '',
        category: '',
        desc: ''
      },
      ebook: {
        name: '',
        author: '',
        published: '',
        category: '',
        locationg: '',
        desc: ''
      },
      bookRules: {
        name: [
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
          { type: 'array', required: true, message: '请至少选择类别', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写书籍描述', trigger: 'blur' }
        ]
      },
      ebookRules: {
        name: [
          { required: true, message: '请输入书籍名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入书籍作者', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        category: [
          { type: 'array', required: true, message: '请至少选择类别', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写书籍描述', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false;
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
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

</style>
