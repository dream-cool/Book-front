<template>
  <div class="hello" :style="backgroundDiv" >
    <el-dialog :lock-scroll="false" title="励新图书管理系统" width="30%" :modal="false"	 :show-close="false" :visible="dialogTableVisible">
       <el-form :model="user" :rules="userRules" ref="userRules" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="userName" >
              <el-input v-model="user.userName" prefix-icon="el-icon-user-solid" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="user.password" prefix-icon="el-icon-lock" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <el-input  v-model="user.code" placeholder="验证码" @focus="popoverVisible=true"
                @blur="popoverVisible=false"
                maxlength="4" prefix-icon="el-icon-key" style="width: 150px;float: left"
                 @keyup.enter.native="submitForm('userRules')"
                 @keyup.down.native="createCode"
                  ></el-input>
              <el-popover style="float:right;margin-right:15%"
                placement="top"
                width="200"
                trigger="hover"
                v-model="popoverVisible"
                content="看不清？点击图片或者按 ↓ 切换">
                <el-button slot="reference" v-if="false" ></el-button>
              </el-popover>
              <SIdentify :identifyCode="identifyCode" :createCode="createCode" ></SIdentify>
            </el-form-item>

            <el-form-item>
              <el-checkbox v-model="rememberMe" style="float:left">记住密码</el-checkbox>
              <el-link style="marginLeft:50px;marginTop: -5px" type="primary"
              :underline="false" @click="recoverPasswor">找回密码</el-link>
              <!-- <el-link style="marginLeft:50px;marginTop: -5px" type="primary"
              :underline="false" @click="githubLogin">github</el-link> -->
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('userRules')" :loading="loading">登录</el-button>
              <el-button @click="resetForm('userRules')" >重置</el-button>
            </el-form-item>
        </el-form>

    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import login from '../assets/imgages/login_banenr.jpg'
import SIdentify from '../components/common/SIdentify'



export default {
  name: 'HelloWorld',
  components: {
    SIdentify
  },
  created () {
    this.createCode()
    const userName = window.localStorage.getItem('rememberUserName')
    const password = window.localStorage.getItem('rememberPassword')
    if (userName != null && userName != undefined && password != null && password != undefined) {
      this.user.userName = userName
      this.user.password = password
    }
  },
  data () {
    return {
      loading: false,
      popoverVisible: false,
      dialogTableVisible: true,
      rememberMe: true,
      user: { userName: '', password: '', code: ''},
      identifyCode: '',
      userRules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        code: [
          { required: false, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      backgroundDiv: {
        backgroundImage: 'url(' + require('../assets/imgages/login_banenr.jpg') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        height: '1030px'
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // const code = this.user.code.toUpperCase()
          // if (this.identifyCode !== code) {
          //   this.$message.error('验证码错误，请重试')
          //   this.user.code = ''
          //   this.createCode()
          //   return false
          // }
          if (!this.rememberMe) {
            window.localStorage.removeItem('rememberUserName')
            window.localStorage.removeItem('rememberPassword')
          }
          this.loading = true

          debugger
          axios.get('/login?userName=' + this.user.userName + '&password=' + this.user.password).then(
            res => {
              if (res.data.code == 200) {
                window.localStorage.setItem('userDetail', JSON.stringify(res.data.data.userDetail))
                window.localStorage.setItem('token', res.data.data.token)
                this.$message(res.data.message)
                if (this.rememberMe) {
                  window.localStorage.setItem('rememberUserName', this.user.userName)
                  window.localStorage.setItem('rememberPassword', this.user.password)
                }
                if (res.data.data.userDetail.role == '2' || res.data.data.userDetail.role == '3') {
                  this.$router.push({path: '/back/home'})
                  // this.conectWebSocket(res.data.data.userDetail.userName)
                } else {
                  this.$router.push({path: '/front'})
                }
              } else {
                this.$message.error(res.data.message)
                this.createCode()
              }
              this.loading = false
            }
          )
        } else {
          return false
        }
      })
    },
    recoverPasswor () {
      this.$router.push({path: '/recoverPasswor'})
    },
    resetForm () {
      this.user = {}
    },
    createCode () {
      var code = ''
      const codeLength = 4 // 验证码的长度
      const random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z') // 随机数
      for (let i = 0; i < codeLength; i++) { // 循环操作
        let index = Math.floor(Math.random() * 36) // 取得随机数的索引（0~35）
        code += random[index] // 根据索引取得随机数加到code上
      }
      this.identifyCode = code // 把code值赋给验证码
    },
    githubLogin () {
      axios.get('/oauth/render/gitee').then(res => {
        if (res && res.status == 200) {
          window.location.href = res.data
        }
      })
    },
    conectWebSocket(userName) {
        if ("WebSocket" in window) {
          this.websocket = new WebSocket(
            "ws://localhost:8443/websocket/" + userName
          );
          Vue.prototype.websocket = this.websocket
        } else {
          this.$message.error('该浏览器不支持建立socket连接，无法实现在线聊天')
        }
        //连接发生错误的回调方法
        this.websocket.onerror = function() {
          this.$message.error('socket连接建立失败，请检查网络')
        };
        var that = this
        //连接成功建立的回调方法
        this.websocket.onopen = function(event) {
          var user = JSON.parse(window.localStorage.getItem('userDetail'))
          axios.get('/message/unreadMessageCount/' + userName).then (res => {
            if (res && res.status == 200 && res.data.data > 0){
              var msgCount = res.data.data;
              that.$notify.info({
                title: '消息',
                message: '您有'+ msgCount +'条未读消息',
                onClick: function() {
                            that.$router.push( {path: '/chatroom/' + user.userId} )
                         }
              });
            }
          })
        };

        //连接关闭的回调方法
        this.websocket.onclose = function() {}
        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = function() { this.websocket.close() }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.el-input{
  width: 250px;
}
.el-button{
  width: 100px;
}

</style>
