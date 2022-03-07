<template>
  <div class="about-page flex flex-row w-full">
    <div class="about-page-inner">
      <div class="about-content-container">
        <div class="about-left">
          <div class="slogan-text text-8xl">Helping to Rehabilitate Wildlife Since 2021</div>
        </div>
        <div class="about-right">
          <img src="../assets/images/about_us_message.png"/>
        </div>
      </div>
      <div class="support-container">
        <div class="support-inner">
          <img src="../assets/images/Fox_Message.png"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import axios from 'axios';
  import UwButton from '@/components/UwButton.vue'

  export default {
  name: 'About Page',

  components: {
    UwButton,
  },
  data: function() {
    return {
      name: "",
      email: "",
      message: "",
      sending: false
    }
  },
  methods: {
    sendMessage() {
      this.sending = this.name && this.email && this.message ? true : false;
      if (this.sending) {
        let data = {
          'name': this.name,
          'email': this.email,
          'message': this.message
        }
        let url = '/send-message/'
        return axios.post(url, data=data).then((response)=>{
          this.sending = false;
        }).catch(error => {
          console.log(error);
        })
      }
    }
  }

}
</script>

<style lang="scss">
.about-page-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #435B6B;
  padding: 15px;
  .about-content-container {
    display: flex;
    position: relative;
    height: 100%;
    background-color: #469cdd;
    .about-left {
      display: flex;
      width: 50%;
      padding: 15px;
      justify-content: center;
      align-items: center;
      .slogan-text {
        font-family: 'Baloo 2';
        color: #FFFFFF;
        font-style: italic;
      }
    }
    .about-right {
      display: flex;
      width: 50%;
      position: relative;
      padding: 15px;
      img {
        width: 100%;
        image-rendering: -moz-crisp-edges;         
        image-rendering: -o-crisp-edges;         
        image-rendering: -webkit-optimize-contrast;
      }
    }
  }
  .support-container {
    display: flex;
    position: relative;
    height: 100%;
    background-color: #589040;
    margin-top: 15px;
    .support-inner {
      display: flex;
      width: 50%;
      padding: 15px;
      img {
        width: 100%;
        image-rendering: -moz-crisp-edges;         
        image-rendering: -o-crisp-edges;         
        image-rendering: -webkit-optimize-contrast;
      }
    }
  }
}
</style>
