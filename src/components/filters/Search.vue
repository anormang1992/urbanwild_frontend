<template>
	<div class="search-container">
		<input v-model="wem_search"
			   	 @input="sendSearchString"
			     class="search-bar" 
			     type="text" 
				   name="wem-search" 
				   id="wem-search"
				   placeholder="Search WEMs..."/>		
	</div>	
</template>


<script>
import axios from 'axios';

export default {
  name: 'Search',
  props: {reset: Boolean},
  data: function() {
  	return {
  		wem_search:'',
  	}
  },
  watch: {
    reset: function () {
    	if (this.reset) {
    		this.wem_search = '';
    	}
    }
  },
  methods: {
  	sendSearchString() {
  		if (this.wem_search.length >= 3) {
  			this.$emit('updateSearch', 'search', this.wem_search)
  		}
  	},
  }
}
</script>

<style lang="scss">
.search-container {
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}
.search-bar {
	text-align: left;
	padding-left: 10px;
	font-family: 'Montserrat';
	width: 100%;
	height: 30px;
	background-color: #E9F0F8;
	border-radius: 10px;
}
#wem-search {
	outline: none;
}	
</style>