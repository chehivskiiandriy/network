<template>
  <div class="group-videos">
    <template v-if="group">
      <div class="videos-header">
        <div class="title">{{$lang.variables.videos}} Videos ({{group.videos_count}})</div>
        <i @click="goBack()" class="icon-left-f icon-back"></i>
        <router-link :to="addVideoRouterLink"><i class="icon-plus-f"></i></router-link>
      </div>
      <div class="group-banner" :style="{'backgroundImage': 'url(' + group.banner.url + ')'}">
        <div class="group-black"></div>
      </div>
    </template>
    <div class="videos-container" v-if="error === null">
      <in-group-video-item
        v-for="video in videos"
        :key="video.id"
        :video="video" />
    </div>
    <div class="videos-container" v-else>
      {{ error }}
    </div>
    <in-spinner :loading="loading" />
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'

  import {scrollOnBottom} from "../../../mixins/scrollOnBottom";
  import GroupVideoItem from 'ComponentsVue/groups/groupComponents/GroupVideoItem';
  import {CURRENT_GROUP, FETCH_CURRENT_GROUP, moduleName as groupModule} from "Store/modules/groups/groups";
  import {
    ERRORS,
    FETCH_GROUP_VIDEOS,
    FETCH_GROUP_VIDEOS_NEXT_PAGE,
    GROUP_VIDEOS,
    LOADING,
    moduleName as groupVideosModule
  } from "Store/modules/groups/groupVideos";

  export default {
    name: "GroupVideos",
    components: {
      inGroupVideoItem: GroupVideoItem
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
          this.fetchGroupVideosNextPage(this.groupSlug)
        }
      }
    },
    computed: {
      ...mapGetters({
        groupInfo: groupModule + CURRENT_GROUP,
        groupVideos: groupVideosModule + GROUP_VIDEOS,
        loading: groupVideosModule + LOADING,
        error: groupVideosModule + ERRORS
      }),
      group() {
        return this.groupInfo(this.groupSlug)
      },
      videos() {
        return this.groupVideos(this.groupSlug)
      },
      addVideoRouterLink() {
        return this.group && {
          name: 'add-group-video',
          params: {
            group_slug: this.group.slug,
          },
        };
      }
    },
    mounted() {
      this.fetchCurrentGroup(this.groupSlug);
      this.fetchGroupVideos(this.groupSlug);
    },
    methods: {
      ...mapActions({
        fetchCurrentGroup: groupModule + FETCH_CURRENT_GROUP,
        fetchGroupVideos: groupVideosModule + FETCH_GROUP_VIDEOS,
        fetchGroupVideosNextPage: groupVideosModule + FETCH_GROUP_VIDEOS_NEXT_PAGE
      }),
      goBack() {
        this.$router.go(-1);
      }
    }
  }
</script>

<style lang="less" scoped>
  .group-videos {
    .videos-header {
      position: relative;
      top: 0;
      left: 0;
      right: 0;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.5);
    }

    .group-banner {
      position: relative;
      background-size: cover;
      background-position: center;
      text-align: center;
      z-index: 11;
      height: 35vw;
    }

    .group-black {
      background: linear-gradient(transparent, #000);
      opacity: .7;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      content: "";
      z-index: -1;
    }

    .title {
      color: #fff;
    }

    .icon-back {
      position: absolute;
      top: 10px;
      left: 8px;
      color: #fff;
      font-size: 22px;
    }

    .icon-plus-f {
      position: absolute;
      top: 50%;
      right: 8px;
      transform: translateY(-50%);
      color: #fff;
      font-size: 26px;
    }

    .videos-container {
      display: flex;
      flex-wrap: wrap;
      margin: 1vw;
    }
  }
</style>
