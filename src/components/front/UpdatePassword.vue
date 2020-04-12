<template>
  <div class="hello" style="margin-left: 15%; width: 600px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="旧密码修改" name="updateByOldPW">
            <el-form :model="pw" :rules="userRule" ref="userRule" label-width="100px" class="demo-ruleForm">
                <el-form-item label="旧密码" prop="oldPassword">
                    <el-input type="password" v-model="pw.oldPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" v-model="pw.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmNewPassword">
                    <el-input type="password" v-model="pw.confirmNewPassword"></el-input>
                </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('userRule')">立即修改</el-button>
                <el-button @click="resetForm('userRule')">重置</el-button>
              </el-form-item>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="邮箱验证码修改"  name="updateByEmail">
          <el-link v-if="userInfo.email == null || userInfo.email.trim().length <= 0"
          type="primary" style="font-size: 30px;margin-top: 50px" @click="goToPersonal" >你还没有绑定邮箱哦，点我前去绑定</el-link>
          <div v-else>
            <el-steps  :active="active"  finish-status="success">
              <el-step title="校验邮箱验证码">
              </el-step>
              <el-step title="录入新密码">
              </el-step>
            </el-steps>
            <div class="first" v-if="active == 0">
              <el-input label="邮箱" :disabled="true" v-model="userInfo.email" style="margin-left: 10%;margin-top: 10%;"></el-input>
              <el-input  v-model="code" placeholder="请输入邮箱验证码" style="margin-left: 10%;margin-top: 10%;"></el-input>
              <br>
                <el-button @click="sendMessage" :disabled="sendButtonMessageDisabled" style="margin-left: 20%;margin-top: 10%"> {{sendButtonMessage}} </el-button>
                <el-button @click="checkCode" > 验证 </el-button>
            </div>
            <div class="second" v-if="active == 1">
              <el-input type="password" placeholder="请输入新密码" v-model="newPassword" style="margin-left: 10%;margin-top: 10%;"></el-input>
              <el-input type="password" placeholder="请确认新密码" v-model="confirmNewPassword" style="margin-left: 10%;margin-top: 10%;"></el-input>
              <el-button @click="commitNewPW"> 提交 </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'HelloWorld',
  data () {
    return {
      activeName: 'updateByOldPW',
      user: {},
      userInfo: {},
      sendButtonMessage: '立即发送',
      sendButtonMessageDisabled: false,
      second: 60,

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
    this.user = JSON.parse(window.localStorage.getItem('userDetail'))
    this.getUserInfo()
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.newPassword != this.confirmNewPassword) {
            this.$message.error('两次密码不一致')
            return
          }
          axios({
            url: '/user/updatePWByOldPW',
            params: {
              'userId': this.user.userId,
              'oldPassword': this.pw.oldPassword,
              'newPassword': this.pw.newPassword
            }
          }).then(res => {
            if (res.data.code === 200) {
              this.$message(res.data.message)
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      })
    },
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
      if (this.newPassword == null ||  this.newPassword.trim().length == 0) {
        this.$message.error('请输入新密码')
        return
      }
      if (this.confirmNewPassword == null ||  this.confirmNewPassword.trim().length == 0) {
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
          this.logout()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getUserInfo () {
      axios.get('/user/' + this.user.userId).then(res => {
        if (res.data.code === 200) {
          this.userInfo = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    logout () {
      window.localStorage.removeItem('userDetail')
      window.localStorage.removeItem('token')
      this.$router.push({path: '/login'})
    },
    goToPersonal () {
      var currentPath = this._routerRoot._route.fullPath
      if (currentPath.startsWith('/front')) {
        this.$router.push({path: '/front/personal'})
      }
      if (currentPath.startsWith('/back')) {
        this.$router.push({path: '/back/personal'})
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-input{

  width: 400px;
}

</style>
