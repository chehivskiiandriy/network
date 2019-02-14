<template>
  <in-header-block class="header chat-header">
    <div
      @click="goBack"
      class="header-back">
      <i class="icon-left-f"></i>
    </div>
    <div
      v-if="user"
      class="chat-header-content">
      <div class="chat-header-content-status">
        <div :class="[user.is_online ? 'online-block' : 'offline-block']"></div>
      </div>
      <div
        @click="goToUser(user.nickname)"
        class="chat-header-content-info">
        <div class="chat-user">
          <in-nickname class="chat-user-nickname" :status="user.status">{{user.nickname}}</in-nickname>
          <span class="chat-user-name">{{user.name}} {{user.lastname}}</span>
        </div>
        <div class="chat-preview">
          <img
            class="chat-preview-avatar"
            :src="user.avatar_image.url_medium">
          <img
            v-if="user.active_gift"
            class="chat-preview-avatar-present"
            :src="user.active_gift.image">
        </div>
      </div>
    </div>
    <!--<div-->
      <!--v-if="user"-->
      <!--class="chat-header-languages">-->
      <!--<span>{{authUser.chat_main_lang}}</span>-->
      <!--<div class="horizontal-line"></div>-->
      <!--<span>{{user.chat_main_lang}}</span>-->
    <!--</div>-->
  </in-header-block>
</template>

<script>
  import {mapGetters} from 'vuex';

  import {moduleName as userModule, AUTH_USER} from "Store/modules/authUser/user";

  export default {
    name: "NewChatHeader",
    data() {
      return {
        user: null
      }
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER
      })
    },
    mounted() {
      this.getUser();
    },
    methods: {
      async getUser() {
        const data = new FormData();
        data.append('id', this.$route.params.user_id);

        try {
          let res = await this.$api.users.getUser(data);
          this.user = res.data;
        } catch (e) {
          console.log(e);
        }
      },
      goBack() {
        this.$router.go(-1);
      },
      goToUser(nickname) {
        this.$router.push(`/u/${nickname}`);
      }
    }
  }
</script>

<style lang="less" scoped>
  .chat-header {
    padding: 0;

    .header-back {
      font-size: 20px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &-content {
      width: calc(~'100% - 40px');
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

    &-languages {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      font-size: 3.8vw;

      .horizontal-line {
        width: 30px;
        height: 1px;
        background: #fff;
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
