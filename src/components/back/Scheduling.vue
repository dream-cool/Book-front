<template>
  <div>
      <DynamicTbale :columns="columns" :table="table" :operations="operations" > </DynamicTbale>
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
                width: '50px',
                editAble: false,
                editType: 'el-input',
                required: true,
                initialValue: '',
                attribute: {}
                },
                {
                label: '任务名称',
                prop: 'taskName',
                width: '180px',
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
                width: '150px',
                editAble: true,
                editType: 'el-switch',
                required: true,
                attribute: { activeText: '启用', inactiveText: '禁用', activeValue: 1, inactiveValue: 0},
                formatter: function (val) {
                        if (val == '1') {
                        return '启用'
                        } else if (val == '0') {
                        return '禁用'
                        }
                    }
                },
                {
                label: '备注',
                prop: 'note',
                width: '250px',
                editAble: true,
                editType: 'el-input',
                required: false,
                attribute: {}
                },
                {
                label: '创建时间',
                prop: 'createTime',
                width: '200px',
                editAble: false,
                editType: 'el-input-number',
                required: false,
                attribute: {}
                }
            ],
            operations: [
                { text: '执行一次', intention: 'add', click: this.executeOnce , icon: 'el-icon-caret-right', type: 'primary' },
                { text: '编辑', intention: 'edit', icon: 'el-icon-edit', type: 'primary'  },
                { text: '保存', intention: 'save', click: this.update , icon: 'el-icon-check ', type: 'primary' },
                { text: '取消', intention: 'cancel',icon: 'el-icon-caret-right' , icon: 'el-icon-close ', type: 'primary' },
            ]
        }
    },
    created(){
        this.getSchedulingData(this.pageNum, this.pageSize, this.scheduling)
    },
    methods: {
        executeOnce(index, row){
            axios.get('/' + row.taskCode + '/executeOnce').then ( res => {
                if(res && res.data.code == 200){
                    this.$message(res.data.message)
                } else {
                    this.$message.error('任务执行失败')
                }
            })
        },
        update(index, row){
            axios.put('/schedulingTask', row).then( res => {
                if(res && res.data.code == 200){
                    var task = res.data.data
                    axios.get('/' + task.taskCode + '/changeTask').then( res => {
                        if(res && res.data.code == 200){
                            this.$message(res.data.message)
                        } else {
                            this.$message('修改失败')
                        }
                    })
                } else {
                    this.$message.error('修改失败')
                }
            })
        },
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