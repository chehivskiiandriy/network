<template>
  <div class="post-item--image">
    <div
      v-if="previewPostType === 'image'"
      @click="goToPost"
      class="post-item--image postssmall-image">
      <img
        :src="previewPost.url_medium"
        class="postssmall-image-img">
    </div>
    <div
      v-else-if="previewPostType === 'video'"
      @click="goToPost"
      class="post-small-video-background"
      v-bind:style="{backgroundImage: 'url('+previewPost.preview_url+')', }">
      <div class="post-type--play">
        <img :src="imgArray.Play">
      </div>
    </div>
    <div v-else>
      <img :src="imgArray.Ooops">
    </div>
    <div v-if="type === 'post'" class="post-profile-repost-icon">
      <i class="icon-share-f"></i>
      <router-link :to="'/u/'+postI.author.nickname">
        <span v-text="postI.author.nickname"></span>
      </router-link>
    </div>
    <div class="postsmall-rating">
      <i class="icon-logo postsmall-rating__icon"></i>
      <span class="postsmall-rating__counter">{{user.rating.value}}</span>
    </div>

    <div
      @click="goToUser"
      class="postsmall-image-info">
      <span
        class="info-nickname"
        v-text="$textLength(user.nickname, 16)"></span>
    </div>

    <div
      @click="goToUser"
      class="post-small-avatar">
        <img :src="user.avatar_image.url_small" />
    </div>

  </div>
</template>
<script>
  import Vue from 'vue'
  import {mapActions} from 'vuex';

  import PostRatingBar from 'ComponentsVue/main/postmenu/PostRatingBar.vue'
  import {CHANGE_HOME_POST_COUNT, moduleName as countPostOnPageModule} from "Store/modules/countPostOnPage";

  Vue.component('in-rating-bar', PostRatingBar);
  export default {
    props: ['index', 'post', 'avatar', 'user'],
    data(){
      return {
        widthWindow: localStorage.getItem('clientWidth'),
        imgArray: window.img,
        previewPost: '',
        previewPostType: '',
        type: '',
        postI: ''
      }
    },
    mounted() {

      this.postI = this.post;

      if(this.post.attachments_order[0].type === 'post') {
        this.type = 'post';
        this.postI = this.post.attachments.posts[0];
      }

      if(this.postI.attachments_order[0].type === 'image') {
        for (let i = 0; i < this.postI.attachments.images.length; i++) {
          if(this.postI.attachments_order[0].id === this.postI.attachments.images[i].id) {
            this.previewPost = this.postI.attachments.images[i];
            this.previewPostType = 'image';
            break;
          }
        }
      } else if(this.postI.attachments_order[0].type === 'video') {
        for (let i = 0; i < this.postI.attachments.videos.length; i++) {
          if(this.postI.attachments_order[0].id === this.postI.attachments.videos[i].id) {
            this.previewPost = this.postI.attachments.videos[i];
            this.previewPostType = 'video';
            break;
          }
        }
      }

    },
    methods: {
      ...mapActions({
        changeHomePostCount: countPostOnPageModule + CHANGE_HOME_POST_COUNT
      }),
      goToUser() {
        const data = new FormData();
        data.append('type', 'profile_visit');
        data.append('id', this.post.id);
        this.$api.users.profileVisitFromPost(data);

        this.$router.push('/u/' + this.post.author.nickname);
      },
      goToPost(){
        this.changeHomePostCount('1');
        let i = this.index;
        setTimeout(function(){
          window.location = window.location.pathname + '#' + i;
        }, 1000);
      }
    },
  }
</script>
<style lang="less">
  .post-profile-repost-icon {
    position: absolute;
    top: 10px;
    left: 5px;
    font-size: 12px;
    width: 92%;
    display: flex;
    color: #fff;
    align-items: center;

    a {
      color: #fff;
      padding-left: 5px;
    }
  }

  .post-small-video-background {
    height: 47vw;
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #000;
    border-radius: 10px;
    box-shadow: 1px 1px 7px rgba(0, 0, 0, 0.5);
  }

  .postsmall-rating {
    position: absolute;
    right: 0;
    top: 0;
    left: 0;
    height: 17%;
    padding: 0 1vw 2% 1vw;
    color: #fff;
    background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6), transparent);
    border-radius: 5px 5px 0 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  .postsmall-rating__icon {
    display: inline-block;
    margin-right: 1vw;
    font-size: 5vw;
  }

  .postsmall-rating__counter {
    display: inline-block;
    font-size: 4.1vw;
    margin-top: 0.1em;
  }
</style>

