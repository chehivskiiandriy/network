<docs>
  # ratingBar
</docs>

<template>
  <div v-if="getLevel === 1" class="profile-ratebar level-one">
    <div
      class='profile-white'
      :style="{ width: (100 - getProportion * 100 - 1)+'%' , left: (getProportion * 100 + 1) +'%'}">
    </div>

    <div
      class="profile-ratingvalue"
      v-text="'R '+ getValue"></div>
  </div>
  <div  class="level-two-rate" v-else >
    <div class="level-two-block" :style="{ width: (getProportion * 100 + 1)+'%'}">
      <img class="level-two-svg" :src="barSvg"/>
    </div>
    <div
      class="profile-ratingvalue level-two-value"
      v-text="'R '+ getValue"></div>
  </div>
</template>

<script>

  export default {
    name: 'Post',
    props: ['user'],
    data(){
      return {
        barSvg: img.levelUpRateBar,
      }
    },
    computed: {
      getProportion(){
        if(this.user.rating){
          if(this.user.rating.proportion){
            return this.user.rating.proportion
          }else{
            return 0
          }
        }else{
          return 0
        }
      },
      getValue(){
        if(this.user.rating){
          return this.user.rating.value
        }else{
          return 0
        }
      },
      getLevel() {
        if (this.user.rating)
         return this.user.rating.level;
      }
    },
    // mounted(){
    //   this.$root.$on('addRating', (value) => {
    //     this.user.rating.value += value;
    //   })
    // },
  }


</script>

<style lang="less">
  @import '~LessStyle/ratingbar.less';

  .level-one {
    width: 97vw;
    margin: 0 auto;
  }
</style>
