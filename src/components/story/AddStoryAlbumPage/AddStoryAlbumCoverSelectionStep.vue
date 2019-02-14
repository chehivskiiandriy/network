<template>
  <form class="add-story-album-cover-selection-step" @submit.prevent="submitHandler">
    <in-add-story-album-cover-selection-cropper
      class="add-story-album-cover-selection-step__cropper"
      :selected-cover="selectedCover"
      ref="cropper"
      @upload="uploadCoverHandler"/>
    <swiper
      :options="swiperOptions"
      class="add-story-album-cover-selection-step__slider cover-selection-slider"
      :class="{'cover-selection-slider_justify-center': uploadedCovers && uploadedCovers.length < swiperOptions.slidesPerView}">
      <swiper-slide
        v-for="cover in uploadedCovers"
        class="cover-selection-slider__slide">
        <div
          class="cover-selection-slider__image"
          :class="{'cover-selection-slider__image_selected': isSelectedCover(cover)}"
          @click="selectCover(cover)"
          :style="{backgroundImage: `url(${cover})`}"></div>
      </swiper-slide>
    </swiper>
    <div class="add-story-album-cover-selection-step__button-container cover-selection-buttons">
      <button class="cover-selection-buttons__button" type="submit">{{$lang.variables.next}}</button>
      <button
        v-if="isNeedToShowChangeButton"
        class="cover-selection-buttons__button"
        @click="changeHandler"
        type="button">{{$lang.variables.selectAnother}}</button>
    </div>
  </form>
</template>

<script>
  import AddStoryAlbumCoverSelectionCropper from 'ComponentsVue/story/AddStoryAlbumPage/AddStoryAlbumCoverSelectionCropper';

  export default {
    components: {
      inAddStoryAlbumCoverSelectionCropper: AddStoryAlbumCoverSelectionCropper,
    },
    data() {
      return {
        selectedCover: null,
        uploadedCovers: [],
        swiperOptions: {
          freeMode: true,
          slidesPerView: 5,
          spaceBetween: 4,
          slidesOffsetBefore: 4,
          slidesOffsetAfter: 4,
        },
      };
    },
    computed: {
      isNeedToShowChangeButton() {
        return this.selectedCover || this.uploadedCovers.length > 0;
      },
    },
    methods: {
      selectCover(cover) {
        this.selectedCover = cover;
        console.log(cover);
      },
      submitHandler() {
        this.uploadedCovers.forEach(url => URL.revokeObjectURL(url));
        const dataUrl = this.$refs.cropper.getDataUrl();
        if(dataUrl){
          this.$emit('next', dataUrl);
        } else {
          this.$notify({
            group:'add-new-story-album__cover-is-not-selected',
            duration:3000,
            speed:300,
          })
        }
      },
      uploadCoverHandler(coverBlobUrl) {
        this.selectedCover = null;
        this.uploadedCovers.push(coverBlobUrl);
      },
      changeHandler() {
        this.$refs.cropper.changeImage();
      },
      isSelectedCover(cover) {
        return (this.selectedCover && this.selectedCover === cover) ||
          (!this.selectedCover && this.uploadedCovers.length > 0 &&
            this.uploadedCovers[this.uploadedCovers.length - 1] === cover);
      }
    },
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  .add-story-album-cover-selection-step {

  }

  .add-story-album-cover-selection-step__cropper {
    margin: 0 0 15px 0;
    width: 100vw;
    height: 100vw;
  }


  .cover-selection-slider_justify-center .swiper-wrapper {
    justify-content: center;
  }

  .cover-selection-slider__slide {
  }

  .cover-selection-slider__image {
    padding: 0 0 100% 0;
    background-size: cover;
    background-position: center center;
    border-radius: 5px;
    opacity: 0.3;
  }

  .cover-selection-slider__image_selected {
    opacity: 1;
  }

  .add-story-album-cover-selection-step__slider {
    margin: 15px 0;
  }

  .cover-selection-buttons {
    display: flex;
    justify-content: space-evenly;
  }

  .cover-selection-buttons__button {
    width: 48%;
  }
</style>
