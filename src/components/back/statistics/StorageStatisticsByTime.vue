<template>
  <div class="content">
      <ve-line
      :data="chartData"
      :loading="loading"
      :data-empty="dataEmpty"
      :settings="chartSettings">
      </ve-line>

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
      timeslot: 'DAY'
    }
  },
  methods: {
    getData () {
      axios.get('/statistics/bookStorageByTime?timeSlot=' + this.timeslot).then(res => {
        this.chartData.rows = res.data.data
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
