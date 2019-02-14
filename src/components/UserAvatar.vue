<template>
  <div class="user-avatar-block" >
    <div >
      <img class="solo-user-avatar" :src="resultAvatar.url_small" alt="">
      <div v-if="resultActiveGift">
        <img class="avatar-img--present" :src="resultActiveGift.image" alt="">
      </div>
    </div>
  </div>
</template>
<script>
    export default  {
      props: {
        /* `user` prop is deprecated */
        user: Object,
        avatar: Object,
        activeGift: Object,
      },
      computed: {
        resultAvatar() {
          return (this.user && this.user.avatar_image) || this.avatar;
        },
        resultActiveGift() {
          return (this.user && this.user.active_gift) || this.activeGift;
        },
      },
    }
</script>
<style>
  .avatar-img--present {
    position: absolute;
    width: 25%;
    height: auto;
    opacity: 0.7;
    bottom: 6%;
    right: 7%;
    background-color: #fff;
    padding: 1px;
    border-radius: 2px;
  }
  .user-avatar-block {
    position: relative;
  }
</style>
