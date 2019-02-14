<template>
  <div class="stories-list__item-thumb story-thumb"
       :style="{backgroundImage: `url(${thumbSource})`}">
    <template v-if="isActive">
      <div class="story-thumb__top-border" :style="topBorderStyle"></div>
      <div class="story-thumb__right-border" :style="rightBorderStyle"></div>
      <div class="story-thumb__bottom-border" :style="bottomBorderStyle"></div>
      <div class="story-thumb__left-border" :style="leftBorderStyle"></div>
    </template>
  </div>
</template>

<script>
  export default {
    props: {
      thumbSource: String,
      progress: {
        type: Number,
        default: 0,
      },
      isActive: {
        type: Boolean,
        default: false,
      },
      borderSize: {
        type: Number,
        default: 2,
      },
    },
    computed: {
      progressSidesPercents() {
        const { progress } = this;

        let top = Math.min(progress / 25, 1);
        let right = Math.min((progress - 25) / 25, 1);
        let bottom = Math.min((progress - 50) / 25, 1);
        let left = Math.min((progress - 75) / 25, 1);
        return {
          top: top * 100,
          right: right * 100,
          bottom: bottom * 100,
          left: left * 100,
        }
      },
      topBorderStyle() {
        return this.getBorderStyle('width', this.progressSidesPercents.top);
      },
      rightBorderStyle() {
        return this.getBorderStyle('height', this.progressSidesPercents.right);
      },
      bottomBorderStyle() {
        return this.getBorderStyle('width', this.progressSidesPercents.bottom);
      },
      leftBorderStyle() {
        return this.getBorderStyle('height', this.progressSidesPercents.left);
      },
    },
    methods: {
      getBorderStyle(property, percents) {
        const { borderSize } = this;
        return {
          [property]: percents <= 0
            ? '0'
            : `calc(${percents}% + ${borderSize * 2}px`,
        };
      },
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  @story-thumb-border-size: 2px;

  .story-thumb {
    border-radius: 3px;
    background-size: cover;
    border: @story-thumb-border-size solid @base_green;
    position: relative;
  }

  .story-thumb__top-border,
  .story-thumb__right-border,
  .story-thumb__bottom-border,
  .story-thumb__left-border {
    position: absolute;
    display: block;
    border-radius: inherit;
    // transition: 250ms;
  }

  .story-thumb__top-border {
    height: 100%;
    border-top: @story-thumb-border-size solid @white;
    top: -@story-thumb-border-size;
    left: -@story-thumb-border-size;
  }
  .story-thumb__right-border {
    width: 100%;
    border-right: @story-thumb-border-size solid @white;
    top: -@story-thumb-border-size;
    right: -@story-thumb-border-size;
  }

  .story-thumb__bottom-border {
    height: 100%;
    border-bottom: @story-thumb-border-size solid @white;
    bottom: -@story-thumb-border-size;
    right: -@story-thumb-border-size;
  }

  .story-thumb__left-border {
    width: 100%;
    border-left: @story-thumb-border-size solid @white;
    left: -@story-thumb-border-size;
    bottom: -@story-thumb-border-size;
  }
</style>
