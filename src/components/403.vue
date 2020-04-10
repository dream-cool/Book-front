<template>
  <div>
    <div class="app-container">
      <el-col :span="12">
        <img :src="img_403" alt="403" class="img-style">
      </el-col>
      <el-col :span="12">
        <div style="margin-left: 100px;margin-top: 60px">
          <h2 style="color: #606266"></h2>
          <div style="color:#909399;font-size: 14px">很抱歉，该页面您暂时没有权限！如有必要请联系相关管理人员来获得权限</div>
          <el-button style="margin-top: 20px" type="primary" round @click="handleGoMain">返回首页</el-button>
          <el-button style="margin-top: 20px" type="primary" round @click="goBack">后退</el-button>
        </div>
      </el-col>
    </div>
  </div>
</template>

<script>
import img_403 from '../assets/imgages/img_403.png'
export default {
  name: 'wrongPage',
  data () {
    return {
      img_403
    }
  },
  methods: {
    goBack () {
      history.go(-1)
    },
    handleGoMain () {
      this.$router.push({path: '/back'})
    }
  }
}
</script>

<style scoped>
  .app-container {
    width: 80%;
    margin: 120px auto;
  }
  .img-style {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
</style>
