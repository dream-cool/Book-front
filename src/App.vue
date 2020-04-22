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

</style>
