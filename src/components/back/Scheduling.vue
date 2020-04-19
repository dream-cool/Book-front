<template>
  <div>
      <DynamicTbale :columns="columns" :table="table"  > </DynamicTbale>
      <el-pagination
          style="margin-top: 10px"
          background
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import DynamicTbale from '../common/DynamicTbale.vue'
export default {
    components: {
        DynamicTbale
    },
    data(){
        return{
            scheduling: {},
            pageNum: 1,
            pageSize: 10,
            total: 0,
            table: {
                data: []
            },
            columns: [
                {
                label: '编号',
                prop: 'id',
                width: '100px',
                editAble: false,
                editType: 'el-input',
                required: true,
                initialValue: '',
                attribute: {}
                },
                {
                label: '任务名称',
                prop: 'taskName',
                width: '200px',
                editAble: false,
                editType: 'el-input',
                required: true,
                initialValue: '',
                attribute: {}
                },
                { 
                label: 'cron表达式',
                width: '200px',
                prop: 'cronExpr',
                editAble: true,
                editType: 'el-input',
                required: true,
                initialValue: null,
                attribute: { }
                },
                { 
                label: '状态',
                prop: 'status',
                width: '100px',
                editAble: true,
                editType: 'el-switch',
                required: true,
                initialValue: null
                },
                {
                label: '备注',
                prop: 'note',
                width: '200px',
                editAble: true,
                editType: 'el-input',
                required: false,
                attribute: {}
                },
                {
                label: '创建时间',
                prop: 'createTime',
                width: '250px',
                editAble: false,
                editType: 'el-input-number',
                required: false,
                attribute: {}
                }
                
            ],
        }
    },
    created(){
        this.getSchedulingData(this.pageNum, this.pageSize, this.scheduling)
    },
    methods: {
        getSchedulingData (pageNum, pageSize, scheduling) {
            axios.post('/schedulingTask/all?pageNum=' + pageNum + '&pageSize=' + pageSize, scheduling ).then(res => {
                if (res.data.code == 200) {
                    this.table.data = res.data.data.list
                    this.pageNum = res.data.data.pageNum
                    this.pageSize = res.data.data.pageSize
                    this.total = res.data.data.total
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        handleCurrentChange(val){
            this.getSchedulingData(val, this.pageSize, this.scheduling)
        }
       
    }
}
</script>

<style>

</style>