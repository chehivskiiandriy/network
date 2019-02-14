<script>
  export default {
    name: "UserCard",
    render() {
      return this.$slots.default[0]
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .user-card {
    width: calc(~'100vw - 10px');
    height: calc(~'17vw + 10px');
    margin-bottom: 5px;
    display: flex;
    box-sizing: border-box;
    padding: 5px;
    border-radius: 10px;
    box-shadow: 0 0 2px 1px #ccc;

    &-small {
      width: calc(~'25vw - 2.5px');
      height: calc(~'25vw - 2.5px');
      margin: 0 2px 2px 0;

      &:nth-child(4n) {
        margin-right: 0;
      }
    }

    &-settings {
      width: calc(~'100vw - 20px');
      background-color: #fff;
      box-shadow: none;
    }

    &-avatar-small {
      width: 100%;

      img {
        width: 100%;
        border-radius: 5px;
      }
    }

    &-avatar {
      width: 17vw;
      height: 17vw;
      position: relative;

      &-preview {
        height: 100%;
        border-radius: 5px;
      }

      &-present {
        position: absolute;
        opacity: .7;
        width: 30%;
        height: 30%;
        bottom: 3px;
        right: 3px;
        background-color: #fff;
        border-radius: 3px;
        padding: 1px;
        box-sizing: border-box;
      }
    }

    &-info {
      width: calc(~'55vw - 10px');

      &-small {
        width: calc(~'38vw - 10px');
      }

      &-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        padding-left: 10px;
        height: 100%;
      }

      .request-time {
        font-size: 12px;
        color: #d3d3d3;
        text-align: left;

        .comment-createdAt {
          font-size: 12px;
        }
      }
    }

    &-nickname {
      color: #2c3e50;
      font-weight: 600;
      font-size: 3.8vw;
      margin: 0;
      width: 100%;
      text-align: left;
      .truncate();
    }

    &-name {
      color: @middle_grey;
      font-weight: 600;
      font-size: 3.5vw;
      margin: 0;
      width: 100%;
      text-align: left;
      .truncate();
    }

    &-time {
      margin: 0;
      width: 100%;
      text-align: left;
      .truncate();

      .comment-createdAt {
        font-size: 3vw;
        color: #808080;
      }
    }

    &-actions {
      width: 28vw;
      display: flex;
      align-items: center;
      flex-direction: row-reverse;

      .icon-actions {
        padding: 5vw 10px;
        font-size: 7vw;
        .text-grad();
      }
    }
  }
</style>
