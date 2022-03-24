<template>
  <div class="about-page flex flex-row w-full">
    <div class="about-page-outer w-full">
      <div class="about-page-inner sm:w-1/2 w-full">
        <div class="about-content-container">
          <div class="about-position shadow-2xl">
            <div class="about-overlay"></div>
            <div class="about-content">
              <h1>Helping to Rehabilitate Wildlife Since 2021</h1>
              <p>UrbanWild is a non-profit organization based out of Raleigh, North Carolina dedicated to rescuing and protecting wildlife from the threats of urbanization. We work hand-in-hand with licensed rehabilitators across the United States to create an effective network of resources designed to quickly Report, Relieve, and Release injured wildlife. We also strive to educate people of all ages about the diverse wildlife we often come into contact with.</p>
              <div class="action-container">
                <uw-button name="Learn" route_path="/learn"/>
              </div>
            </div>
          </div>
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
.about-page-outer {
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: flex-end;
}
.about-page-inner {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  padding: 25px;
  overflow-x: hidden;
  overflow-y: auto;
}
.about-content-container {
  display: flex;
  background-color: #469cdd;
  position: relative;
  border-radius: 10px;
  margin: 25px 25px 0 0;  
  .about-position {
    position: relative;
    top: 15px;
    left: 15px;
    width: 100%;    
  }
  .about-overlay {
    background-color: #E9F0F8;
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
  .about-content {
    position: relative;
    padding: 15px;
    text-align: left;
    h1 {
      font-family: 'Baloo 2';
      font-weight: bold;
      font-size: 32px;
    }
    p {
      font-family: 'Montserrat';
      font-size: 18px;
    }
  }
  .action-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin: 10px;
  }
}
.support-container {
  display: flex;
  position: relative;
  height: 100%;
  margin-top: 15px;
  .support-inner {
    display: flex;
    width: 100%;
    padding: 15px;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      image-rendering: -moz-crisp-edges;         
      image-rendering: -o-crisp-edges;         
      image-rendering: -webkit-optimize-contrast;
    }
  }
}
</style>