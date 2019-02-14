<template>
  <form class="add-story-album-stories-selection-step" @submit.prevent="submitHandler">
    <div class="add-story-album-stories-selection-step__grid">
      <div class="add-story-album-stories-selection-step__grid-item"
           @click="toggleSelectionOfStory(story.id)"
           v-for="story in stories"
           :style="{backgroundImage: `url(${story.previewSource})`}" >
        <i v-if="isStorySelected(story.id)" class="add-story-album-stories-selection-step__selected-story-icon icon-check-f"></i>
      </div>
    </div>
    <in-spinner :loading="storiesLoading" />
    <button class="add-story-album-stories-selection-step__next-button" type="submit">{{$lang.variables.next}}</button>
  </form>
</template>

<script>
  export default {
    props: {
      stories: Array,
      storiesLoading: Boolean,
    },
    data() {
      return {
        whichStoriesAreSelected: {},
      };
    },
    created() {
      document.querySelector('#app').style.setProperty ('padding-bottom', '0', 'important');
    },
    destroyed() {
      document.querySelector('#app').style.removeProperty('padding-bottom');
    },
    methods: {
      toggleSelectionOfStory(id) {
        this.$set(this.whichStoriesAreSelected, id, !this.isStorySelected(id));
      },
      isStorySelected(id){
        return this.whichStoriesAreSelected.hasOwnProperty(id) && this.whichStoriesAreSelected[id];
      },
      submitHandler() {
        const {whichStoriesAreSelected} = this;
        const selectedIds = Object.keys(whichStoriesAreSelected)
          .filter(id => whichStoriesAreSelected[id])
          .map(id => Number.parseInt(id));
        if (selectedIds.length > 0) {
          this.$emit('next', selectedIds);
        } else {
          this.$notify({
            group: 'add-new-story-album__stories-are-not-selected',
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

  .add-story-album-stories-selection-step {

  }

  .add-story-album-stories-selection-step__grid {
    overflow-y: scroll;
    top: 40px;
    position: absolute;
    bottom: ~"calc(6vw + 22px)";
    left: 0;
    right: 0;
    text-align: left;
    line-height: 1;
  }

  .add-story-album-stories-selection-step__grid-item {
    margin: 2px 1px 0 1px;
    border-radius: 5px;
    padding: 30.5% ~"calc(25% - 2px)" 0 0;
    background-size: cover;
    background-position: center center;
    position: relative;
    height: 0;
    width: 0;
    display: inline-block;
  }

  .add-story-album-stories-selection-step__selected-story-icon {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 1em;
    height: 1em;
    .text-grad();
    font-size: 300%;
  }

  .add-story-album-stories-selection-step__next-button {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    border: none;
    border-top: 1px solid @middle_grey;
    border-radius: 0;
    font-size: 5vw;
    padding: 10px 10px;
  }
</style>
