<docs>
  # footer block with info
</docs>

<template>

  <header
    v-if="groupHeader
    && userProfile
    && $route.path!=='/contest-create'
    && $route.path.indexOf('/contest/') === -1
    && $route.path!=='/login'
    && $route.path.indexOf('/groups/') === -1
    && $route.path!=='/reset-password'
    && $route.path!=='/registration'
    && $route.path!=='/public-offer-and-confidentiality'
    && $route.path!=='/rule-page'
    && $route.path!=='/contest-rules'
    && $route.path!=='/new-post'
    && $route.path!=='/messages'
    && $route.path.indexOf('/messages/') === -1
    && $route.path.indexOf('/messages-archive') === -1
    && $route.path.indexOf('/messages-favourite') === -1
    && $route.path.indexOf('/new-chat/') === -1
    && $route.path.indexOf('/create-search-chat') === -1
    && $route.path.indexOf('/create-newsletter') === -1
    && $route.path.indexOf('/create-groupchat') === -1
    && addPostGroup
    && $route.path!=='/add-story'
    && ($route.path!=='/add-story-album' && $route.path !=='/add-story-album/')
    && $route.path!=='/change-profile'
    && $route.path!=='/add-to-black-list'
    && $route.path!=='/active-black-list'
    && intagSoloHeader
    && $route.path!=='/group-create'
    && $route.path.indexOf('subscribers') === -1
    && $route.path!=='/groups' "
    :class="{'header-user-profile': $route.path.indexOf('/u/') !== -1 && top <= 25 }"
    :style="{backgroundColor: `rgba(0, 0, 0, ${top > 50 || $route.path.indexOf('/u/') === -1 ? '0.5' : (top / 100)}` }">
    <!--<div v-if="extraFields.length>0" class="header-banner">
      <p>Пройдите небольшой опрос - помогите нам стать лучше.  <a class="go-to-opros" target="_blank" href="https://goo.gl/forms/v6t59Sk5J5yEEAvq2">Перейти</a></p>
    </div>-->
    <div
      v-if="!chatsHeader && !statisticsHeader && !newChats && !discussionChat  && !storyHeader && !settingsHeader && !postHeader"
      id="header">

      <div class="header-item">
        <router-link
          v-if="authUser && authUser.status && authUser.status !== 'guest' && authUser.status !== 'no_chat_user'"
          to="/messages">
          <i class="icon-letter"></i>
          <span class="letter-counts">{{unreadMessagesCount}}</span>
        </router-link>
        <i
          v-else-if="authUser && authUser.status && authUser.status !== 'guest' && authUser.status === 'no_chat_user'"
          @click="noPhone()"
          class="icon-letter"></i>
        <i
          v-else
          @click="showRegistrationStep1()"
          class="icon-letter"></i>
      </div>
      <div class="header-item header-notactive">
        <i class="icon-planet-telephone"></i>
      </div>
      <div class="header-item logo">
        <span v-if="this.$route.path === '/'">{{$lang.variables.home}}</span>
        <span v-else-if="this.$route.path === '/feeds'">{{$lang.variables.activity}}</span>
        <span v-else-if="this.$route.path === '/messages'">{{$lang.variables.chats}}</span>
        <span v-else-if="this.$route.path === '/create-newsletter'">{{$lang.variables.makeANewsletter}}</span>
        <span v-else-if="this.$route.path === '/buy'">{{$lang.variables.wallet}}</span>
        <span
          v-else-if="this.$route.path === '/search' || this.$route.path === '/search/user' || this.$route.path === '/search/location' || this.$route.path=== '/search/group' || this.$route.path === '/search/intag'">{{$lang.variables.search}}</span>
        <span v-else-if="this.$route.path === '/contests'">{{$lang.variables.contests}}</span>
        <span v-else-if="this.$route.path === '/rating/top'">{{$lang.variables.lidersRating}}</span>
        <span v-else-if="this.$route.path === '/groups'">{{$lang.variables.groups}}</span>
        <div
          class="header-usernickname"
          v-else-if="userHeader">{{this.$route.params.nickname}}
        </div>
        <router-link
          v-else
          to="/">
          <img src="https://media.inrating.top/storage/img/logo/inRating_logo_grad_white.png">
        </router-link>

      </div>
      <div class="header-item">
        <i
          v-if="$route.path === '/'"
          @click="changeViewHome"
          :class="homeView"></i>
        <i
          v-else-if="$route.path === '/rating'"
          @click="changeViewRating"
          :class="ratingView"></i>
        <i
          v-else-if="userSubscribePage"
          @click="changeViewSubscribe"
          :class="subscribeView"></i>
        <i
          v-else-if="userHeader"
          @click="changeViewProfile"
          :class="profileView"></i>
      </div>
      <div class="header-item">
        <i
          v-if="$route.path === '/'"
          @click="openMainFilters"
          class="icon-Menu-gamburger-2"></i>
        <i
          v-else-if="$route.path === '/rating'"
          @click="openRatingFilters"
          class="icon-Menu-gamburger-2"></i>
        <i
          v-else-if="$route.path === '/feeds'"
          @click="showFeedsFilters"
          class="icon-Menu-gamburger-2"></i>
        <i
          v-else-if="$route.path === '/contests'"
          @click="openContestCreate"
          class="icon-plus-f"></i>
        <router-link
          v-else-if="authUser.status !== 'guest' && $route.path.indexOf('/u/') !== -1"
          to="/setting">
          <i class="icon-gear"></i>
        </router-link>
        <div v-else></div>
        <!--<i-->
          <!--v-else-->
          <!--@click="showRegistrationStep1()"-->
          <!--class="icon-menu"></i>-->
      </div>
    </div>
    <div class="post-header-container" v-else-if="postHeader"><i @click="goBackPost()" class="icon-left-f go-back-post"></i>{{extraTitle || $lang.profile.post}}</div>
    <div
      v-else-if="chatsHeader && !editChats && !statisticsHeader && !newChats && !discussionChat && !settingsHeader "
      class="chatsHeader head">
      <div class="chat-user">
        <div class="chat-user-data" @click="redirectOnUserPage(userNickname)">
          <div
            class="chat-nickname"
            v-text="userNickname"></div>
          <div class="chat-fullname">{{usersArray[0].name + ' ' + usersArray[0].lastname}}</div>
        </div>
        <div class="chat-avatar" @click="redirectOnUserPage(userNickname)">
          <img class="message-sender" :src="usersArray[0].avatar_image.url_small">
        </div>
        <div class="chat-users-lang">
          <span>{{myLang}}</span><br><span>{{opponentLang}}</span>
        </div>
      </div>
      <!--<router-link to="/chats">-->
      <a @click="$router.go(-1)">
        <i class="icon-left-f go-back"></i>
      </a>
      <!--</router-link>-->
      <i class="icon-planet-telephone"></i>
      <!--<i class="icon-videocamera-f"></i>-->
    </div>
    <div
      v-else-if="!chatsHeader && !editChats && !statisticsHeader && newChats && !discussionChat && !settingsHeader"
      class="chatsHeader">
      <div
        class="chat-nickname"
        v-text="userNickname"></div>
      <!--<router-link to="/chats">-->
      <a @click="$router.go(-1)">
        <i class="icon-left-f go-back"></i>
      </a>
      <!--</router-link>-->
    </div>
    <div
      v-else-if="chatsHeader && editChats && !statisticsHeader && !discussionChat && !settingsHeader"
      class="chatsHeader">
      <div
        v-if="editChats "
        class="chat-footer">
        <in-chat-edit :deleteArrayMessage="deleteArrayMessage"/>
      </div>
    </div>
    <div
      v-else-if="discussionChat "
      class="chatsHeader">
      <span
        @click="goToDiscussion()"
        class="go-back-discussion"><i class="icon-left-f"></i></span>
      <p class="discusion-header-title">{{this.discussion.title}}</p>
    </div>
    <div v-else-if="storyHeader"></div>
    <div v-else-if="intagSoloHeader"></div>
    <div v-else-if="settingsHeader"></div>
    <div
      v-if="!chatsHeader && statisticsHeader"
      class="chatsHeader">
      <div class="chat-nickname">{{$lang.variables.postStatistics}}</div>
      <!--<router-link to="/">-->
      <a @click="$router.go(-1)">
        <i class="icon-left-f go-back"></i>
      </a>
      <!--</router-link>-->
    </div>

  </header>
