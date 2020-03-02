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
          <el-cascader
                 v-model="category"
                :options="categoryList"
                @change="handleChange"
                :props="optionProps"
               >
          </el-cascader>
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
          <el-button type="warning" icon="el-icon-star-off" @click="aa" circle>11</el-button>
        </div>
      </div>
      <div class="ebook">
      </div>
    </el-main>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import bookList from './BookList'
import axios from 'axios'

export default {
  data () {
    return {
      optionProps: {
        value: 'id',
        label: 'title',
        children: 'child'
      },
      categoryList: [{"id": 3,
                    "pid": 1,
                    "name": null,
                    "level": 2,
                    "sort": null,
                    "title": "中国小说",
                    "icon": null,
                    "hidden": null,
                    "createTime": "2020-02-29 22:24:26",
                    "child": []}],
      category: [0],
      none: {
        id: '0',
        title: '无',
        child: []
      },
      id: '',
      book: { },
      img: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
    }
  },
  created () {
    // this.id = this.$route.params.id
    // this.getBookInfo(this.id)
    this.getAllCategory()
    // this.getCategoryById(this.book.categoryId)
  },
  methods: {
      aa(){
          this.category = [1]
      },
    getBookInfo (id) {
      axios.get('/book/' + id)
        .then(res => {
          if (res.data.code === 200) {
            this.book = res.data.data
          } else {
            this.$message.error(res.data.message)
          }
        })
    },
    getAllCategory () {
      axios.get('/type/cascade').then(res => {
        if (res.data.code === 200) {
          this.categoryList = res.data.data
          this.categoryList.push(this.none)
          this.categoryList = this.getTreeData(this.categoryList)
          console.log(this.categoryList)
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
    getCategoryById (categoryId) {
      axios.get('/type/12').then(res => {
        if (res.data.code === 200) {
          this.category = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    handleChange () {
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
