<template>
  <div class="profile-container">
    <in-tabs
      v-if="isProfileOfAuthorizedUser"
      active-tab="posts">
      <in-tab name="posts">
        <span class="tab-name">{{$lang.variables.posts}}</span>
      </in-tab>
      <in-tab name="in-story" @click.native="changeTabHandler('in-story')">
        <span class="tab-name">{{$lang.variables.inStory}}</span>
      </in-tab>
    </in-tabs>
    <template v-if="user">
      <template v-if="user.id === authUser.id && posts">
        <div
          :class="postCount"
          :data-id="post.id"
          v-for="post in posts"
          v-if="posts.length > 0"
          :key="post.id">
          <in-profile-postsolo
            :post='post'
          />
        </div>
        <div v-else>
          {{$lang.variables.youHaveNoPosts}}
        </div>
      </template>
      <template v-else>
        <template v-if="user.privacy_settings.profile=='none'">{{$lang.variables.userPrivacyOn}}</template>
        <template v-else-if="user.privacy_settings.profile=='subs'">
          <template v-if="user.is_subscribed">
            <div
              :class="postCount"
              :data-id="post.id"
              v-for="post in posts"
              v-if="posts.length > 0"
              :key="post.id">
              <in-profile-postsolo
                :post='post'
              />
            </div>
            <template v-else>
              {{$lang.variables.thisUserHaveNoPosts}}
            </template>
          </template>
          <template v-else>
            {{$lang.variables.subscribeToThisAccount}}
          </template>
        </template>
        <template v-else-if="user.privacy_settings.profile === 'all' && posts">
          <div
            :class="postCount"
            :data-id="post.id"
            v-for="post in posts"
            v-if="posts.length > 0"
            :key="post.id">
            <in-profile-postsolo
              :post='post'
            />
          </div>
          <template v-else>
            {{$lang.variables.thisUserHaveNoPosts}}
          </template>
        </template>
      </template>
    </template>

    <in-spinner :loading="loading"></in-spinner>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {mapActions, mapGetters} from 'vuex'

  import ProfilePostSolo from './ProfilePostSolo.vue'
  import {scrollOnBottom} from "../../../mixins/scrollOnBottom";
  import {moduleName as countPostOnPageModule, PROFILE_POST_COUNT} from 'Store/modules/countPostOnPage';
  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";
  import {moduleName as usersModule, USER} from "Store/modules/users/users";
  import {
    FETCH_USER_PROFILE_POSTS,
    FETCH_USER_PROFILE_POSTS_NEXT_PAGE,
    LOADING,
    moduleName as usersProfilePostsModule,
    USER_PROFILE_POSTS
  } from "Store/modules/users/usersProfilePosts";

  Vue.component('in-profile-postsolo', ProfilePostSolo);

  export default {
    name: 'ProfilePost',
    mixins: [scrollOnBottom],
    data() {
      return {
        scrollPosition: 0,
        widthWindow: localStorage.getItem('clientWidth'),
        maxPageYOffset: 0,
        viewedPosts: [],
        votingPost: true,
        nickname: this.$route.params.nickname
      }
    },
    created() {
      window.addEventListener('scroll', this.addViewedPosts);
    },
    destroyed() {
      window.removeEventListener('scroll', this.addViewedPosts);
    },
    watch: {
      bottom(bottom) {
        if (bottom) {
          this.fetchPostsNextPage(this.nickname)
        }
      },
      '$route'(to, from) {
        console.log(to, from);
        if (to.path !== from.path) {
          this.nickname = this.$route.params.nickname;
          console.log('111ff');
          this.fetchPostsLazy();
        }
      }
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER,
        userInfo: usersModule + USER,
        profilePostCount: countPostOnPageModule + PROFILE_POST_COUNT,
        loading: usersProfilePostsModule + LOADING,
        postsInfo: usersProfilePostsModule + USER_PROFILE_POSTS
      }),
      user() {
        return (this.authUser && this.authUser.nickname === this.nickname) ? this.authUser : this.userInfo(this.nickname);
      },
      posts() {
        console.log(this.nickname);
        return this.postsInfo(this.$route.params.nickname);
      },
      postCount() {
        if (this.profilePostCount === '4')
          return 'prof-post profile-post';
        else if (this.profilePostCount === '2')
          return 'prof-post profile-post-big';
        else
          return 'prof-post profile-post-big';
      },
      isProfileOfAuthorizedUser() {
        return this.authUser.nickname === this.nickname;
      },
    },
    mounted() {
      this.fetchPostsLazy();
    },
    beforeRouteLeave(to, from, next) {
      this.addViewedPosts();
      this.sendViewedPosts();
      next();
    },
    methods: {
      ...mapActions({
        fetchPosts: usersProfilePostsModule + FETCH_USER_PROFILE_POSTS,
        fetchPostsNextPage: usersProfilePostsModule + FETCH_USER_PROFILE_POSTS_NEXT_PAGE
      }),
      fetchPostsLazy() {
        if(this.posts) {
          setTimeout(() => {
            this.fetchPosts(this.nickname);
          }, 0);
        } else {
          this.fetchPosts(this.nickname);
        }
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
          let posts = document.querySelectorAll('div[data-id].prof-post');

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
      changeTabHandler(tabName) {
        tabName === 'in-story' && this.redirectToStories();
      },
      redirectToStories() {
        this.$router.push({name: 'profile-stories'});
      }
    }
  }
</script>
<style>
  .profile-video--play {
    position: absolute;
    width: 35%;
    left: 37%;
    top: 31%;
  }

  .profile-container {
    text-align: left;
    display: flex;
    flex-wrap: wrap

  }

  .profile-post img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 5px;
  }

  .profile-post video {
    width: 100%;
    display: block;
    border-radius: 10px;
    background-color: #000;
  }

  .post-type--play {
    position: absolute;
    width: 30%;
    left: 35%;
    top: 35%;

  }

  .post-type--play img {
    border-radius: 0px !important;
  }

  .profile-post-big video {
    width: 100%;
    display: block;
    border-radius: 10px;
    background-color: #000;
  }

  #SpinnerOnloadImg {
    display: block;
    width: 35%;
    margin: auto;
  }


</style>
