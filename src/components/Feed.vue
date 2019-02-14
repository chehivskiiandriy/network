<template>
  <div class="feeds-container">
    <template v-if="feeds">
      <div v-for="feed in feeds">
        <in-feed
          :key="feed.id"
          :feed="feed"
          :authUser="authUser"></in-feed>
      </div>
    </template>
    <in-spinner :loading="loading"/>

    <transition name="fade">
      <div v-if="isShowFilters" class="filters-bg" @click="hideFilters"></div>
    </transition>
    <transition name="translateX">
      <div v-if="isShowFilters" class="close-filters" @click="hideFilters">
        <i class="icon-delete-f"></i>
      </div>
    </transition>
    <transition name="translateX">
      <div v-if="isShowFilters" class="filters">
        <p class="filters-title">{{$lang.variables.Show}}</p>
        <div
          v-for="filter in filters"
          class="filter-item"
          @click="changeFilters(filter.name)">
          <div class="filter-check">
            <i v-if="activeFilters.indexOf(filter.name) !== -1" class="icon-check-f"></i>
          </div>
          <div class="filter-name">{{filter.value}}</div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  import {mapActions, mapGetters} from 'vuex';
  import FeedItem from './feed/FeedItem.vue'
  import {scrollOnBottom} from "../mixins/scrollOnBottom";
  import {AUTH_USER, moduleName as userModule} from 'Store/modules/authUser/user';
  import {
    ACTIVE_FILTERS,
    CHANGE_FILTERS,
    FETCH_USER_FEEDS,
    FETCH_USER_FEEDS_NEXT_PAGE,
    HIDE_FILTERS,
    IS_SHOW_FILTERS,
    LOADING,
    moduleName as feedsModule,
    MY_FEEDS
  } from 'Store/modules/feeds';

  export default {
    name: 'Feed',
    components: {
      inFeed: FeedItem
    },
    mixins: [scrollOnBottom],
    data() {
      return {
        filters: [
          {value: this.$lang.variables.welcomeToInratingTop, name: "registration"},
          {value: this.$lang.variables.likes, name: "like"},
          {value: this.$lang.variables.comments, name: "comment"},
          {value: this.$lang.variables.chinChinFilter, name: "chin-chin"},
          {value: this.$lang.variables.subscriptions, name: "follow"},
          {value: this.$lang.variables.gifts, name: "gift"},
          {value: this.$lang.variables.rating, name: "rating-vote"},
          {value: this.$lang.variables.groupInviteFilter, name: "group-invite"},
          {value: this.$lang.variables.mentions, name: "mention"},
          {value: this.$lang.variables.coinsRecieved+this.$lang.variables.incoins, name: "coins-received"}
        ],
        oldFeedsLength: 0
      }
    },
    watch: {
      bottom(bottom) {
        if (bottom) {
          this.fetchMyFeedsNextPage()
        }
      },
      feeds(newValue) {
        if((this.isFetchNewFeeds() && newValue.length < 12) || (newValue.length === this.oldFeedsLength)) {
          this.fetchMyFeedsNextPage();
        }
        this.oldFeedsLength = newValue.length;
      }
    },
    computed: {
      ...mapGetters({
        feeds: feedsModule + MY_FEEDS,
        loading: feedsModule + LOADING,
        activeFilters: feedsModule + ACTIVE_FILTERS,
        isShowFilters: feedsModule + IS_SHOW_FILTERS,
        authUser: userModule + AUTH_USER
      })
    },
    mounted() {
      if(this.feeds.length > 0) {
        setTimeout(() => {
          this.fetchMyFeeds();
        }, 0)
      } else {
        this.fetchMyFeeds();
      }
    },
    methods: {
      ...mapActions({
        fetchMyFeeds: feedsModule + FETCH_USER_FEEDS,
        fetchMyFeedsNextPage: feedsModule + FETCH_USER_FEEDS_NEXT_PAGE,
        changeFilters: feedsModule + CHANGE_FILTERS,
        hideFilters: feedsModule + HIDE_FILTERS
      }),
      isFetchNewFeeds() {
        return document.documentElement.clientHeight === document.documentElement.scrollHeight;
      }
    }
  }
</script>
<style lang="less">
  @import '~LessStyle/animation.less';
  @import '~LessStyle/feeds.less';

  body {
    margin: 0px;
  }
</style>
