<template>
  <div class="content">
      {{msg}}
      <el-cascader
      v-model="category"
      :options="categoryList"
      @change="handleChange"
      :props="optionProps"
    ></el-cascader>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: '读者详情',
      category: [1], // 默认地区为不限。显示的文字为"不限"，选中后输入的内容为"CoderZb"
      optionProps: {
        value: 'id',
        label: 'title',
        children: 'child'
      },
      categoryList: [{  "id": 1,
                    "pid": 1,
                    "name": null,
                    "level": 2,
                    "sort": null,
                    "title": "中国说"}],
     
    }
  }
 
    
    
}
</script>

<style scoped>

</style>
