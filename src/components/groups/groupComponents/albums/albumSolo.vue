<template>
  <div class="album-solo">
    <div class="album-header">
      <i
        @click="goBack"
        class="go-back-album icon-left-f"></i>
      <div
        v-if="album"
        class="album-title"
        v-text="album.title"></div>
      <i v-if="isAuthorOfAlbum"
        @click="showAlbumSettings"
        class="album-settings icon-vvv"></i>
    </div>
    <div class="album-body">
      <div
        v-if="(!loading || firstTimeFlag) && isCurrentUserMemberOfGroup"
        class="album-image-solo album-add-icon"
        @click="addAlbumPost">
        <i class="icon-plus-f"></i>
      </div>
      <template v-if="posts">
        <div
          class="album-image-solo"
          v-for="(post, index) in posts"
          :key="post.id">
          <i v-if="isAuthorOfImage(post)"
             class="album-image-solo__menu-icon icon-menu-f" @click="openAlbumImageSettingsMenu(post.id)"></i>
          <img
            @click="openAlbumModal(index)"
            :src="post.attachments.images[0].url_medium" >
        </div>
      </template>
    </div>
    <in-album-modal :albumImageArray="posts" :openImage="modalImage"></in-album-modal>
    <template v-if="isAuthorOfAlbum">
      <in-album-settings-menu :show.sync="isShowSettingsMenu"
                              @select:update="updateAlbumHandler" @select:delete="deleteAlbumHandler"/>
      <in-album-delete-confirmation-modal :show.sync="isShowDeleteConfirmationModal"
                                          @select:ok="deleteAlbumConfirmHandler"/>
    </template>
    <in-album-image-settings-menu :show.sync="isShowImageSettingsMenu"
                                  @select:update="updateAlbumImageHandler" @select:delete="deleteAlbumImageHandler" />
    <in-spinner :loading="loading" />
  </div>
