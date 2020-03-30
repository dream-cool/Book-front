<template>
    <div>
      <template v-for="list in this.menuList">
        <el-submenu style="margin-left: 10px" v-if="list.c != null && list.c.length>0" :key="list.l" :index="list.l"  >
          <template slot="title"  >
            <i :class="list.i"></i>
            <span slot="title">{{ list.t}}</span>
          </template>
          <el-menu-item-group>
            <Menu :menuList="list.c"></Menu>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item style="margin-left: 10px"  v-else :index="list.l"  :key="list.l">
          <i :class="list.i"></i>
          <span slot="title">{{list.t}}</span>
        </el-menu-item>
      </template>
    </div>
</template>

<script>
import Menu from '../common/Menu.vue'
export default{
  name: 'Menu',
  data () {
    return {

    }
  },
  beforeMount () {
  },
  props: ['menuList'],
  components: {
    Menu: Menu
  }

}
</script>
<style>
</style>
