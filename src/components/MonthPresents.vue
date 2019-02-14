<template>
  <div>
    <div class="rate-carousel-item">
      <p class="carousel-title">{{$lang.variables.prizesOfTheMonth}} ({{dateMonth}} {{dateYear}})</p>
      <div
        class="rate-carousel-image "
        v-for="(prize,index) in this.contestPrizes">
        <img :src="prize.image"/>
        <div
          class="carousel-index carousel-monthpresents"
          v-text="index+1"></div>
        <p class="rate-carousel--nickname">{{prize.name}}</p>
      </div>
    </div>
    <div
      id="contest-container"
      class="contests-raiting">

      <div
        class="prize-item"
        v-for="(prize,index) in contestPrizes">
        <div class="prize-image">
          <img :src="prize.image"/>
          <div
            class="prize-index"
            v-text="index+1"></div>
        </div>
        <div class="prize-body">
          {{prize.name}}
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import axios from 'axios';

  export default {
    data(){
      return {
        contestPrizes: [],
        dateMonth: '',
        dateYear: '',
      }
    },
    mounted(){
      let date = new Date();
      this.dateYear = date.getFullYear();
      switch(date.getMonth()){
        case 0 :
          this.dateMonth = this.$lang.date.January;
          break;
        case 1 :
          this.dateMonth = this.$lang.date.February;
          break;
        case 2 :
          this.dateMonth = this.$lang.date.March;
          break;
        case 3 :
          this.dateMonth = this.$lang.date.April;
          break;
        case 4 :
          this.dateMonth = this.$lang.date.May;
          break;
        case 5 :
          this.dateMonth = this.$lang.date.June;
          break;
        case 6 :
          this.dateMonth = this.$lang.date.July;
          break;
        case 7 :
          this.dateMonth = this.$lang.date.August;
          break;
        case 8 :
          this.dateMonth = this.$lang.date.September;
          break;
        case 9 :
          this.dateMonth = this.$lang.date.October;
          break;
        case 10 :
          this.dateMonth = this.$lang.date.November;
          break;
        case 11 :
          this.dateMonth = this.$lang.date.December;
          break;
      }
      axios.get('v1/contests/prizes/all')
      .then(res =>{
        this.contestPrizes = res.data.data;
      });
    }
  }

</script>
<style lang="less">
  @import "~LessStyle/variables.less";

  @import "~LessStyle/monthrating.less";
  @import '~LessStyle/sharemodal.less';
  @import '~LessStyle/ratecarousel.less';
  @import '~LessStyle/contest.less';

  .rate-carousel li{
    padding: 0 !important;
  }

  .swiper-pagination-bullet{
    border-radius: 2px;
    margin: 0 1px !important;
  }

  .swiper-pagination-bullet-active{
    background: #5ac5c6;
  }

  .rating-block-pagination{
    top: 0;
    left: 38% !important;
    width: 100%;
    height: 0;
  }

  .swiper-container{
    background: #fff;
    transition: 2s linear;
  }

  .swiper-container{
    background: #fff;
    transition: 2s linear;
  }

  .contests-raiting{
    padding-top: 10px;
  }

  .prize-item{
    display: flex;
    position: relative;
    align-items: center;
    width: 99%;
    box-shadow: 2px 2px 0 0 rgba(95, 92, 92, 0.2);
    border-radius: 5px;
    margin: 3px auto;
    padding: 2px 7px;
    box-sizing: border-box;
    background: #fff;
  }

  .prize-image{
    width: 18%;
    position: relative;
    margin-right: 10px;
  }

  .prize-image img{
    width: 100%;
    height: auto;
    box-shadow: 2px 2px 0 0 rgba(95, 92, 92, 0.2);
    border-radius: 5px;
  }

  .prize-index{
    color: #fff;
    position: absolute;
    font-size: 12px;
    border-radius: 3px;
    width: 14px;
    height: 14px;
    left: 3%;
    bottom: 6%;
    .bgc-grad();
  }

  .prize-body{
    font-weight: 600;
    .text-grad();
  }

  .carousel-monthpresents {
    bottom: 17px !important;
  }
</style>
