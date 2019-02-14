
<docs>
  # ratingBar
</docs>

<template>
    <div  :class="ratingOpacityClass+' black-background'" v-bind:style="{height:blackHeight+'px'}" >
      <div   class="rate-block-limitation" >
        <div v-if="rating.level==1">
          <svg id="svg-progress-bar-color" :width="100 * rating.proportion + '%'" :height="blackHeight+'px'" v-bind:style="{ borderRadius: this.radius + 'px',}">
            <defs>
              <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#2046FF"/>
                <stop offset="18%"   stop-color="#25B0FF"/>
                <stop offset="33%"   stop-color="#27FFE6"/>
                <stop offset="50%"   stop-color="#2EFF5B"/>
                <stop offset="66%"   stop-color="#C7FF48"/>
                <stop offset="83%"   stop-color="#FFAC2B"/>
                <stop offset="100%"   stop-color="#FF3E25"/>
              </linearGradient>
            </defs>
            <rect :width="width" :height="height" fill="url(#linear)" />
          </svg>
        </div>
        <div :class='changeCount' v-else-if="rating.level==2">
            <in-post-rating-bar-level-two :width="100 *this.rating.proportion+ '%'" :height="blackHeight"></in-post-rating-bar-level-two>
        </div>
      </div>
      <div :class="ratingValue" v-text="'R '+this.rating.value"> </div>
    </div>

</template>

<script>
  import {mapGetters} from 'vuex';

  import {moduleName as countPostOnPageModule, RATING_POST_COUNT} from 'Store/modules/countPostOnPage';
  import Vue from 'vue'
  import LevelTwo from 'ComponentsVue/main/postmenu/PostRatingBarLevelTwo'

  Vue.component('in-post-rating-bar-level-two',LevelTwo)
  export default {
    name: "Post",
    props: ['rating'],
    data() {
      return {
        width:localStorage.getItem('clientWidth'),
        height:10,
        radius:3,
        left:10,
        top:4,
        barSvgTwo:img.levelUpRateBar,
        barSvgOne:img.baseRateBar,
      }
    },
    computed: {
      ...mapGetters({
        ratingPostCount: countPostOnPageModule + RATING_POST_COUNT
      }),
      ratingBarClass() {
        if(this.ratingPostCount === '1')
          return 'rate-bar';
        else
          return 'rate-bar-small';
      },
      ratingOpacityClass() {
        if (this.ratingPostCount === '1')
          return 'rate-opacity';
        else
          return 'rate-opacity-small';
      },
      changeCount() {
        if (this.ratingPostCount === '2') {
          if (this.rating.level==2)
            return 'rateLvlTwo';
          else
            return '';
        }
        else {
          if (this.rating.level==2)
            return 'rateLvlTwoOne';
          else
            return '';
        }
      },
      ratingValue() {
        if (this.ratingPostCount === '1')
          return 'rate-value';
        else
          return 'rate-value-small';
      },
      checkWidth() {
        if (this.ratingPostCount === '1')
          return this.width*0.94;
        else
          return this.width*0.45;
      },
      blackHeight() {
        if (this.ratingPostCount === '1') {
          if (this.rating.level==1)
            return '10';
          else
            return '11';
        }
        else {
          if (this.rating.level==1)
            return '8';
          else
            return '8';
        }
      }
    },
    mounted() {
      if (this.ratingPostCount === '1') {
        this.width = localStorage.getItem('clientWidth');
        this.height = 10;
        this.top = 4;
      }
      else {
        this.width = localStorage.getItem('clientWidth')*0.45;
        this.height = 8;
        this.top = 6;
      }

    }
  }



</script>

<style lang="less">
  @import '~LessStyle/ratingbar.less';
  .st0{fill:url(#SVGID_1_);}

</style>
