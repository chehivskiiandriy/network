<template>
    <div class="story-block" ref="story">

      <in-story-header></in-story-header>

      <template v-if="getUserActiveStory">
        <div class="story-blur" :style="storyBlurStyle"></div>
        <div class="story-main">
          <transition name="slide" mode="out-in">
            <div>
              <div v-if="isImage">
                <img @click="stopAnimation('img')" :key="getUserActiveStory.id" class="story-image"
                     :src="getUserActiveStory.attachments.images[0].url">
              </div>
              <div v-else>
                <video @click="stopAnimation('video')" :key="getUserActiveStory.id" ref="videoBlock"
                       :src="getUserActiveStory.attachments.videos[0].url"></video>
                <div v-show="playAnimation" @click="stopAnimation('video')" class="post-type--play" ref="playButton">
                  <img src="https://media.inrating.top/storage/img/default/Play.png">
                </div>
              </div>
              <div class="story-footer">
                <p class="paused-info"><span v-if="clearTimer" class="inStoryModal-body-pausedInfo"><img
                  src="https://media.inrating.top/storage/img/default/Pause.png" alt="pause"></span></p>

                <p class="story-title-text"><in-text-with-mentions :text="getUserActiveStory.title"/></p>
                <i @click="checkChats(getUserActiveStory.author.id)" class="icon-letter"></i>
                <i @click="showGifts"  class="icon-gift"></i>
                <in-storyfooter-item
                  className="icon-heart"
                  classNameActive="icon-heart-f"
                  :actionId="getUserActiveStory.id"
                  :statusFieldName="getUserActiveStory.is_liked"
                  :user="user"
                  fillType="like">
                </in-storyfooter-item>
                <in-storyfooter-item
                  className="icon-bookmark"
                  classNameActive="icon-bookmark-f"
                  :actionId="getUserActiveStory.id"
                  :statusFieldName="getUserActiveStory.is_bookmarked"
                  :user="user"
                  fillType="bookmark">
                </in-storyfooter-item>
                <i @click="showStoryMenu"  class="icon-vvv"></i>
              </div>
            </div>
          </transition>
        </div>
        <div @click="goToPrevStory()" class="go-prev-story"></div>
        <div @click="goToNextStory()" class="go-next-story"></div>
        <div class="story-black">
        </div>
      </template>
    </div>
