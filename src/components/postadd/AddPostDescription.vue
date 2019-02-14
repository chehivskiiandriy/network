<template>
  <div class="add-post-description">
    <in-header-block class="header header-gradient">
      <div
        @click="goBackAction"
        class="header-back">
        <i class="icon-left-f"></i>
      </div>
      <div class="header-content">
        <span class="header-content-name">{{$lang.variables.addPost}}</span>
      </div>
      <div class="empty-block"></div>
    </in-header-block>

    <grid
      :center="false"
      :draggable="true"
      :sortable="true"
      :items="tempFiles"
      :cellWidth="widthGridItem"
      :cellHeight="widthGridItem"
      :height="widthGridItem"
      :width="widthGridItem"
      @sort="sortGrid">
      <template slot="cell" scope="props">
        <div
          class="drag-item">
          <div
            v-if="props.item.type === 'image'"
            class="drag-item-img"
            :style="{backgroundImage: `url(${props.item.cropped ? props.item.cropped : props.item.file})`}"></div>
          <div
            v-else
            class="drag-item-video">
            <video
              class="not-touch"
              autoplay
              muted
              loop
              :src="props.item.file"></video>
          </div>
        </div>
      </template>
    </grid>

    <in-add-post-text
      :imagesArray="sortFiles"
      :title="title"
      :intags="intags"
      :mentions="mentions"
      :intags-history="intagHistory"
      :isCheck="isCheck"
      :isOnBehalfOfTheGroup="isOnBehalfOfTheGroup"
      :isGroupPost="isGroupPost"
      :isGroupAlbumPost="isGroupAlbumPost"
      :current-user-group-role="currentUserGroupRole"
      :current-user-nickname="currentUserNickname"
      @intag-type="intagTypeHandler"
      @addMention="addMention"
      @changeMention="changeMention"
      @deleteMention="deleteMention"
      @addLocation="addLocation"
      @updateTitle="updateTitle"
      @addIntag="addIntag"
      @deleteIntag="deleteIntag"
      @changePostVisibility="changePostVisibility"
      @changeIsOnBehalfOfTheGroup="changeIsOnBehalfOfTheGroup"/>

    <div class="actions-buttons">
      <button
        class="action-post-button"
        @click="makePost">{{$lang.variables.publishPost}}
      </button>
    </div>

    <in-spinner-bg :loading="loading"></in-spinner-bg>
  </div>
</template>

