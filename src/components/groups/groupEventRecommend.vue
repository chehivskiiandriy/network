<template>
  <div
    class="group-events group-events-recommended"
    @click="goToGroup"
    :style="{backgroundImage: `url(${group.logo.url_medium})`}">
    <div class="group-events-info">
      <h3 class="group-events-info-title">
        <span class="group-events-info-title-body">{{group.name}}</span>
      </h3>
      <div class="group-events-info-body">
        <div
          v-if="group.location"
          class="group-events-info-body-item group-events-info-location">
          <i class="icon-location-f"></i>
          <span class="group-events-info-body-item-text">{{group.location.location}}</span>
        </div>
        <div
          v-if="group.event_dates"
          class="group-events-info-body-item group-events-info-date">
          <i class="icon-time"></i>
          <span class="group-events-info-body-item-text">{{eventDate}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default  {
    name: 'groupEventRecommend',
    props: {
      group: {
        type: Object,
        required: true
      }
    },
    computed: {
      eventDate() {
        return this.$unixTime(this.group.event_dates.start_date_timestamp).split('/')[0] + ' - ' + this.$unixTime(this.group.event_dates.end_date_timestamp).split('/')[0]
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

  .group-events {

    &-recommended {
      position: relative;
      width: 48vw;
      height: 38vw;
      box-sizing: border-box;
      margin-bottom: 1vw;
      border-radius: 3px;
      background-position: center;
      background-size: cover;
      overflow: hidden;

      &:nth-child(2n + 1) {
        margin-right: 1vw;
      }
    }

    &-info {
      position: absolute;
      bottom: 0;
      height: 50%;
      width: 100%;
      background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8),rgba(0, 0, 0, 0.9));
      color: #fff;

      &-title {
        margin: 0;
        font-size: 3.8vw;
        font-weight: normal;
        height: 40%;
        display: flex;
        align-items: flex-end;
        justify-content: center;

        &-body {
          width: 90%;
          .truncate();
        }
      }

      &-body {
        border-top: 2px solid #fff;
        font-size: 3vw;
        height: 60%;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        justify-content: center;
        padding: 0 5px;
        margin: 0 5px;

        &-item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;

          &-text {
            padding-left: 5px;
            .truncate();
          }
        }
      }

      &-location {
        padding-bottom: 2px;
      }
    }
  }
</style>
