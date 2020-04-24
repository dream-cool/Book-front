<template>
  <div id="app" style="width: 100%;height: 100%;">
        <NotFound  v-if="invalidRoute"></NotFound>
        <router-view v-else></router-view>
   
  </div>
</template>

<script>
import NotFound from '../src/components/404.vue'
export default {
  name: 'App',
  components: {
    NotFound: NotFound
  },
  computed: {
    invalidRoute () {
      return !this.$route.matched || this.$route.matched.length === 0
    }
  }
}
</script>

<style>

::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #fff;
}
::-webkit-scrollbar-thumb {
    border-radius:5px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    background-color: rgba(0, 0, 0, .1)
}
</style>
