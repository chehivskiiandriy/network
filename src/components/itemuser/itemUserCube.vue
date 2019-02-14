<template>
    <div >
      <router-link :to="'/u/'+user.nickname">
        <img class="user-cube-img" :src="user.avatar_image.url_medium"/>
        <p class="cube-nickname">{{user.nickname}}</p>
      </router-link>
    </div>
</template>
<script>
  export default {
    props:['user'],
    data() {
      return {

      }
    },

  }
</script>
<style>

  .user-cube-img {
    width: 100%;
    height: auto;
    border-radius: 3px;
    display: block;
  }

  .cube-nickname {
    font-size: 11px;
    text-align: center;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;

    text-overflow: ellipsis;
  }


</style>
