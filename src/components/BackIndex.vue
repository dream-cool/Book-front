<template>
  <div class="backIndex">
    <el-container style="height: 880px; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(256, 256, 256)">
        <el-menu default-active="2" router>
          <el-menu-item index="/back/home">
            <i class="el-icon-back"></i>返回首页
          </el-menu-item>
          <el-submenu index="/back/book">
            <template slot="title">
              <i class="el-icon-notebook-1"></i>书籍管理
            </template>
            <el-menu-item index="/back/book/bookList">书籍列表</el-menu-item>
            <el-menu-item index="/back/book/addBook">新增书籍</el-menu-item>
            <el-menu-item index="/front/ebookRead">电子书在线阅读</el-menu-item>
          </el-submenu>
          <el-submenu index="/back/borrowing"> 
            <template slot="title">
              <i class="el-icon-document"></i>借阅管理
            </template>
            <el-menu-item index="/back/borrowing/borrowingList">借阅信息</el-menu-item>
            <el-menu-item index="/back/borrowing/handleBorrowing">处理借阅</el-menu-item>
            <el-menu-item index="/back/borrowing/handleReturn">处理归还</el-menu-item>
          </el-submenu>
          <el-submenu index="/back/user">
            <template slot="title">
              <i class="el-icon-user-solid"></i>读者管理
            </template>
            <el-menu-item-group>
              <el-menu-item index="/back/user/userList">用户列表</el-menu-item>
              <el-menu-item index="/back/user/addUser">添加用户</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="/back/statistics">
            <template slot="title">
              <i class="el-icon-s-data"></i>统计管理
            </template>
            <el-menu-item index="/back/statistics/storageStatistics">藏量统计</el-menu-item>
            <el-menu-item index="/back/statistics/categoryStatistics">类别统计</el-menu-item>
            <el-menu-item index="/back/statistics/borrowingStatistics">借阅统计</el-menu-item>
          </el-submenu>
          <el-submenu index="/back/category">
            <template slot="title" >
              <i class="el-icon-s-order"></i>分类管理
            </template>
            <el-menu-item index="/back/category/categoryList">分类列表</el-menu-item>
            <el-menu-item index="/back/category/addCategory">新增类别</el-menu-item>
          </el-submenu>
          <el-submenu index="/back/privilege" >
            <template slot="title">
              <i class="el-icon-s-operation"></i>权限管理
            </template>
            <el-menu-item index="/back/privilege/grantPrivilege">授予权限</el-menu-item>
            <el-menu-item index="/back/privilege/recoveryPrivilege">回收权限</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px; background-color: rgb(238, 241, 246)">
          <el-dropdown>
            <i class="el-icon-user" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>测试人员</span>
        </el-header>

        <div class="navbar clearfix">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item v-for="item in levelList" :key="item.path">
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
  data() {
    return {
      levelList: null
    }
  },
  computed: {
 
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb() {
      //$route.matched一个数组 包含当前路由的所有嵌套路径片段的路由记录
      let matched = this.$route.matched.filter(item => item.name)
      this.levelList = matched
    }
  },
  created() {
    this.getBreadcrumb()
  },
  mounted() {
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
