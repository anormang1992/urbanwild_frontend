<template>
  <div class="flex flex-col w-4/5 justify-center p-4 cursor-pointer"> 
    <div class="flex flex-col text-left">
      <h2 class="text-2xl font-bold font-primary text-white tracking-widest">{{post.title}}</h2>
      <p class="text-sm italic text-white tracking-widest">by {{post.author.full_name}}</p>
      <p class="text-sm text-white tracking-widest pb-2">{{formatPostDate}}</p>
    </div>
    <div class="flex w-full h-full opacity-80 relative hover:opacity-100">
      <img :src="post.image" class="w-full h-full"/>
    </div>
  </div>    
</template>

<script>
import moment from 'moment'

export default {
  name: 'PostBlock',
  props: {
    post: Object,
  },
  computed:{
    formatPostDate() {
      return moment(this.post.created_at).format('MMMM Do YYYY, h:mm:ss a')
    }
  }
}
</script>