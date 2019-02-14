<template>
  <div class="new-post-loading">
    <div class="preview" v-if="preview">
      <div
      v-if="preview.type === 'image'"
      :style="{backgroundImage: `url(${preview.cropped ? preview.cropped : preview.file})`}"
      class="preview-img"></div>
      <video
      v-else
      class="not-touch"
      autoplay
      muted
      :src="preview.file"></video>
    </div>
    <div class="description">Ваш пост загружается...</div>
    <div
      :style="{width: progress}"
      class="progress-loading-bar"></div>
  </div>


</template>

<script>
  import {mapGetters} from 'vuex';

  import {
    moduleName as newPostModule,
    PREVIEW
  } from "Store/modules/newPost";

  export default {
    name: "NewPostLoading",
    data() {
      return {
        showProgress: false
      }
    },
    computed: {
      ...mapGetters({
        preview: newPostModule + PREVIEW
      }),
      progress() {
        return this.showProgress ? '90%' : 0;
      }
    },
    mounted() {
      this.showProgress = true
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  .new-post-loading {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 5px;
    border-bottom: 1px solid #cccfcf;
    margin-bottom: 20px;
    position: relative;

    .preview {
      height: 10vw;
      width: 10vw;
      box-sizing: border-box;
      overflow: hidden;
      position: relative;
      border-radius: 3px;
      margin: 0 10px;

      &-img {
        width: 100%;
        height: 100%;
        background-position: center;
        background-size: cover;
      }

      video {
        min-width: 28vw;
        min-height: 28vw;
        width: auto;
        height: auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
      }
    }

    .description {
      font-size: 4vw;
    }

    .progress-loading-bar {
      position: absolute;
      bottom: -1px;
      left: 0;
      height: 2px;
      width: 0;
      transition: all 10s ease-out;
      .bgc-grad();
    }

    .not-touch {
      pointer-events: none;
    }
  }
</style>
