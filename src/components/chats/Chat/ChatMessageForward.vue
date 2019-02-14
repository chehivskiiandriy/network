<template>
  <div
    class="chat-message-forward"
    :class="[side === 'right' ? 'right' : 'left', {'translated': translated}]">
    <div class="chat-message-forward-title">
      <div class="chat-message-forward-text">{{$lang.variables.forwardedMessageFrom}}:</div>
      <div
        @click="goToUser(forwardMessage.sender_nickname)"
        class="chat-message-forward-from">{{forwardMessage.sender_nickname}}
      </div>
    </div>
    <div class="chat-message-forward-content">
      <in-chat-message-attachments
        :message="forwardMessage"
        :side="side"
        :forward="true" />
    </div>
    <in-chat-message-seen-status
      v-if="side === 'right'"
      :message="message" />
  </div>
</template>

<script>
  import ChatMessageAttachments from 'ComponentsVue/chats/Chat/ChatMessageAttachments';
  import ChatMessageSeenStatus from 'ComponentsVue/chats/Chat/ChatMessageSeenStatus';

  import ChatMessageStiker from 'ComponentsVue/chats/Chat/ChatMessageSticker';
  import ChatMessagePost from 'ComponentsVue/chats/Chat/ChatMessagePost';
  import ChatMessageImage from 'ComponentsVue/chats/Chat/ChatMessageImage';
  import ChatMessageVideo from 'ComponentsVue/chats/Chat/ChatMessageVideo';
  import ChatMessageText from 'ComponentsVue/chats/Chat/ChatMessageText';

  export default {
    name: "ChatMessageForward",
    components: {
      inChatMessageStiker: ChatMessageStiker,
      inChatMessagePost: ChatMessagePost,
      inChatMessageImage: ChatMessageImage,
      inChatMessageVideo: ChatMessageVideo,
      inChatMessageText: ChatMessageText,
      inChatMessageAttachments: ChatMessageAttachments,
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
      }
    },
    computed: {
      forwardMessage() {
        return this.message.attachments.messages[0]
      },
      translated() {
        return this.message.translated_message || this.message.content_type === 'POST' || this.message.content_type === 'IMAGE'
      }
    },
    methods: {
      goToUser(nickname) {
        this.$router.push(`/u/${nickname}`);
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .chat-message-forward {
    padding: 5px;

    &.left {
      background: #fff;
    }

    &.right {
      background: #EAFDFE;
    }

    &.left.translated {
      background: #fcfcfc;
    }

    &.right.translated {
      background: #f1feff;
    }

    &.translated {
      .chat-message-forward-content {
        box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.1);
      }

      .chat-message-forward-title {
        padding-bottom: 5px;
      }
    }

    &-title {
      font-size: 3.5vw;
    }

    &-from {
      color: @contest-list-text-color;
    }

    &-content {
      border-radius: 5px;
      overflow: hidden;
    }
  }
</style>
