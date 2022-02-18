<template>
  <div class="search-sidebar shadow-xl">
    <i class="close-button text-4xl p-4 fas fa-times" @click="$emit('closeSearchPanel')"></i>
    <div v-if="searching" class="searching-text text-2xl">
      Searching for critters, stories, and more...
    </div>
    <div class="results-container">
      <div v-for="obj, key in results" class="results-block">
        <div v-if="obj.length" class="results-block-inner">
          <div class="results-header">
            <h2>{{ key }}</h2>
          </div>
          <div v-for="result in obj" class="result-wrapper">
            <div class="name">
              {{ result.title || result.name}}
              <span v-if="result.series_video_count">({{ result.series_video_count }} Videos in Series) </span>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchResults',
  props: {
    searching: Boolean,
    results: Object
  },

  data: function() {
    return {

    }
  },
  methods: {

  }
}

</script>

<style lang="scss">
.search-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 25%;
  position: absolute;
  right: 0;
  z-index: 9999;
  background-color: #E9F0F8;
  .close-button {
    position: relative;
    color: #469cdd;
    text-align: right;
    cursor: pointer;
  }
  .searching-text {
    font-family: 'Baloo 2';
    color: #435B6B;
    position: relative;
    font-weight: bold;
    padding: 15px;
    text-align: left;
  }
  .results-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    .results-block {
      display: flex;
      flex-direction: row;
      width: 100%;
      padding: 10px;
      .results-block-inner {
        width: 100%;
        .results-header {
          font-family: 'Baloo 2';
          font-weight: bold;
          font-size: 24px;
          color: #435B6B;
          text-align: left;
        }
        .result-wrapper {
          display: flex;
          flex-direction: row;
          width: 100%;
          background-color: #469cdd;
          padding: 5px;
          border: 2px solid #c3c3c3;
          margin-bottom: 5px;
          cursor: pointer;
          &:hover {
            background-color: #589040;
          }
          .name {
            color: #FFFFFF;
            font-family: 'Montserrat';
            font-size: 18px;
          }
        }
      }
    }
  }
}
 
</style>