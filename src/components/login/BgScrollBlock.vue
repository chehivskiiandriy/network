<template>
  <div
    class="bg-scroll-img"
    :style="{top: getTop + 'px', transition: getTransition + 's'}">
    <img
      class="bg-img"
      ref="bgImage"
      src="https://media.inrating.top/storage/img/backgrounds/new_bg_mob.jpg"
      alt="">
  </div>
</template>

<script>
  export default {
    name: 'BgScrollBlock',
    props: {
      scroll: {
        default: true,
        type: Boolean
      }
    },
    data(){
      return {
        topPosition: 0,
        topTransition: '1.5',
        timer: ''
      }
    },
    watch:{
      scroll: function(oldVal, newVal){
        if(oldVal !== newVal){
          this.stopInterval()
        }
      },
    },
    mounted(){
      if(this.$route.path !== '/registration' && this.$route.path !== '/reset-password' && this.scroll === true){
        this.scrollBg();
      }
    },
    computed: {
      getTop(){
        return this.topPosition;
      },
      getTransition(){
        return this.topTransition;
      }
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
    methods: {
      scrollBg(){
        setTimeout(() =>{
          this.topPosition = -70;
        }, 100);

        this.timer = setInterval(() =>{
          if(this.topPosition > -this.$refs.bgImage.offsetHeight + window.innerHeight + 100){
            this.topPosition = this.topPosition - 180;
            this.topTransition = '1.5';
          }else{
            this.topPosition = 0;
            this.topTransition = '0.75'
          }
        }, 1500);

        return this.timer;
      },
      stopInterval(){
        this.topPosition = 0;
        clearInterval(this.timer);
      }
    },
  }
</script>

<style lang="less">
  .bg-scroll-img {
    width: 100vw;
    position: fixed;
  }

  .bg-img {
    width: 100%;
  }
</style>
