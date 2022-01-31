<template>
	<div class="flex flex-col w-full px-4 m-2 items-start justify-between">
		<h1 class="font-bold font-primary tracking-widest">Sort</h1>
		<div class="flex flex-row h-8 w-full items-center cursor-pointer">
			<div @click="openSortMenu()" class="flex flex-row h-full w-1/2 bg-white items-center justify-between">
				<p class="font-primary tracking-widest pl-2">{{formatTitleCase(selected_sort_column)}}</p>
				<i class="fas fa-caret-down text-xl pr-2"></i>
			</div>	
			<div class="flex flex-col pl-4 text-2xl">
				<i @click = "updateSortDirection('asc')"
					 class="fas fa-sort-up text-white cursor-pointer" 
					 :class="{'text-logo-urban': sort_direction == ''}"></i>
				<i @click = "updateSortDirection('desc')"
					 class="fas fa-sort-down text-white cursor-pointer" 
					 :class="{'text-logo-urban': sort_direction == '-'}"></i>
			</div>
		</div>
		<div class="flex flex-col w-full relative">
			<div v-if="sort_menu" class="flex flex-col w-1/2 bg-white shadow-2xl z-50 absolute">
				<template v-for="column in sort_by_columns">
					<div v-if="selected_sort_column != column" 
							 @click="updateSortSelection(column)"
						   class="text-left pl-2 font-primary tracking-widest hover:bg-light-blue cursor-pointer">
						{{formatTitleCase(column)}}
					</div>
				</template>
			</div>	
		</div>
	</div>	

</template>


<script>
export default {
  name: 'SortFilter',
  props: {reset: Boolean},
  data: function() {
  	return {
  		sort_direction: '-',
  		selected_sort_column: 'date',
  		sort_by_columns: ['date', 'title'],
  		sort_menu: false,
  	}
  },
  watch: {
  	reset: function() {
  		if (this.reset) {
  			this.sort_direction = '-'
  			this.selected_sort_column = 'date'
  		}
  	}
  },
  methods: {
  	formatTitleCase(string) {
  		return string.charAt(0).toUpperCase() + string.slice(1);
  	},
  	openSortMenu() {
  		this.sort_menu = !this.sort_menu;
  	},
  	updateSortSelection(selection) {
  		this.selected_sort_column = selection;
  		this.sort_menu = false;
  		this.$emit('updateSort', 'sort', this.selected_sort_column)
  		return this.selected_sort_column;
  	},
  	updateSortDirection(direction) {
  		if (direction == 'asc') {
  			this.sort_direction = '';
  		} else {
  			this.sort_direction = '-';
  		}
  		this.$emit('updateDirection', 'sort_direction', this.sort_direction)
  	}
  }

}
</script>