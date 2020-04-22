<template>
    <div>
        <el-form :model="logCondition" :inline="true"  label-width="150px" class="demo-form-inline">
          <el-form-item label="类型">
            <el-select v-model="logCondition.type" placeholder="全部" clearable >
                <el-option label="登录" value="登录"> </el-option>
                <el-option label="查询" value="查询"> </el-option>
                <el-option label="新增" value="新增"> </el-option>
                <el-option label="修改" value="修改"> </el-option>
                <el-option label="删除" value="删除"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="耗时大于" prop="spendTime">
            <el-input-number v-model="logCondition.spendTime" controls-position="right"
                :min="0" :max="10000"></el-input-number>
          </el-form-item>
          <el-form-item label="操作时间早于" prop="startTime">
            <el-date-picker
                v-model="logCondition.startTime"
                type="datetime"
                placeholder="全部"
                format="yyyy-MM-dd HH:mm:ss"
                >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search()">搜索</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>

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
            logCondition:{
                spendTime: 0
            },
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
                label: '调用方法',
                prop: 'method',
                width: '250px',
                editAble: false,
                editType: 'el-input',
                required: false,
                initialValue: null
                },
                {
                label: '主机',
                prop: 'ip',
                width: '220px',
                editAble: true,
                editType: 'el-input-number',
                required: false,
                attribute: {}
                },
                {
                label: '地址',
                prop: 'addr',
                width: '200px',
                editAble: true,
                editType: 'el-input-number',
                required: false,
                attribute: {}
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
        this.search()
    },
    methods: {
        search(){
            this.getLogData(this.pageNum, this.pageSize, this.logCondition)
        },
        resetForm(){
            this.logCondition = { spendTime: 0}
            this.search()
        },
        getLogData (pageNum, pageSize, logCondition) {
            if(logCondition.startTime != null){
                this.logCondition.startTime = moment(logCondition.startTime).format('YYYY-MM-DD HH:mm:ss')
                
            }
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