<template>
  <div class="profile-post-solo">
    <template v-if="post.type!==4">
      <router-link :to="'/p/'+post.slug">
        <div v-if="previewPostType === 'image'">
          <img :src="previewPost.url_medium" >
        </div>
        <div v-else-if="previewPostType === 'video'" class="profile-video-background" :style="{backgroundImage: 'url('+previewPost.preview_url+')', }">
          <div class="post-type--play">
            <img :src="imgArray.Play">
          </div>
        </div>
        <div v-else>
          <img :src="imgArray.Ooops">
        </div>
        <div v-if="type === 'post'" class="post-profilerepost-icon">
          <i class="icon-share-f"></i>
          <router-link :to="'/u/'+postI.author.nickname">
            <span v-text="postI.author.nickname"></span>
          </router-link>
        </div>
      </router-link>
    </template>
    <template v-else>
      <div v-if="previewPostType === 'image'" class="profile-video-background" :style="{backgroundImage:'url('+previewPost.url_medium+')'}"></div>
      <div v-else-if="previewPostType === 'video'" class="profile-video-background" :style="{backgroundImage: 'url('+previewPost.preview_url+')', }">
        <div class="post-type--play">
          <img :src="imgArray.Play">
        </div>
      </div>
    </template>
    <div class="profile-post-icon-multi" v-if="isMultiPost">
      <i class="icon-multu-posts"></i>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['post'],
    data(){
      return {
        widthWindow: '',
        postHeight: '',
        imgArray: window.img,
        previewPost: '',
        previewPostType: '',
        type: '',
        postI: '',
        isMultiPost: false,
      }
    },
    mounted(){
      this.postI = this.post;

      if(this.post.attachments_order[0].type === 'post') {
        this.type = 'post';
        this.postI = this.post.attachments.posts[0];
      }

      /* MULTIPOST */
      let count = 0;
      for (let param in this.postI.attachments) {
        if ( (param === 'images' || param === 'videos') && this.postI.attachments[param] !== null ){
          count += this.postI.attachments[param].length;
        }
      }
      if (count > 1) {
        this.isMultiPost = true;
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

      this.widthWindow = localStorage.getItem('clientWidth');
    }
  }

</script>
<style lang="less">
  @import '~LessStyle/post.less';

  .profile-post{
    width: calc(~'25vw - 2.5px');
    height: calc(~'25vw - 2.5px');
    display: inline-block;
    position: relative;
    margin: 0 0 2px 2px;

    .profile-video-background {
      height: calc(~'25vw - 2.5px');
    }
  }


  .profile-post-big{
    width: calc(~'50vw - 3px');
    height: calc(~'50vw - 3px');
    display: inline-block;
    position: relative;
    margin: 0 0 2px 2px;

    .profile-video-background {
      height: calc(~'50vw - 3px');
    }
  }

  .profile-post-verybig {
    width: calc(~'100vw - 3px');
    height: calc(~'100vw - 3px');
    display: inline-block;
    position: relative;
    margin: 0 0 2px 2px;

    .profile-video-background {
      height: calc(~'100vw - 3px');
    }
  }


  .profile-post img,
  .profile-post-big img,
  .profile-post-verybig img{
    width: 100%;
    height: auto;
    display: block;
    border-radius: 5px;
  }

  .profile-post {
    position: relative;
  }

  .profile-post-icon-multi {
    position: absolute;
    top: 1vw;
    right: 0.5vw;
    font-size: 5vw;
    color: @white;
  }

</style>
