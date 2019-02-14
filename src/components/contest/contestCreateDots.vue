<template>
  <div class="border-circle">
    <div :class="dotBackgroung"></div>
  </div>
</template>
<script>
  export default  {
    name:'contestCreateDots',
    props:['vote','string'],
    computed: {
      dotBackgroung() {

       return (this.vote === this.string) ? 'blue-dot' : 'white-dot';
      },
    }
  }
</script>
<style lang="less">
  .border-circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid #5ac5c6;
    padding: 5px;
    margin-right: 10px;
    .blue-dot {
      background-color: #5ac5c6;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    .white-dot {
      background-color: #fff;
    }
  }
</style>
