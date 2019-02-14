<template>
  <div class="app">
    <template v-if="statistics=='last_week'">
      <span
        class="gender-item-change active-gender"
        @click="statistics='last_week'">{{$lang.variables.ofWeek}}</span>
      <span
        class="gender-item-change"
        @click="statistics='last_month'">{{$lang.variables.ofMonth}}</span>
    </template>
    <template v-else-if="statistics=='last_month'">
      <span
        class="gender-item-change"
        @click="statistics='last_week'">{{$lang.variables.ofWeek}}</span>
      <span
        class="gender-item-change active-gender"
        @click="statistics='last_month'">{{$lang.variables.ofMonth}}</span>
    </template>
    <h2>{{$lang.variables.dynamics}}</h2>
    <div class="ct-chart-line-removeall">

    </div>
    <h2>{{$lang.variables.growth}}</h2>
    <div class="ct-chart-line-removeall-prirost">

    </div>


    <div class="ct-chart">

    </div>

  </div>
</template>
<script>
  import axios from 'axios';

  import Chartist from 'chartist'

  require('chartist-plugin-legend');

  export default {

    data() {
      return {
        labels:[],
        statistics:'last_week',
        statisticData:{
          seriesLike:[],
          seriesRating:[],
          seriesComment:[],
          seriesChinChin:[],
          seriesFollow:[],
          seriesGift:[],
          seriesContestVote:[],
        },
        statisticDataGrowth:{
          seriesLikeGrowth:[],
          seriesRatingGrowth:[],
          seriesCommentGrowth:[],
          seriesChinChinGrowth:[],
          seriesFollowGrowth:[],
          seriesGiftGrowth:[],
          seriesContestVoteGrowth:[],
        },
        chartOptions: {
          lineSmooth: true,
        },
        statisticArray: [
          {
            type: 'like',
            variable: 'seriesLike',
            variableG: 'seriesLikeGrowth',
            time: true
          },
          {
            type: 'comment',
            variable: 'seriesComment',
            variableG: 'seriesCommentGrowth',
            time: false
          },
          {
            type: 'chin-chin',
            variable: 'seriesChinChin',
            variableG: 'seriesChinChinGrowth',
            time: false
          },
          {
            type: 'follow',
            variable: 'seriesFollow',
            variableG: 'seriesFollowGrowth',
            time: false
          },
          {
            type: 'gift',
            variable: 'seriesGift',
            variableG: 'seriesGiftGrowth',
            time: false
          },
          {
            type: 'rating-vote',
            variable: 'seriesRating',
            variableG: 'seriesRatingGrowth',
            time: false
          },
          {
            type: 'contest-vote',
            variable: 'seriesContestVote',
            variableG: 'seriesContestVoteGrowth',
            time: false
          },
        ]
      }

    },
    mounted() {
      this.dataReturn();
      this.changeStat();
    },
    methods: {
      dataReturn() {
        this.statisticArray.map((item)=>{
          this.getParamsForChart(item);
        });
      },
      newChart() {
        new Chartist.Line('.ct-chart-line-removeall-prirost', {
          labels: this.labels,
          series: [
            {
              name: this.$lang.variables.likes,
              data: this.statisticDataGrowth.seriesLikeGrowth,
            },
            {
              name: this.$lang.variables.chinChinFilter,
              data: this.statisticDataGrowth.seriesChinChinGrowth,
            },
            {
              name: this.$lang.variables.subscriptions,
              data: this.statisticDataGrowth.seriesFollowGrowth,
            },
            {
              name: this.$lang.variables.gifts,
              data: this.statisticDataGrowth.seriesGiftGrowth,
            },
            {
              name: this.$lang.variables.rating,
              data: this.statisticDataGrowth.seriesRatingGrowth,
            },
            {
              name: this.$lang.variables.contest,
              data: this.statisticDataGrowth.seriesContestVoteGrowth,
            },
          ],

        }, {
          fullWidth: true,
          chartPadding: {
            right: 40,
          },
          plugins: [
            Chartist.plugins.legend({position: 'bottom',})
          ]
        });
        new Chartist.Line('.ct-chart-line-removeall', {
          labels: this.labels,
          series: [
            {
              name: this.$lang.variables.likes,
              data: this.statisticData.seriesLike,
            },
            {
              name: this.$lang.variables.chinChinFilter,
              data: this.statisticData.seriesChinChin,
            },
            {
              name: this.$lang.variables.subscriptions,
              data: this.statisticData.seriesFollow,
            },
            {
              name: this.$lang.variables.gifts,
              data: this.statisticData.seriesGift,
            },
            {
              name: this.$lang.variables.rating,
              data: this.statisticData.seriesRating,
            },
            {
              name: this.$lang.variables.contest,
              data: this.statisticData.seriesContestVote,
            },
          ],

        },{
          fullWidth: true,
          chartPadding: {
            right: 40,
          },
          stackBars: true,
          plugins: [
            Chartist.plugins.legend({position: 'bottom',})
          ]

        });
      },
      getParamsForChart(item) {
        axios.post('v1/me/statistic/daily/all?type='+item.type+'&from=last_month')
          .then(
            res=>{

              let objKeys=Object.keys(this.statisticData);
              objKeys.map((key)=>{
                if (item.variable==key){
                  res.data.map((item)=>{
                    this.statisticData[key].push(item.count);
                  });
                  //this.newChart();
                }
              });
              if (item.time){
                res.data.map((item, index)=>{
                  if(index === 0 || index === res.data.length - 1) {
                    this.labels.push(item.created_at.split('-')[2]+'.'+item.created_at.split('-')[1]);
                  } else {
                    this.labels.push('');
                  }
                });
              }

            }
          )

        axios.post('v1/me/statistic/daily/all?type='+item.type+'&from=last_month&increasing=true')
          .then(
            res=>{
              let objKeys=Object.keys(this.statisticDataGrowth);
              objKeys.map((key)=>{
                if (item.variableG==key){
                  res.data.map((item)=>{
                    this.statisticDataGrowth[key].push(item.count);
                  });
                  this.newChart();
                }
              });
            }
          )
      },
      changeStat() {
        let objKeys=Object.keys(this.statisticData);
        objKeys.map((key)=>{
        });
      }
    }
    }
