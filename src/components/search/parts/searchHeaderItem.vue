<template>
  <div class="search-header-item">
    <i
      @click="goTo"
      class="search-header-item-icon"
      :class="isActive"></i>
  </div>
</template>
<script>
  export default {
    props: ['link', 'activeIcon', 'notActiveIcon', 'fillType'],
    computed: {
      isActive() {
        return this.activeLink === this.fillType ? this.activeIcon : this.notActiveIcon;
      },
      activeLink() {
        return this.$route.path.split('/')[2]
      }
    },
    methods: {
      goTo() {
        if (this.activeLink === this.fillType) {
          this.$router.go(-1);
        } else if (this.activeLink) {
          this.$router.replace(this.link);
        } else {
          this.$router.push(this.link);
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .search-header-item {
    &-icon {
      font-size: 30px;
      .text-grad();
    }
  }
</style>
