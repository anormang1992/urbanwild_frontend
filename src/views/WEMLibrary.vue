<template>
  <div v-if="loading" class="loading-wrapper">
    <div class="loader"></div>
    <h5>Loading WEM Library...</h5>
  </div>
  <div v-if="!loading" class="wem-page">
    <div class="wem-container flex flex-col w-full overflow-y-auto">
      <div v-if="current_wem" id="top" class="recent-outer">
        <div class="recent-inner">
          <div class="video-container" id="current-video-container">
            <farm-bureau-form v-if="form_open" @closeForm="closeForm"></farm-bureau-form>
          </div>
          <div class="video-info-container" style="font-family: 'Baloo 2';">
            <div class="flex flex-col text-left text-white w-full">
              <h1 class="text-3xl font-bold">{{current_wem.title}}</h1>
              <h2 class="text-lg">{{formatWEMDate(current_wem.released_at)}}</h2>
              <div v-if="current_wem.description" class="description-toggle" 
                   @click="show_description = !show_description">
                <h2 v-if="!show_description">Show Description</h2>
                <h2 v-else>Hide Description</h2>
              </div>
            </div>
            <div v-if="show_ad" class="ad-container">
              <div class="logo-sponsors">
                <img src="../../src/assets/logos/logo_proud_sponsors.png"/>
              </div>
              <div class="ad-hot-button pulse">
                <img @click="form_open=true" src="../../src/assets/logos/Farm_Bureau_Ad.png"/>
              </div>
            </div> 
          </div>
          <div v-if="show_description" class="description-container">
            <div class="description-overlay"></div>
            <div class="description-content">
              {{current_wem.description}}
            </div>
          </div>
        </div>
      </div>

      <div v-if="series_gallery && current_series && current_wem.series" class="gallery-outer">
        <div class="gallery-container">
          <div class="gallery-overlay"></div>
          <div class="flex flex-row w-full justify-between items-center relative p-2">
            <h2 class="text-3xl font-primary font-bold text-white pl-2" style="font-family: 'Baloo 2';">All Videos From the {{current_wem.series.name}} Series</h2>
          </div>
          <div class="grid sm:grid-cols-3 grid-cols-1 gap-2 w-full">
            <div v-for="(wem,index) in current_series" :key="index" class="flex flex-col h-full w-full p-4 relative">
              <div class="video-container p-2" @click="switchCurrentWEM(wem)">
                <a href="#top" class="h-full w-full">
                  <div class="thumb-overlay"></div>
                  <iframe :src="wem.video_link +'&title=0&byline=0&portrait=0'" 
                          :title="wem.title"
                          class="responsive-thumb-vid-container">
                  </iframe>
                </a>
              </div> 
              <div class="flex flex-col text-white text-left tracking-widest">
                <h1 class="text-lg">{{wem.title}}</h1>
                <h2 class="text-sm">{{formatWEMDate(wem.released_at)}}</h2>
              </div>
            </div> 
          </div> 
        </div>
      </div>  

      <div v-if="locked_wems.length" class="gallery-outer">
        <div id="wem-gallery" class="gallery-container">
          <div class="gallery-overlay"></div>
          <div class="gallery-header-container">
            <h2 class="gallery-header-text" style="font-family: 'Baloo 2';">
              Coming Soon...
            </h2>
          </div>
          <div class="locked-wems-container">
            <div v-for="(wem,index) in locked_wems" :key="index" class="locked-wems-item">
              <div class="video-container p-2">
                <div class="locked-overlay"></div>
                <div class="locked-icon-container">
                  <i class="fas fa-lock text-8xl"></i>
                </div>
                <iframe :src="wem.video_link +'&title=0&byline=0&portrait=0'" 
                        :title="wem.title"
                        class="responsive-thumb-vid-container">
                </iframe>
              </div>
              <div class="flex flex-col text-white text-left tracking-widest">
                <h1 class="text-lg">{{wem.title}}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div v-if="unlocked_wems.length" class="gallery-outer">
        <div id="wem-gallery" class="gallery-container">
          <div class="gallery-overlay"></div>
          <div class="gallery-header-container">
            <h2 class="gallery-header-text" 
                style="font-family: 'Baloo 2';">
              WEM Library
            </h2>
            <div class="gallery-filters-container">
              <search :reset="reset_filters" @updateSearch="updateParams"/>
              <i class="far fa-times-circle text-2xl text-white px-2 cursor-pointer"
                 @click="resetFilters"></i>
              <i class="fas fa-sliders-h text-2xl text-white cursor-pointer" 
                 @click="filters_open = !filters_open"></i>
            </div>
          </div>
          <div v-if="filters_open" class="filters-panel">
            <div class="filters-left">
              <sort-filter :reset="reset_filters" 
                           @updateSort="updateParams" 
                           @updateDirection="updateParams"/>
              <date-filter :reset="reset_filters" 
                           @updateFromDate="updateParams" 
                           @updateToDate="updateParams"/>
            </div>
            <div class="filters-right">
              <class-filter :filter_params="filter_params" 
                            @updateClass="updateParams"/>
              <tags-filter :filter_params="filter_params" 
                           @updateTags="updateParams"/>
            </div>
          </div>
          <!--Convert this to a reusable component-->
          <div v-if="unlocked_wems.length" class="grid sm:grid-cols-3 grid-cols-1 gap-2 w-full">
            <div v-for="(wem,index) in unlocked_wems" :key="index" class="flex flex-col h-full w-full p-4 relative">
              <div class="video-container p-2" @click="switchCurrentWEM(wem)">
                <a href="#top" class="h-full w-full">
                <div class="thumb-overlay"></div>
                <iframe :src="wem.video_link +'&title=0&byline=0&portrait=0'" 
                        :title="wem.title"
                        class="responsive-thumb-vid-container">
                </iframe>
                </a>
              </div>
              <div class="flex flex-col text-white text-left tracking-widest">
                <h1 class="text-lg">{{wem.title}}</h1>
                <h2 class="text-sm">{{formatWEMDate(wem.released_at)}}</h2>
              </div>
            </div>
            <div class="paginator-wrapper">
              <paginator v-if="page.count > unlocked_wems.length" 
                         @pageChange="updatePage"
                         page_type="wems"
                         :page="page"
                         :limit="filter_params.limit">
              </paginator> 
            </div>
          </div>
          <div v-else class="flex flex-row justify-center w-full p-4">
            <div class="flex flex-col text-xl text-white relative">
              <h1>Rats! No videos matched the criteria you provided.</h1>
              <h1>Please try expanding your search.</h1>
            </div>
          </div>
        </div>
      </div>

      <div v-if="series_collections.length" class="gallery-outer">
        <div id="wem-gallery" class="gallery-container">
          <div class="gallery-overlay"></div>
          <div class="flex flex-row w-full justify-between items-center relative p-2">
            <h2 class="text-3xl font-primary font-bold text-white pl-2" 
                style="font-family: 'Baloo 2';">
              All Wildlife Series
            </h2>
          </div>
          <div class="grid sm:grid-cols-3 grid-cols-1 gap-2 w-full">
            <div v-for="(wem,index) in series_collections" :key="index" class="flex flex-col h-full w-full p-4 relative">
              <a href="#top" class="w-full h-full">
                <div class="video-container p-2" @click="selectSeries(wem, index)">
                  <div class="thumb-overlay"></div>
                  <div class="series-overlay">
                    <div class="flex flex-row space-x-2 justify-between items-center">
                      <h1 class="text-lg text-white pl-2">{{wem.collection_videos[0].series.name}}</h1>
                      <div>
                        <i class="fas fa-clone text-white text-2xl"></i>
                        <p class="inline text-white">{{wem.collection_videos.length}}</p>
                      </div>
                    </div>
                  </div>
                  <iframe :src="wem.collection_videos[0].video_link" 
                          :title="wem.collection_videos[0].title"
                          class="responsive-thumb-vid-container">
                  </iframe>
                </div>
              </a>  
            </div> 
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import FilterSidebar from '@/components/shared/FilterSidebar.vue';
import Search from '@/components/filters/Search.vue';
import SortFilter from '@/components/filters/SortFilter.vue';
import DateFilter from '@/components/filters/DateFilter.vue';
import TagsFilter from '@/components/filters/TagsFilter.vue';
import ClassFilter from '@/components/filters/ClassFilter.vue';
import FarmBureauForm from '@/components/forms/FarmBureauForm.vue';
import Tooltip from '@/components/ui/Tooltip';
import Paginator from '@/components/ui/Paginator';

