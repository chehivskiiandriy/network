<template>
  <div
    v-if="banners && banners.length > 0"
    class="banner">
    <router-link
      v-if="!disabled"
      class="banner-link"
      :to="link">
      <img
        class="banner-img"
        :src="banners[0].mobile.media">
    </router-link>
    <img
      v-else
      class="banner-img"
      :src="banners[0].mobile.media">
  </div>
</template>

<script>
  export default {
    name: "Banner",
    props: {
      banners: Array,
      disabled: Boolean,
    },
    computed: {
      link() {
        const link = this.banners[0].mobile.link,
          officialLink = 'https://m.inrating.top',
          testLink = 'http://m.innet.club';

        if(link.indexOf('https://m.inrating.top') !== -1) {
          return link.slice(officialLink.length)
        }
        if(link.indexOf('http://m.innet.club') !== -1) {
          return link.slice(testLink.length)
        }

        return ''
      }
    },
    methods: {
      goTo() {
        this.$router.push(this.link);
      }
    }
  }
</script>

<style lang="less" scoped>
  .banner {
    padding: 1.5vw;

    &-img {
      width: 97vw;
      object-fit: contain;
      vertical-align: middle;
    }
  }
</style>
