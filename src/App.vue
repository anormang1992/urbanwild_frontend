<template>
  <app-header/>
  <div class="router-container">
    <router-view/>
  </div>


</template>

<script>

import AppHeader from '@/components/shared/AppHeader.vue'

export default {
  name: 'App',

  components: {
    AppHeader,
  },
}

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

#nav {
  position: relative;
  padding: 15px;
    a {
      font-weight: bold;
      color: #FFFFFF;
      font-family: 'Baloo 2';

      &.router-link-exact-active {
        color: #589040;
      }
    }

    a:hover {
      color: #589040;
    }
}
</style>
