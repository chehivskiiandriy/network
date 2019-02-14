<template>

  <div class="item-block">
    <router-link :to="'/u/'+ user.nickname">
      <div class="item-avatar ">
        <img :src="user.avatar_image.url_medium">
      </div>
    </router-link>
    <div class="item-info">
      <router-link :to="'/u/'+ user.nickname">
        <in-nickname tag="p" class="user-nickname" :status="user.status">{{user.nickname}}</in-nickname>
      </router-link>
      <p class="user-name">
        <span>{{ user.name }}</span>
        <span>{{ user.lastname }}</span>
      </p>
    </div>
    <div
      v-if="buttonFollow"
      class="feed-button">
      <span
        v-if="subStatus"
        class="user-unsubscribe"
        @click="changeSubscribe"
      >
        {{ $lang.variables.subscribed }}
      </span>
      <span
        v-else
        class="user-subscribe"
        @click="changeSubscribe"
      >
        {{ $lang.variables.subscribe }}
      </span>
    </div>
    <div
      v-if="letterChat"
      class="feed-button letter-profile-user">
      <i
        @click="goToChat()"
        class="icon-letter"></i>
    </div>
  </div>

</template>

<script>
  import {mapActions, mapGetters} from 'vuex';

  import {CHANGE_SUBSCRIBE_USER, moduleName as usersModule} from "Store/modules/users/users";
  import {CHECK_CHAT, moduleName as chatsModule} from "Store/modules/chats/chats";
  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";

  export default {
    props: ['user', 'is_subscribed', 'button', 'letter'],
    data() {
      return {
        subStatus: this.user.is_subscribed,
        buttonFollow: false,
        letterChat: false,
      }
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER
      }),
      /*
      toggleSubscribe: function () {
        return this.subStatus
          ? this.$lang.variables.subscribed
          : this.$lang.variables.subscribe
      },
      */
      classSubscribe: function () {
        return this.subStatus
          ? 'user-unsubscribe'
          : 'user-subscribe'
      }
    },
    mounted() {
      //console.log('iiii',this.authUser);
      if (this.button === 'disabled') {
        this.buttonFollow = false;
      }
      else {
        this.buttonFollow = true;
      }
      if (this.letter === 'disabled') {
        this.letterChat = false;
      }
      else {
        this.letterChat = true;
      }
      this.subStatus = this.is_subscribed;
    },
    methods: {
      ...mapActions({
        changeSubscribeUser: usersModule + CHANGE_SUBSCRIBE_USER,
        checkChat: chatsModule + CHECK_CHAT
      }),
      changeSubscribe() {

        if (this.authUser.status !== 'guest') {
          const payload = {
            nickname: this.user.nickname,
            delete: this.subStatus ? '1' : '0',
            onSuccess: this.onSubscribe,
            onRequest: this.onRequestSubscribe
          };
          this.changeSubscribeUser(payload);


        }
        else {
          this.$notify({
            group: 'guest-template',
            duration: 3000,
            speed: 300,
          });
        }
      },
      onRequestSubscribe() {
        this.$notify({
          group: 'send-subscriber-request',
          duration: 3000,
          speed: 300,
        });
      },
      onSubscribe(result) {
        if (result.status === 'request') {
          this.$notify({
            group: 'send-subscriber-request',
            duration: 3000,
            speed: 300
          });
        }
        else {
          this.subStatus = !this.subStatus;
        }
      },
      goToChat() {
        if (this.authUser.id !== this.user.id) {
          const payload = {
            id: this.user.id,
            onSuccess: this.onSuccessGoToChat,
            onFail: this.goToNewChat
          };
          this.checkChat(payload);
        } else {
          this.$notify({
            group: 'write-to-you',
            duration: 3000,
            speed: 300,
          });
        }
      },
      onSuccessGoToChat(id) {
        this.$router.push('/messages/' + id);
      },
      goToNewChat(id) {
        this.$router.push('/new-chat/' + id);
      },
    }
  }
</script>
<style lang="less">
  @import '~LessStyle/feed.less';
  @import '~LessStyle/variables.less';

  .feed-button {
    position: absolute;
    right: 10px;
    top: 40%;
  }

  .item {
    &-block {
      display: flex;
    }
  }

  .item-avatar {
    margin: 0 10px;

  }

  .user-nickname {
    font-weight: 600;
  }

  .item-avatar img {
    width: 60px;
    height: auto;
    border-radius: 5px;
    display: block;
  }

  .user-name {
    font-weight: 600;
    color: #585151;
  }

  .item-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    p {
      margin: 0;
      text-align: left;
    }
  }

  .letter-profile-user {
    font-size: 20px;
    .text-grad();
  }
</style>
