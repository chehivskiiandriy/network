<script>
  export default {
    name: "SettingsMenu",
    render(h) {
      return h(
        'div',
        this.$slots.default
      )
    }
  }
</script>

<style lang="less">
  .settings-menu-block {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 10000;
    overflow-y: auto;
    display: flex;
    flex-direction: column-reverse;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-user-select: none;
    user-select: none;

    &-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }

    &-container {
      z-index: 10001;
    }

    &-section {
      margin: 10px;
      border-radius: 10px;
      z-index: 10001;
    }

    &-item {
      background-color: #fff;
      font-size: 4.5vw;
      padding: 13px 0;
      border-bottom: 2px solid #ccc;
      color: #0A84FF;

      &-danger {
        color: #ff0000;
      }

      &:first-child {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }

      &:last-child {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        border-bottom: none;
      }
    }

    &-bottom {
      margin-bottom: 15px;
    }
  }
</style>
