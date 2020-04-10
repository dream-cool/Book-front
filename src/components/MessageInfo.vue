<template>
  <div class="hello">
      <el-button @click="readMessage"  >一键已读</el-button>
            <el-timeline >
                <el-timeline-item placement="top"
                    v-for="(message, index) in messageList"
                    :key="index"
                    :timestamp="message.sendingTime"
                    >
                    <el-card>
                            {{message.content}}
                    </el-card>
                    <p v-if="message.status == '0'"> 未读</p>
                    <p v-if="message.status == '1'"> 已读 </p>
                </el-timeline-item>
                <el-link @click="loadMore" v-if="messageList.length < total" type="primary">加载更多</el-link>
                <p v-if="messageList.length == total">我也是有底线的</p>
            </el-timeline>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'HelloWorld',
  data () {
    return {
      user: {},
      message: {
        sendingTime: null
      },
      messageList: [],
      pageNum: 1,
      pageSize: 5,
      total: 0,
      count: 10,
      loading: false
    }
  },
  computed: {
    noMore () {
      return this.count >= 20
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  created () {
    this.user = JSON.parse(window.localStorage.getItem('userDetail'))
    this.getMessage(this.pageNum, this.pageSize, this.message)
  },
  methods: {
    loadMore () {
      this.pageNum++
      this.message.userId = this.user.userId
      axios({
        url: '/message?pageNum=' + this.pageNum + '&pageSize=' + this.pageSize,
        params: this.message
      }).then(res => {
        if (res.data.code === 200) {
          this.messageList = this.messageList.concat(res.data.data.list)
          this.pageNum = res.data.data.pageNum
          this.pageSize = res.data.data.pageSize
          this.total = res.data.data.total
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getMessage (pageNum, pageSize, message) {
      this.message.userId = this.user.userId
      axios({
        url: '/message?pageNum=' + pageNum + '&pageSize=' + pageSize,
        params: message
      }).then(res => {
        if (res.data.code === 200) {
          this.messageList = res.data.data.list
          this.pageNum = res.data.data.pageNum
          this.pageSize = res.data.data.pageSize
          this.total = res.data.data.total
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    readMessage () {
      axios.put('/message/readMessage/' + this.user.userId
      ).then(res => {
        if (res.data.code === 200) {
          this.$message(res.data.message)
          this.getMessage(this.pageNum, this.pageSize, this.message)
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello{
    width: 800px;
    margin-left: 10%;
}

</style>
