<template>
  <div class="header-container flex flex-row items-center p-3 justify-between">
    <router-link to="/"><img src="../../assets/logo_minimal.png" width="250"></router-link>
    <div class="flex flex-row items-center space-x-8">
      <div class="search flex flex-row w-full items-center justify-center">
        <form action='#' class="flex flex-row items-center">
          <input v-model="search_string" 
                 @input="sendSearchString" 
                 class="rounded-l-xl" 
                 type="text" name="search" 
                 placeholder="Global Search...">
          <div>
            <i class="fa fa-search rounded-r-xl text-4xl text-logo-urban bg-pale"></i>
          </div>
        </form>
      </div>
      <div class="text-5xl text-logo-urban pr-4 cursor-pointer">
        <i v-if="!open_nav" class="fas fa-bars" @click="toggleNav()"></i>
        <i @click="toggleNav()" class="fas fa-times" v-else></i>
      </div>
    </div>
  </div>

  <transition name="slide">
    <div v-if="open_nav" class="nav-sidebar shadow-xl">
      <div class="text-2xl tracking-widest">
        <ul class="route-list" :class="{'hidden': !open_nav}">
          <template v-for="route in routes">
            <li>
              <router-link :to="route.path" @click="updateRoute">{{ route.name }}</router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </transition>

  <transition name="slide">
    <search-results :searching="searching"
                    :results="search_results"
                    @closeSearchPanel="closeSearch"
                    v-if="search_panel_open"/>
  </transition>

</template>

<script>
import axios from 'axios';
import SearchResults from '@/components/shared/SearchResults.vue'

export default {
  name: 'AppHeader',

  components: {
    SearchResults,
  },

  data: function() {
    return {
      open_nav: false,
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
      search_string: '',
      search_panel_open: false,
      searching: true,
      search_results: Object
    }
  },

  methods: {

    toggleNav(){
      this.open_nav = !this.open_nav;
      if (this.search_panel_open) {
        this.search_panel_open = false;
        this.search_string = '';
        this.searching = false;
      }
    },

    updateRoute: function() {
      this.currentPath = this.$route.path;
      this.toggleNav();
    },

    sendSearchString() {
      if (this.search_string.length >=3){
        if (this.open_nav) this.open_nav = false;
        this.searching = true;
        this.search_panel_open = true;
        let url = `/global-search/?search_string=${this.search_string}`
        return axios.get(url).then(results =>{
          console.log(results.data)
          this.search_results = results.data;
          this.searching = false;
        })
      } else if (!this.search_string.length) {
        this.search_panel_open = false;
        this.searching = false;
        this.search_results = null;
      }
    },

    closeSearch(){
      this.searching = false;
      this.search_string = '';
      this.search_panel_open = false;
    }

  } 
}


</script>

<style lang="scss">
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

.nav-sidebar {
  display: flex;
  flex-direction: column;
  width: 25%;
  height: 100%;
  position: absolute;
  right: 0;
  z-index: 9999;
  background-color: #435B6B;
  border-radius: 10px 0 0 10px;
}
.route-list {
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  height: 100%;
  margin: 25px;
  li {
    text-transform: uppercase;
    color: #FFFFFF;
    padding: 15px;
    text-align: left;
    font-family: 'Baloo 2';
    &:hover {
      color: #589040;
    }
    .router-link-exact-active {
      color: #589040;
      text-decoration: underline;    
    }
  }
}

.slide-enter-active {
  animation: menu-slide .5s;
}
.slide-leave-active {
  animation: menu-slide .5s reverse;
}
@keyframes menu-slide {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateY(0);
  }
}

</style>  