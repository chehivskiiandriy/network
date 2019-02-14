<template>
    <in-stories-page
      :storiesQueue="storiesQueue"
      :pointer="pointer"
      :progress="progress"
      :isTimerPaused="isTimerPaused"
      :is-story-album="isStoryAlbum"
      :story-album-id="storyAlbumId"
      @navigation:close="closeStoriesPage"
      @navigation:toggle-timer="toggleAnimation"
      @navigation:pause-timer="pauseAnimation"
      @navigation:resume-timer="resumeAnimation"
      @navigation:previous="showPreviousStory"
      @navigation:next="showNextStory"
      @navigation:next-after-deleting="showNextStory(true)"/>
</template>

<script>
  import {mapActions, mapGetters, mapMutations} from 'vuex';

  import {
    FETCH_USERS_WHO_HAS_ACTIVE_STORIES,
    NICKNAMES_OF_USERS_WHO_HAS_ACTIVE_STORIES,
    moduleName as usersWhoHasActiveStories,
  } from 'Store/modules/usersWhoHasActiveStories';

  import {
    FETCH_USER_ARCHIVED_STORIES,
    FETCH_USER_ARCHIVED_STORIES_NEXT_PAGE,
    IS_HAVE_TO_SHOW_ARCHIVED_STORIES_LOADING_SPINNER,
    GET_ARCHIVED_STORY_BY_SLUG,
    USER_ARCHIVED_STORIES,
    moduleName as userArchivedStoriesModule,
  } from 'Store/modules/users/userArchivedStories';

  import {
    FETCH_USER_ACTIVE_STORIES,
    FETCH_USER_ACTIVE_STORIES_NEXT_PAGE,
    IS_HAVE_TO_SHOW_ACTIVE_STORIES_LOADING_SPINNER,
    GET_USER_ACTIVE_STORIES_BY_NICKNAME,
    GET_ACTIVE_STORY_BY_SLUG,
    moduleName as userActiveStoriesModule,
  } from 'Store/modules/users/userActiveStories';

  import {
    FETCH_USER_STORY_ALBUM,
    GET_ALBUM_STORIES_BY_ALBUM_ID,
    moduleName as userStoryAlbumsModule,
  } from 'Store/modules/users/userStoryAlbums';

  import {
    SET_NEXT_ROUTE,
    SET_ROUTE_TO_COME_BACK,
    NEXT_ROUTE,
    ROUTE_TO_COME_BACK,
    moduleName as storiesNavigationModule,
  } from 'Store/modules/storiesNavigation';

  import StoriesPage from 'ComponentsVue/StoriesPage';

  export default {
    components: {
      inStoriesPage: StoriesPage,
    },
    props: {
      showingDuration: {
        type: Number,
        default: 5000,
      },
    },
    data() {
      return {
        pointer: 0,
        progress: 0,
        timerId: null,
        isTimerPaused: false,
      };
    },
    computed: {
      ...mapGetters({
        getActiveStoriesByNickname: userActiveStoriesModule + GET_USER_ACTIVE_STORIES_BY_NICKNAME,
        getActiveStoryBySlug: userActiveStoriesModule + GET_ACTIVE_STORY_BY_SLUG,
        archivedStories: userArchivedStoriesModule + USER_ARCHIVED_STORIES,
        getArchivedStoryBySlug: userArchivedStoriesModule + GET_ARCHIVED_STORY_BY_SLUG,
        getAlbumStoriesByAlbumId: userStoryAlbumsModule + GET_ALBUM_STORIES_BY_ALBUM_ID,
        availableStoriesNicknames: usersWhoHasActiveStories + NICKNAMES_OF_USERS_WHO_HAS_ACTIVE_STORIES,
        nextRoute: storiesNavigationModule + NEXT_ROUTE,
        routeToComeBack: storiesNavigationModule + ROUTE_TO_COME_BACK,
      }),
      requestedStorySlug() {
        return this.$route.params.storySlug;
      },
      requestedAuthorNickname() {
        return this.$route.params.nickname;
      },
      requestedAlbumId() {
        return Number.parseInt(this.$route.params.albumId, 10);
      },
      requestType() {
        return this.$route.meta.type;
      },
      shouldShowStoriesOfAllUsers() {
        return this.routeToComeBack && this.routeToComeBack.name === 'main-page';
      },
      storiesQueue() {
        switch (this.requestType) {
          case 'active':
            if (this.requestedStorySlug) {
              const story = this.getActiveStoryBySlug(this.requestedStorySlug);
              return story && [story];
            } else {
              return this.getActiveStoriesByNickname(this.requestedAuthorNickname);
            }
          case 'archived':
            const story = this.getArchivedStoryBySlug(this.requestedStorySlug);
            return story && [story];
          case 'album':
            return this.getAlbumStoriesByAlbumId(this.requestedAlbumId);
        }
      },
      millisecondsForOnePercent() {
        return this.showingDuration / 100;
      },
      nextNickname () {
        if (this.shouldShowStoriesOfAllUsers) {
          const indexOfCurrentNickname = this.availableStoriesNicknames.indexOf(this.requestedAuthorNickname),
            nextIndex = indexOfCurrentNickname + 1;
          return (this.availableStoriesNicknames.length > nextIndex) && this.availableStoriesNicknames[nextIndex];
        }
      },
      previousNickname () {
        if (this.shouldShowStoriesOfAllUsers) {
          const indexOfCurrentNickname = this.availableStoriesNicknames.indexOf(this.requestedAuthorNickname),
            previousIndex = indexOfCurrentNickname - 1;
          return (indexOfCurrentNickname > 0) && (previousIndex >= 0) && this.availableStoriesNicknames[previousIndex];
        }
      },
      isStoryAlbum() {
        return this.$route.meta.type === 'album';
      },
      storyAlbumId() {
        return this.requestedAlbumId;
      }
    },
    methods: {
      ...mapActions({
        fetchArchivedStories: userArchivedStoriesModule + FETCH_USER_ARCHIVED_STORIES,
        fetchActiveStories: userActiveStoriesModule + FETCH_USER_ACTIVE_STORIES,
        fetchStoryAlbum: userStoryAlbumsModule + FETCH_USER_STORY_ALBUM,
        fetchUsersWhoHasActiveStories: usersWhoHasActiveStories + FETCH_USERS_WHO_HAS_ACTIVE_STORIES,
      }),
      ...mapMutations({
        setNextRoute: storiesNavigationModule + SET_NEXT_ROUTE,
        setRouteToComeBack: storiesNavigationModule + SET_ROUTE_TO_COME_BACK,
      }),
      async fetchData(route = this.$route) {
        const requestType = route.meta.type,
          requestedAuthorNickname = route.params.nickname,
          requestedAlbumId = route.params.albumId;
        switch (requestType) {
          case 'active':
            await this.fetchDataForActiveStoriesRequest(requestedAuthorNickname);
            break;
          case 'archived':
            await this.fetchDataForArchivedStoryRequest();
            break;
          case 'album':
            await this.fetchDataForStoryAlbumRequest(requestedAlbumId);
            break;
        }
      },
      async fetchDataForActiveStoriesRequest(requestedAuthorNickname) {
        await this.fetchActiveStories({nickname: requestedAuthorNickname});
        if (this.shouldShowStoriesOfAllUsers && this.availableStoriesNicknames.length <= 1) {
          await this.fetchUsersWhoHasActiveStories();
        }
      },
      async fetchDataForStoryAlbumRequest(requestedAlbumId) {
        await this.fetchStoryAlbum({id: requestedAlbumId});
      },
      async fetchDataForArchivedStoryRequest() {
        await this.fetchArchivedStories();
      },
      startTimer() {
        this.timerId = setInterval(this.timerHandler, this.millisecondsForOnePercent);
      },
      timerHandler() {
        if (this.isTimerPaused) {
          return;
        }
        this.progress++;
        if (this.progress > 100) {
          this.showNextStory();
        }
      },
      clearTimer() {
        clearInterval(this.timerId);
        this.timerId = null;
      },
      showNextStory(isAfterDeleting = false) {
        if(!isAfterDeleting) {
          this.pointer++;
        }
        if (this.storiesQueue && this.storiesQueue.length > this.pointer) {
          this.beforeStoryShowed();
          this.afterStoryShowed();
        } else if (this.nextNickname) {
          this.beforeStoryShowed();
          this.$router.replace({
            name: 'active-stories',
            params: {
              nickname: this.nextNickname,
            },
          });
        } else {
          this.closeStoriesPage();
        }
      },
      showPreviousStory() {
        if (this.storiesQueue && this.pointer > 0) {
          this.pointer--;
          this.beforeStoryShowed();
          this.afterStoryShowed();
        } else if (this.previousNickname) {
          this.beforeStoryShowed();
          this.$router.replace({
            name: 'active-stories',
            params: {
              nickname: this.previousNickname,
            },
          });
        }
      },
      beforeStoryShowed() {
        this.clearTimer();
        this.progress = 0;
        this.isTimerPaused = false;
      },
      async afterStoryShowed() {
        this.startTimer();
        /* pre-load stories in advance */
        if(this.nextNickname) {
          await this.fetchActiveStories({nickname: this.nextNickname});
        }
      },
      closeStoriesPage() {
        this.$router.push(this.routeToComeBack ? {...this.routeToComeBack} : '/');
      },
      toggleAnimation() {
        this.isTimerPaused = !this.isTimerPaused;
      },
      resumeAnimation() {
        this.isTimerPaused = false;
      },
      pauseAnimation() {
        this.isTimerPaused = true;
      },
    },
    beforeRouteEnter(to, from, next) {
      console.log(2)
      next(async vm => {
        vm.pointer = 0;
        console.log(vm.nextRoute, from, vm.nextRoute !== from);
        if(vm.nextRoute === null || vm.nextRoute.path !== from.path) {
          vm.setRouteToComeBack({route: from});
        }
        vm.beforeStoryShowed();
        await vm.fetchData.bind(vm)(to);
        vm.afterStoryShowed();
      })
    },
    async beforeRouteUpdate(to, from, next) {
      console.log(3)
      this.pointer = 0;
      this.$nextTick(async () => {
        this.beforeStoryShowed();
        await this.fetchData(to);
        this.afterStoryShowed();
      });
      next();
    },
    beforeRouteLeave(to, from, next) {
      console.log(4)
      this.clearTimer();
      this.setNextRoute({route: to});
      next();
    },
  }
</script>
