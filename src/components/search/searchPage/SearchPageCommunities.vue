<template>
  <div class="search-page-communities">
    <p class="title">{{$lang.variables.community}}</p>
    <swiper
      @slideChange="slideChangeHandler"
      :options="swiperOption"
      ref="slider">
      <swiper-slide
        v-for="community in communities"
        :key="community.id">
        <SearchPageCommunitiesItem :community="community"/>
      </swiper-slide>
      <swiper-slide v-if="loading && communities.length > 0">
        <div class="search-page-contests-item-spinner">
          <in-spinner
            style="width: 100% !important;"
            :loading="loading"/>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  import {
    moduleName as searchPageCommunitiesModule,
    COMMUNITIES,
    FETCH_COMMUNITIES,
    FETCH_COMMUNITIES_NEXT_PAGE,
    LOADING
  } from "Store/modules/searchPage/searchPageCommunities";

  import SearchPageCommunitiesItem from "ComponentsVue/search/searchPage/SearchPageCommunitiesItem"

  export default {
    name: "SearchPageCommunities",
    components: {
      SearchPageCommunitiesItem
    },
    data() {
      return {
        swiperOption: {
          freeMode: true,
          slidesPerView: 1.3,
          spaceBetween: 5
        },
        isMounted: false
      }
    },
    computed: {
      ...mapGetters({
        communities: searchPageCommunitiesModule + COMMUNITIES,
        loading: searchPageCommunitiesModule + LOADING
      }),
      activeIndex() {
        return this.isMounted ? this.$refs.slider.swiper.activeIndex : 1
      }
    },
    mounted() {
      this.isMounted = true;
      this.fetch();
    },
    methods: {
      ...mapActions({
        fetch: searchPageCommunitiesModule + FETCH_COMMUNITIES,
        fetchNextPage: searchPageCommunitiesModule + FETCH_COMMUNITIES_NEXT_PAGE
      }),
      slideChangeHandler() {
        if (this.communities.length !== 0 && this.communities.length < this.activeIndex + 10) {
          this.fetchNextPage();
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .title {
    font-size: 3.4vw;
    padding: 5px 0;
    margin: 0;
    .text-grad();
  }
</style>
