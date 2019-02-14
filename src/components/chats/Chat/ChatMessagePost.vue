<template>
  <div
    class="chat-message-post"
    :class="{'chat-message-post-deleted': !post}">
    <template v-if="post">
      <div class="chat-message-post-shared">
        <div class="chat-message-post-shared-title">{{$lang.variables.sharedPost}}</div>
        <div
          class="chat-message-post-shared-nickname"
          v-text="post.author.nickname"
          @click="goToUser"></div>
      </div>
      <img
        class="chat-message-post-img"
        ref="post"
        @click="goToPost"
        @load="onLoadPost"
        :src="preview">
      <in-chat-message-seen-status
        v-if="!forward && side === 'right'"
        :message="message"
        :fixed="false" />
    </template>
    <div v-else>
      {{$lang.variables.postHasBeenDeleted}}
    </div>
  </div>
</template>

<script>
  import ChatMessageSeenStatus from 'ComponentsVue/chats/Chat/ChatMessageSeenStatus';

  export default {
    name: "ChatMessagePost",
    components: {
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
    computed: {
      post() {
        return this.message.attachments.posts && this.message.attachments.posts[0];
      },
      firstId() {
        return this.post.attachments_order[0].id
      },
      firstType() {
        return this.post.attachments_order[0].type
      },
      preview() {
        if(this.firstType === 'image') {
          return this.post.attachments.images.filter(item => item.id === this.firstId)[0].url_medium
        } else {
          return this.post.attachments.videos.filter(item => item.id === this.firstId)[0].preview_url
        }
      }
    },
    methods: {
      onLoadPost(e) {
        const {naturalWidth, naturalHeight} = e.target;
        if(this.$refs.post) {
          this.$refs.post.style.height = Math.floor(61 * naturalHeight / naturalWidth) + 'vw';
        }
        this.$root.$emit('changeMessagesScroll');
      },
      goToUser() {
        this.$router.push(`/u/${this.post.author.nickname}`);
      },
      goToPost() {
        this.$router.push(`/p/${this.post.slug}`);
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .chat-message-post {
    width: 61vw;
    padding: 5px;

    &-shared {
      text-align: center;
      padding: 5px;
      font-size: 3.6vw;

      &-title {
        padding-bottom: 5px;
        font-style: italic;
      }

      &-nickname {
        color: @contest-list-text-color;
        font-size: 3.7vw;
      }
    }

    &-img {
      width: 61vw;
      vertical-align: middle;
    }

    &-deleted {
      padding: 10px;
      font-size: 3.7vw;
      width: auto;
    }
  }
</style>