</template>

<script>
  import axios from 'axios';

  import Vue from 'vue'
  import {mapActions, mapGetters} from 'vuex';

  import chatEdit from 'ComponentsVue/footer/chatEdit.vue'
  import {
    CHANGE_HOME_POST_COUNT,
    CHANGE_PROFILE_POST_COUNT,
    CHANGE_RATING_POST_COUNT,
    CHANGE_SUBSCRIBE_POST_COUNT,
    HOME_POST_COUNT,
    moduleName as countPostOnPageModule,
    PROFILE_POST_COUNT,
    RATING_POST_COUNT,
    SUBSCRIBE_POST_COUNT,
  } from 'Store/modules/countPostOnPage';
  import {moduleName as feedsModule, SHOW_FILTERS} from 'Store/modules/feeds';
  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";
  import {moduleName as postsModule, POST} from "Store/modules/posts";
  import {
    moduleName as chatsAllModule,
    FETCH_UNREAD_MESSAGES_COUNT,
    UNREAD_MESSAGES_COUNT
  } from "../store/modules/chats/chatsAll";


  Vue.component('in-chat-edit', chatEdit);
  export default {
    name: 'Header',
    data() {
      return {
        userNickname: '',
        usersArray: [],
        deleteArrayMessage: [],
        newUser: '',
        myLang: '',
        opponentLang: '',
        letterCount: '',
        discussion: {},
        top: false
      }
    },
    created() {
      window.addEventListener('scroll', this.handleTopVisible)
    },
    mounted() {
      this.fetchUnreadMessagesCountInfo();

      this.$root.$on('newMessageIndex',()=>{
        this.updateUnreadMessages();
      });
      this.$root.$on('messageEdit', (messageDelete, bool, index) => {
        this.deleteMessArray(messageDelete, bool, index);
      });
      this.$root.$on('changeFooter', () => {
        this.editChats;
      });
      this.$root.$on('updateChat', () => {
        this.updatedChat();
      });
      this.$root.$on('resetMessagesDeleteArray', () => {
        this.deleteArrayMessage = [];
      });
      // this.$root.$on('updateUnread',()=>{
      //   this.updateUnreadMessages();
      // });
      // this.updateUnreadMessages();

    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleTopVisible);
    },
    computed: {
      ...mapGetters({
        homePostCount: countPostOnPageModule + HOME_POST_COUNT,
        ratingPostCount: countPostOnPageModule + RATING_POST_COUNT,
        profilePostCount: countPostOnPageModule + PROFILE_POST_COUNT,
        subscribePostCount: countPostOnPageModule + SUBSCRIBE_POST_COUNT,
        authUser: userModule + AUTH_USER,
        postInfo: postsModule + POST,
        unreadMessagesCountInfo: chatsAllModule + UNREAD_MESSAGES_COUNT
      }),
      unreadMessagesCount() {
        return this.unreadMessagesCountInfo > 99 ? '99+' : this.unreadMessagesCountInfo > 0 ? this.unreadMessagesCountInfo : ''
      },
      userSubscribePage() {
        let profileRoute = this.$route.path.split('/')[3];
        if (profileRoute === 'subscribition' || profileRoute === 'subscribers') {
          return true;
        } else {
          return false;
        }
      },
      userProfile() {
        if (this.$route.path.indexOf('/u/') === -1) {
          return true;
        } else {
          return this.$route.params.nickname === this.authUser.nickname;
        }
      },
      userHeader: function () {
        if (this.$route.params.nickname) {
          return true;
        } else {
          return false;
        }
      },
      extraTitle: function () {
        const postInfo = this.postHeader && this.postInfo(this.$route.params.slug);
        console.log(postInfo)
        const extra = postInfo && postInfo.extra;
        return extra && ((extra.group && extra.group.name) || (extra.album && extra.album.title));
      },
      postHeader: function () {

        if (this.$route.path.split('/')[1] === 'p')
          return true;
      },
      addPostGroup: function () {

        if (this.$route.path.split('/')[1] != 'new-post')
          return true;
        else
          return false;
      },
      chatsHeader: function () {
        this.usersArray = [];
        if (this.$route.params.chat_id != null) {
          this.threadNick();
          return true;
        }
      },
      newChats: function () {
        if (this.$route.params.user_chat != null) {
          this.newChat();
          return true;
        }
      },
      statisticsHeader: function () {
        if (this.$route.params.statistics_id != null) {
          return true;
        }
      },
      groupHeader() {
        if (this.$route.params.group_slug != null) {
          return false;
        }
        else {
          return true;
        }
      },
      editChats: function () {
        return this.deleteArrayMessage.length > 0
      },
      discussionChat: function () {
        if (this.$route.params.discussion_slug != null) {
          this.discussionTitle();
          return true;
        }
      },
      storyHeader: function () {
        return [
          'archived-story',
          'story-album',
          'active-story',
          'active-stories',
        ].indexOf(this.$route.name) !== -1;
      },
      settingsHeader: function () {
        let set = this.$route.path.split('/');
        if (set[1] === 'setting' || this.$route.meta.isFaqPage) {

          return true;
        }

      },
      intagSoloHeader: function () {
        let intag = this.$route.params.intag;

        return intag ? false : true;
      },
      subscribeView() {
        if (this.subscribePostCount === '1')
          return 'icon-menu-4-1';
        else
          return 'icon-menu-4-1v2';
      },
      profileView() {
        if (this.profilePostCount === '4')
          return 'icon-menu-16';
        else if (this.profilePostCount === '2')
          return 'icon-menu-4';
        else
          return 'icon-menu-1';
      },
      homeView() {
        if (this.homePostCount === '1')
          return 'icon-feed-view-1';
        else
          return 'icon-feed-view-4';
      },
      ratingView() {
        if (this.ratingPostCount === '1')
          return 'icon-feed-view-1';
        else
          return 'icon-feed-view-4';
      }
    },
    methods: {
      ...mapActions({
        changeHomePostCount: countPostOnPageModule + CHANGE_HOME_POST_COUNT,
        changeRatingPostCount: countPostOnPageModule + CHANGE_RATING_POST_COUNT,
        changeProfilePostCount: countPostOnPageModule + CHANGE_PROFILE_POST_COUNT,
        changeSubscribePostCount: countPostOnPageModule + CHANGE_SUBSCRIBE_POST_COUNT,
        showFeedsFilters: feedsModule + SHOW_FILTERS,
        fetchUnreadMessagesCountInfo: chatsAllModule + FETCH_UNREAD_MESSAGES_COUNT
      }),
      handleTopVisible() {
        this.top = this.topVisible()
      },
      topVisible() {
        return document.body.scrollTop || document.documentElement.scrollTop
      },
      openRatingFilters() {
        this.$root.$emit('openRatingFilters');
        document.getElementsByTagName('html')[0].style.overflow = 'hidden';
      },
      openMainFilters() {
        this.$root.$emit('openMainFilters');
        document.getElementsByTagName('html')[0].style.overflow = 'hidden';
      },
      openFeedsFilters() {
        this.$root.$emit('openFeedFilters');
        document.getElementsByTagName('html')[0].style.overflow = 'hidden';
      },
      updateUnreadMessages() {
        if (this.authUser.status == 'active' || this.authUser.status == 'admin') {
          axios.get('v1/me/chats/messages/unread')
            .then(
              res => {
                if (res.data.count != 0) {
                  if (res.data.count >= 100)
                    this.letterCount = '99+';
                  else
                    this.letterCount = res.data.count;
                }

                else
                  this.letterCount = '';

              }
            )
        }
      },
      openContestCreate() {
        this.$router.push('/contest-create');
      },
      discussionTitle() {
        let discussion_id = this.$route.params.discussion_slug;
        axios.get('v1/discussions/get?id=' + discussion_id)
          .then(
            res => {
              this.discussion = res.data
            }
          )
      },
      goToDiscussion() {
        let groupId = this.$route.params.group_slug;
        this.$router.push('/group/' + groupId + '/discussions');
      },
      noPhone() {
        this.$notify({
          group: 'nophone',
          duration: 3000,
          speed: 300,
        });
      },
      threadNick() {
        let chat_id = this.chat_id = this.$route.params.chat_id;
        axios.get('v1/me/chats/get?id=' + chat_id)
          .then(res => {
            this.chat = res.data;

            if (this.chat.users.length === 2) {
              if (this.chat.users[0].id == this.chat.author_id) {
                this.myLang = this.chat.users[0].chat_main_lang;
                this.opponentLang = this.chat.users[1].chat_main_lang;
              }
              else {
                this.myLang = this.chat.users[1].chat_main_lang;
                this.opponentLang = this.chat.users[0].chat_main_lang;
              }
            }

            let yourUserId = this.authUser.id;
            for (let i = 0; i < this.chat.users.length; i++) {
              if (this.chat.users[i].id != yourUserId) {
                this.usersArray.push(this.chat.users[i])
              }
            }

            if (this.usersArray.length == 1) {
              this.userNickname = this.usersArray[0].nickname;
            }
            else {
              this.userNickname = this.chat.name;
            }
          })
      },
      showRegistrationStep1() {
        this.$notify({
          group: 'guest-template',
          duration: 3000,
          speed: 300,
        });
      },
      newChat() {
        this.newUser = this.$route.params.user_chat;
        axios.get('v1/users/get?id=' + this.newUser)
          .then(res => {
            this.userNickname = res.data.nickname;
          })
      },

      goBackPost() {
        history.go(-1);
      },

      updatedChat() {
        this.deleteArrayMessage = [];
      },
      deleteMessArray(el, bool, i) {
        if (bool)
          this.deleteArrayMessage.push(el);
        else
          this.deleteArrayMessage.splice(i, 1);
      },
      changeViewHome() {
        if (this.homePostCount === '1') {
          this.changeHomePostCount('2');
        }
        else {
          this.changeHomePostCount('1');
        }
      },
      changeViewRating() {
        if (this.ratingPostCount === '1') {
          this.changeRatingPostCount('2');
        }
        else {
          this.changeRatingPostCount('1');
        }
      },
      changeViewProfile() {
        if (this.profilePostCount === '4') {
          this.changeProfilePostCount('2');
        }
        else if (this.profilePostCount === '2') {
          this.changeProfilePostCount('4');
          // this.changeProfilePostCount('1');
        } else {
          // this.changeProfilePostCount('4');
        }

        window.profileViewIndex = !window.profileViewIndex;
      },
      changeViewSubscribe() {
        if (this.subscribePostCount === '1') {
          this.changeSubscribePostCount('4');
        }
        else {
          this.changeSubscribePostCount('1');
        }
      },
      redirectOnUserPage(userNickname) {
        this.$router.push(`/u/${userNickname}`);
      }
    }
  }

