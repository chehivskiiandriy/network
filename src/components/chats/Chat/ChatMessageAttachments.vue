<template>
  <div class="chat-message-attachments">
    <in-chat-message-stiker
      v-if="message.content_type === 'TEXT' && message.attachments.stickers"
      :message="message"
      :side="side"
      :forward="forward" />
    <in-chat-message-text
      v-else-if="message.content_type === 'TEXT'"
      :message="message"
      :side="side"
      :forward="forward" />
    <in-chat-message-image
      v-else-if="message.content_type === 'IMAGE'"
      :message="message"
      :side="side"
      :forward="forward"
      :showSeen="!forward && side === 'right'"/>
    <in-chat-message-video
      v-else-if="message.content_type === 'VIDEO'"
      :message="message"
      :side="side"
      :forward="forward" />
    <in-chat-message-post
      v-else-if="message.content_type === 'POST'"
      :message="message"
      :side="side"
      :forward="forward" />
  </div>
</template>

<script>
  import ChatMessageStiker from 'ComponentsVue/chats/Chat/ChatMessageSticker';
  import ChatMessagePost from 'ComponentsVue/chats/Chat/ChatMessagePost';
  import ChatMessageImage from 'ComponentsVue/chats/Chat/ChatMessageImage';
  import ChatMessageVideo from 'ComponentsVue/chats/Chat/ChatMessageVideo';
  import ChatMessageText from 'ComponentsVue/chats/Chat/ChatMessageText';

  export default {
    name: "ChatMessageAttachments",
    components: {
      inChatMessageStiker: ChatMessageStiker,
      inChatMessagePost: ChatMessagePost,
      inChatMessageImage: ChatMessageImage,
      inChatMessageVideo: ChatMessageVideo,
      inChatMessageText: ChatMessageText
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

  .chat-message-attachments {

  }
</style>
