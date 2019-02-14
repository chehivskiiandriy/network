<template>
  <div class="group-post-footer">
    <div class="post-footer-item left" @click="openComments()">
      <i class="icon-speech-2"></i>
      <span class="post-commenttext"> {{$lang.variables.comments}} </span>
      <b  v-text="post.comments_count"></b>
    </div>
    <div class="post-footer-item center">
      <i @click="openShare" class="icon-share-ios"></i>
    </div>
    <div class="post-footer-item right" @click="openSettings()">
      <i class="icon-vvv"></i>
    </div>
    <transition name="fade">
      <div class="post-comments"  v-show="active">
        <in-post-comments  :post="post" :user="user"></in-post-comments>
      </div>
    </transition>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex';

  import {
    moduleName as postsModule,
    CHANGE_SELECTED_POST
  } from "Store/modules/posts";

  import Vue from 'vue'
  import postComments from 'ComponentsVue/main/postfooter/PostComments.vue'
  import postShare from 'ComponentsVue/main/postfooter/PostShare.vue'

  Vue.component('in-post-comments',postComments);
  Vue.component('in-post-share',postShare);

  export default {
    name: "groupPostFooter",
    props:['post','user'],
    data(){
      return {
        active:false,
      }
    },
    mounted() {
      if (this.$route.path !== '/rating' && this.$route.path !== '/' && this.$route.path.indexOf('/group/') === -1 ) {
        this.active = true;
      }
    },
    methods: {
      ...mapMutations({
        changeSelectedPost: postsModule + CHANGE_SELECTED_POST
      }),
      openComments() {
        if (this.user.status !== 'guest') {
          this.active=!this.active;
        }
        else {
          this.$notify({
            group: 'guest-template',
            duration: 3000,
            speed: 300,
          });
        }
      },
      openSettings(){
        this.$root.$emit('postAuthor', this.post);
        this.$emit('show-post-settings');
      },
      openShare() {
        this.changeSelectedPost({...this.post});
      }
    }
  }
</script>

<style lang="less">
  .group-post-footer {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    padding-bottom: 6px;


    .post-footer-item {
      width: 33.33%;
      font-size: 12px;
      display: flex;
      align-items: center;
      padding:0 5px;
      box-sizing: border-box;

      &.center {
        justify-content: center;
      }

      &.right {
        justify-content: flex-end;

        i {
          padding-right: 10px;
        }
      }
    }

    .icon-share-ios {
      margin-right: 0;
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

    .post-footer-item span{
      margin: 0 5px;
      background: linear-gradient(to left top, #000fbc, #30c2be 50%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .fade-enter-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to  {
    opacity: 0;
  }
</style>
