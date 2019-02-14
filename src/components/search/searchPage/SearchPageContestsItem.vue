<template>
  <div class="search-page-contests-item">
    <div
      class="search-page-contests-top"
      @click="goToContest">
      <div
        class="contest-body-head"
        :class="{'active': contest.is_active}">
        <div
          v-if="isIncoming"
          class="contest-coming-soon contest-coming-soon-head">
          COMING SOON
        </div>
      </div>
      <div class="contest-body-img">
        <img :src="contest.img.url_small">
      </div>
      <div class="contest-body-name">
        <span>{{contest.name}}</span>
      </div>
    </div>
    <div class="contest-body-users">
      <div
        v-for="user in users"
        :key="user.id"
        class="contest-body-user">
        <router-link :to="'/u/'+user.nickname">
          <img :src="user.avatar_image.url_small">
        </router-link>
      </div>
      <div v-if="contest.contestants_count === 0" class="contest-coming-soon">
        <span class="coming-text">COMING</span>
        <span class="soon-text">SOON</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SearchPageContestsItem",
    props: {
      contest: Object
    },
    computed: {
      users() {
        return this.contest.contestants.slice(0, 3)
      },
      isIncoming() {
        return !this.contest.is_active && !this.contest.is_expired && this.contest.contestants_count > 0
      }
    },
    methods: {
      goToContest() {
        const {is_active, is_expired, slug} = this.contest;
        if (is_active || is_expired) {
          this.$router.push(`/contest/${slug}`)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .search-page-contests-item {
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
    position: relative;
    min-height: 45vw;

    .contest-body-head {
      height: 12vw;
      background: linear-gradient(to right bottom, #afadad, #545151 90%);

      &.active {
        background: @grad;
      }
    }

    .contest-body-img {
      height: 6vw;

      img {
        position: relative;
        width: 12vw;
        height: 12vw;
        bottom: 6vw;
        border-radius: 5px;
        border: 1px solid #f4f4f4;
      }
    }

    .contest-body-name {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      width: 90%;
      margin: 10px auto;
      font-size: 3.4vw;
      height: 8vw;

      span {
        display: inline;
        .text-grad();
      }
    }

    .contest-body-users {
      display: flex;
      justify-content: space-evenly;
      padding-bottom: 5px;

      .contest-body-user {
        width: 31%;

        img {
          width: calc(~'100% - 2px');
          border: 1px solid #f4f4f4;
          border-radius: 5px;
          vertical-align: middle;
        }
      }
    }

    .contest-coming-soon {
      border: 1px solid @red;
      color: @red;
      font-weight: 600;
      width: 60%;
      padding: 3px 0;
      border-radius: 3px;
      margin: 1vw auto;
      height: 8vw;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .coming-text {
        font-size: 2.8vw;
      }
      .soon-text {
        font-size: 4vw;
      }
    }

    .contest-coming-soon-head {
      display: inline-block;
      margin: 5px 3px;
      padding: 1px 2px;
      height: auto;
      width: auto;
      text-align: center;
      font-weight: normal;
      border: none;
      font-size: 2.7vw;
    }
  }
</style>
