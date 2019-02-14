<docs>
  #
</docs>

<template>
  <div
    class="sliderBody"
    v-bind:style="{height: indexHeight + 'px'}">
    <i
      class="icon-left-f"
      v-show="indexSlider > 0"
      @click="prevSlider"></i>
    <div
      class="sliderBody-wrap"
      v-bind:style="{transform: 'translate3d( -' + sliderChange + 'px,' + 0 + 'px,' + 0 + 'px)'}">


      <div
        class="sliderBody-body"
        v-for="body in array"
        v-bind:style="{width: indexWidth + 'px', height: sliderHeigth}">

        <template v-if="type === 'contest'">
          <div
            class="sliderBody-body-head"
            v-bind:class="{ active: body.is_active }">
            <div v-if="body.isIncoming" class="contest-coming-soon contest-coming-soon_head">
              COMING SOON
            </div>
          </div>

          <div class="sliderBody-body-img" @click="goToContest(body.slug, body.is_active, body.is_expired)">
            <img
              :src="body.img.url_small"
              alt="">
          </div>

          <template v-if="body.name">
            <p
              @click="goToContest(body.slug, body.is_active, body.is_expired)"
              style="font-size: 3.5vw"
              :title="body.name"
              v-html="$textLength(body.name, 26)"
              class="contest-name"></p>
          </template>

          <div
            class="sliderBody-body-user"
            v-if="body.contestants"
            v-for="user in body.contestants.slice(0,3)">

            <router-link :to="'/u/'+user.nickname">
              <template v-if="user.avatar_image">
                <img
                  :src="user.avatar_image.url_small"
                  alt="">
              </template>
            </router-link>

          </div>
          <div v-if="body.contestants.length < 1" class="contest-coming-soon">
            <div class="comming-soon">
              <span class="comming-text">COMING</span><br>
              <span class="soon-text">SOON</span>
            </div>
          </div>

        </template>

        <template v-else-if="type === 'user'">
          <router-link :to="'/u/'+body.nickname">
            <div class="slider-user-search">
              <img
                :src="body.avatar_image.url_large"
                :alt="body.nickname">
              <p>{{body.nickname}}</p>
            </div>
          </router-link>
        </template>

        <template v-else-if="type === 'group'">
          <router-link :to="'/group/'+body.slug">

            <template v-if="body.logo">
              <img
                :src="body.logo.url_medium"
                :alt="body.name">
            </template>
            <template v-else>
              <img
                :src="emptyW"
                :alt="body.name">
            </template>
            <p>
              {{body.name}}
            </p>
            <i
              v-if="body.accessibility"
              class="icon-lock_open">
            </i>
            <i
              v-else
              class="icon-lock_close">
            </i>
          </router-link>

        </template>

        <template v-else-if="type === 'event'">

          <div class="sliderBody-body-leftSide" :style="{height: sliderHeigth}">
            <router-link :to="'/group/'+body.slug">
            <img
              :src="body.logo.url_medium"
              :alt="body.name">
            </router-link>
          </div>

          <div class="sliderBody-body-rightSide" :style="{height: sliderHeigth}">
            <router-link :to="'/group/'+body.slug">
              <p class="sliderBody-body-rightSide-title">{{body.name}}</p>
              <p class="sliderBody-body-rightSide-subtitle">
                {{body.subject}}
                <i
                  v-if="body.accessibility"
                  class="icon-lock_open">
                </i>
                <i
                  v-else
                  class="icon-lock_close">
                </i>
              </p>
            </router-link>


            <template v-if="body.geo_id">
              <p>
                <i class="icon-location-f"></i>
                {{body.geo_id.location}}
              </p>
            </template>
            <p>
              <i class="icon-time"></i>
              {{$unixTime(body.event_dates.start_date_timestamp)}}
            </p>
            <p>
              <i class="icon-time-2"></i>
              {{$unixTime(body.event_dates.end_date_timestamp)}}
            </p>
          </div>


        </template>

      </div>

    </div>
    <i
      v-if="this.indexSlider < this.maxLength"
      class="icon-right-f"
      @click="nextSlider"></i>
  </div>
