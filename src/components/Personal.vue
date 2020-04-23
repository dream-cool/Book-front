<template>
  <div class="content">
    <el-main>
      <div class="user">
        <div class="bookImg" >
             <el-form :model="beforeUser" :rules="userRules" ref="userRules" label-width="100px" class="demo-ruleForm">
              <el-form-item label="头像">
                    <el-upload
                      :multiple="false"
                      :action="server_URL+'/file'"
                      accept="image/png,image/jpg,image/jpeg"
                      :on-success="handleAvatarUploadSuccess"
                      >
                      <div class="el-upload__tip" slot="tip">只支持jpg/png/jpeg文件</div>
                        <el-avatar v-if="beforeUser.avatar != null "  fit="fill"
                        :size="150"  :src='server_URL+"/download/"+beforeUser.avatar' style="float:left">{{beforeUser.userName}}</el-avatar>
                    </el-upload>
              </el-form-item>
              <el-form-item label="用户名">
                <el-input v-model="beforeUser.userName" disabled></el-input>
              </el-form-item>
              <el-form-item label="班级">
                <el-cascader style="width: 400px"
                disabled
                v-model="beforeUser.classId"
                :options="classOptions"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="信誉分">
                   <el-rate
                    style="float:left; margin-top: 1%"
                        v-model="beforeUser.credit/20"
                        disabled
                        text-color="#ff9900"
                        >
                    </el-rate>{{ beforeUser.credit }}
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="beforeUser.sex">
                    <el-radio :label="'0'">女</el-radio>
                    <el-radio :label="'1'">男</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="身份证号" prop="idcard">
                <el-input v-model="beforeUser.idcard"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="tel">
                <el-input v-model="beforeUser.tel"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input disabled v-model="beforeUser.email"></el-input>
                <el-tooltip class="item" effect="dark" content="点我绑定邮箱" placement="top">
                  <el-link :underline="false" icon="el-icon-message" style="font-size:20px" type="primary" @click="bindEmail"></el-link>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="地址" prop="address">
                <el-cascader
                      style="width: 400px"
                      v-model="beforeUser.address"
                      size="large"
                      :options="addressOptions"
                      @change="handleAddressChange">
                </el-cascader>
              </el-form-item>
              <el-form-item label="注册时间" prop="registerTime">
                <el-input v-model="beforeUser.registerTime" disabled></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('userRules')">修改</el-button>
              </el-form-item>
          </el-form>
        </div>

        <div class="bind-email">
          <el-dialog title="绑定邮箱" :visible.sync="dialogTableVisible" :before-close = "checkEmailUpdate">
            <el-form :model="beforeUser" :rules="userRules" ref="userRules" label-width="100px" class="demo-ruleForm">
              <el-form-item prop="email" label="邮箱" style="margin-left: 10%" >
                <el-input label="邮箱"  placeholder="请输入邮箱" v-model="beforeUser.email" @blur="checkEmail('userRules')" ></el-input>
              </el-form-item>
              <el-form-item prop="code" label="验证码" style="margin-left: 10%;margin-top: 5%">
                <el-input  v-model="beforeUser.code" placeholder="请输入邮箱验证码" ></el-input>
              </el-form-item>
              <el-button type="primary" icon="el-icon-thumb" @click="sendMessage('userRules')" :disabled="sendButtonMessageDisabled" style="margin-left: 20%;margin-top: 5%"> {{sendButtonMessage}} </el-button>
              <el-button type="info" icon="el-icon-check" @click="checkCode('userRules')" > 验证 </el-button>
            </el-form>
          </el-dialog>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script>
import axios from 'axios'
import { regionData } from 'element-china-area-data'

