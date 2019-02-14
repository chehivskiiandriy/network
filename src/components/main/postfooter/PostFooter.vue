<template>
  <div
    class="post-footer"
    :class="{'post-footer-open': active}">
    <div
      class="post-footer-item"
      @click="openComments">
      <i class="icon-speech-2"></i>
      <span class="post-commenttext"> {{$lang.variables.comments}} </span>
      <b v-text="post.comments_count"></b>
    </div>
    <div class="post-footer-item">
      <i @click="openShare" class="icon-share-ios"></i>
    </div>
    <div class="post-footer-item">
      <i class="icon-scale"></i>
      <router-link :to="'/statictics/' + post.id"><span> {{$lang.variables.statistics}} </span></router-link>
    </div>
    <transition name="fade">
      <div class="post-comments" v-show="active">
        <in-post-comments :post="post"></in-post-comments>
      </div>
    </transition>
  </div>
</template>
<script>
  import {mapMutations} from 'vuex';
  import Vue from 'vue'
  import postComments from './PostComments.vue'
  import postShare from './PostShare.vue'

  import {
    moduleName as postsModule,
    CHANGE_SELECTED_POST
  } from "Store/modules/posts";

  Vue.component('in-post-comments', postComments);
  Vue.component('in-post-share', postShare);
  export default {
    props: ['post'],
    data() {
      return {
        active: false,
      }
    },
    mounted() {
      if (this.$route.path !== '/rating' && this.$route.path !== '/' && this.$route.path.indexOf('/groups') === -1 && this.$route.path.indexOf('/p/') === -1)
        this.active = true;
    },
    methods: {
      ...mapMutations({
        changeSelectedPost: postsModule + CHANGE_SELECTED_POST
      }),
      openComments() {
        this.active = !this.active;
      },
      openShare() {
        this.changeSelectedPost({...this.post});
      }
    },
  }
</script>
<style lang="less">
  .post-footer {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    padding-bottom: 6px;
    border-bottom: 1px solid #d3d3d3;

    &-open {
      padding-bottom: 0;
    }
  }

  .post-footer-item {
    font-size: 12px;
    display: flex;
    align-items: center;
    padding: 0 5px;
  }

  .post-footer-item i {
    font-size: 23px;
    background: linear-gradient(to left top, #000fbc, #30c2be 50%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .post-commenttext {
    background: linear-gradient(to left top, #000fbc, #30c2be 50%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .icon-share-ios {
    margin-right: 20px;
  }

  .post-footer-item span {
    margin: 0px 5px;
    background: linear-gradient(to left top, #000fbc, #30c2be 50%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .fade-enter-active {
    transition: opacity 1s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>

