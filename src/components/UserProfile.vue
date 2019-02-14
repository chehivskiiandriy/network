<template>
  <div id="profile-user">
    <template v-if="user && user.status !== 'banned_of'">
      <div
        v-if="authUser.nickname !== $route.params.nickname"
        :class="{'top-header-profile': $route.path.indexOf('/u/') !== -1 && top <= 25 }"
        :style="{backgroundColor: `rgba(0, 0, 0, ${top > 50 || $route.path.indexOf('/u/') === -1 ? '0.5' : (top / 100)}` }"
        class="top-header">
        <in-nickname class="header-user-nickname" icon-classes="header-user-nickname__official-icon" :status="user.status">{{$route.params.nickname}}</in-nickname>
        <i
          @click="close"
          class="icon-left-f icon-back"></i>
        <i
          @click="changeViewProfile()"
          :class="profileView"></i>
      </div>
      <in-profile-header :user="user"/>
      <div v-if="!user.off_page || authUser.id === user.id">
        <div
          class="profile-menu"
          v-if="authUser.id === user.id && authUser.status !== 'guest'">
          <div class="profile-menu--item">
            <in-profile-icon
              className="icon-scale"
              classNameActive="icon-scale-f"
              :user="user"
              fillType="statistics"/>
          </div>
          <div class="profile-menu--item">
            <in-profile-icon
              className="icon-gift"
              classNameActive="icon-gift-f"
              :user="user"
              fillType="gift"/>
            <span class="gift-count-profile">{{unwatchedGiftsCount}}</span>
          </div>
          <div class="profile-menu--item">
            <i
              v-if="authUser.status === 'validating'"
              @click="userValid()"
              class="icon-photo-camera"></i>
            <i
              @click="createPost"
              class="icon-photo-camera"></i>
          </div>
          <div class="profile-menu--item">
            <in-profile-icon
              className="icon-groups"
              classNameActive="icon-groups-f"
              :user="user"
              fillType="mention"/>
          </div>
          <div class="profile-menu--item">
            <in-profile-icon
              className="icon-bookmark"
              classNameActive="icon-bookmark-f"
              :user="user"
              fillType="bookmark"/>
          </div>
        </div>
        <div
          class="profile-menu"
          v-else-if="authUser.id !== user.id && authUser.status !== 'guest'">
          <div class="profile-menu--item">
            <i
              v-if="authUser.status !== 'no_chat_user'"
              @click="checkChats"
              class="icon-letter"></i>
            <i
              v-else
              @click="chatUserNotify()"
              class="icon-letter"></i>
          </div>
          <div class="profile-menu--item">
            <i
              v-if="authUser.status === 'validating'"
              @click="userValid()"
              class="icon-gift"></i>
            <i
              v-else
              @click="showPresentsModal()"
              class="icon-gift"></i>
          </div>
          <div
            class="profile-menu--item profile-rate"
            :class="rateAnimation">
            <i
              v-if="statusVoteUser"
              class="icon-logo-f"
              @click="voteUser"></i>
            <i
              v-else
              class="icon-logo"
              @click="voteUser"></i>
          </div>
          <div class="profile-menu--item">
            <i
              v-if="user.is_subscribed"
              class="icon-plus-guy-f"
              @click="changeSubscribe"></i>
            <i
              v-else
              class="icon-plus-guy"
              @click="changeSubscribe"></i>
          </div>
          <div class="profile-menu--item" @click="sendChinChin">
            <i
              v-if="user.is_chined"
              class="icon-chin-chin-f"></i>
            <i
              v-else
              class="icon-chin-chin"></i>
          </div>
        </div>
        <div
          class="profile-menu"
          v-else>
          <div class="profile-menu--item">
            <i
              @click="showRegistrationStep1()"
              class="icon-letter"></i>
          </div>
          <div class="profile-menu--item">
            <i
              @click="showRegistrationStep1()"
              class="icon-gift"></i>
          </div>
          <div class="profile-menu--item profile-rate">
            <i
              @click="showRegistrationStep1()"
              class="icon-logo"></i>
          </div>
          <div class="profile-menu--item">
            <i
              @click="showRegistrationStep1()"
              class="icon-plus-guy"></i>
          </div>
          <div class="profile-menu--item">
            <i
              @click="showRegistrationStep1()"
              class="icon-chin-chin"></i>
          </div>
        </div>
        <in-family-status-change-profile
          :familyStatus="user.family_status"
          :authUserId="authUser.id"
          :userId="user.id">
        </in-family-status-change-profile>

        <in-file-input
          ref="fileInput"
          :addLoading="true"
          :multiple="true"/>
      </div>
      <in-profile-story-albums
        v-if="isPostsOrStoryArchive"
        :class="profileStoryAlbumsClasses"
        :albums="storyAlbumsForGallery"
        :show-add-button="isProfileOfAuthorizedUser && hasArchivedStories"
        :nickname="nickname"
        :is-loading="isStoryAlbumsLoading"/>
      <router-view/>
    </template>
    <template v-if="isUserExistError || user.status === 'banned_of'">
      <p>Данный пользователь не существует</p>
    </template>
    <in-spinner-bg :loading="loadingFiles"></in-spinner-bg>
    <in-spinner :loading="loading"></in-spinner>

    <in-wallet-presents-user-modal
      v-if="isShowPresentsModal"
      @hide-present-modal="hidePresentsModal"/>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapActions, mapGetters, mapMutations} from 'vuex'

  import ProfileHeader from './profile/ProfileHeader.vue';
  import ProfileStoryAlbums from 'ComponentsVue/profile/ProfileStoryAlbums';
  import PostToggle from 'ComponentsVue/profile/menu/ProfileToggle';
  import changeFamilyStatusProfile from 'ComponentsVue/profile/modal/profileChangeFamilyStatus';
  import WalletPresentsUserModal from 'ComponentsVue/wallet/WalletPresentsUserModal';

  import {
    CHANGE_PROFILE_POST_COUNT,
    moduleName as countPostOnPageModule,
    PROFILE_POST_COUNT
  } from 'Store/modules/countPostOnPage';

  import {
    CHANGE_SUBSCRIBE_USER,
    FETCH_USER,
    LOADING,
    moduleName as usersModule,
    SEND_CHIN_CHIN,
    USER,
    USER_ERROR,
    VOTE_USER
  } from "Store/modules/users/users";

  import {
    FETCH_USER_STORY_ALBUMS,
    IS_HAVE_TO_SHOW_STORY_ALBUMS_LOADING_SPINNER,
    GET_USER_STORY_ALBUMS_BY_NICKNAME,
    moduleName as userStoryAlbumsModule,
  } from 'Store/modules/users/userStoryAlbums';
  import {
    FETCH_USER_ARCHIVED_STORIES,
    HAS_ARCHIVED_STORIES,
    moduleName as userArchivedStoriesModule,
  } from 'Store/modules/users/userArchivedStories';

  import {moduleName as feedsModule, UNWATCHED_GIFTS_COUNT} from "Store/modules/feeds";
  import {AUTH_USER, FETCH_CURRENT_USER, moduleName as userModule} from "Store/modules/authUser/user";
  import {moduleName as newPostNodule, LOADING_FILES} from "Store/modules/newPost";
  import {moduleName as walletModule, CHANGE_SELECTED_USER} from "Store/modules/wallet";

  Vue.component('in-profile-icon', PostToggle);
  Vue.component('in-family-status-change-profile', changeFamilyStatusProfile);
  Vue.component('in-profile-header', ProfileHeader);

  export default {
    name: 'user-profile',
    components: {
      inProfileStoryAlbums: ProfileStoryAlbums,
      inWalletPresentsUserModal: WalletPresentsUserModal
    },
    data() {
      return {
        animateRating: false,
        nickname: this.$route.params.nickname,
        statusVote: false,
        voteChanged: false,
        top: false,
        isShowPresentsModal: false
      }
    },
    computed: {
      ...mapGetters({
        profilePostCount: countPostOnPageModule + PROFILE_POST_COUNT,
        authUser: userModule + AUTH_USER,
        userInfo: usersModule + USER,
        errorInfo: usersModule + USER_ERROR,
        getStoryAlbumsByNickname: userStoryAlbumsModule + GET_USER_STORY_ALBUMS_BY_NICKNAME,
        getIsStoryAlbumsLoading: userStoryAlbumsModule + IS_HAVE_TO_SHOW_STORY_ALBUMS_LOADING_SPINNER,
        unwatchedGiftsCountInfo: feedsModule + UNWATCHED_GIFTS_COUNT,
        loading: usersModule + LOADING,
        loadingFiles: newPostNodule + LOADING_FILES,
        hasArchivedStories: userArchivedStoriesModule + HAS_ARCHIVED_STORIES,
      }),
      profileStoryAlbumsClasses() {
        return {
          'profile-user__story-albums': true,
          'profile-user__story-albums_other-user': !this.isProfileOfAuthorizedUser,
        }
      },
      isProfileOfAuthorizedUser() {
        return this.authUser && this.authUser.nickname === this.nickname;
      },
      user() {
        return this.isProfileOfAuthorizedUser ? this.authUser : this.userInfo(this.nickname);
      },
      unwatchedGiftsCount() {
        return this.unwatchedGiftsCountInfo === 0 ? '' : this.unwatchedGiftsCountInfo;
      },
      isUserExistError() {
        return !!this.errorInfo
        // && this.errorInfo.data.details.nickname
        // && this.errorInfo.data.details.nickname[0] === "The selected nickname is invalid."
      },
      isAnimateRate() {
        return this.animateRating && this.statusVoteUser && this.activePremium;
      },
      rateAnimation() {
        if (this.isAnimateRate) {
          if (this.authUser.active_gift.id === 41) {
            return 'rate-animation-41'
          } else if (this.authUser.active_gift.id === 42) {
            return 'rate-animation-42'
          } else {
            return ''
          }
        } else {
          return '';
        }
      },
      activePremium() {
        return this.authUser.active_gift && (this.authUser.active_gift.id === 41 || this.authUser.active_gift.id === 42);
      },
      profileView: function () {
        if (this.profilePostCount === '4')
          return 'icon-menu icon-menu-16';
        else if (this.profilePostCount === '2')
          return 'icon-menu icon-menu-4';
        else
          return 'icon-menu icon-menu-1';
      },
      statusVoteUser() {
        if (this.voteChanged) {
          return this.statusVote
        } else {
          return this.user ? this.user.is_voted : false
        }
      },
      storyAlbums() {
        return this.nickname && this.getStoryAlbumsByNickname(this.nickname);
      },
      storyAlbumsForGallery() {
        return this.storyAlbums && this.storyAlbums
          .filter(album => album.posts.length > 0)
          .map(album => ({
            previewSource: album.cover.url_small,
            albumId: album.id,
            title: album.title,
          }));
      },
      isStoryAlbumsLoading() {
        return this.getIsStoryAlbumsLoading(this.nickname);
      },
      isPostsOrStoryArchive() {
        return ['post', 'stories'].indexOf(this.$route.meta.type) !== -1;
      }
    },
    watch: {
      '$route'(to, from) {
        if (to.path.split('/')[2] !== from.path.split('/')[2]) {
          this.nickname = this.$route.params.nickname;
          this.fetchUserLazy();
          this.setTitle();
        }
      },
      user(value) {
        this.statusVote = value ? value.is_voted : false;
      }
    },
    created() {
      window.addEventListener('scroll', this.handleTopVisible)
    },
    mounted() {
      this.fetchUserLazy();
      this.setTitle();
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleTopVisible);
    },
    methods: {
      ...mapActions({
        changeProfilePostCount: countPostOnPageModule + CHANGE_PROFILE_POST_COUNT,
        fetchUser: usersModule + FETCH_USER,
        fetchCurrentUser: userModule + FETCH_CURRENT_USER,
        fetchUserStoryAlbums: userStoryAlbumsModule + FETCH_USER_STORY_ALBUMS,
        changeSubscribeUser: usersModule + CHANGE_SUBSCRIBE_USER,
        voteUserAction: usersModule + VOTE_USER,
        sendChinChinAction: usersModule + SEND_CHIN_CHIN,
        fetchUserArchivedStories: userArchivedStoriesModule + FETCH_USER_ARCHIVED_STORIES,
      }),
      ...mapMutations({
        changeSelectedUser: walletModule + CHANGE_SELECTED_USER
      }),
      handleTopVisible() {
        this.top = this.topVisible()
      },
      topVisible() {
        return document.body.scrollTop || document.documentElement.scrollTop
      },
      createPost() {
        if (this.$userStatus(this.authUser)) {
          this.$refs.fileInput.emitClick();
        }
      },
      fetchUserLazy() {
        if (this.user) {
          setTimeout(() => {
            this.fetch();
          }, 0);
        } else {
          this.fetch();
        }
      },
      fetch() {
        if (this.isProfileOfAuthorizedUser) {
          this.fetchCurrentUser();
        } else {
          this.fetchUser(this.nickname);
        }
        this.fetchUserArchivedStories();
        this.nickname && this.fetchUserStoryAlbums({nickname: this.nickname});
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
      },
      close() {
        this.$router.go(-1);
      },
      setTitle() {
        document.title = this.nickname;
      },
      showRegistrationStep1() {
        this.$notify({
          group: 'guest-template',
          duration: 3000,
          speed: 300,
        });
      },
      checkChats() {
        switch (this.user.privacy_settings.chat) {
          case 'all' :
            this.createChat();
            break;
          case 'subs':
            if (this.user.is_subscribed)
              this.createChat();
            else {
              this.$notify({
                group: 'chat-privacy-subscribe',
                duration: 3000,
                speed: 300,
              });
            }
            break;
          case 'none':
            this.$notify({
              group: 'chat-privacy-none',
              duration: 3000,
              speed: 300,
            });
            break;
        }
      },
      async createChat() {
        const data = new FormData();
        data.append('id', this.user.id);

        let res = await this.$api.user.checkChat(data);

        if (res.data.state) {
          this.$router.push('/messages/' + res.data.id);
        } else {
          this.$router.push('/new-chat/' + this.user.id);
        }
      },
      sendChinChin() {
        const payload = {
          nickname: this.user.nickname,
          onSuccess: this.onSuccessSendChinChin,
        };

        this.sendChinChinAction(payload);
      },
      onSuccessSendChinChin(res) {
        let title = '';
        if (res.state) {
          title = this.$lang.variables.chinChinWasSend;
        } else {
          title = `${this.$lang.variables.alreadySendChin} ${res.next_chin_remain_time.i} ${this.$lang.profile.minutes}`;
        }

        this.$notify({
          group: 'chin-chin',
          title: title,
        });
      },
      showPresentsModal() {
        this.changeSelectedUser({...this.user});
        this.isShowPresentsModal = true;
      },
      hidePresentsModal() {
        this.isShowPresentsModal = false;
      },
      changeSubscribe() {
        const payload = {
          nickname: this.user.nickname,
          delete: this.user.is_subscribed ? '1' : '0',
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
      voteUser() {
        if (this.$userStatus(this.authUser)) {
          const payload = {
            nickname: this.user.nickname,
            onSuccess: this.onSuccessVoteUser,
            onFail: this.onFailVoteUser
          };
          this.statusVote = true;
          this.voteChanged = true;

          if (!this.user.is_voted) {
            this.animateRating = true;
          }

          this.voteUserAction(payload);
        }
      },
      onSuccessVoteUser(res) {
        if (res.state) {
          this.$notify({
            group: 'add-rait',
            duration: 3000,
            speed: 300,
          });
        } else {
          const {h, i, s} = res.next_vote_remain_time;
          this.animateRating = false;
          if (h) {
            this.$notify({
              group: 'cant-add-rait',
              duration: 3000,
              speed: 300,
              text: this.$lang.notifications.rate_in + ' ' + h + ' ' + this.$lang.notifications.hours
            });
          } else if (i) {
            this.$notify({
              group: 'cant-add-rait',
              duration: 3000,
              speed: 300,
              text: this.$lang.notifications.rate_in + ' ' + i + ' ' + this.$lang.notifications.minutes
            });
          } else {
            this.$notify({
              group: 'cant-add-rait',
              duration: 3000,
              speed: 300,
              text: this.$lang.notifications.rate_in + ' ' + s + ' ' + this.$lang.notifications.seconds
            });
          }
        }
      },
      onFailVoteUser(error) {
        this.statusVote = false;

        if (error.response.data.errorInfo.errorCode === 1000) {
          this.$modal.show('bannedUserAvatarModal');
        }
      },
      chatUserNotify() {
        this.$notify({
          group: 'nophone',
          duration: 3000,
          speed: 300,
        });
      },
      userValid() {
        this.$notify({
          group: 'validating-template',
          duration: 3000,
          speed: 300,
        });
      },
    },
    head: {
      title() {
        return {
          inner: this.titleUser
        }
      },
    }
  }
</script>

<style lang="less">
  @import "~LessStyle/variables.less";

  body {
    margin: 0;
  }

  #app {
    text-align: center;

  }

  .rate-animation-41 {
    animation: rate41 0.7s ease-out forwards;
  }

  .rate-animation-42 {
    animation: rate42 1s ease-out forwards;
  }

  @keyframes rate41 {
    0% {
      transform: scale(0);
    }
    10% {
      transform: scale(0.5);
    }
    25% {
      transform: scale(1.5);
    }
    50% {
      transform: scale(1.2);
    }
    75% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes rate42 {
    0% {
      transform: scale(0);
    }
    10% {
      transform: scale(0.5);
    }
    25% {
      transform: scale(1.5);
    }
    40% {
      transform: scale(1.2);
    }
    55% {
      transform: scale(1.5);
    }
    70% {
      transform: scale(1.2);
    }
    85% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }

  #profile-user {
    /*position: relative;*/
    margin-top: -43px;
  }

  .icon-menu {
    color: @white;
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    font-size: 26px;
  }

  .icon-menu-16 {
    font-size: 27px;
  }

  .top-header {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);

    .header-user-nickname {
      transition: all 0.5s ease-out;
    }

    &-profile {
      i {
        color: #000000;
      }

      .header-user-nickname {
        color: #000000;
      }
    }
  }

  .header-user-nickname {
    color: @white;
  }

  .icon-back {
    position: absolute;
    top: 10px;
    left: 8px;
    color: #fff;
    font-size: 22px;
  }

  .profile-menu {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    margin: 0;
    font-size: 29px;
    align-items: center;
  }

  .profile-menu--item {
    position: relative;
    .text-grad();
  }

  .icon-photo-camera {
    font-size: 45px;
  }

  .profile-rate {
    z-index: 110;
    > .icon-logo-f {
      font-size: 45px;
      z-index: 110;
      position: relative;
      .text-grad();
    }
    > .icon-logo {
      font-size: 45px;
      z-index: 110;
      position: relative;
      .text-grad();
    }
  }

  .gift-count-profile {
    position: absolute;
    top: -4px;
    font-size: 13px;
    right: -8px;
    -webkit-text-fill-color: #f00;
  }

  .profile-menu--icon {
    .text-grad();
    /*
    background: linear-gradient(to left top, #000fbc, #30c2be 50%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    */
  }

  .profile-user__story-albums {
    margin: 0;
    padding-top: 2vw;
    border-top: 1px solid #ccc;
  }

  .profile-user__story-albums_other-user {
    margin-bottom: 10px;
  }

  .header-user-nickname__official-icon {
    margin-left: 0.8em;
  }
</style>
