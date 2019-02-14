<template>
  <div class="search-page-contests-item" @click="goToCommunity">
    <img
      class="logo"
      :src="community.logo.url_medium">
    <div class="info">
      <div class="info-title">
        <span class="info-title--body">{{community.name}}</span>
      </div>
      <div class="info-body">
        <div
          v-if="community.location"
          class="info-body--item info-location">
          <i class="icon icon-location-f"></i>
          <span>{{community.location.location}}</span>
        </div>
        <div class="info-body--item info-date">
          <div class="info-count">
            <i class="icon icon-guy-2-f"></i>
            <span>{{community.users_count}}</span>
          </div>
          <div class="info-accessibility">
            <i :class="accessibilityGroup"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SearchPageCommunitiesItem",
    props: {
      community: Object
    },
    computed: {
      accessibilityGroup() {
        return this.community.accessibility === 'open' ? 'icon icon-lock_open' : 'icon icon-lock_close';
      }
    },
    methods: {
      goToCommunity() {
        this.$router.push('/group/' + this.community.slug);

      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~LessStyle/variables.less";

  .search-page-contests-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    height: 100%;

    .logo {
      height: 30vw;
      width: 30vw;
      padding: 5px;
      box-sizing: border-box;
      border-radius: 10px;
    }

    .info {
      width: calc(~'100% - 30vw');
      height: 30vw;
      padding: 5px 5px 5px 0;
      box-sizing: border-box;

      &-title {
        margin: 0;
        height: 60%;
        font-size: 4vw;
        font-weight: normal;
        display: flex;
        align-items: center;
        justify-content: center;


        &--body {
          display: inline;
          color: #2c3e50;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-overflow: ellipsis;
          width: 90%;
          margin: 0 auto;
        }
      }

      &-body {
        height: calc(~'40% - 2px');
        font-size: 3.4vw;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        justify-content: flex-end;
        padding: 0 8px 0 3px;
        color: #2c3e50;
        border-top: 2px solid @contest-list-text-color;

        &--item {
          width: 100%;
          text-align: left;
          .truncate();
        }

        .icon {
          .text-grad();
        }
      }

      &-date {
        display: flex;
        justify-content: space-between;
        padding-top: 3px;
      }
    }
  }
</style>
