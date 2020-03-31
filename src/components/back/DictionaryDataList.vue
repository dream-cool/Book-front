<template>
  <div class="dictionary-list">
      <el-dialog title="新增字典类型"  :visible.sync="dialogFormVisible" width="550px">
      <el-form :model="dictionaryData" :rules="rules" ref="dictionaryData">
        <el-form-item label="所属类型" label-width="100px" prop="type">
          <el-input v-model="dictionaryData.type" autocomplete="off" disabled  style = "width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="标签" label-width="100px" prop="label">
          <el-input v-model="dictionaryData.label" autocomplete="off" placeholder="请输入标签"  style = "width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="键值" label-width="100px" prop="value">
           <el-input v-model="dictionaryData.value" autocomplete="off" placeholder="请输入键值"  style = "width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="排序号" label-width="100px" prop="sort">
           <el-input-number :min="0" :max="999" controls-position="right" v-model="dictionaryData.sort" autocomplete="off"  style = "width: 200px"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" label-width="100px" prop="note">
           <el-input v-model="dictionaryData.note" autocomplete="off" type="textarea" :rows="2"
            placeholder="请输入备注" style = "width: 400px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertData('dictionaryData', dictionaryData)">确 定</el-button>
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
    this.dictionaryDataCondition.type = this.$route.params.type
    this.dictionaryData.type = this.$route.params.type
    this.getDictionaryData(this.pageNum, this.pageSize, this.dictionaryDataCondition)
    this.operations[0].click = this.addDictionaryData
    this.operations[2].click = this.updateData
    this.operations[5].click = this.deleteData
  },
  methods: {
    addDictionaryData () {
      this.dialogFormVisible = true
    },
    handleCurrentChange (val) {
      this.getDictionaryData(val, this.pageSize, this.dictionaryDataCondition)
    },
    getDictionaryData (pageNum, pageSize, dictionaryDataCondition) {
      axios.post('/dictionaryData/all?pageNum=' + pageNum + '&pageSize=' + pageSize, dictionaryDataCondition).then(res => {
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
    updateData (index, dictionaryData) {
      axios.put('/dictionaryData', dictionaryData).then(res => {
        if (res.data.code == 200) {
          dictionaryData = res.data.data
          this.$message(res.data.message)
        } else {
          this.$message.error(res.data.message)
          this.getDictionaryData(this.pageNum, this.pageSize, this.dictionaryDataCondition)
        }
      })
    },
    deleteData (index, dictionaryData) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('/dictionaryData/' + dictionaryData.id).then(res => {
          if (res.data.code == 200) {
            this.$message(res.data.message)
            this.getDictionaryData(this.pageNum, this.pageSize, this.dictionaryDataCondition)
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
    insertData (formName, dictionaryData) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post('/dictionaryData', dictionaryData).then(res => {
            if (res.data.code == 200) {
              dictionaryData = res.data.data
              this.$message(res.data.message)
              this.getDictionaryData(this.pageNum, this.pageSize, this.dictionaryDataCondition)
              this.dialogFormVisible = false
              this.dictionaryData = {type: this.$route.params.type}
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
      dictionaryData: {},
      dictionaryDataCondition: {},
      rules: {
        label: [
          { required: true, message: '请输入字典名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入字典键值', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
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
          label: '字典标签',
          prop: 'label',
          editAble: true,
          editType: 'el-input',
          required: true,
          initialValue: '',
          attribute: {}
        },
        { label: '字典键值',
          prop: 'value',
          editAble: true,
          editType: 'el-input',
          required: true,
          initialValue: null
        },
        { label: '排序号',
          prop: 'sort',
          editAble: true,
          editType: 'el-input-number',
          required: false,
          initialValue: null,
          attribute: {
            min: '0',
            max: '999',
            controlsPosition: 'right'}
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
          required: false,
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
