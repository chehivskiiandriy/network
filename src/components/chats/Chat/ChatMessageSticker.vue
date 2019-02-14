<template>
  <div class="chat-message-sticker">
    <div
      class="chat-message-sticker-img"
      :style="{backgroundImage: `url('${message.attachments.stickers[0].url}')`}">
    </div>
    <in-chat-message-seen-status
      v-if="!forward && side === 'right'"
      :message="message" />
  </div>
</template>

<script>
  import ChatMessageSeenStatus from 'ComponentsVue/chats/Chat/ChatMessageSeenStatus';

  export default {
    name: "ChatMessageSticker",
    components: {
      inChatMessageSeenStatus: ChatMessageSeenStatus
    },
    props: {
      message: {
        type: Object,
        required: true
      },
      side: {
        type: String,
        required: true
      },
      forward: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .chat-message-sticker {
    width: 50vw;
    height: 40vw;

    &-img {
      width: 100%;
      height: 100%;
      background-size: cover;
    }
  }
</style>
