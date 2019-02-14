<template>
    <div class="item-block">
      <div class="item-avatar ">
        <img :src="this.user.avatar_image.url_small">
      </div>
      <div class="item-info">
        <in-nickname tag="p" class="user-nickname" :status="user.status">{{user.nickname}}</in-nickname>
        <p class="user-name"><span v-text="this.user.name"></span> <span v-text="this.user.lastname"></span></p>
      </div>
      <i :class="checkMult"></i>
    </div>
</template>
<script>
  export default {
    props:['user','userArray'],
    data() {
        return {
          indexArray:[],
        }

    },
    computed: {
      checkMult() {
        /*let check=this.usersArray.indexOf(this.user.id);
        if (check!=-1)
          return 'icon-check-f check choose'
        else
          return 'icon-check-f uncheck choose'*/
      },
    },
  }
</script>
<style>

</style>
