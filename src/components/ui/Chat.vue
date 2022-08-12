<template>
	<div class="chatbot-container">
		<div class="chatbot-icon-container">
			<img class="chatbot-icon" src="../../../src/assets/images/chat_images/chatbot-icon.svg"/>
		</div>
		<div class="chat-message-container">
			<div class="chat-text">{{ chat_object.message }}</div>
			<template v-if="chat_object.stage === 'initial'">
				<div class="chat-button" @click="$emit('nextStage')">Get Started</div>
			</template>
			<template v-else>
				<animal-identification-form :chat_object="chat_object"></animal-identification-form>
			</template>
		</div>
	</div>

</template>

<script>
import AnimalIdentificationForm from '@/components/forms/AnimalIdentificationForm';

export default {
  name: 'Chat',
  components: {
    AnimalIdentificationForm,
  },
  props: {
  	chat_object: Object
  },

  mounted() {

  },

  data: function() {
    return {
    	animal_data: this.animal_data
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