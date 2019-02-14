<template>
  <div class="community-recommended" @click="goToGroup">
    <div
      class="banner"
      :style="{backgroundImage: `url(${group.logo.url_medium})`}"></div>
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
  </div>
</template>
<script>
  export default  {
    name: 'groupCommunityRecommend',
    props: {
      group: {
        type: Object,
        required: true
      }
    },
    computed: {
      accessibilityGroup() {
        if (this.group.accessibility==='open')
          return 'icon-lock_open';
        else
          return 'icon-lock_close';
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

  .community-recommended {
    position: relative;
    width: calc(~'98vw / 3 - 2px');
    box-sizing: border-box;
    margin-bottom: 3px;
    border-radius: 5px;
    border: 1px solid #ccc;
    overflow: hidden;

    &:not(:nth-child(3n)) {
      margin-right: 3px;
    }

    .banner {
      background-position: center;
      background-size: cover;
      width: calc(~'98vw / 3 - 2px');
      height: calc(~'98vw / 3 - 2px');
    }

    .info {
      border-top: 2px solid @contest-list-text-color;
      background: @white;
      height: 15vw;

      &-title {
        margin: 0;
        height: 40%;
        font-size: 3.5vw;
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
        font-size: 3vw;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-around;
        padding: 0 3px;

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

  .groupCommunityRecommend {
    background-size: cover;
    width: calc(34vw - 2.5px);
    margin: 2.5px 2.5px;
    border-radius: 3px;
    display: inline-block;
    position: relative;
    box-shadow: @box_shadow_small;
    color: @black;
  }
</style>