</script>
<style  lang="less">
  @import "~LessStyle/variables.less";
  @import '~LessStyle/changeprofile.less';
  @ct-series-colors: #d70206, #f05b4f, #f4c63d, #d17905, #453d3f, #59922b, #0544d3, #6b0392, #f05b4f, #dda458, #eacf7d, #86797d, #b2c326, #6188e2, #a748ca;

  .ct-line {
    stroke-width: 2px !important;
  }
  .ct-point {
    stroke-width: 0px!important;
  }

  .ct-legend li.inactive:before {
    background: transparent;
  }

  .for(@ct-series-colors, { .ct-series-@{i}:before{
    background-color: @value;
    border: 3px solid @value;
  } });

  .ct-chart-line-removeall , .ct-chart-line-removeall-prirost {
    .ct-legend {
      position: relative;
      z-index: 10;
      list-style: none;
      text-align: center;

      li {
        position: relative;
        padding-left: 23px;
        margin-right: 10px;
        margin-bottom: 3px;
        cursor: pointer;
        display: inline-block;

        &:before {
          width: 12px;
          height: 12px;
          position: absolute;
          left: 0;
          content: '';
          border: 3px solid transparent;
          border-radius: 2px;
        }
        .inactive:before {
          background: transparent;
        }
      }


      .ct-legend-inside {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
    g:not(.ct-grids):not(.ct-labels) g {

    }
  }

  .ct-horizontal  {
    /*transform: rotate(-90deg);*/
    /*margin-top: 15px;*/
    transform: translateX(-100%);
  }

</style>
