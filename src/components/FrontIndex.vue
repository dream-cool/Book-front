<template>
  <div class="content">
    <el-container>
      <el-header>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="0">
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
          <el-submenu index="4" style="float: right;width: 100px">
            <template slot="title">        
              <el-avatar :size="50" :src="circleUrl"></el-avatar>
            </template>
            <el-menu-item index="4-1">个人中心</el-menu-item>
            <el-menu-item index="4-2">修改密码</el-menu-item>
            <el-menu-item index="4-3">我的借阅</el-menu-item>
            <el-menu-item index="4-4" @click="drawer = true">浏览记录</el-menu-item>
            <el-menu-item index="4-5">退出</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <el-main>
        <el-carousel :interval="4000" type="card" height="200px">
          <el-carousel-item v-for="item in 6" :key="item">
            <h3 class="medium">{{ item }}</h3>
          </el-carousel-item>
        </el-carousel>

        <router-view></router-view>
        
      </el-main>

      <el-drawer title="足迹" :visible.sync="drawer" :direction="direction">
          <div class="block" v-for="fit in 6" :key="fit">
            <time class="time">{{ fit }}</time>
            <el-image
              style="width: 100px; height: 100px"
              :src="url"
              :fit="fit">
            </el-image>
            <el-divider></el-divider>
          </div>
        </el-drawer>

      <el-footer>Footer</el-footer>
  </el-container>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      circleUrl: '../../static/favicon.ico',
      drawer: false,
      direction: 'rtl',
      activeIndex: '1',
      activeIndex2: '1'
    }
  },
  created () {
  },

  methods: {
    handleSelect () {

    }
  }
}
</script>

<style>
.el-header {
  margin-top: -20px;
}
.el-footer {
  color: #333;
  text-align: center;
  line-height: 50px;
}

.el-main {
  color: green;
  text-align: center;
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

.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.el-carousel{
  margin-left: 100px;
  margin-right: 100px
}
</style>
