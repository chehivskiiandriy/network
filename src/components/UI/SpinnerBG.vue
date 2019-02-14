<template>
  <div
    v-if="loading"
    class="spinner-preload-bg"
    :style="{background: bgColor}">
    <img id="SpinnerPreload"
         class="spinner-svg"
         src="https://media.inrating.top/images/Spinner.svg"/>
  </div>
</template>
<script>
  export default {
    name: 'SpinnerBG',
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      bgColor: {
        type: String,
        default: 'rgba(0, 0, 0, 0.2)',
      }
    },
  }
</script>
<style lang="less">
  .spinner-preload-bg {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1555;
    background: rgba(0, 0, 0, 0.2);
    /*background: #f4f4f4;*/

    .spinner-svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 35%;
    }
  }
</style>
