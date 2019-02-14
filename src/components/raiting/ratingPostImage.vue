<template>
  <div>
    <carousel
      ref="ratingPostImage"
      :perPage=1
      :paginationEnabled="true"
      paginationColor="rgba(211, 211, 211, 0.50);"
      :paginationPadding="2"
      :paginationSize="8">
      <slide class="imagerating-block" v-bind:style="{maxWidth: clientWidth+'px', maxHeight:clientWidth+'px'}">
        <router-link :to="'/p/'+post.slug">

          <img v-bind:style="{maxWidth: clientWidth+'px', maxHeight:clientWidth+'px'}" :src="avatarImage.url_large"/>
          <span
            v-if="this.ratingPostImage==null"
            class="index-rating-image"><i class="icon-logo-f"></i><span class="index-rating-position">TOP</span></span>
          <in-rating-bar :rating='this.post.rating'/>
        </router-link>
      </slide>
      <slide
        class="imagerating-block" v-bind:style="{maxWidth: clientWidth+'px', maxHeight:clientWidth+'px'}"
        v-for="(image,i) in this.ratingPostImage"
        :key="i">

        <router-link :to="'/p/'+image.slug">

        <span
          v-if="(postCount-i)!=1"
          class="index-rating-image"><i class="icon-logo-f"></i><span
          class="index-rating-position">{{postCount-i}}</span></span>
          <span
            v-else
            class="index-rating-image"><i class="icon-logo-f"></i><span class="index-rating-position">TOP</span></span>
          <img v-bind:style="{maxWidth: clientWidth+'px', maxHeight:clientWidth+'px'}" v-if="image.body_type==='image'"
               :src="image.body.url_large"/>
          <div v-else>
            <img v-bind:style="{maxWidth:clientWidth+'px', maxHeight:clientWidth+'px'}" :src="image.body.preview_url"/>
            <div class="rating-video-blur" v-bind:style="{backgroundImage:'url('+image.body.preview_url+')'}">

            </div>
            <div class="post-type--play"><img src="https://media.inrating.top/storage/img/default/Play.png"></div>
          </div>
        </router-link>
        <div>
          <!--<div   class="rating-icon-index"><i class="icon-logo-f"></i><span>{{this.length}}</span></div>-->
        </div>
      </slide>

    </carousel>
  </div>
</template>
<script>

  export default {
    props: ['post', 'avatarImage', 'ratingPostImage', 'postCount'],
    data() {
      return {
        postRatingIndex: [],
        clientWidth: localStorage.getItem('clientWidth'),
      }
    }
  }
</script>
<style lang="less">
  @import '~LessStyle/ratingimage.less';

  .rating-video-blur {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0px;
    z-index: -1;
    filter: blur(0.17em);
    overflow: hidden;
    background-size: cover;
    background-position: center;
  }

  .post-type--play img {
    position: absolute;
    width: 100%;
    left: 20%;
    top: 35%;
  }
</style>
