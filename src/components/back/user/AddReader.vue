<template>
  <div class="content">
    <template>
          <el-form :model="user" :rules="userRules" ref="userRuleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="学号" prop="stuNo">
              <el-input v-model="user.stuNo" placeholder="请输入书籍编号，为空则系统生成UUID"></el-input>
            </el-form-item>
            <el-form-item label="用户姓名" prop="userName">
              <el-input v-model="user.userName"></el-input>
            </el-form-item>
            <el-form-item label="班级" prop="classId">
              <el-cascader style="width: 400px"
                v-model="user.classId"
                :options="options">
              </el-cascader>
            </el-form-item>
            <el-form-item label="初始信用分" prop="credit">
               <el-slider :min="60" v-model="user.credit" style="float:left;width:300px;"></el-slider>

               &nbsp &nbsp &nbsp{{user.credit}}
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="user.sex">
                <el-radio :label="'0'">女</el-radio>
                <el-radio :label="'1'">男</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="角色" prop="role">
              <el-radio-group v-model="user.role">
                <el-radio :label="'0'">学生</el-radio>
                <el-radio :label="'1'">老师</el-radio>
                <el-radio :label="'2'">管理员</el-radio>
              </el-radio-group>
            </el-form-item>
             <el-form-item>
               <div >初始密码为888888</div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('userRuleForm')">立即创建</el-button>
              <el-button type="info" @click="resetForm('userRuleForm')">重置</el-button>
            </el-form-item>
          </el-form>
    </template>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      user: {
        credit: 80,
        sex: '1',
        role: '0'
      },
      options: null,
      userRules: {
        userName: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        classId: [
          { required: true, message: '请输入请输入用户班级', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getClassInfo()
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.user.classId != null && this.user.classId != undefined){
            this.user.classId = JSON.stringify(this.user.classId)
          }
          console.log(this.user)
          axios.post('/user', this.user).then(res => {
            if (res.data.code === 200) {
              this.$message(res.data.message)
              this.user = {credit: 80,sex: '1',role: '0'}
            } else {
              this.$message.error(res.data.message)
              this.user.classId = JSON.parse(this.user.classId)
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },

    getClassInfo () {
      axios.get('/dictionaryData/class/getClassInfo').then(res => {
        if (res.data.code == 200) {
          this.options = res.data.data
          if(this.options != null && this.options != undefined){
            this.options = this.getTreeData(this.options)
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
  }
}
</script>
<style scoped>
.el-input{
  width: 350px;
}

.el-date-picker{
  width: 350px;
}

.el-form{
  margin-left: 20%
}

</style>
