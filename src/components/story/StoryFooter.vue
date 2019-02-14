<template>
  <div class="story-footer">
    <p v-if="isPaused" class="story-footer__paused-indicator">
      <img
        class="story-footer__paused-icon"
        src="https://media.inrating.top/storage/img/default/Pause.png"
        alt="pause" />
    </p>
    <p class="story-footer__title story-title-text"><in-text-with-mentions :text="text"/></p>
    <div class="story-footer__action-menu story-action-menu">
      <!-- TODO: NOTE: this feature is hided before production release -->
      <template v-if="true || !isStoryAuthoredByCurrentUser">
        <i @click="$emit('action:open-chat')" class="story-action-menu__item icon-letter"></i>
        <!-- showGifts -->
        <i @click="$emit('action:show-gifts')" class="story-action-menu__item icon-gift"></i>
        <div class="like-icon-container" :class="likeIconContainerAnimationClass">
          <in-toggleable-icon
            class="story-action-menu__item"
            :class="likeIconAnimationClass"
            className="icon-heart"
            :is-active="isStoryLiked"
            @click.native="$emit('action:like')"/>
        </div>
        <in-toggleable-icon
          class="story-action-menu__item"
          className="icon-bookmark"
          :is-active="isStoryBookmarked"
          @click.native="$emit('action:add-to-bookmarks')"/>
      </template>
      <template v-else>
        <i @click="$emit('action:show-statistics')" class="story-action-menu__item icon-scale"></i>
      </template>
      <i @click="$emit('action:open-menu')" class="story-action-menu__item icon-vvv"></i>
    </div>
  </div>
</template>

<script>
  import StoryFooterItem from 'ComponentsVue/story/StoryFooterItem';
  import ToggleableIcon from 'ComponentsVue/UI/ToggleableIcon';


  export default {
    components: {
      inStoryFooterItem: StoryFooterItem,
      inToggleableIcon: ToggleableIcon,
    },
    props: {
      isPaused: Boolean,
      text: String,
      storyId: Number,
      activeGiftId: Number,
      isStoryLiked: Boolean,
      isStoryBookmarked: Boolean,
      isStoryAuthoredByCurrentUser: Boolean,
    },
    computed: {
      likeIconContainerAnimationClass() {
        if (this.isLike) {
          if (this.activeGiftId === 41) {
            return 'like-animation-41'
          } else if (this.activeGiftId === 42) {
            return 'like-animation-42'
          }
        }
        return '';
      },
      likeIconAnimationClass() {
        return this.isStoryLiked && (this.isActivePremium
          ? 'premium-icon'
          : '');
      },
      isActivePremium() {
        return this.activeGiftId === 41 || this.activeGiftId === 42;
      },
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  .story-footer {
    display: flex;

    color: @white;
    justify-content: space-between;
    align-items: center;
    font-size: 25px;
    z-index: 111;
    width: 100%;
    position: absolute;
    bottom: 0px;
    padding:10px 6% ;
    flex-wrap: wrap;
    box-sizing: border-box;

    background: linear-gradient(180deg,transparent,#000);
  }

  .story-footer__paused-indicator {
    margin: 5px;
    text-align: center;
  }

  .story-footer__paused-icon {
    text-align: center;
    width: 5%;
    display: block;
    margin: auto;
    padding: 5px 6px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 3px;
  }

  .story-footer__title {
    margin: 12px 0;
  }

  .story-footer__action-menu {
    display: flex;
    flex-flow: row;
    justify-content: space-around;
    width: 100%;
  }

  .story-action-menu__item {
    .text-grad();
  }

  .premium-icon {
    background: linear-gradient(to right bottom, #f00, #000 95%) !important;
    opacity: 0.8;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
  }
</style>
