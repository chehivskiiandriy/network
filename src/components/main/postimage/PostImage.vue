<template>
  <div class="post-item--image">
    <div
      class="post-item--image post-image-swiper-wrapper"
      v-if="this.post.images || this.post.videos">

      <swiper
        @slide-change="pageChangeHandler"
        ref="swiper"
        :options="swiperOptions">
        <swiper-slide
          v-for="(element, index) in finalArray"
          class="video-block"
          :key="index">
          <!--v-for="(element,index) in this.post.images"-->
          <in-post-image-block v-if="element.type === 'image'" :image="element.body" :current-users-nickname="authUser.nickname"/>
          <div v-else-if="element.type === 'video'">
            <video
              :poster="element.body.preview_url"
              :src="element.body.url"
              :style="{'height':widthWindow+'px'}"
              ref="videoBlock"
              muted
              loop
              v-on:click="playVideo(index)"></video>
            <div
              class="post-type--play"
              ref="playButton"
              v-on:click="playVideo(index)">
              <img src="https://media.inrating.top/storage/img/default/Play.png">
            </div>
            <div class="blur-background" v-bind:style="{backgroundImage: 'url('+element.body.preview_url+')'}">

            </div>
            <div
              class="post-type--muted"
              v-on:click="muteVideo(index)">
              <i
                ref="muteButton"
                class="icon-mute"></i>
            </div>
          </div>
        </swiper-slide>
      </swiper>

    </div>

    <div v-if="this.avatar">
      <!--<in-rating-bar :rating='this.user.rating'></in-rating-bar>-->
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { mapGetters } from 'vuex';
  import PostRatingBar from 'ComponentsVue/main/postmenu/PostRatingBar.vue'
  import postMentions from 'ComponentsVue/main/postimage/postMentions.vue'
  import postImageBlock from 'ComponentsVue/main/postimage/PostImageBlock'
  import {
    AUTH_USER,
    moduleName as userModule
  } from 'Store/modules/authUser/user';

  Vue.component('in-post-image-block', postImageBlock);
  Vue.component('in-rating-bar', PostRatingBar);
  Vue.component('in-mention-block', postMentions);
  export default {
    props: ['post', 'avatar', 'user', 'order'],
    data() {
      return {
        widthWindow: localStorage.getItem('clientWidth'),
        attachmentsImage: [],
        attachOrder: [],
        finalArray: [],
        currentIndex: 0,
        prevIndex: null,
        swiperOptions: {
          slidesPerView: 1,
          pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
          },
        },
      }
    },
    created() {
      this.attachOrder = this.order;
      this.handleMedia()
    },
    watch: {
      attachOrder: function () {
        this.handleMedia()
      }
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER,
      }),
    },
    mounted() {
      this.attachOrder = this.order;
    },
    methods: {
      playVideo(index) {
        const needle = this.$refs.videoBlock.findIndex(element => {
          return this.finalArray[index].body.url === element.src
        });
        let video = this.$refs.videoBlock;
        let playButton = this.$refs.playButton;
        if (video[needle].paused) {
          video[needle].play();
          playButton[needle].style.display = 'none';
        }
        else {
          video[needle].pause();
          playButton[needle].style.display = 'block';
        }
      },
      muteVideo(index) {
        const needle = this.$refs.videoBlock.findIndex(element => {
          return this.finalArray[index].body.url === element.src
        });

        let video = this.$refs.videoBlock;
        let muteButton = this.$refs.muteButton;
        if (video[needle].muted) {
          video[needle].muted = false;
          muteButton[needle].classList.add('icon-sound');
          muteButton[needle].classList.remove('icon-mute');
        }
        else {
          video[needle].muted = true;
          muteButton[needle].classList.remove('icon-sound');
          muteButton[needle].classList.add('icon-mute');
        }
      },
      pageChangeHandler() {
        this.prevIndex = this.currentIndex;
        this.currentIndex = this.getSwiperActiveIndex();

        this.$emit('slide', this.currentIndex);

        const video = this.$refs.videoBlock;
        if(video) {
          const playButton = this.$refs.playButton;
          const needle = video.findIndex(element => {
            return this.finalArray[this.prevIndex].body.url === element.src
          });
          if (this.finalArray[this.prevIndex].type === 'video') {
            video[needle].pause();
            playButton[needle].style.display = 'block';
          }
        }
      },
      handleMedia(){
        const finalArray = [];
        this.attachOrder = this.order;

        this.attachOrder && this.attachOrder.forEach( element => {
          switch (element.type) {
            case 'image':
              this.post && this.post.images && this.post.images.forEach( post => {
                if (post.id === element.id) {
                  finalArray.push({
                      type: 'image',
                      body: post,
                    }
                  );
                }
              });
              break;
            case 'video':
              this.post && this.post.videos && this.post.videos.forEach( post => {
                if (post.id === element.id) {
                  finalArray.push({
                      type: 'video',
                      body: post,
                    }
                  );
                }
              });
              break;
          }
        });
        this.finalArray = finalArray;
      },
      getSwiperActiveIndex() {
        return this.$refs.swiper.swiper.activeIndex;
      }
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  .post-image-swiper-wrapper {
    position: relative;
    .swiper-container {
      position: static !important;
    }

    .swiper-pagination {
      position: absolute;
      top: ~"calc(16vw + 5px)" !important;
      left: -2px;
      bottom: unset !important;
      display: flex;
      justify-content: center;
    }

    .swiper-pagination-bullet {
      background-color: black;
      border-radius: 2px!important;
      margin: 0 0.56vw !important;
      width: 2vw;
      height: 2vw;
    }

    /* hide pagination when only one page */
    .swiper-pagination-bullet:last-child {
      &:first-child {
        display: none;
      }
    }

    .swiper-pagination-bullet-active {
      .bgc-grad() !important;
    }
  }

</style>

