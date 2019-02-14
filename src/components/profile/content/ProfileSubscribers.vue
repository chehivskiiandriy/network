<template>
  <div class="subscribers-container">
    <in-header-block class="header header-gradient">
      <div
        @click="goBack"
        class="header-back">
        <i class="icon-left-f"></i>
      </div>
      <div class="header-content">
        <span class="header-content-name">{{$lang.variables.subscribers}}</span>
        <span class="header-content-count">{{subscribersCount}}</span>
      </div>
      <div class="header-count-menu">
        <i
          v-if="activeTab === 'subscribers'"
          @click="changeView"
          :class="viewCount"></i>
        <div
          v-else
          class="empty-block"></div>
      </div>
    </in-header-block>

    <in-tabs
      v-if="authUser.nickname === nickname"
      :active-tab="activeTab" @update:active-tab="changeTab">
      <in-tab name="subscribers">
          <span class="tab-name">{{$lang.variables.subscribers}}</span>
      </in-tab>
      <in-tab name="requests">
          <span class="tab-name">{{$lang.variables.requests}}</span>
          <span
            v-if="authUser.subscribe_requests_count > 0"
            class="requests-count">({{authUser.subscribe_requests_count}})</span>
      </in-tab>
      <in-tab name="blackList">
          <span class="tab-name">{{$lang.variables.blackList}}</span>
      </in-tab>
    </in-tabs>

    <in-search-block class="search">
      <div class="search-icon">
        <i class="icon-search"></i>
      </div>
      <div class="search-input-block">
        <input
          type="text"
          @input="search"
          :value="searchInput"
          :placeholder="$lang.variables.searchByNameOrNickname"
          class="search-input-field">
      </div>
    </in-search-block>

    <div
      v-if="checkUserPrivacy"
      class="users-card"
      :class="{'users-card-small': isSmallWidth}">
      <in-user-card
        v-for="(user, index) in users"
        :key="user.id">
        <div :class="[isSmallWidth ? 'user-card-small' : 'user-card']">
          <div :class="[isSmallWidth ? 'user-card-avatar-small' : 'user-card-avatar']">
            <img
              class="user-card-avatar-preview"
              :src="user.avatar_image.url_medium"
              @click="userAction(user)">
          </div>
          <div
            v-if="!isSmallWidth"
            class="user-card-info">
            <div class="user-card-info-container">
              <in-nickname tag="p" class="user-card-nickname" :status="user.status">{{user.nickname}}</in-nickname>
              <!--<div-->
                <!--v-if="activeTab === 'requests'"-->
                <!--class="request-time">-->
                <!--<div>Отправил(ла) заявку</div>-->
                <!--<in-time :time="user.created_at_timestamp"/>-->
              <!--</div>-->
              <p class="user-card-name">
                <span v-text="user.name"></span>
                <span v-text="user.lastname"></span>
              </p>
            </div>
          </div>
          <div
            v-if="!isSmallWidth"
            class="user-card-actions">
            <i v-if="activeTab === 'subscribers'" class="icon-actions icon-vvv" @click="showSettings(user)"></i>
            <i v-if="activeTab === 'requests'" class="icon-actions icon-check"
               @click="approveUserAction(user.id, 1, index)"></i>
            <i v-if="activeTab === 'requests'" class="icon-actions icon-delete"
               @click="approveUserAction(user.id, 0, index)"></i>
            <i v-if="activeTab === 'blackList'" class="icon-actions icon-delete"
               @click="deleteFromBlackList(user.id)"></i>
          </div>
        </div>
      </in-user-card>
    </div>
    <div v-else-if="!loading && user">{{$lang.variables.userPrivacyOn}}</div>

    <in-bottom-button v-if="activeTab === 'blackList'">
      <div
        @click="goToAddBlackList"
        class="bottom-button">{{$lang.variables.addToBlackList}}</div>
    </in-bottom-button>

    <in-transition-component name="timeout">
      <in-settings-menu
        v-show="isActiveUser"
        @click="closeSettings"
        class="settings-menu-block">
        <in-transition-component name="fade">
          <div
            v-if="isActiveUser"
            @click="closeSettings"
            class="settings-menu-block-bg"></div>
        </in-transition-component>
        <in-transition-component name="translateY">
          <div v-if="isActiveUser" class="settings-menu-block-container">
            <div class="settings-menu-block-section settings-menu-block-top">
              <in-user-card>
                <div class="user-card user-card-settings">
                  <div class="user-card-avatar">
                    <img
                      class="user-card-avatar-preview"
                      :src="activeUser.avatar_image.url_medium"
                      @click="goToUser(activeUser.nickname)">
                  </div>
                  <div class="user-card-info">
                    <div class="user-card-info-container">
                      <in-nickname
                        tag="p"
                        @click.native="goToUser(activeUser.nickname)"
                        class="user-card-nickname"
                        :status="activeUser.status">
                        {{activeUser.nickname}}
                      </in-nickname>
                      <p class="user-card-name">
                        <span v-text="activeUser.name"></span>
                        <span v-text="activeUser.lastname"></span>
                      </p>
                    </div>
                  </div>
                </div>
              </in-user-card>
            </div>
            <div class="settings-menu-block-section settings-menu-block-center">
              <div
                class="settings-menu-block-item"
                @click="goToUser(activeUser.nickname)">{{$lang.variables.goToProfile}}</div>
              <div
                v-if="authUser.id !== activeUser.id"
                class="settings-menu-block-item"
                @click="goToChat(activeUser.id)">{{$lang.variables.writeToChat}}</div>
              <div
                v-if="authUser.id !== activeUser.id"
                class="settings-menu-block-item"
                @click="addToBlackList">{{$lang.variables.addToBlackList}}</div>
            </div>
            <div class="settings-menu-block-section settings-menu-block-bottom">
              <div
                @click="closeSettings"
                class="settings-menu-block-item">{{$lang.variables.cancel}}</div>
            </div>
          </div>
        </in-transition-component>
      </in-settings-menu>
    </in-transition-component>

    <in-spinner :loading="loading"/>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {mapActions, mapGetters} from 'vuex'

  import {scrollOnBottom} from "../../../mixins/scrollOnBottom";
  import Time from 'ComponentsVue/main/postfooter/comments/Time.vue'
  import {
    CHANGE_SUBSCRIBE_POST_COUNT,
    moduleName as countPostOnPageModule,
    SUBSCRIBE_POST_COUNT
  } from 'Store/modules/countPostOnPage';
  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";
  import {FETCH_USER, moduleName as usersModule, USER} from "Store/modules/users/users";
  import {
    FETCH_SUBSCRIBERS,
    FETCH_SUBSCRIBERS_NEXT_PAGE,
    LOADING as SUBSCRIBERS_LOADING,
    moduleName as subscribersModule,
    QUERY as SUBSCRIBERS_QUERY,
    SUBSCRIBERS
  } from "Store/modules/users/subscribers";
  import {
    ADD_TO_BLACK_LIST,
    BLACK_LIST,
    DELETE_FROM_BLACKLIST,
    FETCH_BLACK_LIST,
    FETCH_BLACK_LIST_NEXT_PAGE,
    LOADING as BLACK_LIST_LOADING,
    moduleName as blackListModule,
    QUERY as BLACK_LIST_QUERY
  } from "Store/modules/authUser/blackList";
  import {
    APPROVE_USER,
    FETCH_REQUESTS,
    FETCH_REQUESTS_NEXT_PAGE,
    LOADING as REQUESTS_LOADING,
    moduleName as requestsModule,
    QUERY as REQUESTS_QUERY,
    REQUESTS
  } from "Store/modules/authUser/requests";
  import {CHECK_CHAT, moduleName as chatsModule} from "Store/modules/chats/chats";

  Vue.component('in-time', Time);
  export default {
    name: 'ProfileSubscribers',
    mixins: [scrollOnBottom],
    data() {
      return {
        allRequests: [],
        activeTab: 'subscribers',
        nickname: this.$route.params.nickname,
        activeUser: {},
        isActiveUser: false,
        scrollTop: 0
      }
    },
    watch: {
      bottom(bottom) {
        if (bottom) {
          this.searchNext();
        }
      },
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER,
        userInfo: usersModule + USER,
        subscribePostCount: countPostOnPageModule + SUBSCRIBE_POST_COUNT,
        subscribersLoading: subscribersModule + SUBSCRIBERS_LOADING,
        subscribers: subscribersModule + SUBSCRIBERS,
        subscribersQuery: subscribersModule + SUBSCRIBERS_QUERY,
        blackListLoading: blackListModule + BLACK_LIST_LOADING,
        blackList: blackListModule + BLACK_LIST,
        blackListQuery: blackListModule + BLACK_LIST_QUERY,
        requests: requestsModule + REQUESTS,
        requestsQuery: requestsModule + REQUESTS_QUERY,
        requestsLoading: requestsModule + REQUESTS_LOADING
      }),
      isSmallWidth() {
        return this.subscribePostCount === '4' && this.activeTab === 'subscribers';
      },
      checkUserPrivacy() {
        return (this.authUser && this.authUser.nickname === this.nickname)
          || (this.user && (
            this.user.privacy_settings.subscribers === 'all'
            || (this.user.privacy_settings.subscribers === 'subs' && this.user.is_subscribed)));
      },
      searchInput() {
        if (this.activeTab === 'subscribers') {
          return this.subscribersQuery(this.nickname)
        } else if (this.activeTab === 'blackList') {
          return this.blackListQuery
        } else if (this.activeTab === 'requests') {
          return this.requestsQuery
        }
        return '';
      },
      users() {
        if (this.activeTab === 'subscribers') {
          return this.subscribers(this.nickname)
        } else if (this.activeTab === 'blackList') {
          return this.blackList
        } else if (this.activeTab === 'requests') {
          return this.requests
        }
        return [];
      },
      loading() {
        if (this.activeTab === 'subscribers') {
          return this.subscribersLoading
        } else if (this.activeTab === 'blackList') {
          return this.blackListLoading
        } else if (this.activeTab === 'requests') {
          return this.requestsLoading
        }
        return false;
      },
      user() {
        return this.userInfo(this.nickname)
      },
      subscribersCount() {
        if (this.authUser && this.authUser.nickname === this.nickname) {
          return this.authUser.subscribers_count;
        } else if (this.user) {
          return this.user.subscribers_count;
        }
      },
      viewCount() {
        if (this.subscribePostCount === '1') {
          return 'icon-menu-4-1';
        } else {
          return 'icon-menu-4-1v2';
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        console.log(from);
        if (from.path === '/setting') {
          vm.changeTab('blackList');
        }

        console.log('ffds');
        next()
      });
    },
    beforeDestroy() {
      if(this.isActiveUser) {
        this.closeSettings();
      }
    },
    mounted() {
      if (this.nickname === 'Miha') {
        this.$router.push('/u/Miha');
      }
      else {
        if(!this.user) {
          this.fetchUser(this.nickname)
        }
        this.search();
      }
    },
    methods: {
      ...mapActions({
        changeSubscribePostCount: countPostOnPageModule + CHANGE_SUBSCRIBE_POST_COUNT,
        fetchSubscribers: subscribersModule + FETCH_SUBSCRIBERS,
        fetchSubscribersNextPage: subscribersModule + FETCH_SUBSCRIBERS_NEXT_PAGE,
        fetchBlackList: blackListModule + FETCH_BLACK_LIST,
        fetchBlackListNextPage: blackListModule + FETCH_BLACK_LIST_NEXT_PAGE,
        addToBlackListAction: blackListModule + ADD_TO_BLACK_LIST,
        deleteFromBlackListAction: blackListModule + DELETE_FROM_BLACKLIST,
        checkChat: chatsModule + CHECK_CHAT,
        fetchUser: usersModule + FETCH_USER,
        fetchRequests: requestsModule + FETCH_REQUESTS,
        fetchRequestsNextPage: requestsModule + FETCH_REQUESTS_NEXT_PAGE,
        approveUser: requestsModule + APPROVE_USER
      }),
      addToBlackList() {
        if(!this.$userStatus(this.authUser)) {
          return;
        }
        
        let payload = {
          user: this.activeUser,
          onSuccess: this.onSuccessAddToBlackList
        };

        this.addToBlackListAction(payload);
      },
      onSuccessAddToBlackList() {
        this.closeSettings();
      },
      goToAddBlackList() {
        this.$router.push('/add-to-black-list');
      },
      deleteFromBlackList(id) {
        this.deleteFromBlackListAction([id]);
      },
      goToChat(id) {
        if(!this.$userStatus(this.authUser)) {
          return;
        }

        if (this.authUser.id !== id) {
          const payload = {
            id,
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
      showSettings(user) {
        this.activeUser = user;
        this.isActiveUser = true;

        this.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        document.getElementsByTagName('body')[0].style.top = -this.scrollTop + 'px';
        document.getElementsByTagName('body')[0].style.width = '100%';
        document.getElementsByTagName('body')[0].style.position = 'fixed';
      },
      closeSettings() {
        document.getElementsByTagName('body')[0].style.removeProperty('top');
        document.getElementsByTagName('body')[0].style.removeProperty('position');
        document.getElementsByTagName('body')[0].style.removeProperty('width');
        document.body.scrollTop = this.scrollTop;
        document.documentElement.scrollTop = this.scrollTop;

        this.isActiveUser = false;
        this.activeUser = {};
      },
      userAction(user) {
        if (this.subscribePostCount === '1') {
          this.goToUser(user.nickname)
        } else {
          this.showSettings(user);
        }
      },
      search(event) {
        let payload = {
          nickname: this.nickname,
          query: event ? event.target.value : (this.searchInput ? this.searchInput : '')
        };

        if (this.activeTab === 'subscribers') {
          this.fetchSubscribers(payload);
        } else if (this.activeTab === 'blackList') {
          this.fetchBlackList(payload);
        } else if (this.activeTab === 'requests') {
          this.fetchRequests(payload);
        }
      },
      searchNext() {
        let payload = {
          nickname: this.nickname,
          query: this.searchInput
        };

        if (this.activeTab === 'subscribers') {
          this.fetchSubscribersNextPage(payload);
        } else if (this.activeTab === 'blackList') {
          this.fetchBlackListNextPage(payload);
        } else if (this.activeTab === 'requests') {
          this.fetchRequestsNextPage(payload);
        }
      },
      goBack() {
        this.$router.go(-1);
      },
      goToUser(nickname) {
        this.$router.push('/u/' + nickname);
      },
      changeTab(type) {
        this.activeTab = type;
        this.search();
      },
      approveUserAction(id, approve, index) {
        const payload = {
          id: id,
          approve,
          index
        };

        this.approveUser(payload);
      },
      changeView() {
        if (this.subscribePostCount === '1') {
          this.changeSubscribePostCount('4');
        }
        else {
          this.changeSubscribePostCount('1');
        }
      }
    }
  }
</script>
<style lang="less">
  .users-card {
    display: flex;
    flex-wrap: wrap;
    padding-top: 2px;
    margin: 0 5px;

    &-small {
      margin: 0 2px;
    }
  }

  @import '~LessStyle/userCabinet.less';

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .user-nickname {
    color: #585151;
  }
</style>
