<template>
  <div class="chat-message-left">
    <div
      class="chat-message-bg"
      :class="{'chat-message-bg-active': isSelected}"
      @click="addMessage"></div>

    <div v-if="isShowAvatar" class="chat-message-user-avatar">
      <img
        @click="goToUser"
        class="chat-message-user-avatar-preview"
        :src="message.sender_image">
      <!--<img v-if="user.active_gift" class="chat-message-user-avatar-present" :src="user.active_gift.image">-->
    </div>
    <div
      class="chat-message-left-content"
      :class="{
        'without-shadow': message.content_type === 'TEXT' && message.attachments.stickers,
        'chat-message-left-content-with-avatar': isShowAvatar
       }">
      <in-chat-message-forward
        v-if="message.content_type === 'FORWARD'"
        :message="message"
        side="left" />
      <in-chat-message-attachments
        v-else="message.attachments"
        :message="message"
        side="left" />
    </div>
    <in-chat-message-item-time
      :timestamp="message.created_at_timestamp"
      side="left" />
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {
    moduleName as chatMessagesModule,
    SELECT_MESSAGE,
    SELECTED_MESSAGES
  } from "Store/modules/chats/chatMessages";
  import {CHAT, moduleName as chatsModule} from "Store/modules/chats/chats"

  import ChatMessageItemTime from 'ComponentsVue/chats/Chat/ChatMessageItemTime';
  import ChatMessageAttachments from 'ComponentsVue/chats/Chat/ChatMessageAttachments';
  import ChatMessageForward from 'ComponentsVue/chats/Chat/ChatMessageForward';

  export default {
    name: "ChatMessageLeft",
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
        chatInfo: chatsModule + CHAT,
        selectedMessages: chatMessagesModule + SELECTED_MESSAGES
      }),
      isSelected() {
        return this.selectedMessages.some(item => item.id === this.message.id)
      },
      chat() {
        return this.chatInfo(this.$route.params.chat_id)
      },
      isShowAvatar() {
        return (this.chat && this.chat.type !== 1) || (this.message.is_favourite && this.$route.path === '/messages-favourite')
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
      },
      goToUser() {
        this.$router.push(`/u/${this.message.sender_nickname}`)
      }
    }
  }
</script>

<style lang="less" >
  @import '~LessStyle/variables.less';

  .chat-message-left {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    padding: 10px 0 10px 10px;
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
      box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      overflow: hidden;
      max-width: 85vw;
      background: @white;
      z-index: 5;

      &-with-avatar {
        max-width: 71vw;
      }
    }

    .without-shadow {
      box-shadow: none;
      background: transparent;
    }

    .chat-message-user-avatar {
      width: 12vw;
      height: 12vw;
      position: relative;
      margin-right: 2vw;

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
  }
</style>
