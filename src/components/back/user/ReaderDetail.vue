<template>
  <div class="content">
      {{msg}}
      <el-image :src="img" style="float:left" v-show="!uploadBookImgSuccess">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
        
  </div>
</template>

<script>
export default {
  data () {
    return {
      img: 'http://localhost:8090/download?filename=85e69eeb113046a0a27324113a166ce2.jpg',
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
