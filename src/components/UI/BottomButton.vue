<script>
  export default {
    name: "BottomButton",
    render() {
      return this.$slots.default[0]
    }
  }
</script>

<style lang="less" scoped>
  .bottom-button {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 25px;
    color: #0cb4be;
    border-top: 1px solid #9e9e9e;
    background: #fff;
    text-align: center;
    font-size: 18px;
    /*color: #9e9e9e;*/
  }
</style>