</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  header {
    text-align: center;
    position: fixed;
    width: 100%;
    max-height: 40px;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
    margin: 0;
    /*padding: 7px 10px;*/
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    z-index: 1111;
    transition: 0.3s ease-out;

    i {
      transition: all 0.5s ease-out;
    }

    .header-usernickname {
      transition: all 0.5s ease-out;
    }

    &.header-user-profile {
      /*background: transparent;*/

      i {
        color: #000000;
      }

      .header-usernickname {
        color: #000000;
      }
    }
  }

  #header {
    display: flex;
    padding: 7px 10px;
    width: 100%;
    align-items: center;
    justify-content: space-between;
  }

  .chatsHeader {
    max-height: 40px;
    text-align: center;
    position: fixed;
    width: 100%;
    box-sizing: border-box;
    .bgc-grad();
    top: 0;
    left: 0;
    margin: 0;
    display: flex;
    align-items: center;
    z-index: 1111;
    justify-content: center;
    padding: 5px 10px;
    flex-wrap: wrap;
  }

  .go-back {
    position: absolute;
    left: 10px;
    top: 8px;
    font-size: 22px;
    color: #fff;
  }

  .post-header-container {
    color: @white;
    padding: 5px 0px;
    text-align: center;
    width: 100%;
    font-size: 26px;
  }

  .header-item {
    position: relative;
    font-size: 26px;
    color: #fff;
    width: 6%;
    i {
      display: block;
    }
    a {
      color: #fff;
      text-decoration: none;
    }
  }

  .logo img {
    width: 100%;
    height: auto;
    display: block;
  }

  .chat-nickname {
    font-weight: 600;
    font-size: 22px;
    line-height: 30px;
    color: #fff;
  }

  .discusion-header-title {
    font-size: 20px;
    color: @contest-list-text-color;
    margin: 0;
  }

  .go-back-discussion {
    position: absolute;
    color: @contest-list-text-color;
    top: 8px;
    left: 10px;
  }

  .header-usernickname {
    width: 100%;
    color: #fff;
    font-weight: 600;
  }

  .logo {
    width: 36%;
    text-align: center;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    > span {
      color: #fff;
    }
  }

  .header-banner {
    width: 100%;
    background: @contest-list-text-color;
    color: #fff;
    font-size: 11px;
    padding: 15px 0;
    p {
      margin: 0;
    }
  }

  .go-to-opros {
    color: #000;
  }

  .header-notactive {
    color: #d3d3d3;
  }

  .letter-counts {
    position: absolute;
    font-size: 14px;
    left: 6.5vw;
    top: -4px;
    color: red;
    width: 100%;
    text-align: left;
    font-weight: 600;
  }

  @media screen and (max-width: 320px) {
    .logo {
      font-size: 13px;
    }
  }

  .head {
    /*background: #fff;*/
    max-height: 40px;

    .go-back {
      /*<!--color: @contest-list-text-color;-->*/
    }

    .chat-user {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    .chat-user-data {
      margin-right: 10px;
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: flex-end;
      color: #fff;
    }

    .chat-nickname {
      font-size: 14px;
      line-height: normal;
    }

    .chat-fullname {
      font-size: 12px;
    }

    .chat-avatar {
      /*height: 100%;*/
      border: 1px solid #f4f4f4;
      border-radius: 5px;

      img {
        height: 34px;
        width: 34px;
      }
    }

    .icon-videocamera-f:before {
      color: #cccccc;
      font-size: 32px;
      position: absolute;
      top: 50%;
      left: 100px;
      transform: translateY(-50%);
    }

    .icon-planet-telephone:before {
      color: #cccccc;
      font-size: 28px;
      position: absolute;
      top: 50%;
      left: 60px;
      transform: translateY(-50%);
    }
  }
  .go-back-post {
    position: absolute;
    left: 6px;
    top: 7px;
  }

  .chat-users-lang {
    color: @white;
    margin-left: 10px;
    :first-child {
      border-bottom: 1px solid white;
      padding: 0px 5px;
    }
  }
</style>
