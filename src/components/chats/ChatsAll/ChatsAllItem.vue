<template>
  <in-user-card>
    <div
      class="user-card chats-all-item"
      :class="{'user-card-unread-message': chat.unread_message_count > 0}">
      <div class="user-card-avatar">
        <template v-if="chat.type === 1">
          <img
            class="user-card-avatar-preview"
            :src="chat.users[0].avatar_image.url_medium">
          <img
            v-if="chat.users[0].active_gift"
            class="user-card-avatar-present"
            :src="chat.users[0].active_gift.image">
          <div
            v-if="chat.users[0].is_online"
            class="online-block"></div>
        </template>
        <div
          v-else-if="chat.type === 2"
          class="group-chat-avatar">
          <img
            v-for="user in chat.users.slice(0, 4)"
            :key="user.id"
            class="user-card-avatar-preview-small"
            :src="user.avatar_image.url_medium">
          <img
            v-if="chat.users.slice(0, 4).length < 4"
            class="user-card-avatar-preview-small"
            :src="authUser.avatar_image.url_medium">
        </div>
        <img
          v-else-if="chat.type === 3"
          class="user-card-avatar-preview"
          :src="chat.group.logo.url_medium">
      </div>
      <div class="user-card-info">
        <div class="user-card-info-container">
          <in-nickname v-if="chat.type === 1" tag="p" class="user-card-nickname" :status="chat.users[0].status">{{chat.users[0].nickname}}</in-nickname>
          <p v-else class="user-card-nickname">{{chat.name}}</p>
          <div class="last-message">
            {{lastMessage}}
          </div>
          <p class="user-card-time">
            <in-time :key="messageTime" :time="messageTime"></in-time>
          </p>
        </div>
      </div>
      <div class="user-card-actions">
        <div
          @click="goToChat"
          class="card-bg"></div>
        <i
          v-if="!isForward"
          class="icon-actions icon-vvv"
          @click="showSettings(chat)"></i>
        <div
          v-if="chat.unread_message_count > 0"
          class="unread-message-count">
          {{chat.unread_message_count}}
        </div>
      </div>
    </div>
  </in-user-card>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user"
  import {FETCH_CHAT, moduleName as chatsModule} from "Store/modules/chats/chats"

  export default {
    name: "ChatsAllItem",
    props: {
      chat: {
        type: Object,
        required: true
      },
      showSettings: Function,
      isForward: Boolean
    },
    data() {
      return {
        timer: null,
        click: false
      }
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER
      }),
      lastMessage() {
        let lastMessage = this.chat.last_message;

        if (!lastMessage) return '';

        if (lastMessage.message) {
          return lastMessage.message
        } else if (lastMessage.attachments) {
          if (lastMessage.attachments.stickers) {
            return lastMessage.attachments.stickers[0].smile
          } else if (lastMessage.attachments.images) {
            return "\uD83D\uDDBC"
          } else if (lastMessage.attachments.videos) {
            return "\uD83C\uDFA5"
          } else if (lastMessage.attachments.posts) {
            return "\uD83C\uDFB4"
          } else if (lastMessage.attachments.messages) {
            return "↪️"
          } else {
            return ''
          }
        }
      },
      messageTime() {
        if (this.chat.last_message) {
          return this.chat.last_message.created_at_timestamp
        } else {
          return Math.ceil(Date.parse(this.chat.created_at) / 1000)
        }
      }
    },
    methods: {
      ...mapActions({
        fetchChat: chatsModule + FETCH_CHAT
      }),
      goToChat() {
        this.fetchChat({
          chat: this.chat,
          id: this.chat.id
        });

        if (this.isForward) {
          this.$emit('forward', this.chat.id);
        } else {
          this.$router.push(`/messages/${this.chat.id}`);
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .chats-all-item {
    -webkit-user-select: none;
    user-select: none;
    position: relative;

    &.user-card-unread-message {
      background: #edf9fb;
    }

    .online-block {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 6px;
      height: 6px;
      background: #00d000;
      border-radius: 3px;
      border: 2px solid #fff;
    }

    .icon-actions {
      z-index: 3;
    }

    .card-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }

    .group-chat-avatar {
      height: 100%;
      width: 100%;
      border-radius: 5px;
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;
      background: #f5f5f5;
      position: relative;

      &::after {
        content: '';
        display: block;
        height: 1px;
        background: #fff;
        width: 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }

      &::before {
        content: '';
        display: block;
        width: 1px;
        background: #fff;
        height: 100%;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }

    .user-card-avatar-preview-small {
      width: 50%;
      height: 50%;
    }

    .last-message {
      font-size: 3.5vw;
      margin: 0;
      width: 100%;
      text-align: left;
      .truncate();
    }

    .unread-message-count {
      color: #be0c0c;
      font-weight: bold;
      font-size: 4vw;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 22px;
      min-width: 22px;
      padding: 5px;
      border-radius: 5px;
      margin-right: 15px;
    }
  }


</style>
