<template>
  <div v-if="group">
    <div class="group-header">
      <div class="title">
        {{ group.name }}
      </div>
      <i
        @click="goBack()"
        class="icon-left-f icon-back"></i>
      <i @click="openGroupSettings()" class="icon-vvv"></i>
    </div>
    <in-group-header-banner
      :group="group"
      :user="user"
      @request:subscribe="subscribeToGroup"
      @request:unsubscribe="leftToGroup" />
    <div class="banner-menu">
      <div class="banner-menu--item" @click="goToVideos">
        <span>{{$lang.variables.video}}</span>
        <span>({{group.videos_count}})</span>
      </div>
      <div class="banner-menu--item" @click="goToAlbums">
        <span>{{$lang.variables.albums}}</span>
        <span>({{group.albums_count}})</span>
      </div>
    </div>
    <in-group-settings :show.sync="shouldShowGroupSettings" :group="group" :user="group.group_user"></in-group-settings>
    <in-group-modalentry/>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapActions, mapGetters} from 'vuex'

  import modalOfParticipant from 'ComponentsVue/groups/groupComponents/groupParticipant.vue';
  import groupSettings from 'ComponentsVue/groups/groupComponents/groupSettings.vue';
  import groupModalEntry from 'ComponentsVue/groups/groupComponents/groupModalEntry';
  import GroupHeaderBanner from 'ComponentsVue/groups/groupComponents/GroupHeaderBanner';

  import {
    CURRENT_GROUP,
    FETCH_CURRENT_GROUP,
    moduleName as groupModule,
    SUBSCRIBE_USER
  } from "Store/modules/groups/groups";

  Vue.component('in-allparticipant', modalOfParticipant);
  Vue.component('in-group-settings', groupSettings);
  Vue.component('in-group-modalentry', groupModalEntry);

  export default {
    components: {
      inGroupHeaderBanner: GroupHeaderBanner,
    },
    data() {
      return {
        groupSlug: '',
        //group: {},
        user: {},
        isParticipant: {},
        firstTime: true,
        isSub: false,
        shouldShowGroupSettings: false,
      }
    },
    computed: {
      ...mapGetters({
        groupInfo: groupModule + CURRENT_GROUP,
      }),
      group() {
        return this.groupInfo(this.groupSlug);
      },
      isSubscribed() {
        return this.isSub || this.firstTime;
      },
      userFriendlyType() {
        switch(this.group.type) {
          case 'group':
            return this.$lang.variables.group;
          case 'community':
            return this.$lang.variables.community;
        }
        return this.$lang.variables.event;
      },
      accessibilityIcon() {
        return this.group.accessibility === 'open'
          ? 'icon-lock_open'
          : 'icon-lock_close';
      },
      location() {
        return this.group.location && this.group.location.location;
      },
      bannerStyles() {
        const {group} = this;
        return group && group.banner && group.banner.url && {
          'backgroundImage': `url(${group.banner.url})`,
        };
      }
    },
    mounted() {
      this.groupSlug = this.$route.params.group_slug;
      this.user = JSON.parse(localStorage.getItem('user'));
      this.getCurrentGroup(this.groupSlug);
    },
    methods: {
      ...mapActions({
        getCurrentGroup: groupModule + FETCH_CURRENT_GROUP,
        subscribeUserToGroup: groupModule + SUBSCRIBE_USER,
      }),
      goBack() {
        this.$router.go(-1);
      },
      leftToGroup() {
        let data = new FormData();
        data.append('group_slug', this.groupSlug);
        data.append('delete', '1');
        const payload = {data: data, onFail: this.onFail}
        this.subscribeUserToGroup(payload);
      },
      subscribeToGroup() {
        if (this.user.status !== 'guest') {
          if (this.group.accessibility !== 'closed') {
            let data = new FormData();
            data.append('group_slug', this.groupSlug);
            const payload = {data: data, onFail: this.onFail}
            this.subscribeUserToGroup(payload);
          }
          else {
            this.$modal.show('groupModalEntry');
          }
        }
        else {
          this.$notify({
            group: 'guest-template',
            duration: 3000,
            speed: 300,
          });
        }
      },
      onFail() {
        this.$notify({
          group: 'guest-template',
          duration: 3000,
          speed: 300,
        })
      },
      showAllParticipant() {
        this.$modal.show('allParicipants');
      },
      openGroupSettings() {
        this.shouldShowGroupSettings = true;
      },
      goToDiscussion() {
        this.$router.push('/groups/' + this.group.slug + '/discussions');
      },
      goToAlbums() {
        if (this.user.status !== 'guest') {
          this.$router.push('/group/' + this.group.slug + '/albums');
        }
        else {
          this.$notify({
            group:'guest-template',
            duration: 3000,
            speed: 300,
          });
        }
      },
      goToVideos() {
        if (this.user.status !== 'guest') {
          this.$router.push('/group/' + this.group.slug + '/videos');
        }
        else {
          this.$notify({
            group:'guest-template',
            duration: 3000,
            speed: 300,
          });
        }
      },
      userValid() {
        this.$notify({
          group: 'validating-template',
          duration: 3000,
          speed: 300,
        });
      },
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  .group-header {
    text-align: center;
    height: 40px;
    .bgc-grad();
    color: #fff;
    font-size: 20px;
    padding: 5px 0;
    line-height: 30px;
    box-sizing: border-box;
    position: relative;

    .title {
      text-align: center;
      font-size: 4vw;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 76%;
      margin: auto;
    }

    .icon-back {
      position: absolute;
      top: 10px;
      left: 8px;
      color: #fff;
      font-size: 20px;
    }

    .icon-vvv {
      position: absolute;
      color: #fff;
      top: 50%;
      right: 8px;
      transform: translateY(-50%);
      font-size: 27px;
    }
  }

  .banner-menu--item {
    i {
      .text-grad();
    }

    .icon-plus-f {
      font-size: 22px;
    }
  }

  .banner-menu {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: @middle_grey;
    margin-bottom: 20px;
    padding: 8px;
    color: #fff;
    font-size: 14px;
  }
  .location-span {
    width: 75%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: right;
  }

  .group-temat {
    font-size: 13px;
    color: #9e9e9e;
  }

  .disabled{
    color: @grey_grey;
  }
</style>