export default {
  name: 'WEM Library',
  components: {
    FilterSidebar,
    Search,
    SortFilter,
    DateFilter,
    ClassFilter,
    TagsFilter,
    FarmBureauForm,
    Tooltip,
    Paginator
  },

  data: function() {
    return {
      loading: true,
      page: Object,
      current_wem: Object,
      unlocked_wems: [],
      locked_wems: [],
      show_ad: false,
      form_open: false,
      series_gallery: false,
      series_collections: Array,
      current_series:[],
      show_description: false,
      view_series: false,
      filters_open: false,
      reset_filters: false,
      section_text: 'More Wildlife Educational Moments',
      current_page: 1,
      filter_params: {
        sort: '-date',
        classification: 'all',
        limit: 15,
        offset: 0
      },
    }
  },

  watch:{
    $route (to, from){
      this.applyGlobalSearch();
    }
  },

  async mounted() {
    // TODO: Refactor the complexity of this function --> should only need to set
    // the current_wem value based on if the wem query paramater exists instead of
    // duplicating so much code in both cases.
    await this.getWEMs().then(()=>{
      let gs = this.applyGlobalSearch();
      if (!gs) {
        this.current_wem = this.unlocked_wems[0];
        if (this.current_wem && this.current_wem.series) {
          this.series_gallery = true;
        }
        this.getSeriesCollections();
        this.createPlayer();
      }
    })
  },

  methods: {
    getWEMs() {
      let query_string = this.formatQueryString(this.filter_params)
      let url = '/api/v1/wems/'
      url += '?' + query_string
      return axios.get(url)
        .then(response => {
        //TODO: Fix this whenever you reset filters on a page other than 1
        this.page = response.data;
        response.data.results.forEach(wem => {
          if (wem.wem_locked) {
            if (!this.locked_wems.some(lw => lw.id === wem.id)) this.locked_wems.push(wem);
          } else if (!this.unlocked_wems.some(uw => uw.id === wem.id)){
            this.unlocked_wems.push(wem);
          } 
        })
        this.page = this.unlocked_wems;
        this.reset_filters = false;
        this.loading = false;
        }).catch(error => {
          console.log(error);
      })
    },

    applyGlobalSearch() {
      if (this.$route.query.wem) {
        let url = `/api/v1/wems/${this.$route.query.wem}/`
        axios.get(url).then(result => {
          this.current_wem = result.data;
          if (this.current_wem.series) {
            this.series_gallery = true;
          }
          this.getSeriesCollections();
          this.createPlayer();
          return true;
        })
      } 
    },

    getSeriesCollections() {
      let url='/api/v1/wems/wem-series/'
      axios.get(url)
        .then(response => {
          this.series_collections = response.data;
          this.current_series = this.getCurrentSeries();
        })
        .catch(error => {
          console.log(error);
        })
    },

    createPlayer() {
      if (this.$route.query.wem) {
        let query = Object.assign({}, this.$route.query);
        delete query.wem;
        this.$router.replace({ query });
      }
      var video_container = document.getElementById('current-video-container');
      let iframe = document.createElement('iframe');
      iframe.src = this.current_wem.video_link + '&title=0&byline=0&portrait=0';
      iframe.setAttribute('allowFullScreen', '')
      iframe.className = "responsive-vid-container";
      video_container.appendChild(iframe);
      let options = {
        url: this.current_wem.video_link + '&title=0&byline=0&portrait=0',
      }
      this.player = new Vimeo.Player(iframe, options);
      this.initFinishWatcher(this.current_wem);
    },

    getCurrentSeries() {
     for (let i = 0; i < this.series_collections.length; i++){
        if (this.series_collections[i].collection_name == this.current_wem.series.name) {
          return this.series_collections[i].collection_videos
        }
     }
    },

    formatWEMDate(date) {
      return moment(date).format('MMMM Do YYYY')
    },

    switchCurrentWEM(wem) {
      if (this.$route.query.wem) {
        console.log('true')
      }
      this.show_ad = false;
      this.series_gallery = !wem.series ? false : true;
      this.current_wem = wem;
      if (this.current_wem.series) {
        this.current_series = this.getCurrentSeries()
      }
      this.player.destroy().then(()=>{
        this.createPlayer();
      })
    },

    initFinishWatcher(wem) {
      this.player.on('ended', data => {
        this.show_ad = true;
        wem.play_count += 1;
        let url = `/api/v1/wems/${wem.id}/`;
        let update = {
          'play_count': wem.play_count
        }
        axios.patch(url, update).then((wem)=>{
          console.log('Play count updated!')
        })
      })
    },

    triggerAd() {
      this.show_ad = true;
    },

    updatePage(page) {
      this.current_page = page;
      this.filter_params.offset = (page-1) * this.filter_params.limit;
      this.getWEMs()
    },

    selectSeries(wem,index) {
      this.current_wem = wem.collection_videos[0];
      this.player.destroy().then(()=>{
        this.createPlayer();
      })
      if (this.current_wem.series) {
        this.series_gallery = true;
        this.current_series = this.getCurrentSeries()
      }
    },

    changeView() {
      this.view_series = !this.view_series;
    },

    formatQueryString(obj) {
      var str = ""
      for (var key in obj) {
        if (str != ""){
          str +="&";
        }
        str += key + "=" + obj[key];
      }
      return str;
    },

    updateParams(param, value) {
      switch (param) {
        case 'search':
          this.filter_params.search = value;
          break;
        case 'sort':
          let sort_direction = this.filter_params.sort.charAt(0) == '-' ? this.filter_params.sort.slice(0,1) : '';
          this.filter_params.sort = sort_direction + value;
          break;
        case 'sort_direction':
          let sort_column = this.filter_params.sort.charAt(0) == '-' ? 
                            this.filter_params.sort.slice(1) : this.filter_params.sort
          this.filter_params.sort = value + sort_column;
          break;
        case 'from_date':
          let from_date = new Date(value.replace(/-/g, '\/'));
          var timestamp = from_date.getTime();
          this.filter_params.from_date = timestamp;
          break;
        case 'to_date':
          let to_date = new Date(value.replace(/-/g, '\/'));
          var timestamp = to_date.getTime();
          this.filter_params.to_date = timestamp;
          break;
        case 'class':
          this.filter_params.classification = value;
          break;
        case 'tags':
          if (this.filter_params.tags) {
            this.filter_params.tags = this.mergeAndRemoveDupes(this.filter_params.tags.concat(value));
          } else {
            this.filter_params.tags = value;
          }
          break;
      }
      this.getWEMs()
    },

    addTags(tag) {
      this.filter_params.offset = 0;
      if (this.filter_params.tags) {
        this.filter_params.tags.push(tag)
        this.getWEMs()
      } else {
        this.filter_params.tags = []
        this.filter_params.tags.push(tag)
        this.getWEMs()
      }
    },

    mergeAndRemoveDupes(array) {
      var a = array.concat();
      for(var i=0; i<a.length; ++i) {
          for(var j=i+1; j<a.length; ++j) {
              if(a[i] === a[j])
                  a.splice(j--, 1);
          }
      }

      return a;
    },

    resetFilters() {
      this.reset_filters = true;

      this.filter_params.search = "";
      this.filter_params.sort = "-date";
      this.filter_params.classification = "all";
      this.filter_params.from_date = "";
      this.filter_params.to_date = "";
      this.offset = 0;
      delete this.filter_params['tags']

      this.getWEMs();
    },

    closeForm() {
      this.form_open = false;
    }

  }

}
</script>

