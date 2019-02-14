<template>
  <div
    @click="goToGroup"
    class="group-recommended"
    :class="[recommendationsGroupsPostCount === '2' ? 'group-recommended-big' : 'group-recommended-small']"
    :style="{backgroundImage: `url(${group.banner.url})`}">
    <div class="group-recommended-info">
      <h3 class="group-recommended-info-title">
        <span class="group-recommended-info-title-body">{{group.name}}</span>
      </h3>
      <div class="group-recommended-info-body">
        <div class="group-recommended-info-body-item group-recommended-info-count">
          <i class="icon-guy-2-f"></i>
          <span>{{group.users_count}}</span>
        </div>
        <div class="group-recommended-info-body-item group-recommended-info-accessibility">
          <i :class="accessibilityGroup"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex';

  import {moduleName as countPostOnPageModule, RECOMMENDATIONS_GROUPS_POST_COUNT} from "Store/modules/countPostOnPage";

  export default {
    name: 'groupRecommendItem',
    props: {
      group: {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapGetters({
        recommendationsGroupsPostCount: countPostOnPageModule + RECOMMENDATIONS_GROUPS_POST_COUNT
      }),
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

  .group-recommended {
    position: relative;
    box-sizing: border-box;
    margin-bottom: 1vw;
    border-radius: 3px;
    background-position: center;
    background-size: cover;
    overflow: hidden;

    &-big {
      width: 48vw;
      height: 48vw;

      &:nth-child(2n + 1) {
        margin-right: 1vw;
      }
    }

    &-small {
      width: 23.5vw;
      height: 23.5vw;

      &:not(:nth-child(4n)) {
        margin-right: 1vw;
      }


      .group-recommended-info {
        height: 45%;
      }

      .group-recommended-info-title {
        font-size: 3.2vw;
      }

      .group-recommended-info-body {
        font-size: 2.7vw;
        padding: 0;
      }
    }

    &-info {
      position: absolute;
      bottom: 0;
      height: 35%;
      width: 100%;
      background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9));
      color: #fff;

      &-title {
        margin: 0;
        font-size: 3.8vw;
        font-weight: normal;
        height: 55%;
        display: flex;
        align-items: flex-end;
        justify-content: center;

        &-body {
          width: 90%;
          .truncate();
        }
      }

      &-body {
        font-size: 3.5vw;
        height: 45%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 5px;
        margin: 0 5px;
      }

      &-count {
        display: flex;
        align-items: center;

        i {
          padding-right: 3px;
        }
      }
    }
  }
</style>
