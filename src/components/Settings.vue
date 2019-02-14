<template>
  <div id="settings">

    <div class="settings-header">
      <div
        class="modal-title"
        v-if="this.$route.path=='/setting/common'">{{$lang.variables.mainRibbonType}}
      </div>
      <div
        class="modal-title"
        v-if="this.$route.path=='/setting/rating'">{{$lang.variables.typeOfRatingTape}}
      </div>
      <div
        class="modal-title"
        v-if="this.$route.path=='/setting'">{{$lang.variables.generalSettings}}
      </div>
      <div
        class="modal-title"
        v-if="this.$route.path=='/setting/stories'">{{$lang.variables.settingsStories }}
      </div>

      <i
        @click="goBackSettings()"
        class="icon-left-f icon-back"></i>
    </div>
    <div class="settings-menu">
      <div class="settings-menu--item">
        <router-link to="/setting/common">
          <i
            v-if="this.$route.path=='/setting/common'"
            class="icon-feed-settings-f"></i>
          <i
            v-else
            class="icon-feed-settings"></i>
        </router-link>
      </div>
      <div class="settings-menu--item">
        <router-link to="/setting/rating">
          <i
            v-if="this.$route.path=='/setting/rating'"
            class="icon-rating-settings-f"></i>
          <i
            v-else
            class="icon-rating-settings"></i>
        </router-link>
      </div>
      <div class="settings-menu--item">
        <router-link to="/setting/stories">
          <i
            v-if="this.$route.path=='/setting/stories'"
            class="icon-InStory-options-f"></i>
          <i
            v-else
            class="icon-InStory-options"></i>
        </router-link>
      </div>
      <div class="settings-menu--item">
        <i class="icon-volume-settings"></i>
      </div>
      <div class="settings-menu--item">
        <router-link to="/setting">
          <i
            v-if="this.$route.path=='/setting'"
            class="icon-gears-f"></i>
          <i
            v-else
            class="icon-gears"></i>
        </router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

  export default {
    head: {
      title(){
        return {
          inner: this.$lang.variables.settings
        }

      },
    },
    methods: {
      goBackSettings(){
        history.go(-1);
      }
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/settings.less';
</style>
