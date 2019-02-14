<template>
  <transition name="recommbar">
    <div class="recommend-bar" v-if="isShowRecommendations">
      <div class="recommend-header" @click="toggleBar" ref="rheader">
        <div class="recommend-text">
          <p>{{$lang.variables.recommendations}}</p>
        </div>

        <div class="recommend-header-icon">
            <i :class="{
              'icon-down-f': isToggleRecommendations === false,
              'icon-up-f': isToggleRecommendations === true,
            }">
            </i>
        </div>

      </div>

      <transition name="trans">
        <div v-show="isToggleRecommendations">

          <div class="recommend-body" v-if="loading">
            <div class="recommend-item recommend-item-loading" v-for="n in 5">
              <div class="recommend-item-image">
                <div class="recommend-image loading-image"></div>
              </div>
              <div class="recommend-item-names">
                <span class="recommend-nickname loading-text loading-nickname"></span>
                <span class="recommend-username loading-text loading-username"></span>
              </div>
              <div class="recommend-item-subscribe-button"></div>
            </div>
          </div>

          <div class="recommend-body" v-else>
            <in-recommendation-item
              @changeActivity="changeActivity"
              v-for="item in recommendations"
              :recommendation="item"
              :key="item.id + Math.random()"
            >
            </in-recommendation-item>
          </div>

          <div
            v-show="nextPage > lastPage"
            class="recommend-footer">
            <div class="recommend-footer-item recommend-text recommend-text_more" @click="getMyRecommendations(nextPage)">
              <p>{{$lang.variables.moreInfo}}...</p>
            </div>
            <div class="recommend-footer-item recommend-text recommend-text_hide" @click="hideRecommendations">
              <p>{{$lang.variables.dontShowAgain}}</p>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>

</template>

<script>
  import Vue from 'vue';
  import RecommendationItem from "ComponentsVue/main/RecommendationItem.vue";
  import TransitionComponent from 'ComponentsVue/UI/TransitionComponent';

  Vue.component('in-recommendation-item', RecommendationItem);
  Vue.component('in-transition-component', TransitionComponent);


  export default {
    name: 'RecommendationMain',
    data() {
      return {
        recommendations: [],
        isToggleRecommendations: false,
        isShowRecommendations: true,
        lastPage: 1,
        nextPage: 2,
        loading: false,
      }
    },
    created() {
      this.showRecommendations();
    },
    mounted() {
      this.getMyRecommendations(1);
    },
    methods: {
      async getMyRecommendations(page) {
        this.loading = true;

        const data = new FormData();
        data.append('page', page);

        try {
          const result = await this.$api.user.getRecommendations(data);
          this.recommendations = result.data.data;
          this.nextPage = result.data.meta.current_page + 1;
          this.lastPage = result.data.meta.current_page;
        }
        catch (e) {
          console.log(e)
        }
        finally {
          this.loading = false;
        }
      },
      toggleBar() {
        this.isToggleRecommendations = !this.isToggleRecommendations;
      },
      changeActivity(payload) {
        const needle = [];
        // get all indexes with matched nickname
        this.recommendations.forEach( (element,index) => {
          if (element.nickname === payload.nickname) {
            needle.push(index)
          }
        });
        // set subscribed property in recommendation array
        needle.forEach( index => {
          this.recommendations[index].is_subscribed = payload.isSubscribed;
        })
      },
      showRecommendations() {
        const toggle = localStorage.getItem('showRecommendations');
        if (toggle === null){
          localStorage.setItem('showRecommendations',1);
        }
        this.isShowRecommendations = !!Number(localStorage.getItem('showRecommendations'));
      },
      hideRecommendations() {
        localStorage.setItem('showRecommendations',0);
        this.isShowRecommendations = false;
      }
    }
  }
</script>

<style lang="less">
  @import "~LessStyle/variables.less";

  .recommend-header, .recommend-footer{
    display: flex;
    align-items: center;
    height: 5vh;
  }
  .recommend-header{
    /*border-top: */
    justify-content: center;
  }

  .recommend-body{
    overflow: scroll;
    height: 74vw;
  }

  .recommend-text_more {
    font-size: 4vw;
    width: 100%;
    text-transform: uppercase;
    color: @contest-list-text-color;
    text-align: center;
    font-weight: 600;
  }
  .recommend-text_hide {
    font-size: 2vw;
    position: absolute;
    right: 3vw;
    word-wrap: break-word;
    width: 20vw;
    font-weight: 200;
    color: @middle_grey;
    text-transform: uppercase;
  }



  .recommend-header-icon{
    position: absolute;
    right: 3vw;
    color: @middle_grey;
  }
  .recommend-header-icon > i{
    font-size: 3.5vw;
  }

  .recommend-header > .recommend-text > p {
    color: @contest-list-text-color;
    font-size: 4.4vw;
    font-weight: 600;
  }

  /* ANIMATION RECOMMENDATION BLOCK */
  .trans-enter-active {
    animation: trans 0.3s linear ;
  }
  .trans-leave-active {
    animation: trans 0.3s linear  reverse;
  }
  @keyframes trans {
    0% {
      height: 0;
      opacity: 0;
    }
    100% {
      height: 74vw;
      opacity: 1;
    }
  }
  /*
  .recommbar-enter-active {
    animation: recommbar 0.3s linear ;
  }
  */
  .recommbar-leave-active {
    animation: recommbar 0.3s linear  reverse;
  }
  @keyframes recommbar {
    0% {
      height: 0;
      opacity: 0;
    }
    100% {
      height: 74vw;
      opacity: 1;
    }
  }


  /* LOADING BLOCK */
  .loading-image{
    border-radius: 2vw !important;
    background: @background;
  }
  .loading-text {
    background: @background;
    border-radius: 2vw;
    height: 3vw;
    margin: 1vw 0;
  }
  .loading-nickname{
    width: 24vw !important;
  }
  .loading-username{
    width: 40vw !important;
  }

  .recommend-bar {
    border-top: 1px solid @light__grey;
    border-bottom: 1px solid @light__grey;
  }






</style>
