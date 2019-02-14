<template>
  <div class="chat-message-text">
    <div
      class="chat-message-text-message"
      :class="{'chat-message-text-message-with-seen-status': !forward && side === 'right'}">
      <in-text-with-mentions
        class="text-block"
        :text="message.message"></in-text-with-mentions>
      <in-chat-message-seen-status
        v-if="!forward && side === 'right'"
        :message="message"
        :isMessage="true" />
    </div>
    <div
      v-if="message.translated_message"
      class="chat-message-text-translated">
      <in-text-with-mentions :text="message.translated_message"></in-text-with-mentions>
    </div>
  </div>
</template>

<script>
  import ChatMessageSeenStatus from 'ComponentsVue/chats/Chat/ChatMessageSeenStatus';

  export default {
    name: "ChatMessageText",
    components: {
      inChatMessageSeenStatus: ChatMessageSeenStatus
    },
    props: {
      message: {
        type: Object,
        required: true
      },
      forward: {
        type: Boolean,
        default: false
      },
      side: {
        type: String,
        required: true
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .chat-message-text {
    font-size: 3.7vw;

    &-message {
      padding: 10px;

      &-with-seen-status {
        display: flex;
        box-sizing: border-box;
        flex-wrap: wrap;
        justify-content: flex-end;

        &::after {
          content: "";
          clear: both;
          display: table;
        }

        .text-block {
          width: 100%;
        }
      }

    }

    &-translated {
      padding: 10px;
      background: @grad;
      color: @white;
    }

    &-left {
      .chat-message-text-message {
        background: @white;
      }
    }

    &-right {
      .chat-message-text-message {
        background: #EAFDFE;
      }
    }
  }
</style>
