<template>
  <div class="news-page flex flex-row w-full">
    <filter-sidebar title="Filter Posts"/> 
    <div class="flex flex-col flex-grow posts-container w-full overflow-y-auto">
      <div class="text-5xl text-white font-bold font-primary mx-auto pt-10" style="font-family: 'Baloo 2';">
        <h1>Recent News</h1>    
      </div>
      <div class="grid grid-cols-3 gap-4 justify-items-center p-10">
        <template v-for="post in posts">
          <post-block :post="post"></post-block>
        </template>
      </div>
      <div class="flex flex-row w-full justify-center pt-10">
        <uw-button name="View More"/>
      </div>
    </div> 

  </div>
</template>

<script type="text/javascript">
  import axios from 'axios'
  import PostBlock from '@/components/PostBlock.vue'
  import FilterSidebar from '@/components/shared/FilterSidebar.vue'
  import UwButton from '@/components/UwButton.vue'

  export default {
  name: 'News Page',

  components: {
    PostBlock,
    FilterSidebar,
    UwButton
  },

  data: function() {
    return {
      posts: Array,
      toggle_sidebar: false,
    }
  },

  mounted() {
    this.getPosts()
  },

  methods: {
    getPosts() {
      axios.get('/api/v1/posts/')
      .then(response => {
        this.posts = response.data
      })
      .catch(error => {
        console.log(error)
      })
    },
    toggleSidebar() {
      this.toggle_sidebar = !this.toggle_sidebar
    }
  }

}
</script>

<style>
.post-overlay {
  background-color: #488d4a;
  position: absolute;
  opacity: 70%;
  width: 75%;
}

.posts-container {
  height: calc(100vh - 100px);
}
</style>

