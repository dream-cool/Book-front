<template>
  <div class="backIndex" v-loading="fullscreenLoading" >
    <el-container style="height: 800px; border: 1px solid #eee;"   >
    
      <el-aside width="200px">
        <el-menu default-active="2" router >
          <el-menu-item index="/login">
            <i class="el-icon-s-home"></i>登录
          </el-menu-item>
          <el-menu-item index="/back">
            <i class="el-icon-s-home"></i>首页
          </el-menu-item>
          <el-submenu index="/back/book"  v-if="user.permission.bookR == true || user.permission.bookW == true">
            <template slot="title">
              <i class="el-icon-notebook-1"></i>书籍
            </template>
            <el-menu-item index="/back/book/bookInfo" v-if="user.permission.bookR == true" >
            <i class="el-icon-s-home" ></i>书籍信息</el-menu-item>
            <el-menu-item index="/back/book/bookList" v-if="user.permission.bookW == true" >
            <i class="el-icon-s-home" ></i>书籍列表</el-menu-item>
            <el-menu-item index="/back/book/addBook" v-if="user.permission.bookW == true">
              <i class="el-icon-s-operation"></i>新增书籍</el-menu-item>
          </el-submenu>
          <el-submenu index="/back/borrowing" v-if="user.permission.borrowingR == true || user.permission.borrowingW == true">
            <template slot="title">
              <i class="el-icon-document"></i>借阅
            </template>
            <el-menu-item index="/back/borrowing/borrowingList" v-if="user.permission.borrowingR == true">
            <i class="el-icon-s-operation"></i>借阅信息</el-menu-item>
            <el-menu-item index="/back/borrowing/handleBorrowing" v-if="user.permission.borrowingW == true">
            <i class="el-icon-s-operation"></i>处理借阅</el-menu-item>
            <el-menu-item index="/back/borrowing/handleReturn" v-if="user.permission.borrowingW == true">
            <i class="el-icon-s-operation"></i>处理归还</el-menu-item>
          </el-submenu>
          <el-submenu index="/back/user" v-if="user.permission.userR == true || user.permission.userW == true" >
            <template slot="title">
              <i class="el-icon-user-solid"></i>读者
            </template>
            <el-menu-item-group>
              <el-menu-item index="/back/user/userInfo" v-if="user.permission.userR == true">
              <i class="el-icon-s-operation"></i>用户信息</el-menu-item>
              <el-menu-item index="/back/user/userList" v-if="user.permission.userW == true">
              <i class="el-icon-s-operation"></i>用户列表</el-menu-item>
              <el-menu-item index="/back/user/addUser" v-if="user.permission.userW == true">
              <i class="el-icon-s-operation"></i>添加用户</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="/back/statistics" v-if="user.permission.statisticsR == true">
            <template slot="title">
              <i class="el-icon-s-data"></i>统计
            </template>
            <el-menu-item index="/back/statistics/userStatisticsByTime">
              <i class="el-icon-s-operation"></i>用户统计</el-menu-item>
            <el-menu-item index="/back/statistics/storageStatisticsByTime">
              <i class="el-icon-s-operation"></i>藏量统计</el-menu-item>
            <el-menu-item index="/back/statistics/categoryStatistics">
              <i class="el-icon-s-operation"></i>类别统计</el-menu-item>
            <el-menu-item index="/back/statistics/borrowingStatistics">
              <i class="el-icon-s-operation"></i>借阅统计</el-menu-item>
          </el-submenu>
          <el-submenu index="/back/category" v-if="user.permission.categoryW == true">
            <template slot="title" >
              <i class="el-icon-s-order"></i>分类
            </template>
            <el-menu-item index="/back/category/categoryList">
              <i class="el-icon-s-operation"></i>分类列表</el-menu-item>
            <el-menu-item index="/back/category/addCategory" >
              <i class="el-icon-s-operation"></i>新增类别</el-menu-item>
          </el-submenu>
          <el-menu-item index="/back/grantPrivilege" v-if="user.role == '3'" >
            <i class="el-icon-s-operation"></i>权限
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px; background-color: rgb(238, 241, 246)">
          <el-badge is-dot class="item" v-if="messageList.length > 0"> </el-badge>
            <el-dropdown  @command="handleCommand" style="margin-top:1%">
              <i class="el-icon-user" style="font-size: 25px; margin-right: 15px;"></i>
              <el-dropdown-menu slot="dropdown" style="margin-top:-1%">
                <el-dropdown-item command="userDeatil">个人中心</el-dropdown-item>
                <el-badge :value="messageList.length" :max="99" class="item">
                  <el-dropdown-item command="queryMessage">消息</el-dropdown-item>
                </el-badge>
                <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
         
          <span>您好，{{user.userName}}</span>
        </el-header>

        <div class="navbar clearfix" style="margin-top: 1%">
              <el-breadcrumb  separator-class="el-icon-arrow-right" >
                <el-breadcrumb-item 
                  v-for="item in routerList" v-bind:key="item.path"
                  >
                   {{item.name}}
                  
                </el-breadcrumb-item>
              </el-breadcrumb>
        </div>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'index',
  components: {
  },
  data () {
    return {
      levelList: null,
      routerList: [],
      user:{
        permission:{}
      },
      message: {
      },
      messageList:[],
      pageNum: 1,
      pageSize: 10,
      fullscreenLoading: false
    }
  },
  computed: {
    
  },
  watch: {
    $route: {
    handler: function(val, oldVal){
        this.routerList = this._routerRoot._route.matched
      },
      // 深度观察监听
      deep: true
    }
  },
  methods: {
    
    showRouter(){
      
    },
    startLoad(){
      this.fullscreenLoading = true
    },
    handleCommand(com){
      if(com == 'logout'){
        this.logout()
      }
      if(com == 'queryMessage'){
        this.goToMessage()
      }
      if(com == 'updatePassword'){
        this.goToUpdatePW()
      }
    },
    goToUpdatePW() {
      this.$router.push({path:'/updatePassword'})
    },
    goToMessage(){
      this.$router.push({path:'/messageInfo'})
    },
    logout(){
      window.localStorage.removeItem("userDetail")
      window.localStorage.removeItem("token")
      this.$router.push({path:'/login'})
    },
    getMessage(pageNum, pageSize, message){
      this.message.userId = this.user.userId
      this.message.status = 0
      axios({
        url: '/message?pageNum=' + pageNum + '&pageSize=' + pageSize, 
        params: message
        }).then(res => {
          if (res.data.code === 200) {
            this.messageList = res.data.data.list
            this.pageNum = res.data.data.pageNum
            this.pageSize = res.data.data.pageSize
          } else {
            this.$message.error(res.data.message)
          }
          setTimeout(() => {
              this.getMessage(this.pageNum, this.pageSize, this.message)
          }, 10000)
      })
    }
  },
  created () {
    this.user = JSON.parse(window.localStorage.getItem('userDetail'))
    this.routerList = this._routerRoot._route.matched
    this.getMessage(this.pageNum, this.pageSize, this.message)
  },
  mounted () {
  }
}
</script>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}
.el-aside {
  color: #333;
}
a {
  text-decoration: none;
}
</style>
