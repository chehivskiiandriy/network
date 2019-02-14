<template>
  <div class="postsmall-item">
    <div style="position: relative">
      <div
        class="post-item--image postssmall-image"
        @click="goToPost">
        <img :src="post.avatar_image.url_medium"/>
      </div>
      <div
        @click="goToUser"
        class="post-small-info">
          <span v-text="post.nickname"></span>
      </div>
      <div>
        <in-rating-bar :rating='post.rating'/>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';

  import {CHANGE_RATING_POST_COUNT, moduleName as countPostOnPageModule} from "Store/modules/countPostOnPage";

  export default {
    props: ['post', 'index'],
    methods: {
      ...mapActions({
        changeRatingPostCount: countPostOnPageModule + CHANGE_RATING_POST_COUNT
      }),
      goToUser() {
        const data = new FormData();
        data.append('type', 'profile_visit');
        data.append('id', this.post.avatar_post_id);
        this.$api.users.profileVisitFromPost(data);
        console.log(this.post);
        this.$router.push('/u/' + this.post.nickname);
      },
      goToPost(){
        this.changeRatingPostCount('1');
        let i = this.index;
        setTimeout(function(){
          window.location = window.location.pathname + '#' + i;
        }, 1000);
      }
    },
  }
</script>

<style lang="less">
  @import '~LessStyle/post.less';
</style>