<style lang="scss">
.loading-wrapper {
  display: flex;
  flex-direction: column; 
  justify-content: center;
  align-items: center;
  height: 100%;
  h5 {
    padding-top: 10px;
    font-size: 24px;
    color: #469cdd;
    font-family: 'Baloo 2';
  }
  .loader {
    height: 100px;
    width: 100px;
    margin: -25px 0 0 -25px;
    border: 8px rgba(0, 0, 0, 0.25) solid;
    border-top: 8px #589040 solid;
    border-radius: 50%;
    -webkit-animation: spin2 1s infinite linear;
            animation: spin2 1s infinite linear;
  }

  @-webkit-keyframes spin2 {
    from {
      -webkit-transform: rotate(0deg);
              transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(359deg);
              transform: rotate(359deg);
    }
  }
  @keyframes spin2 {
    from {
      -webkit-transform: rotate(0deg);
              transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
              transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(359deg);
              transform: rotate(359deg);
      -webkit-transform: rotate(359deg);
              transform: rotate(359deg);
    }
  }
}
.wem-page {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 100px);
  width: 100%;
  background-image: url('../../src/assets/backgrounds/wem_bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}
.wem-container {
  height:100%;
  scroll-behavior: smooth;
  padding: 15px;
}
.recent-outer {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
}
.recent-inner {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 60%;
  margin-top: 50px;
  @media(max-width:1200px) {
    width: 100%;
  }
  .video-info-container {
    display: flex; 
    flex-direction: row;
    justify-content: space-between;
    @media(max-width:1200px) {
      flex-direction: column;
    }
    .ad-container {
      display: flex;
      flex-direction: row;
      width: 100%;
      padding: 5px;
      justify-content: flex-end;
      align-items: center;
      .logo-sponsors {
        width: 200px;
        margin-right: 10px;
        img {
          image-rendering: -moz-crisp-edges;         
          image-rendering: -o-crisp-edges;         
          image-rendering: -webkit-optimize-contrast;
        }
      }
      .ad-hot-button, .sponsor-logo {
        cursor: pointer;
        width: 125px;
        padding: 2px;
        image-rendering: -moz-crisp-edges;
      }
      .sponsor-logo {
        cursor: auto;
      }
      @keyframes pulse {
        from { transform: scale(1); box-shadow: 0 0 0 0px rgba(166, 202, 231, 0.2);}
        50% { transform: scale(0.85); }
        to { transform: scale(1); box-shadow: 0 0 0 15px rgba(166, 202, 231, 0);}
      }
      .pulse {
        animation-name: pulse;
        animation-duration: 3s;
        animation-iteration-count: infinite;
      }
    }
  }
}
.video-container {
  position: relative;
  overflow: hidden;
  padding-top: 56.25%;
  width: 100%;
}
.responsive-vid-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.description-toggle {
  display: flex;
  color: #589040;
  font-weight: bold;
  cursor: pointer;
  font-size: 18px;
  margin-bottom: 5px;
}
.description-container {
  position: relative;
}
.description-overlay {
  background-color: #589040;
  position: absolute;
  width: 100%;
  height: 100%;
}
.description-content {
  color: #FFFFFF;
  text-align: left;
  padding: 15px;
  position: relative;
}
.description-content:after {
  content: "";
  position: absolute;
  top: -20px;
  left: 15px;
  height: 0px;
  width: 0px;
  border-width: 10px;
  border-style: solid;
  border-color: transparent transparent #589040 transparent;
}
.responsive-thumb-vid-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.gallery-outer {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 25px;
}
.gallery-container {
  display: flex;
  flex-direction: column;
  width: 70%;
  height: 100%;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 10px;
  @media(max-width:1200px) {
    width: 100%;
  }
  .gallery-header-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding: 5px;
    @media(max-width:1200px) {
      flex-direction: column;
    }
    .gallery-header-text {
      text-align: left;
      font-size: 1.87rem;
      font-family: 'Montserrat';
      font-weight: bold;
      color: #FFFFFF;
      width: 60%;
      padding-left: 5px;
      @media(max-width:1200px) {
        width: 100%;
      }
    }
    .gallery-filters-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 40%;
      justify-content: flex-end;
      @media(max-width:1200px) {
        width: 100%;
      }
    }
  }
}
.gallery-overlay {
  background-color: #435B6B;
  position: absolute;
  opacity: .70;
  width: 100%;
  height: 100%;
}
.filters-panel {
  display: flex;
  flex-direction: row;
  position: relative;
  background-color: #E9F0F8;
  width: 100%;
  padding: 15px;
  @media(max-width:1200px) {
   padding: 5px;
   flex-direction: column;
  }
  .filters-left {
    display: flex;
    flex-direction: column;
    width: 50%;
    @media(max-width:1200px) {
      width: 100%;
    }
  }
  .filters-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 50%;
    @media(max-width:1200px) {
      width: 100%;
      align-items: flex-start;
    }
  }
}
.filters-panel:after {
  content: "";
  position: absolute;
  top: -20px;
  right: 6px;
  height: 0px;
  width: 0px;
  border-width: 10px;
  border-style: solid;
  border-color: transparent transparent #E9F0F8 transparent;
} 
.locked-wems-container {
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
  overflow-x: auto;
}
.locked-wems-item {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: 10px;
  .locked-overlay {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    background-color: #589040;
    color: #469cdd;
    opacity: .25;
  }
  .locked-icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99999;
    height: 100%;
    width: 100%;
    color: #E9F0F8;
  }
}
.paginator-wrapper {
  grid-column: 1/-1;
}
.tag-container {
  background-color: #469cdd;
  color:  #FFFFFF;
  font-family: 'Baloo 2';
  min-width: 100px;
  border-radius: 10px;
  margin: 10px 5px 5px 5px;
  cursor: pointer;
}
.thumb-overlay {
  background-color: #589040;
  position: absolute;
  top: 0;
  left: 0;
  opacity: .25; 
  z-index: 9999;
  cursor: pointer;
  width: 100%;
  height: 100%;
}
.thumb-overlay:hover {
  background-color: #469cdd;
}
.series-overlay {
  background-color: transparent;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  cursor: pointer;
  width: 100%;
  height: 100%;
}
.series-overlay:hover .thumb-overlay{
  background-color: #469cdd;
}
</style>