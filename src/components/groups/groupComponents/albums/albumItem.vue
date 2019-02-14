<template>
  <router-link :to="'/group/'+this.$route.params.group_slug+'/albums/'+this.album.id">
    <div class="album-item">
      <h4  v-text="this.album.title"></h4>
      <div class="album-image" v-for="image in albumImageArray ">
        <img :src="image.attachments.images[0].url_medium"  >
      </div>
      <div class="album-image" v-for="image in countEmptyItem">
        <img :src="imgArray.emptyB" >
      </div>
    </div>
  </router-link>
</template>
<script>
  export default  {
    data() {
      return {
        albumImageArray:[],
        imgHeight:'',
        countEmptyItem: 0,
        imgArray: window.img
      }
    },
    props:['album'],
    mounted() {
      this.imgHeight=localStorage.getItem('clientWidth');
      let albumLength=this.album.posts.length;
      if (albumLength < 5){
        this.albumImageArray=this.album.posts;
        this.countEmptyItem = 4 - albumLength;
      }
      else{
        this.albumImageArray.push(this.album.posts[0]);
        this.albumImageArray.push(this.album.posts[1]);
        this.albumImageArray.push(this.album.posts[2]);
        this.albumImageArray.push(this.album.posts[3]);
        // this.albumImageArray.push(this.album.posts[4]);

      }
    }
  }
</script>
<style lang="less">
  @import "~LessStyle/variables.less";

  h4 {
    color: @middle_grey;
    margin:3px 0px;
    width: 100%;
    font-weight: 500;
  }

  .album-item {
    width:97%;
    padding: 5px 12px;
    box-sizing: border-box;
    box-shadow: 2px 2px 0px 0px rgba(95, 92, 92, 0.2);
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    border-radius: 5px;
    margin: 5px auto;

  }
  .album-image {
    width: 23%;
    margin:0px 1%;
  }

  .album-image img {
    width: 100%;
    border-radius: 8px;
  }
</style>
