<template>
  <div
    class="search-page-events"
    @click="goToEvent"
    :style="{backgroundImage: `url(${event.logo.url_medium})`}">
    <div class="search-page-events-info">
      <h3 class="search-page-events-info-title">
        <span class="search-page-events-info-title-body">{{event.name}}</span>
      </h3>
      <div class="search-page-events-info-body">
        <div
          v-if="event.location"
          class="search-page-events-info-body-item search-page-events-info-location">
          <i class="icon-location-f"></i>
          <span class="search-page-events-info-body-item-text">{{event.location.location}}</span>
        </div>
        <div
          v-if="event.event_dates"
          class="search-page-events-info-body-item search-page-events-info-date">
          <i class="icon-time"></i>
          <span class="search-page-events-info-body-item-text">{{eventDate}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SearchPageEventsItem",
    props: {
      event: Object
    },
    computed: {
      eventDate() {
        return this.$unixTime(this.event.event_dates.start_date_timestamp).split('/')[0] + ' - ' + this.$unixTime(this.event.event_dates.end_date_timestamp).split('/')[0]
      }
    },
    methods: {
      goToEvent() {
        this.$router.push('/group/' + this.event.slug);
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~LessStyle/variables.less";

  .search-page-events {
    position: relative;
    width: 100%;
    height: 36vw;
    box-sizing: border-box;
    margin-bottom: 1vw;
    border-radius: 3px;
    background-position: center;
    background-size: cover;
    overflow: hidden;

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
