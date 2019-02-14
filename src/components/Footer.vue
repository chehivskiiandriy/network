<docs>
  # footer block with info
  # tp - its triple
</docs>

<template>
  <footer
    v-if="$route.path!='/login'
    && $route.path!=='/reset-password'
    &&  $route.path!='/contest-rules'
    && $route.path!='/registration'
    && $route.path!='/public-offer-and-confidentiality'
    && $route.path!='/rule-page'
    && $route.path!='/photo-camera'
    && addPostGroup
    && $route.path!=='/add-story'
    && $route.path!=='/add-story-album'
    && $route.path!=='/add-story-album/'
    && $route.path.indexOf('settings') === -1
    && $route.path.indexOf('/messages/') === -1
    && this.$route.path.indexOf('/messages-archive') === -1
    && $route.path.indexOf('/messages-favourite') === -1
    && this.$route.path.indexOf('/create-newsletter') === -1
    && this.$route.path.indexOf('/create-groupchat') === -1
    && this.$route.path.indexOf('/new-chat/') === -1
    && this.$route.path.indexOf('/create-search-chat') === -1
    && $route.path !== '/change-profile'
    && $route.path !== '/add-to-black-list'
    && $route.path !== '/active-black-list'
    && $route.path.indexOf('subscribers') === -1">
    <div
      v-if="chatsFooter && !newChatFooter && !storyHeader"
      class="chat-footer">
      <in-chat-footer :threadId="threadId"/>
    </div>
    <div
      v-else-if="!chatsFooter  && newChatFooter"
      class="chat-footer">
      <in-newchat-footer/>
    </div>
    <div
      v-else-if="discussionFooter"
      class="chat-footer">
      <in-discussion-footer :discussionId="discussionId"/>
    </div>
    <div v-else-if="storyHeader"></div>
    <div
      v-else
      id="footer">
      <div
        ref="footerTp"
        id="footerTp"
        class="footer-tp">

        <div class="footer-tp--item">

          <div class="footer-item">
            <in-footer-item
              link="buy"
              notActiveClass="icon-dollar"
              activeClass="icon-dollar-f active-footer-icon"
              type="icon"/>
          </div>
          <div class="footer-item logo  ">
            <in-footer-item
              link="prizes"
              notActiveClass="icon-prise"
              activeClass="icon-prise-f active-footer-icon"
              type="icon"/>
          </div>
          <div class="footer-item">
            <in-footer-item
              link="contests"
              notActiveClass="icon-Kubok_konkurs"
              activeClass="icon-Kubok_konkurs-f active-footer-icon"
              type="icon"/>
          </div>
          <div class="footer-item   ">
            <in-footer-item
              link="rating/top"
              notActiveClass="icon-TOP5"
              activeClass="icon-TOP5-f active-footer-icon"
              type="icon"/>
          </div>
          <div class="footer-item">
            <in-footer-item
              link="groups"
              notActiveClass="icon-group-ic"
              activeClass="icon-group-ic-f active-footer-icon"
              type="icon"/>
          </div>
        </div>
      </div>

      <div
        @click="showAllMenu($event)"
        class="footer-vvv">
        <span><i :class="openMenu"></i></span>
      </div>
      <div class="footer-item">
        <in-footer-item
          link=""
          notActiveClass="icon-house"
          activeClass="icon-house-f active-footer-icon"
          type="icon"/>
      </div>
      <div class="footer-item">
        <in-footer-item
          link="search"
          notActiveClass="icon-search"
          activeClass="icon-search-f active-footer-icon"
          type="icon"/>

      </div>
      <div class="footer-item logo">
        <in-footer-item
          link="rating"
          notActiveClass="icon-logo"
          activeClass="icon-logo-f active-footer-icon"
          type="icon"/>
      </div>
      <div class="footer-item">
        <span class="feed-counts">{{feedsCount}}</span>
        <in-footer-item
          v-if="authUser.status !== 'guest'"
          link="feeds"
          notActiveClass="icon-heart"
          activeClass="icon-heart-f active-footer-icon"
          type="icon"/>
        <i
          v-else
          @click="showGuestNotification()"
          class="icon-heart"></i>
      </div>
      <div class="footer-item">
        <in-footer-item
          v-if="authUser && authUser.status !== 'guest'"
          :link="'u/' + authUser.nickname"
          notActiveClass="icon-human"
          type="icon"
          activeClass="icon-human-f active-footer-icon"/>
        <i
          v-else
          @click="showGuestNotification()"
          class="icon-human"></i>
      </div>

    </div>
  </footer>
</template>

