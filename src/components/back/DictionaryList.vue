<template>
  <div class="dictionary-list">
     <DynamicTbale :columns="columns" :table="table" :operations="operations" > </DynamicTbale>

  </div>
</template>

<script>
import axios from 'axios'
import DynamicTbale from '../common/DynamicTbale.vue'
export default {
    created(){
        this.getDictionaryData()
    },
    methods: {
        getDictionaryData(){
            axios.post('/dictionary/all', this.dictionary).then( res => {
                if (res.data.code == 200){
                    this.table.data = res.data.data.list
                } else {
                    this.$message.error(res.data.message)
                }
            })
        }        
    },
    data(){
        return{
            dictionary:{},
            table: {
                data: []
            },
            columns: [
						{ 
							label: '编号',
							prop: 'number' ,
							editAble: true, 
							editType: 'el-input-number',
							initialValue: '1',
							required: true 
						},
						{
							label: '字典名称',
							prop: 'name', 			
							editAble: true,
							editType: 'el-input',
							required: true ,
							initialValue: '',
							attribute: {}
                        },
                        { label: '字典类型',
							prop: 'type', 
							editAble: true,
							editType: 'el-input',
							required: true ,
							initialValue: null
                        },
						{
							label: '状态',
							prop: 'status', 			
							editAble: true,
							editType: 'el-select',
							required: true ,
							formatter: function(val) {
											if(val == '1'){
												return '正常'
											} else if(val == '0')  {
												return '禁用'
											} 
										},
							attribute: { options: [{
											value: '1',
											label: '正常'
											}, {
											value: '0',
											label: '禁用'
											}]}
                        },
                        {   label: '备注',
							prop: 'note', 
							editAble: true,
							editType: 'el-input',
							required: true ,
							initialValue: null
                        },
                        {   label: '创建时间',
							prop: 'createTime', 
							editAble: false,
							editType: 'el-input',
							required: false ,
							initialValue: null
						},
						
            ],
            operations:[
				{
					text: '新增',
					click: function click(index, row) {
                                console.log("add")
                                this.insertData(row)
							},
                    intention: 'add',
                    insertData: function insertData (dictionary) {
                                    axios.post('/dictionary', dictionary).then( res => {
                                        if (res.data.code == 200){
                                            dictionary = res.data.data
                                        } else {
                                            console.log(res)
                                        }
                                    })
                    }
				},
				{
					text: '编辑',
					click: function click(index, row) {
								console.log("edit")
								console.log(row)
							},
					intention: 'edit',
				},
				{
					text: '保存',
					click: function click(index, row) {
									console.log("save")
                                    console.log(row)
                                    this.updateData(row)
							},
                    intention: 'save',
                    updateData(dictionary){
                        axios.put('/dictionary', dictionary).then( res => {
                            if (res.data.code == 200){
                                dictionary = res.data.data
                            } else {
                                this.$message.error(res.data.message)
                            }
                        })
                    },

				},
				{
					text: '取消',
					click: function click(index, row) {
									console.log("cancel")
									console.log(row)
							},
					intention: 'cancel',
				},
				{
					text: '删除',
					click: function click(index, row) {
                                    console.log("delete")
                                    console.log(row)
                                    this.deleteData(row.id)
							},
                    intention: 'delete',
                    deleteData(id){
                        axios.delete('/dictionary/' + id).then( res => {
                            if (res.data.code == 200){
                                this.$message(res.data.message)
                            } else {
                                this.$message.error(res.data.message)
                            }
                        })
                    }
				}
			]
        }
    },
    
    
	components:{
        DynamicTbale: DynamicTbale
    }

}
</script>

<style>

</style>