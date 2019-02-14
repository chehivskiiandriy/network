<template>
  <div
    class="chat-message-item-time"
    :class="side"
    v-text="time"></div>
</template>

<script>
  import moment from 'moment';

  export default {
    name: "ChatMessageItemTime",
    props: {
      timestamp: {
        type: Number,
        required: true
      },
      side: {
        type: String,
        required: true
      }
    },
    computed: {
      time() {
        return moment(this.timestamp * 1000).format('HH:mm')
      }
    }
  }
</script>

<style lang="less" scoped>
  .chat-message-item-time {
    width: calc(~'15vw - 10px');
    text-align: right;
    padding: 0 5px 2px 0;
    box-sizing: border-box;
    font-size: 3.2vw;
    z-index: 4;
    position: relative;
    color: #fff;

    &.left {
      padding: 0 5px 2px 0;
      text-align: right;
    }

    &.right {
      text-align: left;
      padding: 0 0 2px 5px;
    }
  }
</style>
