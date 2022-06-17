<template>
  <div class="help-page flex flex-row w-full">
    <div class="help-page-inner">
      <div class="chatbox-container">

      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import axios from 'axios';

  export default {
  name: 'Help Page',

  data: function() {
    return {

    }
  },

  methods: {

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
    padding: 25px;
    width: 50%;
    height: 90%;
    background-color: #E9F0F8;
    opacity: .8;
    border-radius: 25px;
  }

}

</style>