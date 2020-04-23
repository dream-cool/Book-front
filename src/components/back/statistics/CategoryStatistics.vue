<template>
  <div class="content">
    <el-row :gutter="20" bodar >
      <el-col :span="10">
        <el-card >
          <div slot="header" style="width:100%;height:20px;
                        padding-left: 0px; margin: 0px">
                        <span>书籍类别占比统计</span>
          </div>
          <ve-pie  :data="chartData" :extend="extend"></ve-pie>
        </el-card>
      </el-col>
      <el-col :span="10" style="margin-left:10%">
        <el-card>
          <div slot="header" style="width:100%;height:20px;
                        padding-left: 0px; margin: 0px">
                        <span>书籍借阅占比统计</span>
          </div>
          <BorrowingStatistics ></BorrowingStatistics>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
import BorrowingStatistics from './BorrowingStatistics'
export default {
  components:{
    BorrowingStatistics
  },
  data () {
    this.extend = {
        series: {
          label: { show: true, position: "top" }
        }
    }
    return {
      chartData: {
        columns: ['title', 'numbers'],
        rows: [
        ]
      }
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      axios.get('/statistics/bookStorageByCategory').then(res => {
        this.chartData.rows = res.data.data
      })
    }
  }
}
</script>

<style scoped>

</style>
