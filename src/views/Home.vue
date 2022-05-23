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
              <h2 class="xl:text-3xl text-xl tracking-widest">about wildlife in your area</h2>
            </div>
          </div> 
        </div>

        <div class="logo-container"> 
          <video id="logo-animation" class="logo-animation" muted autoplay>
            <source id="animation-source" src="../assets/animations/uw_animated_logo.mp4" type="video/mp4">
          </video>
        </div>

        <div class="help-side">
          <div v-if="overlayRightOn" class="help-side-overlay w-full h-full relative"></div>
          <div class="flex flex-col w-full sm:items-end justify-end xl:pr-20 p-4 relative">
            <div class="text-white text-left cursor-pointer">
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
  mounted() {
    var logo_animation = document.getElementById('logo-animation');
    logo_animation.addEventListener("timeupdate", function () {
        if(this.currentTime >= 14) {
            console.log('true')
            this.currentTime = 7.125;
            this.play();
        }
    });
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
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      border-radius: 50%;
      background-color: #FFFFFF;
      width: 500px;
      height: 500px;
      overflow: hidden;
      @media(max-width:1200px) {
        width: 250px;
        height: 250px;
      }
      .logo-animation {
        -webkit-transform:scale(1.35);
        transform:scale(1.35);
      }
    }
  }
}
</style>