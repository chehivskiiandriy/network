<template>
  <div id="groups-container">
    <div class="groups-header">
      <div class="groups-header-left">
        <i
          v-if="!activeSearch"
           @click="goToCreateGroup"
           class="icon-plus"></i>
        <i
          v-else
          @click="changeActiveSearch"
          class="icon-left-f"></i>
      </div>
      <div class="groups-header-center">
        <template v-if="!activeSearch">
          <div
            @click="changeMenuItem('my')"
            class="groups-header-tabs--item"
            :class="{activeType: activeMenu === 'my'}">
            {{$lang.variables.my}}
          </div>
          <div
            @click="changeMenuItem('recommendations')"
            class="groups-header-tabs--item"
            :class="{activeType: activeMenu === 'recommendations'}">
            {{$lang.variables.recommendations}}
          </div>
        </template>
        <div
          v-else
          class="groups-header-search">
          <input
            :value="searchInput"
            class="groups-header-search-input"
            @keyup="fetchInput"
            :placeholder="$lang.variables.search"
          />
        </div>
      </div>
      <div class="groups-header-right">
        <i
          :class="[activeSearch ? 'icon-search-f' : 'icon-search']"
          @click="changeActiveSearch"></i>
      </div>
    </div>

    <div class="group-category-carousel">
      <swiper v-if="activeMenu==='recommendations'" :options="swiperOptions" ref="group-category-swiper">
        <swiper-slide
          v-for="subject in groupsSubject"
          :style="{backgroundImage: `url(${subject.banner})`}"
          class="group-category--item"
          :class="{activeSubject: category === subject.id}">
          <p @click="changeCategoryType(subject.id)">{{subject.name}}</p>
        </swiper-slide>
      </swiper>
    </div>
    <div class="group-top">
      <in-tabs :active-tab="activeTab" @update:active-tab="changeTab">
        <in-tab name="event">
            <span class="tab-name">{{$lang.variables.events}}</span>
        </in-tab>
        <in-tab name="group">
            <span class="tab-name">{{$lang.variables.groups}}</span>
        </in-tab>
        <in-tab name="community">
            <span class="tab-name">{{$lang.variables.community}}</span>
        </in-tab>
      </in-tabs>
    </div>

    <div
      v-if="activeMenu === 'recommendations' && activeTab === 'group'"
      class="change-view-group-icon">
      <i
        @click="changeViewRecommendationsGroupsPost"
        :class="groupsCountsPostView"></i>
    </div>

    <div v-if="activeMenu === 'my'" class="my-groups">
      <div class="groups-my">
        <template v-if="my && my.length > 0">
          <template v-if="activeTab === 'group'">
            <in-group-item
              v-for="group in my"
              :key="group.id"
              :group="group"/>
          </template>
          <template v-else-if="activeTab === 'event'">
            <in-my-event-item
              v-for="group in my"
              :key="group.id"
              :group="group"/>
          </template>
          <template v-else-if="activeTab === 'community'">
            <in-my-community-item
              v-for="group in my"
              :key="group.id"
              :group="group"/>
          </template>
        </template>
        <div
          v-else-if="!loading"
          class="content-none">
          {{$lang.variables.nothingFound}}
        </div>
      </div>
    </div>

    <div v-else-if="activeMenu === 'recommendations'" class="recommendations">
      <div
        class="groups-all"
        :class="recommendedGroups">
        <template v-if="recommend && recommend.length > 0">
          <template v-if="activeTab === 'group'">
            <in-recommend-group-item
              v-for="group in recommend"
              :key="group.id"
              :group="group"/>
          </template>
          <template v-else-if="activeTab === 'event'">
            <in-recommend-event-item
              v-for="group in recommend"
              :key="group.id"
              :group="group"/>
          </template>
          <template v-else-if="activeTab === 'community'">
            <in-recommend-community-item
              v-for="group in recommend"
              :key="group.id"
              :group="group"/>
          </template>
        </template>
        <div
          v-else-if="!loading"
          class="content-none">
          {{$lang.variables.nothingFound}}
        </div>
      </div>
    </div>

    <in-spinner :loading="loading"/>
    <in-found-groupmodals/>
  </div>
</template>

