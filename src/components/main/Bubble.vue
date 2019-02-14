<template>
  <div
    v-if="isNewPosts"
    class="bubble"
    :class="{'bubble-hide': isShowBubble}"
    @click="fetchNew">
    <span>NEW POSTS</span>
    <i class="icon-buble_up"></i>
  </div>
</template>

<script>
  import {mapActions, mapMutations, mapGetters} from 'vuex';

  import {
    moduleName as mainPostsModule,
    IS_NEW_POSTS,
    FETCH_NEW_POSTS,
    CHANGE_CHECK_NEW_POSTS
  } from "Store/modules/mainPosts";

  import animateScroll from "JsLib/animateScroll";

  export default {
    name: "Bubble",
    data() {
      return {
        previousScrollPosition: window.pageYOffset,
        isShowBubble: true
      }
    },
    computed: {
      ...mapGetters({
        isNewPosts: mainPostsModule + IS_NEW_POSTS
      })
    },
    created(){
      window.addEventListener('scroll', this.scrollHandler);
    },
    destroyed () {
      window.removeEventListener('scroll', this.scrollHandler);
    },
    methods: {
      ...mapActions({
        fetchNewPosts: mainPostsModule + FETCH_NEW_POSTS
      }),
      ...mapMutations({
        changeCheckNewPosts: mainPostsModule + CHANGE_CHECK_NEW_POSTS
      }),
      fetchNew() {
        animateScroll();
        this.changeCheckNewPosts(false);
        this.fetchNewPosts();
      },
      scrollHandler() {
        if(window.pageYOffset === 0) {
          return;
        }

        let currentScrollPosition = window.pageYOffset;
        this.isShowBubble = this.previousScrollPosition <= currentScrollPosition;
        this.previousScrollPosition = currentScrollPosition;
      }
    }
  }
</script>

<style lang="less" scoped>
  .bubble {
    position: fixed;
    top: 55px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    background: rgba(0, 0, 0, 0.6);
    padding: 5px 10px;
    border-radius: 3px;
    color: #fff;
    font-size: 3vw;
    transition: .25s ease-out;

    &-hide {
      top: -30px;
      opacity: 0;
    }

    .icon-buble_up {
      font-size: 3vw;
      color: #fff;
      margin-left: 3px;
    }
  }
</style>
