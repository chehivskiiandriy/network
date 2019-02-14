<template>
  <div>
    <div class="rating-title">{{$lang.variables.historyLeaderRating}}</div>
    <div class="rating-month" v-for="(monthData,index) in usersMonth">
      <p class="rating-month-title" v-text="$lang.variables.top + ' 5 ' +month[index]+ ' ' + year[index]"></p>
      <div class="rating-month-item" v-for="(user,index) in monthData.users">
        <router-link :to="'/u/'+user.nickname">
          <div class="rate-container-item">
            <img class="rating-month-itemavatar" :src="user.avatar_image.url_small"/>
            <div class="carousel-index prizes-carousel-index-rate">{{index+1}}</div>
          </div>
        </router-link>
        <div class="rating-month-itemnickname">{{user.nickname}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';

  export default {


    data() {
      return {
        usersMonth: [],
        month: [],
        year: [],
      }
    },
    mounted() {
      axios.get('v1/rating-history/all')
        .then(
          res => {
            this.usersMonth = res.data.data;
            this.month = this.usersMonth.map((dataMonth) => {
              let month = dataMonth.date.split('-');
              switch (month[1]) {
                case '01' :
                  return this.$lang.variables.January;
                  break;
                case '02' :
                  return this.$lang.variables.February;
                  break;
                case '03' :
                  return this.$lang.variables.March;
                  break;
                case '04' :
                  return this.$lang.variables.April;
                  break;
                case '05' :
                  return this.$lang.variables.May;
                  break;
                case '06' :
                  return this.$lang.variables.June;
                  break;
                case '07' :
                  return this.$lang.variables.July;
                  break;
                case '08' :
                  return this.$lang.variables.August;
                  break;
                case '09' :
                  return this.$lang.variables.September;
                  break;
                case '10' :
                  return this.$lang.variables.October;
                  break;
                case '11' :
                  return this.$lang.variables.November;
                  break;
                case '12' :
                  return this.$lang.variables.December;
                  break;
              }

            });
            this.year = this.usersMonth.map((dataMonth) => {
              let year = dataMonth.date.split('-');
              return year[0];
            })
          }
        )
    },
    head: {
      title() {
        return {
          inner: this.$lang.variables.historyLeaderRating
        }

      },
    }
  }
</script>
<style lang="less">
  @import "~LessStyle/monthrating.less";

  .rating-month-item {
    position: relative;
  }

  .carousel-index {
    color: #fff;
    position: absolute;
    font-size: 12px;
    border-radius: 3px;
    left: 2px;
    bottom: 2px;
    width: 14px;
    height: 14px;
    background: linear-gradient(to left top, #000fbc, #30c2be 50%);
  }

  .rate-container-item {
    position: relative;
    height: 18vw;
  }

  .prizes-carousel-index-rate {
    bottom: 2px;
    left: 2px;
  }
</style>
