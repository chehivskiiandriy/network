<template>
  <div id="createAlbum">
    <div class="modal-title">
      {{modalTitle}}
      <span @click="goBack" class="go-back">
        <i class="icon-left-f"></i>
      </span>
    </div>
    <in-album-form :album-title.sync="albumTitle" :album-description.sync="albumDescription"
                   :submit-button-text="submitButtonText" @submit="submitHandler" />
  </div>
</template>
<script>
  import axios from 'axios';
  import {mapActions, mapState} from 'vuex';
  import {FETCH_CURRENT_GROUP, moduleName as groupsModule} from "Store/modules/groups/groups";
  import {CREATE_GROUP_ALBUM, UPDATE_GROUP_ALBUM, moduleName as groupAlbumsModule} from "Store/modules/groups/groupAlbums";
  import {FETCH_ALBUM, moduleName as albumPostsModule} from "Store/modules/albumPosts";

  import AlbumForm from './AlbumForm';

  export default {
    components: {
      inAlbumForm: AlbumForm,
    },
    computed: {
      ...mapState([
        'groups',
        'groupAlbums',
        'albumPosts',
      ]),
      newAlbumId() {
        return this.groupAlbums && this.groupAlbums.newAlbumId;
      },
      actionError() {
        return this.groupAlbums && this.groupAlbums.albumActionError;
      },
      groupSlug() {
        return this.$route.params.group_slug;
      },
      submitButtonText() {
        return this.albumId
          ? this.$lang.variables.update
          : this.$lang.variables.create;
      },
      modalTitle() {
        return this.albumId
          ? this.$lang.variables.updateAlbum || 'updalb'
          : this.$lang.variables.createAlbum;
      },
      albumId() {
        return this.$route.params.album_id;
      },
      album() {
        const id = this.albumId;
        return id && this.albumPosts && this.albumPosts.albumsForIds && this.albumPosts.albumsForIds[id];
      }
    },
    data() {
      return {
        albumTitle: '',
        albumDescription: '',
      };
    },
    beforeRouteEnter(to, from, next) {
      next(async vm => {
        console.log('fetchalbum')
        await vm.getAlbumData(vm.albumId);
        vm.albumTitle = vm.album && vm.album.title;
        vm.albumDescription = vm.album && vm.album.description;
      });
    },
    async beforeRouteUpdate(to, from, next) {
      console.log('routepdate')
      await this.getAlbumData(this.albumId);
    },
    methods: {
      ...mapActions({
        getGroupData: groupsModule + FETCH_CURRENT_GROUP,
        getAlbumData: albumPostsModule + FETCH_ALBUM,
        createAlbum: groupAlbumsModule + CREATE_GROUP_ALBUM,
        updateAlbum: groupAlbumsModule + UPDATE_GROUP_ALBUM,
      }),
      async getGroupId() {
        await this.getGroupData(this.groupSlug);
        return this.groups.groups[this.groupSlug].id;
      },
      async submitHandler() {
        const id = this.albumId;
        if(id) {
          await this.updateAlbum({
            id,
            title: this.albumTitle,
            description: this.albumDescription,
          });
        } else {
          await this.createAlbum({
            group_id: await this.getGroupId(),
            title: this.albumTitle,
            description: this.albumDescription,
          });
        }
        if(this.actionError) {
          this.emitNotificationAboutError();
          return;
        }

        this.redirect();
      },
      redirect() {
        if(this.albumId) {
          this.$router.replace(`/group/${this.groupSlug}/albums/${this.albumId}`);
        } else if(this.newAlbumId) {
          this.$router.replace(`/group/${this.groupSlug}/albums/${this.newAlbumId}`);
        } else {
          this.$router.replace(`/group/${this.groupSlug}/albums`);
        }
      },
      goBack(){
        history.go(-1);
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
@import '~LessStyle/variables.less';

  #createAlbum {
    margin-top: -43px;
  }

  .group_input  {
    width:90%;
    height: 35px;
    font-size: 16px;
    background-color: hsla(0, 0%, 100%, .7);
    outline: 0;
    padding: 5px;
    border-radius: 5px;
    margin:20px;
    border: 1px solid @base_green;
    box-sizing: border-box;
    color: #b7bac0;
  }

  .group_album_submit {
    color:#5ac5c6;
    border: 1px solid #5ac5c6;
    padding: 5px 15px;
    border-radius: 3px;
    width: 50%;
    margin-top: 10px;
    background: transparent;
    font-size: 14px;
  }

.go-back {
  position: absolute;
  left: 0px;
  top: 2px;
  font-size: 22px;
  color: #fff;
}
</style>
