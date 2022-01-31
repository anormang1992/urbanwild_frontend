<template>
  <div class="flex flex-row flex-grow-1 h-full w-1/4 shadow-xl relative" v-if="toggle_sidebar">
    <div class="side-bar-overlay h-full w-full"></div>
    <div class="filter-container-inner flex flex-col w-full relative">
      <div class="flex flex-row items-center justify-end cursor-pointer p-2" @click="toggleSidebar()">
        <i class="fas fa-caret-left text-4xl text-white pr-2"></i>
        <i class="fas fa-sliders-h text-4xl text-white self-end"></i>
      </div>

      <h1 class="text-3xl text-white font-primary tracking-widest">{{title}}</h1>

      <slot/>
      <div class="flex flex-col w-full items-center justify-center pt-4">
        <uw-button @click="resetFilters" name="Reset Filters" class="h-12"></uw-button>
      </div>

    </div>
  </div>

  <div class="flex items-center justify-center items-center w-20 h-20 bg-dark-blue mt-4 
              rounded-r-xl cursor-pointer" @click="toggleSidebar()"
              v-if="!toggle_sidebar">
    <div class="flex flex-row">
      <i class="fas fa-sliders-h text-4xl text-white"></i>
      <i class="fas fa-caret-right text-4xl text-white pl-2"></i>
    </div>
  </div>

</template>



<script>
import UwButton from '@/components/UwButton.vue'

export default {
  name: 'Filter Sidebar',
  emits:['applyFilters', 'resetFilters'],

  props: {
    title: String,
    init_opened: Boolean,
  },

  components: {
    UwButton,
  },

  data: function() {
    return {
      toggle_sidebar: false,
    }
  }, 

  mounted() {
    if (this.init_opened) {
      this.toggle_sidebar = !this.toggle_sidebar
    }
  },

  methods: {
    toggleSidebar() {
      this.toggle_sidebar = !this.toggle_sidebar
    },
    resetFilters() {
      this.$emit('resetFilters')
    }

  }

}
</script>

<style>
.side-bar-overlay {
  background-color: #435B6B;
  position: absolute;
  opacity: 70%;
}
</style>
