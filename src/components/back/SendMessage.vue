<template>
  <div>
    <el-form ref="form" :model="message" :rules="formRule"  label-width="80px" style="marginLeft: 15%;marginTop:2%">
      <el-form-item label="发送方式" prop="classIdList">
        <el-switch
          v-model="message.singleSend"
          active-text="单发"
          inactive-text="群发"
          @change="changeSendMethod"
          >
        </el-switch>
      </el-form-item>
      <el-form-item v-if="message.singleSend" label="接收用户" prop="receivers">
        <el-input  style="width: 300px" placeholder="请输入用户名称" v-model="message.receivers"  >
        </el-input>
      </el-form-item>
      <el-form-item v-if="!message.singleSend" label="接收群体" prop="receivers">
        <el-cascader style="width: 400px"
          v-model="message.receivers"
          :options="classOptions"
          placeholder="请选择接收用户群体"
          change-on-select
          :props="props"
          >
        </el-cascader>
      </el-form-item>
      <el-form-item label="消息内容" prop="messageContent">
        <el-input v-model="message.messageContent" type="textarea"  placeholder="请输入内容"
          style="width: 600px"
          :rows="8"
          maxlength="500"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="发送时间">
        <el-date-picker style="width:300px"
          v-model="message.sendTime"
          type="datetime"
          placeholder="请选择发送时间，默认为立即发送">
        </el-date-picker>
      </el-form-item>
      
      <el-form-item label="发送渠道">
        <el-checkbox v-model="message.sendAccount">发送到账号</el-checkbox>
        <el-checkbox v-model="message.sendEmail">发送到邮箱</el-checkbox>
      </el-form-item>

      <el-form-item>
        <el-button @click="sendMessage('form')" type="primary" icon="el-icon-thumb"> 推送</el-button>
        <el-button @click="reset('form')" type="info"> 重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
const Qs = require('qs');
export default {
    data(){
        return{
            classOptions: {},
            message: {
              singleSend: false,
              receivers: undefined,
              sendAccount: true,
              sendEmail: true,
              messageContent: '',
              sendTime: null,
            },
            formRule: {
              receivers: [
                { required: true, message: '请选择接收群体', trigger: 'blur' },
              ],
              messageContent: [
                { required: true, message: '请输入消息内容', trigger: 'blur' }
              ],

            },
            props:{
              multiple:true
            },
            user: { userName: undefined}

        }
    },
    created(){
        this.getClassInfo()
        this.user = JSON.parse(localStorage.getItem('userDetail'))
    },
    methods: {
        changeSendMethod(){
          this.message.receivers = null
        },
        reset(){
          this.message =  {
              singleSend: false,
              receivers: undefined,
              sendAccount: true,
              sendEmail: true,
              messageContent: '',
              sendTime: null,
            }
        },
        sendMessage(form){
          this.$refs[form].validate((valid) => {
            if (valid) {
              if(!this.message.singleSend){
                this.message.receivers = JSON.stringify(this.message.receivers)
              }
              axios.get('/sendMessage', {
                params: {
                  singleSend: this.message.singleSend,
                  receivers: this.message.receivers,
                  messageContent: this.message.messageContent,
                  sendAccount: this.message.sendAccount,
                  sendEmail: this.message.sendEmail,
                  sender: this.user.userName,
                  sendTime: moment(this.message.sendTime).format('YYYY-MM-DD HH:mm:ss') 
                },   
                paramsSerializer: function(params) {
                            return Qs.stringify(params, {arrayFormat: 'repeat'})
                }
              }).then( res => {
                if(res.data.code == 200){
                  this.message = {}
                  this.classIdList = []
                  this.$message(res.data.message)
                } else {
                  this.$message.error(res.data.message)
                }
              })
            }
          })
        },
        getClassInfo () {
            axios.get('/dictionaryData/class/getClassInfo').then(res => {
                if (res.data.code == 200) {
                this.classOptions = res.data.data
                if(this.classOptions != null && this.classOptions != undefined){
                    this.classOptions = this.getTreeData(this.classOptions)
                }
                }
            })
        },
        getTreeData (data) {
            // 循环遍历json数据
            for (var i = 0; i < data.length; i++) {
                if (data[i].children.length < 1) {
                // children若为空数组，则将children设为undefined
                data[i].children = undefined
                } else {
                // children若不为空数组，则继续 递归调用 本方法
                this.getTreeData(data[i].children)
                }
            }
            return data
        }
    }
}
</script>

<style>

</style>