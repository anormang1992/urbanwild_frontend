<template>
  <div class="about-page flex flex-row w-full">
    <div class="about-page-outer w-full">
      <div class="about-page-inner sm:w-1/2 w-full">
        <div class="about-content-container">
          <div class="about-content">
            <h1>Helping to Rehabilitate Wildlife Since 2021</h1>
            <p>UrbanWild is a non-profit organization based out of Raleigh, North Carolina dedicated to rescuing and protecting wildlife from the threats of urbanization. We work hand-in-hand with licensed rehabilitators across the United States to create an effective network of resources designed to quickly Report, Relieve, and Release injured wildlife. We also strive to educate people of all ages about the diverse wildlife we often come into contact with.</p>
            <div class="action-container">
              <uw-button name="Learn" route_path="/learn"/>
            </div>
          </div>
        </div>
        <div class="about-content-container">
          <div class="about-content">
            <h1>Our Generous Sponsors and Supporters</h1>
            <p>UrbanWild wouldn't be possible without the support, dedication, and skills of some truly wonderful companies and individuals. We would like to thank, and give credit where credit is due, to our sponsors, supporters, family, and friends who have made UrbanWild a reality. Together, we can save the wild, one life at a time!</p>
            <div class="sponsor-grid-container">
              <div class="sponsor-item">
                <img src="../assets/logos/Farm_Bureau_Ad.png" width="200"/>
              </div>
              <div class="sponsor-item">
                <img src="../assets/logos/Rucci_Productions_Logo.png" width="200"/>
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
  background-color: #E9F0F8;
  position: relative;
  border-radius: 10px;
  margin: 25px;
  .about-content {
    position: relative;
    padding: 15px;
    text-align: left;
    h1 {
      font-family: 'Baloo 2';
      font-weight: bold;
      font-size: 32px;
      text-align: center;
    }
    p {
      font-family: 'Montserrat';
      font-size: 18px;
    }
    .sponsor-grid-container {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      column-gap: 5px;
      padding-top: 10px;
      width: 100%;
      .sponsor-item {
        display: flex;
        justify-content: center;
      }
    }
  }
  .action-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin: 10px;
  }
}
</style>