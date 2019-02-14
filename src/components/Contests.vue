<template>
  <div id="contest-container">
    <div class="contest-header">
      <in-carouselContest-item
        class="carousel-item"
        v-for="(contest,index) in carouselContest"
        :contest="contest"
        :key="contest.id"
        :index="index"/>
    </div>

    <in-contest-item
      v-for="contest in allContest"
      :key="contest.id"
      :contest="contest"/>

    <in-contest-itemsoon
      v-for="contest in specialArray"
      :key="contest.id"
      :contest="contest"/>

    <in-contest-item
      v-for="contest in allContestNotActive"
      :key="contest.id"
      :contest="contest"/>
  </div>
</template>

<script>
  import axios from 'axios';

  import Vue from 'vue'
  import contestItem from 'ComponentsVue/contest/contestItem.vue'
  import contestItemSoon from 'ComponentsVue/contest/contestItemSoon.vue'
  import carouselContestItem from 'ComponentsVue/contest/carouselContestItem.vue'

  Vue.component('in-contest-item', contestItem);
  Vue.component('in-contest-itemsoon', contestItemSoon);
  Vue.component('in-carouselContest-item', carouselContestItem);
  export default {
    data() {
      return {
        allContest: [],
        allContestNotActive: [],
        carouselContest: [],
        specialArray: [],
      }
    },
    mounted() {
      Promise.all([this.getActiveContests(), this.getIncomingContests(), this.getNotActiveContests()])
        .then(([active, incoming, notActive]) => {
          this.allContest = active.data.data;
          this.specialArray = incoming.data.data;
          this.allContestNotActive = notActive.data.data;

          let len = 5;
          if (this.allContest.length > 0) {
            if (this.allContest.length < 5) {
              this.carouselContest = this.carouselContest.concat(this.allContest);
              len = 5 - this.carouselContest.length;
            } else {
              this.carouselContest = this.carouselContest.concat(this.allContest.slice(0, 5));
              len = 5 - this.carouselContest.length;
            }
          }
          if (len && this.specialArray.length > 0) {
            if (this.specialArray.length < len) {
              this.carouselContest = this.carouselContest.concat(this.specialArray);
              len = 5 - this.carouselContest.length;
            } else {
              this.carouselContest = this.carouselContest.concat(this.specialArray.slice(0, len));
              len = 5 - this.carouselContest.length;
            }
          }
          if (len && this.allContestNotActive.length > 0) {
            if (this.allContestNotActive.length < len) {
              this.carouselContest = this.carouselContest.concat(this.allContestNotActive);
            } else {
              this.carouselContest = this.carouselContest.concat(this.allContestNotActive.slice(0, len));
            }
          }
        });
    },
    methods: {
      getActiveContests() {
        return axios.get('v1/contests/all?type=active');
      },
      getIncomingContests() {
        return axios.get('v1/contests/all?type=incoming');
      },
      getNotActiveContests() {
        return axios.get('v1/contests/all?type=old');
      }
    }
  }
</script>

<style lang="less">
  .carousel-item--block {
    width: 100%;

  }
</style>
