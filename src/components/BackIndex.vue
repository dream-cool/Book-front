<template>
  <div class="backIndex">
    <el-container style="height: 880px; border: 1px solid #eee;">
    
      <el-aside width="200px" >
        <el-menu default-active="2" router >
          <el-menu-item index="/login">
            <i class="el-icon-s-home"></i>登录
          </el-menu-item>
          <el-menu-item index="/back/home">
            <i class="el-icon-s-home"></i>首页
          </el-menu-item>
          <el-submenu index="/back/book">
            <template slot="title">
              <i class="el-icon-notebook-1"></i>书籍管理
            </template>
            <el-menu-item index="/back/book/bookList">
            <i class="el-icon-s-home">
              </i>书籍列表</el-menu-item>
            <el-menu-item index="/back/book/addBook">
              <i class="el-icon-s-operation"></i>新增书籍</el-menu-item>
          </el-submenu>
          <el-submenu index="/back/borrowing">
            <template slot="title">
              <i class="el-icon-document"></i>借阅管理
            </template>
            <el-menu-item index="/back/borrowing/borrowingList">
            <i class="el-icon-s-operation"></i>借阅信息</el-menu-item>
            <el-menu-item index="/back/borrowing/handleBorrowing">
            <i class="el-icon-s-operation"></i>处理借阅</el-menu-item>
            <el-menu-item index="/back/borrowing/handleReturn">
            <i class="el-icon-s-operation"></i>处理归还</el-menu-item>
          </el-submenu>
          <el-submenu index="/back/user">
            <template slot="title">
              <i class="el-icon-user-solid"></i>读者管理
            </template>
            <el-menu-item-group>
              <el-menu-item index="/back/user/userList">
              <i class="el-icon-s-operation"></i>用户列表</el-menu-item>
              <el-menu-item index="/back/user/addUser">
              <i class="el-icon-s-operation"></i>添加用户</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="/back/statistics">
            <template slot="title">
              <i class="el-icon-s-data"></i>统计管理
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
          <el-submenu index="/back/category">
            <template slot="title" >
              <i class="el-icon-s-order"></i>分类管理
            </template>
            <el-menu-item index="/back/category/categoryList">
              <i class="el-icon-s-operation"></i>分类列表</el-menu-item>
            <el-menu-item index="/back/category/addCategory">
              <i class="el-icon-s-operation"></i>新增类别</el-menu-item>
          </el-submenu>
          <el-menu-item index="/back/grantPrivilege" >
            <i class="el-icon-s-operation"></i>权限管理
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px; background-color: rgb(238, 241, 246)">
         
          <el-dropdown  @command="handleCommand" style="margin-top:1%">
            <i class="el-icon-user" style="font-size: 25px; margin-right: 15px;"></i>
            <el-dropdown-menu slot="dropdown" style="margin-top:-1%">
              <el-dropdown-item command="userDeatil">个人中心</el-dropdown-item>
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
export default {
  name: 'index',
  components: {
  },
  data () {
    return {
      levelList: null,
      routerList: [],
      user:{}
    }
  },
  computed: {
    
  },
  watch: {
    $route: {
    handler: function(val, oldVal){
        console.log(val);
        this.routerList = this._routerRoot._route.matched
      },
      // 深度观察监听
      deep: true
    }
  },
  methods: {
    showRouter(){
      
    },
    handleCommand(com){
      if(com == 'logout'){
        this.logout()
      }
    },
    logout(){
      window.localStorage.removeItem("userDetail")
      window.localStorage.removeItem("token")
      this.$router.push({path:'/login'})
    }
  },
  created () {
    this.user = JSON.parse(window.localStorage.getItem('userDetail'))
    this.routerList = this._routerRoot._route.matched
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
