<docs>
  #
</docs>

<template>
  <div
    id="searchAll"
    class="searchAll"
    :style="{'--widthGridImg': Math.floor((indexWidth / 4.019) -2) + 'px'}">

    <div class="searchAll-contest">

      <p class="title">{{$lang.variables.contests}}</p>

      <in-search-slider
        :array="contests"
        :indexWidth="indexWidth / 2.55555"
        :indexHeight="indexWidth / 2.366"
        :maxLength="(contests.length - 2)"
        type="contest"/>

    </div>

    <div class="searchAll-user">

      <p class="title">{{$lang.variables.membersList}}</p>

      <in-search-slider
        :array="getUser"
        :indexWidth="indexWidth / 3.5"
        :indexHeight="indexWidth / 3.5"
        :maxLength="(getUser.length - 3)"
        type="user"/>

    </div>

    <div class="searchAll-group">

      <p class="title">{{$lang.variables.groups}}</p>

      <in-search-slider
        :array="getGroup"
        :indexWidth="indexWidth / 2.8"
        :indexHeight="'100%'"
        :maxLength="(getGroup.length - 2)"
        type="group"/>

    </div>

    <div class="search-all-item">
      <p class="title">{{$lang.variables.events}}</p>
      <template v-if="getEvent.length">
        <in-search-slider
          :array="getEvent"
          :indexWidth="indexWidth / 1.3"
          :indexHeight="'100%'"
          :maxLength="(getEvent.length - 1)"
          type="event"/>
      </template>
    </div>

    <div class="searchAll-post">

      <p class="title">{{$lang.variables.recommendations}}</p>

      <in-search-grid
        :getPost="getPost"
        :indexWidth="indexWidth"/>

    </div>
    <div v-if="loading" id="SpinnerOnloadImg">
      <img src="https://media.inrating.top/images/Spinner.svg"/>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import {mapGetters, mapActions} from 'vuex'
  import Vue from 'vue';
  import searchSlider from 'ComponentsVue/search/parts/searchSlider';
  import searchGrid from 'ComponentsVue/search/parts/SearchAllGrid';



  Vue.component('in-search-slider', searchSlider);
  Vue.component('in-search-grid', searchGrid);

  export default {
    name: 'search-all',
    data() {
      return {
        user: [],
        indexWidth: window.innerWidth,
        contests: [],
      }
    },
    watch: {
      bottom(bottom) {
        if (bottom && window.searchAllPosts.getters.canLoadNextPosts) {
          window.searchAllPosts.dispatch('LOAD_NEXT_PAGE_POSTS');
        }
      },
    },
    computed: {
      groupSlider() {
        return this.isMounted ? this.$refs.groupSlider.swiper.activeIndex : 1
      },
      getContest() {
        return window.searchAllContest.getters.getContest;
      },
      getUser() {
        return window.searchAllUser.getters.getUser
      },
      getGroup() {
        return window.searchAllGroup.getters.getGroup
      },
      getEvent() {
        return window.searchAllEvent.getters.getEvent
      },
      getPost() {
        return window.searchAllPosts.getters.getPosts
      },
      loading() {
        return window.searchAllPosts.getters.getLoad
      }
    },
    mounted() {
      // window.searchAllContest.dispatch('LOAD_CONTEST');
      window.searchAllUser.dispatch('LOAD_USER');
      window.searchAllGroup.dispatch('LOAD_GROUP');
      window.searchAllEvent.dispatch('LOAD_EVENT');
      window.searchAllPosts.dispatch('LOAD_POSTS');

      Promise.all([this.getActiveContests(), this.getIncomingContests(), this.getNotActiveContests()])
        .then(([active, incoming, notActive]) => {
          this.contests = this.contests.concat(active.data.data,
            incoming.data.data.map(contest => ({...contest, isIncoming: true})),
            notActive.data.data);
        });
    },
    methods: {
      getActiveContests() {
        let dataContest = new FormData();
        dataContest.append('include_users', 1);

        return axios.post('v1/contests/all?type=active', dataContest);
      },
      getIncomingContests() {
        let dataContest = new FormData();
        dataContest.append('include_users', 1);

        return axios.post('v1/contests/all?type=incoming', dataContest);
      },
      getNotActiveContests() {
        let dataContest = new FormData();
        dataContest.append('include_users', 1);

        return axios.post('v1/contests/all?type=old', dataContest);
      }
    },
  }
</script>

<style lang="less">
  @import '~LessStyle/searchAll.less';
</style>
