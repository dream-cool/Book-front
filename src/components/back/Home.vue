<template>
  <div class="content">
      <el-row :gutter="20" bodar>
        <el-col :span="5" style="height:100px;width:300px">
          <card class="grid-content bg-purple">
            <i class="el-icon-user" style="font-size: 40px; margin-top: 10%" ></i>
            <p>用户总量{{yesterdayInfo.totalUser}}</p>
          </card>
        </el-col>

        <el-col :span="5" style="height:100px;width:300px">
          <card class="grid-content bg-purple">
            <i class="el-icon-notebook-2" style="font-size: 40px; margin-top: 10%"></i>
          <p>书籍总量{{yesterdayInfo.totalPaperBook}}</p>
          </card>
        </el-col>

        <el-col :span="5" style="height:100px;width:300px">
          <card class="grid-content bg-purple" >
          <p>借出书籍总量{{yesterdayInfo.totalLentBook}}</p>
          </card>
        </el-col>
      </el-row>

    <card class="grid-content bg-purple">
        <div slot="header" class="clearfix"
                style="width:100%;height:60px;
                  background-color: rgb(241,245,252);padding: 0px;margin-top: 50px
                  margin-left: 100px;margin-bottom: 0px; margin-right: 50px;">
                  <span>昨日借阅详情</span>
        </div>
          <el-row :gutter="20" bodar>
            <el-col :span="4" style="height:100px;width:200px;padding: 0px">
              
                
                <p> {{yesterdayInfo.yesterdayApply}}</p> 
              
            </el-col>
            <el-col :span="4" style="height:100px;width:200px;padding: 0px">
              
                <p> {{yesterdayInfo.yesterdayHandle}}</p>
            </el-col>
            <el-col :span="4" style="height:100px;width:200px;padding: 0px">
              
                <p> {{yesterdayInfo.yesterdayReturn}}</p> 
            </el-col>
          </el-row>
    </card>

      <div>
        <el-card style="width:100%; margin-top:5%" >
          <div slot="header" class="clearfix">
            <span>近一周的借阅处理</span>
          </div>
          <ve-histogram :data="chartData" :settings="histSettings" ></ve-histogram>
        </el-card>
        
        <el-card style="width:100%; margin-top:5%">
          <div slot="header" class="clearfix">
            <span>近一周的变化趋势</span>
          </div>
          <ve-line :data="chartData" :settings="lineSettings" style="margin-top:20px; width: 1200px"></ve-line>
        </el-card>
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
