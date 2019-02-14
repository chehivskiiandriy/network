<template>
  <div class="chat-message-right">
    <div
      class="chat-message-bg"
      :class="{'chat-message-bg-active': isSelected}"
      @click="addMessage"></div>

    <in-chat-message-item-time
      :timestamp="message.created_at_timestamp"
      side="right" />

    <div
      class="chat-message-right-content"
      :class="{'without-shadow': message.content_type === 'TEXT' && message.attachments.stickers}">
      <in-chat-message-forward
        v-if="message.content_type === 'FORWARD'"
        :message="message"
        side="right" />
      <in-chat-message-attachments
        v-else="message.attachments"
        :message="message"
        side="right" />
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {
    moduleName as chatMessagesModule,
    SELECT_MESSAGE,
    SELECTED_MESSAGES
  } from "Store/modules/chats/chatMessages";

  import ChatMessageItemTime from 'ComponentsVue/chats/Chat/ChatMessageItemTime';
  import ChatMessageAttachments from 'ComponentsVue/chats/Chat/ChatMessageAttachments';
  import ChatMessageForward from 'ComponentsVue/chats/Chat/ChatMessageForward';

  export default {
    name: "ChatMessageRight",
    components: {
      inChatMessageItemTime: ChatMessageItemTime,
      inChatMessageAttachments: ChatMessageAttachments,
      inChatMessageForward: ChatMessageForward
    },
    props: {
      message: {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapGetters({
        selectedMessages: chatMessagesModule + SELECTED_MESSAGES
      }),
      isSelected() {
        return this.selectedMessages.some(item => item.id === this.message.id)
      }
    },
    methods: {
      ...mapMutations({
        selectMessage: chatMessagesModule + SELECT_MESSAGE
      }),
      addMessage() {
        this.selectMessage({
          message: this.message,
          state: this.isSelected
        });
      }
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  .chat-message-right {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    padding: 10px 10px 10px 0;
    position: relative;
    z-index: 0;

    .chat-message-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 0;

      &-active {
        background-color: rgba(151, 218, 228, 0.5);
      }
    }

    &-content {
      position: relative;
      text-align: left;
      min-width: 15vw;
      border-radius: 5px;
      overflow: hidden;
      box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.1);
      max-width: 85vw;
      background: #EAFDFE;
      z-index: 5;
    }

    .without-shadow {
      box-shadow: none;
      background: transparent;
    }
    /*i {*/
      /*background: #C4E9E9;*/
      /*background: #D6D6D6;*/
      /*background: #DADADA;*/
      /*background: #FDFDFE;*/
      /*background: #5071AC;*/
      /*background: #78A1FE;*/
      /*background: #EAFDFE;*/
      /*background: #8ABCC1;*/
    /*}*/
  }
</style>
