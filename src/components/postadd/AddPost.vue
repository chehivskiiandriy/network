<template>
  <div class="add-post">
    <in-add-post-crop
      v-if="step === 1"
      :goNext="changeIsFileChangeView"
      :goBack="goBack"
      :tempFiles="tempFiles"
      :redirect-on-file-input="$route.path"
      :authUser="authUser"/>

    <in-add-post-descriptions
      v-else-if="step === 2"
      :goBack="goBack"
      :tempFiles="tempFiles"
      :post-type="postType"
      :query="query"
      :authUser="authUser"
      :current-user-group-role="group && group.group_user.role"
      :current-user-nickname="null"
      @redirect-to-previous-page="redirectToPreviousPage"/>

  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex';

  import {moduleName as newPostModule, RESET_TEMPORARY_FILES, TEMPORARY_FILES} from "Store/modules/newPost";
  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";
  import {CURRENT_GROUP, FETCH_CURRENT_GROUP, moduleName as groupsModule} from "Store/modules/groups/groups";

  import AddPostCrop from 'ComponentsVue/postadd/AddPostCrop'
  import AddPostDescriptions from 'ComponentsVue/postadd/AddPostDescription';

  export default {
    name: "AddPost",
    components: {
      inAddPostCrop: AddPostCrop,
      inAddPostDescriptions: AddPostDescriptions,
    },
    data() {
      return {
        step: 1
      }
    },
    computed: {
      ...mapGetters({
        tempFiles: newPostModule + TEMPORARY_FILES,
        authUser: userModule + AUTH_USER,
        getCurrentGroup: groupsModule + CURRENT_GROUP,
      }),
      postType() {
        return this.$route.meta.type;
      },
      query() {
        return {
          groupSlug: this.$route.params.group_slug,
          albumId: this.$route.params.album_slug,
        }
      },
      group() {
        if(['group-album-post', 'group-post'].indexOf(this.postType) !== -1) {
          return this.getCurrentGroup(this.query.groupSlug);
        } else {
          return null;
        }
      }
    },
    beforeDestroy() {
      this.resetTemporaryFiles();
    },
    mounted() {
      if(['group-album-post', 'group-post'].indexOf(this.postType) !== -1) {
        this.fetchCurrentGroup(this.query.groupSlug);
      }
    },
    methods: {
      ...mapMutations({
        resetTemporaryFiles: newPostModule + RESET_TEMPORARY_FILES,
      }),
      ...mapActions({
        fetchCurrentGroup: groupsModule + FETCH_CURRENT_GROUP,
      }),
      goBack() {
        if(this.step === 2) {
          this.step = 1;
        } else {
          this.redirectToPreviousPage();
        }
      },
      changeIsFileChangeView() {
        if(this.step === 1) {
          this.step = 2;
        } else {
          this.step = 1;
        }
      },
      redirectToPreviousPage() {
        switch (this.postType) {
          case 'group-album-post':
            this.redirectToAlbum();
            break;
          case 'group-post':
            this.redirectToGroup();
            break;
          case 'profile-post':
            this.redirectToProfile();
            break;
        }
      },
      redirectToAlbum() {
        this.$router.replace({
          name: 'group-album',
          params: {
            group_slug: this.query.groupSlug,
            album_id: this.query.albumId,
          },
        });
      },
      redirectToGroup() {
        this.$router.replace({
          name: 'group',
          params: {
            group_slug: this.query.groupSlug,
          },
        });
      },
      redirectToProfile() {
        this.$router.replace('/u/' + this.authUser.nickname);
      },
    }
  }
</script>

<style scoped>

</style>
