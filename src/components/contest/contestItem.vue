<template>
  <router-link :to="'contest/'+this.contest.slug">
    <div class="contest-item">
      <div class="contest-item--avatar">
        <img :src="this.contest.img.url_large">
      </div>
      <div class="contest-item--body">
        <b
          :class="isActiveContest"
          v-html="this.contest.name"></b>
        <div
          class="contest-archive"
          v-if="!getRightTimeText">
          <span class="archive-time">{{$lang.variables.archive}} <in-time :time="this.contest.end_date_timestamp"/></span>

          <span class="archive-look"><i class="icon-send"></i></span>
        </div>
        <div
          class="gotocontest"
          v-else>
          <span class="archive-look"><i class="icon-send"></i></span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
  export default {
    computed: {
      getRightTimeText(){
        let date = new Date();
        return (this.contest.end_date_timestamp * 1000) - date > 0;
      },
      isActiveContest() {
        if (this.contest.is_active)
          return 'contest-name-grad';
        else
          return 'contest-name';
      }
    },
    name: 'contestItem',
    props: ['contest'],
  }
</script>

<style lang="less">
  @import '~LessStyle/contest.less';

  .archive-look{
    font-size: 20px;
  }

  .gotocontest{
    width: 100%;
    text-align: right;
  }
</style>
