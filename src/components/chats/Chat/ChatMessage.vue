<template>
  <div class="chat-message">
    <div
      v-if="showDate"
      class="message-date">
      <div class="line"></div>
      <div class="date">{{messageDate}}</div>
      <div class="line"></div>
      </div>
    <in-chat-message-left
      v-if="message.sender_id !== authUser.id"
      :message="message" />
    <in-chat-message-right
      v-else
      :message="message" />
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import moment from 'moment';

  import {moduleName as userModule, AUTH_USER} from "Store/modules/authUser/user";

  import ChatMessageLeft from 'ComponentsVue/chats/Chat/ChatMessageLeft';
  import ChatMessageRight from 'ComponentsVue/chats/Chat/ChatMessageRight';

  export default {
    name: "ChatMessage",
    components: {
      inChatMessageLeft: ChatMessageLeft,
      inChatMessageRight: ChatMessageRight
    },
    props: {
      message: {
        type: Object,
        required: true
      },
      nextMessage: [Object, undefined]
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER
      }),
      showDate() {
        return !this.nextMessage || this.nextMessage.created_at.split(' ')[0] !== this.message.created_at.split(' ')[0]
      },
      messageDate() {
        return moment(this.message.created_at_timestamp * 1000).format('LL')
      }
    }
  }
</script>

<style lang="less" >
  @import '~LessStyle/variables.less';

  .chat-message {
    word-wrap: break-word;
    width: 100vw;
    box-sizing: border-box;
  }

  .message-date {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 10vw;
    color: #fff;

    .line {
      width: 17vw;
      height: 2px;
      background: #fff;
    }
  }
</style>
