<template>
	<div class="flex flex-col w-3/4 m-2 px-4 items-start justify-between">
		<h1 class="font-bold font-primary tracking-widest">Tags</h1>
		<div class="flex flex-row w-full items-center justify-center">
			<input v-model="tag_search"
						 @input="getTagsFromInput"
						 class="text-left pl-2 font-primary tracking-widest w-full h-8 bg-white" 
						 type="text" 
						 name="tag-search" 
						 id="tag-search"
						 placeholder="Search Tags..." />		
				<div class="flex items-center justify-center h-8 bg-white"> 
					<i class="fas fa-search text-xl bg-white pr-2"></i>
				</div>
		</div>

		<div v-if="tag_list.length && tag_search" :class="tag_list.length > 1 ? 'h-20' : 'h-10'" class="flex flex-col w-full bg-white overflow-y-auto">
			<div @click="selectOrDeselectTag(tag)" v-for="tag in tag_list" class="flex flex-row w-full items-center py-2 justify-between cursor-pointer hover:bg-light-blue">
				<p class="text-left pl-2 font-primary tracking-widest">{{tag.name}}</p>
				<i v-if="filter_params.tags && filter_params.tags.includes(tag.name)" class="fas fa-check text-logo-wild pr-2"></i>
			</div>
		</div>

		<div class="flex flex-row w-full h-8 pt-2 space-x-2">
			<div v-for="selected_tag in filter_params.tags"
					 @click = "removeTag(selected_tag)" 
					 class="flex flex-row items-center justify-center p-2 
									text-white bg-wild cursor-pointer hover:bg-red-800">
					{{selected_tag}}
				</div>
		</div>	
	</div>	

</template>


<script>
import axios from 'axios';

export default {
  name: 'TagsFilter',
  props: {filter_params:Object},
  data: function() {
  	return {
  		tag_search:'',
  		tag_list: [],
  	}
  },
  methods: {
  	getTagsFromInput() {
  		if (this.tag_search.length >= 3) {
	  		let query_string =  "search" + "=" + this.tag_search;
	      let url = '/api/v1/tags/'
	      url += '?'+query_string
	      axios.get(url).then(response => {
	      	let tags = response.data.results
	      	this.tag_list = tags
	      })
	    }
  	},
  	selectOrDeselectTag(tag) {
			if (!this.filter_params.tags) {
				this.filter_params.tags = [];
  			this.filter_params.tags.push(tag.name);
  			this.tag_search = '';
  			this.$emit('updateTags', 'tags', this.filter_params.tags)
  		}
  		else if(this.filter_params.tags && !this.filter_params.tags.includes(tag.name)) {
  			this.filter_params.tags.push(tag.name);
  			this.tag_search = '';
  			this.$emit('updateTags', 'tags', this.filter_params.tags)
  		}
  		else if (this.filter_params.tags && this.filter_params.tags.includes(tag.name)){ 
  				for (var i = 0; i < this.filter_params.tags.length; i++) {
  					if (this.filter_params.tags[i] == tag.name) 
  						this.filter_params.tags.splice(i, 1);
  				this.$emit('updateTags', 'tags', this.filter_params.tags)
  			}
  		}
  	},
  	removeTag(tag) {
			for (var i = 0; i < this.filter_params.tags.length; i++) {
				if (this.filter_params.tags[i] == tag) {
					this.filter_params.tags.splice(i, 1);
				}
			}

			this.$emit('updateTags', 'tags', this.filter_params.tags)
  	}
  }
}
</script>

<style scoped="scss">
#tag-search {
	outline: none;
}	
</style>