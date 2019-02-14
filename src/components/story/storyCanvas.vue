<template>
      <!--<canvas class="canvas-story" :id="'canvas'+this.index" width="30px" height="30px"></canvas>!-->
    <div class="svg-block">

      <div class="story-image-carousel-background"  v-bind:style="{height : clientWidth*0.09+'px', backgroundImage:'url('+storyAttachment+')' }" ></div>
      <!--<svg class="cube-tifany" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 100"  >
        <path   fill-opacity="0" stroke-width="6" stroke="#06f1ed" d="M 0,2 L 98,2 L 98,98 L 2,99 L 2,2"/>
      </svg>-->
    </div>

</template>
<script>
  export default {
    props:['index','storyLength','storyAttachment'],
    data() {
      return {
        barSvg:'',
        indexSVG:0,
        canvasTimer:'',
        clientWidth:'',
        stopAnimationValue:'',
        durationTime:10000,
      }
    },
    mounted() {

      this.clientWidth=localStorage.getItem('clientWidth');



      //this.timeOut(this.index);
    },
    methods: {


     }
  }
</script>
<style>
    .hide-white{
      z-index: 1111;
    }
</style>
