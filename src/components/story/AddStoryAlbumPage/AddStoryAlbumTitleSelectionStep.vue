<template>
  <form class="add-story-album-title-selection-step" @submit.prevent="submitHandler">
    <swiper
      :options="swiperOptions"
      class="add-story-album-title-selection-step__slider title-selection-slider"
      :class="{'title-selection-slider_justify-center': selectedStories && selectedStories.length < swiperOptions.slidesPerView}">
      <swiper-slide
        v-for="story in selectedStories"
        class="title-selection-slider__slide">
        <div
          class="title-selection-slider__image"
          :style="{backgroundImage: `url(${story.previewSource})`}"></div>
      </swiper-slide>
    </swiper>
    <div
      class="add-story-album-title-selection-step__selected-cover"
      :style="{backgroundImage: `url(${selectedCover})`}" >
    </div>
    <input
      type="text"
      class="add-story-album-title-selection-step__title-input"
      v-model="title"
      :placeholder="$lang.variables.typeNameOfStoryAlbum"
    />
    <button class="add-story-album-title-selection-step__next-button" type="submit">{{$lang.variables.createStoryAlbum}}</button>
  </form>
</template>

<script>
  export default {
    props: {
      selectedStories: Array,
      selectedCover: String,
    },
    data() {
      return {
        title: '',
        swiperOptions: {
          freeMode: true,
          slidesPerView: 5,
          spaceBetween: 4,
          slidesOffsetBefore: 4,
          slidesOffsetAfter: 4,
        },
      };
    },
    methods: {
      submitHandler() {
        const {title} = this;
        const isTitleEntered = title && title.trim();
        if (isTitleEntered) {
          this.$emit('next', title);
        } else {
          this.$notify({
            group: 'add-new-story-album__title-is-not-entered',
            duration: 3000,
            speed: 300,
          })
        }
      }
    },
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  .add-story-album-title-selection-step {

  }

  .title-selection-slider {
    margin: 15px 0;
  }

  .title-selection-slider_justify-center .swiper-wrapper {
    justify-content: center;
  }

  .title-selection-slider__slide {
  }

  .title-selection-slider__image {
    padding: 0 0 100% 0;
    background-size: cover;
    background-position: center center;
    border-radius: 5px;
  }

  .add-story-album-title-selection-step__selected-cover {
    width: 0;
    height: 0;
    padding: 30%;
    background-size: cover;
    background-position: center center;
    border-radius: 5px;
    margin: 15px auto;
  }

  .add-story-album-title-selection-step__title-input {
    border-radius: 3px;
    border: 1px solid #5ac5c6;
    color: @present_grey;
    margin: 15px auto;
    display: block;
    text-align: left;
    padding: 8px 10px;
    width: calc(95% - 20px);
  }

  .add-story-album-title-selection-step__next-button {
    width: 48%;
    margin: 15px auto;
    display: block;
  }
</style>
