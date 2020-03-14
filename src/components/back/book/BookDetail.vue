<template>
  <div class="content" style="margin-left: 10%">
      <el-dialog title="申请借阅" :visible.sync="dialogFormVisible" 
          style="margin-left: 20%;width: 60%">
          <el-form>
            <el-form-item label="借阅时间" label-width="100px">
                <el-date-picker  type="date"
                placeholder="选择日期" v-model="borrowing.borrowingTime" ></el-date-picker>
            </el-form-item>
            <el-form-item label="借阅时长" label-width="100px">
              <el-input-number v-model="borrowing.duration" cnotrols-position="right"
                :min="7" :max="365"></el-input-number>天
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="applyBorrowing">确 定</el-button>
          </div>
        </el-dialog>

      <div class="book">
         
        <div class="bookImg" style="float:left;margin-right: 5%; height: 400px" >
          <el-image v-if="book.img != null" :src="book.img" >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>

        <div class="bookContent" style="margin-left: 100px;width:800px">
          <p style="color: #000;font-size: 35px;font-weight: bold">{{book.bookName}}</p> 
           {{book.bookDescribe}}
           <br>
            <br>
          作者: {{book.author}}
          出版社: {{book.published}}
          <br>
          上传时间: {{book.inputTime}}
          <br>
          价格 {{book.price}}
           <br>

          <div>
              <el-link v-if="isLike"  icon="iconfont icon-like" style="margin-left:0px;margin-top:30px" :underline="false" @click="like">4515 </el-link>
              <el-link v-if="!isLike" icon="iconfont icon-cancel-like" style="margin-left:0px;margin-top:30px" :underline="false" @click="like">4515 </el-link>
              <el-link v-if="isCollect" icon="iconfont icon-collect"  :underline="false" style="margin-left:40px;margin-top:30px" @click="collect"></el-link>
              <el-link v-if="!isCollect" icon="iconfont icon-cancel-collect"  :underline="false" style="margin-left:40px;margin-top:30px" @click="collect"></el-link>
              <el-link  icon="el-icon-s-comment" style="font-size: 30px;margin-left:60px;margin-top:30px" :underline="false"  @click=""></el-link>
              <el-rate v-model="comment.score" disabled show-score text-color="#ff9900" style="margin-top:20px"></el-rate>
              <el-button v-if ="book.ebook == 0"  type="info" @click="dialogFormVisible = true"  circle style="margin-top:20px">申请借阅</el-button>
              <el-button v-if ="book.ebook == 1"  type="info" @click="goToEookRead"  circle style="margin-top:20px">在线阅读</el-button>
          </div> 
        </div>
      </div>
      
      <div class="comment">
        <div class="deploy-comment" style="margin-top: 10%">
             <el-input
              type="textarea"
              placeholder="请输入评论"
              v-model="comment.content"
              maxlength="300"
              show-word-limit
              :rows="5"
              style="width: 800px;"
            >
            </el-input>
            <el-rate v-model="comment.score"></el-rate>
            <el-button >评论</el-button>
        </div>
         
        <div  style="margin-top: 5%">
          <el-radio v-model="order" label="time">按时间排序</el-radio>
          <el-radio v-model="order" label="score">按评分排序</el-radio>
          <div v-for="(item,i) in comments" :key="i" class="comment-list" style="margin-top: 2%">
            <el-avatar class="header-img" :size="40" :src="item.headImg" style="float: left"></el-avatar>
            <div class="author-info" style="margint-left:5%">
                <span class="author-name" style="color: #000;font-size: 18px;font-weight: bold">
                    {{item.name}}</span>
                <span class="author-time" style="font-size: 14px;color: #AEA7A7">{{item.time}}</span>
                <el-rate v-model="comment.score" disabled show-score text-color="#ff9900"></el-rate>
            </div>
            <!-- <div class="icon-btn">
                <span @click="showReplyInput(i,item.name,item.id)"><i class="el-icon-s-comment"></i>{{item.commentNum}}</span>
                <i class="el-icon-caret-top"></i>{{item.like}}
            </div> -->
            <div class="talk-box">
                <p>
                    <span class="reply" style="font-size: 18px; font-color: #655E5E">{{item.comment}}</span>
                </p>
            </div>
          </div>
        </div>

        
      </div>
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
      isLike:false,
      isCollect: false,
      borrowing: {
        duration: 30,
        borrowingTime: ''
      },
      dialogFormVisible: false,
      user: {},
      comment:{
        score: 1,
      },
      order:'time',
      comments:[{
                    name:'Lana Del Rey',
                    id:19870621,
                    headImg:'https://ae01.alicdn.com/kf/Hd60a3f7c06fd47ae85624badd32ce54dv.jpg',
                    comment:'我发布一张新专辑Norman Fucking Rockwell,大家快来听啊',
                    time:'2019年9月16日 18:43',
                    commentNum:2,
                    like:15,
                    inputShow:false,
                    reply:[]
                },
                {
                    name:'Lana Del Rey',
                    id:19870621,
                    headImg:'https://ae01.alicdn.com/kf/Hd60a3f7c06fd47ae85624badd32ce54dv.jpg',
                    comment:'我发布一张新专辑Norman Fucking Rockwell,大家快来听啊',
                    time:'2019年9月16日 18:43',
                    commentNum:2,
                    like:15,
                    inputShow:false,
                    reply:[]
                },
                {
                    name:'Lana Del Rey',
                    id:19870621,
                    headImg:'https://ae01.alicdn.com/kf/Hd60a3f7c06fd47ae85624badd32ce54dv.jpg',
                    comment:'我发布一张新专辑Norman Fucking Rockwell,大家快来听啊',
                    time:'2019年9月16日 18:43',
                    commentNum:2,
                    like:15,
                    inputShow:false,
                    reply:[]
                },{
                    name:'Lana Del Rey',
                    id:19870621,
                    headImg:'https://ae01.alicdn.com/kf/Hd60a3f7c06fd47ae85624badd32ce54dv.jpg',
                    comment:'我发布一张新专辑Norman Fucking Rockwell,大家快来听啊',
                    time:'2019年9月16日 18:43',
                    commentNum:2,
                    like:15,
                    inputShow:false,
                    reply:[]
                }],
    }
  },
  created () {
    this.user = JSON.parse(window.localStorage.getItem('userDetail'))
    this.id = this.$route.params.id
    this.getBookInfo(this.id)
    
  },
  methods: {
    collect(){
        this.isCollect = !this.isCollect
        if(this.isCollect){
          this.$message("您收藏了该书籍")
        } else {
          this.$message("您取消了收藏")
        }
    },
    like(){
        this.isLike = !this.isLike
        if(this.isLike){
          this.$message("您点赞了该书籍")
        } else {
          this.$message("您取消了点赞")
        }
    },
    applyBorrowing () {
      this.borrowing.userId = this.user.userId
      this.borrowing.bookId = this.id
      if (this.book.bookStatus != 0) {
        this.$message.error('该书籍暂不在库,无法申请')
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
      axios.get('/book/detail/' + id)
        .then(res => {
          if (res.data.code === 200) {
            this.book = res.data.data.book
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

.el-image{
  width: 320px;
  height: 320px;
  
}

.author-title{
    border-bottom: 1px solid rgba(178,186,194,.3)
}
  

</style>