</template>
<script>
  import axios from 'axios'
  import {mapActions, mapGetters, mapState } from 'vuex'

  import {scrollOnBottom} from "../../../../mixins/scrollOnBottom";

  import {
    ALBUM,
    ALBUM_POSTS,
    FETCH_ALBUM,
    FETCH_ALBUM_POSTS,
    FETCH_ALBUM_POSTS_NEXT_PAGE,
    LOADING,
    DELETE_ALBUM_POST,
    moduleName as albumPostsModule
  } from "Store/modules/albumPosts";
  import {DELETE_GROUP_ALBUM, moduleName as groupAlbumsModule} from 'Store/modules/groups/groupAlbums';
  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";
  import albumModal from 'ComponentsVue/groups/groupComponents/albums/albumModalImage';
  import AlbumSettingsMenu from 'ComponentsVue/groups/groupComponents/albums/AlbumSettingsMenu';
  import AlbumImageSettingsMenu from 'ComponentsVue/groups/groupComponents/albums/AlbumImageSettingsMenu';
  import AlbumDeleteConfirmationModal from 'ComponentsVue/groups/groupComponents/albums/AlbumDeleteConfirmationModal';
  import {
    CURRENT_GROUP,
    FETCH_CURRENT_GROUP,
    moduleName as groupModule,
  } from 'Store/modules/groups/groups';

  export default {
    components: {
      inAlbumModal: albumModal,
      inAlbumSettingsMenu: AlbumSettingsMenu,
      inAlbumImageSettingsMenu: AlbumImageSettingsMenu,
      inAlbumDeleteConfirmationModal: AlbumDeleteConfirmationModal,
    },
    mixins: [scrollOnBottom],
    data() {
      return {
        modalImage: 0,
        albumId: this.$route.params.album_slug,
        groupSlug: this.$route.params.group_slug,
        firstTimeFlag: false,
        isShowSettingsMenu: false,
        isShowDeleteConfirmationModal: false,
        isShowImageSettingsMenu: false,
        processedAlbumImageId: null,
      }
    },
    watch: {
      bottom(bottom) {
        if (bottom) {
          this.firstTimeFlag = true;
          this.fetchAlbumPostsNextPage(this.albumId)
        }
      }
    },
    computed: {
      ...mapGetters({
        getGroupInfo: groupModule + CURRENT_GROUP,
        authUser: userModule + AUTH_USER,
        getAlbumPosts: albumPostsModule + ALBUM_POSTS,
        getAlbumInfo: albumPostsModule + ALBUM,
        loading: albumPostsModule + LOADING
      }),
      ...mapState([
        'albumPosts'
      ]),
      posts() {
        const posts = this.getAlbumPosts(this.albumId);
        return posts && posts.filter(post => post.attachments && post.attachments.images);
      },
      album() {
        return this.getAlbumInfo(this.albumId)
      },
      processedAlbumImage() {
        return this.processedAlbumImageId && this.posts.find(
          post => post.id.toString() === this.processedAlbumImageId.toString()
        );
      },
      userId() {
        return this.authUser && this.authUser.id;
      },
      albumAuthorId() {
        return this.album && this.album.author && this.album.author.id;
      },
      isAuthorOfAlbum() {
        const { userId, albumAuthorId } = this;
        return userId && albumAuthorId && (userId.toString() === albumAuthorId.toString());
      },
      deletingError() {
        return this.albumPosts && this.albumPosts.postActionError;
      },
      groupSlug() {
        return this.$route.params.group_slug;
      },
      group() {
        return this.getGroupInfo(this.groupSlug);
      },
      isCurrentUserMemberOfGroup() {
        const { group } = this;
        return group && group.group_user && (['admin', 'participant'].indexOf(group.group_user.role) !==  -1);
      },
    },
    mounted() {
      this.fetchAlbumPosts(this.albumId);
      this.fetchAlbum(this.albumId);
      this.fetchCurrentGroup(this.groupSlug);
    },
    methods: {
      ...mapActions({
        fetchCurrentGroup: groupModule + FETCH_CURRENT_GROUP,
        fetchAlbumPosts: albumPostsModule + FETCH_ALBUM_POSTS,
        fetchAlbumPostsNextPage: albumPostsModule + FETCH_ALBUM_POSTS_NEXT_PAGE,
        fetchAlbum: albumPostsModule + FETCH_ALBUM,
        deleteAlbum: groupAlbumsModule + DELETE_GROUP_ALBUM,
        deleteAlbumImage: albumPostsModule + DELETE_ALBUM_POST,
      }),
      addAlbumPost() {
        if (this.authUser.status !== 'guest') {
          this.$router.push('/new-post/' + this.groupSlug + '/albums/' + this.albumId);
        } else {
          this.$notify({
            group:'guest-template',
            duration:3000,
            speed:300,
          })
        }
      },
      showAlbumSettings() {
        this.isShowSettingsMenu = true;
      },
      updateAlbumHandler() {
        this.$router.push('/group/' + this.groupSlug + '/edit-album/' + this.albumId);
      },
      deleteAlbumHandler() {
        this.isShowDeleteConfirmationModal = true;
      },
      async deleteAlbumConfirmHandler() {
        await this.deleteAlbum({
          albumId: this.albumId,
          groupSlug: this.groupSlug,
        });
        this.$router.replace(`/group/${this.groupSlug}/albums`);
      },
      goBack() {
        this.$router.go(-1);
      },
      openAlbumModal(index) {
        this.modalImage = +index;
        this.$modal.show('albumModalImg');
      },
      isAuthorOfImage(post) {
        const { userId } = this,
          imageAuthorId = post && post.author && post.author.id;
        return userId && imageAuthorId && (userId.toString() === imageAuthorId.toString());
      },
      openAlbumImageSettingsMenu(id) {
        this.isShowImageSettingsMenu = true;
        this.processedAlbumImageId = id;
      },
      updateAlbumImageHandler() {
        const slug = this.processedAlbumImage && this.processedAlbumImage.slug;
        slug && this.$router.push(`/edit-post/${slug}`);
      },
      async deleteAlbumImageHandler() {
        await this.deleteAlbumImage({
          albumId: this.albumId,
          postId: this.processedAlbumImageId,
        });
        this.deletingError && this.emitNotificationAboutError();
      },
      emitNotificationAboutError() {
        this.$notify({
          group: 'action-error',
          duration: 3000,
          speed: 300,
        });
      },
    }
  }
</script>
<style lang="less">
  @import "~LessStyle/variables.less";

  .album-solo {
    margin-top: -43px;
  }

  .album-header {
    position: relative;
    background: @grad;
    color: @white;
    display: flex;
    align-items: center;
    height: 40px;
    font-size: 20px;
    padding: 5px 0;
    line-height: 30px;
    box-sizing: border-box;
  }

  .album-add-icon {
    border: 1px solid @contest-list-text-color;
    border-radius: 8px;
    margin: 1px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f4f4f4;

    .icon-plus-f {
      font-size: 30px;
      .text-grad();
    }
  }

  .album-title {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .go-back-album {
    width: 10%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #fff;
    font-size: 22px;
  }

  .album-settings {
    width: 10%;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    color: #fff;
    font-size: 22px;
  }

  .album-body {
    display: flex;
    flex-wrap: wrap;
    margin: 4px;
  }

  .album-image-solo {
    width: calc(~'25vw - 6px');
    height: calc(~'25vw - 6px');
    margin: 2px;
    position: relative;
  }

  .album-image-solo__menu-icon {
    color: rgba(250, 250, 250, 0.74);
    text-shadow: 1px 1px 1px rgba(55, 55, 55, 0.55);
    padding: 0px 1px;
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: 16px;
    border-radius: 2px;
    font-weight: 100;
  }

  .album-image-solo img {
    width: 100%;
    border-radius: 8px;
  }
</style>
