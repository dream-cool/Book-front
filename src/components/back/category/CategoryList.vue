<template>
  <div class="content">
    <DynamicTbale :columns="columns" :table="table" :operations="operations" > </DynamicTbale>
       <!-- <el-table
          :data="table.data"
          style="width: 100%">
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table> -->
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
          <AddCategory  :dialog="dialog"></AddCategory>
  </div>
</template>

<script>
import axios from 'axios'
import  DynamicTbale from '../../common/DynamicTbale'
import AddCategory from '../category/AddCategory'
export default {
  components: {
      DynamicTbale,
      AddCategory
  },
  data () {
    return {
      dialog: {
        dialogVisible: false
      },
      dialogVisible: false,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      table: {
        data: []
      },
      columns: [
        
        { 
          label: '类别名称',
          prop: 'title',
          width: '250px',
          editAble: true,
          editType: 'el-input',
          required: true,
          initialValue: null,
          attribute: { }
        },
        {
          label: '父类名称',
          prop: 'pname',
          editAble: false,
          editType: 'el-input',
          required: false,
          attribute: {}
        },
        {
          label: '级别',
          prop: 'level',
          editAble: false,
          editType: 'el-input',
          required: false,
          attribute: {}
        },
        {
          label: '排序号',
          width: '200px',
          prop: 'sort',
          editAble: true,
          editType: 'el-input-number',
          required: false,
          attribute: {}
        },
        {
          label: '创建时间',
          prop: 'createTime',
          width: '200px',
          editAble: false,
          editType: 'el-input-number',
          required: false,
          attribute: {}
        }
      ],
      operations: [
        { text: '新增', intention: 'add', click: this.handleAdd, icon: 'el-icon-plus', type: 'primary'   },
        { text: '编辑', intention: 'edit', click: undefined , icon: 'el-icon-edit', type: 'primary'},
        { text: '保存', intention: 'save',  click: this.handleEdit , icon: 'el-icon-check ', type: 'primary'},
        { text: '取消', intention: 'cancel', click: undefined, icon: 'el-icon-close ', type: 'primary' },
        { text: '删除', intention: 'delete', click: this.handleDelete , icon: 'el-icon-delete', type: 'danger'}
      ]
    }
  },
  created () {
    this.getAllCategoryInfo(this.pageNum, this.pageSize)
  },
  methods: {
    handleAdd(){
      this.dialog.dialogVisible = true
    },
    handleEdit (index, row) {
      axios.put('/type', row).then(res => {
          if (res.data.code === 200) {
            this.$message(res.data.message)
            this.getAllCategoryInfo(this.pageNum, this.pageSize)
          } else {
            this.$message.error(res.data.message)
          }
      })
    },
    // handleEdit (index, row) {
    //   this.$prompt('请新的输入类别名称', row.title, {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     inputPattern: /\S/,
    //     inputErrorMessage: '类别名称不能为空'
    //   }).then(({ value }) => {
    //     row.title = value
    //     axios.put('/type', row).then(res => {
    //       if (res.data.code === 200) {
    //         this.$message(res.data.message)
    //       } else {
    //         this.$message.error(res.data.message)
    //       }
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '取消输入'
    //     })
    //   })
    // },
    handleDelete (index, row) {
      this.$confirm('确认删除？')
        .then(_ => {
          axios.delete('/type/' + row.id).then(res => {
            if (res.data.code === 200) {
              this.getAllCategoryInfo(this.pageNum, this.pageSize)
              this.$message(res.data.message)
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
      this.getAllCategoryInfo(pageNum, this.pageSize)
    },
    getAllCategoryInfo (pageNum, pageSize) {
      axios.get('/type?pageNum=' + pageNum + '&pageSize=' + pageSize)
        .then(res => {
          if (res.data.code === 200) {
            this.table.data = res.data.data.list
            this.pageNum = res.data.data.pageNum
            this.pageSize = res.data.data.pageSize
            this.total = res.data.data.total
          } else {
            this.$message.error(res.data.message)
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
