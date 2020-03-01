<template>
  <div class="content">
    <el-main>

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
          书籍状态 {{book.status}}
           <br>
          书籍价格 {{book.price}}
           <br>
          书籍描述 {{book.bookDescribe}}
           <br>
          点赞数量 {{book.zanNumber}}
           <br>
          书籍评分 {{book.score}}
          <el-button type="warning" icon="el-icon-star-off" circle></el-button>
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
import bookList from './BookList'
import axios from 'axios'

export default {
    data () {
      return {
        id: '',
        book: {
          
        },
        img: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
      }
    },
    created() {
        this.id = this.$route.params.id
        this.getBookInfo(this.id)
    },
    methods: {
      getBookInfo(id){
        axios.get('/book/'+ id)
          .then(res => {
            if (res.data.code === 200) {
              this.book = res.data.data
            } else {
              this.$message.error(res.data.message)
            }
        })
      }
    },
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
