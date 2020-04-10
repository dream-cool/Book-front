<template>
  <div class="content">
      <el-row :gutter="20" bodar>
        <el-col :span="5" style="height: 110px;margin-left: 5%;
           box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
          <div class="grid-content bg-purple">
            <i class="el-icon-user" style="font-size: 40px; margin-top: 10%"  ></i>
          <p>用户总量</p>
          </div></el-col>
        <el-col :span="5" style="height: 110px;margin-left: 10%;
           box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
          <div class="grid-content bg-purple">
            <i class="el-icon-notebook-2" style="font-size: 40px; margin-top: 10%"></i>
          <p>书籍总量</p>
          </div></el-col>
        <el-col :span="5" style="height: 110px;margin-left: 10%;
           box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
          <div class="grid-content bg-purple" >
          <p>借出书籍总量</p>
          </div></el-col>
      </el-row>

      <el-row :gutter="20" bodar>
        <el-col :span="4">
          <div class="grid-content bg-purple">
          <p>昨日申请借阅 111</p> </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
          <p>昨日处理借阅 222</p> </div>
        </el-col>
        <el-col :span="4">
        <div class="grid-content bg-purple">
          <p>昨日归还333</p> </div>
        </el-col>
      </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: '授权'
    }
  }
}
</script>

<style scoped>
.el-col{
  margin-top: 5%;
  height: 300px;
  margin-left: 10%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
p{
  font-size: 20px;
  margin-top: 15%;
  float: right;
}
</style>
