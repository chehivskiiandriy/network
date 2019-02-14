<template>
  <div class="chat-item">
    <a @click="resendMessages">
      <div class="chat-item--avatar">
        <div
          class="chat-solo-block"
          v-if="usersArray.length === 1">
          <img
            class="solo-avatar"
            :src="usersArray[0].avatar_image.url_small">
          <img
            v-if="usersArray[0].active_gift"
            class="solochat-avatar-present"
            :src="usersArray[0].active_gift.image">
        </div>
        <span
          v-else-if="usersArray.length === 2"
          class="multi-img-block">
          <img
            v-for="(user,index) in usersArray"
            :class="'two-avatar-'+index"
            :src="user.avatar_image.url_small"
            v-bind:style="{height : clientHeight*0.17+'px' }">
        </span>
        <span class="multi-img-block" v-else>
          <img
            v-for="(user,index) in usersArray"
            :class="'solo-avatar-'+index"
            :src="user.avatar_image.url_small">
        </span>
      </div>
      <div class="chat-item--info">
        <b v-if="usersArray.length==1" v-text="usersArray[0].nickname"></b>
        <b v-else v-text="chat.name"></b>
        <div class="last-message">
        <span v-if="this.chat.last_message!=null">
          <div
            class="last-message-text"
            v-if="this.chat.last_message.message!=null"
            v-text="this.chat.last_message.message"></div>
          <span v-if="this.chat.last_message.attachments!=null">
            <span v-if="this.chat.last_message.attachments.stickers!=null">Стикер</span>
            <span v-else-if="this.chat.last_message.attachments.images!=null">Картинка</span>
            <span v-else-if="this.chat.last_message.attachments.videos!=null">Видео</span>
          </span>
        </span>
        </div>
        <template v-if="this.chat.last_message">
          <in-time :time="this.chat.last_message.created_at_timestamp"></in-time>
        </template>
      </div>
    </a>
    <div class="chat-settings" @click="showChatSettings()">
      <p>^^^</p>
      <span class=chat-unread-messages>{{unreadCount}}</span>
    </div>
    <!--<div class="chat-settings chat-unread-messages"  >
        {{unreadCount}}
    </div>-->
  </div>
</template>

<script>
  import axios from 'axios';

  import Vue from 'vue'
  import Time from 'ComponentsVue/main/postfooter/comments/Time.vue'

  Vue.component('in-time', Time);
  export default {
    data() {
      return {
        usersArray: [],
        clientHeight: '',
        unreadCount: '',
      }
    },
    props: ['chat'],
    mounted() {
      axios.get('v1/me/chats/messages/unread?chat_id=' + this.chat.id)
        .then(
          res => {

            if (res.data.count != 0)
              this.unreadCount = res.data.count;
          }
        );
      this.clientHeight = localStorage.getItem('clientWidth');
      let yourUserId = JSON.parse(localStorage.getItem('user')).id;
      for (let i = 0; i < this.chat.users.length; i++) {
        if (this.chat.users[i].id != yourUserId) {
          if (this.usersArray.length < 4)
            this.usersArray.push(this.chat.users[i])
        }
      }

    },
    methods: {
      showChatSettings() {
        this.$root.$emit('showChatModal', this.chat.id);
      },
      resendMessages() {
        if (this.$route.query.msg) {
          let data = new FormData();
          data.append('ids', this.$route.query.msg);
          data.append('chat_id', this.chat.id);
          axios.post('v1/me/chats/messages/forward', data)
            .then(
              res => {
                this.$root.$emit('resetMessagesDeleteArray');
                if (res.state === true) {
                  this.$router.push(`/messages/${this.chat.id}`);
                } else {
                  this.$notify({
                    group: 'action-error',
                    duration: 3000,
                    speed: 300
                  });
                  this.$router.go(-1);
                }
              }
            )
        } else {
          this.$router.push(`/messages/${this.chat.id}`);
        }
      }
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/chatItem.less';

  .comment-createdAt {
    color: #585151 !important;
  }

</style>