export default {
  data () {
    return {
      server_URL: axios.defaults.baseURL,
      beforeUser: {
        userName: ''
      },
      loginUser: {},
      userRules: {
        idcard: [
          { min: 18, max: 18, message: '请输入正确的身份证', trigger: 'blur' }
        ],
        tel: [
          { min: 11, max: 11, message: '请输入正确的电话号码', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        code: [
          { min: 6, max: 6, message: '请输入正确的验证码', trigger: 'blur' }
        ]

      },
      classOptions: null,
      addressOptions: regionData,
      dialogTableVisible: false,
      emailIsBinded: false,
      sendButtonMessage: '立即发送',
      sendButtonMessageDisabled: false,
      second: 60,
      bindSuccess: false,
      tempEmail: null
    }
  },
  created () {
    this.loginUser = JSON.parse(window.localStorage.getItem('userDetail'))
    this.getClassInfo()
    this.getUserInfo()
  },
  methods: {
    handleAvatarUploadSuccess (response, file, fileList) {
      this.beforeUser.avatar = response.data
      if (this.beforeUser.address != null && this.beforeUser.address.length != 0) {
        this.beforeUser.address = JSON.stringify(this.beforeUser.address)
      }
      axios.put('/user', this.beforeUser).then(res => {
        if (res.data.code === 200) {
          this.beforeUser = res.data.data
          let userDetail = JSON.parse(window.localStorage.getItem('userDetail'))
          if (userDetail.avatar != this.beforeUser.avatar) {
            userDetail.avatar = this.beforeUser.avatar
            window.localStorage.setItem('userDetail', JSON.stringify(userDetail))
            location.reload()
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.update(this.beforeUser)
        } else {
          return false
        }
      })
    },
    update (user) {
      if (user.address != null && user.address.length != 0) {
        user.address = JSON.stringify(user.address)
      }
      if (user.classId != null && user.classId.length != 0) {
        user.classId = JSON.stringify(user.classId)
      }
      axios.put('/user', user).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.address != null && res.data.data.address.length != 0) {
            res.data.data.address = JSON.parse(res.data.data.address)
          }
          if (res.data.data.address != null && res.data.data.address.length != 0) {
            res.data.data.classId = JSON.parse(res.data.data.classId)
          }
          this.beforeUser = res.data.data
          let userDetail = JSON.parse(window.localStorage.getItem('userDetail'))
          if (userDetail.avatar != this.beforeUser.avatar) {
            userDetail.avatar = this.beforeUser.avatar
            window.localStorage.setItem('userDetail', JSON.stringify(userDetail))
            location.reload()
          }
          this.$message(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getUserInfo () {
      axios.get('/user/' + this.loginUser.userId).then(res => {
        if (res.data.code === 200) {
          this.beforeUser = res.data.data
          if (this.beforeUser.address != null && this.beforeUser.address.trim().length != 0) {
            this.beforeUser.address = JSON.parse(this.beforeUser.address)
          }
          if (this.beforeUser.classId != null && this.beforeUser.classId.trim().length != 0) {
            this.beforeUser.classId = JSON.parse(this.beforeUser.classId)
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    handleAddressChange (value) {
      this.beforeUser.address = value
    },
    bindEmail () {
      this.bindSuccess = false
      this.tempEmail = this.beforeUser.email
      this.dialogTableVisible = true
    },
    checkEmailUpdate () {
      if (!this.bindSuccess) {
        this.beforeUser.email = this.tempEmail
        this.dialogTableVisible = false
      }
    },
    startCountdown () {
      this.sendButtonMessage = this.second + '秒后重新发送'
      this.sendButtonMessageDisabled = true
      if (this.second > 0) {
        setTimeout(() => {
          this.second--
          this.startCountdown()
        }, 1000)
      } else {
        this.sendButtonMessage = '立即发送'
        this.sendButtonMessageDisabled = false
      }
    },
    checkEmail(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.get('/user/queryUserByEmail/'+this.beforeUser.email)
          .then(res => {
            if(res.data.code == 200){
              this.emailIsBinded = false
            } else {
              this.emailIsBinded = true
              this.$message.error(res.data.message)
            }
          })
        }
      })
    },
    sendMessage (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.emailIsBinded){
            this.$message.error('该邮箱已被绑定')
            return
          }
          this.startCountdown()
          axios({
            url: '/user/sendVerificationLogin',
            params: {
              'email': this.beforeUser.email,
              'operation': 'bindEmail'
            }
          }).then(res => {
            if (res.data.code === 200) {
              this.$message(res.data.message)
              this.showVerificaeButton = true
            } else {
              this.$message.error(res.data.message)
            }
          })
        } else {
          return false
        }
      })
    },
    checkCode (formName) {
      if (this.beforeUser.code == null || this.beforeUser.code.trim().length == 0) {
        this.$message.error('请输入验证码')
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios({
            url: '/user/verificationCheck',
            params: {
              'email': this.beforeUser.email,
              'password': this.beforeUser.code,
              'operation': 'bindEmail'
            }
          }).then(res => {
            if (res.data.code === 200) {
              this.$message(res.data.message)
              this.dialogTableVisible = false
              this.bindSuccess = true
              this.update(this.beforeUser)
            } else {
              this.$message.error(res.data.message)
            }
          })
        } else {
          return false
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

<style scoped>
.el-main{
  margin-left: 20%
}
.el-input{
    width: 300px;
}

</style>
