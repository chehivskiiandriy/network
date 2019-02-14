<template>
  <div
    ref="videobody"
    class="chat-message-video">
    <div
      @click="playVideo"
      class="chat-message-video-body">
      <video
        class="chat-message-video-container"
        :src="message.attachments.videos[0].url"
        :poster="message.attachments.videos[0].preview_url"
        ref="video"
        @loadedmetadata="onLoadVideo"
        muted
        loop
        @webkitfullscreenchange="existHandler"
        @mozfullscreenchange="existHandler"
        @fullscreenchange="existHandler"
        @MSFullscreenChange="existHandler"></video>
      <img
        class="chat-message-video-play"
        src="https://media.inrating.top/storage/img/default/Play.png">
    </div>
    <div class="chat-message-video-text">
      <in-chat-message-text
        v-if="message.message"
        :message="message"
        :side="side"
        :forward="forward"
        :class="[side === 'right' ? 'chat-message-text-right' : 'chat-message-text-left']"/>
    </div>
    <in-chat-message-seen-status
      v-if="!forward && side === 'right' && !message.message"
      :message="message"/>
  </div>
</template>

<script>
  import ChatMessageText from 'ComponentsVue/chats/Chat/ChatMessageText';
  import ChatMessageSeenStatus from 'ComponentsVue/chats/Chat/ChatMessageSeenStatus';

  export default {
    name: "ChatMessageVideo",
    components: {
      inChatMessageText: ChatMessageText,
      inChatMessageSeenStatus: ChatMessageSeenStatus
    },
    props: {
      message: {
        type: Object,
        required: true
      },
      side: {
        type: String,
        required: true
      },
      forward: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isPlayVideo: false,
        isMutedVideo: true
      }
    },
    methods: {
      playVideo() {
        let elem = document.documentElement;
        if (elem.requestFullscreen) {
          this.$refs.video.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          this.$refs.video.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
          this.$refs.video.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          this.$refs.video.msRequestFullscreen();
        }
        this.$refs.video.play();
      },
      muteVideo() {
        if (this.isMutedVideo) {
          this.$refs.video.muted = false;
          this.isMutedVideo = false;
        } else {
          this.$refs.video.muted = true;
          this.isMutedVideo = true;
        }
      },
      existHandler() {
        if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
          this.$refs.video.pause();
        }
      },
      onLoadVideo(e) {
        const {videoWidth, videoHeight} = e.target;

        if (this.$refs.videobody) {
          let height = Math.floor(61 * videoHeight / videoWidth);
          this.$refs.videobody.style.height = height > 50 ? height : 50 + 'vw';
        }
        this.$root.$emit('changeMessagesScroll');
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .chat-message-video {
    width: 61vw;
    padding: 5px;

    &-body {
      position: relative;
      width: 61vw;
    }

    &-container {
      width: 61vw;
      vertical-align: middle;
      min-height: 50vw;
      background: #000000;
    }

    &-play {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 20%;
    }

    &-muted {
      position: absolute;
      padding: 8px 11px;
      bottom: 0;
      right: 0;
      color: @white;
    }

    &-full-screen {
      position: absolute;
      padding: 8px 11px;
      bottom: 0;
      left: 0;
      color: @white;
    }

    &-text {
      border-radius: 0 0 5px 5px;
      overflow: hidden;
      /*box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.1);*/
    }
  }
</style>
