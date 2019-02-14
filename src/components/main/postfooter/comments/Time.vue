<template>
    <span class="comment-createdAt">
      <span>{{ createdAtTime }}</span>
      <!--<span>{{$unixTime(this.time)}}</span>-->
    </span>
</template>
<script>
  import 'JsLib/prototype'

  export default {
    props: ['time'],
    data() {
      return {

        createdAt: '',
        createdAtTime: '',
      }
    },
    mounted() {
      this.createdAt = this.time;
      //console.log('typeof ', typeof this.createdAt, this.createdAt);
      this.createdAtTime = this.$unixTime(this.createdAt);
    }
  }
</script>
<style>
  .comment-createdAt {
    font-size: 1.7vw;
    color: #d3d3d3;
  }
</style>
