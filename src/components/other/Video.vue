<docs>
  #
</docs>

<template>
  <video
    :class="className"
    @click="actionVideo"
    ref="videoAction"
    :poster="getVideoPoster"
    :src="getVideoBody" >
    v-bind:style="{ height: (width / 2) + 'px'}"
  </video>
</template>

<script>
  export default {
    name: 'video-body',
    props: {
      className: String,
      poster: String,
      src: String,
      width: Number
    },
    computed:{
      getVideoPoster(){
        return this.poster ? this.poster : ''
      },
      getVideoBody(){
        return this.src ? this.src : ''
      }
    },
    methods:{
      actionVideo(){
        let video = this.$refs.videoAction;
        if(video.paused){
          video.play();
        }else{
          video.pause();
        }
      }
    },
  }
</script>

<style lang="less">

</style>
