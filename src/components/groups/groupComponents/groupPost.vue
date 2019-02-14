<template>
  <div>
    <in-group-header ></in-group-header>
    <div id="groupPosts">
      <div
        class="group-post"
        v-for="post in posts"
        :key="post.id"
        :data-id="post.id">
        <in-group-post @show-post-settings="showPostSettingsModal = true" :post='post'></in-group-post>
      </div>
      <in-post-settings :show.sync="showPostSettingsModal" :user="authUser" ></in-post-settings>
    </div>
    <in-spinner :loading="loading" />
    <in-post-share-modal
      v-if="selectedPost"
      :selectedPost="selectedPost" />
  </div>
</template>

<script>
  import axios from 'axios';
  import Vue from 'vue'
  import {mapActions, mapGetters} from 'vuex'

  import {
    moduleName as postsModule,
    SELECTED_POST
  } from "Store/modules/posts";

  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";
  import {
    FETCH_GROUP_POSTS,
    FETCH_GROUP_POSTS_NEXT_PAGE,
    GROUP_POSTS,
    LOADING,
    moduleName as groupPostsModule
  } from "Store/modules/groups/groupPosts";
  import {scrollOnBottom} from "../../../mixins/scrollOnBottom";

  import Post from 'ComponentsVue/main/Post.vue'
  import groupOnePost from 'ComponentsVue/groups/groupComponents/groupOnePost.vue'
  import groupHeader from 'ComponentsVue/groups/groupComponents/groupHeader.vue'
  import postSettings from 'ComponentsVue/main/postsettings/postSettings.vue'

  Vue.component('in-post', Post);
  Vue.component('in-group-post', groupOnePost);
  Vue.component('in-group-header', groupHeader);
  Vue.component('in-post-settings',postSettings);

  export default {
    mixins: [scrollOnBottom],
    data(){
      return {
        groupSlug: this.$route.params.group_slug,
        maxPageYOffset: 0,
        viewedPosts: [],
        showPostSettingsModal: false,
      }
    },
    watch: {
      bottom(bottom) {
        if (bottom) {
          this.fetchGroupPostsNextPage(this.groupSlug)
        }
      }
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER,
        groupPosts: groupPostsModule + GROUP_POSTS,
        loading: groupPostsModule + LOADING,
        selectedPost: postsModule + SELECTED_POST
      }),
      posts() {
        return this.groupPosts(this.groupSlug)
      }
    },
    mounted(){
      this.fetchGroupPosts(this.groupSlug);
    },
    created(){
      window.addEventListener('scroll', this.addViewedPosts);
    },
    destroyed () {
      window.removeEventListener('scroll', this.addViewedPosts);
    },
    beforeRouteLeave (to, from , next) {
      this.addViewedPosts();
      this.sendViewedPosts();
      next();
    },
    methods: {
      ...mapActions({
        fetchGroupPosts: groupPostsModule + FETCH_GROUP_POSTS,
        fetchGroupPostsNextPage: groupPostsModule + FETCH_GROUP_POSTS_NEXT_PAGE
      }),
      sendViewedPosts() {
        if(this.viewedPosts.length !== 0) {
          let params = {
            ids: JSON.stringify(this.viewedPosts),
          };
          axios.post('v1/users/posts/view', params)
            .then(
              res => {
                this.viewedPosts = [];
              }
            );
        }
      },
      addViewedPosts() {
        if(this.maxPageYOffset <= window.pageYOffset) {
          this.maxPageYOffset = window.pageYOffset;
          let posts = document.querySelectorAll('div[data-id].group-post');

          for(let i = 0; i < posts.length; i++) {
            if(window.pageYOffset + document.documentElement.clientHeight > posts[i].offsetTop) {
              if(posts[i].hasAttribute('data-id')) {
                this.viewedPosts.push(posts[i].getAttribute('data-id'));
                posts[i].removeAttribute('data-id');
              }
            }
          }
        }
      },
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/post.less';
</style>
