<template>
  <div class="rating-post">
    <div class="post-item--header">
      <div class="ratingheader-logo">
        <i class="icon-logo"></i>
        <span class="ratingheader-logo-number">{{this.post.rating_position}}</span>
        <p class="ratingheader-logo-type">{{type}}</p>
      </div>
      <div class="header-user_avatar">
        <div @click="goToUser">
          <in-user-avatar-solo :user="this.post"/>
        </div>
        <!--<router-link :to="'/u/'+this.post.nickname">-->
        <!--</router-link>-->
        <router-link :to="'/u/'+this.post.nickname">
          <in-nickname
            class="header-user--nickname"
            :status="post.status">{{post.nickname}}</in-nickname>
        </router-link>
      </div>
      <div
        @click="openSettings()"
        class="header-settings">
        <i class="icon-vvv"></i>
      </div>
    </div>
    <div class="post-normal">
      <in-postrating-image
        v-if="post.posts!=null"
        ref="inPostRating"
        :post="post"
        :avatarImage="post.avatar_image"
        :ratingPostImage="post.posts"
        :postCount="post.posts.length"/>
      <in-postrating-image
        v-else
        ref="inPostRating"
        :post="post"
        :avatarImage="post.avatar_image"
        :ratingPostImage="post.posts"/>
    </div>
    <in-postrating-menu :post="post"/>
  </div>
</template>
<script>
  import Vue from 'vue'
  import ratingPostImage from 'ComponentsVue/raiting/ratingPostImage'
  import ratingPostMenu from 'ComponentsVue/raiting/ratingPostMenu'
  import UserAvatar from 'ComponentsVue/UserAvatar'

  Vue.component('in-user-avatar-solo', UserAvatar);
  Vue.component('in-postrating-image', ratingPostImage);
  Vue.component('in-postrating-menu', ratingPostMenu);
  export default {
    props: ['type', 'post'],
    data(){
      return {
        postRatingIndex: [],
      }
    },
    mounted(){
      if(this.post.posts != null){
        for(let i = 0; i < this.post.posts.length; i++){
          this.postRatingIndex.push(this.post.posts.length - i);
        }
      }
    },
    methods:{
      openSettings() {
        this.$root.$emit('postAvatarShare',this.post, this.post.slug, this.post.avatar_post_id, '', this.post.site_link);
        this.$modal.show('postSettingsRating');
      },
      goToUser() {
        let index = this.$refs.inPostRating.$refs.ratingPostImage.currentPage;
        console.log(this.post, index);

        let id;
        if(index === 0 || index === -0) {
          id = this.post.avatar_post_id;
        } else {
          id = this.post.posts[index - 1].id;
        }

        const data = new FormData();
        data.append('type', 'profile_visit');
        data.append('id', id);

        this.$api.users.profileVisitFromPost(data);
        this.$router.push('/u/' + this.post.nickname);
      }
    }
  }
</script>
<style lang="less">
  @import '~LessStyle/post.less';
</style>