<script>
  import Vue from 'vue'
  import carouselGroupItem from 'ComponentsVue/groups/carouselGroupItem.vue'
  import groupItem from 'ComponentsVue/groups/groupItem.vue'
  import groupEventMyItem from 'ComponentsVue/groups/groupEventMyItem.vue'
  import groupCommunnityMyItem from 'ComponentsVue/groups/groupCommunityMyItem.vue'
  import groupEventRecommend from 'ComponentsVue/groups/groupEventRecommend.vue'
  import groupCommunityRecommend from 'ComponentsVue/groups/groupCommunityRecomend'
  import groupRecomendItem from 'ComponentsVue/groups/groupRecomendItem'
  import groupModal from 'ComponentsVue/groups/groupFoundModal.vue'
  import {scrollOnBottom} from "../mixins/scrollOnBottom";
  import {mapActions, mapGetters, mapMutations} from 'vuex';

  import {
    ACTIVE_MENU,
    ACTIVE_SEARCH,
    CATEGORY,
    CHANGE_ACTIVE_MENU,
    CHANGE_ACTIVE_SEARCH,
    CHANGE_CATEGORY,
    CHANGE_SEARCH_INPUT,
    CHANGE_TYPE,
    FETCH_GROUP_SUBJECTS,
    FETCH_MY_GROUPS,
    FETCH_MY_GROUPS_NEXT_PAGE,
    FETCH_RECOMMENDATIONS,
    FETCH_RECOMMENDATIONS_NEXT_PAGE,
    FETCH_SEARCH_GROUPS,
    FETCH_SEARCH_GROUPS_NEXT_PAGE,
    GROUP_SUBJECTS,
    LOADING_MY,
    LOADING_RECOMMENDATION,
    LOADING_SEARCH,
    moduleName as groupsAllModule,
    MY_GROUPS,
    RECOMMENDATIONS,
    SEARCH_GROUPS,
    SEARCH_INPUT,
    TYPE
  } from 'Store/modules/groups/groupsAll';
  import {
    CHANGE_RECOMMENDATIONS_GROUPS_POST_COUNT,
    moduleName as countPostOnPageModule,
    RECOMMENDATIONS_GROUPS_POST_COUNT
  } from "Store/modules/countPostOnPage";
  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";

  Vue.component('in-carouselgroup-item', carouselGroupItem);
  Vue.component('in-group-item', groupItem);
  Vue.component('in-found-groupmodals', groupModal);
  Vue.component('in-my-event-item', groupEventMyItem);
  Vue.component('in-my-community-item', groupCommunnityMyItem);
  Vue.component('in-recommend-event-item', groupEventRecommend);
  Vue.component('in-recommend-community-item', groupCommunityRecommend);
  Vue.component('in-recommend-group-item', groupRecomendItem);
  export default {
    mixins: [scrollOnBottom],
    watch: {
      bottom(bottom) {
        if (bottom) {
          this.fetchNext();
        }
      }
    },
    computed: {
      ...mapGetters({
        myGroups: groupsAllModule + MY_GROUPS,
        recommendations: groupsAllModule + RECOMMENDATIONS,
        loadingMy: groupsAllModule + LOADING_MY,
        loadingRecommendation: groupsAllModule + LOADING_RECOMMENDATION,
        groupsSubject: groupsAllModule + GROUP_SUBJECTS,
        searchGroups: groupsAllModule + SEARCH_GROUPS,
        activeTab: groupsAllModule + TYPE,
        activeMenu: groupsAllModule + ACTIVE_MENU,
        category: groupsAllModule + CATEGORY,
        recommendationsGroupsPostCount: countPostOnPageModule + RECOMMENDATIONS_GROUPS_POST_COUNT,
        authUser: userModule + AUTH_USER,
        activeSearch: groupsAllModule + ACTIVE_SEARCH,
        loadingSearch: groupsAllModule + LOADING_SEARCH,
        searchInput: groupsAllModule + SEARCH_INPUT
      }),
      loading() {
        if(this.activeSearch) {
          return this.loadingSearch
        } else {
          if (this.activeMenu === 'my') {
            return this.loadingMy
          } else if (this.activeMenu === 'recommendations') {
            return this.loadingRecommendation
          }
        }
      },
      my() {
        return this.activeSearch ? this.searchGroups : this.myGroups
      },
      recommend() {
        return this.activeSearch ? this.searchGroups : this.recommendations
      },
      recommendedGroups() {
        if (this.activeTab === 'group') {
          return 'groups-all-two-cards'
        }
        else if (this.activeTab === 'event') {
          return 'groups-all-two-cards'
        }
        else if (this.activeTab === 'community') {
          return 'groups-all-three-cards'
        }
      },
      groupsCountsPostView() {
        if (this.recommendationsGroupsPostCount === '4') {
          return 'icon-menu-16';
        }
        else if (this.recommendationsGroupsPostCount === '2') {
          return 'icon-menu-4';
        }
      }
    },
    data() {
      return {
        swiperOptions: {
          slidesPerView: 3,
          freeMode: true,
          spaceBetween: 5,
          slidesOffsetBefore: 5,
          slidesOffsetAfter: 5,
        },
      };
    },
    mounted() {
      this.redirectGuestToRecommendations();
      this.fetch();
      this.allSubjects();
    },
    methods: {
      ...mapActions({
        fetchMyGroups: groupsAllModule + FETCH_MY_GROUPS,
        fetchMyGroupsNextPage: groupsAllModule + FETCH_MY_GROUPS_NEXT_PAGE,
        fetchRecommendation: groupsAllModule + FETCH_RECOMMENDATIONS,
        fetchRecommendationNextPage: groupsAllModule + FETCH_RECOMMENDATIONS_NEXT_PAGE,
        fetchSearchGroups: groupsAllModule + FETCH_SEARCH_GROUPS,
        fetchSearchGroupsNextPage: groupsAllModule + FETCH_SEARCH_GROUPS_NEXT_PAGE,
        allSubjects: groupsAllModule + FETCH_GROUP_SUBJECTS,
        changeRecommendationsGroupsPostCount: countPostOnPageModule + CHANGE_RECOMMENDATIONS_GROUPS_POST_COUNT
      }),
      ...mapMutations({
        changeType: groupsAllModule + CHANGE_TYPE,
        changeActiveMenu: groupsAllModule + CHANGE_ACTIVE_MENU,
        changeCategory: groupsAllModule + CHANGE_CATEGORY,
        changeActiveSearchAction: groupsAllModule + CHANGE_ACTIVE_SEARCH,
        changeSearchInput: groupsAllModule + CHANGE_SEARCH_INPUT
      }),
      changeViewRecommendationsGroupsPost() {
        if(this.recommendationsGroupsPostCount === '4') {
          this.changeRecommendationsGroupsPostCount('2');
        } else {
          this.changeRecommendationsGroupsPostCount('4');
        }
      },
      changeActiveSearch() {
        this.changeActiveSearchAction();
        this.fetch();
      },
      goToCreateGroup() {
        this.$router.push("/group-create");
      },
      changeMenuItem(menuItem) {
        this.changeActiveMenu(menuItem);
        this.fetch();
      },
      changeTab(tab) {
        this.changeType(tab);
        this.fetch();
      },
      changeCategoryType(category) {
        this.changeCategory(category);
        this.fetch();
      },
      fetch() {
        if(this.activeSearch) {
          this.fetchSearchGroups(this.searchInput);
        } else {
          if (this.activeMenu === 'my') {
            this.fetchMyGroups();
          } else if (this.activeMenu === 'recommendations') {
            this.fetchRecommendation();
          }
        }
      },
      fetchInput(e) {
        this.changeSearchInput(e.target.value);
        this.fetch();
      },
      fetchNext() {
        if(this.activeSearch) {
          this.fetchSearchGroupsNextPage(this.searchInput);
        } else {
          if (this.activeMenu === 'my') {
            this.fetchMyGroupsNextPage();
          } else if (this.activeMenu === 'recommendations') {
            this.fetchRecommendationNextPage();
          }
        }
      },
      redirectGuestToRecommendations() {
        if (this.authUser.status === 'guest') {
          this.changeMenuItem('recommendations');
        }
      }
    }
  }
</script>

<style lang="less">
  @import "~LessStyle/variables.less";
  @import '~LessStyle/contest.less';
  @import '~LessStyle/groups.less';

  .change-view-group-icon {
    padding: 1.5vw 0 1vw 0;

    i {
      font-size: 28px;
      .text-grad();
    }
  }

  .groups-all {
    display: flex;
    flex-wrap: wrap;

    &-two-cards {
      margin: 1.5vw;
    }

    &-three-cards {
      margin: 1vw;
    }
  }

  .groups-my {
    display: flex;
    flex-wrap: wrap;
    margin: 1.5vw;
  }

  p {
    margin: 0px;
  }

  .translateY-enter-active {
    animation: translateY-in 0.5s ease-out forwards;
  }

  .translateY-leave-active {
    animation: translateY-out 0.5s ease-out forwards;
  }

  @keyframes translateY-out {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-100%);
    }
  }

  @keyframes translateY-in {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
</style>
