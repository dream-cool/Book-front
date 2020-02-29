<template>
  <div class="backIndex">
    <el-container style="height: 880px; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(256, 256, 256)">
        <el-menu default-active="2" router>
          <el-menu-item index="/home">
            <i class="el-icon-back"></i>返回首页
          </el-menu-item>
          <el-submenu index="/back/booksManager">
            <template slot="title">
              <i class="el-icon-notebook-1"></i>书籍管理
            </template>
            <el-menu-item index="/back/booksManager">书籍列表</el-menu-item>
            <el-menu-item index="/back/addBook">新增书籍</el-menu-item>
            <el-menu-item index="/back/bookDetail/:id">修改书籍</el-menu-item>
            <el-menu-item index="/back/ebookRead">电子书在线阅读</el-menu-item>
            
          </el-submenu>
          <el-submenu index="/back/borrowingManager">
            <template slot="title">
              <i class="el-icon-document"></i>借阅管理
            </template>
            <el-menu-item index="/back/borrowingManager">借阅信息</el-menu-item>
            <el-menu-item index="/back/handleBorrowing">处理借阅</el-menu-item>
            <el-menu-item index="/back/borrowingDetail/:id">修改借阅</el-menu-item>
          </el-submenu>
          <el-submenu index="/back/userManager">
            <template slot="title">
              <i class="el-icon-user-solid"></i>读者管理
            </template>
            <el-menu-item-group>
              <el-menu-item index="/back/userManager">用户列表</el-menu-item>
              <el-menu-item index="/back/addUser">添加用户</el-menu-item>
              <el-menu-item index="/back/userDetail/:id">修改用户</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="/back/storageStatistics">
            <template slot="title">
              <i class="el-icon-s-data"></i>统计管理
            </template>
            <el-menu-item index="/back/storageStatistics">藏量统计</el-menu-item>
            <el-menu-item index="/back/categoryStatistics">类别统计</el-menu-item>
            <el-menu-item index="/back/borrowingStatistics">借阅统计</el-menu-item>
          </el-submenu>
          <el-submenu index="/back/categoryManager">
            <template slot="title">
              <i class="el-icon-s-order"></i>分类管理
            </template>
            <el-menu-item index="/back/categoryManager">分类列表</el-menu-item>
            <el-menu-item index="/back/addCategory">新增类别</el-menu-item>
            <el-menu-item index="/back/categoryDetail/:id">修改类别</el-menu-item>
          </el-submenu>
          <el-submenu index="/back/grantPrivilege">
            <template slot="title">
              <i class="el-icon-s-operation"></i>权限管理
            </template>
            <el-menu-item index="/back/grantPrivilege">授予权限</el-menu-item>
            <el-menu-item index="/back/recoveryPrivilege">回收权限</el-menu-item>
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

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'adminIndex',
  data () {
    return {
      msg: 'message',
      active: 1
    }
  },

  created () {},

  methods: {},

  components: {}
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
