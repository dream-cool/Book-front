<template>
  <div class="content">
      <el-container>
          <el-form :model="user" :inline="true"  label-width="100px" class="demo-form-inline">
          <el-form-item label="姓名">
            <el-input v-model="user.userName" placeholder="模糊查询用户姓名" ></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="author">
             <el-select v-model="user.sex" placeholder="全部" clearable>
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户状态" prop="status">
            <el-select v-model="user.status" placeholder="全部" clearable>
              <el-option label="正常" value="1"></el-option>
              <el-option label="锁定" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色" prop="">
            <el-select v-model="user.role" placeholder="全部" clearable>
              <el-option label="学生" value="0"></el-option>
              <el-option label="老师" value="1"></el-option>
              <el-option label="管理员" value="2"></el-option>
              <el-option label="超级管理员" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="信用大于" prop="price">
            <el-input-number v-model="user.credit" controls-position="right"
                :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item  label="录入时间早于">
              <el-form-item prop="registerTime">
                <el-date-picker  value-format="timestamp" type="date" placeholder="选择日期" v-model="user.registerTime" ></el-date-picker>
              </el-form-item>
          </el-form-item>
          <el-form-item label="最后登录早于">
              <el-form-item prop="lastLoginTime">
                <el-date-picker  value-format="timestamp" type="date" placeholder="选择日期" v-model="user.lastLoginTime" ></el-date-picker>
              </el-form-item>
          </el-form-item>
          <el-form-item style="margin-left: 100px">
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button type="info" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-container>
      <el-table
          border
          size="small"
          tooltip-effect="dark"
          :data="userList"
          :show-overflow-tooltip="true"
          style="width: 100%">
          <el-table-column
            label="用户名称"
            width="120">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>编号: {{ scope.row.userId }}</p>
                <p>身份证: {{ scope.row.idcard }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.userName }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="信誉"
            width="180">
            <template slot-scope="scope">
               <el-rate
               style="float:left"
                v-model="scope.row.creditStars"
                disabled
                text-color="#ff9900"
                >
               </el-rate>
            {{ scope.row.credit }}
            </template>
          </el-table-column>
          <el-table-column
            prop="sex"
            :formatter="userSexFormatter"
            label="性别"
            width="100">
          </el-table-column>
          <el-table-column
            prop="sex"
            :formatter="userStatusFormatter"
            label="状态"
            width="100">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            width="180">
          </el-table-column>
          <el-table-column
            prop="tel"
            label="电话"
            width="150">
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址"
            :formatter="userAddressFormatter"
            width="180">
          </el-table-column>
          <el-table-column
            prop="classId"
            label="班级"
            :formatter="userClassFormatter"
            width="230">
          </el-table-column>
          <el-table-column
            prop="registerTime"
            label="录入时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="lastLoginTime"
            label="最后登录时间"
            width="200">
          </el-table-column>

        </el-table>
        <div class="block">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageNum"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import { CodeToText } from 'element-china-area-data'
export default {
  data () {
    return {
      userList: [],
      pageNum: 1,
      pageSize: 15,
      total: 0,
      user: {
        userName: null,
        credit: 0,
        sex: null,
        status: null,
        role: null,
        registerTime: null,
        lastLoginTime: null
      },
      editUser: {},
      dialogFormVisible: false,
      multipleSelection: [],
      CodeToText,
      classOptions: []
    }
  },
  created () {
    this.getUserInfo(this.pageNum, this.pageSize, this.user)
    this.getClassInfo()
  },

  methods: {
    dateFiltter (date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },

    handleSizeChange (val) {

    },
    handleCurrentChange (pageNum) {
      this.pageNum = pageNum
      this.getUserInfo(pageNum, this.pageSize, this.user)
    },
    getUserInfo (pageNum, pageSize, user) {
      axios.post('/user/all?pageNum=' + pageNum + '&pageSize=' + pageSize, user)
        .then(res => {
          if (res.data.code === 200) {
            this.userList = res.data.data.list
            this.pageNum = res.data.data.pageNum
            this.total = res.data.data.total
          } else {
            this.$message.error(res.data.message)
          }
        })
    },
    userSexFormatter (row, column, cellValue, index) {
      if (row.sex == 1) {
        return '男'
      } else {
        return '女'
      }
    },
    userStatusFormatter (row, column, cellValue, index) {
      if (row.status == 1) {
        return '正常'
      } else {
        return '锁定'
      }
    },
    userRoleFormatter (row, column, cellValue, index) {
      if (row.role == 0) {
        return '学生'
      } else if (row.role == 1) {
        return '老师'
      } else if (row.role == 2) {
        return '管理员'
      } else if (row.role == 3) {
        return '超级管理员'
      }
    },
    userAddressFormatter (row, column, cellValue, index) {
      const {CodeToText} = this
      var addrList = JSON.parse(row.address)
      var addrString = ''
      if (addrList != null) {
        addrList.forEach(addr => {
          addrString += CodeToText[addr] + ' '
        })
        return addrString
      } else {
        return '未知'
      }
    },
    userClassFormatter (row, column, cellValue, index) {
      if (row.classId != null) {
        var classObj = JSON.parse(row.classId)
        var { classOptions } = this
        if (classObj != null && classOptions.length > 0) {
          var classStr = ''
          var oo
          classObj.forEach(code => {
            oo = classOptions.filter(item => item.value == code)
            classStr += oo[0].label + ' '
            classOptions = oo[0].children
          })
          return classStr
        } else {
          return '未知'
        }
      }
    },
    getClassInfo () {
      axios.get('/dictionaryData/class/getClassInfo').then(res => {
        if (res.data.code == 200) {
          this.classOptions = res.data.data
          
        }
      })
    },
    search () {
      this.getUserInfo(this.pageNum, this.pageSize, this.user)
    },
    resetForm () {
      this.user = {
        userName: null,
        credit: 0,
        sex: null,
        status: null,
        role: null,
        registerTime: null,
        lastLoginTime: null
      }
      this.search()
    }
  }
}
</script>
<style scoped>
.el-header{
  height: 300px;
}

</style>
