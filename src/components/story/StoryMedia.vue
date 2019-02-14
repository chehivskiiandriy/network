<template>
  <div class="story-media">
    <div class="story-media__blur" :style="storyBlurStyle"></div>
    <div v-if="isImage" class="story-media__image-container">
      <img v-show="!loading" @click="imageClickHandler" class="story-media__image"
           :src="mediaSource" @load="mediaLoadHandler">
      <in-spinner :loading="loading"></in-spinner>
    </div>
    <div v-else-if="isVideo" @click="videoClickHandler" class="story-media__video-container">
      <video v-show="!loading" ref="video" class="story-media__video"
             :src="mediaSource" @play="playHandler" @loadedmetadata="loadVideoMetaDataHandler"></video>
      <img v-show="!loading && !playVideo && mediaSource"
           class="story-media__video-play-button"
           src="https://media.inrating.top/storage/img/default/Play.png" />
      <in-spinner :loading="loading"></in-spinner>
    </div>
    <div class="story-media__click-area story-media__click-area_left" @click="$emit('left-click')"></div>
    <div class="story-media__click-area story-media__click-area_right" @click="$emit('right-click')"></div>
  </div>
</template>

<script>
  export default {
    props: {
      mediaSource: String,
      previewSource: String,
      mediaType: String,
      playVideo: Boolean,
    },
    data() {
      return {
        loading: false,
      };
    },
    watch: {
      playVideo(isPlayVideo) {
        const video = this.$refs.video;
        video && (isPlayVideo
            ? video.play()
            : video.pause());
      },
      mediaSource(val) {
        this.mediaSourceChangeHandler();
      }
    },
    computed: {
      isImage() {
        return this.mediaType === 'image';
      },
      isVideo() {
        return this.mediaType === 'video';
      },
      storyBlurStyle() {
        return {
          backgroundImage: `url(${this.previewSource})`
        };
      },
    },
    methods: {
      imageClickHandler() {
        return this.emitPauseAnimationEvent();
      },
      videoClickHandler() {
        this.$emit('toggle-animation');
      },
      emitPauseAnimationEvent() {
        return this.$emit('toggle-animation');
      },
      mediaSourceChangeHandler() {
        this.loading = true;
      },
      mediaLoadHandler(event) {
        this.loading = false;
      },
      loadVideoMetaDataHandler(event) {
        this.mediaLoadHandler();
      },
      playHandler() {
        this.$emit(''/* TODO: */, this.$refs.video.duration);
      }
    },
  }
</script>

<style lang="less">
  .story-media {
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    display: flex;
    flex-flow: column;
    justify-content: center;
    max-height: 100vh;
    overflow: hidden;
  }

  .story-media__blur {
    height: 100%;
    width: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    z-index: -1;
    filter: blur(1.5em);
    top: 0;
    position: absolute;
  }

  .story-media__image {
    width: 100%;
    height: auto;
  }

  .story-media__video-container {
    position: relative;
  }

  .story-media__video {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 5px;
    z-index: 111;
  }

  .story-media__video-play-button {
    position: absolute;
    width: 30%;
    display: block;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    right: 0;
  }

  .story-media__click-area {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 33vw;
  }

  .story-media__click-area_left {
    left: 0;
  }

  .story-media__click-area_right {
    right: 0;
  }
</style>
