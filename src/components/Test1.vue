<template>
  <div>
  {{table.data}}
  <DynamicTbale :columns="columns" :table="table" :operations="operations" > </DynamicTbale>
  </div>

</template>

<script>
import DynamicTbale from '../components/common/DynamicTbale.vue'
export default {
  data () {
    return {
      columns: [
        {
          label: '姓名',
          prop: 'name',
          editAble: false,
          editType: 'el-input',
          initialValue: '陈',
          required: true
        },
        {
          label: '年龄',
          prop: 'age',
          editAble: true,
          editType: 'el-input-number',
          required: true,
          initialValue: '1',
          attribute: {}
        },
        {
          label: '角色',
          prop: 'role',
          editAble: true,
          editType: 'el-select',
          required: true,
          formatter: function (val) {
            if (val == '1') {
              return '用户'
            } else if (val == '2') {
              return '管理员'
            } else if (val == '3') {
              return '超级管理员'
            }
          },
          attribute: { options: [{
            value: '1',
            label: '用户'
          }, {
            value: '2',
            label: '管理员'
          }, {
            value: '3',
            label: '超级管理员'
          }] }
        },
        {
          label: '性别',
          prop: 'sex',
          editAble: true,
          editType: 'el-switch',
          formatter: function (val) {
            if (val == true) {
              return '男'
            } else {
              return '女'
            }
          },

          attribute: { 'activeText': '男', 'inactiveText': '女', disabled: true },
          initialValue: true
        },
        { label: '家庭住址',
          prop: 'address',
          editAble: true,
          editType: 'el-input',
          required: true,
          initialValue: null
        }
      ],
      table: {
        data: [{
          age: 10,
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          sex: false,
          role: '2'
        }, {
          age: 10,
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          sex: true,
          role: '3'
        }, {
          age: 10,
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          sex: false,
          role: '1'
        }, {
          age: 10,
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          sex: true,
          role: '1'
        }]
      },
      operations: [
        {
          text: '新增',
          click: function click () {
            console.log('add')
          },
          intention: 'add'
        },
        {
          text: '编辑',
          click: function click (index, row) {
            console.log('edit')
            console.log(row)
          },
          intention: 'edit'
        },
        {
          text: '保存',
          click: function click (index, row) {
            console.log('save')
            console.log(row)
          },
          intention: 'save'

        },
        {
          text: '取消',
          click: function click (index, row) {
            console.log('cancel')
            console.log(row)
          },
          intention: 'cancel'
        },
        {
          text: '删除',
          click: function click (index, row) {
            console.log('delete')
            console.log(row)
          },
          intention: 'delete'
        }
      ]
    }
  },
  created () {

  },
  components: {
    DynamicTbale: DynamicTbale
  }
}
</script>

<style>

</style>
