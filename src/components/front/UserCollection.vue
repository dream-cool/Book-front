<template>
  <div class="hello" >
      <el-tabs    v-model="active"
        @tab-click="handleTabChange">
        
        <el-tab-pane>
          <span slot="label"><i class="el-icon-edit"></i> 编辑收藏</span>
            <el-card title="我的收藏" 
              style="margin-left: 20%;width: 50%;height: 800px">
              <el-tag v-for="(item,index) in collectGroupList" :key="index"
                      style="width: 250px;margin-left: 100px;margin-top: 20px"
                closable
                @close="handleDelete(item)"
                @click="handleEdit(item)"
                type="info"
                >
                {{item.name}}
              </el-tag>
              <br>
              <el-input
                  placeholder="新建收藏分组"
                  v-model="collectGroup.name"
                  style="margin-top: 50px;margin-left:100px;width:250px"
                  clearable>
                </el-input>
              <el-button icon="el-icon-plus" style="margin-left:10px" @click="addCollectGroup"></el-button>
            </el-card>
        </el-tab-pane>

        <el-tab-pane v-for="(item,index) in collectGroupList" :key="index"
            :label="item.name" :name="item.name">
          <span slot="label"><i class="el-icon-folder"></i> {{item.name}}</span>

          <el-timeline >
                <el-timeline-item placement="top"
                    v-for="(item,index) in useCollectionListGroupTime"
                    :key="index"
                    :timestamp="index"
                    >
                    <el-card >
                      <el-row :gutter="20" bodar style="margin-top: -30px">
                        <el-col :span="4" v-for="(useCollection,index) in item" :key="index"  >
                            <el-card :body-style="{ padding: '0px' }" style="width: 220px">
                              <el-image v-if="useCollection.bookImg != null"  style="margin-left: 20px"
                                :src='Sever_URL+"/download/"+useCollection.bookImg'
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
                    </el-card>
                </el-timeline-item>
                <!-- <el-link @click="loadMore" v-if="messageList.length < total" type="primary">加载更多</el-link>
                <p v-if="messageList.length == total">我也是有底线的</p> -->
            </el-timeline>
        </el-tab-pane>
       
      </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Hello',
  data () {
    return {
      Sever_URL: axios.defaults.baseURL,
      pageNum: 1,
      pageSize: 30,
      total: 0,
      book: {},
      url: '',
      useCollectionList: [],
      useCollectionListGroupTime: [],
      collectGroupList: [],
      user: {},
      active: '默认收藏夹',
      useCollection: {
        userId: null,
        groupName: '默认收藏夹',
        isCollect: true
      },
      collectGroup: {
        name: null
      },

    }
  },
  created () {
    this.user = JSON.parse(window.localStorage.getItem('userDetail'))
    this.useCollection.userId = this.user.userId
    this.getCollectGroupInfo()
    this.getUseCollectionInfoGroupTime(this.useCollection)

  },
  methods: {
    handleEdit(item){
      this.$prompt('请输入分组新名称', '修改分组', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: item.name,
          inputPattern: /\S/,
          inputErrorMessage: '分组名不能为空'
        }).then(({ value }) => {
          item.name = value
          this.updateCollectionGroup(item)
        }).catch(() => {
              
        });
    },
    handleDelete(item){
      this.$confirm('删除分组，将删除该分组下的所有收藏信息，确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/collectionGroup/'+item.collectionGroupId).then( res => {
            if(res && res.data.code == 200){
              this.getCollectGroupInfo()
              this.$message(res.data.message)
            } else {
              this.$message.error(res.data.message)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    handleTabsEdit () {
      
    },
    handleTabChange () {
      this.useCollection.groupName = this.active
      this.getUseCollectionInfoGroupTime(this.useCollection)
    },
    getCollectGroupInfo () {
      axios.get('/collectionGroup/user/' + this.user.userId)
        .then(res => {
          if (res.data.code === 200) {
            this.collectGroupList = res.data.data
          } else {
            this.$message.error('获取收藏夹分组信息失败')
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
    getUseCollectionInfoGroupTime (useCollection) {
      axios.post(
        '/userCollection/queryAllGroupCollectTime', useCollection
      ).then(res => {
        if (res.data.code === 200) {
          this.useCollectionListGroupTime = res.data.data
          console.log(this.useCollectionListGroupTime)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    goToBookDetail (bookId) {
      document.body.style.overflow = null
      this.$router.push({path: '/front/bookDetail/' + bookId})
    },
    updateCollectionGroup (collectionGroup) {
      if (collectionGroup != null) {
        axios.put('/collectionGroup', collectionGroup)
          .then(res => {
            if (res && res.data.code === 200) {
              this.getCollectGroupInfo()
              this.$message(res.data.message)
            } else {
              this.$message.error(res.data.message)
            }
            this.getCollectGroupInfo()
          })
      }
    },
    addCollectGroup () {
      axios.post('/collectionGroup', {
        name: this.collectGroup.name,
        userId: this.user.userId
      }).then(res => {
        if (res.data.code === 200) {
          this.collectGroup.name = null
          this.getCollectGroupInfo()
          this.$message(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      })
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >

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

.el-tabs{
  height: 100%;
}

.el-tabs__item  is-left{
  height: 200px;
}

</style>
