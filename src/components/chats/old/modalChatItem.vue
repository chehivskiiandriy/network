<template>
  <div  class="chat-item"  @click="sendPostToChat()">
    <div class="chat-item--avatar">

      <img v-if="usersArray.length==1" class="solo-avatar" :src="usersArray[0].avatar_image.url_small">
      <span class="multi-img-block" v-else>
                    <img   v-for="(user,index) in usersArray" :class="'solo-avatar-'+index" :src="user.avatar_image.url_small">
                </span>
    </div>
    <div class="chat-item--info">
      <b v-if="usersArray.length==1" v-text="usersArray[0].nickname"></b>
      <b v-else v-text="chat.name"></b>
      <div class="last-message">
                    <span v-if="this.chat.last_message!=null">
                        <span v-if="this.chat.last_message.message!=null" v-text="this.chat.last_message.message"></span>
                        <span v-if="this.chat.last_message.attachments!=null">
                            <span v-if="this.chat.last_message.attachments.stickers!=null" >Стикер</span>
                            <span v-else-if="this.chat.last_message.attachments.images!=null" >Картинка</span>
                            <span v-else-if="this.chat.last_message.attachments.videos!=null" >Видео</span>
                        </span>
                    </span>
      </div>
      <in-time :time="this.chat.created_at"></in-time>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  import Vue from 'vue'
  import Time from 'ComponentsVue/main/postfooter/comments/Time.vue'

  Vue.component('in-time',Time);
  export default {
    props:['postId','chat'],
    data() {
      return {
        usersArray:[],
      }
    },
    mounted() {
      let yourUserId=JSON.parse(localStorage.getItem('user')).id;
      for (let i=0; i<this.chat.users.length; i++ ){
        if (this.chat.users[i].id!=yourUserId){
          if (this.usersArray.length<4)
            this.usersArray.push(this.chat.users[i])
        }
      }
    },
    methods:{
      sendPostToChat() {
        let params={
          chat_id:this.chat.id,
          post_slug:this.postId,
        };

        axios.post('v1/me/chats/messages/forward-post',params)
          .then(
            res=> {
              this.$modal.hide('chatsModal');
            }
          )
      }
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/chatItem.less';
</style>
