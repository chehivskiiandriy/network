<template>
  <div
    v-if="loading"
    class="spinner"
    id="SpinnerOnloadImg">
    <img src="https://media.inrating.top/images/Spinner.svg"/>
  </div>
</template>

<script>
  export default {
    name: "Spinner",
    props: {
      loading: {
        type: Boolean,
        default: false
      },
    }
  }
</script>

<style lang="less" scoped>
  .spinner {
    display: block;
    width: 35%;
    margin: auto;

    &-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
