<template>
  <div class="about-page flex flex-row w-full">
    <div class="about-page-outer w-full">
      <div class="about-page-inner sm:w-3/5 w-full">
        <div class="about-content-container">
          <div class="about-content">
            <h1>About the Founders</h1>
            <div class="flex flex-row w-full justify-center">
              <h2>
                Susan and Rex Ballard<br>
                Ballard Productions LLC
              </h2>
            </div>
            <div class="flex flex-row w-full justify-center">
              <img class="profile-image" src="./../../src/assets/images/about_page/the_ballards.png">
            </div>
            <p>
              It all started about a decade ago, when Susan Ballard picked up a turtle in the middle of the road that had been hit by a car. She rushed the turtle to a local licensed wildlife rehabilitator. Once she learned about how many North American wildlife species that are actually given a second chance at life at wildlife clinics, hospitals, and sanctuaries, Susan's world would never be the same again. She rushed home to her husband, Rex, and asked him to grab his video camera because there were lots of wildlife stories out there just waiting to be told! After all, both Susan and Rex have both been television producers for well over three decades!<br><br>

              It is a powerful thing when passion, knowledge, and hard work come together! Very soon, Rex and Susan were filming stories all over North Carolina with federally and state licensed wildlife rehabilitators. A sad and unfortunate reality quickly became apparent: many wildlife injuries are most often the result of human interaction in one way or another. To help mitigate these injuries, Susan and Rex realized that visual education would be paramount to protecting the wildlife around us.
            </p>
            <div class="flex flex-row flex-wrap justify-center w-full">
              <img class="about-image" src="./../../src/assets/images/about_page/rex_on_set.png">
              <img class="about-image" src="./../../src/assets/images/about_page/susan_and_raven.png">
              <img class="about-image" src="./../../src/assets/images/about_page/rex_and_owl.png">
              <img class="about-image" src="./../../src/assets/images/about_page/rex_and_bird_filming.png">
            </div>
          </div>
        </div>
        <div class="about-content-container">
          <div class="about-content">
            <h1>About the UrbanWild Site</h1>
            <p>
              It took several years to cultivate the UrbanWild website. The premise of the site is to educate users of all ages about the diverse wildlife around us and to provide individuals with the resources they require to help rescue injured wildlife. These goals are reflected in the very design of the site, which has been split into two distinct sides:
            </p>
            <h2 style="padding-left: 10px;font-size: 24px;">LEARN</h2>
            <p>
              The LEARN side will showcase three to five minute videos called “On a WEM” (Wildlife Educational Moments). Viewers of all ages will be able to learn something new and enriching about many wildlife species, including the ones they often see in their own backyard.
            </p>
            <h2 style="padding-left: 10px;font-size: 24px;">HELP</h2>
            <p>
              On the HELP side, when people find sick, injured, or orphaned wildlife, the site will advise them on the proper, and most efficient way to assist the wildlife in need. The site will even assist them in locating a licensed wildlife rehabilitator nearest to them as quickly as possible. Try to think of this side as “the 911 for wildlife”.
            </p>
            <div class="action-container">
              <uw-button name="Learn" route_path="/learn"/>
<!--               <uw-button name="Help" route_path="/help"/> -->
            </div>
          </div>
        </div>

        <div class="about-content-container">
          <div class="about-content">
            <h1>To Our Generous Sponsors and Supporters</h1>
            <p>
              When Patrick Cusack, a NC Farm Bureau Agency Manager, learned about what the Ballard’s were doing, he saw the wonderful correlation between Farm Bureaus beliefs and the Ballard’s mission. He immediately realized that a good match had been found.<br><br>
              Special thanks to our awesome team of talented humans:
            </p>
            <ul class="team-list">
              <li>Andrew Greene, Webmaster</li>
              <li>Henry Wong, Animation</li>
              <li>David Franks, Website Consultant</li>
              <li>Scott Rucci/Rucci Productions: Chief Video Editor</li>
              <li>Andy Poe, Video Production Support</li>
            </ul>
            <p>
              Rex and I want to take this opportunity to thank every Wildlife Rehabilitation Clinic, Hospital, and Sanctuary that has graciously invited us to document the amazing work you ALL do. You are Beautiful Souls that work long, hard hours to selflessly do whatever you can do in order to give our precious wildlife a second chance at life. Without you ALL, we simply could not do the work that we do! We hope everyone will enjoy all that UrbanWild.tv has to offer!<br><br>
              With eternal thanks and gratefulness,<br>
              ~Susan and Rex
            </p>
            <div class="sponsor-grid-container">
              <div class="sponsor-item">
                <img src="../assets/logos/Farm_Bureau_Ad.png" width="200"/>
              </div>
<!--               <div class="sponsor-item">
                <img src="../assets/logos/Rucci_Productions_Logo.png" width="200"/>
              </div> -->
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
  padding: 20px;
  overflow-x: hidden;
  overflow-y: auto;
}
.about-content-container {
  display: flex;
  background-color: #E9F0F8;
  position: relative;
  border-radius: 10px;
  margin: 10px;
  .about-content {
    position: relative;
    padding: 10px;
    text-align: left;
    .profile-image {
      height: 200px;
      width: 200px;
      border-radius: 100%;
    }
    .about-image {
      height: 200px;
      width: 200px;
      padding: 10px;
    }
    h1 {
      font-family: 'Baloo 2';
      font-weight: bold;
      font-size: 32px;
      text-align: center;
    }
    h2 {
      font-family: 'Baloo 2';
      font-size: 20px;
      text-align: left;
    }
    p {
      font-family: 'Montserrat';
      font-size: 18px;
      padding: 10px;
    }
    .team-list {
      font-family: 'Montserrat';
      font-size: 18px;
      padding: 10px;
      list-style-type: square;
      list-style-position: inside;
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