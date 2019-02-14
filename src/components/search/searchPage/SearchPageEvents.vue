<template>
  <div class="search-page-events">
    <p class="title">{{$lang.variables.events}}</p>
    <swiper
      @slideChange="slideChangeHandler"
      :options="swiperOption"
      ref="slider">
      <swiper-slide
        v-for="event in events"
        :key="event.id">
        <SearchPageEventsItem :event="event"/>
      </swiper-slide>
      <swiper-slide v-if="loading && events.length > 0">
        <div class="search-page-contests-item-spinner">
          <in-spinner
            style="width: 35vw !important;"
            :loading="loading"/>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  import {
    moduleName as searchPageEventsModule,
    EVENTS,
    FETCH_EVENTS,
    FETCH_EVENTS_NEXT_PAGE,
    LOADING
  } from "Store/modules/searchPage/searchPageEvents";

  import SearchPageEventsItem from 'ComponentsVue/search/searchPage/SearchPageEventsItem'

  export default {
    name: "SearchPageEvents",
    components: {
      SearchPageEventsItem
    },
    data() {
      return {
        swiperOption: {
          freeMode: true,
          slidesPerView: 1.6,
          spaceBetween: 5
        },
        isMounted: false
      }
    },
    computed: {
      ...mapGetters({
        events: searchPageEventsModule + EVENTS,
        loading: searchPageEventsModule + LOADING
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
        fetch: searchPageEventsModule + FETCH_EVENTS,
        fetchNextPage: searchPageEventsModule + FETCH_EVENTS_NEXT_PAGE
      }),
      slideChangeHandler() {
        if (this.events.length !== 0 && this.events.length < this.activeIndex + 10) {
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
