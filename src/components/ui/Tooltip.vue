<template>
	<div class="tooltip relative inline-block">
		<slot/>
		<span class="tooltip-content bg-wild text-white font-primary
								 text-center p-2 shadow-2xl"
					:class="bigtip ? 'w-40' : 'w-32'">
			{{text}}
		</span>
	</div>	
</template>


<script>
export default {
  name: 'Tooltip',
  props:{
  	text: String,
  	bigtip: Boolean,
  }
}
</script>

<style scoped="scss">
.tooltip-content {
	visibility: hidden;
	border-radius: 5px;
	position: absolute;
	z-index: 1;
	bottom: 125%;
	left: 50%;
	margin-left: -80px;
	opacity: 0;
	transition: opacity 0.3s;
}

.tooltip-content:after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #589040 transparent transparent transparent;
}

.tooltip:hover .tooltip-content {
	visibility: visible;
	opacity: 1;
}



</style>