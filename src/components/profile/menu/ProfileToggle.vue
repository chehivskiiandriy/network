<template>
  <span
    @click="goToProfileLink()"
    class="profile-menu--icon">
    <i :class="activeProfileType"></i>
  </span>
</template>

<script>
  export default {
    name: 'PostToggleIcon',
    props: ['className', 'classNameActive', 'user', 'fillType'],
    computed: {
      activeProfileType() {
        let activeTab = this.$route.path.split('/')[3];
        if (activeTab === this.fillType) {
          return this.classNameActive;
        } else {
          return this.className;
        }
      }
    },
    methods: {
      goToProfileLink(){
        this.$router.push('/u/' + this.user.nickname + '/' + this.fillType);
      }
    }
  }
</script>

<style lang="less">

</style>
