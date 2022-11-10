<template>
  <div class="about-page flex flex-row w-full">
    <div class="about-page-header-container">
      <div class="header-background"></div>
      <div class="header-title-container">
        <div class="header-title">About Us</div>
      </div>
    </div>
   
    <div class="about-content-container">
      <div class="about-content-inner">
        <div class="section about-founders">

          <div class="founders-image-container">
            <img class="profile-image" src="./../../src/assets/images/about_page/the_ballards.png">
            <div class="profile-image-label">
              Susan and Rex Ballard<br>
              Ballard Productions LLC
            </div>
          </div>

          <div class="founders-section-content">
            <h2 class="content-header">About the Founders</h2>
            <div class="content">
              It all started about a decade ago, when Susan Ballard picked up a turtle in the middle of the road that had been hit by a car. She rushed the turtle to a local licensed wildlife rehabilitator. Once she learned about how many North American wildlife species that are actually given a second chance at life at wildlife clinics, hospitals, and sanctuaries, Susan's world would never be the same again. She rushed home to her husband, Rex, and asked him to grab his video camera because there were lots of wildlife stories out there just waiting to be told! After all, both Susan and Rex have both been television producers for well over three decades!<br><br>

              It is a powerful thing when passion, knowledge, and hard work come together! Very soon, Rex and Susan were filming stories all over North Carolina with federally and state licensed wildlife rehabilitators. A sad and unfortunate reality quickly became apparent: many wildlife injuries are most often the result of human interaction in one way or another. To help mitigate these injuries, Susan and Rex realized that visual education would be paramount to protecting the wildlife around us. 

            </div>
          </div>

        </div>
        <div class="section about-site">
            <h2 class="content-header">About the UrbanWild Site</h2>
            <div class="content">
              It took several years to cultivate the UrbanWild website. The premise of the site is to educate users of all ages about the diverse wildlife around us and to provide individuals with the resources they require to help rescue injured wildlife. These goals are reflected in the very design of the site, which has been split into two distinct sides:
            </div>
            <div class="content-blocks-container">
              <div @click="navigateToRoute('/learn')" class="content-block">
                <h3>LEARN</h3>
                <div class="content-block-text">
                  The LEARN side will showcase three to five minute videos called “On a WEM” (Wildlife Educational Moments). 
                  Viewers of all ages will be able to learn something new and enriching about many wildlife species, including 
                  the ones they often see in their own backyard.
                </div>
              </div>

              <div class="content-block">
                <h3>HELP</h3>
                <div class="content-block-text">
                On the HELP side, when people find sick, injured, or orphaned wildlife, the site will advise them on the 
                proper, and most efficient way to assist the wildlife in need. The site will even assist them in locating 
                a licensed wildlife rehabilitator nearest to them as quickly as possible. Try to think of this side as 
                “the 911 for wildlife”.
                </div>
              </div>

            </div>

        </div>
        <div class="section about-supporters">
          <h2 class="content-header">To Our Generous Sponsors and Supporters</h2>
            <div class="content">
              <p>
                When Patrick Cusack, a NC Farm Bureau Agency Manager, learned about what the Ballard’s were doing, 
                he saw the wonderful correlation between Farm Bureaus beliefs and the Ballard’s mission. He immediately 
                realized that a good match had been found. Special thanks to our awesome team of talented humans:
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

  components: {},
  data: function() {
    return {}
  },
  methods: {
    navigateToRoute(route) {
      this.$router.push(route)
    }
  }

}
</script>

<style lang="scss">
.about-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #469cdd;
  .about-page-header-container {
    min-height: 325px;
    width: 100%;
    position: relative;
    .header-background {
      height: 100%;
      background-image: url('../../src/assets/backgrounds/about_bg.jpg');
      background-repeat: no-repeat;
      background-size: cover;
    }
    .header-title-container {
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: #469cdd;
      padding: 10px;
      width: 250px;
      border-radius: 0 25px 0 0;
      .header-title {
        color: #FFFFFF;
        font-size: 36px;
        font-weight: bold;
        font-family: 'Baloo 2';
      }
    }
  }
  .about-content-container {
    display: flex;
    width: 100%;
    height: calc(100% - 325px);
  }
  .about-content-inner {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .section {
      display: flex;
      width: 100%;
      h2 {
        font-weight: 700;
        font-family: 'Baloo 2';
        text-align: center;
        font-size: 28px;
      }
    }
    .about-founders {
      background-color: #E9F0F8;
      color: #435B6B;
      .founders-image-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 30%;
        padding: 25px;
        .profile-image {
          height: 300px;
          width: 300px;
          border-radius: 100%;
        }
        .profile-image-label {
          font-size: 18px;
          font-family: 'Montserrat';
          letter-spacing: 0.1em;
        }
      }
      .founders-section-content {
        display: flex;
        flex-direction: column;
        width: 70%;
        padding: 15px;
        .content {
          text-align: left;
          font-size: 20px;
          letter-spacing: 0.1em;
          font-family: 'Montserrat';
          padding-bottom: 30px;
        }
      }
    }
    .about-site {
      flex-direction: column;
      align-items: center;
      background-color: #435B6B;
      color: #FFFFFF;
      padding: 15px;
      .content {
        text-align: left;
        font-size: 20px;
        width: 75%;
        letter-spacing: 0.1em;
        font-family: 'Montserrat';
      }
      .content-blocks-container {
        display: flex;
        width: 100%;
        justify-content: center;
        padding: 25px;
        gap: 50px;
        .content-block {
          display: flex;
          flex-direction: column;
          background-color: #FFFFFF;
          color: #435B6B;
          padding: 25px;
          border-radius: 25px;
          max-width: 450px;
          h3 {
            font-weight: 700;
            font-family: 'Baloo 2';
            text-align: left;
            font-size: 20px;
          }
          .content-block-text {
            text-align: left;
            font-size: 18px;
            font-family: 'Montserrat';
            letter-spacing: 0.1em;
          }
        }
        .content-block:hover {
          cursor: pointer;
          background-color: #589040;
          color: #FFFFFF;
        }
      }
    }
    .about-supporters {
      flex-direction: column;
      align-items: center;
      background-color: #E9F0F8;
      padding: 15px;
      text-align: left;
      .content {
        text-align: left;
        font-size: 20px;
        width: 75%;
        letter-spacing: 0.1em;
        font-family: 'Montserrat';
      }
      .team-list {
        padding: 25px;
        list-style-type: square;
        list-style-position: inside;
      } 
      .sponsor-grid-container {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        column-gap: 5px;
        padding: 25px;
        width: 100%;
        .sponsor-item {
          display: flex;

        }
      }
    }
  }
}
@media screen and (max-width:1200px) {
  .about-content-inner {
    overflow-x: hidden;
    .about-founders {
      flex-direction: column;
      .founders-image-container, .founders-section-content {
        width: 100% !important;
      }
    }
    .about-site {
      .content {
        width: 100% !important;
      }
      .content-blocks-container {
        flex-direction: column;
        padding: 10px !important;
        gap: 25px !important;
      }
    }
    .about-supporters {
      .content {
        width: 100% !important;
      }
    }
  }
}


</style>