</template>
<script>
  import axios from 'axios';
  import Vue from 'vue'
  import storyHeader from 'ComponentsVue/story/storyHeader'
  import storyFooter from 'ComponentsVue/story/storyFooter'
  import storyMenu from 'ComponentsVue/story/storyMenu'

  Vue.component('in-story-header', storyHeader);
  Vue.component('in-storyfooter-item', storyFooter);
  Vue.component('in-story-menu',storyMenu);
  export default {
    data() {
      return {
        storiesId: '',
        stories: '',
        imgWidth: '',
        storyCount: 0,
        viewArray: [],
        clientWidth: localStorage.getItem('clientWidth'),
        nextStory: '',
        authorStory: [],
        myTimerIndex: '',
        clearTimer: false,
        percentDelay: [],
        fullTime: true,
        isStopVideo: false,
        videoStopDuration: '',
        storyNickname: this.$route.params.story_nickname,
        user: {},
        playAnimation:true,
      }
    },
    watch: {
      '$route'(to, from) {
        if (to.path !== from.path) {
          window.storeUserStories.dispatch('LOAD_USER_STORIES', {nickname: this.$route.params.story_nickname});
          this.storyNickname = this.$route.params.story_nickname,
            this.storyCount = 0;
        }
      }
    },
    computed: {
      isImage() {
        return this.getUserActiveStory.attachments.images !== null;
      },
      storyBlurStyle() {
        const imageUrl = this.isImage
          ? this.getUserActiveStory.attachments.images[0].url
          : this.getUserActiveStory.attachments.videos[0].preview_url;
        return {
          backgroundImage: `url(${imageUrl})`
        };
      },
      getUserStories() {
        const userStories = window.storeUserStories.getters.getUserStories;
        // TODO
        // if(userStories && userStories.length > 0) {
        //   const targetStoryIndex = this.$route.query && this.$route.query.storyId &&
        //     userStories.findIndex(story => story.id.toString() === this.$route.query.storyId.toString());
        //   if(targetStoryIndex && targetStoryIndex !== -1) {
        //     return userStories.slice(targetStoryIndex);
        //   }
        // }
        return userStories;
      },
      getUserActiveStory() {
        if (this.getUserStories) {
          return this.getUserStories[this.storyCount];
        }
      },
      getAllStories() {
        return window.storeAllStories.getters.getAllStories;
      }
    },
    mounted() {
      this.user = JSON.parse(localStorage.getItem('user'));


      this.$root.$on('changeStoryPicture', () => {
        this.playAnimation=true;
        this.storyCount++;
      });

      this.$root.$on('changeStoryPicturePrev', () => {
        this.playAnimation=true;
        this.storyCount--;

      });

      this.$root.$on('endVideoDuration', () => {
        this.clearTimer = !this.clearTimer;
      });

      this.$root.$on('endVideoContinue', () => {
        this.isStopVideo = false;
      });

      this.$root.$on('continueStory',()=>{
        if (this.isImage)
          this.stopAnimation('img');
        else
          this.stopAnimation('video');
      });

      this.$root.$on('continueStoryClick',()=>{
        if (this.isImage)
          this.stopAnimation('img');
        else
          this.stopAnimation('video');
      });

    },
    methods: {
      showStoryMenu() {
        if (!this.clearTimer) {
          if (this.isImage)
            this.stopAnimation('img');
          else
            this.stopAnimation('video');
        }
        this.$root.$emit('openMenuStory',this.getUserActiveStory.id);
        this.$modal.show('storyMenu');

      },
      newStories() {
        this.authorStory = [];
        this.imgWidth = localStorage.getItem('clientWidth');
        this.storiesId = this.$route.params.story_nickname;
      },
      showGifts() {
        if (this.user.status !== 'guest') {
          if (!this.clearTimer) {
            if (this.isImage)
              this.stopAnimation('img');
            else
              this.stopAnimation('video');
          }
          this.$root.$emit('postModalPresent', this.getUserActiveStory.author.id);
          this.$modal.show('presentsModal')
        }
        else {
          this.$notify({
            group: 'guest-template',
            duration: 3000,
            speed: 300,
          });
        }
      },
      stopAnimation(type) {
        this.clearTimer = !this.clearTimer;

        if (this.clearTimer) {
          if (type === 'video') {
            let video = this.$refs.videoBlock;

            video.play();
            if (!this.isStopVideo) {
              this.$root.$emit('newRateBarVideo', video.duration);
            }
            else {
              this.$root.$emit('continueRateBarVideo');
            }
            this.playAnimation=false;
          }
          else {
            this.$root.$emit('stopAnimationBar');
          }
        }
        else {
          if (type === 'video') {
            let video = this.$refs.videoBlock;
            video.pause();
            this.$root.$emit('newRateBarVideoStop');
            this.isStopVideo = true;
            this.playAnimation=true;
          }
          else {
            this.$root.$emit('continueAnimationBar');
          }
        }
      },
      goToNextStory() {
        // console.log('iamhere');
        // console.error('nextStory ',nextStory);
        // console.error('this.getAllStories ',this.getAllStories);

        this.playAnimation = true;
        this.clearTimer = false;
        let allStories;
        if (this.storyCount !== this.getUserStories.length - 1) {
          this.$root.$emit('goToNextStory');
        }
        else if(allStories = this.getAllStories) {

          let nicknameArray = [];
          allStories.map((item) => {
            nicknameArray.push(item.author.nickname);
          });
          let nextStory = nicknameArray.indexOf(this.storyNickname);

          if (nextStory < this.getAllStories.length - 1) {
            this.$router.push('/story/' + nicknameArray[nextStory + 1]);
          }
          else {
            this.$router.push('/');
          }
        }
      },
      goToPrevStory() {
        this.playAnimation=true;
        this.clearTimer=false;
        if (this.storyCount > 0) {

          this.$root.$emit('goToPrevStory');
        }
        else {
          let nicknameArray = [];
          this.getAllStories.map((item) => {
            nicknameArray.push(item.author.nickname);
          });
          let nextStory = nicknameArray.indexOf(this.storyNickname);
          if (nextStory > 0)
            this.$router.push('/story/' + nicknameArray[nextStory - 1]);

        }
      },
      checkChats(id) {
        if (this.user.status!=='guest') {
          if (this.user.id!==this.getUserActiveStory.author.id) {
            axios.get('v1/me/chats/check?id=' + id)
              .then(res => {
                if (res.data.state) {
                  this.$router.push('/messages/' + res.data.id);
                } else {
                  this.$router.push('/new-chat/' + id);
                }
              })
          }
          else {
            this.$notify({
              group:'write-to-you',
              duration:3000,
              speed:300,
            });
          }
        }
        else {
          this.$notify({
            group:'guest-template',
            duration:3000,
            speed:300,
          });
        }
      }
    }
  }
</script>
<style lang="less">
  @import '~LessStyle/story.less';

  .post-type--play {
    position: absolute;
    width: 30%;
    left: 39%;
    top: 41%;
    img {
      width: 100%;
    }
  }

  .story-footer {
    i {
      .text-grad();
    }
  }

  .story-title-text {
    width: 100%;
    font-size: 24px;
    margin: 5px;

  }

  .inStoryModal-body-pausedInfo {
    text-align: center;
    width: 5%;
    display: block;
    margin: auto;
    padding: 5px 6px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 3px;
  }

  .inStoryModal-body-pausedInfo > img {
    display: block;
    width: 100%;
  }

  .paused-info {
    margin: 5px;
    text-align: center;
  }

</style>
