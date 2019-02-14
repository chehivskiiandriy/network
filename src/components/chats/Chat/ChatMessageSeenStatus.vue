<template>
  <div
    class="chat-message-status"
    :class="{'chat-message-status-message': isMessage, 'chat-message-status-fixed': fixed}">
    <i :class="status"></i>
  </div>
</template>

<script>
  export default {
    name: "ChatMessageSeenStatus",
    props: {
      message: {
        type: Object,
        required: true
      },
      isMessage: {
        type: Boolean,
        default: false
      },
      fixed: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      status() {
        return this.message.was_read ? 'icon-Galochka_3' : 'icon-Galochka_2'
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .chat-message-status {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    float: right;
    width: 30px;

    i {
      font-size: 20px;
      .text-grad();
      //color: @contest-list-text-color;
    }

    &-message {
      position: relative;

      i {
        position: absolute;
        bottom: -2px;
        right: -2px;
      }
    }

    &-fixed {
      position: relative;

      i {
        background: rgba(0, 0, 0, 0.45);
        padding: 1px 5px;
        border-radius: 8px;
        position: absolute;
        bottom: 5px;
        right: 5px;
        color: @white;
      }
    }
  }
</style>
