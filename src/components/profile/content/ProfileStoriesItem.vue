<template>
  <div class="profile-stories-item">
    <router-link :to="{name: 'archived-story', params: { storySlug } }">
      <div class="profile-stories-item__image-background" :style="{backgroundImage:'url('+storyPreview+')'}"></div>
    </router-link>
  </div>
</template>
<script>
  export default {
    props: {
      story: {
        type: Object,
        required: true,
      }
    },
    computed: {
      storyMediaType() {
        return this.story &&
          this.story.attachments_order &&
          this.story.attachments_order[0] &&
          this.story.attachments_order[0].type;
      },
      storyPreview() {
        const attachments = this.story.attachments;
        switch(this.storyMediaType) {
          case 'video':
            return attachments.videos && attachments.videos[0] && attachments.videos[0].preview_url;
          case 'image' :
            return attachments.images && attachments.images[0] && attachments.images[0].url_medium;
        }
      },
      storySlug() {
        return this.story.slug;
      }
    },
  }

</script>
<style lang="less">
  @import '~LessStyle/post.less';

  .profile-stories-item {
    width: calc(~'25vw - 2.5px');
    height: calc(~'25vw - 2.5px');
    display: inline-block;
    position: relative;
    margin: 0 0 2px 2px;
  }

  .profile-stories-item__image-background {
    background-size: cover;
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }

</style>
