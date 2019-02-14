<template>
  <div
    @click="goToStory"
    class="profile-avatar">
    <div class="profile-avatar-container">
      <img
        class="profile-avatar-preview"
        :class="storyUser"
        :src="userAvatar">
      <img
        v-if="user.active_gift"
        class="profile-avatar-present"
        :src="user.active_gift.image">
      <div
        v-if="user.is_online"
        class="online-block"></div>
    </div>
    <div class="profile-avatar-name">
      {{user.name}} {{user.lastname}}
    </div>

  </div>
</template>
<script>
  export default {
    name: 'ProfileAvatar',
    props: {
      user: [Object, undefined]
    },
    computed: {
      storyUser() {
        return this.user.is_active_story
          ? this.user.is_story_seen
            ? 'profile-avatar-preview-story-seen-true'
            : 'profile-avatar-preview-story-seen-false'
          : ''
      },
      userAvatar() {
        return this.user.avatar_image ? this.user.avatar_image.url_medium : window.img.photoPlaceholder
      }
    },
    methods: {
      goToStory() {
        console.log('1111');
        if (this.user.is_active_story) {
          this.$router.push('/story/' + this.user.nickname)
        }
      }
    }
  }
</script>
<style lang="less">
  .avatar-img {
    width: 100%;
    height: auto;
    border-radius: 10px;
    display: block;
    box-sizing: border-box;
    padding: 3px;
  }

  .profile-avatar {
    position: absolute;
    top: 43px;
    width: 100vw;
    height: 40vw;
    text-align: center;

    &-preview {
      width: 30vw;
      border-radius: 10px;
      padding: 1px;

      &-story-seen-true {
        border: 2px solid #d3d3d3;
        border-radius: 10px;
      }

      &-story-seen-false {
        border: 2px solid #5ac5c6;
        border-radius: 10px;
      }
    }
  }

  .profileavatar-img--present {
    position: absolute;
    opacity: 0.7;
    width: 7vw;
    height: 7vw;
    bottom: 8%;
    right: 6px;
    background-color: #fff;
    padding: 1px;
    border-radius: 3px
  }
</style>

