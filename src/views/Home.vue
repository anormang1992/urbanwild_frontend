<template>
    <div class="home-page flex flex-row w-full h-full">
      <div class="flex flex-row h-full w-full bg-white">

        <div class="learn-side flex flex-row w-full items-center">
          <div v-if="overlayLeftOn" class="learn-side-overlay w-full h-full"></div>
          <div class="flex flex-col w-full items-start pl-20 relative">
            <div class="text-white text-left cursor-pointer" 
                        @mouseover="overlayLeftOn = false"
                        @mouseleave="overlayLeftOn = true"
                        @click="navigateToRoute('/learn')">
              <h1 class="text-9xl font-bold tracking-widest">Learn</h1>
              <h2 class="text-3xl tracking-widest">about the wildlife in your area</h2>
            </div>
          </div> 
        </div>

        <div class="logo-container"> 
          <img src="../assets/logo_circular.png" width="625">
        </div>

        <div class="help-side flex flex-row w-full items-center">
          <div v-if="overlayRightOn" class="help-side-overlay w-full h-full relative"></div>
          <div class="flex flex-col w-full items-end pr-20 relative">
            <div class="text-white text-right cursor-pointer">
              <h1 class="text-9xl font-bold tracking-widest">Help</h1>
              <!--<h2 class="text-3xl tracking-widest">wildlife in need</h2> -->
              <h2 class="text-3xl tracking-widest">Under Construction...</h2>
            </div>
          </div> 
        </div>

      </div>
    </div>
</template>



<script>
export default {
  name: 'Home',
  data: function() {
    return {
      overlayLeftOn: true,
      overlayRightOn: true,
    }
  },
  methods: {
    navigateToRoute(route) {
      this.$router.push(route)
    }

  }
}
</script>

<style scoped="scss">

.learn-side {
  clip-path: polygon(0 0, calc(100% - 40vh) 0, 100% 100%, 0 100%);
  -webkit-clip-path: polygon(0 0, calc(100% - 40vh) 0, 100% 100%, 0 100%);
  margin-right: -19vh;
} 

.learn-side-overlay {
  background-color: #469cdd;
  position: absolute;
  opacity: 40%;
}

.help-side {
  clip-path: polygon(0 0, 100% 0, 100% 100%, calc(0% + 40vh) 100%);
  -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, calc(0% + 40vh) 100%);
  margin-left: -19vh;
}

.help-side-overlay {
  background-color: #42414d;
  position: absolute;
  opacity: 80%;
}

.logo-container {
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
</style>