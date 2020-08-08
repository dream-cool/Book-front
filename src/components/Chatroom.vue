<template>
  <div>
    <el-card style="width: 80%; height: 800px">
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          <div class="main">
            <el-row>
              <el-avatar :size="50"
                         :src='(receiver.avatar != null && receiver.avatar.substring(0, 7) == "http://") ? receiver.avatar : Server_URL+"/download/"+receiver.avatar'
                         style="margin-right: 15px;">{{receiver.userName}}
              </el-avatar>
              {{receiver.userName}}
            </el-row>
            <br>
            <br>
            <div class="message" style="height: 450px">
              <div v-for="(msg,key,index) in messageList" :key="index">
                <el-tag v-if="msg.sendUserName==sender.userName" type="success" style="float:right">
                  我：{{msg.sendingTime}} -- {{msg.content}}
                </el-tag>
                <br/>
                <el-tag v-if="msg.sendUserName==receiver.userName" style="float:left">
                  {{receiver.userName}}：{{msg.sendingTime}} -- {{msg.content}}
                </el-tag>
                <br/>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-input
          placeholder="请输入要发送的消息"
          prefix-icon="el-icon-s-promotion"
          type="textarea"
          maxlength="30"
          show-word-limit
          v-model="messageValue"
          style="margin-left:20%;margin-top:5%;width:60%"
        ></el-input>
        <el-button type="primary" @click="sendMessage()">发送</el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      Server_URL: axios.defaults.baseURL,
      receiver: {},
      sender: {},
      messageList: [], // 消息列表
      messageValue: '' // 消息内容
    }
  },
  created () {
    this.getUserInfo(this.$route.params.id)
    var user = window.localStorage.getItem('userDetail')
    this.sender = JSON.parse(user)
    this.checkWebsocketConnection()
    this.consumeMessage(this.sender.userName)
  },
  methods: {
    checkWebsocketConnection () {
      if (this.websocket == null || this.websocket.readyState !== 1) {
        this.conectWebSocket(this.sender.userName)
        if (this.websocket != null) {
          //接收到消息的回调方法
          var that = this
          this.websocket.onmessage = function (event) {
            var object = eval('(' + event.data + ')')
            if (!window.location.pathname.startsWith('/chatroom')) {
              console.log(object.sendUserName + ':' + object.sendingTime + '--' + object.content)
              that.$notify.info({
                title: '消息',
                message: object.sendUserName + ':' + object.sendingTime + '--' + object.content,
                onClick: function () {
                  that.$router.push({path: '/chatroom/' + that.sender.userId})
                }
              })
            } else {
              that.messageList.push(object)
            }
          }
        }
      }
    },
    // 发送消息
    sendMessage: function () {
      var msg = {
        content: this.messageValue,
        sendUserName: this.sender.userName,
        receiveUserName: this.receiver.userName
      }
      if (this.websocket == null || this.websocket.readyState !== 1) {
      } else {
        this.websocket.send(JSON.stringify(msg))
      }
    },
    getUserInfo (id) {
      axios.get('/user/' + id).then(res => {
        if (res && res.data.code == 200) {
          this.receiver = res.data.data
        }
      })
    },
    consumeMessage (userName) {
      axios.get('/message/consumeUnreadMessage/' + userName).then(res => {
        if (res && res.status == 200) {
          this.messageList = this.messageList.concat(res.data.data)
        }
      })
    }
  }
}
</script>

<style scoped>
  .main {
    position: relative;
    top: 20px;
  }

  .message {
    position: relative;
    overflow: auto;
    top: 20px;
    width: 100%;
    height: 40%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    padding: 5px;
  }
</style>
