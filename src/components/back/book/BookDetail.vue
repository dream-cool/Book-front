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
              <el-link v-if="userCollection.isLike"  icon="iconfont icon-like" style="margin-left:0px;margin-top:30px" :underline="false" @click="bookLike"> 
                <p> {{book.zanNumber}}</p>   </el-link>
              <el-link v-if="!userCollection.isLike" icon="iconfont icon-cancel-like" style="margin-left:0px;margin-top:30px" :underline="false" @click="bookLike"> 
                <p> {{book.zanNumber}} </p> </el-link>
              <el-link v-if="userCollection.isCollect" icon="iconfont icon-collect"  :underline="false" style="margin-left:40px;margin-top:30px" @click="collect"></el-link>
              <el-link v-if="!userCollection.isCollect" icon="iconfont icon-cancel-collect"  :underline="false" style="margin-left:40px;margin-top:30px" @click="collect"></el-link>
              <el-link  icon="el-icon-s-comment" style="font-size: 30px;margin-left:60px;margin-top:30px" :underline="false"  @click=""></el-link>
              <el-rate v-model="book.score" disabled show-score text-color="#ff9900" style="margin-top:20px"></el-rate>
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
            <el-button @click="publishComments">评论</el-button>
        </div>
         
        <div  style="margin-top: 5%">
          <el-radio v-model="sortWay" @change="getCommentInfo(id, sortWay)" label="zan_number">按热度排序</el-radio>
          <el-radio v-model="sortWay" @change="getCommentInfo(id, sortWay)" label="comment_time">按时间排序</el-radio>
          <el-radio v-model="sortWay" @change="getCommentInfo(id, sortWay)" label="score">按评分排序</el-radio>
          <div v-for="(item,i) in comments" :key="i" class="comment-list" style="margin-top: 2%">
            <el-card style="width: 1000px">
              <el-avatar class="header-img" :size="40" :src="'http://localhost:8090/download/'+item.user.avatar" style="float: left"></el-avatar>
              <div class="author-info" style="margint-left:5%">
                  <span class="author-name" style="color: #000;font-size: 18px;font-weight: bold">
                      {{item.user.userName}}</span>
                  <span class="author-time" style="font-size: 14px;color: #AEA7A7">{{item.commentTime}}</span>
                  <el-link v-if="item.isLike"  icon="iconfont icon-like" style="margin-left:50px;" :underline="false" @click="commentLike(item.commentId,i)"> 
                  <p> {{item.zanNumber}} </p> </el-link>
                  <el-link v-if="!item.isLike" icon="iconfont icon-cancel-like" style="margin-left:50px;" :underline="false" @click="commentLike(item.commentId,i)"> 
                  <p> {{item.zanNumber}} </p> </el-link>
                  <el-link v-if="user != null && user.userId == item.userId" @click="deleteComment(item.commentId)" icon="el-icon-delete" 
                        :underline="false" style="margin-left: 20px; font-size:25px" ></el-link>
                  <el-rate v-model="item.score" disabled show-score text-color="#ff9900"></el-rate>
              </div>
              <!-- <div class="icon-btn">
                  <span @click="showReplyInput(i,item.name,item.id)"><i class="el-icon-s-comment"></i>{{item.commentNum}}</span>
                  <i class="el-icon-caret-top"></i>{{item.like}}
              </div> -->
              <div class="talk-box" >
                      <span class="reply" style="font-size: 18px; font-color: #655E5E">{{item.content}}</span>
              </div>
            </el-card>
          </div>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="pageNum"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>


        <el-dialog title="我的收藏" :visible.sync="dialogCollectionVisible" 
          style="margin-left: 20%;width: 60%">
          
           <el-radio-group  v-model="userCollection.groupName" >
              <el-radio v-for="(item,index) in collectGroupList" :key="index"  
                  style="width: 250px;margin-left: 100px;margin-top: 20px"
               :label="item.name" border></el-radio>

               <el-input
                  placeholder="新建收藏分组"
                  v-model="collectGroup.name"
                  style="margin-top: 50px;margin-left:100px;width:250px"
                  clearable>
                </el-input>
                <el-button icon="el-icon-plus" style="margin-left:10px" @click="addCollectGroup"></el-button>
          </el-radio-group >
         

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCollectionVisible = false">取 消</el-button>
            <el-button type="primary" @click="commitCollect">确 定</el-button>
          </div>
        </el-dialog>

        
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
      borrowing: {
        duration: 30,
        borrowingTime: ''
      },
      dialogFormVisible: false,
      dialogCollectionVisible: false,
      user: {},
      comment:{
        score: 1,
        content: ''
      },
      sortWay:'zan_number',
      userCollection:{
        groupName: null
      },
      collectGroupList: [],
      collectGroup: {
        name:null
      },
      comments:[],
      pageNum: 1,
      pageSize: 10,
      total: 0,
    }
  },
  created () {
    this.user = JSON.parse(window.localStorage.getItem('userDetail'))
    this.id = this.$route.params.id
    this.getBookInfo(this.id)
    this.addReadBookRecord()
    this.getCollectionInfo()
    this.getCommentInfo(this.id, this.sortWay)
  },
  methods: {
    collect(){
        if(this.user == null){
          return
        }
        if(!this.userCollection.isCollect){
          console.log(this.userCollection)
          this.getCollectGroupInfo()
          this.dialogCollectionVisible = true;
        } else {
          this.userCollection.isCollect = !this.userCollection.isCollect
          this.updateCollectionInfo(this.userCollection)
          this.$message("取消收藏")
        }
    },
    commitCollect(){
        if(this.userCollection.groupName == null || this.userCollection.groupName.trim().length <= 0){
          this.$message.error("请选择分组")
          return
        }
        this.userCollection.isCollect = true
        axios.put('/userCollection', this.userCollection)
        .then(res => {
          if (res.data.code === 200) {
            this.userCollection = res.data.data
            this.$message("收藏成功")
            this.dialogCollectionVisible = false
          } else {
            this.$message.error("收藏失败")
          }
        })
    },
    addCollectGroup(){
      axios.post("/collectionGroup", {
        name: this.collectGroup.name,
        userId: this.user.userId
      }).then( res => {
        if (res.data.code === 200) {
            this.collectGroup.name = null
            this.getCollectGroupInfo()
            this.$message(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
      })
    },
    bookLike(){
        if(this.user == null){
            return
        }
        this.userCollection.isLike = !this.userCollection.isLike
        this.updateCollectionInfo(this.userCollection)
        if(this.userCollection.isLike){
          this.book.zanNumber++
          this.$message("您点赞了该书籍")
        } else {
          this.book.zanNumber--
          this.$message("您取消了点赞")
        }
    },
    commentLike(commentId, index){
        if(this.user == null){
           return
        }
        this.comments[index].isLike = !this.comments[index].isLike
        this.updateCommentInfo(commentId,this.user.userId, this.comments[index].isLike)
        if(this.comments[index].isLike){
          this.comments[index].zanNumber++
          this.$message("点赞成功")
        } else {
          this.comments[index].zanNumber--
          this.$message("您取消了点赞")
        }
    },
    updateCommentInfo (commentId, userId, isLike){
        axios.put("/commentLike", {
            userId: userId,
            commentId: commentId,
            isLike: isLike
        })
    },
    handleCurrentChange(){
        console.log(this.pageNum)
        this.getCommentInfo(this.id, this.sortWay)
    },
    publishComments(){
      if(this.user != null || this.comment.content.trim().length != 0){
        axios.post('/comment', 
          {
            userId: this.user.userId,
            bookId: this.id,
            content: this.comment.content,
            score: this.comment.score,            
        })
        .then(res => {
          if (res.data.code === 200) {
            this.comment = res.data.data
            this.comment.content = ''
            this.getCommentInfo(this.id, this.sortWay)
            this.$message(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        })
        
      }
    },
    deleteComment(commentId){
        if(this.user != null){
          axios.delete("/comment/"+commentId)
          .then(res => {
              if(res.data.code === 200){
                this.$message(res.data.message)
              } else {
                this.$message.error(res.data.message)
              }
              this.getCommentInfo(this.id, this.sortWay)
          })  
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
    getCollectionInfo(){
      if( this.user != null){
        axios.get('/userCollection/' + this.user.userId+ '/'+this.id)
        .then(res => {
          if (res.data.code === 200) {
            this.userCollection = res.data.data
          } 
        })
      }
    },
    getCollectGroupInfo(){
        axios.get('/collectionGroup/user/' + this.user.userId)
        .then(res => {
          if (res.data.code === 200) {
            this.collectGroupList = res.data.data
          } else {
            this.$message.error("获取收藏夹分组信息失败")
          }
        })
    },
    getCommentInfo(bookId, sortWay){
        axios.post('/comment/all?pageNum=' + this.pageNum+ '&pageSize='+this.pageSize+'&userId='+this.user.userId,{
              bookId: bookId,
              sortWay: sortWay
            }
        )
        .then(res => {
          if (res.data.code === 200) {
            this.comments = res.data.data.list
            this.pageSize = res.data.data.pageSize
            this.pageNum = res.data.data.pageNum
            this.total = res.data.data.total
          } 
        })
    },
    updateCollectionInfo(userCollection){
      if( userCollection != null){
        axios.put('/userCollection', userCollection)
        .then(res => {
          if (res.data.code === 200) {
            this.userCollection = res.data.data
          } 
        })
      }
    },
    addReadBookRecord(){
      if (this.user != null){
          axios.post('/record', {userId: this.user.userId, bookId: this.id})
          .then(res => {})
      }
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
