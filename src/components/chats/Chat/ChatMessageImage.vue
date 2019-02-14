<template>
  <div class="chat-message-image">
    <img
      ref="image"
      @click="openInModal"
      @load="onLoadImage"
      class="chat-message-image-img"
      :src="message.attachments.images[0].url_medium">
    <div class="chat-message-image-text">
      <in-chat-message-text
        v-if="message.message"
        :message="message"
        :side="side"
        :forward="forward"
        :class="[side === 'right' ? 'chat-message-text-right' : 'chat-message-text-left']" />
    </div>
    <in-chat-message-seen-status
      v-if="!forward && side === 'right' && !message.message"
      :message="message" />
  </div>
</template>

<script>
  import {mapMutations} from 'vuex';

  import {
    moduleName as chatMessagesModule,
    CHANGE_SELECTED_IMAGE
  } from "Store/modules/chats/chatMessages";

  import ChatMessageText from 'ComponentsVue/chats/Chat/ChatMessageText';
  import ChatMessageSeenStatus from 'ComponentsVue/chats/Chat/ChatMessageSeenStatus';

  export default {
    name: "ChatMessageImage",
    components: {
      inChatMessageText: ChatMessageText,
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
      },
      showSeen: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      ...mapMutations({
        changeSelectedImage: chatMessagesModule + CHANGE_SELECTED_IMAGE
      }),
      onLoadImage(e) {
        const {naturalWidth, naturalHeight} = e.target;
        if(this.$refs.image) {
          this.$refs.image.style.height = Math.floor(61 * naturalHeight / naturalWidth) + 'vw';
        }
        this.$root.$emit('changeMessagesScroll');
      },
      openInModal() {
        this.changeSelectedImage({...this.message.attachments.images[0]});
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .chat-message-image {
    width: 61vw;
    padding: 5px;

    &-img {
      width: 61vw;
      vertical-align: middle;
    }

    &-text {
      border-radius: 0 0 5px 5px;
      overflow: hidden;
      /*box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.1);*/
    }
  }
</style>
