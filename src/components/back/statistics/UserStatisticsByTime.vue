<template>
  <div class="content">
      <ve-line
      :data="chartData"
      :loading="loading"
      :data-empty="dataEmpty"
      :settings="chartSettings"
      :extend="extend"
      >
      </ve-line>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    this.chartSettings = {
      yAxisType: ['0,0a']
    },
    this.extend = {
        series: {
          label: { show: true, position: "top" }
        }
    }
    return {
      chartData: {
        columns: ['时间', '新增用户数量'],
        rows: []
      },
      loading: false,
      dataEmpty: false
    }
  },
  methods: {
    getData () {
      axios.get('/statistics/readerNumbersByTime').then(res => {
        this.chartData.rows = res.data.data
      })
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>

</style>
