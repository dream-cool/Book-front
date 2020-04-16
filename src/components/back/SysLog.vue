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
import DynamicTbale from '../common/DynamicTbale.vue'
export default {
    components: {
        DynamicTbale
    },
    data(){
        return{
            logCondition:{},
            pageNum: 1,
            pageSize: 10,
            total: 0,
            table: {
                data: []
            },
            columns: [
                
                {
                label: '操作用户',
                prop: 'userName',
                width: '100px',
                editAble: false,
                editType: 'el-input',
                required: true,
                initialValue: '',
                attribute: {}
                },
                {
                label: '日志描述',
                prop: 'operation',
                width: '200px',
                editAble: false,
                editType: 'el-input',
                required: true,
                initialValue: '',
                attribute: {}
                },
                { 
                label: '日志类型',
                width: '100px',
                prop: 'type',
                editAble: false,
                editType: 'el-input',
                required: true,
                initialValue: null,
                attribute: { type: 'primary', underline: false}
                },
                { 
                label: '耗时(毫秒)',
                prop: 'spendTime',
                width: '100px',
                editAble: true,
                editType: 'el-input',
                required: true,
                initialValue: null
                },
                {
                label: 'url',
                prop: 'url',
                width: '300px',
                editAble: true,
                editType: 'el-input-number',
                required: false,
                attribute: {}
                },
                {
                label: '主机',
                prop: 'ip',
                width: '250px',
                editAble: true,
                editType: 'el-input-number',
                required: false,
                attribute: {}
                },
                { 
                label: '调用方法',
                prop: 'method',
                width: '400px',
                editAble: false,
                editType: 'el-input',
                required: false,
                initialValue: null
                },
                { label: '操作时间',
                prop: 'startTime',
                editAble: true,
                editType: 'el-input',
                required: true,
                initialValue: null
                },
                

            ],
        }
    },
    created(){
        this.getLogData(this.pageNum, this.pageSize, this.logCondition)
    },
    methods: {
        getLogData (pageNum, pageSize, logCondition) {
            axios.post('/webLog/all?pageNum=' + pageNum + '&pageSize=' + pageSize, logCondition ).then(res => {
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
            this.getLogData(val, this.pageSize, this.logCondition)
        }

    }

}
</script>

<style>

</style>