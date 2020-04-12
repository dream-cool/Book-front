<template>
  <div class="content">

    <div class="updateUser">
        <el-dialog title="编辑用户" :visible.sync="dialogFormVisible">
          <el-form>
            <el-form-item label="班级">
                <el-cascader style="width: 400px"
                v-model="editUser.classId"
                :options="classOptions"
                ></el-cascader>
              </el-form-item>
            <el-form-item label="状态:" prop="bookStatus">
              <el-radio-group v-model="editUser.status">
                <el-radio :label="'1'">正常</el-radio>
                <el-radio :label="'0'">锁定</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="角色:" prop="bookStatus">
              <el-radio-group v-model="editUser.role">
                <el-radio :label="'0'">学生</el-radio>
                <el-radio :label="'1'">老师</el-radio>
                <el-radio :label="'2'">管理员</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editCommit">确 定</el-button>
          </div>
        </el-dialog>
    </div>
      <el-container>
          <el-form :model="user" :inline="true"  label-width="100px" class="demo-form-inline">
          <el-form-item label="姓名">
            <el-input v-model="user.userName" placeholder="模糊查询用户姓名" ></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="author">
             <el-select v-model="user.sex" placeholder="书籍状态">
              <el-option label="所有" :value='null'></el-option>
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户状态" prop="status">
            <el-select v-model="user.status" placeholder="书籍状态">
              <el-option label="所有" :value='null'></el-option>
              <el-option label="正常" value="1"></el-option>
              <el-option label="锁定" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色" prop="">
            <el-select v-model="user.role" placeholder="书籍类型">
              <el-option label="所有" :value='null'></el-option>
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
          <el-form-item label-width="120px" label="录入时间早于">
              <el-form-item prop="registerTime">
                <el-date-picker  value-format="timestamp" type="date" placeholder="选择日期" v-model="user.registerTime" ></el-date-picker>
              </el-form-item>
          </el-form-item>
          <el-form-item label-width="160px" label="最后登录时间早于">
              <el-form-item prop="lastLoginTime">
                <el-date-picker  value-format="timestamp" type="date" placeholder="选择日期" v-model="user.lastLoginTime" ></el-date-picker>
              </el-form-item>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search()">搜索</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-container>
      <el-table
          border
          size="small"
          ref="multipleTable"
          tooltip-effect="dark"
          :data="userList"
          @selection-change="handleSelectionChange"
          :show-overflow-tooltip="true"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="用户名称"
            width="250">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>学号: {{ scope.row.stu_No }}</p>
                <p>班级: {{ scope.row.classId }}</p>
                <p>身份证: {{ scope.row.idcard }}</p>
                <p>电话: {{ scope.row.tel }}</p>
                <p>邮箱: {{ scope.row.email }}</p>
                <p>地址: {{ scope.row.address }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.userName }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="申请人信誉"
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
            width="80">
          </el-table-column>
          <el-table-column
            prop="sex"
            :formatter="userStatusFormatter"
            label="状态"
            width="80">
          </el-table-column>
          <el-table-column
            prop="role"
            :formatter="userRoleFormatter"
            label="角色"
            width="100">
          </el-table-column>
          <el-table-column
            prop="registerTime"
            label="录入时间"
            width="150">
          </el-table-column>
          <el-table-column
            prop="lastLoginTime"
            label="最后登录时间"
            width="200">
          </el-table-column>
          <el-table-column
            label="操作"
            width="250"
            >
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)"   size="small">编辑</el-button>
              <el-button @click="handleResetPassword(scope.row)" size="mini">重置密码</el-button>
              <el-button @click="handleDelete(scope.row)" type="danger"  size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageNum"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
        <div style="margin-top: 20px">
          <el-button type="danger"  size="large" @click="deleteBatch()">批量删除</el-button>
        </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  data () {
    return {
      userList: [],
      pageNum: 1,
      pageSize: 10,
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
      classOptions: {},
      multipleSelection: []
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
    editCommit () {
      if(this.editUser.classId != null){
        this.editUser.classId  = JSON.stringify(this.editUser.classId)
      }
      axios.put('/user', this.editUser
      ).then(res => {
        if (res.data.code === 200) {
          this.editUser = res.data.data
          this.$message(res.data.message)
          this.dialogFormVisible = false
          this.getUserInfo(this.pageNum, this.pageSize, this.user)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    deleteBatch () {
      if (this.multipleSelection == null || this.multipleSelection.length == 0) {
        this.$message.error('请选择用户')
        return false
      }
      this.$confirm('确认删除？')
        .then(_ => {
          var idArray = []
          this.multipleSelection.forEach(user => {
            ids.push(user.userId)
          })
          // todo
          axios.get({
            url: '/user/delete/batch',
            params: { ids: [1, 2, 3]}
          }).then(res => {
            if (res.data.code === 200) {
              this.$message(res.data.message)
              this.getUserInfo(this.pageNum, this.pageSize, this.user)
            } else {
              this.$message.error(res.data.message)
            }
          })
        })
        .catch(_ => {})
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleResetPassword (row) {
      this.$confirm('确认重置？')
        .then(_ => {
          axios.put('/user/resetPassword/' + row.userId).then(res => {
            if (res.data.code === 200) {
              this.$message(res.data.message)
              this.getUserInfo(this.pageNum, this.pageSize, this.user)
            } else {
              this.$message.error(res.data.message)
            }
          })
        })
        .catch(_ => {})
    },
    handleEdit (row) {
      this.dialogFormVisible = true
      axios.get('/user/' + row.userId).then(res => {
        if (res.data.code === 200) {
          this.editUser = res.data.data
          if(this.editUser.classId != null){
            this.editUser.classId = JSON.parse(this.editUser.classId)
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    handleDelete (row) {
      this.$confirm('确认删除？')
        .then(_ => {
          axios.delete('/user/' + row.userId).then(res => {
            if (res.data.code === 200) {
              this.$message(res.data.message)
              this.getUserInfo(this.pageNum, this.pageSize, this.user)
            } else {
              this.$message.error(res.data.message)
            }
          })
        })
        .catch(_ => {})
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
  },
}
</script>
<style scoped>
.el-header{
  height: 300px;
}

</style>
