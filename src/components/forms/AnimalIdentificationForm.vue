<template>
  <ng-template v-if="chat_object.type === 'image_selection'">
    <div class="image-options-container">
      <div v-for="choice in chat_object.options" class="image-option">
        <img :src="require(`../../../src/assets/images/chat_images/${choice.option}`)"/>
      </div>
    </div>
  </ng-template>  

</template>

<script>
export default {
  name: 'AnimalIdentificationForm',

  props: {
    chat_object: Object
  },

  data: function() {
    return {

    }
  },
  methods: {

  }
}


</script>

<style lang="scss">
.image-options-container {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 5px;
  padding: 10px;
  .image-option {
    cursor: pointer;
    padding: 4px;
    &:hover {
      background-color: #469cdd;
    }
  }
}
</style>