<template>
  <div  >
    <img   :src="image.url_large"  v-lazy="image.url_large"  />
    <in-mention-block :image="image" :current-users-nickname="currentUsersNickname"></in-mention-block>
  </div>
</template>
<script>
  export default  {
    props:['image', 'currentUsersNickname'],
    computed: {
        imageUpload() {
          return this.image ? this.image.url_large : "";
        }
      },


  }
</script>
<style>
  img[lazy=loading] {
    filter: blur(20px);
  }


</style>
