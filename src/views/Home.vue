<template>
    <div class="home-page">
      <div class="home-page-inner">
        <div class="learn-side">
          <div v-if="overlayLeftOn" class="learn-side-overlay"></div>
          <div class="flex flex-col w-full items-start xl:pl-20 p-4 relative">
            <div class="text-white text-left cursor-pointer sm:w-3/5" 
                        @mouseover="overlayLeftOn = false"
                        @mouseleave="overlayLeftOn = true"
                        @click="navigateToRoute('/learn')">
              <h1 class="xl:text-8xl text-5xl font-bold tracking-widest">Learn</h1>
              <h2 class="xl:text-3xl text-xl tracking-widest">about the wildlife in your area</h2>
            </div>
          </div> 
        </div>

        <div class="logo-container"> 
          <img src="../assets/logos/logo_circular.png">
        </div>

        <div class="help-side">
          <div v-if="overlayRightOn" class="help-side-overlay w-full h-full relative"></div>
          <div class="flex flex-col w-full sm:items-end items-start xl:pr-20 p-4 relative">
            <div class="text-white sm:text-right text-left cursor-pointer sm:w-3/5">
              <h1 class="xl:text-9xl text-5xl font-bold tracking-widest">Help</h1>
              <!--<h2 class="text-3xl tracking-widest">wildlife in need</h2> -->
              <h2 class="xl:text-3xl text-xl tracking-widest">Under Construction...</h2>
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

<style lang="scss">
.home-page {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  .home-page-inner {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
    position: relative;
    @media(max-width:800px) {
      flex-direction: column;
    }
    .learn-side {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      clip-path: polygon(0 0, calc(100% - 40vh) 0, 100% 100%, 0 100%);
      -webkit-clip-path: polygon(0 0, calc(100% - 40vh) 0, 100% 100%, 0 100%);
      margin-right: -19vh;
      background-image: url('../../src/assets/backgrounds/learn_bg.png');
      background-repeat: no-repeat;
      background-size: cover;
      font-family: "Baloo 2";
      position: relative;
      @media(max-width:1200px) {
        clip-path: none;
        -webkit-clip-path: none;
        margin-right: 0;
        height: 100%;
        border: 5px solid #FFFFFF;
      }
      .learn-side-overlay {
        height: 100%;
        width: 100%;
        background-color: #469cdd;
        position: absolute;
        opacity: .40;
      }
    }
    .help-side {
      display: flex;
      flex-direction: row;
      width: 100%;
      align-items: center;
      background-image: url('../../src/assets/backgrounds/help_bg.jpg');
      background-repeat: no-repeat;
      background-size: cover;
      font-family: "Baloo 2";
      clip-path: polygon(0 0, 100% 0, 100% 100%, calc(0% + 40vh) 100%);
      -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, calc(0% + 40vh) 100%);
      margin-left: -19vh;
      position: relative;
      @media(max-width:1200px) {
        clip-path: none;
        -webkit-clip-path: none;
        margin-left: 0;
        height: 100%;
        border: 5px solid #FFFFFF;
      }

      .help-side-overlay {
        height: 100%;
        width: 100%;
        background-color: #42414d;
        position: absolute;
        opacity: .80;
      }
    }
    .logo-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      img {
        image-rendering: -moz-crisp-edges;         
        image-rendering: -o-crisp-edges;         
        image-rendering: -webkit-optimize-contrast;
        width: 400px;
        @media(max-width:1200px) {
          width: 250px;
        }
      }
    }
  }
}
</style>