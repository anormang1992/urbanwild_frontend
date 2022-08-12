<template>
  <div class="help-page flex flex-row w-full">
    <div class="help-page-inner">
      <div class="chatbox-container">
        <div class="chatbox-overlay"></div>
        <div class="chatbox-container-inner">
          <template v-for="message in chat_messages">
            <chat :chat_object="message" @nextStage="chatResponseHandler"></chat>
          </template>
        </div>
        <div class="wildlife-search-container">
          <input type="text" name="wildlife-search" placeholder="Search Wildlife...">
          <div class="submit-search-button">Search</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import axios from 'axios';
  import Chat from '@/components/ui/Chat';
  import chatMessageData from "@/assets/data/chat.json";

  export default {
  name: 'Help Page',

  components: {
    Chat
  },

  data: function() {
    return {
      chat_data: chatMessageData,
      chat_messages: [],
      current_stage: Object
    }
  },

  mounted() {
    this.chat_messages.push(
      this.chat_data.initial
    )
    this.current_stage = this.chat_data.initial;
  },

  methods: {
    chatResponseHandler() {
      this.chat_messages.push(
        this.chat_data[this.current_stage.next_stage]
      )
      this.current_stage = this.chat_data[this.current_stage.next_stage];
    }
  }

}
</script>

<style lang="scss">
.help-page-inner {
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  .chatbox-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow-y: auto;
    padding: 25px;
    width: 40%;
    height: 90%;
    border-radius: 25px;
    .chatbox-overlay {
      background-color: #E9F0F8;
      position: absolute;
      top: 0;
      left: 0;
      opacity: .8;
      width: 100%;
      height: 100%;
      border-radius: 25px;
    }
    .chatbox-container-inner {
      position: relative;
      overflow-y: auto;
    }
    .wildlife-search-container {
      display: flex;
      position: relative;
      width: 100%;
      input {
        border-radius: 10px 0 0 10px;
        width: 100%;
        padding: 15px;
      }
      .submit-search-button {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #589040;
        color: #FFFFFF;
        font-family: 'Baloo 2';
        font-weight: bold;
        font-size: 24px;
        border-radius: 0 10px 10px 0;
        width: 15%;
        padding: 5px;
        cursor: pointer;
      }
    }
  }

}

</style>