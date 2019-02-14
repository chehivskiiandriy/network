<template>
  <div class="contest-container">
    <div class="contest-header-top">
      <div class="contest-header-title">{{$lang.contest.contest}}</div>
      <i
        @click="close"
        class="icon-left-f icon-back"></i>
      <i
        @click="changeViewContest"
        :class="contestView"></i>
    </div>
    <div class="singlecontest-header">
      <div class="contest-title">
        <div class="contest-image">
          <img :src="contestImg">
        </div>
        <p
          class="contest-title--text"
          v-html="contest.name"></p>
      </div>
      <div class="contest-desc contest-desc_che">
        <p
          class="contest-desc--text info-block"
          v-html="contest.desc"></p>
        <p class="contest-desc--text activation-time">
          {{$lang.variables.votingActiveFrom}}
          <span>{{$unixTime(contest.start_date_timestamp, true, 'full')}}</span>
          <span>{{$lang.variables.until}}</span>
          <span>{{$unixTime(contest.end_date_timestamp, true, 'full')}}</span>
        </p>
        <div
          v-if="contest.is_active"
          class="contest-applymember">
          <!--<button @click="showApplyMember()">
            Подать заявку
          </button>-->
        </div>
      </div>
    </div>

    <in-contest-tabs
      :sponsors="sponsors"
      :contestTimeStart="$unixTime(contest.start_date_timestamp,true,'contest','day')"
      :contestTimeEnd="$unixTime(contest.end_date_timestamp,true,'contest','day')"
      :descshort=this.contest.desc_short
      v-if="sponsors"/>

    <in-banner v-if="contestId === 63" disabled class="banner_che" :banners="banners"></in-banner>

    <i></i>
    <div class="contest-members-small-card">
      <div
        v-for="(member, index) in getContestUser"
        :key="index">
        <div
          :id="member.id"
          class="contest-member" v-show="contestPostCount === '1'">
          <in-contest-member
            :contest="contest"
            :active="contest.is_active"
            :type="contest.type"
            :member="member"
            :sponsorName="type"
            :showSponsor="showSponsor"/>
        </div>
        <in-contest-small-card
          v-show="contestPostCount === '2'"
          :contest="contest"
          :member="member"/>
        <div :data-id="member.id"></div>
      </div>
    </div>
    <!--<in-apply-member-modal :contest="contest"/>-->
    <div v-if="loading" id="SpinnerOnloadImg">
      <img src="https://media.inrating.top/images/Spinner.svg"/>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  import Vue from 'vue'
  import {mapActions, mapGetters} from 'vuex'
  import contestMember from 'ComponentsVue/contest/contestMember.vue'
  import applyMember from 'ComponentsVue/modal/applyMember.vue'
  import contestMemberEmpty from 'ComponentsVue/contest/contestMemberEmpty.vue'
  import contestTabs from 'ComponentsVue/contest/contestTabs.vue'
  import {scrollOnBottom} from "../../mixins/scrollOnBottom";
  import ContestSmallCard from "ComponentsVue/contest/ContestSmallCard";
  import {
    CHANGE_CONTEST_POST_COUNT,
    CONTEST_POST_COUNT,
    moduleName as countPostOnPageModule
  } from 'Store/modules/countPostOnPage';

  import {
    moduleName as bannersModule,
    BANNERS,
    FETCH_BANNERS
  } from 'Store/modules/banners';

  import Banner from 'ComponentsVue/Banner';

  Vue.component('in-contest-member', contestMember);
  Vue.component('in-apply-member-modal', applyMember);
  Vue.component('in-contest-member-empty', contestMemberEmpty);
  Vue.component('in-contest-tabs', contestTabs);
  export default {
    components: {
      inContestSmallCard: ContestSmallCard,
      inBanner: Banner,
    },
    mixins: [scrollOnBottom],
    data() {
      return {
        contestUser: [],
        contest: {},
        contestImg: [],
        // bottom: false,
        url_img: '',
        contestId: '',
        type: 'all',
        sponsors: '',
        sponsorName: '',
        showSponsor: false,
        href: '',
        isUpdated: false
      }
    },
    computed: {
      ...mapGetters({
        contestPostCount: countPostOnPageModule + CONTEST_POST_COUNT,
        banners: bannersModule + BANNERS,
      }),
      getContestUser() {
        return window.storeContestUser.getters.getAllContestUser
      },
      loading() {
        return window.storeContestUser.getters.getLoading
      },
      contestView() {
        if (this.contestPostCount === '1')
          return 'icon-feed icon-Menu_3_4';
        else
          return 'icon-feed icon-Menu_4_3';
      }
    },
    mounted() {
      this.getInfoContest();
      this.$root.$on('changeUsers', (event) => {
        this.type = event;
        this.getInfoContest();
      });
      this.$root.$on('changeMemberBlock', (event) => {
        this.sponsorName = event.name;
        this.showSponsor = event.show;
      });
      this.$root.$on('toHref', (event) => {
        this.href = event;
        this.isUpdated = true;
      });
      if(!this.banners) {
        this.fetchBanners();
      }
    },
    updated() {
      if (this.isUpdated) {
        window.location = window.location.pathname + this.href;
        window.scrollBy(0, -Math.floor(window.innerHeight / 3));
      }
    },
    watch: {
      bottom(bottom) {
        if (bottom) {
          window.storeContestUser.dispatch('LOAD_NEXT_PAGE_CONTEST_USER', {
            id: this.contestId,
            type: this.type,
          });
        }
      }
    },
    methods: {
      ...mapActions({
        changeContestPostCount: countPostOnPageModule + CHANGE_CONTEST_POST_COUNT,
        fetchBanners: bannersModule + FETCH_BANNERS,
      }),
      getInfoContest() {
        let contest_id = this.$route.params.id;
        let params = {
          type: 'slug',
          value: contest_id,
        };
        axios.post('v1/contests/get', params)
          .then(res => {
            this.contest = res.data;
            this.sponsors = res.data.sponsors;

            this.contestImg = res.data.img.url_large;
            this.contestId = res.data.id;

            window.storeContestUser.dispatch('LOAD_CONTEST_USER', {
              id: res.data.id,
              max: res.data.max_contestants_count,
              type: this.type,
            });

          })
      },
      close() {
        this.$router.replace({name: 'contests'});
      },
      showApplyMember() {
        this.$modal.show('applyMember');
      },
      changeViewContest() {
        if (this.contestPostCount === '1') {
          this.changeContestPostCount('2');
        }
        else {
          this.changeContestPostCount('1');
        }
      },
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/singlecontest.less';

  #SpinnerOnloadImg {
    display: block;
    width: 35%;
    margin: auto;
  }

  .contest-desc_che {
    padding: 5px 20px 30px 20px;
  }

  .banner_che {
    padding: 10px 0 0 0 !important;
    margin-bottom: -5px;
  }
</style>
