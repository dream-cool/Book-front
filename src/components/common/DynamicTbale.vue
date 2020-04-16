<template>
    <div class="dynamic-table">
    <el-button v-if="table.data == null || table.data.length == 0" type="primary" @click="executeOperation(operations[0])">新增</el-button>
    <el-table id="el-table" :data="table.data">
    <el-table-column id="el-table-column1" v-for="(column,index) in columns" :key="index" :show-overflow-tooltip="column.showOverflowTooltip" :column-key="column.columnKey" :selectable="column.selectable" :type="column.type" :align="column.align" :filter-method="column.filterMethod" :filter-placement="column.filterPlacement" :prop="column.prop" :sort-orders="column.sortOrders" :filter-multiple="column.filterMultiple" :header-align="column.headerAlign" :label-class-name="column.labelClassName" :reserve-selection="column.reserveSelection" :sort-method="column.sortMethod" :resizable="column.resizable" :filtered-value="column.filteredValue" :index="column.index" :label="column.label" :sortable="column.sortable" :filters="column.filters" :class-name="column.className" :formatter="column.formatter" :render-header="column.renderHeader" :sort-by="column.sortBy" :width="column.width" :fixed="column.fixed" :min-width="column.minWidth">
    <template id="el-free-tag20" slot-scope="{row,$index}">
        <el-input id="el-free-tag21" v-if="showEditState(column, $index) && column.editType == 'el-input' " v-model="row[column.prop]">
        </el-input>
        <el-input-number id="el-free-tag22" v-if="showEditState(column, $index) && column.editType == 'el-input-number' " v-model="row[column.prop]"
          :min="column.attribute.min" :max="column.attribute.max" :controls-position="column.attribute.controlsPosition" style="width: 150px">
        </el-input-number>
        <el-switch id="el-free-tag12" v-if="showEditState(column, $index) &&column.editType == 'el-switch' " v-model="row[column.prop]"
          :active-text="column.attribute.activeText" :inactive-text="column.attribute.inactiveText" >
        </el-switch>
          <el-select id="el-select1" placeholder="请选择" v-if="showEditState(column, $index) &&  column.editType == 'el-select' " v-model="row[column.prop]" >
            <el-option id="el-option1" v-for="item in column.attribute.options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        
        <el-link v-if="column.editType == 'el-link'" @click="column.click($index,row)"
          :type="column.attribute.type" :underline="column.attribute.underline" :disabled="column.attribute.disabled" 
          :icon="column.attribute.icon"   >  
          {{row[column.prop]}} 
        </el-link>

        <span  id="el-free-tag14" v-else-if="!showEditState(column, $index) "> {{ column.formatter == null ? row[column.prop] : column.formatter(row[column.prop]) }} </span>
    </template>
    </el-table-column>
    <el-table-column id="el-table-column2" align="left" header-align="left" label="操作" width="200px" v-if="operations != null">
    <template id="el-free-tag14" slot-scope="{row,$index}">
        <el-button id="el-button10" v-if="showEditButton(operation, $index)" v-for="(operation,index) in operations" :key="index" @click.native="executeOperation(operation,$index, row)" :round="operation.round" size="small" :plain="operation.plain" :disabled="operation.disabled" type="text" :circle="operation.circle" :loading="operation.loading" :autofocus="operation.autofocus">
        {{operation.text}}
        </el-button>
        <el-button id="el-button11" v-if="showSaveButton(operation, $index)" v-for="(operation,index) in operations" :key="index" @click.native="executeOperation(operation,$index, row)" :round="operation.round" size="small" :plain="operation.plain" :disabled="operation.disabled" type="text" :circle="operation.circle" :loading="operation.loading" :autofocus="operation.autofocus">
        {{operation.text}}
        </el-button>
    </template>
    </el-table-column>
    </el-table>
      <aa></aa>
    </div>
</template>

<script>
export default {
  props: ['table', 'columns', 'operations'],
  data () {
    return {
      showEdit: [],
      showSaveBtn: [],
      tempObj: {}
    }
  },
  components: {
    
  },
  created () {
    if (this.table == null || this.table.data == null) {
      return
    }

    // 使用一个数组来控制表格中哪列是在编辑中
    for (let i = 0; i < this.table.data.length; i++) {
      this.showEdit[i] = false
      this.showSaveBtn[i] = false
    }
    console.log(this.operations)
  },
  methods: {
    // 根据operation的intention来判断属于什么操作，从而执行相应的事件
    executeOperation (operation, index, row) {
      if (operation.intention == 'edit') {
        this.handleEdit(index, row)
        operation.click(index, row, this)
      }
      if (operation.intention == 'delete') {
        debugger
        operation.click(index, row)
      }
      if (operation.intention == 'add') {
        // this.handleAdd()
        operation.click(index, row)
      }
      if (operation.intention == 'save') {
        this.handleSave(index, row)
        operation.click(index, row)
      }
      if (operation.intention == 'cancel') {
        this.handleCancel(index, row)
        operation.click(index, row)
      }
    },

    // 编辑事件
    handleEdit (index, row) {
      // 复制一个临时对象，以便取消编辑时能进行数据回滚
      this.tempObj = JSON.parse(JSON.stringify(row))
      this.$set(this.showEdit, index, true)
      this.$set(this.showSaveBtn, index, true)
    },

    // 保存事件
    handleSave (index, row, operations) {
      this.columns.forEach(column => {
        if (column.required && (row[column.prop] == null || row[column.prop] == 'undefined' || row[column.prop].length <= 0)) {
          this.$message({
            type: 'error',
            message: column.label + '列不能为空'
          })
          throw SyntaxError()
        }
      })
      this.$set(this.showEdit, index, false)
      this.$set(this.showSaveBtn, index, false)
    },

    // 取消事件
    handleCancel (index, row, operations) {
      if (this.tempObj != null && this.tempObj != 'undefined') {
        for (var key in this.tempObj) {
          (this.table.data[index])[key] = this.tempObj[key]
        }
      }
      this.$set(this.showEdit, index, false)
      this.$set(this.showSaveBtn, index, false)
    },

    // 删除事件
    handleDelete (index, row) {
    },

    // 添加数据事件
    handleAdd () {
      var obj = {}
      // 读取column中的默认值
      this.columns.forEach(column => {
        if (column.initialValue != null && column.initialValue != 'undefined') {
          obj[column.prop] = column.initialValue
        }
      })
      this.table.data.push(obj)
      this.handleEdit(this.table.data.length - 1, obj)
    },

    // 某行数据是否处于编辑状态
    showEditState (column, index) {
      if (column.editAble && this.showEdit[index]) {
        return true
      } else {
        return false
      }
    },
    // 显示保存和取消按钮
    showSaveButton (operation, index) {
      if ((operation.intention == 'save' || operation.intention == 'cancel') && this.showSaveBtn[index]) {
        return true
      } else {
        return false
      }
    },
    // 显示新增、编辑、删除按钮
    showEditButton (operation, index) {
      if ((operation.intention == 'add' || operation.intention == 'edit' ||
                operation.intention == 'delete') && !this.showSaveBtn[index]) {
        return true
      } else {
        return false
      }
    }
  }

}
</script>

<style>

</style>
