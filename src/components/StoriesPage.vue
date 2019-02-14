<template>
  <div v-if="currentStory">
    <in-story-header
      :stories-queue="queueForHeader"
      :current-story-index="pointer"
      :author="authorForHeader"
      :current-story-show-progress="progress"
      @close="closeStoryPage" />
    <in-story-media
      :preview-source="previewSource"
      :media-source="mediaSource"
      :media-type="mediaType"
      :play-video="isTimerPaused"
      @toggle-animation="toggleTimer"
      @left-click="goToPreviousStory"
      @right-click="goToNextStory"/>
    <in-story-footer
      :text="storyTitle"
      :story-id="storyId"
      :is-story-liked="isStoryLiked"
      :is-story-bookmarked="isStoryBookmarked"
      :active-gift-id="activeGiftId"
      :is-story-authored-by-current-user="!isThisStoryNotByCurrentUser"
      :is-paused="isTimerPaused"
      @action:open-chat="checkChats"
      @action:show-gifts="showPresentsModal"
      @action:like="like"
      @action:add-to-bookmarks="addToBookmarks"
      @action:show-statistics="showStatistics"
      @action:open-menu="openMenu"/>
    <in-story-menu
      :show.sync="showStoryMenu"
      :is-by-authorized-user="!isThisStoryNotByCurrentUser"
      :is-authorized-user-follow-author="isAuthorizedUserFollowStoryAuthor"
      :is-story-album="isStoryAlbum"
      @action:delete="deleteStory"
      @action:unsubscribe="unsubscribeFromAuthor"
      @action:add-to-blacklist="addAuthorToBlacklist"
      @action:delete-story-album="deleteStoryAlbum"/>
    <in-wallet-presents-user-modal
      v-if="isShowPresentsModal"
      @hide-present-modal="hidePresentsModal"/>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations} from 'vuex';
  import axios from 'axios';

  import {
    LIKE_STORY_POST,
    BOOKMARK_STORY_POST,
    DELETE_STORY_POST,
    UNSUBSCRIBE_FROM_AUTHOR_OF_STORY_POST,
    moduleName as userStoryPostsModule,
  } from 'Store/modules/users/userStoryPosts';

  import {
    DELETE_USER_STORY_ALBUM,
    moduleName as userStoryAlbumsModule,
  } from 'Store/modules/users/userStoryAlbums';

  import {
    CHANGE_SUBSCRIBE_USER,
    FETCH_USER,
    LOADING,
    USER,
    moduleName as usersModule,
  } from 'Store/modules/users/users';

  import {AUTH_USER, FETCH_CURRENT_USER, moduleName as authUserModule} from 'Store/modules/authUser/user';

  import {
    ADD_TO_BLACK_LIST,
    moduleName as blackListModule,
  } from 'Store/modules/authUser/blackList';

  import {moduleName as walletModule, CHANGE_SELECTED_USER} from "Store/modules/wallet";

  import WalletPresentsUserModal from 'ComponentsVue/wallet/WalletPresentsUserModal';
  import StoryHeader from 'ComponentsVue/story/StoryHeader';
  import StoryMedia from 'ComponentsVue/story/StoryMedia';
  import StoryFooter from 'ComponentsVue/story/StoryFooter';
  import StoryMenu from 'ComponentsVue/story/StoryMenu';


  export default {
    components: {
      inStoryHeader: StoryHeader,
      inStoryMedia: StoryMedia,
      inStoryFooter: StoryFooter,
      inStoryMenu: StoryMenu,
      inWalletPresentsUserModal: WalletPresentsUserModal,
    },
    props: {
      storiesQueue: Array,
      pointer: Number,
      progress: Number,
      isTimerPaused: Boolean,
      isStoryAlbum: Boolean,
      storyAlbumId: Number,
    },
    data() {
      return {
        showStoryMenu: false,
        isShowPresentsModal: false,
      };
    },
    watch: {
      showStoryMenu(isShow) {
        isShow
          ? this.pauseTimer()
          : this.resumeTimer();
      },
    },
    computed: {
      ...mapGetters({
        authUser: authUserModule + AUTH_USER,
        getUserInfoByNickname: usersModule + USER,
      }),
      queueForHeader() {
        const { storiesQueue, pointer } = this;
        return storiesQueue && storiesQueue.map(story => {
          let thumbSource = story.mediaType === 'image'
            ? story.media.url_small
            : story.media.preview_url;
          return {
            createdAtTimestamp: story.created_at_timestamp * 1000,
            thumbSource,
          };
        });
      },
      authorForHeader() {
        const userInfo = this.currentStoryAuthor;
        return {
          nickname: this.currentStoryAuthorNickname,
          rating: userInfo && userInfo.rating.value,
          avatarSource: userInfo && userInfo.avatar_image && userInfo.avatar_image.url_small,
        }
      },
      currentStory() {
        const { storiesQueue, pointer } = this;
        return storiesQueue && storiesQueue[pointer];
      },
      currentStoryAuthor() {
        return this.currentStory && this.currentStory.author;
      },
      mediaType() {
        return this.currentStory && this.currentStory.mediaType;
      },
      previewSource() {
        return this.currentStory && (this.mediaType === 'image'
          ? this.currentStory.media.url_small
          : this.currentStory.media.preview_url);
      },
      mediaSource() {
        return this.currentStory && this.currentStory.media && this.currentStory.media.url;
      },
      storyTitle() {
        return this.currentStory && this.currentStory.title;
      },
      storyId() {
        return this.currentStory && Number.parseInt(this.currentStory.id, 10);
      },
      isStoryLiked() {
        return this.currentStory && this.currentStory.is_liked;
      },
      isStoryBookmarked() {
        return this.currentStory && this.currentStory.is_bookmarked;
      },
      currentStoryAuthorNickname() {
        const { currentStoryAuthor } = this;
        return currentStoryAuthor && currentStoryAuthor.nickname;
      },
      currentStoryAuthorId() {
        const { currentStoryAuthor } = this;
        return currentStoryAuthor && currentStoryAuthor.id;
      },
      currentUserId() {
        const { authUser } = this;
        return authUser && authUser.id;
      },
      isThisStoryNotByCurrentUser () {
        const { currentStoryAuthorId, currentUserId } = this;
        return currentUserId !== currentStoryAuthorId
      },
      isCurrentUserNotGuest() {
        const { authUser } = this;
        return authUser && authUser.status && authUser.status !== 'guest';
      },
      activeGiftId() {
        const { authUser } = this;
        return authUser && authUser.active_gift && authUser.active_gift.id;
      },
      storySlug() {
        const { requestedStorySlug, currentStory } = this;
        return requestedStorySlug || (currentStory && currentStory.slug);
      },
      isAuthorizedUserFollowStoryAuthor() {
        const { currentStory } = this;
        return currentStory && currentStory.author && currentStory.author.is_subscribed;
      }
    },
    methods: {
      ...mapActions({
        fetchUser: usersModule + FETCH_USER,
        fetchCurrentUser: authUserModule + FETCH_CURRENT_USER,
        likeStoryPost: userStoryPostsModule + LIKE_STORY_POST,
        bookmarkStoryPost: userStoryPostsModule + BOOKMARK_STORY_POST,
        deleteStoryPost: userStoryPostsModule + DELETE_STORY_POST,
        unsubscribeFromAuthorOfStoryPost: userStoryPostsModule + UNSUBSCRIBE_FROM_AUTHOR_OF_STORY_POST,
        changeSubscribeUser: usersModule + CHANGE_SUBSCRIBE_USER,
        addAuthorOfStoryToBlacklist: blackListModule + ADD_TO_BLACK_LIST,
        deleteUserStoryAlbum: userStoryAlbumsModule + DELETE_USER_STORY_ALBUM,
      }),
      ...mapMutations({
        changeSelectedUser: walletModule + CHANGE_SELECTED_USER
      }),
      showPresentsModal() {
        const {isCurrentUserNotGuest, currentStoryAuthor} = this;

        if (isCurrentUserNotGuest) {
          this.pauseTimer();
          this.changeSelectedUser(currentStoryAuthor);
          this.$root.$on('continueStory', this.resumeTimer);
          this.isShowPresentsModal = true;
        } else {
          this.notifyAboutGuestMode()
        }
      },
      hidePresentsModal() {
        this.isShowPresentsModal = false;
      },
      async checkChats() {
        const {isThisStoryNotByCurrentUser, isCurrentUserNotGuest, currentStoryAuthorId} = this;

        if (isCurrentUserNotGuest) {
          if (isThisStoryNotByCurrentUser) {
            await this.redirectToChatWith(currentStoryAuthorId);
          } else {
            this.notifyAboutCantChatWithYourself();
          }
        } else {
          this.notifyAboutGuestMode();
        }
      },
      async redirectToChatWith(id) {
        // TODO: rewrite this
        const response = await axios.get('v1/me/chats/check?id=' + id),
          isChatExist = response && response.data && response.data.state;
        this.$router.replace((isChatExist && response.data.id)
          ? '/messages/' + response.data.id
          : '/new-chat/' + id);
      },
      notifyAboutCantChatWithYourself() {
        this.$notify({
          group: 'write-to-you',
          duration: 3000,
          speed: 300,
        });
      },
      notifyAboutGuestMode() {
        this.$notify({
          group: 'guest-template',
          duration: 3000,
          speed: 300,
        });
      },
      showStatistics() {
        this.$router.push(`/statictics/${this.storyId}`);
      },
      like() {
        const {isCurrentUserNotGuest} = this;

        if (isCurrentUserNotGuest) {
          this.likeStoryPost({
            id: this.storyId,
            isDislike: this.isStoryLiked,
          });
        } else {
          this.notifyAboutGuestMode()
        }
      },
      addToBookmarks() {
        const {isCurrentUserNotGuest} = this;

        if (isCurrentUserNotGuest) {
          this.bookmarkStoryPost({
            id: this.storyId,
            isUnbookmark: this.isStoryBookmarked,
          });
        } else {
          this.notifyAboutGuestMode()
        }
      },
      openMenu() {
        this.showStoryMenu = true;
      },
      closeMenu() {
        this.showStoryMenu = false;
      },
      closeStoryPage() {
        this.$emit('navigation:close');
      },
      toggleTimer() {
        this.$emit('navigation:toggle-timer')
      },
      pauseTimer() {
        this.$emit('navigation:pause-timer')
      },
      resumeTimer() {
        this.$emit('navigation:resume-timer')
      },
      goToNextStory() {
        this.$emit('navigation:next')
      },
      goToNextStoryAfterDeleting() {
        this.$emit('navigation:next-after-deleting')
      },
      goToPreviousStory() {
        this.$emit('navigation:previous')
      },
      async deleteStory() {
        await this.deleteStoryPost({
          id: this.currentStory && this.currentStory.id,
        });
        this.closeMenu();
        this.goToNextStoryAfterDeleting();
      },
      async deleteStoryAlbum() {
        await this.deleteUserStoryAlbum({
          id: this.storyAlbumId,
        });
        this.closeStoryPage();
      },
      async unsubscribeFromAuthor() {
          await this.unsubscribeFromAuthorOfStoryPost({
            nickname: this.currentStoryAuthorNickname,
          });
      },
      async addAuthorToBlacklist() {
        await this.addAuthorOfStoryToBlacklist({
          user: this.currentStoryAuthor,
          onSuccess: () => {
            this.closeMenu();
          },
        });
      },
    },
  }
</script>
