<template>
  <div class="content">
      <ve-line
      :data="chartData"
      :loading="loading"
      :data-empty="dataEmpty"
      :settings="chartSettings">
      </ve-line>
      <el-date-picker style="margin-left: 30%"
        v-model="timeRange"
        type="daterange"
        align="right"
        value-format="timestamp"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="getData"
        :picker-options="pickerOptions">
      </el-date-picker>

      <el-radio-group @change="handleChangeTime" v-model="timeslot" >
                <el-radio :label="'YEAR'">年</el-radio>
                <el-radio :label="'MONTH'">月</el-radio>
                <el-radio :label="'DAY'">日</el-radio>
      </el-radio-group>
      
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    this.chartSettings = {
      yAxisType: ['0,0a'],
      labelMap: {
        'books': '新增书籍',
        'paperBooks': '新增纸质书籍',
        'ebooks': '新增电子书籍'
      }
      
    }
    return {
      chartData: {
        columns: ['date', 'books', 'paperBooks', 'ebooks'],
        rows: []
      },
      loading: false,
      dataEmpty: false,
      timeslot: 'DAY',
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        timeRange: []
    }
  },
  methods: {
    getData () {
      axios.get(
        '/statistics/bookStorageByTime?timeSlot=' 
        + this.timeslot + '&start='+this.timeRange[0]+'&end='+this.timeRange[1]
      ).then(res => {
        this.chartData.rows = res.data.data
        console.log(this.timeRange)
      })
    },

    handleChangeTime () {
      this.getData()
    }

  },
  created () {
    
    this.getData()
  }
}
</script>

<style scoped>

</style>
