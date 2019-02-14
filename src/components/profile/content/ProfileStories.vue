<template>
  <div class="profile-container">
    <in-tabs
      v-if="isProfileOfAuthorizedUser"
      active-tab="in-story">
      <in-tab name="posts" @click.native="changeTabHandler('posts')">
        <span class="tab-name">{{$lang.variables.posts}}</span>
      </in-tab>
      <in-tab name="in-story">
        <span class="tab-name">{{$lang.variables.inStory}}</span>
      </in-tab>
    </in-tabs>
    <div class="profile-stories-list">
      <div class="profile-stories-list__empty-message profile-stories-empty-message"
           v-if="archivedStories.length < 1 && !loading">
        <p class="profile-stories-empty-message__top-message">{{$lang.variables.youHaveNotInStories}}</p>
        <router-link :event="''" @click.native.prevent="selectFileForNewInStory" to="/add-story">
          <img class="profile-stories-empty-message__image"
               src="https://media.inrating.top/storage/img/default/new_story.png"/>
        </router-link>
        <input @change="changeFileHandler" type="file" ref="fileInput" id="file-input" accept="image/*, video/*">
        <p class="profile-stories-empty-message__bottom-message">{{$lang.variables.addYourFirstInStory}}</p>
      </div>
      <in-profile-stories-item
        v-else
        :class="postCount"
        :data-id="story.id"
        v-for="story in archivedStories"
        :key="story.id"
        :story='story'
      />
    </div>

    <in-spinner :loading="loading"></in-spinner>
  </div>
</template>
<script>
  import axios from 'axios';

  import Vue from 'vue'
  import {mapActions, mapGetters} from 'vuex'

  import ProfileStoriesItem from './ProfileStoriesItem.vue'
  import {scrollOnBottom} from '../../../mixins/scrollOnBottom';
  import {AUTH_USER, moduleName as userModule} from 'Store/modules/authUser/user';
  import {moduleName as usersModule, USER} from 'Store/modules/users/users';
  import {moduleName as countPostOnPageModule, PROFILE_POST_COUNT} from 'Store/modules/countPostOnPage';
  import {
    FETCH_USER_ARCHIVED_STORIES,
    FETCH_USER_ARCHIVED_STORIES_NEXT_PAGE,
    IS_HAVE_TO_SHOW_ARCHIVED_STORIES_LOADING_SPINNER,
    USER_ARCHIVED_STORIES,
    moduleName as userArchivedStoriesModule,
  } from 'Store/modules/users/userArchivedStories';

  export default {
    name: 'ProfileStories',
    mixins: [scrollOnBottom],
    components: {
      inProfileStoriesItem: ProfileStoriesItem,
    },
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
    watch: {
      bottom(bottom) {
        if (bottom) {
          this.fetchArchivedStoriesNextPage()
        }
      },
      '$route'(to, from) {
        console.log(to, from);
        if (to.path !== from.path) {
          this.nickname = this.$route.params.nickname;
          console.log('111ff');
          this.fetchArchivedStoriesLazy();
        }
      }
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER,
        userInfo: usersModule + USER,
        profilePostCount: countPostOnPageModule + PROFILE_POST_COUNT,
        archivedStories: userArchivedStoriesModule + USER_ARCHIVED_STORIES,
        loading: userArchivedStoriesModule + IS_HAVE_TO_SHOW_ARCHIVED_STORIES_LOADING_SPINNER,
      }),
      user() {
        return (this.authUser && this.authUser.nickname === this.nickname) ? this.authUser : this.userInfo(this.nickname);
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
      this.fetchArchivedStoriesLazy();
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if(vm.authUser.nickname !== to.params.nickname) {
          return {
            name: 'profile-posts',
            params: {
              nickname: to.params.nickname,
            },
          };
        }
      });
    },
    beforeRouteLeave(to, from, next) {
      next();
    },
    methods: {
      ...mapActions({
        fetchArchivedStories: userArchivedStoriesModule + FETCH_USER_ARCHIVED_STORIES,
        fetchArchivedStoriesNextPage: userArchivedStoriesModule + FETCH_USER_ARCHIVED_STORIES_NEXT_PAGE,
      }),
      fetchArchivedStoriesLazy() {
        if(this.archivedStories) {
          setTimeout(() => {
            this.fetchArchivedStories();
          }, 0);
        } else {
          this.fetchArchivedStories();
        }
      },
      redirectToPosts() {
        this.$router.push({name: 'profile-posts'});
      },
      selectFileForNewInStory(event) {
        this.$refs.fileInput.click();
      },
      changeFileHandler(event) {
        this.storyFile = event.target.files[0];
        window.story.dispatch('LOAD_NEW_STORY', this.storyFile);
        this.$router.push('/add-story');
      },
      changeTabHandler(tabName) {
        tabName === 'posts' && this.redirectToPosts();
      },
    }
  }
</script>
<style lang="less">
  @import '~LessStyle/variables.less';

  .profile-video--play {
    position: absolute;
    width: 35%;
    left: 37%;
    top: 31%;
  }

  .profile-stories-list {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
  }

  .profile-stories-list__empty-message {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
  }

  .profile-stories-empty-message {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
  }

  .profile-stories-empty-message__image {
    width: 36vw;
    border-radius: 10px;
    box-shadow: 0 0 5px 1px rgba(150, 150, 150, 0.5);
  }

  .profile-stories-empty-message__top-message {
    font-size: 4.3vw;
    font-weight: bold;
    color: @black;
    margin: 20px 0;
  }

  .profile-stories-empty-message__bottom-message {
    font-size: 4.3vw;
    font-style: italic;
    color: @dark_dark_grey;
    margin: 10px 0;
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
