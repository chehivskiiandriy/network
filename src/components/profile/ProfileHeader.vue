<template>
  <div class="profile-header">
    <div
      class="profile-header-bg"
      :style="{backgroundImage: `url(${user.avatar_image.url_medium})`}"></div>
    <div class="profile-header-bg-white"></div>

    <swiper
      ref="slider"
      :options="swiperOption">
      <swiper-slide>
        <div
          class="profile-header-slide"
          :class="{'off-page': offPage, 'profile-header-slide-small': isSmallSlide}">
          <div
            v-if="!offPage && (user.contest_entry || period)"
            class="profile-header-slide-left">
            <div
              v-if="period"
              class="profile-header-slide-left-item inrating-top">
              <i class="icon-TOP5-f"></i>
              <span>InRating top 5</span>
              <span>{{ratingHistoryTime}}</span>
            </div>
            <div
              v-if="user.contest_entry"
              class="profile-header-slide-left-item contest"
              @click="goToContest">
              <i class="icon-Kubok_konkurs-f"></i>
              <span>{{user.contest_entry_instance.name}}</span>
            </div>
          </div>

          <div class="profile-header-slide-bottom">
            <in-profile-info :user="user"/>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div
          class="profile-header-slide"
          :class="{'off-page': offPage, 'profile-header-slide-small': isSmallSlide}">
          <div
            class="profile-header-slide-bottom"
            :class="{'off-page': offPage}">
            <in-profile-official-rating v-if="offPage"/>
            <in-profile-rating-bar v-else :user="user"/>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div
          class="profile-header-slide"
          :class="{'off-page': offPage, 'profile-header-slide-small': isSmallSlide}">
          <div
            v-if="!offPage
            && (user.geo_id
              || (user.social_statuses && user.social_statuses.length > 0)
              || (user.activity_statuses && user.activity_statuses.length > 0)
              || user.family_status)"
            class="profile-header-slide-right">
            <div
              v-if="user.geo_id"
              class="div">
              {{user.geo_id.location}}
            </div>
            <div
              v-else
              class="not-selected">
              {{$lang.variables.notSelected}}
            </div>
            <div
              v-if="user.social_statuses && user.social_statuses.length > 0"
              class="div">
              {{user.social_statuses[0].value}}
            </div>
            <div
              v-else
              class="not-selected">
              {{$lang.variables.notSelected}}
            </div>
            <div
              v-if="user.activity_statuses && user.activity_statuses.length > 0"
              class="div">
              {{user.activity_statuses[0].value}}
            </div>
            <div
              v-else
              class="not-selected">
              {{$lang.variables.notSelected}}
            </div>
            <div
              v-if="user.family_status"
              class="div">
              <i :class="familyIcon"></i>
              <span>{{familyText}}</span>
            </div>
            <div
              v-else
              class="not-selected">
              {{$lang.variables.notSelected}}
            </div>
          </div>

          <div class="profile-header-slide-bottom">
            <in-profile-faq v-if="offPage" :user="user"/>
            <in-profile-rating v-else :user="user"/>
          </div>
        </div>
      </swiper-slide>
    </swiper>

    <in-profile-user-banner
      :user="user"
      :class="{'profile-user-banner-small': isSmallSlide}"/>
  </div>
</template>

