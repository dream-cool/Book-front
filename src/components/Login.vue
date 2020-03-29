<template>
  <div class="hello">
       <el-form :model="user" :rules="userRules" ref="userRules" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="user.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="user.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('userRules')">登录</el-button>
              <el-button @click="resetForm('userRules')">重置</el-button>
            </el-form-item>
        </el-form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HelloWorld',
  data () {
    return {
      user: {},
      userRules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
                axios.get('/login?userName='+this.user.userName+'&password='+this.user.password).then(
                    res =>{
                        if(res.data.code == 200){
                            window.localStorage.setItem("userDetail", JSON.stringify(res.data.data.userDetail))
                            window.localStorage.setItem("token", res.data.data.token)
                            this.$message(res.data.message)
                            if(res.data.data.userDetail.role == '2' ||res.data.data.userDetail.role == '3'){
                                this.$router.push({ path: '/back'})  
                            } else {
                                this.$router.push({ path: '/front'})  
                            }
                        } else {
                          this.$message.error(res.data.message)
                        }
                    }
                )
            } else {
                return false
            }
        })
    },
    
    resetForm(){
        this.user = {}
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-form{
    margin-left: 30%;
    margin-top: 10%;
}

.el-input{
  width: 350px;
}

</style>
