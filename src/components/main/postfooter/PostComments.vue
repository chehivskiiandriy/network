<template>
  <div class="post-comments-block">
    <div v-if="isShowMoreButton" class="post-more">
      <router-link
        v-if="isShowMoreButton"
        :to="'/p/' + post.slug">{{$lang.variables.moreInfo}}</router-link>
    </div>
    <div
      v-if="loadMore"
      class="load-more"
      @click="showPreviousComments">Show previous comments</div>
    <in-post-comments-item
      v-for="comment in commentsInfo"
      :postAuthor="post.author"
      :comment="comment"
      @action:delete-comment="deleteComment"></in-post-comments-item>
    <in-post-makecomment
      v-if="!isGuest"
      :postId="post.id"
      @action:add-comment="addComment"></in-post-makecomment>
  </div>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';

  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";
  import { moduleName as postsModule, CHANGE_POST_COMMENT_COUNT } from "Store/modules/posts";
  import Vue from 'vue'
  import PostCommentItem from './comments/PostCommentItem.vue'
  import PostMakeComment from './comments/PostMakeComment.vue'

  Vue.component('in-post-comments-item', PostCommentItem);
  Vue.component('in-post-makecomment', PostMakeComment);

  export default {
    name: "PostComments",
    props: ['post', 'addComments', 'answerNickname'],
    data() {
      return {
        comments: [],
        nextPage: 1,
        lastPage: 1,
        loading: false,
        showComments: false,
        showMore: false,
        isShorted: true
      }
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER
      }),
      isShowMoreButton() {
        return (this.$route.path === '/rating' || this.$route.path === '/') && this.comments.length > 3
      },
      loadMore() {
        return (this.post.comments_count > this.comments.length || (this.isShorted && this.comments.length > 3) || this.nextPage < this.lastPage) && this.$route.path.includes('/p/')
      },
      isGuest() {
        return this.authUser.status === 'guest'
      },
      commentsInfo() {
        if((this.isShowMoreButton || this.isShorted) && this.comments.length > 3) {
          return this.comments.slice(this.comments.length - 3)
        }
        return this.comments
      }
    },
    mounted() {
      this.fetchComments();
    },
    methods: {
      ...mapMutations({
        changePostCommentCount: postsModule + CHANGE_POST_COMMENT_COUNT
      }),
      async fetchComments() {
        if (this.loading || this.lastPage < this.nextPage) {
          return;
        }

        this.loading = true;

        try {
          const data = new FormData();
          data.append('post_id', this.post.id);
          data.append('page', String(Math.floor(this.comments.length / 15) + 1));

          const res = await this.$api.post.comments.getAll(data);

          this.comments = [...res.data.data.reverse(), ...this.comments.slice(this.comments.length % 15)];
          this.lastPage = res.data.meta.last_page;
          this.nextPage = res.data.meta.current_page + 1;
          this.loading = false;
        } catch (e) {
          this.loading = false;
        }
      },
      showPreviousComments() {
        if(this.isShorted) {
          this.isShorted = false;
        } else {
          this.fetchComments();
        }
      },
      async deleteComment(id) {
        const data = new FormData();
        data.append('comment_id', id);
        await this.$api.post.comments.delete(data);

        this.comments = this.comments.filter(item => item.id !== id);
        this.changePostCommentCount({ slug: this.post.slug, value: -1 });
      },
      addComment(comment) {
        this.comments.push(comment);
        this.changePostCommentCount({ slug: this.post.slug, value: 1 });
      }
    }
  }
</script>
<style>
  .post-comments {
    width: 100%;
  }
</style>
