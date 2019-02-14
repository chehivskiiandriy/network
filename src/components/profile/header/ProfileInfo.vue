<template>
  <div class="profile-info">
    <div
      class="profile-info-item"
      @click="goToPosts">
      <span class="profile-info-item-name">{{$lang.profile.posts}}</span>
      <span class="profile-info-item-count">{{user.posts_count}}</span>
    </div>

    <div
      class="profile-info-item"
      @click="goToSubscribers">
      <span class="profile-info-item-name">{{$lang.variables.subscribers}}</span>
      <span class="profile-info-item-count">
        {{notSpecialUser ? user.subscribers_count : 0}}
        <sup
          v-if="user.id === authUser.id && user.subscribe_requests_count > 0"
          class="requests-attention">!</sup>
      </span>
    </div>

    <div
      class="profile-info-item"
      @click="goToSubscriptions">
      <span class="profile-info-item-name">{{$lang.variables.subscriptions}}</span>
      <span class="profile-info-item-count">{{notSpecialUser ? user.subscriptions_count : 0}}</span>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'

  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";
  import {
    moduleName as subscribersModule,
    RESET_SUBSCRIBERS,
    CHANGE_QUERY as CHANGE_QUERY_SUBSCRIBERS
  } from "Store/modules/users/subscribers";

  import {
    moduleName as subscriptionsModule,
    RESET_SUBSCRIPTIONS,
    CHANGE_QUERY as CHANGE_QUERY_SUBSCRIPTIONS
  } from "Store/modules/users/subscriptions";

  export default {
    props: {
      user: Object,
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER,
      }),
      notSpecialUser() {
        return this.user.id !== 6763 || this.authUser.id === 6763;
      }
    },
    methods: {
      ...mapMutations({
        resetSubscribers: subscribersModule + RESET_SUBSCRIBERS,
        changeSubscribersQuery: subscribersModule + CHANGE_QUERY_SUBSCRIBERS,
        resetSubscriptions: subscriptionsModule + RESET_SUBSCRIPTIONS,
        changeSubscriptionsQuery: subscriptionsModule + CHANGE_QUERY_SUBSCRIPTIONS
      }),
      goToSubscriptions() {
        if (this.notSpecialUser) {
          this.resetSubscriptions(this.user.nickname);
          this.changeSubscriptionsQuery({ nickname: this.user.nickname, query: '' });
          this.$router.push(`/u/${this.user.nickname}/subscriptions`);
        }
      },
      goToSubscribers() {
        if (this.notSpecialUser) {
          this.resetSubscribers(this.user.nickname);
          this.changeSubscribersQuery({ nickname: this.user.nickname, query: '' });
          this.$router.push(`/u/${this.user.nickname}/subscribers`);
        }
      },
      goToPosts() {
        this.$router.push(`/u/${this.user.nickname}`);
      }
    }
  }

</script>
<style lang="less">
  @import '~LessStyle/variables.less';

  .profile-info {
    width: 100vw;
    display: flex;

    &-item {
      width: 33%;
      font-size: 3.6vw;

      &:not(:last-child) {
        border-right: 1px solid #ccc;
      }

      &-name {

      }

      &-count {
        position: relative;
        color: @contest-list-text-color;
      }
    }
  }

  .requests-all {
    position: relative;
  }

  .requests-attention {
    color: @red;
    position: absolute;
    top: -30%;
    right: -50%;
  }
</style>
