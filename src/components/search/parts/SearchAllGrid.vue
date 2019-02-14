<docs>
  #
</docs>

<template>
  <div>
    <template v-for="(post, index) in getPost">
      <div class="wrapper">
        <div
          class="bo"
          v-for="img in post.posts">
          <template v-if="img.attachments_order[0].type === 'image'">
            <aside>
              <router-link :to="'/p/'+img.slug">
                <img
                  :src="img.attachments.images[0].url_medium"
                  alt="">
              </router-link>
            </aside>
          </template>
          <template v-else-if="img.attachments_order[0].type === 'post'">
            <template v-if="img.attachments.posts !== null">
              <aside v-if="img.attachments.posts[0].attachments_order[0].type === 'video'">
                <router-link :to="'/p/'+img.slug">
                  <img
                    :src="img.attachments.posts[0].attachments.videos[0].preview_url"
                    alt="">
                </router-link>
              </aside>
              <aside v-else-if="img.attachments.posts[0].attachments_order[0].type === 'image'">
                <router-link :to="'/p/'+img.slug">
                  <img
                    :src="img.attachments.posts[0].attachments.images[0].url_medium"
                    alt="">
                </router-link>
              </aside>
            </template>
            <template v-else-if="img.attachments.videos === null || img.attachments.images === null">
              <aside>
                <img :src="imgArray.Ooops">
              </aside>
            </template>
          </template>

          <template v-else-if="img.attachments_order[0].type === 'video'">
            <aside>
              <router-link :to="'/p/'+img.slug">
                <img
                  :src="img.attachments.videos[0].preview_url"
                  alt="">
              </router-link>
            </aside>
          </template>
          <template v-else>
            <template v-if="img.attachments.posts[0].attachments_order[0].type === 'image'">
              <aside>
                <router-link :to="'/p/'+img.slug">
                  <img
                    :src="img.attachments.posts[0].attachments.images[0].url_medium"
                    alt="">
                </router-link>
                <i
                  class="icon-multu-posts"
                  title="MultiPost"></i>
              </aside>
            </template>
          </template>
        </div>
        <div
          class="bo"
          :class="videoClass(index)">
          <!--добавить bgc blur-->
          <div class="video-block-box">
            <router-link :to="'/p/' + post.video.slug">
              <div
                class="video-bg"
                :style="{backgroundImage: `url('${post.video.attachments.videos[0].preview_url}')`}"></div>
              <i class="icon-videocamera"></i>
            </router-link>
          </div>
          <!--тут надо еще добавить иконки воспроизведения видео-->
        </div>
      </div>
    </template>

  </div>
</template>

<script>
  import Vue from 'vue';
  import Video from 'ComponentsVue/other/Video';

  Vue.component('in-video', Video);

  export default {
    name: 'search-all-grid',
    props: ['getPost'],
    data() {
      return {
        imgArray: window.img
      }
    },
    mounted() {
    },
    methods: {
      videoClass(index) {
        let i = index % 4;
        if (i === 0) return 'box5';
        if (i === 1 || i === 3) return 'box13';
        if (i === 2) return 'box23';
      }
    }
  }
</script>

<style lang="less">
  .wrapper {
    width: calc(~'100vw - 10px');
    height: calc(~'75vw - 7.5px');;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: calc(~'25vw - 2.5px');

    position: relative;
    aside{
      position: relative;
      border: 1px solid #f4f4f4;
      width: calc(~'25vw - 4.5px');
      height: calc(~'25vw - 4.5px');
      img{
        width: calc(~'25vw - 4.5px');
        height: calc(~'25vw - 4.5px');
        position: relative;
        border-radius: 5px;
      }
      i{
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 28px;
        color: #fff;
        //.setShadowText();
      }
    }
  }

  .box5 {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 2;
    grid-row-end: 4;
  }

  .box13 {
    grid-column-start: 2;
    grid-column-end: 4;
    grid-row-start: 2;
    grid-row-end: 4;
  }

  .box23 {
    grid-column-start: 3;
    grid-column-end: 5;
    grid-row-start: 2;
    grid-row-end: 4;
  }

  .video-block-box {
    width: calc(~'100% - 2px');
    height: calc(~'100% - 2px');
    border: 1px solid #f4f4f4;
    position: relative;

    .video-bg {
      height: 100%;
      width: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      border-radius: 5px;
    }

    video, img{
      width: 100%;
      height: 100%;
      position: relative;
      background-color: #000;
      border-radius: 5px;
      cursor: pointer;
    }
    i.icon-videocamera{
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 28px;
      color: #fff;
      //.setShadowText();
    }
  }
</style>
