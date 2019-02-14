<template>
  <div class="profile-user-banner">
    <div
      class="profile-user-banner-container"
      :class="{'z-index': user.is_active_story}"
      @click="goToStory">
      <img
        class="profile-user-banner-preview"
        :class="storyUser"
        :src="userAvatar">
      <img
        v-if="user.active_gift"
        class="profile-user-banner-present"
        :src="user.active_gift.image">
      <div
        v-if="user.is_online && authUser.id !== user.id"
        class="online-block"></div>
    </div>
    <div class="profile-user-banner-name">
      {{user.name}} {{user.lastname}}
    </div>
    <div
      class="profile-user-banner-status"
      ref="status">
      <in-text-with-mentions
        v-if="user.personal_status"
        class="personal-status"
        :class="{'personal-status-short': isMore}"
        :text="user.personal_status"
        :linkStyles="linkStyles" />

      <router-link
        v-else-if="authUser.id === user.id"
        :class="{'z-index': !user.personal_status}"
        to="/setting/user">
        <span class="enter-status">{{$lang.variables.enterYourStatus}}</span>
      </router-link>

      <div
        v-if="isMore"
        class="more-info"
        @click="showStatusModal">{{$lang.variables.moreInfo}}
      </div>
    </div>

    <i
      v-if="authUser.status === 'admin' && user.id === authUser.id"
      @click="showInfo"
      class="icon-information "></i>

    <in-transition-component name="fade">
      <div v-show="show" class="profile-user-banner-modal">
        <div
          @click="cancel"
          class="profile-user-banner-modal-bg"></div>
        <transition name="scale">
          <div v-if="show" class="profile-user-banner-modal-container">
            <in-text-with-mentions
              v-if="user.personal_status"
              class="personal-status"
              :text="user.personal_status"/>
          </div>
        </transition>
      </div>
    </in-transition-component>

    <in-profile-user-info-modal
      :allformat="dataNormalFormat"
      :stat="dateStat"
      :info="allAdminStatistic"/>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";

  import ProfileUserInfoModal from 'ComponentsVue/profile/header/profileUserInfoModal'

  export default {
    name: "ProfileUserBanner",
    props: {
      user: [Object, undefined]
    },
    components: {
      inProfileUserInfoModal: ProfileUserInfoModal
    },
    data() {
      return {
        isMounted: false,
        show: false,
        allAdminStatistic: [],
        dateStat: [],
        dataNormalFormat: [],
        linkStyles: 'z-index: 100; position: relative'
      }
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER,
      }),
      storyUser() {
        return this.user.is_active_story
          ? this.user.is_story_seen
            ? 'profile-user-banner-preview-story-seen-true'
            : 'profile-user-banner-preview-story-seen-false'
          : ''
      },
      userAvatar() {
        return this.user.avatar_image ? this.user.avatar_image.url_medium : window.img.photoPlaceholder
      },
      isMore() {
        if (this.isMounted) {
          let statusBlock = this.$refs.status.querySelector('.personal-status');
          return statusBlock && (statusBlock.offsetWidth < statusBlock.scrollWidth)
        } else {
          return false
        }
      }
    },
    mounted() {
      this.isMounted = true;
    },
    methods: {
      goToStory() {
        if (this.user.is_active_story) {
          this.$router.push('/story/' + this.user.nickname)
        }
      },
      showStatusModal() {
        console.log('1111');
        this.show = true;

      },
      cancel() {
        this.show = false;
      },
      async showInfo() {
        if (this.authUser.status === 'admin') {
          const res = await this.$api.user.getAdminStatistic();

          this.allAdminStatistic = res.data;
          this.dateStat = Object.keys(this.allAdminStatistic);
          this.dataNormalFormat = this.dateStat.map((item) => {
            let allvariavles = item.split('-');
            return allvariavles[2] + '.' + allvariavles[1] + '.' + allvariavles[0];
          });
          this.$modal.show('profileUserModal');
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .profile-user-banner {
    position: absolute;
    top: 43px;
    width: 100vw;
    height: 50vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 2.5vw 0;
    box-sizing: border-box;
    color: #000;

    &-small {
      height: 42vw;
    }

    &-container {
      position: relative;

      .online-block {
        position: absolute;
        top: 5px;
        left: 5px;
        width: 7px;
        height: 7px;
        background: #00d000;
        border-radius: 3px;
        border: 2px solid #fff;
      }
    }

    &-preview {
      width: 30vw;
      border-radius: 10px;
      padding: 1px;
      vertical-align: middle;
      box-shadow: 0 0 15px rgba(0, 0, 0, .5);
      box-sizing: border-box;

      &-story-seen-true {
        border: 2px solid #d3d3d3;
        border-radius: 10px;
      }

      &-story-seen-false {
        border: 2px solid #5ac5c6;
        border-radius: 10px;
      }
    }

    &-present {
      position: absolute;
      opacity: .7;
      width: 25%;
      height: 25%;
      bottom: 7px;
      right: 7px;
      background-color: #fff;
      border-radius: 3px;
      padding: 1px;
      box-sizing: border-box;
    }

    &-name {
      padding-top: 5px;
      font-size: 4vw;

    }

    &-status {
      font-size: 3.6vw;
      padding-bottom: 5px;
      display: flex;
      align-items: center;
      justify-content: center;

      .personal-status {
        width: 100vw;
        box-sizing: border-box;
        .truncate();

        &-short {
          width: 90vw;
        }
      }

      .more-info {
        color: @contest-list-text-color;
        display: flex;
        align-items: center;
        margin-left: -1px;
        z-index: 100;
      }
    }

    .enter-status {
      color: #000;
    }

    .z-index {
      z-index: 100;
    }

    .scale-enter-active {
      animation: scale-in 0.2s ease-out forwards;
    }

    .scale-leave-active {
      animation: scale-out 0.1s ease-out forwards;
    }

    @keyframes scale-in {
      from {
        transform: scale(0.5);
      }
      to {
        transform: scale(1);
      }
    }

    @keyframes scale-out {
      from {
        transform: scale(1);
      }
      to {
        transform: scale(0.2);
      }
    }

    &-modal {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 12500;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: left;

      &-bg {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 12501;
      }

      &-container {
        background: #fff;
        border-radius: 5px;
        width: 90vw;
        padding: 15px;
        min-height: 20vh;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.3);
        z-index: 12502;
      }
    }

    .icon-information {
      position: absolute;
      right: 0;
      bottom: 0;
      padding: 4px;
      font-size: 16px;
      z-index: 100;
    }
  }
</style>
