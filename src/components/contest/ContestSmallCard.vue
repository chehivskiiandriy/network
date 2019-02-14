<template>
  <div
    class="contest-small-card"
    @click="goToPost">
    <img
      class="contest-member-photo"
      :src="member.avatar_image.url_medium"
      alt="">
    <img
      v-if="member.active_gift !== null"
      class="contest-member-avatar-image"
      :src="member.active_gift.image">
    <div class="contest-member-place">
      <span v-text="member.contest_info.contest_current_position"></span>
    </div>
    <div class="contest-member-rating">
      <i class="icon-heart_R" aria-hidden="true"></i>
      <span v-text="member.contest_info.rating"></span>
    </div>
    <div class="contest-member-info">
      <p class="contest-member-nickname">{{member.nickname}}</p>
      <p class="contest-member-full-name">{{member.name}} {{member.lastname}}</p>
    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';

  import {CHANGE_CONTEST_POST_COUNT, moduleName as countPostOnPageModule} from 'Store/modules/countPostOnPage';

  export default {
    name: "ContestSmallCard",
    props: {
      contest: Object,
      member: Object
    },
    methods: {
      ...mapActions({
        changeContestPostCount: countPostOnPageModule + CHANGE_CONTEST_POST_COUNT
      }),
      goToPost(){
        this.changeContestPostCount('1');
        this.$root.$emit('toHref', '#' + this.member.id);
      }
    }
  }
</script>

<style lang="less" scoped>
  .contest-small-card {
    width: 49.5vw;
    height: 49.5vw;
    position: relative;
    margin-bottom: 1vw;
    color: #fff;

    .contest-member-photo {
      width: 100%;
      height: auto;
      border-radius: 10px;
      box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.3);
    }

    .contest-member-avatar-image {
      position: absolute;
      right: 3%;
      bottom: 3%;
      width: 19%;
      opacity: 0.7;
      background: #fff;
      border-radius: 5px;
      z-index: 1;
    }

    .contest-member-place,
    .contest-member-rating {
      position: absolute;
      top: 3%;
      box-sizing: border-box;
      padding: 3px 12px;
      border-radius: 5px;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .contest-member-place {
      left: 3%;
    }

    .contest-member-rating {
      right: 3%;

      .icon-heart_R {
        padding-right: 5px;
      }
    }

    .contest-member-info {
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      text-align: left;
      font-size: 3.5vw;
      padding: 0 0 1% 3%;
      background: linear-gradient(transparent,rgba(0,0,0,.6),rgba(0,0,0,.9));
      border-radius: 0 0 10px 10px;
    }

    .contest-member-nickname,
    .contest-member-full-name {
      margin: 0 auto;
    }
  }
</style>
