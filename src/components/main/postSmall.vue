<template>
  <div class="postsmall-item">
      <in-postsmall-image
        :index="post.id"
        :user="post.author"
        :post="post"/>
  </div>
</template>

<script>
  import Vue from 'vue'
  import PostSmallImage from './postimage/postSmallImage.vue'

  Vue.component('in-postsmall-image', PostSmallImage);
  export default {
    props: ['post', 'index'],
  }
</script>

<style lang="less">
  @import '~LessStyle/post.less';
</style>
