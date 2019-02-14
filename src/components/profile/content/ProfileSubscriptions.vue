<template>
  <div class="subscribers-container">
    <in-header-block class="header header-gradient">
      <div
        @click="goBack"
        class="header-back">
        <i class="icon-left-f"></i>
      </div>
      <div class="header-content">
        <span class="header-content-name">{{$lang.variables.subscriptions}}</span>
        <span class="header-content-count">{{subscriptionsCount}}</span>
      </div>
      <div class="header-count-menu">
        <i
          v-if="activeTab === 'subscriptions'"
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
      <in-tab name="subscriptions">
          <span class="tab-name">{{$lang.variables.subscriptions}}</span>
      </in-tab>
      <in-tab name="outgoingRequests">
          <span class="tab-name">{{$lang.variables.outgoingRequests}}</span>
          <!--TODO add outgoingRequests to user-->
          <!--<span-->
            <!--v-if="outgoingRequests.length > 0"-->
            <!--class="requests-count">({{outgoingRequests.length}})</span>-->
      </in-tab>
    </in-tabs>

    <in-search-block
      v-if="activeTab === 'subscriptions'"
      class="search">
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
        v-for="user in users"
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
                <!--v-if="activeTab === 'outgoingRequests'"-->
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
            <i
              v-if="activeTab === 'subscriptions'"
              class="icon-actions icon-vvv"
              @click="showSettings(user)"></i>
            <i
              v-if="activeTab === 'outgoingRequests'"
               class="icon-actions icon-delete"
               @click="deleteOutgoingRequest(user.id)"></i>
          </div>
        </div>
      </in-user-card>
    </div>
    <div v-else-if="!loading && user">{{$lang.variables.userPrivacyOn}}</div>

    <in-transition-component name="timeout">
      <in-settings-menu
        v-show="isActiveUser"
        class="settings-menu-block">
        <in-transition-component name="fade">
          <div
            v-if="isActiveUser"
            @click="closeSettings"
            class="settings-menu-block-bg"></div>
        </in-transition-component>
        <in-transition-component name="translateY">
          <div
            v-if="isActiveUser"
            class="settings-menu-block-container">
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
                @click="addToBlackList">{{$lang.variables.addToBlackList}}
              </div>
              <div
                v-if="authUser.id !== activeUser.id"
                class="settings-menu-block-item"
                :class="{'settings-menu-block-item-danger': activeUser.is_subscribed}"
                @click="changeSubscribe">{{activeUser.is_subscribed ? $lang.variables.unsubscribe : $lang.variables.subscribe}}
              </div>
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
  import {mapActions, mapGetters} from 'vuex'

  import {scrollOnBottom} from "../../../mixins/scrollOnBottom";
  import {
    CHANGE_SUBSCRIBE_POST_COUNT,
    moduleName as countPostOnPageModule,
    SUBSCRIBE_POST_COUNT
  } from 'Store/modules/countPostOnPage';
  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";
  import {
    CHANGE_SUBSCRIBE_USER,
    FETCH_USER,
    LOADING as USERS_LOADING,
    moduleName as usersModule,
    USER
  } from "Store/modules/users/users";
  import {
    FETCH_SUBSCRIPTIONS,
    FETCH_SUBSCRIPTIONS_NEXT_PAGE,
    LOADING as SUBSCRIPTIONS_LOADING,
    moduleName as subscriptionsModule,
    QUERY as SUBSCRIPTIONS_QUERY,
    SUBSCRIPTIONS
  } from "Store/modules/users/subscriptions";
  import {ADD_TO_BLACK_LIST, moduleName as blackListModule,} from "Store/modules/authUser/blackList";
  import {CHECK_CHAT, moduleName as chatsModule} from "Store/modules/chats/chats";
  import {
    moduleName as outgoingRequestsModule,
    OUTGOING_REQUESTS,
    LOADING as OUTGOING_REQUESTS_LOADING,
    FETCH_OUTGOING_REQUESTS,
    FETCH_OUTGOING_REQUESTS_NEXT_PAGE,
    DELETE_OUTGOING_REQUEST
  } from "Store/modules/authUser/outgoingRequests";

  export default {
    name: 'ProfileSubscriptions',
    mixins: [scrollOnBottom],
    data() {
      return {
        allOutgoingRequests: [],
        activeTab: 'subscriptions',
        nickname: this.$route.params.nickname,
        activeUser: {},
        isActiveUser: false
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
        subscriptionsLoading: subscriptionsModule + SUBSCRIPTIONS_LOADING,
        subscriptions: subscriptionsModule + SUBSCRIPTIONS,
        subscriptionsQuery: subscriptionsModule + SUBSCRIPTIONS_QUERY,
        fetchUserLoading: usersModule + USERS_LOADING,
        outgoingRequests: outgoingRequestsModule + OUTGOING_REQUESTS,
        outgoingRequestsLoading: outgoingRequestsModule + OUTGOING_REQUESTS_LOADING
      }),
      isSmallWidth() {
        return this.subscribePostCount === '4' && this.activeTab === 'subscriptions';
      },
      checkUserPrivacy() {
        console.log(this.authUser, this.user);
        return (this.authUser && this.authUser.nickname === this.nickname)
          || (this.user && (
            this.user.privacy_settings.subscriptions === 'all'
            || (this.user.privacy_settings.subscriptions === 'subs' && this.user.is_subscribed)));
      },
      searchInput() {
        if (this.activeTab === 'subscriptions') {
          return this.subscriptionsQuery(this.nickname)
        } else if (this.activeTab === 'outgoingRequests') {
          // return this.outgoingRequestsQuery
          return '';
        }
        return '';
      },
      users() {
        if (this.activeTab === 'subscriptions') {
          return this.subscriptions(this.nickname)
        } else if (this.activeTab === 'outgoingRequests') {
          return this.outgoingRequests
        }
        return [];
      },
      loading() {
        if (this.activeTab === 'subscriptions') {
          return this.subscriptionsLoading || this.fetchUserLoading
        } else if (this.activeTab === 'outgoingRequests') {
          return this.outgoingRequestsLoading || this.fetchUserLoading
        }
        return false;
      },
      user() {
        if (this.authUser && this.authUser.nickname === this.nickname) {
          return this.authUser
        } else {
          return this.userInfo(this.nickname)
        }
      },
      subscriptionsCount() {
        if (this.authUser && this.authUser.nickname === this.nickname) {
          return this.authUser.subscriptions_count;
        } else if (this.user) {
          return this.user.subscriptions_count;
        }
      },
      viewCount() {
        if (this.subscribePostCount === '1') {
          return 'icon-menu-4-1';
        } else {
          return 'icon-menu-4-1v2';
        }
      },
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
        if (!this.user) {
          this.fetchUser(this.nickname)
        }
        this.search();
      }
    },
    methods: {
      ...mapActions({
        changeSubscribePostCount: countPostOnPageModule + CHANGE_SUBSCRIBE_POST_COUNT,
        fetchSubscriptions: subscriptionsModule + FETCH_SUBSCRIPTIONS,
        fetchSubscriptionsNextPage: subscriptionsModule + FETCH_SUBSCRIPTIONS_NEXT_PAGE,
        addToBlackListAction: blackListModule + ADD_TO_BLACK_LIST,
        checkChat: chatsModule + CHECK_CHAT,
        changeSubscribeUser: usersModule + CHANGE_SUBSCRIBE_USER,
        fetchUser: usersModule + FETCH_USER,
        fetchOutgoingRequests: outgoingRequestsModule + FETCH_OUTGOING_REQUESTS,
        fetchOutgoingRequestsNextPage: outgoingRequestsModule + FETCH_OUTGOING_REQUESTS_NEXT_PAGE,
        deleteOutgoingRequest: outgoingRequestsModule + DELETE_OUTGOING_REQUEST
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

        if (this.activeTab === 'subscriptions') {
          this.fetchSubscriptions(payload);
        } else if (this.activeTab === 'outgoingRequests') {
          this.fetchOutgoingRequests();
        }
      },
      searchNext() {
        let payload = {
          nickname: this.nickname,
          query: this.searchInput
        };

        if (this.activeTab === 'subscriptions') {
          this.fetchSubscriptionsNextPage(payload);
        } else if (this.activeTab === 'outgoingRequests') {
          this.fetchOutgoingRequestsNextPage();
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
      changeSubscribe() {
        if(!this.$userStatus(this.authUser)) {
          return;
        }

        const payload = {
          nickname: this.activeUser.nickname,
          delete: this.activeUser.is_subscribed ? '1' : '0',
          userNickname: this.user.nickname,
          subscribeUser: this.activeUser,
          onSuccess: this.closeSettings,
          onRequest: this.onRequestSubscribe
        };

        this.changeSubscribeUser(payload);
      },
      onRequestSubscribe() {
        this.$notify({
          group: 'send-subscriber-request',
          duration: 3000,
          speed: 300,
        });
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

  #SpinnerOnloadImg {
    display: block;
    width: 35%;
    margin: auto;
  }
</style>
