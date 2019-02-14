<template>
  <div>

    <div
      ref="rateCarousel"
      class="rate-carousel">

      <swiper
        ref="awesomeSwiperA"
        :options="swiperOptionA"
        @slideChange="onSetTranslate">

        <swiper-slide class="rate-carousel-item">
          <p class="carousel-title">{{$lang.rating.contests}}</p>
          <div
            class="rate-carousel-image "
            v-for="(contest,index) in contestArray">
            <router-link :to="'/contest/'+contest.slug">
              <div class="rate-container">

                <img
                  :src="contest.img.url_small">
                <!--v-bind:style="{height : clientWidth*0.15+'px'}"-->
                <div
                  class="carousel-index carousel-indexing-rate"
                  v-text="index+1"></div>
              </div>

              <p
                class="rate-carousel--nickname"
                v-html="contest.name"></p>
            </router-link>
          </div>
        </swiper-slide>

        <swiper-slide class="rate-carousel-item">
          <p class="carousel-title">{{$lang.rating.rating}} {{$lang.rating.day}}</p>
          <div
            class="rate-carousel-image "
            v-for="(user,index) in this.rateByDay">
            <router-link :to="'/u/'+user.nickname">
              <div class="rate-container">
                <img :src="user.avatar_image.url_small"/>
                <div
                  class="carousel-index carousel-indexing-rate"
                  v-text="index+1"></div>
              </div>
            </router-link>
            <p
              class="rate-carousel--nickname"
              v-text="user.nickname"></p>
          </div>
        </swiper-slide>

        <swiper-slide class="rate-carousel-item">
          <p class="carousel-title">{{$lang.rating.rating}} {{$lang.rating.week}}</p>
          <div
            class="rate-carousel-image "
            v-for="(user,index) in this.rateByWeek">
            <router-link :to="'/u/'+user.nickname">
              <div class="rate-container">
                <img :src="user.avatar_image.url_small"/>
                <div
                  class="carousel-index carousel-indexing-rate"
                  v-text="index+1"></div>
              </div>
            </router-link>
            <p
              class="rate-carousel--nickname"
              v-text="user.nickname"></p>

          </div>
        </swiper-slide>

        <swiper-slide class="rate-carousel-item">
          <p class="carousel-title">{{$lang.rating.rating}} {{$lang.rating.month}}</p>
          <div
            class="rate-carousel-image "
            v-for="(user,index) in this.rateByMonth">
            <router-link :to="'/u/'+user.nickname">
              <div class="rate-container">
                <img :src="user.avatar_image.url_small"/>
                <div
                  class="carousel-index carousel-indexing-rate"
                  v-text="index+1"></div>
              </div>
            </router-link>
            <p
              class="rate-carousel--nickname"
              v-text="user.nickname"></p>
          </div>
        </swiper-slide>

        <swiper-slide class="rate-carousel-item">
          <p class="carousel-title">{{$lang.rating.prizesOfTheMonth}} ({{dateMonth}} {{dateYear}})</p>
          <div
            class="rate-carousel-image "
            v-for="(prize,index) in this.contestPrizes">
            <div class="rate-container">
              <img :src="prize.image"/>
              <div
                class="carousel-index prizes-carousel-index-rate carousel-indexing-rate"
                v-text="index+1"></div>
            </div>
            <p class="rate-carousel--nickname">{{prize.name}}</p>

          </div>
        </swiper-slide>

        <swiper-slide class="rate-carousel-item">
          <p class="carousel-title">TOP InRating</p>
          <div
            class="rate-carousel-image"
            v-for="(user, index) in usersMonthSlider.users">
            <router-link :to="'/u/'+user.nickname">
              <div class="rate-container">
                <img :src="user.avatar_image.url_small"/>
                <div class="carousel-index prizes-carousel-index-rate">{{index+1}}</div>
              </div>
            </router-link>
            <p class="rate-carousel--nickname">{{user.nickname}}</p>
          </div>
        </swiper-slide>

        <div
          class="swiper-pagination rating-block-pagination"
          slot="pagination"></div>
      </swiper>
    </div>
    <div
      id="raitingPage"
      @scroll="handleScroll()"
      @click="showAll">

      <div
        v-if="ratingPostShow"
        :class="changeClasses"
        v-for="(post,index) in allposts"
        :data-id="post.id"
        ref="postratings"
        :key="post.id + Math.floor(Math.random())">
        <template v-if="allposts.length > 0">
          <div
            :id="post.id"
            v-show="countPostOnPage === '1'">
            <in-postrating
              :type="ratingTypeLang"
              :post='post'/>
          </div>
          <div
            v-show="countPostOnPage === '2'">
            <in-postsmall-rating
              :index="post.id"
              :post='post'/>
          </div>
        </template>
        <template v-else-if="!loading">
          <div class="find-none">{{$lang.variables.noResultsFoundForYourRequest}}</div>
          <button @click="openRatingFilters">{{$lang.variables.change}}</button>
        </template>
      </div>
      <div
        v-if="ratingShowContests"
        id="contest-container"
        class="contests-raiting">
        <div v-for="contest in allContestActive">
          <in-contest-item :contest="contest"/>
        </div>
        <div v-for="contest in contestSoon">
          <in-contest-itemsoon :contest="contest"/>
        </div>
        <div v-for="contest in allContestNotActive">
          <in-contest-item :contest="contest"/>
        </div>
      </div>
      <div
        v-if="ratingShowMonthPresent"
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
      <div v-if="ratingShowMonthUser">
        <div
          class="rating-month"
          v-for="(monthData,index) in usersMonth">
          <p
            class="rating-month-title"
            v-text="'ТОП 5 '+month[index]+' '+year[index]"></p>
          <div
            class="rating-month-item"
            v-for="(user, userIndex) in monthData.users">
            <router-link :to="'/u/'+user.nickname">
              <div class="rate-container-item">
                <img
                  class="rating-month-itemavatar"
                  :src="user.avatar_image.url_small"/>
                <div class="carousel-index prizes-carousel-index-rate">{{userIndex+1}}</div>
              </div>
            </router-link>
            <div class="rating-month-itemnickname">{{user.nickname}}</div>
          </div>
        </div>
      </div>


      <in-post-settings-rating :user="user"/>
    </div>
    <div v-if="loading" id="SpinnerOnloadImg">
      <img src="https://media.inrating.top/images/Spinner.svg"/>
    </div>

    <filter-rating @setFilters="loadPosts"/>
  </div>
