<template>
  <div id="app">
  
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
          return !this.$route.matched || this.$route.matched.length === 0;
      },
  }
}
</script>

<style>

</style>
