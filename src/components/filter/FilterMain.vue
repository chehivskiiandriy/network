<template>
  <div id="filter-main">
    <transition name="fade">
      <div v-if="showFilters" class="filters-bg" @click="hideFilters"></div>
    </transition>
    <transition name="translateX">
      <div v-if="showFilters" class="close-filters" @click="hideFilters">
        <i class="icon-delete-f"></i>
      </div>
    </transition>
    <transition name="translateX" @after-enter="refreshSlider">
      <div v-if="showFilters" class="filters">
        <h3 class="filters-title">{{$lang.variables.mainRibbonType}}</h3>

        <p class="filters-title-item">{{$lang.variables.Show}}</p>
        <div class="gender-list gender-list-main">
          <span
            class="audience-item"
            :class="{'active-gender': newAudience === 'subscriptions'}"
            @click="newAudience='subscriptions'">{{$lang.variables.subscriptions}}</span>
          <span
            class="audience-item"
            :class="{'active-gender': newAudience === 'all'}"
            @click="newAudience='all'">{{$lang.variables.all}}</span>
        </div>

        <p class="filters-title-item">{{$lang.variables.gender}}</p>
        <div class="gender-list gender-list-main">
          <template v-if="gender==='male'">
              <span
                class="gender-item-change active-gender"
                @click="gender='male'">{{$lang.variables.male}}</span>
            <span
              class="gender-item-change"
              @click="gender='female'">{{$lang.variables.female}}</span>
            <span
              class="gender-item-change"
              @click="gender='all'">{{$lang.variables.all}}</span>
          </template>
          <template v-else-if="gender==='female'">
              <span
                class="gender-item-change"
                @click="gender='male'">{{$lang.variables.male}}</span>
            <span
              class="gender-item-change active-gender"
              @click="gender='female'">{{$lang.variables.female}}</span>
            <span
              class="gender-item-change"
              @click="gender='all'">{{$lang.variables.all}}</span>
          </template>
          <template v-else>
              <span
                class="gender-item-change"
                @click="gender='male'">{{$lang.variables.male}}</span>
            <span
              class="gender-item-change"
              @click="gender='female'">{{$lang.variables.female}}</span>
            <span
              class="gender-item-change active-gender"
              @click="gender='all'">{{$lang.variables.all}}</span>
          </template>
        </div>

        <p class="filters-title-item"> {{$lang.variables.usersAge}} </p>
        <div class="settings-age settings-age-main">
          <vue-slider
            ref="slider"
            v-model="value"
            v-bind="options"/>
        </div>

        <div>
          <p class="filters-title-item">{{$lang.variables.showPostByLocation}}</p>
          <input
            type="text"
            class="change-input"
            @click="googleAutoComplete()"
            v-model="location"
            value=""
            :placeholder="$lang.settings.location"
            id="place"
            name="place"/>
          <input
            type="hidden"
            name="placeId"
            id="placeId"
            value=""/>
        </div>

        <div class="settings-status settings-status-main">
          <div
            class="change-status--item"
            @click="changeFamily()">
            <div class="status-item--title">{{$lang.variables.familyStatus}}</div>
            <div
              class="choose-status"
              v-text="chooseFamily"></div>
            <i class="icon-right-f"></i>
          </div>
          <div
            class="change-status--item"
            @click="changeSocial()">
            <div class="status-item--title">{{$lang.variables.socialStatus}}</div>
            <div
              class="choose-status"
              v-text="chooseStatus.value"></div>
            <i class="icon-right-f"></i>
          </div>
          <div
            class="change-status--item"
            @click="changeActivity()">
            <div class="status-item--title">{{$lang.variables.fieldOfActivity}}</div>
            <div
              class="choose-status"
              v-text="chooseActivity.value"></div>
            <i class="icon-right-f"></i>
          </div>
        </div>

        <!--<div class="filter-button filter-who-watch">-->
        <!--Кто видит меня-->
        <!--</div>-->
        <div
          class="filter-button filter-reset"
          @click="nullSend">
          {{$lang.variables.removeFilter}}
        </div>
      </div>
    </transition>

    <filter-status
      @socialStatus="changeSocialStatus"
      :chooseStatus="chooseStatus"
      :statusArray="statusArray" />
    <filter-activity
      @activityStatus="changeActivityStatus"
      :chooseActivity="chooseActivity"
      :activityArray="activityArray" />
    <filter-family
      @familyStatus="changeFamilyStatus"
      :chooseFamily="chooseFamily" />
  </div>