<script>
  import moment from 'moment';
  import {mapGetters} from 'vuex'

  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";

  import Vue from 'vue'
  import ProfileInfo from './header/ProfileInfo.vue'
  import ProfileAvatar from './header/ProfileAvatar.vue'
  import ProfileRating from './header/ProfileRating.vue'
  import ProfileFAQ from './header/ProfileFAQ.vue'
  import ProfileUserBanner from './header/ProfileUserBanner';
  import ProfileOfficialRating from 'ComponentsVue/profile/header/ProfileOfficialRating.vue'
  import profileRatingBar from 'ComponentsVue/profile/header/ProfileRatingBar'

  Vue.component('in-profile-official-rating', ProfileOfficialRating);
  Vue.component('in-profile-info', ProfileInfo);
  Vue.component('in-profile-avatar', ProfileAvatar);
  Vue.component('in-profile-rating', ProfileRating);
  Vue.component('in-profile-faq', ProfileFAQ);
  Vue.component('in-profile-rating-bar', profileRatingBar);

  export default {
    name: 'ProfileHeader',
    props: {
      user: [Object, undefined]
    },
    components: {
      inProfileUserBanner: ProfileUserBanner
    },
    data() {
      return {
        offPage: false,
        swiperOption: {
          slidesPerView: 1,
          initialSlide: 1,
          followFinger: false
        },
        period: null
      }
    },
    watch: {
      '$route'(to, from) {
        if (to.path.includes('/u/') && from.path.includes('/u/')) {
          this.period = null;
          this.getUserHistoryRating();
        }
      },
      user() {
        this.offPage = this.user.off_page;
      }
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER,
      }),
      familyIcon() {
        switch (this.user.family_status) {
          case 'married':
            return 'family_status icon-weding';
          case 'in_relationship':
            return 'family_status icon-relationships';
          case 'single':
            return 'family_status icon-bez-paru';
          case 'in_search':
            return 'family_status icon-insearch';
          case 'in_active_search':
            return 'family_status icon-inRsearch';
          default :
            return 'family_status icon-inRsearch';
        }
      },
      familyText() {
        switch (this.user.family_status) {
          case 'married':
            return this.$lang.variables.married;
          case 'in_relationship':
            return this.$lang.variables.inRelations;
          case 'single':
            return this.$lang.variables.single;
          case 'in_search':
            return this.$lang.variables.inSearch;
          case 'in_active_search':
            return this.$lang.variables.inActiveSearchInRating;
          default :
            return this.$lang.variables.inActiveSearchInRating;
        }
      },
      ratingHistoryTime() {
        if(this.period) {
          return moment(this.period).format('MMMM YYYY')
        } else {
          return ''
        }
      },
      isSmallSlide() {
        return !this.user.personal_status && !this.offPage && (this.authUser.id !== this.user.id)
      }
    },
    mounted() {
      this.offPage = this.user.off_page;
      this.getUserHistoryRating();
    },
    methods: {
      goToContest() {
        this.$router.push(`/contest/${this.user.contest_entry_instance.slug}`);
      },
      async getUserHistoryRating() {
        try {
          const data = new FormData();
          data.append('user_id', this.user.id);

          const res = await this.$api.users.getRatingHistory(data);
          console.log(res.data.period);
          this.period = res.data.period;
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  .profile-header {
    position: relative;
    padding-top: 43px;
    overflow: hidden;
    flex-wrap: wrap;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100vw;

    &-bg {
      width: 100%;
      height: 100%;
      position: absolute;
      filter: blur(1em);
      top: 0;
      z-index: -1;
      overflow: hidden;
      background-size: cover;
      background-position: center;
    }

    &-bg-white {
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.4);
      position: absolute;
      top: 0;
      z-index: -1;
      overflow: hidden;
    }

    &-slide {
      width: 100vw;
      height: 58vw;
      position: relative;

      &-small {
        height: 50vw;
      }

      &.off-page {
        height: 65vw;
      }

      &-bottom {
        position: absolute;
        bottom: 0;
        width: 100vw;
        height: 8vw;
        background: #fff;
        padding: 5px 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;

        &.off-page {
          height: 20vw;
          padding: 0;
        }
      }

      &-left {
        position: absolute;
        left: 0;
        top: 10px;
        width: 30vw;
        height: 30vw;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        background: rgba(255, 255, 255, 0.5);
        padding: 0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-evenly;

        &-item {
          font-size: 3vw;
          display: flex;
          /*flex-wrap: wrap;*/
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;

          i {
            font-size: 4.7vw;
            padding-bottom: 2px;
            .text-grad();
          }
        }

        .div {
          width: 100%;
          font-size: 3.6vw;
          text-align: left;
          .truncate();
        }
      }

      &-right {
        position: absolute;
        right: 0;
        top: 10px;
        width: 30vw;
        height: 30vw;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        background: rgba(255, 255, 255, 0.5);
        padding: 4px 10px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-evenly;

        .div {
          width: 100%;
          font-size: 3.6vw;
          text-align: left;
          .truncate();
        }
      }
    }

    .not-selected {
      font-size: 3.6vw;
      color: @middle_grey;
    }

    .swiper-container {
      background: transparent !important;
    }
  }
</style>
