<template>
  <div class="community-my" @click="goToGroup">
    <div class="info">
      <h3 class="info-title">
        <span class="info-title--body">{{group.name}}</span>
      </h3>
      <div class="info-body">
        <div
          v-if="group.location"
          class="info-body--item info-location">
          <i class="icon-location-f"></i>
          <span>{{group.location.location}}</span>
        </div>
        <div class="info-body--item info-date">
          <div class="info-count">
            <i class="icon-guy-2-f"></i>
            <span>{{group.users_count}}</span>
          </div>
          <div class="info-accessibility">
            <i :class="accessibilityGroup"></i>
          </div>
        </div>
      </div>
    </div>
    <div
      class="banner"
      :style="{backgroundImage: `url(${group.banner.url_medium})`}"></div>
  </div>
</template>
<script>
  export default {
    name: 'groupCommunityMyItem',
    props: {
      group: {
        type: Object,
        required: true
      }
    },
    computed: {
      accessibilityGroup() {
        return this.group.accessibility === 'open' ? 'icon-lock_open' : 'icon-lock_close';
      }
    },
    methods: {
      goToGroup() {
        this.$router.push('/group/' + this.group.slug);
      }
    }
  }
</script>
<style lang="less">
  @import "~LessStyle/variables.less";

  .community-my {
    width: 97vw;
    height: 22vw;
    padding: 5px;
    box-sizing: border-box;
    margin-bottom: 1vw;
    border: 1px solid #ccc;
    border-radius: 5px;
    display: flex;

    .banner {
      background-position: center;
      background-size: cover;
      width: 50%;
      height: calc(~'22vw - 12px');
      border-radius: 3px;
    }

    .info {
      background: @white;
      height: calc(~'22vw - 10px');
      width: 50%;

      &-title {
        margin: 0;
        height: 40%;
        font-size: 4vw;
        font-weight: normal;
        display: flex;
        align-items: center;
        justify-content: center;

        &--body {
          width: 90%;
          color: @contest-list-text-color;
          .truncate();
        }
      }

      &-body {
        height: 60%;
        font-size: 3.4vw;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        justify-content: space-around;
        padding: 0 8px 0 3px;
        color: #2c3e50;

        &--item {
          width: 100%;
          text-align: left;
          .truncate();
        }
      }

      &-date {
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
