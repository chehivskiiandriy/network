<template>
  <div class="search-page-groups">
    <p class="title">{{$lang.variables.groups}}</p>
    <swiper
      @slideChange="slideChangeHandler"
      :options="swiperOption"
      ref="slider">
      <swiper-slide
        v-for="group in groups"
        :key="group.id">
        <div class="search-group-item">
          <router-link :to="'/group/' + group.slug">
            <img
              class="search-group-item-img"
              :src="group.logo.url_medium">
            <p class="search-group-item-name">{{group.name}}</p>
          </router-link>
        </div>
      </swiper-slide>
      <swiper-slide v-if="loading && groups.length > 0">
        <div class="search-group-item-spinner">
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
    moduleName as searchPageGroupsModule,
    GROUPS,
    FETCH_GROUPS,
    FETCH_GROUPS_NEXT_PAGE,
    LOADING
  } from "Store/modules/searchPage/searchPageGroups";

  export default {
    name: "SearchPageGroups",
    data() {
      return {
        swiperOption: {
          freeMode: true,
          slidesPerView: 2.7,
          spaceBetween: 5
        },
        isMounted: false
      }
    },
    computed: {
      ...mapGetters({
        groups: searchPageGroupsModule + GROUPS,
        loading: searchPageGroupsModule + LOADING
      }),
      activeIndex() {
        return this.isMounted ? this.$refs.slider.swiper.activeIndex : 1
      }
    },
    mounted() {
      this.isMounted = true;
      this.fetchGroups();
    },
    methods: {
      ...mapActions({
        fetchGroups: searchPageGroupsModule + FETCH_GROUPS,
        fetchGroupsNextPage: searchPageGroupsModule + FETCH_GROUPS_NEXT_PAGE
      }),
      slideChangeHandler() {
        if(this.groups.length !== 0 && this.groups.length < this.activeIndex + 10) {
          this.fetchGroupsNextPage();
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .search-page-groups {
    .title {
      font-size: 3.4vw;
      padding: 5px 0;
      margin: 0;
      .text-grad();
    }

    .search-group-item {
      border-radius: 5px;
      background-color: #fff;
      overflow: hidden;

      &-img {
        position: relative;
        width: 100%;
        border-bottom: 2px solid #0cb4be;
        vertical-align: middle;
      }

      &-name {
        margin: 0 auto;
        padding: 5px 0;
        font-size: 3.2vw;
        width: 90%;
        .text-grad();
        .truncate();
      }

      &-spinner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
