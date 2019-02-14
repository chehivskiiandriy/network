<template>
  <div id="intagSolo">
    <div class="intag-solo-header">
      <i @click="goBack()" class="icon-left-f"></i>
      <p>^^{{intag}}</p>
      <div></div>
    </div>
    <div :class="postCount" v-for="post in allposts">
      <div v-if="post.attachments!=null" >
        <in-profile-postsolo :post='post'></in-profile-postsolo>
      </div>
      <div v-else>
        <img src="https://media.inrating.top/images/photo_placeholder.jpg">
      </div>
    </div>
    <in-spinner :loading="loading" />
  </div>
</template>
<script>
  import {scrollOnBottom} from "../mixins/scrollOnBottom";

  export default  {
    mixins: [scrollOnBottom],
    data() {
      return {
        intag: this.$route.params.intag,
        allposts: [],
        postOutCountProfile: 1,
        loading: false,
        nextPage: 1,
        lastPage: 1,
      }
    },
    created(){
      window.addEventListener('scroll', this.addViewedPosts);
    },
    mounted() {
      this.addPost();
    },
    watch: {
      bottom(bottom) {
        if (bottom && this.lastPage >= this.nextPage && !this.loading) {
          this.addPost()
        }
      }
    },
    computed: {
      postCount: function(){
        if(this.postOutCountProfile === 1)
          return 'prof-post profile-post';
        else
          return 'prof-post profile-post-big';
      },
    },
    methods: {
      changeView() {
        if (this.postOutCountProfile === 1) {
          this.postOutCountProfile = 2;
        }
        else {
          this.postOutCountProfile = 1;
        }
      },
      goBack() {
        history.go(-1);
      },
      async addPost() {

        const data = new FormData();
        data.append('intag',this.intag);
        data.append('page',this.nextPage);
        data.append('limit',32);

        try {
          this.loading = true;

          const res = await this.$api.search.getPosts(data);

          const result = res.data;
          this.lastPage = result.meta.last_page;
          this.allposts = this.allposts.concat(result.data);
          this.nextPage = result.meta.current_page + 1;
        }
        catch (e) {
          console.error(e);
        }
        finally {
          this.bottom = false;
          this.loading = false;
        }

      }
    }
  }
</script>
<style lang="less">
  @import "~LessStyle/variables.less";

  #SpinnerOnloadImg{
    display: block;
    width: 35%;
    margin: auto;
  }

  #intagSolo {
    margin-top: -43px;
    text-align: left;
    .profile-post{
      margin: 0 0 -2.5px 2px;
    }
    .profile-post-big {
      margin: 0 0 -2px 2px;
    }
  }

  .intag-solo-header {
    display: flex;
    align-items: center;
    background: @grad;
    justify-content: space-between;
    padding: 0px 10px;
    box-sizing: border-box;
    color: @white;
    margin-bottom: 10px;

    .icon-left-f {
      font-size: 20px;
    }

    .icon-feed-view-1 {
      font-size: 20px;
    }

    .icon-feed-view-4 {
      font-size: 20px;
    }
  }

  .intag-solo-header p{
    margin: 0px;
    padding: 10px;
  }
</style>