</template>

<script>
  import axios from 'axios';
  import {mapActions, mapGetters, mapMutations} from 'vuex';

  import Vue from 'vue'
  import FilterStatus from 'ComponentsVue/modal/filter/FilterStatus';
  import FilterActivity from 'ComponentsVue/modal/filter/FilterActivity';
  import FilterFamily from 'ComponentsVue/modal/filter/FilterFamily';
  import vueSlider from 'vue-slider-component';

  import {
    AUDIENCE,
    CHANGE_AUDIENCE,
    CHANGE_IS_CHANGED_FILTERS,
    moduleName as mainPostsModule
  } from "Store/modules/mainPosts";

  import { range } from "JsLib/range";

  Vue.component('vue-slider', vueSlider);

  export default {
    name: "FilterMain",
    components: {
      FilterStatus,
      FilterActivity,
      FilterFamily
    },
    data() {
      return {
        currentFilters: {},
        activityArray: [],
        statusArray: [],
        value: [16, '50+'],
        options: {
          width: '100%',
          height: 10,
          dotSize: 20,
          min: 16,
          max: 100,
          data: [
            ...range(16, 49),
            '50+'
          ],
          interval: 1,
          speed: 0.5,
          disabled: false,
          show: true,
          tooltip: 'always',
          bgStyle: {
            'backgroundColor': '#fff',
            'boxShadow': 'inset 0.5px 0.5px 3px 1px rgba(0,0,0,.36)'
          },
          sliderStyle: [
            {
              'backgroundColor': '#fff'
            },
            {
              'backgroundColor': '#fff'
            }
          ],
          tooltipStyle: [
            {
              'backgroundColor': '#0cb4be',
              'borderColor': '#0cb4be'
            },
            {
              'backgroundColor': '#459192',
              'borderColor': '#459192'
            }
          ],
          processStyle: {
            'backgroundImage': '-webkit-linear-gradient(left, #72eff1, #459192)'
          }
        },
        showFilters: false,
        // changeLocation: '',
        chooseStatus: {id: '', value: ''},
        chooseActivity: {id: '', value: ''},
        chooseFamily: '',
        gender: 'all',
        location: '',
        geolocation: '',
        newAudience: ''
      }
    },
    computed: {
      ...mapGetters({
        audience: mainPostsModule + AUDIENCE
      })
    },
    watch: {
      audience(oldValue, newValue) {
        console.log(oldValue, newValue);
      }
    },
    mounted() {
      this.$root.$on('openMainFilters', () => {
        this.showFilters = true;
        this.getHomeSettings();
      });

     this.newAudience = this.audience;
    },
    methods: {
      ...mapActions({
        changeAudience: mainPostsModule + CHANGE_AUDIENCE
      }),
      ...mapMutations({
        changeIsChangedFilters: mainPostsModule + CHANGE_IS_CHANGED_FILTERS
      }),
      getHomeSettings(){
        axios.get('v1/me/settings/get')
          .then(res =>{
            this.currentFilters = res.data.user_filters.home_posts_filter;

            if(!!this.currentFilters) {
              if(!!this.currentFilters.age){
                this.value = [this.currentFilters.age.from, this.currentFilters.age.to];
              }
              this.gender = !!this.currentFilters.gender ? this.currentFilters.gender : 'all';
              this.chooseFamily = !!this.currentFilters.family ? this.currentFilters.family : '';
              this.chooseActivity = !!this.currentFilters.field_of_activity ? this.currentFilters.field_of_activity : {id: '', value: ''};
              this.chooseStatus = !!this.currentFilters.social_status ? this.currentFilters.social_status : {id: '', value: ''};
              this.geolocation = !!this.currentFilters.location ? this.currentFilters.location.google_place_id : '';
              this.location = !!this.currentFilters.location ? this.currentFilters.location.location : '';
            }
          })
      },
      refreshSlider: function () {
        this.$nextTick(() => this.$refs.slider.refresh())
      },
      checkIsChangedFilters() {
        return (this.currentFilters.age && (this.currentFilters.age.from !== this.value[0]))
          || (this.currentFilters.age && (parseInt(this.currentFilters.age.to) !== parseInt(this.value[1])))
          || (!this.currentFilters.age && (this.value[0] !== 16 || this.value[1] !== '50+'))
          || (this.currentFilters.gender && (this.currentFilters.gender !== this.gender))
          || (!this.currentFilters.gender && (this.gender !== 'all'))
          || (this.currentFilters.location && (this.currentFilters.location.google_place_id !== this.geolocation))
          || (!this.currentFilters.location && this.geolocation)
          || (this.currentFilters.field_of_activity && (this.currentFilters.field_of_activity.id !== this.chooseActivity.id))
          || (!this.currentFilters.field_of_activity && this.chooseActivity.id)
          || (this.currentFilters.social_status && (this.currentFilters.social_status.id !== this.chooseStatus.id))
          || (!this.currentFilters.social_status && this.chooseStatus.id)
          || (this.currentFilters.family && (this.currentFilters.family !== this.chooseFamily))
          || (!this.currentFilters.family && this.chooseFamily)
          || (this.audience !== this.newAudience);
      },
      sendFilters(){
        if(!this.currentFilters || this.checkIsChangedFilters()) {
          this.changeIsChangedFilters(true);

          if(this.audience !== this.newAudience) {
            this.changeAudience(this.newAudience);
          }

          let data = new FormData();
          data.append('type', 'home_posts');
          let value = {
            family: !!this.chooseFamily ? this.chooseFamily : null,
            gender: !!this.gender ? this.gender : null,
            location: !!this.geolocation ? this.geolocation : null,
            age: {to: this.value[1], from: this.value[0]},
            social_status: !!this.chooseStatus && this.chooseStatus.id !== ''  ? this.chooseStatus.id : null,
            field_of_activity: !!this.chooseActivity && this.chooseActivity.id !== '' ? this.chooseActivity.id : null
          };
          let finallyValue = JSON.stringify(value);
          data.append('value', finallyValue);
          axios.get('v1/me/settings/filters/edit?type=home_posts&value=' + finallyValue)
            .then(res =>{
              this.$emit('setFilters');
            })
            .catch(err => console.log(err.response));
        }
      },
      nullSend(){
        let value = {};
        let finallyValue = JSON.stringify(value);
        axios.get('v1/me/settings/filters/edit?type=home_posts&value=' + finallyValue)
          .then(res =>{
            this.value = [16, '50+'];
            this.chooseStatus = {id: '', value: ''};
            this.chooseActivity = {id: '', value: ''};
            this.chooseFamily = '';
            this.gender = '';
            this.location = '';
            this.geolocation = '';
          })
          .catch(err => console.log(err.response));
      },
      changeActivity(){
        this.$modal.show('changeActivityFilter');
        axios.get('v1/dict/activity-status/search?query=')
          .then(res =>{
            this.activityArray = res.data.data;
          })
          .catch(err => console.log(err.response));
      },
      changeSocial(){
        this.$modal.show('changeStatusFilter');
        axios.get('v1/dict/social-status/search?query=')
          .then(res =>{
            this.statusArray = res.data.data;
          })
          .catch(err => console.log(err.response));
      },
      changeFamily(){
        this.$modal.show('changeFamily');
      },
      hideFamily(){
        this.$modal.hide('changeFamily');
      },
      hideActivity(){
        this.$modal.hide('changeActivityFilter');
      },
      hideStatus(){
        this.$modal.hide('changeStatusFilter');
      },
      changeFamilyStatus(status){
        this.chooseFamily = status;
      },
      changeActivityStatus(status) {
        this.chooseActivity = status;
      },
      changeSocialStatus(status) {
        this.chooseStatus = status;
      },
      googleAutoComplete() {
        let place = document.getElementById('place');
        let placeId = document.getElementById('placeId');

        let autocomplete = new google.maps.places.Autocomplete(place);
        autocomplete.addListener('place_changed', () => {
          let place = autocomplete.getPlace();
          placeId.value = place.place_id;
          this.location = place.formatted_address;
          this.geolocation = place.place_id;
          this.$modal.hide('location');
        });
      },
      hideFilters() {
        this.sendFilters();
        this.showFilters = false;
        document.getElementsByTagName('html')[0].style.overflow = 'auto';
      },
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/changeprofile.less';
  @import '~LessStyle/animation.less';
  @import '~LessStyle/filter.less';
</style>
