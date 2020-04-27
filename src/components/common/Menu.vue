<template>
    <div>
      <template v-for="list in this.menuList">
        <el-submenu style="margin-left: 10px" v-if="list[children] != null && list[children].length>0" :key="list[id]" :index="list[path]"  >
          <template slot="title"  >
            <i :class="list[icon]"></i>
            <span slot="title">{{ list[name]}}</span>
          </template>
          <el-menu-item-group>
            <Menu :menuList="list[children]"></Menu>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item style="margin-left: 10px"  v-else :index="list[path]"  :key="list[id]">
          <i :class="list[icon]"></i>
          <span slot="title">{{list[name]}}</span>
        </el-menu-item>
      </template>
    </div>
</template>

<script>
import Menu from '../common/Menu.vue'
export default{
  name: 'Menu',
  props: ['menuList', 'id', 'name', 'path', 'icon', 'children'],
  data () {
    return {

    }
  },
  beforeMount () {
  },
  components: {
    Menu: Menu
  }

}
</script>
<style>
</style>
