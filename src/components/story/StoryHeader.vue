<template>
  <div class="story-header">
    <div class="story-header__list stories-list">
      <swiper class="story-header__swiper" :options="swiperOptions" ref="storiesQueueSwiper">
        <swiper-slide
          v-for="(story, index) in storiesQueue"
          class="stories-list__item">
          <in-story-thumb
            class="stories-list__item-thumb"
            :thumb-source="story.thumbSource"
            :progress="currentStoryShowProgress"
            :is-active="index === currentStoryIndex" />
          <p class="stories-list__item-since">{{formatCreated(story.createdAtTimestamp)}}</p>
        </swiper-slide>
        <swiper-slide v-for="index in 4" :key="index"></swiper-slide>
      </swiper>
    </div>
    <div class="story-header__author story-author-info">
      <div class="story-author-info__info">
        <router-link :to="authorRouterLink" class="story-author-info__nickname">
          {{author.nickname}}
        </router-link>
        <div class="story-author-info__rating">R {{author.rating}}</div>
      </div>
      <div class="story-author-info__avatar">
        <router-link :to="authorRouterLink">
          <img class="story-author-info__avatar-image" :src="author.avatarSource" :alt="author.nickname"/>
        </router-link>
      </div>
    </div>
    <i class="story-header__close-button close-story-button icon-delete-f" @click="$emit('close')"></i>
  </div>
</template>

<script>
  import moment from 'moment';
  import StoryThumb from 'ComponentsVue/story/StoryThumb'


  export default {
    components: {
      inStoryThumb: StoryThumb,
    },
    props: {
      storiesQueue: {
        type: Array,
        required: true,
        validator(stories) {
          for(const story of stories) {
            const isValid = typeof story.createdAtTimestamp === 'number' &&
              typeof story.thumbSource === 'string';
            if(!isValid) return isValid;
          }
          return true;
        },
      },
      currentStoryIndex: Number,
      currentStoryShowProgress: {
        type: Number,
        validator(progress) {
          return progress >= 0 && progress <= 100;
        },
      },
      author: {
        type: Object,
        required: true,
        validator(author) {
          const isValid = typeof author.nickname === 'string' &&
            typeof author.rating === 'number' &&
            typeof author.avatarSource === 'string';
          !isValid && console.warn('Not valid author', author);
          return isValid;
        },
      },
    },
    watch: {
      currentStoryIndex(nextValue, prevValue) {
        if(nextValue > prevValue) {
          this.swiper.slideNext();
        } else if (nextValue < prevValue) {
          this.swiper.slidePrev();
        }
      },
      storiesQueue(nextQueue, prevQueue) {
        if(nextQueue.length !== prevQueue.length) {
          this.swiper.slideTo(0);
        } else {
          for(const i in nextQueue.length) {
            if(nextQueue[i] !== prevQueue[i]) {
              this.swiper.slideTo(0);
            }
          }
        }
      }
    },
    data() {
      return {
        swiperOptions: {
          slidesPerView: 4,
          spaceBetween: 3,
          slidesOffsetBefore: 3,
          slidesOffsetAfter: 3,
        },
      }
    },
    computed: {
      authorRouterLink() {
        return {
          name: 'profile-posts',
          params: {
            nickname: this.author.nickname
          },
        };
      },
      swiper() {
        return this.$refs.storiesQueueSwiper.swiper;
      }
    },
    methods: {
      formatCreated(timestamp) {
        const duration = moment.duration(moment().diff(moment(timestamp))),
          years = Math.floor(duration.asYears()),
          days = Math.floor(duration.asDays()),
          hours = Math.floor(duration.asHours()),
          minutes = Math.floor(duration.asMinutes()),
          seconds = Math.floor(duration.asSeconds());
        if(years > 0) {
          return years + this.$lang.variables.storiesYears;
        } else if(days > 0) {
          return days + this.$lang.variables.storiesDays;
        } else if(hours > 0) {
          return hours + this.$lang.variables.storiesHours;
        } else if(minutes > 0) {
          return minutes + this.$lang.variables.storiesMinutes;
        }
        return seconds + this.$lang.variables.storiesSeconds;
      },
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  .story-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    position: absolute;
    padding-top: 8px;
    padding-bottom: 10px;
    top:1px;
    width: 100%;
    z-index: 111;
    background: linear-gradient(180deg, @black,transparent);
  }

  .story-header__list {
    width: 50vw;
  }

  .story-header__author {
    margin: 1.5vw 3vw 0 auto;
    width: 40%;
  }

  .story-header__close-button {
    margin: 1.5vw 3vw 0 0;
  }

  .stories-list__item {
    display: block !important;
  }

  @avatarSize: 10vw;
  @authorInfoRightMargin: 5px;

  .stories-list__item-thumb {
    height: 10vw;
    width: 10vw;
  }

  .stories-list__item-since {
    position: relative;
    top: 2px;
    color: #fff;
    font-size: 3.5vw;
    margin: 0;
  }

  .story-author-info {
    display: flex;
    flex-flow: row;

  }

  .story-author-info__info {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    margin-right: 5px;
    width: ~"calc(100% - " @avatarSize ~" - " @authorInfoRightMargin ~")";
  }

  .story-author-info__nickname {
    color: @white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
    font-size: 4vw;
  }

  .story-author-info__rating {
    color: @white;
    font-size: 3.8vw;
    text-align: right;
  }

  .story-author-info__avatar {
    width: 10vw;
  }

  .story-author-info__avatar-image {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 3px;
  }

  .close-story-button {
    color: @white;
  }

  .story-header__swiper {
    background-color: transparent !important;
    -webkit-transition: background-color 0s;
    -moz-transition: background-color 0s;
    -ms-transition: background-color 0s;
    -o-transition: background-color 0s;
    transition: background-color 0s;
  }
</style>