<script>
  import axios from 'axios';
  import {mapActions, mapGetters} from 'vuex';
  import Vue from 'vue'

  import chatFooter from 'ComponentsVue/footer/chatFooter.vue'
  import newChatFooter from 'ComponentsVue/footer/newChatFooter.vue'
  import footerItem from 'ComponentsVue/footer/footerItem'
  import discussionFooter from 'ComponentsVue/footer/discussionFooter'

  import {moduleName as feedsModule, UNWATCHED_FEEDS, UNWATCHED_FEEDS_COUNT} from 'Store/modules/feeds';
  import {AUTH_USER, moduleName as userModule} from 'Store/modules/authUser/user';

  Vue.component('in-chat-footer', chatFooter);
  Vue.component('in-newchat-footer', newChatFooter);
  Vue.component('in-footer-item', footerItem);
  Vue.component('in-discussion-footer', discussionFooter);
  export default {
    name: 'Footer',
    data() {
      return {
        threadId: '',
        discussionId: '',
        footerTriple: false,
        discussion: {},
      }
    },
    computed: {
      ...mapGetters({
        unwatchedFeedsCount: feedsModule + UNWATCHED_FEEDS_COUNT,
        authUser: userModule + AUTH_USER
      }),
      feedsCount() {
        if (this.unwatchedFeedsCount === 0) {
          return '';
        } else if (this.unwatchedFeedsCount >= 100) {
          return '99+';
        } else {
          return this.unwatchedFeedsCount;
        }
      },
      chatsFooter: function () {
        if (this.$route.params.chat_id != null) {
          this.threadId = this.$route.params.chat_id;
          return true;
        }
      },
      addPostGroup: function () {
        if (this.$route.path.split('/')[1] !== 'new-post')
          return true;
        else
          return false;
      },
      newChatFooter: function () {
        if (this.$route.params.user_chat != null) {
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
      discussionFooter() {
        if (this.$route.params.discussion_slug != null) {
          let discussion_id = this.$route.params.discussion_slug;
          axios.get('v1/discussions/get?id=' + discussion_id)
            .then(res => {
              this.discussionId = res.data.id;
            });
          return true;
        }
      },
      openMenu: function () {
        if (this.footerTriple)
          return 'icon-vvv-2';
        else
          return 'icon-vvv';
      }

    },
    mounted() {
      this.unwatchedFeeds();
      this.$root.$on('hideFooterMenu', () => {
        if (this.footerTriple)
          this.footerTriple = !this.footerTriple;
        this.$refs.footerTp.style.height = '0px';
      });
    },
    methods: {
      ...mapActions({
        unwatchedFeeds: feedsModule + UNWATCHED_FEEDS
      }),
      showGuestNotification() {
        this.$notify({
          group: 'guest-template',
          duration: 3000,
          speed: 300,
        });
      },
      showAllMenu(e) {
        this.footerTriple = !this.footerTriple;
        if (this.footerTriple)
          this.$refs.footerTp.style.height = '38px';
        else
          this.$refs.footerTp.style.height = '0px';
      }
    },


  }

</script>

<style lang="less">
  @import '~LessStyle/registration.less';
  @import '~LessStyle/variables.less';

  footer {
    text-align: center;
    position: fixed;
    width: 100%;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.5);
    bottom: 0;
    margin: 0;
    left: 0;
    padding: 0 0;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    z-index: 11;
    flex-wrap: wrap;
  }

  #footer {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .chat-footer {
    width: 100%;

  }

  #sendMessage {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    box-sizing: border-box;
  }

  #sendMessage > label {
    color: @contest-list-text-color;
  }

  #sendMessage > .icon-send {
    color: #d3d3d3;
  }

  #sendMessage i {
    font-size: 30px;
  }

  .footer-item {
    width: 20%;
    text-align: center;
    font-size: 30px;
    color: #fff;
    position: relative;
  }

  .footer-item i {
    display: block;
  }

  .footer-item a {
    text-decoration: none;
  }

  #message-input {
    font-size: 15px;
    width: 75%;
    height: 40px;
    border: 1px solid #d3d3d3d3;
    border-radius: 5px;
  }

  input[type="file"] {
    display: none;
  }

  .downloadFile {
    position: relative;
  }

  .footer-vvv {
    position: absolute;
    top: -26px;
    background: rgba(0, 0, 0, 0.5);
    left: 42.7%;
    width: 14.2%;
    color: #fff;
    text-align: center;
    border-radius: 5px 5px 0 0;
    font-size: 26px;
    font-weight: 300;
    z-index: -1;
  }

  .footer-vvv span {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .footer-tp {
    width: 100%;
    transition: 0.3s linear;
    height: 0;
    overflow: hidden;
  }

  .footer-tp--item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .feed-counts {
    position: absolute;
    font-size: 14px;
    right: -14%;
    display: block;
    top: -4px;
    color: red;
    font-weight: 600;
    width: 47%;
    text-align: left;
  }

  .footer-item img {
    width: 30px;
    height: auto;
  }

  .active-footer-icon {
    .text-grad();
  }
</style>
