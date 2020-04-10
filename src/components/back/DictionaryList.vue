<template>
  <div class="dictionary-list">
      <el-dialog title="新增字典类型"  :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="dictionary" :rules="rules" ref="dictionary">
        <el-form-item label="名称" label-width="70px" prop="name">
          <el-input v-model="dictionary.name" autocomplete="off" placeholder="请输入名称"  style = "width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="类型" label-width="70px" prop="type">
           <el-input v-model="dictionary.type" autocomplete="off" placeholder="请输入类型"  style = "width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="70px" prop="note">
           <el-input v-model="dictionary.note" autocomplete="off" type="textarea" :rows="2"
            placeholder="请输入备注" style = "width: 400px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertData('dictionary', dictionary)">确 定</el-button>
      </div>
      </el-dialog>
     <DynamicTbale :columns="columns" :table="table" :operations="operations" > </DynamicTbale>
     <el-pagination
        style="margin-top: 10px"
        background
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
import DynamicTbale from '../common/DynamicTbale.vue'
export default {
  created () {
    this.getDictionary(this.pageNum, this.pageSize, this.dictionaryCondition)
    this.operations[0].click = this.addDictionary
    this.operations[1].click = this.goToDetail
    this.operations[3].click = this.updateData
    this.operations[5].click = this.deleteData
  },
  methods: {
    handleCurrentChange (val) {
      this.getDictionary(val, this.pageSize, this.dictionaryCondition)
    },
    goToDetail (index, row) {
      this.$router.push({path: '/back/dictionary/data/' + row.type})
    },
    addDictionary () {
      this.dialogFormVisible = true
    },
    getDictionary (pageNum, pageSize, dictionaryCondition) {
      axios.post('/dictionary/all?pageNum=' + pageNum + '&pageSize=' + pageSize, dictionaryCondition ).then(res => {
        if (res.data.code == 200) {
          this.table.data = res.data.data.list
          this.pageNum = res.data.data.pageNum
          this.pageSize = res.data.data.pageSize
          this.total = res.data.data.total
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    updateData (index, dictionary) {
      axios.put('/dictionary', dictionary).then(res => {
        if (res.data.code == 200) {
          this.getDictionary(this.pageNum, this.pageSize, this.dictionaryCondition)
          this.$message(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    deleteData (index, dictionary) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('/dictionary/' + dictionary.id).then(res => {
          if (res.data.code == 200) {
            this.$message(res.data.message)
            this.getDictionaryData(this.pageNum, this.pageSize, this.dictionaryCondition)
          } else {
            this.$message.error(res.data.message)
          }
        })
      }).catch((e) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    insertData (formName, dictionary) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post('/dictionary', dictionary).then(res => {
            if (res.data.code == 200) {
              dictionary = res.data.data
              this.$message(res.data.message)
              this.getDictionaryData(this.pageNum, this.pageSize, this.dictionaryCondition)
              this.dialogFormVisible = false
              this.dictionary = {}
            } else {
              this.$message.error(res.data.message)
            }
          })
        } else {
          return false
        }
      })
    }
  },
  data () {
    return {
      total: 0,
      pageNum: 1,
      pageSize: 10,
      dialogFormVisible: false,
      dictionary: {},
      dictionaryCondition: {},
      rules: {
        name: [
          { required: true, message: '请输入类型名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入字典类型', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        note: [
          { required: false, message: '请输入备注内容', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ]
      },
      table: {
        data: []
      },
      columns: [
        {
          label: '字典名称',
          prop: 'name',
          editAble: true,
          editType: 'el-input',
          required: true,
          initialValue: '',
          attribute: {}
        },
        { label: '字典类型',
          prop: 'type',
          editAble: true,
          editType: 'el-input',
          required: true,
          initialValue: null
        },
        {
          label: '状态',
          prop: 'status',
          editAble: true,
          editType: 'el-select',
          required: true,
          formatter: function (val) {
            if (val == '1') {
              return '正常'
            } else if (val == '0') {
              return '禁用'
            }
          },
          attribute: {
            options: [{
              value: 1,
              label: '正常'
            }, {
              value: 0,
              label: '禁用'
            }]}
        },
        { label: '备注',
          prop: 'note',
          editAble: true,
          editType: 'el-input',
          required: true,
          initialValue: null
        },
        { label: '创建时间',
          prop: 'createTime',
          editAble: false,
          editType: 'el-input',
          required: false,
          initialValue: null
        }
      ],
      operations: [
        { text: '新增', intention: 'add' },
        { text: '查看', intention: 'add' },
        { text: '编辑', intention: 'edit' },
        { text: '保存', intention: 'save' },
        { text: '取消', intention: 'cancel' },
        { text: '删除', intention: 'delete' }
      ]
    }
  },

  components: {
    DynamicTbale: DynamicTbale
  }

}
</script>

<style>

</style>
