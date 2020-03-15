<template>
  <div class="content">
    <el-container>
      <el-header>
        <el-menu
          default-active="/front/home"
          class="el-menu-demo"
          mode="horizontal"
          router
          @select="handleSelect"
        >
          <el-menu-item index="/front/home">
            <p>首页</p>
          </el-menu-item>
          <el-menu-item index="1">
            <p>推荐</p>
          </el-menu-item>
          <el-menu-item index="2">
            <p>热门</p>
          </el-menu-item>
          <el-menu-item index="3">
            <p>电子书</p>
          </el-menu-item>

          <el-menu-item v-if="user == null" index="/login" style="float: right;width: 100px"> <p>登录</p> </el-menu-item>
            <el-submenu index="" v-if="user != null"  style="float: right;width: 100px;">
              <template slot="title">        
                <el-avatar :size="50"  :src='"http://localhost:8090/download/"+user.avatar' style="margin-right: 15px;">{{user.userName}}</el-avatar>
              </template>
              <el-menu-item index="/front/personal">个人中心</el-menu-item>
              <el-badge :value="11" :max="99" class="item">
                <el-menu-item index="/front/messageInfo">消息</el-menu-item>
              </el-badge>
              <el-menu-item index="/front/borrowing">我的借阅</el-menu-item>
              <el-menu-item index="/front/collection">我的收藏</el-menu-item>
              <el-menu-item index="" @click="openReadRecord">浏览记录</el-menu-item>
              <el-menu-item index="/front/updatePassword">修改密码</el-menu-item>
              <el-menu-item index="" @click="logout">退出</el-menu-item>
            </el-submenu>
        </el-menu>
      </el-header>
        <el-main >
          <!-- <el-carousel :interval="4000" type="card" height="200px">
            <el-carousel-item v-for="item in 6" :key="item">
              <h3 class="medium">{{ item }}</h3>
            </el-carousel-item>
          </el-carousel> -->
              <router-view></router-view>
        </el-main>
     

      <el-drawer  :visible.sync="drawer" direction="ltr" :with-header="false">
          <div v-for="(item,i) in records" :key="i" class="record-list" >
            <div  style="margin-top: 10%;margin-left: 10%">
                <el-image class="header-img"  :src='"http://localhost:8090/download/"+ item.bookImg' 
                      style="float: left;height: 100px; width: 100px" @click="goToBookDetail(item.bookId)"></el-image>
                <div class="author-info" style="margint-left:5%;margin-top: 50px;height: 100px;">
                    <span class="author-name" style="color: #000;font-size: 18px;font-weight: bold">
                        {{item.bookName}}</span>
                        <br>
                    <span class="author-time" 
                      style="font-size: 13px; font-color: #655E5E;">{{item.descr}}</span>
                    <br>
                    <span class="author-time" 
                      style="font-size: 14px;color: #AEA7A7;float:bottom">{{item.browsingTime}}</span>
                </div>
            </div>
          </div>
          <el-pagination style="margin-top: 10%; margin-left: 5%"
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            :current-page.sync="pageNum"
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
      </el-drawer>

      <el-footer>Footer</el-footer>
  </el-container>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Index',
  data () {
    return {
      user: {},
      drawer: false,
      records:[],
      total: 0,
      pageSize: 5,
      pageNum: 1,
    }
  },
  created () {
    this.user = JSON.parse(window.localStorage.getItem('userDetail'))
  },

  methods: {
    handleSelect () {

    },
    logout () {
      window.localStorage.removeItem('userDetail')
      window.localStorage.removeItem('token')
      this.$router.push({path: '/login'})
    },
    goToBookDetail(bookId){
      document.body.style.overflow = null
      this.$router.push({path: '/front/bookDetail/'+bookId})
      this.drawer = false
    },
    handleCurrentChange(){
      this.openReadRecord()
    },
    openReadRecord(){
      axios.post("/record/all?pageSize="+this.pageSize+"&pageNum="+this.pageNum, 
          {userId: this.user.userId })
      .then(res =>{
        if(res.data.code === 200){
          this.records = res.data.data.list
          this.pageSize = res.data.data.pageSize
          this.pageNum = res.data.data.pageNum
          this.total = res.data.data.total
        }
      })
      this.drawer = true
    }
  }
}
</script>

<style>

.el-header  {
  margin-top: -20px;
}
.el-footer {
  color: #333;
  text-align: center;
  line-height: 50px;
}

.el-container{
  margin-top: 30px;
  margin-left: 200px;
  margin-right: 200px
}

.el-menu-item {
  width: 100px;
}

.el-menu-item > p {
  font-size: 20px;
  margin-top: 0px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.el-row > p {
  font-size: 25px;
  margin-top: 0px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}


</style>
