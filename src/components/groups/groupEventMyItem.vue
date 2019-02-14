<template>
  <div
    @click="goToGroup"
    class="event-my">
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
        <div class="info-body--item info-date--start">
          <i class="icon-time"></i>
          <span>{{$unixTime(group.event_dates.start_date_timestamp)}}</span>
        </div>
        <div class="info-body--item info-date--end">
          <i class="icon-time-2"></i>
          <span>{{$unixTime(group.event_dates.end_date_timestamp)}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import 'JsLib/prototype'

  export default {
    name: 'groupEventMyItem',
    props: {
      group: {
        type: Object,
        required: true
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

  .event-my {
    width: 97vw;
    height: 28vw;
    padding: 5px;
    box-sizing: border-box;
    margin-bottom: 1vw;
    border: 1px solid #ccc;
    border-radius: 5px;
    display: flex;

    .banner {
      background-position: center;
      background-size: cover;
      width: 40%;
      height: calc(~'28vw - 12px');
      border-radius: 3px;
    }

    .info {
      width: calc(~'60% - 5px');
      height: calc(~'28vw - 12px');
      padding-left: 5px;

      &-title {
        margin: 0;
        height: 35%;
        box-sizing: border-box;
        border-bottom: 2px solid @contest-list-text-color;
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
        height: calc(~'65% - 5px');
        color: #2c3e50;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-around;
        padding: 5px 5px 0 5px;
        font-size: 3.2vw;

        &--item {
          width: 100%;
          text-align: left;
          .truncate();
        }
      }
    }
  }
</style>
