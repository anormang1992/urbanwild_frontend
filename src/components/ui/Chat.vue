<template>
	<div class="chatbot-container">
		<div class="chatbot-icon-container">
			<img class="chatbot-icon" src="../../../src/assets/images/chatbot-icon.svg"/>
		</div>
		<div class="chat-message-container">
			<div class="chat-text">{{chat_message}}</div>
			<div v-if="show_button" class="chat-button">{{button_text}}</div>
		</div>
	</div>

</template>

<script>
export default {
  name: 'Chat',

  props: {
  	message: String
  },

  mounted() {
 	if (!this.message) {
 		this.chat_message = `Hi! Thank you for helping us save the wild, one life at a time! If you have discovered an injured animal and already know what kind it is,
 							you may use the search field below to quickly find information about how to care for the animal and the closest licensed rehabilitator near you. 
 							Otherwise, click the Get Started button below and I'll help you narrow down the animal and provide you with the resources you need to get help.`
 		this.button_text = 'Get Started'
 		this.show_button = true;
 	}
  },

  data: function() {
    return {
    	chat_message: String,
    	show_button: false,
    	button_text: String
    }
  },

  methods: {}

}
</script>

<style lang="scss">
.chatbot-container {
	display: flex;
	position: relative;
	width: 100%;
	margin-bottom: 25px;
	padding-right: 10px;
	.chatbot-icon-container {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #FFFFFF;
		height: 100px;
		aspect-ratio: 1 / 1;
		border-radius: 50%;
		padding: 15px;
		box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
		.chatbot-icon {
			position: relative;
		}
	}
	.chat-message-container {
		display: flex;
		flex-direction: column;
		position: relative;
		width: 100%;
		border-radius: 10px;
		margin-left: 50px;
		background-color: #E9F0F8;
		border-top: 5px solid #469CDD;
	}
	.chat-message-container:before {
	  content: "";
	  position: absolute;
	  top: 25px;
	  left: -40px;
	  height: 0px;
	  width: 0px;
	  border-top: 20px solid transparent;
	  border-right: 40px solid #E9F0F8;
	  border-bottom: 20px solid transparent;
	} 
	.chat-text {
		width: 100%;
		padding: 10px;
		text-align: left;
		font-size: 18px;
		font-family: 'Baloo 2';
		letter-spacing: 1px;
		line-height: 1.5;
	}
	.chat-button {
		font-size: 18px;
		font-family: 'Baloo 2';
		font-weight: bold;
		text-align: center;
		color: #FFFFFF;
		background-color: #589040;
		width: 50%;
		padding: 5px;
		margin: auto;
		margin-bottom: 10px;
		cursor: pointer;
		border-radius: 10px;
	}
}
</style>