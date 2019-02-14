<template>
  <router-link :to="'contest/'+this.contest.slug">
    <div class="carousel-item--block">
      <div class="carousel-avatar">
        <img
          :src="this.contest.img.url_large"
          :style="{height : clientWidth*0.17+'px'}">
        <div
          class="carousel-index"
          v-text="this.index+1"></div>
      </div>
      <span
        class="carousel-name"
        v-text="$textLength(contest.name, 12)"></span>
    </div>
  </router-link>
</template>

<script>

  export default {
    name: 'carouselContestItem',
    props: ['contest', 'index'],
    data(){
      return {
        nameContest: '',
        clientWidth: '',
      }
    },
    mounted(){
      let text = this.contest.name;
      this.clientWidth = localStorage.getItem('clientWidth');
      let sliced = text.slice(0, 12);
      if(sliced.length < text.length){
        this.nameContest = sliced + '...';
      }
      this.nameContest = sliced;
    }
  }
</script>

<style lang="less">

</style>
