<template>
  <div class="content">
    <el-main>
      <div class="user">
        <div class="bookImg" >
             <el-form :model="beforeUser" :rules="userRules" ref="userRules" label-width="100px" class="demo-ruleForm">
              <el-form-item label="用户名">
                <el-input v-model="beforeUser.userName" disabled></el-input>
              </el-form-item>
              <el-form-item label="班级">
                <el-input v-model="beforeUser.classId" disabled></el-input>
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
                  <el-link v-if="beforeUser.email == null">暂未绑定邮箱，立即绑定</el-link>
                <el-input v-if="beforeUser.email != null" v-model="beforeUser.email"></el-input>
              </el-form-item>
              <el-form-item label="地址" prop="address">
                <el-input v-model="beforeUser.address"></el-input>
              </el-form-item>
              <el-form-item label="注册时间" prop="registerTime">
                <el-input v-model="beforeUser.registerTime" disabled></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('userRules')">修改</el-button>
              </el-form-item>
          </el-form>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
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
      }
    }
  },
  created () {
     this.loginUser = JSON.parse(window.localStorage.getItem('userDetail'))
     this.getUserInfo()
  },
  methods: {
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
            this.update(this.beforeUser)
        } else {
          return false
        }
      })
    },
    update (user) {
      axios.put('/user', user).then(res => {
        if (res.data.code === 200) {
          this.beforeUser = res.data.data
          this.$message(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getUserInfo() {
      axios.get('/user/'+this.loginUser.userId).then(res => {
        if (res.data.code === 200) {
          this.beforeUser = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      })
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
