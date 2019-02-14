<template>
  <div class="group-video-item">
    <div
      @click="goToPost"
      class="group-video-background">
      <div
        :style="{backgroundImage: 'url(' + video.attachments.videos[0].preview_url + ')'}"
        class="previewUrl">
      </div>
      <div class="group-video-play">
        <img
          :src="imgArray.Play"
          class="group-video-play-img">
      </div>
      <div
        class="blur-background"
        :style="{backgroundImage: 'url(' + video.attachments.videos[0].preview_url + ')'}"></div>
    </div>
    <div
      @click="goToUser"
      class="group-video-nickname">
      <span
        class="info-nickname"
        v-text="$textLength(video.author.nickname, 16)"></span>
    </div>
    <div
      @click="goToUser"
      class="group-video-avatar">
      <img :src="video.author.avatar_image.url_small" />
    </div>
  </div>
</template>

<script>
  export default {
    name: "GroupVideoItem",
    props: {
      video: Object
    },
    data() {
      return {
        imgArray: window.img,
      }
    },
    methods: {
      goToPost() {
        this.$router.push('/p/' + this.video.slug);
      },
      goToUser() {
        this.$router.push('/u/' + this.video.author.nickname);
      }
    }
  }
</script>

<style lang="less" scoped>
  .group-video-item {
    position: relative;
    width: 47vw;
    height: 47vw;
    margin: 1vw;
    overflow: hidden;
    border-radius: 10px;

    .group-video-background {
      height: 100%;
      width: 100%;
    }

    .blur-background {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      z-index: -1;
      filter: blur(0.5em);
      overflow: hidden;
      background-size: cover;
      background-position: center;
    }

    .group-video-play {
      width: 30%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      &-img {
        width: 100%;
      }
    }

    .previewUrl {
      width: 100%;
      height: 100%;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }

    .group-video-nickname {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: auto;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9));
      border-radius: 0 0 5px 5px;
      text-align: right;
      color: #fff;
      padding: 2px 30% 4% 0;
      box-sizing: border-box;
    }

    .info-nickname {
      font-size: 2.7vw;
    }

    .group-video-avatar {
      position: absolute;
      right: 4%;
      bottom: 4%;
      height: 23%;
      width: 23%;

      img {
        border-radius: 4px;
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
