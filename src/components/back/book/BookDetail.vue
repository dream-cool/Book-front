<template>
  <div class="content">
    <el-main>
      <el-dialog title="申请借阅" :visible.sync="dialogFormVisible">
          <el-form>
            <el-form-item label="借阅时间" label-width="250px">
                <el-date-picker  type="date"
                placeholder="选择日期" v-model="borrowing.borrowingTime" ></el-date-picker>
            </el-form-item>
            <el-form-item label="借阅时长" label-width="250px">
              <el-input-number v-model="borrowing.duration" controls-position="right"
                :min="7" :max="365"></el-input-number>天
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="applyBorrowing">确 定</el-button>
          </div>
        </el-dialog>

      <div class="book">
        <div class="bookImg" style="float:left">
          <el-image :src="img" >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>

        <div class="bookContent"  >
          书籍名称 {{book.bookName}}
          <br>
          书籍作者 {{book.author}}
           <br>
          书籍出版社 {{book.published}}
           <br>
          书籍状态 {{book.bookStatus}}
           <br>
          书籍价格 {{book.price}}
           <br>
          书籍描述 {{book.bookDescribe}}
           <br>
          点赞数量 {{book.zanNumber}}
           <br>
          书籍评分 {{book.score}}
          <el-button type="warning" icon="el-icon-star-off" circle></el-button>
          <el-button v-if ="book.ebook == 0"  type="info" @click="dialogFormVisible = true"  circle>申请借阅</el-button>
          <el-button v-if ="book.ebook == 1"  type="info" @click="goToEookRead"  circle>在线阅读</el-button>
        </div>
      </div>
      <div class="ebook">
      </div>
      <div class="coment">
      </div>
    </el-main>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      id: '',
      book: {
      },
      borrowing: {
        duration: 30,
        borrowingTime: ''
      },
      img: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      dialogFormVisible: false
    }
  },
  created () {
    this.id = this.$route.params.id
    this.getBookInfo(this.id)
  },
  methods: {
    applyBorrowing () {
      this.borrowing.userId = 2
      this.borrowing.bookId = this.id
      if (this.book.bookStatus != 0) {
        this.$message.error('该书籍已在申请中')
        return
      }
      axios.post('/borrowing', this.borrowing)
        .then(res => {
          if (res.data.code === 200) {
            this.book = res.data.data
            this.getBookInfo(this.id)
            this.$message(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        })
      this.dialogFormVisible = false
    },
    getBookInfo (id) {
      axios.get('/book/' + id)
        .then(res => {
          if (res.data.code === 200) {
            this.book = res.data.data
            this.borrowing.borrowingTime = new Date().getTime() + 86400000
          } else {
            this.$message.error(res.data.message)
          }
        })
    },
    goToEookRead () {
      this.$router.push({ path: '/front/ebookRead/' + this.id})
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

</style>