</template>

<script>
  import axios from 'axios';

  import Vue from 'vue'
  import {mapGetters} from 'vuex';

  import { writeTextToClipboard } from 'JsLib/clipboard';

  import ratingPost from './raiting/ratingPost'
  import postSmallRating from './main/postSmallRaiting.vue'
  import postSettingsRating from 'ComponentsVue/main/postsettings/postSettingsRating.vue'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import {scrollOnBottom} from "../mixins/scrollOnBottom";
  import FilterRating from 'ComponentsVue/filter/FilterRating';
  import {moduleName as countPostOnPageModule, RATING_POST_COUNT} from "Store/modules/countPostOnPage";

  // require styles
  //import 'node_modules/swiper/'
  Vue.component('swiper', swiper);
  Vue.component('swiperSlide', swiperSlide);
  Vue.component('in-postrating', ratingPost);
  Vue.component('in-post-settings-rating', postSettingsRating);
  Vue.component('in-postsmall-rating', postSmallRating);
  export default {
    name: 'mainPage',
    props: ['changeView'],
    mixins: [scrollOnBottom],
    components: {
      FilterRating
    },
    data() {
      return {
        user: {},
        allposts: [],
        loading: false,
        lastPage: 1,
        nextPage: 2,
        dateYear: '',
        dateMonth: '',
        shareID: '',
        postAuthor: {},
        postOutCount: '',
        rateByDay: [],
        rateByWeek: [],
        rateByMonth: [],
        contestPrizes: [],
        clientWidth: '',
        scrollPosition: 0,
        contestArray: [],
        allcontest: [],
        allContestActive:[],
        allContestNotActive:[],
        contestSoon:[],
        ratingType: 'day',
        ratingTypeLang: this.$lang.rating.day,
        ratingPostShow: true,
        openSettings:false,
        ratingShowContests: false,
        ratingShowMonthPresent: false,
        ratingShowMonthUser: false,
        usersMonthSlider: [],
        usersMonth: [],
        month: [],
        year: [],
        swiperOptionA: {
          pagination: {
            el: '.swiper-pagination'
          },
        },
      }
    }, //это своеродный конструктор для базовых переменных.
    watch: {
      bottom(bottom) {
        if (bottom && this.lastPage >= this.nextPage && !this.loading) {
          this.addPost()
        }
      },
      countPostOnPage(count, lastCount) {
        const header = document.querySelector('#header'),
          headerHeight = header.clientHeight,
          postRatingContainers = this.$refs.postratings,
          indexOfPostRatingWithVisibleTop = postRatingContainers.findIndex(postRatingContainer => postRatingContainer.offsetTop > window.scrollY),
          postRatingWithVisibleTop = postRatingContainers[indexOfPostRatingWithVisibleTop],
          postRatingBeforeTheOneWithVisibleTop = (indexOfPostRatingWithVisibleTop - 1 >= 0) && postRatingContainers[indexOfPostRatingWithVisibleTop - 1],
          anchoragePostRating = (postRatingWithVisibleTop.offsetTop - window.scrollY) <= (window.innerHeight / 2)
            ? postRatingWithVisibleTop
            : (postRatingBeforeTheOneWithVisibleTop || postRatingWithVisibleTop);
        this.$nextTick(() => {
          anchoragePostRating.scrollIntoView(true);
          window.scrollTo(window.scrollX, window.scrollY - (header.clientHeight + 10))
        });
      },
    },
    computed: {
      ...mapGetters({
        countPostOnPage: countPostOnPageModule + RATING_POST_COUNT
      }),
      changeClasses() {
        if (this.countPostOnPage === '1')
          return 'posts-container';
        else
          return 'postssmall-container';
      },
      swiperA() {
        return this.$refs.awesomeSwiperA.swiper
      },
    },
    mounted() {
      // new Audio(window.media.scrollRating);

      this.$refs.awesomeSwiperA.swiper.slideTo(1, 0, true);

      this.loadPosts();

      this.clientWidth = localStorage.getItem('clientWidth');

      this.postOutCount = 1;
      localStorage.setItem('postOutCount', this.postOutCount);

      this.user = JSON.parse(localStorage.getItem('user'));

      this.$root.$on('shareID', (event) => {
        this.changeShareId(event);
      });
      this.$root.$on('postAuthor', (event) => {
        this.checkAuthor(event);
      });
      axios.get('v1/users/rating?type=day')
        .then(res => {
          this.rateByDay = res.data.data.splice(0, 5);
        });
      axios.get('v1/users/rating?type=week')
        .then(res => {
          this.rateByWeek = res.data.data.splice(0, 5);
        });
      axios.get('v1/users/rating?type=month')
        .then(res => {
          this.rateByMonth = res.data.data.splice(0, 5);
        });
      axios.get('v1/contests/prizes/all')
        .then(res => {
          this.contestPrizes = res.data.data;
        })
      axios.get('v1/contests/all/?type=all&limit=5')
        .then(res => {
          this.contestArray = res.data.data.slice(0, 5);
        });
      axios.get('v1/rating-history/all')
        .then(
          res => {
            this.usersMonthSlider = res.data.data[0];
            this.usersMonth = res.data.data;
            this.month = this.usersMonth.map((dataMonth) => {
              let month = dataMonth.date.split('-');
              switch (month[1]) {
                case '01' :
                  return this.$lang.date.January;
                case '02' :
                  return this.$lang.date.February;
                case '03' :
                  return this.$lang.date.March;
                case '04' :
                  return this.$lang.date.April;
                case '05' :
                  return this.$lang.date.May;
                case '06' :
                  return this.$lang.date.June;
                case '07' :
                  return this.$lang.date.July;
                case '08' :
                  return this.$lang.date.August;
                case '09' :
                  return this.$lang.date.September;
                case '10' :
                  return this.$lang.date.October;
                case '11' :
                  return this.$lang.date.November;
                case '12' :
                  return this.$lang.date.December;
              }

            });
            this.year = this.usersMonth.map((dataMonth) => {
              let year = dataMonth.date.split('-');
              return year[0];
            });
            let date = new Date();
            this.dateYear = date.getFullYear();
            switch (date.getMonth()) {
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

          }
        )
      //localStorage.setItem('postOutCount',this.postOutCount);
    },
    created() {
      window.addEventListener('scroll', this.handleScroll);
    },
    methods: {
      openRatingFilters() {
        this.$root.$emit('openRatingFilters');
        document.getElementsByTagName('html')[0].style.overflow = 'hidden';
      },
      loadPosts() {
        this.loading = true;
        this.allposts = [];
        this.lastPage = 1;
        this.nextPage = 2;
        axios.get('v1/users/posts/rating/new')
          .then(res => {
            this.loading = false;
            this.allposts = res.data.data;
            this.lastPage = res.data.meta.last_page;
            this.bottom = false;
          });
      },
      showAll() {
      },
      onSetTranslate() {
        let activeIndex = this.$refs.awesomeSwiperA.swiper.activeIndex;
        switch (activeIndex) {
          case  0 :
            this.ratingPostShow = false;
            this.ratingShowContests = true;
            this.ratingShowMonthPresent = false;
            this.ratingShowMonthUser = false;
            this.showContests();

            break;
          case  1 :
            this.slideChangeContent('day');
            this.ratingType = 'day';
            this.ratingShowContests = true;
            this.ratingShowMonthPresent = false;
            this.ratingShowMonthUser = false;
            this.ratingTypeLang = this.$lang.rating.day;
            this.ratingPostShow = true;
            break;
          case  2 :
            this.slideChangeContent('week');
            this.ratingType = 'week';
            this.ratingShowContests = true;
            this.ratingShowMonthPresent = false;
            this.ratingShowMonthUser = false;
            this.ratingTypeLang = this.$lang.rating.week;
            this.ratingPostShow = true;
            break;
          case  3 :
            this.slideChangeContent('month');
            this.ratingType = 'month';
            this.ratingShowContests = true;
            this.ratingShowMonthPresent = false;
            this.ratingShowMonthUser = false;
            this.ratingTypeLang = this.$lang.rating.month;
            this.ratingPostShow = true;
            break;
          case  4 :
            this.ratingPostShow = false;
            this.ratingShowContests = false;
            this.ratingShowMonthPresent = true;
            this.ratingShowMonthUser = false;
            break;
          case  5 :
            this.ratingPostShow = false;
            this.ratingShowContests = false;
            this.ratingShowMonthPresent = false;
            this.ratingShowMonthUser = true;
            //this.userMonth();
            break;

        }

      },
      slideChangeContent(type) {
        this.lastPage = 1;
        this.nextPage = 2;
        axios.get('v1/users/posts/rating/new?type=' + type)
          .then(res => {
            this.allposts = res.data.data;
            this.lastPage = res.data.meta.last_page;
          })
      },
      // goToPostAnimation(i) {
      //   this.postOutCount = 1;
      //   localStorage.setItem('postOutCount', 1);
      //   setTimeout(function () {
      //     window.location = window.location.pathname + '#' + i;
      //   }, 1000);
      // },
      // changeViewPost(e) {
      //
      //   this.postOutCount = e;
      //   //localStorage.setItem('postOutCount', e);
      // },
      changeShareId(e) {
        this.shareID = e;
      },
      addPost() {
        this.loading = true;

        axios.get('v1/users/posts/rating/new?page=' + this.nextPage + '&type=' + this.ratingType)
          .then(res => {
            let api = res.data.data;
            let url = res.data.meta.current_page;
            this.allposts = this.allposts.concat(api);
            this.nextPage = url + 1;
            this.loading = false;
          })
      },
      showContests() {
        axios.get('v1/contests/all')
          .then(res => {
            this.allcontest = res.data.data;
          })
        axios.get('v1/contests/all?type=active')
          .then(res =>{
            this.allContestActive = res.data.data;
          });
        axios.get('v1/contests/all?type=old')
          .then(res =>{
            this.allContestNotActive = res.data.data;
          })
        axios.get('v1/contests/all?type=incoming')
          .then(res =>{
            this.contestSoon = res.data.data;
          })
      },
      closeShare() {
        this.$modal.hide('openShare');
      },
      checkAuthor(e) {
        this.postAuthor = e;
      },
      handleScroll() {
        let carouselBlock = this.$refs.awesomeSwiperA.$el.childNodes[1];
        let curentPosition = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
      },
      async copyLink(id) {
        let text = host + '/p/' + id;
        await writeTextToClipboard(text);
        this.$notify({
          group:'copy-link',
          duration:3000,
          speed: 300,
        });

      },
      showChats() {
        this.$modal.show('chatsModal');
      }
    },

    destroyed() {
      window.removeEventListener('scroll', this.handleScroll);
    },
    head: {
      title() {
        return {
          inner: this.$lang.variables.rating
        }
      },
    }
  }
</script>


<style lang="less">
  @import "~LessStyle/monthrating.less";
  @import '~LessStyle/sharemodal.less';
  @import '~LessStyle/ratecarousel.less';
  @import '~LessStyle/contest.less';
  @import '~LessStyle/variables.less';

  .rate-container-item {
    position: relative;
    height: 18vw;
  }

  .rating-month-itemnickname {
    margin-top: 4px;
  }

  .rate-carousel li {
    padding: 0 !important;
  }

  .swiper-pagination-bullet {
    border-radius: 2px;
    margin: 0 1px !important;
  }

  .swiper-pagination-bullet-active {
    background: linear-gradient(to left top, #000fbc, #30c2be 50%);
  }

  .rating-block-pagination {
    top: 0;
    left: 38% !important;
    width: 100%;
    height: 0;
  }

  .rate-carousel .swiper-container {
    background: #fff;
    transition: 2s linear;
  }

  .swiper-container {
    background: #fff;
    transition: 2s linear;
  }

  .contests-raiting {
    padding-top: 10px;
  }

  .prize-item {
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

  .prize-image {
    width: 18%;
    position: relative;
    margin-right: 10px;
  }

  .prize-image img {
    width: 100%;
    height: auto;
    box-shadow: 2px 2px 0 0 rgba(95, 92, 92, 0.2);
    border-radius: 5px;
  }

  .prize-index {
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

  .prize-body {
    font-weight: 600;
    .text-grad();
  }

  .prizes-carousel-index-rate {
    bottom: 2px;
    left: 2px;
  }

  /*#raitingPage .rate-opacity-small {*/
    /*top: 89%;*/

    /*@media (max-width: 320px) {*/
      /*top: 87%;*/
    /*}*/
  /*}*/

  #SpinnerOnloadImg {
    display: block;
    width: 35%;
    margin: auto;
  }
</style>
