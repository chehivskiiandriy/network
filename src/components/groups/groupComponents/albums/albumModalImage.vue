<template>
  <modal
    name="albumModalImg"
    width="100%"
    classes=" v--modal album-slider"
    @opened="opened"
    @closed="openSlider = false"
    height="auto">
    <swiper
      v-show="openSlider"
      ref="albumSlider">
      <swiper-slide v-for="(albumPost, index) in albumImageArray" :key="albumPost.id">
        <img class="albun-modal--img" :src="albumPost.attachments.images[0].url_medium">
        <div class="album-modal--settings">
          <div
            class="album-settings--item like-block"
            @click="addLike(albumPost, index)">
            <i :class="[albumPost.is_liked ? 'icon-heart-f' : 'icon-heart']"></i>
          </div>
          <div class="album-settings--item"
            @click="goToPost(albumPost.slug)">
            <i class="icon-speech-2"></i>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </modal>
</template>
<script>
  import axios from 'axios';

  import {swiper, swiperSlide} from 'vue-awesome-swiper'

  export default {
    props: {
      albumImageArray: Array,
      openImage: Number
    },
    components: {
      swiper,
      swiperSlide
    },
    data() {
      return {
        isLiked: '',
        openSlider: false
      }
    },
    computed: {
      likeAlbumImage() {
        if (this.isLiked)
          return 'icon-heart-f'
        else
          return 'icon-heart'
      },
    },
    methods: {
      goToPost(slug) {
        this.$router.push('/p/' + slug);
      },
      opened() {
        this.openSlider = true;
        this.$refs.albumSlider.swiper.slideTo(this.openImage);
      },
      addLike(post, index) {
        if (!post.is_liked) {
          axios.post('v1/users/posts/like?id=' + post.id)
            .then(
              res => {
                // this.isLiked = res.data.state;
                this.albumImageArray[index].is_liked = true;
              }
            )
        }
        else {
          axios.post('v1/users/posts/like?id=' + post.id + '&delete=true')
            .then(
              res => {
                // this.isLiked = res.data.state;
                this.albumImageArray[index].is_liked = false;
              }
            )
        }

      }
    }

  }
</script>
<style lang="less">
  .album-slider {
    border-radius: 16px;
    background-color: transparent;
  }

  .albun-modal--img {
    width: 100%;
    height: auto;
    display: block;
  }

  .album-modal--settings {

    background-color: #525252;
    width: 100%;
    display: flex;
  }

  .album-settings--item {
    color: #ffffff;
    padding: 5px 0px;
    width: 50%;
    text-align: center;

    i {
      font-size: 26px;
    }
  }

  .like-block {
    border-right: 1px solid #ffffff;
  }
</style>
