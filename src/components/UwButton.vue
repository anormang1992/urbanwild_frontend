<template>
  <button @click="navigateToRoute()"
          class="flex flex-row items-center justify-center text-white text-sm 
                 bg-dark-blue sm:text-lg w-40 p-2 shadow-2xl
                 hover:bg-urban hover:text-white hover:border-white">
    {{name}}
  </button>
</template>

<script>
export default {
  name: 'UWButton',
  props: {
    name: String,
    route_path: String,
  },
  methods: {
    navigateToRoute() {
      if (this.route_path) {
        this.$router.push(this.route_path)
      }
    }
  }
}
</script>

<style type="scss">
button {
  font-family: 'Baloo 2';
  font-weight: bold;
}
</style>