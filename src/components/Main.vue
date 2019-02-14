<template>
  <div>
    <div
      ref="rateCarousel"
      class="story-carousel">
      <h5 class="story-title">InStory</h5>
      <carousel
        :perPage=6
        :paginationEnabled="false">
        <slide class="story-carousel-item">
          <div
            v-if="authUser && authUser.status !== 'guest'"
            class="story-carousel-image">
            <img
              class="story-avatar"
              src="https://media.inrating.top/storage/img/default/new_story.png"
              @click="addFileStory"/>
            <input @change="changeFile()" type="file" ref="fileInput" id="file-input" accept="image/*, video/*">
            <p class="rate-carousel--nickname add-story-text">{{$lang.variables.append}} InStory</p>
          </div>
          <div
            v-else
            @click="showGuest()"
            class="story-carousel-image">
            <img
              class="story-avatar"
              src="https://media.inrating.top/storage/img/default/new_story.png"/>
            <p class="rate-carousel--nickname add-story-text">{{$lang.variables.append}} InStory</p>
          </div>
        </slide>
        <slide
          class="story-carousel-item"
          v-for="(story,i) in activeStories"
          :key="i">
          <div class="story-carousel-image">
            <router-link :to="{name: 'active-stories', params: {nickname: story.author.nickname}}">
              <img
                :src="story.author.avatar_image.url_small"
                v-if="!story.is_seen"
                class="story-avatar not-see-story"/>
              <img
                :src="story.author.avatar_image.url_small"
                v-else
                class="story-avatar see-story"/>
              <div v-if="story.author.active_gift!=null">
                <img
                  class="story-img--present"
                  :src="story.author.active_gift.image"
                  alt="">
              </div>
            </router-link>
            <p
              class="rate-carousel--nickname"
              v-text="story.author.nickname"></p>
          </div>
        </slide>
        <slide></slide>
        <slide></slide>
      </carousel>
    </div>

    <in-banner :banners="banners"></in-banner>

    <in-recommendation  v-if="authUser && authUser.status !== 'guest'" />

    <in-new-post-loading v-if="newPostLoading" />

    <in-bubble />

    <div id="mainPage" v-if="posts">
      <template v-if="posts.length > 0">
        <div
          :class="changeClasses"
          v-for="post in posts"
          :key="post.id"
          :data-id="post.id"
          ref="posts">
          <div :id="post.id">
            <in-post @show-post-settings="showPostSettingsModal = true" v-show="countPostOnPage === '1'" :post='post'/>
            <in-postsmall v-show="countPostOnPage === '2'" :post='post'/>
          </div>
        </div>
      </template>
      <template v-else-if="!loading">
        <div class="find-none">{{$lang.variables.noResultsFoundForYourRequest}}</div>
        <button @click="openMainFilters">{{$lang.variables.change}}</button>
      </template>

      <in-post-settings :show.sync="showPostSettingsModal" :user="authUser" />
      <in-post-share-modal
        v-if="selectedPost"
        :selectedPost="selectedPost" />
    </div>
    <in-spinner :loading="loading"></in-spinner>

    <filter-main @setFilters="fetchPosts"/>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {mapActions, mapGetters} from 'vuex';
  import Post from './main/Post.vue'
  import postSmall from './main/postSmall.vue'
  import postSettings from 'ComponentsVue/main/postsettings/postSettings.vue'
  import {scrollOnBottom} from "../mixins/scrollOnBottom";
  import FilterMain from 'ComponentsVue/filter/FilterMain';
  import {HOME_POST_COUNT, moduleName as countPostOnPageModule} from "Store/modules/countPostOnPage";
  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";
  import {
    FETCH_MAIN_POSTS,
    FETCH_MAIN_POSTS_NEXT_PAGE,
    LOADING,
    MAIN_POSTS,
    CHECK_NEW_POSTS,
    moduleName as mainPostsModule
  } from "Store/modules/mainPosts";
  import {
    moduleName as newPostModule,
    LOADING as NEW_POST_LOADING
  } from "Store/modules/newPost";
  import {
    moduleName as postsModule,
    SELECTED_POST
  } from "Store/modules/posts";
  import {
    moduleName as bannersModule,
    BANNERS,
    FETCH_BANNERS
  } from "Store/modules/banners";

  import Recommendation from "ComponentsVue/main/RecommendationMain.vue";
  import NewPostLoading from "ComponentsVue/main/NewPostLoading";
  import Banner from "ComponentsVue/Banner";
  import Bubble from "ComponentsVue/main/Bubble";

  import {
    FETCH_USERS_WHO_HAS_ACTIVE_STORIES,
    USERS_WHO_HAS_ACTIVE_STORIES,
    moduleName as usersWhoHasActiveStories,
  } from 'Store/modules/usersWhoHasActiveStories';

  Vue.component('in-post', Post);
  Vue.component('in-post-settings', postSettings);
  Vue.component('in-postsmall', postSmall);
  Vue.component('in-recommendation', Recommendation);

  export default {
    name: 'mainPage',
    props: ['changeView'],
    mixins: [scrollOnBottom],
    components: {
      FilterMain,
      inNewPostLoading: NewPostLoading,
      inBanner: Banner,
      inBubble: Bubble
    },
    data() {
      return {
        shareID: '',
        postAuthor: {},
        postOutCount: '',
        rateByDay: [],
        rateByWeek: [],
        rateByMonth: [],
        clientWidth: '',
        scrollPosition: 0,
        storiesArray: [],
        authorStory: [],
        viewArray: [],
        myStory: null,
        slideCount: 5,
        maxPageYOffset: 0,
        viewedPosts: [],
        storyFile: {},
        site_link: '',
        title: '',
        showRecommendations: true,
        showPostSettingsModal: false,
      }
    },
    watch: {
      bottom(bottom) {
        if (bottom) {
          this.fetchPostsNextPage()
        }
      },
      countPostOnPage() {
        const header = document.querySelector('#header'),
          postContainers = this.$refs.posts,
          indexOfPostWithVisibleTop = postContainers.findIndex(postContainer => postContainer.offsetTop > window.scrollY),
          postWithVisibleTop = postContainers[indexOfPostWithVisibleTop],
          postBeforeTheOneWithVisibleTop = (indexOfPostWithVisibleTop - 1 >= 0) && postContainers[indexOfPostWithVisibleTop - 1],
          anchoragePost = (postWithVisibleTop.offsetTop - window.scrollY) <= (window.innerHeight / 2)
            ? postWithVisibleTop
            : (postBeforeTheOneWithVisibleTop || postWithVisibleTop);
        this.$nextTick(() => {
          anchoragePost.scrollIntoView(true);
          window.scrollTo(window.scrollX, window.scrollY - (header.clientHeight + 10))
        });
      }
    },
    computed: {
      ...mapGetters({
        countPostOnPage: countPostOnPageModule + HOME_POST_COUNT,
        authUser: userModule + AUTH_USER,
        posts: mainPostsModule + MAIN_POSTS,
        loading: mainPostsModule + LOADING,
        newPostLoading: newPostModule + NEW_POST_LOADING,
        activeStories: usersWhoHasActiveStories + USERS_WHO_HAS_ACTIVE_STORIES,
        selectedPost: postsModule + SELECTED_POST,
        banners: bannersModule + BANNERS
      }),
      changeClasses() {
        return this.countPostOnPage === '1' ? 'posts-container' : 'postssmall-container';
      }
    },
    mounted() {
      this.$root.$on('getGuestToken', () => {
        this.getAllStories();
      });
      if (localStorage.getItem('token') === undefined && this.$router.indexOf('/u/') === -1) {
        this.$router.push('/login');
      }

      if(!this.banners) {
        this.fetchBanners();
      }

      this.clientWidth = window.innerWidth;
      localStorage.setItem('clientWidth', this.clientWidth);
      if (this.posts.length > 0) {
        console.log('check');
        this.checkNewPosts();
      } else {
        console.log('fetch');
        this.fetchPosts();
      }

      this.getAllStories();
    },
    created() {
      window.addEventListener('scroll', this.addViewedPosts);
    },
    updated() {
      console.log('updated main');
    },
    destroyed() {
      window.removeEventListener('scroll', this.addViewedPosts);
    },
    beforeRouteLeave(to, from, next) {
      this.addViewedPosts();
      this.sendViewedPosts();
      next();
    },
    methods: {
      ...mapActions({
        fetchPosts: mainPostsModule + FETCH_MAIN_POSTS,
        fetchPostsNextPageAction: mainPostsModule + FETCH_MAIN_POSTS_NEXT_PAGE,
        fetchUsersWhoHasActiveStories: usersWhoHasActiveStories + FETCH_USERS_WHO_HAS_ACTIVE_STORIES,
        fetchBanners: bannersModule + FETCH_BANNERS,
        checkNewPosts: mainPostsModule + CHECK_NEW_POSTS
      }),
      async getAllStories() {
        await this.fetchUsersWhoHasActiveStories();
      },
      showInfo() {
        console.log(this.posts);
        console.log(this.loading);
        console.log(this.myStory);
      },
      fetchPostsNextPage() {
        const payload = {
          onSuccess: this.sendViewedPosts
        };
        this.fetchPostsNextPageAction(payload);
      },
      openMainFilters() {
        this.$root.$emit('openMainFilters');
        document.getElementsByTagName('html')[0].style.overflow = 'hidden';
      },
      changeFile() {
        this.storyFile = document.getElementById('file-input').files[0];

        window.story.dispatch('LOAD_NEW_STORY', this.storyFile);

        this.$router.push('/add-story');
      },
      addFileStory() {
        this.$refs.fileInput.click();
      },
      async sendViewedPosts() {
        if (this.viewedPosts.length !== 0) {
          const data = new FormData();
          data.append('ids', JSON.stringify(this.viewedPosts));

          await this.$api.users.sendViewedPosts(data);
          this.viewedPosts = [];
        }
      },
      addViewedPosts() {
        if (this.maxPageYOffset <= window.pageYOffset) {
          this.maxPageYOffset = window.pageYOffset;
          let posts = document.querySelectorAll('div[data-id].posts-container');

          for (let i = 0; i < posts.length; i++) {
            if (window.pageYOffset + document.documentElement.clientHeight > posts[i].offsetTop) {
              if (posts[i].hasAttribute('data-id')) {
                this.viewedPosts.push(posts[i].getAttribute('data-id'));
                posts[i].removeAttribute('data-id');
              }
            }
          }
        }
      },
      showGuest() {
        this.$notify({
          group: 'guest-template',
          duration: 3000,
          speed: 300,
        });
      },
      checkAuthor(e) {
        this.postAuthor = e;
      },
      handleScroll() {

        let carouselBlock = this.$refs.rateCarousel.childNodes[2].childNodes[0];

        let carouselHeader = this.$refs.rateCarousel.childNodes[0];
        let curentPosition = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
        if ((curentPosition > this.scrollPosition) && (curentPosition > 350)) {
          this.scrollPosition = curentPosition;
          carouselBlock.style.height = '0px';
          carouselHeader.style.display = 'none';
        }
        else {
          this.scrollPosition = curentPosition;
          carouselBlock.style.height = 30 + clientWidth * 0.16 + 'px';
          carouselHeader.style.display = 'block';
        }
      },
    },
    head: {
      title() {
        return {
          inner: this.$lang.variables.main
        }
      }
    }
  }
</script>


<style lang="less">
  .find-none {
    margin: 20px;
  }

  @import '~LessStyle/sharemodal.less';
  @import '~LessStyle/ratecarousel.less';
</style>
