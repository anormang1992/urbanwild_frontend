<template>
  <div class="header-container flex flex-row items-center p-3 justify-between">
    <router-link to="/"><img src="../../assets/logo_minimal.png" width="250"></router-link>
    <div class="flex flex-row items-center space-x-8">
      <div class="search flex flex-row w-full items-center justify-center">
        <form action='#' class="flex flex-row items-center">
          <input class="rounded-l-xl" type="text" name="search" placeholder="Global Search...">
          <button class="rounded-r-xl">
            <i class="fa fa-search text-4xl text-logo-urban bg-pale"></i>
          </button>
        </form>
      </div>
      <div class="text-5xl text-logo-urban pr-4 cursor-pointer">
        <i class="fas fa-bars" @click="openNav()" v-if="!open_nav"></i>
        <i class="fas fa-times" @click="openNav()" v-else></i>
      </div>
    </div>
  </div>
  <transition name="slide">
    <nav-menu @close-nav="openNav" v-if="open_nav"/>
  </transition>
</template>

<script>
import NavMenu from '@/components/shared/NavMenu.vue'

export default {
  name: 'AppHeader',

  components: {
    NavMenu,
  },

  data: function() {
    return {
      open_nav: false,
    }
  },

  methods: {
    openNav(){
      this.open_nav = !this.open_nav;
    },
  } 
}


</script>

<style>
.search input[type=text]{
  padding: 5px;
  border: none;
  width: 250px;
  height: 50px;
  background-color: #E9F0F8;
  outline: none;
  font-family: 'Baloo 2';
  letter-spacing: 0.1em;
}
.search i {
  padding: 5px;
  border: none;
  height: 50px;
  background-color: #E9F0F8;
}
.search button {
  width: 75px;
  background-color: #E9F0F8;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-out 0s;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(100%);
  transition: all 500ms ease-in 0s
}
</style>  