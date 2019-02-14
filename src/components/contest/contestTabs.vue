<template>
  <div class="che_che">

    <!--<div class="contest-tabs">-->

      <!--<in-contest-tabs-item-->
        <!--v-if="this.sponsors.day"-->
        <!--:type="this.sponsors.day.type"-->
        <!--:showSponsors="true"-->
        <!--:active="false"-->
        <!--:organisator="this.sponsors.day.short_title"></in-contest-tabs-item>-->

      <!--<in-contest-tabs-item-->
        <!--v-if="this.sponsors.all"-->
        <!--:type="this.sponsors.all.type"-->
        <!--:active="true"-->
        <!--:showSponsors="false"-->
        <!--:organisator="this.sponsors.all.short_title"></in-contest-tabs-item>-->

      <!--<in-contest-tabs-item-->
        <!--v-if="this.sponsors.week"-->
        <!--:type="this.sponsors.week.type"-->
        <!--:showSponsors="true"-->
        <!--:active="false"-->
        <!--:organisator="this.sponsors.week.short_title"></in-contest-tabs-item>-->

    <!--</div>-->

    <!--<div v-if="sponsors.all" class="contest-tabs-description">-->
      <!--<span v-html="contestTabDescription"></span>-->
      <!--<p v-html="timeContest" style="margin: 5px 0;"></p>-->
    <!--</div>-->

    <p
      @click="openPresents(type)"
      v-html="contestTabLink"
      class="contest-tabs-read-more contest-tabs-read-more_che"></p>

    <in-transition-component name="translateX">
      <div v-if="isShowModal" class="contest-tabs-modal">
        <div class="modal-title-modal">
          <i
            @click="closeContest"
            class="icon-left-f icon-back"></i>
          {{$lang.variables.contest}}
        </div>
        <img class="contest-present-modal" :src="presentImage">
      </div>
    </in-transition-component>

    <modal name="openPresents"
           width="100%"
           classes=" v--modal"
           height="100%">
      <div class="modal-title">
        <i
          @click="closeContest"
          class="icon-left-f icon-back"></i>
        {{$lang.variables.contest}}
      </div>
      <img class="contest-present-modal" :src="presentImage">
    </modal>
  </div>
</template>
<script>
  import Vue from 'vue'
  import contestTabsItem from 'ComponentsVue/contest/contestTabsItem.vue'

  Vue.component('in-contest-tabs-item', contestTabsItem);

  export default {
    props: ['sponsors', 'contestTimeStart', 'contestTimeEnd', 'descshort'],
    data() {
      return {
        type: 'all',
        presentImage: '',
        contestTabDescription: '',
        contestTabLink: '',
        firstSponsors: this.sponsors.day || '',
        secondSponsors: this.sponsors.week || '',
        allSponsors: this.sponsors.all || '',
        //dayTimeStart: this.sponsors.day.start_date_timestamp || '',
        //dayTimeEnd: this.sponsors.day.end_date_timestamp || '',
        timeContest: '',
        isShowModal: false
      }
    },
    mounted() {
      console.log('start', this.allSponsors);

      this.$root.$on('changeUsers', (type) => {
        this.changeTabDesc(type);
        this.type = type;
      });
      this.changeTabDesc(this.type);
    },
    methods: {
      changeTabDesc(type) {

        switch (type) {
          case 'day' :
            if(this.sponsors.day) {
              this.contestTabDescription = this.sponsors.day.desc;
              this.contestTabLink = this.$lang.variables.readMoreHere;
              this.timeContest = this.$lang.variables.contestActive + this.$unixTime(this.sponsors.day.start_date_timestamp, true, 'full') + ' ' + this.$lang.variables.until + ' ' + this.$unixTime(this.sponsors.day.end_date_timestamp, true, 'full');
            }
            break;
          case 'all' :
            if(this.sponsors.all) {
              this.contestTabDescription = this.sponsors.all.desc;
              this.contestTabLink = this.$lang.variables.readMoreHere;
              this.timeContest = this.$lang.variables.contestActive + this.contestTimeStart + ' ' + this.$lang.contest.until + ' ' + this.contestTimeEnd;
            }
            break;
          case 'week' :
            if(this.sponsors.week) {
              this.contestTabDescription = this.sponsors.week.desc;
              this.contestTabLink = this.$lang.variables.readMoreHere;
              this.timeContest = this.$lang.variables.contestActive + this.$unixTime(this.sponsors.week.start_date_timestamp, true, 'full') + ' ' + ' ' + this.$lang.variables.until + ' ' + this.$unixTime(this.sponsors.week.end_date_timestamp, true, 'full') + ' ';
            }
            break;
        }
        this.$root.$on('makeNewTab', () => {
          this.isActive = false;
        });
      },
      openPresents(type) {
        switch (type) {
          case 'day':
            this.presentImage = this.sponsors.day.link.mobile;
            break;
          case 'all':
            this.presentImage = this.sponsors.all.link.mobile;
            break;
          case 'week':
            this.presentImage = this.sponsors.week.link.mobile;
            break;
        }
        this.isShowModal = true;
        // this.$modal.show('openPresents');
      },
      closeContest() {
        this.isShowModal = false;

        // this.$modal.hide('openPresents');
      }
    }
  }
</script>
<style lang="less">
  @import "~LessStyle/variables.less";

  .contest-present-modal {
    width: 100%;
  }

  .contest-tabs-read-more {
    color: #0cb4be;
  }

  .che_che {
    position: relative;
  }

  .contest-tabs-read-more_che {
    position: absolute;
    bottom: 10px;
    margin: 0;
    left: 0;
    right: 0;
    font-size: 3vw;
  }

  .contest-tabs-modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 14005;
    background: #fff;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    color: #fff;
    font-size: 5vw;

    .modal-title-modal {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: @grad;


      .icon-back {
        position: absolute;
        width: 40px;
        height: 40px;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
      }
    }

    .contest-present-modal {
      width: 100vw;
      padding-top: 40px;
      box-sizing: border-box;
      vertical-align: middle;
    }
  }
</style>
