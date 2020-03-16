<template>
  <div class="hello" >
      <el-tabs type="border-card" tab-position="left" v-model="active"  style="height:1000px"
        @tab-click="handleTabChange">
        <el-tab-pane v-for="(item,index) in collectGroupList" :key="index" 
            :label="item.name" :name="item.name">
            <el-row :gutter="20" bodar style="margin-top: -30px">
              <el-col :span="4" v-for="(useCollection,index) in useCollectionList" :key="index"  >  
                  <el-card :body-style="{ padding: '0px' }" style="width: 220px">
                    <el-image v-if="useCollection.bookImg != null"  style="margin-left: 20px"
                      :src='"http://localhost:8090/download/"+useCollection.bookImg' 
                      @click="goToBookDetail(useCollection.bookId)"
                      ></el-image>
                    <div style="padding-left: 20px;padding-right: 20px;">
                      <p style="color: #000;font-size: 14px;font-weight: bold margin-top: -20px; " >  {{useCollection.bookName}}  </p>
                      <p style="font-size: 14px;color: #AEA7A7;margin-top: -10px;float:right">收藏于{{useCollection.collectionTime}}  </p>
                      <p style="font-size: 14px;color: #AEA7A7;margin-top: -10px;float:right">借阅:100</p>
                    </div>
                  </el-card>
              </el-col>
            </el-row>
            
        </el-tab-pane>
        
      </el-tabs>





      
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'Hello',
  data () {
    return {
      Sever_URL: 'localhost:8090/download/',
      pageNum: 1,
      pageSize: 30,
      total: 0,
      book: {},
      url: '',
      useCollectionList: [],
      collectGroupList:[],
      user:{},
      active: '默认收藏夹',
      useCollection: {
        userId: null,
        groupName: '默认收藏夹',
        isCollect: true
      }
    }
  },
  created() {
    this.user = JSON.parse(window.localStorage.getItem('userDetail'))
    this.useCollection.userId = this.user.userId
    this.getCollectGroupInfo()
    this.getUseCollectionInfo(this.pageNum, this.pageSize, this.useCollection)
  },
  methods: {
    handleTabChange(){
      this.useCollection.groupName = this.active
      this.pageNum = 1;
      this.pageSize = 10;
      this.getUseCollectionInfo (this.pageNum, this.pageSize, this.useCollection)
    },
    getCollectGroupInfo(){
        axios.get('/collectionGroup/user/' + this.user.userId)
        .then(res => {
          if (res.data.code === 200) {
            this.collectGroupList = res.data.data
          } else {
            this.$message.error("获取收藏夹分组信息失败")
          }
        })
    },
    getUseCollectionInfo (pageNum, pageSize, useCollection) {
      axios.post(
        '/userCollection/all?pageNum=' + pageNum + '&pageSize=' + pageSize, useCollection
      ).then(res => {
        if (res.data.code === 200) {
          this.useCollectionList = res.data.data.list
          this.pageSize = res.data.data.pageSize
          this.pageNum = res.data.data.pageNum
          this.total = res.data.data.total
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    goToBookDetail(bookId){
      document.body.style.overflow = null
      this.$router.push({path: '/front/bookDetail/'+bookId})
    },
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-col{
  margin-top: 5%;
  margin-left: 5%;
}
.el-row{
  margin-left: 5%;
}
.el-image{
  width: 180px;
  height: 180px;
}
</style>
