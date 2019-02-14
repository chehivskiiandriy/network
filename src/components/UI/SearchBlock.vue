<script>
  export default {
    name: "SearchBlock",
    render(h) {
      return h(
        'div',
        this.$slots.default
      )
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;

    &-icon {
      width: 10%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 32px;

      .icon-search {
        .text-grad();
        /*color: #5ac5c6;*/
      }
    }

    &-input-block {
      width: 87%;
    }

    &-input-field {
      border-radius: 5px;
      border: 2px solid #5ac5c6;
      color: #2c3e50;
      margin: 0;
      padding: 8px 10px;
      font-size: 16px;
      width: 100%;
      box-sizing: border-box;

      &::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
        //color: @present_grey;
       // opacity: 1; /* Firefox */
      }

      &:-ms-input-placeholder { /* Internet Explorer 10-11 */
        //color: @present_grey;
      }

      &::-ms-input-placeholder { /* Microsoft Edge */
        //color: @present_grey;
      }
    }

    &-selected {
      width: 40%;
      padding-left: 3%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: @dark_grey;
    }

    .icon-gradient {
      .text-grad();
      font-size: 6.5vw;
    }
  }
</style>
