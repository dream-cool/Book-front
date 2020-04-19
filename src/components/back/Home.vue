<template>
  <div class="content">
      <el-row :gutter="20" bodar>
        <el-col :span="5" style="height: 110px;margin-left: 5%;
           box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
          <div class="grid-content bg-purple">
            <i class="el-icon-user" style="font-size: 40px; margin-top: 10%"  ></i>
          <p>用户总量{{yesterdayInfo.totalUser}}</p>
          </div></el-col>
        <el-col :span="5" style="height: 110px;margin-left: 10%;
           box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
          <div class="grid-content bg-purple">
            <i class="el-icon-notebook-2" style="font-size: 40px; margin-top: 10%"></i>
          <p>书籍总量{{yesterdayInfo.totalPaperBook}}</p>
          </div></el-col>
        <el-col :span="5" style="height: 110px;margin-left: 10%;
           box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
          <div class="grid-content bg-purple" >
          <p>借出书籍总量{{yesterdayInfo.totalLentBook}}</p>
          </div></el-col>
      </el-row>

      <el-row :gutter="20" bodar>
        <el-col :span="4">
          <div class="grid-content bg-purple">
          <p>昨日申请借阅 {{yesterdayInfo.yesterdayApply}}</p> </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
          <p>昨日处理借阅 {{yesterdayInfo.yesterdayHandle}}</p> </div>
        </el-col>
        <el-col :span="4">
        <div class="grid-content bg-purple">
          <p>昨日归还 {{yesterdayInfo.yesterdayReturn}}</p> </div>
        </el-col>
      </el-row>
      <div>
        <ve-histogram :data="chartData" :settings="histSettings"  style="margin-top:20px; width: 1200px"></ve-histogram>

        <ve-line :data="chartData" :settings="lineSettings" style="margin-top:20px; width: 1200px"></ve-line>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    this.histSettings = {
      metrics: ['yesterdayApply', 'yesterdayHandle', 'yesterdayReturn'],
      dimension: ['period'],
      labelMap: {
        'yesterdayApply': '申请借阅',
        'yesterdayHandle': '处理借阅',
        'yesterdayReturn': '归还'
      },
    },
    this.lineSettings = {
      metrics: ['totalUser', 'totalPaperBook', 'totalLentBook'],
      dimension: ['period'],
      labelMap: {
        'totalUser': '用户总量',
        'totalPaperBook': '书籍总量',
        'totalLentBook': '借出书籍',
      },
      showLine: ['totalUser', 'totalPaperBook', 'totalLentBook']
    }
    return {
      yesterdayInfo:{},
      chartData: {
          columns: ['period','totalUser', 'totalPaperBook', 'totalLentBook', 'yesterdayApply', 'yesterdayHandle', 'yesterdayReturn'],
          rows: []
      },
    }
  },
  created(){
    this.getYesterdayInfo()
    this.getAllStatisticsInfo()
  },
  methods: {
    getYesterdayInfo(){
      axios.get('/statistics/query/yesterdayInfo').then( res => {
        if(res && res.data.code == 200){
          this.yesterdayInfo = res.data.data
        }
      })
    },
    getAllStatisticsInfo(){
      axios.post('/statistics/all').then(res => {
        if(res && res.data.code == 200){
          this.chartData.rows =  res.data.data
        }
      })
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
