<script>
  export default {
    name: "HeaderBlock",
    render(h) {
      return h(
        'header',
        this.$slots.default
      )
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .header {
    height: 40px;
    box-sizing: border-box;
    padding: 5px 10px;
    color: #fff;

    &-gradient {
      .bgc-grad();
      color: #fff;
    }

    &-back,
    &-count-menu {
      display: flex;
      align-items: center;
    }

    &-back {
      font-size: 20px;
    }

    &-count-menu {
      font-size: 24px;
    }

    &-content {
      font-size: 18px;
      width: 80%;
      .truncate();
    }

    .empty-block {
      width: 24px;
    }
  }
</style>
