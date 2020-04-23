<template>
  <div class="content">
      <el-row :gutter="20" bodar style="margin-top: -50px">
        <el-col :span="5" style="height:100px;width:20%">
          <el-card class="grid-content bg-purple"  >
            <div slot="header" class="clearfix"  style="height: 5px">
                    <span>用户总量</span>
            </div>
            <i class="el-icon-user" style="font-size: 40px; margin-top: 10%" ></i>
            <p style="float: right;  margin-top: 15%;">{{yesterdayInfo.totalUser}}</p>
          </el-card>
        </el-col>

        <el-col :span="5" style="height:100px;width:20%">
          <el-card class="grid-content bg-purple"  >
            <div slot="header" class="clearfix"  style="height: 5px">
                    <span>书籍总量</span>
            </div>
            <i class="el-icon-notebook-2" style="font-size: 40px; margin-top: 10%"></i>
            <p style="float: right;  margin-top: 15%;"> {{yesterdayInfo.totalPaperBook}}</p>
          </el-card>
        </el-col>

        <el-col :span="5" style="height:100px;width:20%">
          <el-card class="grid-content bg-purple"   >
            <div slot="header" class="clearfix"  style="height: 5px">
                    <span>借出书籍总量</span>
            </div>
            <i class="el-icon-s-grid" style="font-size: 40px; margin-top: 10%"></i>
            <p style="float: right;  margin-top: 15%;">{{yesterdayInfo.totalLentBook}}</p>
          </el-card>
        </el-col>
      </el-row>

    <el-card  style="margin: 70px 0px 0px 0px;padding: 0px;" >
          <div slot="header" style="width:100%;height:20px;
                    padding-left: 0px; margin: 0px">
                    <span>昨日借阅详情</span>
          </div>
          <el-row :gutter="20" bodar>
            <el-col :span="4" style="height:100px;width:20%;padding: 0px">
              <p style="color: black">申请借阅 </p>
              <p >{{yesterdayInfo.yesterdayApply}}</p>
            </el-col>
            <el-col :span="4" style="height:100px;width:20%;padding: 0px">
                <p style="color: black">处理借阅</p>
                <p> {{yesterdayInfo.yesterdayHandle}}</p>
            </el-col>
            <el-col :span="4" style="height:100px;width:20%;padding: 0px">
              <p style="color: black">处理归还 </p>
                <p>{{yesterdayInfo.yesterdayReturn}}</p>
            </el-col>
          </el-row>
    </el-card>

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
      }
    },
    this.lineSettings = {
      metrics: ['totalUser', 'totalPaperBook', 'totalLentBook'],
      dimension: ['period'],
      labelMap: {
        'totalUser': '用户总量',
        'totalPaperBook': '书籍总量',
        'totalLentBook': '借出书籍'
      },
      showLine: ['totalUser', 'totalPaperBook', 'totalLentBook']
    }
    return {
      yesterdayInfo: {},
      chartData: {
        columns: ['period', 'totalUser', 'totalPaperBook', 'totalLentBook', 'yesterdayApply', 'yesterdayHandle', 'yesterdayReturn'],
        rows: []
      }
    }
  },
  created () {
    this.getYesterdayInfo()
    this.getAllStatisticsInfo()
  },
  methods: {
    getYesterdayInfo () {
      axios.get('/statistics/query/yesterdayInfo').then(res => {
        if (res && res.data.code == 200) {
          this.yesterdayInfo = res.data.data
        }
      })
    },
    getAllStatisticsInfo () {
      axios.post('/statistics/all').then(res => {
        if (res && res.data.code == 200) {
          this.chartData.rows = res.data.data
        }
      })
    }
  }
}
</script>

<style scoped>
.el-col{
  margin-top: 5%;
  margin-left: 10%;
}
p{
  color: #f56c6c;
  font-size: 20px;
  text-align: center;
  margin: 0px;
  padding: 0px;
}
</style>
