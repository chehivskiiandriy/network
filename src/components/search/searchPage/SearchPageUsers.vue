<template>
  <div class="search-page-users">
    <p class="title">{{$lang.variables.membersList}}</p>
    <swiper
      @slideChange="slideChangeHandler"
      :options="swiperOption"
      ref="slider">
      <swiper-slide
        v-for="user in users"
        :key="user.id">
        <div class="search-page-users-item">
          <router-link :to="'/u/' + user.nickname">
            <img
              :src="user.avatar_image.url_large"
              :alt="user.nickname">
            <p>{{user.nickname}}</p>
          </router-link>
        </div>
      </swiper-slide>
      <swiper-slide v-if="loading && users.length > 0">
        <in-spinner
          style="width: 95% !important;"
          :loading="loading"/>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  import {
    moduleName as searchPageUsersModule,
    USERS,
    FETCH_USERS,
    FETCH_USERS_NEXT_PAGE,
    LOADING
  } from "Store/modules/searchPage/searchPageUsers";

  export default {
    name: "SearchPageUsers",
    data() {
      return {
        swiperOption: {
          freeMode: true,
          slidesPerView: 3.2,
          spaceBetween: 5
        },
        isMounted: false
      }
    },
    computed: {
      ...mapGetters({
        users: searchPageUsersModule + USERS,
        loading: searchPageUsersModule + LOADING
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
        fetch: searchPageUsersModule + FETCH_USERS,
        fetchNextPage: searchPageUsersModule + FETCH_USERS_NEXT_PAGE
      }),
      slideChangeHandler() {
        if (this.users.length !== 0 && this.users.length < this.activeIndex + 10) {
          this.fetchNextPage();
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .search-page-users {
    .title {
      font-size: 3.4vw;
      padding: 5px 0;
      margin: 0;
      .text-grad();
    }

    &-item {
      position: relative;
      border-radius: 3px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        vertical-align: middle;
      }

      p {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        color: #fff;
        margin: 0;
        padding: 5px;
        font-size: 2.8vw;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9));
        border-radius: 0 0 5px 5px;
      }
    }
  }
</style>
