<template>
  <div class="chat-header">
    <div class="chat-header-info">
      <div
        @click="goBack"
        class="header-back">
        <i class="icon-left-f"></i>
      </div>
      <template v-if="chat">
        <div
          v-if="chat.type === 1"
          class="chat-header-content">
          <div class="chat-header-content-status">
            <div :class="[chat.users[0].is_online ? 'online-block' : 'offline-block']"></div>
          </div>
          <div
            @click="goToUser(chat.users[0].nickname)"
            class="chat-header-content-info">
            <div class="chat-user">
              <in-nickname class="chat-user-nickname" :status="chat.users[0].status">{{chat.users[0].nickname}}</in-nickname>
              <span class="chat-user-name">{{chat.users[0].name}} {{chat.users[0].lastname}}</span>
            </div>
            <div class="chat-preview">
              <img
                class="chat-preview-avatar"
                :src="chat.users[0].avatar_image.url_medium">
              <img
                v-if="chat.users[0].active_gift"
                class="chat-preview-avatar-present"
                :src="chat.users[0].active_gift.image">
            </div>
          </div>
        </div>
        <template v-else>
          <div class="header-content">{{chat.name}}</div>
          <div class="empty-block"></div>
        </template>
      </template>
    </div>

    <in-chat-header-actions
      @showModal="showModal" />
  </div>
</template>

<script>
  import ChatHeaderActions from 'ComponentsVue/chats/ChatHeaderActions';

  export default {
    name: "ChatHeader",
    components: {
      inChatHeaderActions: ChatHeaderActions
    },
    props: {
      chat: [Object, undefined]
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      goToUser(nickname) {
        this.$router.push(`/u/${nickname}`);
      },
      showModal(value) {
        this.$emit('showModal', value);
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .chat-header {
    position: fixed;
    height: 40px;
    text-align: center;
    width: 100%;
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: 10000;

    .empty-block {
      height: 40px;
      width: 40px;
    }

    .header-back {
      font-size: 20px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &-info {
      height: 40px;
      width: 100vw;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1111;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      color: #fff;
    }

    &-content {
      width: calc(~'100vw - 40px');
      padding-right: 5px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &-info {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }

      .online-block,
      .offline-block {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        border: 2px solid #fff;
      }

      .online-block {
        background: #00d000;
      }

      .offline-block {
        background: #ccc;
      }
    }

    .chat-preview {
      position: relative;
      width: 34px;
      height: 34px;

      &-avatar {
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }

      &-avatar-present {
        position: absolute;
        opacity: .7;
        width: 32%;
        height: 32%;
        bottom: 2px;
        right: 2px;
        background-color: #fff;
        border-radius: 3px;
        padding: 1px;
        box-sizing: border-box;
      }
    }

    .chat-user {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: space-between;
      padding-right: 10px;

      &-nickname {
        font-size: 3.8vw;
        font-weight: bold;
      }

      &-name {
        font-size: 3vw;
      }
    }
  }
</style>
