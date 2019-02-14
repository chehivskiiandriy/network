<template>
  <div v-if="type === 'icon'" class="bottom-click" @click="goToLink()"><i :class="activeRoute"></i></div>
  <div v-else class="bottom-click" @click="goToLink()"><img :src="activeRoute"/></div>
</template>
<script>
  import {mapActions} from 'vuex';
  import {CHECK_NEW_POSTS, moduleName as mainPostsModule} from "Store/modules/mainPosts";

  import animateScroll from "JsLib/animateScroll";

  export default {
    props:['link','notActiveClass','activeClass', 'type'],
    computed: {
      activeRoute() {
        let route = this.$route.path.split('/');
        let link = this.link.split('/');
        if(link[0] === 'u') {
          if(link[1] === route[2]) {
            return this.activeClass;
          } else {
            return this.notActiveClass;
          }
        }
        else if('/' + this.link === this.$route.path)
          return this.activeClass;
        else if ( (route[1]==='contest' && link[0]==='contests') || (route[1]==='group' && link[0]==='groups'))
          return this.activeClass;
        else
          return this.notActiveClass;
      }
    },
    methods: {
      ...mapActions({
        checkNewPosts: mainPostsModule + CHECK_NEW_POSTS
      }),
      goToLink() {
        if(this.link === 'groups') {
          this.$router.push('/' + this.link);
          this.$root.$emit('hideFooterMenu');
        } else if('/' + this.link === this.$route.path) {
          if(this.link === '') {
            this.checkNewPosts();
          }
          animateScroll();
        }
        else {
          this.$router.push('/'+this.link);
          this.$root.$emit('hideFooterMenu');
        }
      }
    }
  }
</script>
<style lang="less">
  .bottom-click {
    position: relative;
    z-index: 20000;
    padding: 5px 0;
  }
</style>
