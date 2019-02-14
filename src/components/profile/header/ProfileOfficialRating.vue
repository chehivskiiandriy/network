<template>
  <div class="profile-official-rating">
    <div class="profile-ratebar level-one level-one-official">
      <div
        class='profile-white'
        :style="{ width: 0, left: '100%' }">
      </div>
      <div
        class="profile-rating-value left"
        v-text="'R '+ 1"></div>
      <div
        class="profile-rating-value right"
        v-text="'R '+ 5000"></div>
    </div>
    <div class="level-two-rate level-two-official" >
      <div class="level-two-block official">
        <!--<div class="svg"></div>-->
        <img class="level-two-svg" :src="barSvg"/>
      </div>
      <div
        class="profile-rating-value left"
        v-text="'R '+ 5001"></div>
      <div
        class="profile-rating-value right"
        v-text="'R '+ 20000"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ProfileOfficialRating",
    data(){
      return {
        barSvg:img.levelUpRateBar,
      }
    },
  }
</script>

<style lang="less">
  @import '~LessStyle/ratingbar.less';

  .profile-official-rating {
    margin: auto;
  }

  .level-one-official,
  .level-two-official {
    position: relative;

    .profile-rating-value {
      position: absolute;
      bottom: 100%;
      font-size: 12px;
      font-weight: bold;
    }

    .left {
      left: 0;
    }

    .right {
      right: 0;
    }
  }

  .level-one-official {
    width: 97vw;
    margin: 20px auto;
  }

  .level-two-official {
    width: 97vw;
    margin: 20px auto;
  }

  .level-two-block {
    /*height: 11px;*/
    /*width: 55%;*/

    .svg {
      /*height: 100%;*/
      /*width: 100%;*/
      /*background-image: url('https://media.inrating.top/storage/img/progress_bar/12.svg');*/
      /*background-size: cover;*/
      /*margin: 0;*/
      /*background-repeat: no-repeat;*/
      /*background-position: left center;*/
    }

    &.official img{
      width: calc(~'100vw - 10px');
    }
  }
</style>
