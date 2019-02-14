<template>
  <div id="groupsAlbums">
    <template v-if="group">
      <div class="album-header">
        <div class="title">{{$lang.variables.albums}} ({{group.albums_count}})</div>
        <i @click="goBack()" class="icon-left-f icon-back"></i>
        <i v-if="isParticipant" @click="addAlbum()" class="icon-plus-f icon-add"></i>
      </div>
      <div class="group-banner" :style="{'backgroundImage':'url('+ group.banner.url+')'}">
        <div class="group-black"></div>
      </div>
    </template>
    <div class="albums-blocks">
      <div v-for="album in albums">
        <in-album-item :album="album" />
      </div>
    </div>
    <in-spinner :loading="loading" />
  </div>
</template>
<script>
  import {mapActions, mapGetters} from 'vuex'

  import {scrollOnBottom} from "../../../mixins/scrollOnBottom";
  import {CURRENT_GROUP, FETCH_CURRENT_GROUP, moduleName as groupModule,} from "Store/modules/groups/groups";
  import {
    FETCH_GROUP_ALBUMS,
    FETCH_GROUP_ALBUMS_NEXT_PAGE,
    GROUP_ALBUMS,
    LOADING,
    moduleName as groupAlbumsModule
  } from "Store/modules/groups/groupAlbums";

  import albumItem from 'ComponentsVue/groups/groupComponents/albums/albumItem'

  export default {
    components: {
      inAlbumItem: albumItem
    },
    mixins: [scrollOnBottom],
    data() {
      return {
        groupSlug: this.$route.params.group_slug
      }
    },
    watch: {
      bottom(bottom) {
        if (bottom) {
          this.fetchGroupAlbumsNextPage(this.groupSlug)
        }
      }
    },
    computed: {
      ...mapGetters({
        groupInfo: groupModule + CURRENT_GROUP,
        groupAlbums: groupAlbumsModule + GROUP_ALBUMS,
        loading: groupAlbumsModule + LOADING
      }),
      group() {
        return this.groupInfo(this.groupSlug)
      },
      albums() {
        return this.groupAlbums(this.groupSlug)
      },
      isParticipant() {
        const user = this.group && this.group.group_user;
        return user && (user.role === 'participant' || user.role === 'admin');
      }
    },
    mounted() {
      this.fetchCurrentGroup(this.groupSlug);
      this.fetchGroupAlbums(this.groupSlug);
    },
    methods: {
      ...mapActions({
        fetchCurrentGroup: groupModule + FETCH_CURRENT_GROUP,
        fetchGroupAlbums: groupAlbumsModule + FETCH_GROUP_ALBUMS,
        fetchGroupAlbumsNextPage: groupAlbumsModule + FETCH_GROUP_ALBUMS_NEXT_PAGE
      }),
      goBack() {
        this.$router.go(-1);
      },
      addAlbum() {
        this.$router.push(`/group/${this.groupSlug}/create-album`);
      }
    }
  }
</script>
<style lang="less">
  @import '~LessStyle/groups.less';
  @import '~LessStyle/variables.less';

  .album-header {
    text-align: center;
    height: 40px;
    background: @grad;
    color: #fff;
    font-size: 20px;
    padding: 5px 0;
    line-height: 30px;
    box-sizing: border-box;
    position: relative;

    .title {
      text-align: center;
      width: 100%;
    }

    .icon-back {
      position: absolute;
      top: 10px;
      left: 8px;
      color: #fff;
      font-size: 22px;
    }

    .icon-add {
      position: absolute;
      top: 10px;
      right: 8px;
      color: #fff;
      font-size: 22px;
    }
  }
  .group-banner {
    top: -2px;
    position: relative;
    background-position: center;
    background-size: cover;
    text-align: center;
    z-index: 11;
    height: 35vw;
  }
</style>
