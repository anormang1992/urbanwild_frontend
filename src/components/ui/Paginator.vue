<template>
	<ul class="paginator">
		<li class="rounded-l-xl" :class="{disabled: !page.previous}" @click="changePage(1)">
			<a class="nav-arrow">&laquo;</a>
		</li>
		<li :class="{disabled: !page.previous}" @click="changePage(null, 'left')">
			<a class="nav-arrow">&lsaquo;</a>
		</li>
		<li v-if="(current_page - 2) > 1">
			<a>&hellip;</a>
		</li>
		<template v-for="i in num_pages">
			<span>
				<li v-if="i > (current_page - 3) && i < (current_page + 3)"
					@click="changePage(i)"
					:class="{active: i === current_page}">
					<a href="#">{{i}}</a>
				</li>
			</span>
		</template>
		<li v-if="num_pages > (current_page + 2)">
			<a>&hellip;</a>
		</li>

		<li :class="{disabled: !page.next}" @click="changePage(null, 'right')">
			<a class="nav-arrow">&rsaquo;</a>
		</li>
		<li class="rounded-r-xl" :class="{disabled: !page.next}" @click="changePage(num_pages)">
			<a class="nav-arrow">&raquo;</a>
		</li>
	</ul>
</template>

<script>
export default {
  name: 'Paginator',

  props: {
  	page_type: String,
  	page: Object,
  	limit: Number
  },

  data: function() {
    return {
      current_page: 1,
      num_pages: Number,
    }
  },
  mounted() {
 	if (this.page_type === "wems") {
 		this.num_pages = Math.ceil((this.page.count) / (this.limit))
 	}
  },
  methods: {
  	changePage(page, direction){
  		if (page != undefined) {
  			this.current_page = page;
  			this.$emit('pageChange', this.current_page)
  		}
  		if (direction) {
  			switch(direction) {
  				case 'left':
  					this.current_page == 1 ? this.current_page = 1 : this.current_page -= 1;
  					this.$emit('pageChange', this.current_page)
  					break;
  				case 'right':
  					this.current_page == this.num_pages ? this.current_page = this.num_pages : this.current_page += 1;
  					this.$emit('pageChange', this.current_page)
  					break;
  			}
  		}
  	}
  }

}
</script>

<style lang="scss">

.paginator {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 25px;
  li {
    display: inline-flex;
  	align-items: center;
  	justify-content: center;
  	position: relative;
  	height: 30px;
  	width: 40px;
  	color: #469cdd;
  	padding: 10px;
  	cursor: pointer;
  	font-size: 16px;
  	background-color: #E9F0F8;
  	border-width: 1px;
  	border-color: #E9F0F8;
  	.nav-arrow {
  	  font-size: 16px;
  	}
  	&.active {
	  background-color: #589040;
	  color: #FFFFFF;
  	}
  	&:hover {
      background-color: #A6CAE7;
    }
  	&.disabled {
  	  pointer-events: none;
  	}
  }
}
</style>