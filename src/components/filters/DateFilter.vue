<template>
	<div class="flex flex-col w-3/4 m-2 px-4 items-start justify-between">
		<h1 class="font-bold font-primary tracking-widest">Date Range</h1>	
		<div class="flex flex-col w-full items-start space-y-4">
			<div class="flex flex-row h-8 w-full bg-white items-center justify-between">
				<p class="font-primary tracking-widest pl-2">From: </p>
				<div class="date-picker flex flex-row">
					<input v-model="date_range.from_date" @change="updateFromDate" type='date' id='date-from' name="date-from">
				</div>
			</div>

			<div class="flex flex-row h-8 w-full bg-white items-center justify-between">
				<p class="font-primary tracking-widest pl-2">To: </p>
				<div class="flex flex-row cursor-pointer">
					<div class="date-picker flex flex-row">
						<input v-model="date_range.to_date" @change="updateToDate" type='date' id='date-to' name="date-to">
					</div>
				</div>
			</div>
		</div>
	</div>	
</template>


<script>
import moment from 'moment';

export default {
  name: 'DateFilter',

  props: {reset: Boolean},

  data: function() {
  	return {
  		date_range:{
  			from_date: "",
  			to_date: ""
  		}
  	}
  },

  watch: {
  	reset: function() {
  		if (this.reset) {
  			this.date_range.from_date = "";
  			this.date_range.to_date = "";
  		}
  	}
  },

  methods: {
  	updateFromDate() {
  		this.$emit('updateFromDate', 'from_date', this.date_range.from_date)
  	},
  	updateToDate() {
  		this.$emit('updateToDate', 'to_date', this.date_range.to_date)
  	}
  }

}
</script>

<style scoped="scss">
.date-picker input[type=date] {
	background-color: #FFFFFF;
	cursor: pointer;
	outline: none;
	text-align: right;
}
	
</style>