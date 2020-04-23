<template>
    <div style="width:35%;margin-left:20%;margin-top:5%">
      <div>
        <el-steps  :active="active"  finish-status="success">
          <el-step title="校验邮箱验证码">
          </el-step>
          <el-step title="录入新密码">
          </el-step>
        </el-steps>

        <div class="first" v-if="active == 0">
          <el-input v-model="user.userName" placeholder="请输入用户名" style="margin-top: 50px;" @blur="getUserByUserName"></el-input>
          <el-input  v-model="user.email" disabled placeholder="账号邮箱"  style="margin-top: 50px;"></el-input>
          <el-input  v-model="code" placeholder="请输入邮箱验证码" style="margin-top: 50px;"></el-input>
          <br>
            <el-button type="primary" icon="el-icon-thumb" @click="getUserInfo" :disabled="sendButtonMessageDisabled" style="margin-top: 50px;"> {{sendButtonMessage}} </el-button>
            <el-button type="info" icon="el-icon-check"  @click="checkCode" > 验证 </el-button>
        </div>
        <div class="second" v-if="active == 1">
          <el-input type="password" placeholder="请输入新密码" v-model="newPassword" style="margin-top: 50px;"></el-input>
          <el-input type="password" placeholder="请确认新密码" v-model="confirmNewPassword" style="margin-top: 50px;"></el-input>
          <br>
          <el-button type="primary" @click="commitNewPW"  style="margin-top: 50px;"> 提交 </el-button>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'HelloWorld',
  data () {
    return {
      activeName: 'updateByOldPW',
      user: { email: ''},
      sendButtonMessage: '立即发送',
      sendButtonMessageDisabled: false,
      second: 60,
      inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
      pw: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      checkOldPW: false,
      userRule: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度至少6个字符', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度至少6个字符', trigger: 'blur' }
        ],
        confirmNewPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度至少6个字符', trigger: 'blur' }
        ]
      },
      active: 0,
      code: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  },
  created () {
  },
  methods: {
    resetForm (formName) {
      this.pw.oldPassword = ''
      this.pw.newPassword = ''
      this.pw.confirmNewPassword = ''
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

    sendMessage () {
      this.startCountdown()
      axios({
        url: '/user/sendVerificationLogin',
        params: {
          'email': this.user.email
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.$message(res.data.message)
          this.showVerificaeButton = true
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    checkCode () {
      if (this.code == null || this.code.trim().length == 0) {
        this.$message.error('请输入验证码')
        return
      }
      axios({
        url: '/user/verificationCheck',
        params: {
          'email': this.user.email,
          'password': this.code
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.$message(res.data.message)
          this.active = 1
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    commitNewPW () {
      if (this.newPassword == null || this.newPassword.trim().length == 0) {
        this.$message.error('请输入新密码')
        return
      }
      if (this.confirmNewPassword == null || this.confirmNewPassword.trim().length == 0) {
        this.$message.error('请确认密码')
        return
      }
      if (this.newPassword.trim().length < 6 || this.confirmNewPassword.trim().length < 6) {
        this.$message.error('密码长度不能小于6位')
        return
      }
      if (this.newPassword != this.confirmNewPassword) {
        this.$message.error('两次密码不一致')
        return
      }
      axios({
        url: '/user/updatePWByVerificationCode',
        params: {
          'userId': this.user.userId,
          'newPassword': this.newPassword
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.$message(res.data.message)
          this.active = 0
          this.user = {}
          this.code = ''
          this.resetForm()
          this.$router.push({path: '/login'})
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getUserByUserName(){
      if (this.user.userName == null || this.user.userName.trim().length <= 0) {
        return
      }
      axios.get('/user/queryUserByUserName/' + this.user.userName).then(res => {
        if (res.data.code === 200) {
          const user = res.data.data
          if (user == null){
            this.$message.error('没有找到用户信息')
            this.user.email = ''
            return 
          }
          if(user.email == null || user.email.trim().length < 0){
            this.$message.error('该用户没有绑定邮箱，请联系管理员重置密码') 
          }
          this.user.email = user.email
        } else {
          this.$message.error('没有找到用户信息')
          this.user.email = ''
        }
      })
    },
    getUserInfo () {
      if (this.user.userName == null || this.user.userName.trim().length <= 0) {
        this.$message.error('请输入用户名')
        return
      }
      if (this.user.email == null || this.user.email.trim().length <= 0) {
        this.$message.error('请输入邮箱')
        return
      }
      if (!this.inputPattern.test(this.user.email)) {
        this.$message.error('邮箱格式不正确')
        return
      }
      axios.get('/user/queryUser/' + this.user.userName + '/' + this.user.email).then(res => {
        if (res.data.code === 200) {
          this.user = res.data.data
          this.sendMessage()
        } else {
          this.$message.error('没有找到用户信息，用户名或绑定邮箱不正确')
        }
      })
    }
  }
}
</script>

<style scoped>
.el-input{
  width: 400px;
}

</style>
