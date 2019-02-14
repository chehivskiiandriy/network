<docs>
  #
</docs>

<template>
  <div>
    <notifications
      group="socket"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div
          @click="props.close"
          class="notification-guest">
          <b
            class="title"
            v-html="props.item.title"></b>
        </div>
      </template>
    </notifications>
  </div>
</template>

<script>
  import io from 'socket.io-client';
  import {mapActions, mapMutations, mapGetters} from 'vuex';

  import {ADD_UNWATCHED_FEEDS, ADD_UNWATCHED_GIFTS, moduleName as feedsModule} from 'Store/modules/feeds';
  import {
    moduleName as chatsAllModule,
    UPDATE_CHATS,
    UPDATE_ONLINE_CHAT,
    CHANGE_UNREAD_MESSAGES_COUNT,
    UPDATE_LAST_MESSAGE,
    SORT_CHATS
  } from "Store/modules/chats/chatsAll";
  import {
    moduleName as chatMessagesModule,
    ADD_MESSAGE, ADD_TRANSLATED_MESSAGE,
    DELETE_MESSAGES,
    READ_MESSAGES_IN_CHAT
  } from "../store/modules/chats/chatMessages";
  import {moduleName as userModule, AUTH_USER} from "../store/modules/authUser/user";
  import {
    moduleName as chatsArchiveModule,
    UPDATE_ONLINE_ARCHIVE_CHAT,
    DELETE_FROM_ARCHIVE_CHAT
  } from "Store/modules/chats/chatsArchive";
  import {
    moduleName as chatsAllSearchModule,
    UPDATE_ONLINE_SEARCH_CHAT,
    UPDATE_SEARCH_LAST_MESSAGE,
    SORT_SEARCH_CHATS
  } from "Store/modules/chats/chatsAllSearch";
  import {
    moduleName as chatFavouriteMessagesModule,
    DELETE_FAVOURITE_MESSAGES
  } from "Store/modules/chats/chatFavouriteMessages";
  import {
    moduleName as usersModule,
    UPDATE_ONLINE_USERS
  } from "Store/modules/users/users";
  import {
    moduleName as chatsModule,
    UPDATE_CHAT
  } from "Store/modules/chats/chats";
  import {SUCCESS} from "Store/types";

  export default {
    name: 'socket',
    data(){
      return {
        socket: io.connect('https://api.inrating.top:443', {
          query: {
            token: 'Bearer ' + localStorage.getItem('token')
          },
        }),
      }
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER
      })
    },
    mounted(){

      let token = localStorage.getItem('token');

      if(!token){
        return;
      }

      this.$el.addEventListener('click', (res) =>{
        if(res.target.className){
          let type = res.target.dataset.type;
          let href = res.target.dataset.href;
          if(type === 'user'){
            this.goToLink('/u/' + href);
          }else if(type === 'post'){
            this.goToLink('/p/' + href);
          }else if(type === 'gift'){
            this.goToLink('/p/' + href + '/gift');
          }else if(type === 'chat'){
            this.goToLink('/messages/' + href);
          }
        }
      });

      this.socket.on('connect', () =>{
        console.log('connect socket')

        this.socket.on('authorized', (res) =>{
        });

        this.socket.on('private-feeds.like', (res) =>{
          this.$notify({
            group: 'socket',
            type: 'success',
            duration: 2000,
            title:`<span class="goToLink" data-href="${res.data.entity.entity.user.nickname }" data-type="user">${res.data.entity.entity.user.nickname}</span>  <span class="goToLink" data-href="${res.data.entity.entity.post.slug}" data-type="post"> ${this.$lang.variables.likedFromUser} </span>`,
          });
          this.addUnwatchedFeeds();
        });

        this.socket.on('private-feeds.rating-vote', (res) =>{
          this.$notify({
            group: 'socket',
            type: 'success',
            duration: 2000,
            title:`<span class="goToLink" data-href="${res.data.entity.entity.user.nickname }" data-type="user">${res.data.entity.entity.user.nickname}</span>   ${this.$lang.variables.riseRating} `,
          });
          this.addUnwatchedFeeds();
        });

        this.socket.on('private-feeds.gift', (res) =>{
          this.$notify({
            group: 'socket',
            type: 'success',
            duration: 5000,
            title:`<span class="goToLink" data-href="${res.data.entity.entity.user.nickname }" data-type="user">${res.data.entity.entity.user.nickname}</span>   ${this.$lang.variables._sentAGiftToYou} `,
          });
          this.addUnwatchedFeeds();
          this.addUnwatchedGifts();
        });

        this.socket.on('private-feeds.comment', (res) =>{
          this.$notify({
            group: 'socket',
            type: 'success',
            duration: 2000,
            title:`<span class="goToLink" data-href="${res.data.entity.entity.user.nickname }" data-type="user">${res.data.entity.entity.user.nickname}</span>   ${this.$lang.variables.commented} `,
          });
          this.addUnwatchedFeeds();
        });

        this.socket.on('private-feeds.chin-chin', (res) =>{
          this.$notify({
            group: 'socket',
            type: 'success',
            duration: 2000,
            title:`<span class="goToLink" data-href="${res.data.entity.entity.user.nickname }" data-type="user">${res.data.entity.entity.user.nickname}</span>   ${this.$lang.variables.chinChinSend} `,
          });
          this.addUnwatchedFeeds();
          this.$root.$emit('newMessageIndex');
        });

        this.socket.on('private-chats.message', res =>{
          this.updateChats(res.message);
          this.updateChat(res.message);
          this.addMessage(res.message);
          this.deleteFromArchiveChatSuccess(res.message.chat_id);

          if(res.author.id !== this.authUser.id){
            if(this.$route.path.split('/')[1] !== 'messages'){
              this.$notify({
                group: 'socket',
                type: 'success',
                duration: 2000,
                title:`<span class="goToLink" data-href="${res.author.nickname }" data-type="user">${res.author.nickname}</span>   ${this.$lang.variables.sendMsgToChat} `,
              });
              this.changeUnreadMessages(1);
            }
          }
        });

        this.socket.on('private-chats.message-translation', res =>{
          this.addTranslatedMessage(res.message);
        });


        this.socket.on('private-chats.message-read', res => {
          console.log('read', res);
          this.readMessagesInChat({id: res.chat_id, authUserId: this.authUser.id});
        });

        this.socket.on('private-chats.messages-deleted', res => {
          this.deleteMessages({ ids: [...res.message_ids], chatId: res.chat_id});
          this.deleteFavouriteMessages({ ids: [...res.message_ids]});
          this.updateLastMessage({chatId: res.chat_id, message: res.message});
          this.updateSearchLastMessage({chatId: res.chat_id, message: res.message});
          this.sortChats();
          this.sortSearchChats();
        });

        this.socket.on('private-chats.user-typing', res => {
          console.log(res);
        });

        this.socket.on('private-chats.user-stopped-typing', res => {
          console.log(res);
        });

        this.socket.on('public-users.user-online', res => {
          // this.updateOnlineUsers({
          //   nickname: res.nickname,
          //   status: true
          // });
          // this.updateOnlineChat({
          //   nickname: res.nickname,
          //   status: true
          // });
          // this.updateOnlineArchiveChat({
          //   nickname: res.nickname,
          //   status: true
          // });
          // this.updateOnlineSearchChat({
          //   nickname: res.nickname,
          //   status: true
          // });
        });

        this.socket.on('public-users.user-offline', res => {
          // this.updateOnlineUsers({
          //   nickname: res.nickname,
          //   status: false
          // });
          // this.updateOnlineChat({
          //   nickname: res.nickname,
          //   status: false
          // });
          // this.updateOnlineArchiveChat({
          //   nickname: res.nickname,
          //   status: false
          // });
          // this.updateOnlineSearchChat({
          //   nickname: res.nickname,
          //   status: false
          // });
        });

      });
    },
    methods: {
      ...mapActions({
        updateChats: chatsAllModule + UPDATE_CHATS,
        updateChat: chatsModule + UPDATE_CHAT
      }),
      ...mapMutations({
        addUnwatchedFeeds: feedsModule + ADD_UNWATCHED_FEEDS,
        addUnwatchedGifts: feedsModule + ADD_UNWATCHED_GIFTS,
        updateOnlineChat: chatsAllModule + UPDATE_ONLINE_CHAT,
        addMessage: chatMessagesModule + ADD_MESSAGE,
        addTranslatedMessage: chatMessagesModule + ADD_TRANSLATED_MESSAGE,
        changeUnreadMessages: chatsAllModule + CHANGE_UNREAD_MESSAGES_COUNT,
        updateOnlineArchiveChat: chatsArchiveModule + UPDATE_ONLINE_ARCHIVE_CHAT,
        deleteFromArchiveChatSuccess: chatsArchiveModule + DELETE_FROM_ARCHIVE_CHAT + SUCCESS,
        updateOnlineSearchChat: chatsAllSearchModule + UPDATE_ONLINE_SEARCH_CHAT,
        deleteMessages: chatMessagesModule + DELETE_MESSAGES + SUCCESS,
        deleteFavouriteMessages: chatFavouriteMessagesModule + DELETE_FAVOURITE_MESSAGES + SUCCESS,
        readMessagesInChat: chatMessagesModule + READ_MESSAGES_IN_CHAT,
        updateLastMessage: chatsAllModule + UPDATE_LAST_MESSAGE,
        updateSearchLastMessage: chatsAllSearchModule + UPDATE_SEARCH_LAST_MESSAGE,
        sortChats: chatsAllModule + SORT_CHATS,
        sortSearchChats: chatsAllSearchModule + SORT_SEARCH_CHATS,
        updateOnlineUsers: usersModule + UPDATE_ONLINE_USERS
      }),
      goToLink(_link){
        this.$router.push(_link);
      }
    },
  }
</script>

<style lang="less">

</style>
