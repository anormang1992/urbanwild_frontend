<template>
	<div class="flex flex-col w-3/4 m-2 px-4 items-start justify-between">
		<h1 class="font-bold font-primary tracking-widest">Classification</h1>
		<div @click="openClassificationMenu()" class="flex flex-row h-8 w-full bg-white items-center justify-between">
			<p class="font-primary tracking-widest pl-2">{{formatTitleCase(filter_params.classification)}}</p>
			<i v-if="!classification_menu" class="fas fa-caret-down text-xl pr-2"></i>
			<i v-else class="fas fa-caret-up text-xl pr-2"></i>
		</div>	

		<div class="flex flex-col w-full relative">
			<div v-if="classification_menu" class="classification-dropdown shadow-2xl">
				<template v-for="option in class_options">
					<div v-if="selected_class != option" 
							 @click="updateClassSelection(option)"
						   class="text-left pl-2 font-primary tracking-widest hover:bg-light-blue cursor-pointer">
						{{formatTitleCase(option)}}
					</div>
				</template>
			</div>
		</div>	

	</div>	
</template>


<script>
export default {
  name: 'ClassFilter',
  props: {filter_params:Object},
  data: function() {
  	return {
  		classification_menu: false,
  		selected_class: 'all',
  		class_options: ['all', 'amphibian', 'bird', 'fish','mammal, large', 'mammal, small', 
  										'raptor','reptile']

  	}
  },
  methods: {
  	formatTitleCase(string) {
  		return string.charAt(0).toUpperCase() + string.slice(1);
  	},
  	openClassificationMenu() {
  		this.classification_menu = !this.classification_menu;
  	},
  	updateClassSelection(selection) {
  		this.selected_class = selection;
  		this.classification_menu = false;
  		this.$emit('updateClass', 'class', this.selected_class)
  		return this.selected_class;
  	},
  }
}
</script>

<style scoped="scss">
.classification-dropdown {
	display:  flex;
	flex-direction: column;
	width:  100%;
	background-color: #FFFFFF;
	z-index: 99999;
	position: absolute;
}
</style>