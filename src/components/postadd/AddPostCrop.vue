<template>
  <div class="add-post-crop">
    <in-header-block class="header header-gradient">
      <div
        @click="goBack"
        class="header-back">
        <i class="icon-left-f"></i>
      </div>
      <div class="header-content">
        <span class="header-content-name">{{$lang.variables.addPost}}</span>
      </div>
      <div class="empty-block"></div>
    </in-header-block>

    <div class="add-post-crop-container">
      <template v-if="currentFile">
        <div
          v-if="currentFile.type  === 'video'"
          class="video-container">
          <video
            class="add-post-video"
            :key="currentFile.name"
            :class="isFullVideo ? 'add-post-video-contain' : 'add-post-video-cover'"
            ref="video"
            :muted="isMute"
            loop
            controls
            autoplay
            :src="currentFile.file">
          </video>
        </div>

        <div
          v-else-if="currentFile.type  === 'image'"
          :key="currentFile.name"
          class="image-container">
          <croppa
            :key="currentFile.name"
            v-model="cropper"
            :width="cropperSize"
            :height="cropperSize"
            :quality="qualityImage"
            :initial-image="currentFile.file"
            :prevent-white-space="true"
            :show-remove-button="false"
            @zoom="zoom"
            @move="move"
            @initial-image-loaded="newImage"
            :placeholder="placeholder">
            <in-spinner :loading="loading" class="spinner-center"></in-spinner>
          </croppa>
          <in-grid/>
        </div>
      </template>
      <div
        v-else
        class="empty-add-block"
        @click="addFile">{{$lang.variables.chooseAPhoto}}
      </div>
    </div>

    <div class="slider-container">
      <swiper :options="swiperOption">
        <swiper-slide
          v-for="(file, index) in tempFiles"
          :key="file.name">
          <div class="post-slide">
            <div
              v-if="file.type === 'image'"
              :style="{backgroundImage: `url(${file.cropped ? file.cropped : file.file})`}"
              @click="changeCurrentIndex(index)"
              class="post-slide-img"></div>
            <div
              v-else
              @click="changeCurrentIndex(index)"
              class="post-slide-video">
              <video
                class="not-touch"
                autoplay
                muted
                loop
                :src="file.file"></video>
            </div>
            <div
              @click="deleteFile(index)"
              class="delete-file">
              <i class="icon-delete-f"></i>
            </div>
          </div>
        </swiper-slide>
        <swiper-slide v-if="tempFiles.length < 5">
          <div
            @click="addFile"
            class="block-add">
            <i class="block-add-icon icon-plus-f"></i>
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <div class="actions-buttons">
      <button
        class="action-post-button"
        @click="goNextStep">{{$lang.variables.next}}
      </button>
    </div>

    <in-file-input
      ref="fileInput"
      :redirect="redirectOnFileInput"
      :multiple="true"/>

    <in-spinner-bg :loading="loadingCrop"></in-spinner-bg>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex';

  import {CHANGE_METADATA, moduleName as newPostModule, DELETE_FILE, SORT_TEMPORARY_FILES} from "Store/modules/newPost"
  import Grid from 'ComponentsVue/UI/Grid';

  export default {
    name: "AddPostCrop",
    props: {
      tempFiles: {
        type: Array,
        default: []
      },
      goNext: {
        type: Function,
        required: true
      },
      authUser: {
        type: Object,
        required: true
      },
      goBack: {
        type: Function,
        required: true
      },
      redirectOnFileInput: [String, Object],
    },
    components: {
      inGrid: Grid
    },
    data() {
      return {
        cropperSize: null,
        qualityImage: 3,
        cropper: null,
        imgArray: window.img,
        isPlay: true,
        isMute: true,
        previewVideo: '',
        isFullVideo: true,
        preview: null,
        currentIndex: 0,
        swiperOption: {
          slidesPerView: 'auto',
          spaceBetween: 5,
          freeMode: true,
        },
        isZoom: false,
        isMove: false,
        nextIndex: null,
        isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
        loadingCrop: false,
        rotating: false
      }
    },
    computed: {
      currentFile() {
        if (this.tempFiles.length === 0) {
          return null
        }
        if (this.currentIndex >= this.tempFiles.length) {
          return this.tempFiles[this.tempFiles.length - 1]
        }
        return this.tempFiles[this.currentIndex]
      },
      loading() {
        return this.cropper && this.cropper.loading
      },
      placeholder() {
        return this.loading ? '' : this.$lang.variables.chooseAPhoto
      },
      size() {
        return this.cropperSize * this.qualityImage
      },
    },
    watch: {
      tempFiles() {
        if (this.nextIndex) {
          this.changeCurrentIndex(this.nextIndex);
          this.nextIndex = null;
        }
      }
    },
    mounted() {
      this.cropperSize = parseInt(localStorage.getItem('clientWidth'));
      this.qualityImage = Math.ceil(1080 / this.cropperSize);
      console.log(navigator)
    },
    methods: {
      ...mapMutations({
        changeMetadata: newPostModule + CHANGE_METADATA,
        deleteFileAction: newPostModule + DELETE_FILE,
        sortTempFiles: newPostModule + SORT_TEMPORARY_FILES
      }),
      deleteFile(index) {
        if (this.currentIndex === index) {
          if (this.currentIndex === this.tempFiles.length - 1 && this.currentIndex !== 0) {
            this.nextIndex = this.currentIndex - 1;
          } else {
            this.nextIndex = this.currentIndex;
          }
          this.currentIndex = this.nextIndex;
          if (this.cropper) this.cropper.refresh();
        }
        let newFiles = this.tempFiles.filter((item, i) => i !== index);
        this.sortTempFiles(newFiles);
      },
      goNextStep() {
        this.loadingCrop = true;
        setTimeout(() => {
          this.croppFile();
          this.goNext();
        }, 0);
      },
      zoom() {
        this.isZoom = true;
      },
      move() {
        this.isMove = true;
      },
      newImage() {
        if (this.currentFile.metadata) {
          this.$nextTick(() => {
            if (this.cropper) {
              this.cropper.applyMetadata(this.currentFile.metadata);
            }
          });
        }
      },
      addFile() {
        this.nextIndex = this.tempFiles.length;
        if (this.currentFile && this.currentFile.type === 'image') {
          this.croppFile();
        }
        if (this.$userStatus(this.authUser)) {
          this.$refs.fileInput.emitClick();
        }
      },
      croppFile() {
        if (this.currentFile && this.currentFile.type === 'image') {
          if (!this.currentFile.metadata || this.isZoom || this.isMove) {
            const payload = {
              index: this.currentIndex,
              cropped: this.cropper.generateDataUrl('image/jpeg', 0.8),
              metadata: this.cropper.getMetadata()
            };
            this.changeMetadata(payload);
          }
          this.isZoom = false;
          this.isMove = false;
        }
      },
      changeCurrentIndex(i) {
        if (i < this.tempFiles.length) {
          this.croppFile();
        }

        this.currentIndex = i;

        if (this.tempFiles[i].type === 'image') {
          this.cropper.refresh();
        }
      }
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  .modal-rotate {
    width: 100vw;
    height: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    z-index: 100;
    background: #fff;
  }

  .not-touch {
    pointer-events: none;
  }

  .rotate {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      font-size: 5vw;
      color: #fff;
      text-shadow: 0 0 2px black;
      transform: scaleY(-1);
    }
  }

  .empty-add-block {
    width: 100vw;
    height: 100vw;
    border-bottom: 1px solid #d3d3d3;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 5vw;
  }

  .block-add {
    height: calc(~'22vw - 2px');
    width: calc(~'22vw - 2px');
    border: 1px solid #0cb4be;
    /*border-radius: 8px;*/
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fcfcfc;

    &-icon {
      font-size: 30px;
      .text-grad();
    }
  }

  .delete-file {
    position: absolute;
    top: 0;
    right: 0;
    padding: 3px;

    .icon-delete-f {
      color: #fff;
      text-shadow: 0 0 2px black;
    }
  }

  .add-post-crop .swiper-container {
    margin: 10px 0;
    padding: 0 5px;
  }

  .add-post-crop .swiper-slide {
    height: 22vw;
    width: 22vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .post-slide {
    height: 22vw;
    width: 22vw;
    box-sizing: border-box;

    &-img {
      width: 100%;
      height: 100%;
      background-position: center;
      background-size: cover;
    }

    &-video {
      width: 100%;
      height: 100%;
      background: #000;

      video {
        width: 100%;
        height: 100%;
      }
    }
  }

  .add-post-crop {
    margin-top: -3px;

    canvas {
      border-radius: 0;
      border: 0;
      border-bottom: 1px solid #d3d3d3;
      background: #fff !important;
      color: #9e9e9e !important;
    }

    .preview {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      filter: blur(0.5em);
      overflow: hidden;
      background-size: cover;
      background-position: center;
    }

    .image-container {
      position: relative;
      width: 100vw;
      height: 100vw;
    }

    .video-container {
      position: relative;
      width: 100vw;
      height: 100vw;
      overflow: hidden;
      background: #000;

      .add-post-video {
        width: 100vw;
        height: 100vw;


        &-contain {

        }

        &-cover {
          min-width: 100vw;
          min-height: 100vw;
          width: auto;
          height: auto;
        }
      }
    }

    &-container {
      position: relative;

      .croppa-container {
        position: relative;
      }
    }

    .actions-buttons {
      width: 100%;
      padding: 10px;
      margin-top: 10px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;

      .action-post-button {
        width: calc(~'50% - 5px');
      }
    }
  }
</style>
