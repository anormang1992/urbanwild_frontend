<template>
  <div class="header-container flex flex-row items-center p-3 justify-between">
    <div class="nav-logo">
      <router-link to="/"><img src="../../assets/logos/logo_minimal.png" width="250"></router-link>
    </div>
    <div class="flex flex-row w-full items-center justify-end space-x-8 relative">
      <div class="search flex flex-row items-center justify-center">
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
              <img v-if="route.path == currentRoutePath" 
                   src="../../assets/images/active_link_owl.png" width="30"
                   class="pr-2"/>
              <router-link :to="route.path" @click="updateRoute">{{ route.name }}</router-link>
            </li>
          </template>
        </ul>
      </div>
      <div class="contact-text">
        For more information, please contact our team at:<br>
        urbanwild.wems@gmail.com
      </div>
    </div>
  </transition>

  <transition name="slide">
    <search-results :searching="searching"
                    :results="search_results"
                    @closeSearch="closeSearch"
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
          name:'Help Wildlife',
          path:'/help'
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

  computed: {
    currentRoutePath() {
      return this.$route.path;
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
          let empty_results = true;
          for (let res in results.data) {
            let value = results.data[res]
            if (value.length) empty_results = false;
          }
          this.search_results = empty_results ? null : results.data;
          this.searching = false;
        })
      } else if (!this.search_string.length) {
        this.search_panel_open = false;
        this.searching = false;
        this.search_results = null; 
      } else if (0 < this.search_string.length < 3) {
        this.searching = true;
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
.nav-logo {
  img {
    image-rendering: high-quality;
  }
  @media(max-width:800px) {
    display: none;
  }
}
.search input[type=text]{
  padding: 5px;
  border: none;
  width: 250px;
  height: 50px;
  background-color: #E9F0F8;
  outline: none;
  font-family: 'Baloo 2';
  letter-spacing: 0.1em;
  @media(max-width:800px) {
    align-items: center;
    width: 100%;
  }

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
  align-items: center;
  justify-content: space-between;
  width: 20%;
  height: calc(100% - 100px);
  position: absolute;
  right: 0;
  z-index: 99999;
  background-color: #469cdd;
  border-radius: 25px 0 0 25px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  @media(max-width:1200px) {
    width: 100%;
    position: relative;
    border-radius: 0;
  }
  .route-list {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
    height: 100%;
    li {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      text-transform: uppercase;
      color: #FFFFFF;
      margin: 25px 0 25px 0;
      font-family: 'Baloo 2';
      font-weight: bold;
      font-size: 28px;
      width: 100%;
      &:hover {
        transform: scale(1.10);
      }
    }
  }
  .contact-text {
    font-family: 'Baloo 2';
    font-weight: bold;
    color: #FFFFFF;
    text-align: left;
    padding: 25px 10px;
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