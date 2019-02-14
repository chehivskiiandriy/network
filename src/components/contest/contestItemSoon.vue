<template>
  <router-link :to="'contest/'+this.contest.slug">
    <div class="contest-item">
      <div class="contest-item--avatar">

        <img :src="this.contest.img.url_large">
      </div>
      <div class="contest-item--body">
        <b
          class="comming-name"
          v-html="this.contest.name"></b>



        <span class="comming-time">{{$unixTime(contest.start_date_timestamp,true,'contest',this.contest.round_to)}}-{{$unixTime(contest.end_date_timestamp,true,'contest',this.contest.round_to)}}</span>
      </div>
      <div class="comming-soon-item">
        <div class="comming-soon">
          <span class="comming-text">COMING</span><br>
          <span class="soon-text">SOON</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
  export default {
    name: 'contestItemSoon',
    props: ['contest'],
  }
</script>

<style lang="less">
  @import '~LessStyle/contest.less';

  .archive-look {
    font-size: 20px;
  }

  .gotocontest {
    width: 100%;
    text-align: right;
  }

  .comming-soon-item {
    padding: 0px 1px;
    border: 1px solid @red;
    color: @red;
    margin-right: 10px;
    margin-right: 10px;
    font-weight: 600;
    margin-top: 10px;
    height: 35px;
    border-radius: 3px;
    .comming-text {
      font-size: 2.8vw;
    }
    .soon-text {
      font-size: 4.2vw;
    }
  }

  .comming-time {
    text-transform: uppercase;
  }
  .comming-name,
  .comming-time {
    .text-grad();
  }
</style>
