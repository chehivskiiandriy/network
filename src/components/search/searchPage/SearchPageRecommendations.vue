<template>
  <div class="search-page-recommendations">
    <p class="title">{{$lang.variables.recommendations}}</p>
    <SearchAllGrid :getPost="recommendations"/>
    <in-spinner :loading="loading"/>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  import {scrollOnBottom} from "Mixins/scrollOnBottom";

  import {
    moduleName as searchPageRecommendationsModule,
    RECOMMENDATIONS,
    FETCH_RECOMMENDATIONS,
    FETCH_RECOMMENDATIONS_NEXT_PAGE,
    LOADING
  } from "Store/modules/searchPage/searchPageRecommendations";

  import SearchAllGrid from 'ComponentsVue/search/parts/SearchAllGrid'

  export default {
    name: "SearchPageRecommendations",
    mixins: [scrollOnBottom],
    components: {
      SearchAllGrid
    },
    watch: {
      bottom(bottom) {
        if (bottom) {
          this.fetchNextPage();
        }
      },
    },
    computed: {
      ...mapGetters({
        recommendations: searchPageRecommendationsModule + RECOMMENDATIONS,
        loading: searchPageRecommendationsModule + LOADING
      }),
    },
    mounted() {
      this.fetch();
    },
    methods: {
      ...mapActions({
        fetch: searchPageRecommendationsModule + FETCH_RECOMMENDATIONS,
        fetchNextPage: searchPageRecommendationsModule + FETCH_RECOMMENDATIONS_NEXT_PAGE,
      }),
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
