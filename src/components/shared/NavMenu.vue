<template>
  <div class="nav-sidebar shadow-xl">
    <div id="nav" class="text-2xl tracking-widest">
      <ul class="route-list">
        <li v-for="route in routes">
          <router-link :to="route.path" @click="updateRoute">{{ route.name }}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavMenu',

  data: function() {
    return {
      currentPath: '',
      routes: [
        {
          name:'Home',
          path:'/'
        },
        {
          name: 'W.E.M. Library',
          path: '/learn'
        },
        {
          name:'About',
          path:'/about'
        }
      ], 
    }
  },
  methods: {
    updateRoute: function() {
      this.currentPath = this.$route.path;
      this.$emit('closeNav')
    }
  }
}


</script>

<style lang="scss">
.nav-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 15%;
  position: absolute;
  right: 0;
  z-index: 9999;
  background-color: #435B6B;
  opacity: 90%;
}
.route-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  li {
    text-transform: uppercase;
    display: block;
    padding: 20px;
    text-align: left;
    font-family: 'Baloo 2';
  }
}
 
</style>
