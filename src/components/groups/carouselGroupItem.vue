<template>
  <div class="carousel-item--block">
    <div class="carousel-avatar">
      <router-link :to="'/group/' + group.slug">
        <img :src="group.logo.url_small">
      </router-link>
    </div>
    <span
      class="carousel-name"
      v-text="nameContest"></span>
  </div>
</template>

<script>

  export default {
    name: 'carouselContestItem',
    props: ['group', 'index'],
    data(){
      return {
        nameContest: '',
      }
    },
    mounted(){
      let text = this.group.name;
      let sliced = text.slice(0, 10);
      if(sliced.length < text.length){
        this.nameContest = sliced + '...';
      }
      this.nameContest = sliced;
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  .groupcarousel-index{
    color: #fff;
    position: absolute;
    font-size: 12px;
    border-radius: 3px;
    width: 14px;
    height: 14px;
    left: 2px;
    bottom: 1px;
    .bgc-grad();
  }
</style>
