<template>
  <div class="search-page-contests">
    <p class="title">{{$lang.variables.contests}}</p>
    <swiper
      @slideChange="slideChangeHandler"
      :options="swiperOption"
      ref="slider">
      <swiper-slide
        v-for="contest in contests"
        :key="contest.id">
        <SearchPageContestsItem :contest="contest"/>
      </swiper-slide>
      <swiper-slide v-if="loading && contests.length > 0">
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
    moduleName as searchPageContestsModule,
    CONTESTS,
    FETCH_CONTESTS,
    FETCH_CONTESTS_NEXT_PAGE,
    LOADING
  } from "Store/modules/searchPage/searchPageContests";

  import SearchPageContestsItem from 'ComponentsVue/search/searchPage/SearchPageContestsItem'

  export default {
    name: "SearchPageContests",
    components: {
      SearchPageContestsItem
    },
    data() {
      return {
        swiperOption: {
          freeMode: true,
          slidesPerView: 2.4,
          spaceBetween: 5
        },
        isMounted: false
      }
    },
    computed: {
      ...mapGetters({
        contests: searchPageContestsModule + CONTESTS,
        loading: searchPageContestsModule + LOADING
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
        fetch: searchPageContestsModule + FETCH_CONTESTS,
        fetchNextPage: searchPageContestsModule + FETCH_CONTESTS_NEXT_PAGE
      }),
      slideChangeHandler() {
        if(this.contests.length !== 0 && this.contests.length < this.activeIndex + 10) {
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
