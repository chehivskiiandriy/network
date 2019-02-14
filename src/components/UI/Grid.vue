<template>
  <div class="grid">
    <div class="grid-line vertical left"></div>
    <div class="grid-line vertical right"></div>
    <div class="grid-line horizontal top"></div>
    <div class="grid-line horizontal bottom"></div>
  </div>
</template>

<script>
  export default {
    name: "Grid"
  }
</script>

<style lang="less" scoped>
  .grid {
    height: 100%;
    width: 100%;
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;

    &-line {
      background-color: rgba(255, 255, 255, .4);
      position: absolute;
    }

    .vertical {
      top: 0;
      height: 100%;
      width: 1px;
    }

    .horizontal {
      left: 0;
      width: 100%;
      height: 1px;
    }

    .left {
      left: 33%;
    }

    .right {
      right: 33%;
    }

    .top {
      top: 33%;
    }

    .bottom {
      bottom: 33%;
    }
  }
</style>
