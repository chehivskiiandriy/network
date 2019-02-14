<template>
  <div class="post-container">
    <in-spinner :loading="loadingPrev"/>

    <template v-if="post && postNavigationId === post.id">
      <in-group-one-post
        v-if="isGroupPost"
        v-for="prevPost in prevPosts"
        :key="prevPost.id"
        @show-post-settings="showPostSettingsModal = true"
        :post="prevPost"></in-group-one-post>

      <in-post
        v-for="prevPost in prevPosts"
        :key="prevPost.id"
        @show-post-settings="showPostSettingsModal = true"
        :post="prevPost"></in-post>
    </template>

    <in-group-one-post
      v-if="isGroupPost"
      :post="post"
      @show-post-settings="showPostSettingsModal = true"
      ref="post"></in-group-one-post>
    <in-post
      v-else-if="post"
      :post="post"
      @show-post-settings="showPostSettingsModal = true"
      ref="post"></in-post>

    <div
      v-if="showMoreButton"
      @click="loadMore"
      class="show-more">Show More</div>

    <template v-if="post && postNavigationId === post.id">
      <in-group-one-post
        v-if="isGroupPost"
        v-for="nextPost in nextPosts"
        :key="nextPost.id"
        @show-post-settings="showPostSettingsModal = true"
        :post="nextPost"></in-group-one-post>

      <in-post
        v-for="nextPost in nextPosts"
        :key="nextPost.id"
        @show-post-settings="showPostSettingsModal = true"
        :post="nextPost"></in-post>
    </template>

    <in-spinner :loading="loadingNext"/>

    <in-post-settings
      :show.sync="showPostSettingsModal"
      :user="authUser"/>
    <in-post-share-modal
      v-if="selectedPost"
      :selectedPost="selectedPost"/>
    <in-spinner :loading="loading"/>
  </div>
</template>
<script>
  import {mapActions, mapGetters} from 'vuex';

  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";
  import {FETCH_POST, LOADING, moduleName as postsModule, POST, SELECTED_POST} from "Store/modules/posts";
  import {
    moduleName as postNavigationModule,
    FETCH_PREV_POSTS,
    FETCH_NEXT_POSTS,
    PREV_POSTS,
    NEXT_POSTS,
    LOADING_PREV,
    LOADING_NEXT,
    POST_NAVIGATION_ID
  } from "Store/modules/postNavigation";
  import Vue from 'vue'
  import Post from './main/Post.vue'
  import GroupOnePost from 'ComponentsVue/groups/groupComponents/groupOnePost.vue';
  import postSettings from 'ComponentsVue/main/postsettings/postSettings.vue'

  Vue.component('in-post-settings', postSettings);
  Vue.component('in-post', Post);
  Vue.component('in-group-one-post', GroupOnePost);
  export default {
    data() {
      return {
        postSlug: this.$route.params.slug,
        showPostSettingsModal: false,
        top: false,
        bottom: false,
        isPrev: false,
        isNext: false,
        scrollBottom: null,
        scrollTop: null,
        isMounted: false,
        showNavigation: false
      }
    },
    watch: {
      top(top) {
        if (top && this.post && this.showNavigation) {
          this.fetchPrevPosts({id: this.post.id, nickname: this.post.author.nickname});
        }
      },
      bottom(bottom) {
        if (bottom && this.post && this.showNavigation) {
          this.fetchNextPosts({id: this.post.id, nickname: this.post.author.nickname})
        }
      },
      prevPosts() {
        this.isPrev = true;
      },
      nextPosts() {
        this.isNext = true;
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if(from.path.includes('/u/') && !from.path.includes('/bookmark') && !from.path.includes('/mention')) {
          vm.showNavigation = true;
        }
      });
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER,
        loading: postsModule + LOADING,
        postInfo: postsModule + POST,
        selectedPost: postsModule + SELECTED_POST,
        prevPosts: postNavigationModule + PREV_POSTS,
        nextPosts: postNavigationModule + NEXT_POSTS,
        loadingPrev: postNavigationModule + LOADING_PREV,
        loadingNext: postNavigationModule + LOADING_NEXT,
        postNavigationId: postNavigationModule + POST_NAVIGATION_ID
      }),
      post() {
        return this.postInfo(this.postSlug)
      },
      isGroupPost() {
        return [2, 3, 5].indexOf(this.post && this.post.type) !== -1;
      },
      showMoreButton() {
        const {scrollHeight, clientHeight} = document.documentElement;
        return this.isMounted
          && scrollHeight <= clientHeight
          && (this.postNavigationId !== this.post.id
            || (this.postNavigationId === this.post.id && this.prevPosts.length === 0 && this.nextPosts.length === 0))
          && !this.loadingNext
          && this.showNavigation
      },
      toTopVisible() {
        return this.prevPosts.length > 0 ? 2000 : 1
      }
    },
    created() {
      window.addEventListener('scroll', this.handleVisible)
    },
    mounted() {
      if (this.post) {
        setTimeout(() => {
          this.fetchPost(this.postSlug);
        }, 0);
      } else {
        this.fetchPost(this.postSlug);
      }
      if (this.post && (this.nextPosts.length > 0 || this.prevPosts.length > 0)) {
        this.$refs.post.$el.scrollIntoView();
        window.scrollBy(0, -10);
      }
      this.isMounted = true;
    },
    beforeUpdate() {
      const {scrollY} = window;
      const {scrollHeight} = document.documentElement;

      if (this.isPrev) {
        this.scrollBottom = scrollHeight - scrollY;
      }
      if (this.isNext) {
        this.scrollTop = scrollY;
      }
    },
    updated() {
      this.top = false;
      this.bottom = false;
      this.scrollToPosition();
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleVisible);
    },
    methods: {
      ...mapActions({
        fetchPost: postsModule + FETCH_POST,
        fetchPrevPosts: postNavigationModule + FETCH_PREV_POSTS,
        fetchNextPosts: postNavigationModule + FETCH_NEXT_POSTS
      }),
      loadMore() {
        this.fetchNextPosts({id: this.post.id, nickname: this.post.author.nickname})
      },
      scrollToPosition() {
        if(this.isPrev) {
          this.isPrev = false;
          window.scrollTo(0, document.documentElement.scrollHeight - this.scrollBottom);
        } else if(this.isNext) {
          this.isNext = false;
          window.scrollTo(0, this.scrollTop);
        }
      },
      handleVisible() {
        this.top = this.topVisible();
        this.bottom = this.bottomVisible();
      },
      topVisible() {
        return window.scrollY < this.toTopVisible
      },
      bottomVisible() {
        const scrollY = window.scrollY;
        const visible = document.documentElement.clientHeight;
        const pageHeight = document.documentElement.scrollHeight;
        const bottomOfPage = visible + scrollY + 2000 >= pageHeight;
        return bottomOfPage || pageHeight < visible
      }
    }
  }
</script>
<style lang="less">
  @import '~LessStyle/post.less';
  @import '~LessStyle/sharemodal.less';

  .show-more {
    .text-grad();
  }
</style>