<script>
  import {mapActions, mapMutations, mapGetters} from 'vuex';
  import {moduleName as postsModule, ADD_POST_NEW, ADD_GROUP_POST} from "Store/modules/posts";
  import {moduleName as albumPostsModule, ADD_POST_TO_ALBUM, FETCH_ALBUM_POSTS } from 'Store/modules/albumPosts';
  import {moduleName as groupPostsModule, FETCH_GROUP_POSTS } from 'Store/modules/groups/groupPosts';
  import {moduleName as newPostModule, SORT_TEMPORARY_FILES, CHANGE_LOADING, ADD_POST_PREVIEW, LOADING} from "Store/modules/newPost";
  import {moduleName as mainPostsModule, FETCH_NEW_POSTS} from "Store/modules/mainPosts";

  import {
    PUSH_INTAG_TO_HISTORY,
    PUSH_INTAGS_TO_HISTORY,
    LOAD_INTAGS_HISTORY,
    INTAGS_HISTORY,
    FIND_INTAGS_BY_A_BEGINNING,
    moduleName as intagsHistoryModule
  } from 'Store/modules/intagsHistory';

  import AddPostText from "ComponentsVue/postadd/AddPostText";

  export default {
    name: "AddPostDescription",
    props: {
      tempFiles: {
        type: Array,
        default: [],
      },
      authUser: {
        type: Object,
        required: true
      },
      goBack: {
        type: Function,
        required: true
      },
      postType: String,
      query: Object,
      currentUserGroupRole: String,
      currentUserNickname: String,
    },
    components: {
      inAddPostText: AddPostText
    },
    data() {
      return {
        sortFiles: this.tempFiles,
        intags: [],
        title: '',
        place_geo_id: null,
        mentions: {},
        typedIntag: null,
        isCheck: false,
        isOnBehalfOfTheGroup: false,
      }
    },
    computed: {
      ...mapGetters({
        loading: newPostModule + LOADING,
        intagsHistory: intagsHistoryModule + INTAGS_HISTORY,
        findIntagsByABeginning: intagsHistoryModule + FIND_INTAGS_BY_A_BEGINNING,
      }),
      widthGridItem() {
        return window.innerWidth / 5 ^ 0
      },
      intagHistory() {
        return this.typedIntag
          ? this.findIntagsByABeginning(this.typedIntag)
          : this.intagsHistory;
      },
      basePayload() {
        return {
          files: this.sortFiles,
          intags: this.intags,
          geoId: this.place_geo_id,
          title: this.title,
          mentions: this.mentions,
          onSuccess: this.onSuccessAddPost,
          onFail: this.onFailAddPost
        };
      },
      isGroupPost() {
        return this.postType === 'group-post';
      },
      isGroupAlbumPost() {
        return this.postType === 'group-album-post';
      },
    },
    methods: {
      ...mapMutations({
        sortTempFiles: newPostModule + SORT_TEMPORARY_FILES,
        changeNewPostLoading: newPostModule + CHANGE_LOADING,
        addPostPreview: newPostModule + ADD_POST_PREVIEW,
        pushIntagToHistory: intagsHistoryModule + PUSH_INTAG_TO_HISTORY,
        pushIntagsToHistory: intagsHistoryModule + PUSH_INTAGS_TO_HISTORY,
        loadIntagsHistory:intagsHistoryModule + LOAD_INTAGS_HISTORY,
      }),
      ...mapActions({
        addPost: postsModule + ADD_POST_NEW,
        addPostToGroup: postsModule + ADD_GROUP_POST,
        addPostToAlbum: albumPostsModule + ADD_POST_TO_ALBUM,
        fetchNewProfilePosts: mainPostsModule + FETCH_NEW_POSTS,
        fetchNewGroupPosts: groupPostsModule + FETCH_GROUP_POSTS,
        fetchNewAlbumPosts: albumPostsModule + FETCH_ALBUM_POSTS,
      }),
      changePostVisibility() {
        this.isCheck = !this.isCheck;
      },
      changeIsOnBehalfOfTheGroup() {
        this.isOnBehalfOfTheGroup = !this.isOnBehalfOfTheGroup;
      },
      addMention(mention) {
        if (this.mentions[mention.imgID]) {
          this.mentions[mention.imgID].push(mention);
        } else {
          this.mentions[mention.imgID] = [mention];
        }
      },
      changeMention(payload) {
        this.mentions[payload.imgID][payload.replaceId].posXdB = payload.posXdB;
        this.mentions[payload.imgID][payload.replaceId].posYdB = payload.posYdB;
      },
      deleteMention(payload) {
        this.mentions[payload.imgID].splice(payload.index, 1);
      },
      addLocation(geoId) {
        this.place_geo_id = geoId;
      },
      updateTitle(title) {
        this.title = title;
      },
      addIntag(intag) {
        this.intags.push(intag);
      },
      deleteIntag(index) {
        this.intags.splice(index, 1)
      },
      goBackAction() {
        this.sortTempFiles(this.sortFiles);
        this.goBack();
      },
      sortGrid(e) {
        let list = [];

        e.items.map(item => {
          list[item.sort] = item.item
        });

        this.sortFiles = list;
      },
      makePost() {
        switch (this.postType) {
          case 'group-album-post':
            this.makeAlbumPost();
            break;
          case 'group-post':
            this.makeGroupPost();
            break;
          case 'profile-post':
            this.makeProfilePost();
            break;
        }
      },
      makeProfilePost() {
        // this.sortTempFiles(this.sortFiles);

        if (this.$userStatus(this.authUser) && !this.loading) {
          this.changeNewPostLoading(true);
          const payload = this.basePayload;
          this.addPostPreview(this.sortFiles[0]);
          payload.visibility = this.isCheck ? 'subs' : 'all';
          this.addPost(payload);
          this.redirectOnMain();
        }
      },
      makeGroupPost() {
        const payload = this.basePayload;
        payload.groupSlug = this.query.groupSlug;
        payload.fromGroup = this.isOnBehalfOfTheGroup;
        this.addPost(payload);
        this.$emit('redirect-to-previous-page');
      },
      makeAlbumPost() {
        const payload = this.basePayload;
        payload.groupSlug = this.query.groupSlug;
        payload.albumId = this.query.albumId;
        this.addPost(payload);
        this.$emit('redirect-to-previous-page');
      },
      redirectOnMain() {
        this.$router.push('/');
      },
      onSuccessAddPost() {
        this.$notify({
          group: 'post-add',
          duration: 3000,
          speed: 300,
        });
        this.changeNewPostLoading(false);
        this.pushIntagsToHistory({intags: this.intags});
        console.log('success');
        this.fetchNewPosts();
      },
      onFailAddPost() {
        this.$notify({
          group: 'action-error',
          duration: 3000,
          speed: 300,
        });

        this.changeNewPostLoading(false);
      },
      fetchNewPosts() {
        switch (this.postType) {
          case 'group-album-post':
            this.fetchNewAlbumPosts(this.query.albumId);
            break;
          case 'group-post':
            this.fetchNewGroupPosts(this.query.groupSlug);
            break;
          case 'profile-post':
            this.fetchNewProfilePosts();
            break;
        }
      },
      intagTypeHandler(intag) {
        this.typedIntag = intag;
      }
    },
    mounted() {
      this.loadIntagsHistory();
    },
  }
</script>

<style lang="less" scoped>
  .add-post-description {
    padding: 5px 0;

    .not-touch {
      pointer-events: none;
    }

    .drag-item {
      height: calc(~'20vw - 4px');
      width: calc(~'20vw - 4px');
      margin: 2px 0 2px 3px;
      box-sizing: border-box;
      overflow: hidden;
      position: relative;
      border-radius: 3px;

      &:first-child {
        margin-left: 4px;
      }

      &-img {
        width: 100%;
        height: 100%;
        background-position: center;
        background-size: cover;
      }

      &-video {
        width: 100%;
        height: 100%;
        background: #000;

        video {
          width: 100%;
          height: 100%;
        }
      }
    }

    .actions-buttons {
      padding-top: 30px;

      button {
        width: calc(50% - 5px);
      }
    }
  }

</style>
