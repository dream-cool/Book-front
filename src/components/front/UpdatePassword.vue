<template>
  <div class="hello" style="margin-left: 15%; width: 600px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="旧密码修改" name="updateByOldPW">
            <el-form  :rules="userRule" ref="userRule" label-width="100px" class="demo-ruleForm">
                <el-form-item label="旧密码" @blur="checkOld"  prop="oldPW">
                    <el-input type="password" v-model="oldPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPW">
                    <el-input type="password" v-model="newPassword"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirNewPW">
                    <el-input type="password" v-model="confirmNewPassword"></el-input>
                </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('userRule')">立即修改</el-button>
                <el-button @click="resetForm('userRule')">重置</el-button>
              </el-form-item>
            </el-form>   
        </el-tab-pane>
        <el-tab-pane label="邮箱验证码修改" name="updateByEmail">
            邮箱验证码修改</el-tab-pane>
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
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        checkOldPW: false,
        userRule: {
            oldPW: [
            { required: true, message: '请输入旧密码', trigger: 'blur' },
            { min: 8, max: 16, message: '长度至少8个字符', trigger: 'blur' }
            ],
            newPW: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 8, max: 16, message: '长度至少8个字符', trigger: 'blur' }
            ],
            confirmNewPW: [
            { required: true, message: '请输入确认密码', trigger: 'blur' },
            { min: 8, max: 16, message: '长度至少8个字符', trigger: 'blur' }
            ]
        },
        
    }
  },
  created() {
      this.user = JSON.parse(window.localStorage.getItem('userDetail'))
  },
  methods: {
      checkOld(){
          axios.get('/type/cascade').then(res => {
                if (res.data.code === 200) {
                this.categoryList = res.data.data
                this.categoryList.push(this.none)
                } else {
                this.$message.error(res.data.message)
                }
            })

      },      
      submitForm(formName){
          this.$refs[formName].validate((valid) => {
            if (valid && checkOldPW) {

            }
            })
      },
      resetForm(formName){
          this.oldPassword = ''
          this.newPassword = ''
          this.confirmNewPassword = ''
      }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
