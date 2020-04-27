<template >
  <div class="backIndex" style="width: 100%;height: 100%;" >
    <el-container style="width: 100%;height: 100%;">
        <el-aside width="200px" style="height: 100%;">
          <el-menu  unique-opened  
            text-color="rgb(225,225,225)"
            background-color="#394458"
            default-active="/back/home" router >
            <el-menu-item index="/" style="height: 60px;">
              <img :src="icon" width="40px" height="40px" class="img-style" style="margin-right: 5px">励新图书管理系统
              <!-- <i class="el-icon-s-home" style="font-size: 50px"></i> 登录 -->
            </el-menu-item>
            <el-menu-item index="/back/home">
              <i class="el-icon-s-home"></i>首页
            </el-menu-item>
            <el-submenu index="/back/book"  v-if="user.permission.bookR == true || user.permission.bookW == true">
              <template slot="title">
                <i class="el-icon-notebook-1"></i>书籍
              </template>
              <el-menu-item index="/back/book/bookInfo" v-if="user.permission.bookR == true" >
              <i class="el-icon-view" ></i>书籍信息</el-menu-item>
              <el-menu-item index="/back/book/bookList" v-if="user.permission.bookW == true" >
              <i class="el-icon-edit" ></i>书籍列表</el-menu-item>
              <el-menu-item index="/back/book/addBook" v-if="user.permission.bookW == true">
                <i class="el-icon-plus"></i>新增书籍</el-menu-item>
            </el-submenu>
            <el-menu-item index="/back/category/categoryList" v-if="user.permission.categoryW == true">
              <i class="el-icon-s-promotion"></i>书籍分类
            </el-menu-item>
            <el-submenu index="/back/borrowing" v-if="user.permission.borrowingR == true || user.permission.borrowingW == true">
              <template slot="title">
                <i class="el-icon-document"></i>借阅
              </template>
              <el-menu-item index="/back/borrowing/borrowingList" v-if="user.permission.borrowingR == true">
              <i class="el-icon-view"></i>借阅信息</el-menu-item>
              <el-menu-item index="/back/borrowing/handleBorrowing" v-if="user.permission.borrowingW == true">
              <i class="el-icon-edit"></i>处理借阅</el-menu-item>
              <el-menu-item index="/back/borrowing/handleReturn" v-if="user.permission.borrowingW == true">
              <i class="el-icon-edit"></i>处理归还</el-menu-item>
            </el-submenu>
            <el-submenu index="/back/user" v-if="user.permission.userR == true || user.permission.userW == true" >
              <template slot="title">
                <i class="el-icon-user-solid"></i>读者
              </template>
              <el-menu-item-group>
                <el-menu-item index="/back/user/userInfo" v-if="user.permission.userR == true">
                <i class="el-icon-view"></i>用户信息</el-menu-item>
                <el-menu-item index="/back/user/userList" v-if="user.permission.userW == true">
                <i class="el-icon-edit"></i>用户列表</el-menu-item>
                <el-menu-item index="/back/user/addUser" v-if="user.permission.userW == true">
                <i class="el-icon-plus"></i>添加用户</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="/back/statistics" v-if="user.permission.statisticsR == true">
              <template slot="title">
                <i class="el-icon-s-data"></i>统计
              </template>
              <el-menu-item index="/back/statistics/userStatisticsByTime">
                <i class="el-icon-user"></i>用户统计</el-menu-item>
              <el-menu-item index="/back/statistics/storageStatisticsByTime">
                <i class="el-icon-s-marketing"></i>藏量统计</el-menu-item>
              <el-menu-item index="/back/statistics/categoryStatistics">
                <i class="el-icon-date"></i>占比统计</el-menu-item>
            </el-submenu>
            <el-submenu index="/back/sys">
              <template slot="title" >
                <i class="el-icon-setting"></i>系统管理
              </template>
              <el-menu-item index="/back/sys/sendMessage">
                <i class="el-icon-message"></i>消息推送
              </el-menu-item>
              <el-menu-item index="/back/sys/log">
                <i class="el-icon-postcard"></i>日志记录
              </el-menu-item>
              <el-menu-item index="/back/sys/scheduling">
                <i class="el-icon-alarm-clock"></i>定时任务
              </el-menu-item>
              <el-menu-item index="/back/sys/dictionary">
                <i class="el-icon-notebook-2"></i>字典管理
              </el-menu-item>
            </el-submenu>
            <el-menu-item index="/back/grantPrivilege" v-if="user.role == '3'" >
              <i class="el-icon-lock"></i>权限
            </el-menu-item>
          </el-menu>
        </el-aside>
      <el-container>
        
        <el-header style="text-align: right; font-size: 12px; background-color: rgb(238, 241, 246)">
         <div class="navbar clearfix" style="margin-top: 2%;float:left">
              <el-breadcrumb  separator-class="el-icon-arrow-right" style="font-size:15px" >
                    <el-breadcrumb-item
                      v-for="item in routerList" v-bind:key="item.path">
                      {{item.name}}
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </div>
          <el-badge is-dot class="item" v-if="messageList.length > 0"> </el-badge>
            <el-dropdown  @command="handleCommand" style="margin-top:0.5%">
            <el-avatar :size="50"  :src='user.avatar.substring(0, 7) == "http://" ? user.avatar : Server_URL+"/download/"+user.avatar' style="margin-right: 15px;">{{user.userName}}</el-avatar>
              <el-dropdown-menu slot="dropdown" style="margin-top:-1%">
                <el-dropdown-item command="userDetail">个人中心</el-dropdown-item>
                <el-badge v-if="messageList.length > 0" :value="messageList.length" :max="99" class="item">
                  <el-dropdown-item command="queryMessage">消息</el-dropdown-item>
                </el-badge>
                <el-dropdown-item v-else command="queryMessage">消息</el-dropdown-item>
                <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          <span style="font-size: 20px">{{user.userName}},您好</span>
        </el-header>
        <el-main>
          <el-main>
              <router-view></router-view>
          </el-main>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from 'axios'
import icon from '../assets/imgages/favicon.png'
export default {
  name: 'index',
  components: {
  },
  data () {
    return {
      icon,
      Server_URL: axios.defaults.baseURL,
      levelList: null,
      routerList: [],
      user: {
        permission: {}
      },
      message: {
      },
      messageList: [],
      pageNum: 1,
      pageSize: 10
    }
  },
  computed: {

  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.routerList = this._routerRoot._route.matched
      },
      // 深度观察监听
      deep: true
    }
  },
  methods: {

    showRouter () {

    },
    handleCommand (com) {
      if (com == 'userDetail') {
        this.$router.push({path: '/back/personal'})
      }
      if (com == 'logout') {
        this.logout()
      }
      if (com == 'queryMessage') {
        this.$router.push({path: '/back/messageInfo'})
      }
      if (com == 'updatePassword') {
        this.$router.push({path: '/back/updatePassword'})
      }
    },
    logout () {
      window.localStorage.removeItem('userDetail')
      window.localStorage.removeItem('token')
      this.$router.push({path: '/login'})
    },
    getMessage (pageNum, pageSize, message) {
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
        }, 1000000)
      })
    }

  },
  created () {
    console.log(document.body.clientHeight)
    this.user = JSON.parse(window.localStorage.getItem('userDetail'))
    this.routerList = this._routerRoot._route.matched
    this.getMessage(this.pageNum, this.pageSize, this.message)
  },
  mounted () {
  }
}
</script>

<style scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
    background-color: rgb(57, 68, 88);
    color: #394458;
    line-height: 200px;
    height: 100%;
    width: 100%;
}

a {
  text-decoration: none;
}

</style>