</template>

<script>
  export default {
    name: 'search-slider',
    data() {
      return {
        indexSlider: 0,
        emptyW: window.emptyW
      }
    },
    props: {
      array: '',
      indexWidth: {
        type: Number,
        required: true
      },
      indexHeight: {
        type: [Number, String],
        validator: (value) => {
          return typeof value === 'number' || (typeof value === 'string' && value[value.length-1] == '%')
        }
      },
      maxLength: {
        type: Number,
        required: true
      },
      maxLength: Number,
      type: String
    },
    computed: {
      sliderChange() {
        return this.indexSlider * (this.indexWidth - (-5))
      },
      sliderHeigth() {
        console.log('indexHeight',this.indexHeight, typeof this.indexHeight)
        return this.indexHeight[this.indexHeight.length-1] == '%' ? this.indexHeight : this.indexHeight+'px'
      }
    },
    mounted() {
      //console.log('this.props',this)
    },
    methods: {
      goToContest(slug, isActive, isExpired) {
        if(isActive || isExpired) this.$router.push('/contest/' + slug);
      },
      prevSlider() {
        this.indexSlider--
      },
      nextSlider() {
        if (this.indexSlider < this.maxLength) {
          this.indexSlider++;
          if ((this.indexSlider % 7) === 0) {
            switch (this.type) {
              case 'user': {
                window.searchAllUser.dispatch('LOAD_NEXT_PAGE_USER');
              }
                break;
              case 'group': {
                window.searchAllGroup.dispatch('LOAD_NEXT_PAGE_GROUP');
              }
                break;
              case 'contest': {
                window.searchAllContest.dispatch('LOAD_NEXT_PAGE_CONTEST');
              }
                break;
            }
          }
        }
      }
    },
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  .sliderBody {
    position: relative;
    overflow: hidden;
    &-wrap {
      width: 100000%;
      transition-duration: 0.6s;
    }
    &-body {
      position: relative;
      float: left;
      display: block;
      background-color: #fff;
      margin-right: 5px;
      .border-radius(5px);

      &-head {
        background-color: #ccc;

        &.active {
          .bgc-grad();
        }
      }
    }
    i.icon-left-f, i.icon-right-f {
      position: absolute;
      text-align: center;
      color: rgba(0, 0, 0, 0.5);
      font-size: 24px;
      height: 100%;
      width: 50px;
      padding-top: 7%;
      background-color: rgba(255, 255, 255, 0.4);
      z-index: 9;
      transition: .3s;
      &:hover {
        cursor: pointer;
        color: rgba(0, 0, 0, 0.7);
        background-color: rgba(255, 255, 255, 0.6);
      }
    }
    i.icon-left-f {
      left: 0;
    }
    i.icon-right-f {
      right: 0;
    }
    .text-vertical-center {
      height: 48px;
    }

    .contest-coming-soon {
      border: 1px solid @red;
      color: @red;
      font-weight: 600;
      width: 60%;
      margin: 5px auto;
      padding-bottom: 3px;
      height: 35px;
      border-radius: 3px;
      .comming-text {
        font-size: 2.8vw;
      }
      .soon-text {
        font-size: 4.2vw;
      }
    }

    .sliderBody-body-head {
      text-align: center;
    }

    .contest-coming-soon_head {
      display: inline-block;
      margin: 5px 3px;
      padding: 1px 2px;
      height: auto;
      width: auto;
      text-align: center;
      font-weight: normal;
      border: none;
      font-size: 11px;
    }

    .comming-time {
      text-transform: uppercase;
    }
    .comming-name,
    .comming-time {
      .text-grad();
    }
  }
</style>
