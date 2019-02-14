<template>
  <div id="mainRaitingSettings">
    <div class="change-status">
      <!--<div class="change-status--header">
        {{$lang.settings.settings_raitingpage}}
      </div>-->
      <div class="settings-lenta">
        <div class="change-status--item">
          <div
            class="status-item--title"
            @click="chooseHome()">{{$lang.variables.typeOfFeed}}
          </div>
          <div
            class="choose-status"
            v-text="homePostCount"></div>
          <i class="icon-right-f"></i>
        </div>
        <div class="change-status--item">
          <div
            class="status-item--title"
            @click="chooseGender()">{{$lang.variables.gender}}
          </div>
          <div
            class="choose-status"
            v-text="gender"></div>
          <i class="icon-right-f"></i>
        </div>
      </div>

      <h3> {{$lang.variables.usersAge}} </h3>

      <div class="settings-age">
        <vue-slider
          v-model="value"
          v-bind="options"/>

      </div>

      <div class="location">
        <h3> {{$lang.variables.showPostByLocation}} </h3>

        <div class="location-item">
          <span>{{$lang.variables.location}}:</span>
          <input
            type="text"
            class="modal-location"
            v-model="location"
            @click="googleAutoComplete()"
            value=""
            :placeholder="$lang.variables.location"
            id="place"
            name="place"/>
          <input
            type="hidden"
            name="placeId"
            id="placeId"
            value=""/>
        </div>

      </div>

      <h3>{{$lang.variables.social_sphere}}</h3>
      <div class="settings-status">
        <div class="change-status--item">
          <div
            class="status-item--title"
            @click="changeFamily()">{{$lang.variables.familyStatus}}
          </div>
          <div
            class="choose-status"
            v-text="chooseFamily"></div>
          <i class="icon-right-f"></i>
        </div>
        <div class="change-status--item">
          <div
            class="status-item--title"
            @click="changeSocial()">{{$lang.variables.socialStatus}}
          </div>
          <div
            class="choose-status"
            v-text="chooseStatus.value"></div>
          <i class="icon-right-f"></i>
        </div>
        <div class="change-status--item">
          <div
            class="status-item--title"
            @click="changeActivity()">{{$lang.variables.fieldOfActivity}}
          </div>
          <div
            class="choose-status"
            v-text="chooseActivity.value"></div>
          <i class="icon-right-f"></i>
        </div>
      </div>

    </div>

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

    <modal
      name="chooseGender"
      width="100%"
      classes=" v--modal "
      height="100%"
      :scrollable="true">
      <div class="family-header">
        <i
          @click="hideGender()"
          class="icon-left-f closeFamily"></i>
        <h3>{{$lang.variables.choose_gender}} </h3>
      </div>
      <div class="family-block">
        <div
          class="family-item--text"
          @click="changeGender('')">
          <p class="family-item">
            <span>{{$lang.variables.all}}</span>
            <span v-if="gender===''"><i class="icon-check-f"></i></span>
          </p>
        </div>
        <div
          class="family-item--text"
          @click="changeGender('male')">
          <p class="family-item">
            <span>{{$lang.variables.male}}</span>
            <span v-if="gender==='male'"><i class="icon-check-f"></i></span>
          </p>
        </div>
        <div
          class="family-item--text"
          @click="changeGender('female')">
          <p class="family-item">
            <span>{{$lang.variables.female}}</span>
            <span v-if="gender==='female'"><i class="icon-check-f"></i></span>
          </p>
        </div>
      </div>
    </modal>
    <modal
      name="chooseHome"
      width="100%"
      classes=" v--modal "
      height="100%"
      :scrollable="true">
      <div class="family-header">
        <i
          @click="closeHome()"
          class="icon-left-f closeFamily"></i>
        <h3>{{$lang.variables.typeOfFeed}} </h3>
      </div>
      <div class="family-block">
        <div
          class="family-item--text"
          @click="changeMyHome('one')">
          <p class="family-item">
            <span>{{$lang.variables.showOnePost}}</span>
            <span v-if="homePostCount=='one'"><i class="icon-check-f"></i></span>
          </p>
        </div>
        <div
          class="family-item--text"
          @click="changeMyHome('four')">
          <p class="family-item">
            <span>{{$lang.variables.showTwo}}</span>
            <span v-if="homePostCount=='four'"><i class="icon-check-f"></i></span>
          </p>
        </div>
      </div>
    </modal>
    <div class="buttons-settings">
      <button @click="nullSend()">{{$lang.variables.removeFilter}}</button>
      <button @click="sendFilters()">{{$lang.variables.save}}</button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  import Vue from 'vue'
  import vueSlider from 'vue-slider-component';
  import changeActivity from 'ComponentsVue/modal/change-profile/changeActivity.vue'
  import changeStatus from 'ComponentsVue/modal/change-profile/changeStatus.vue'
  import FilterStatus from 'ComponentsVue/modal/filter/FilterStatus';
  import FilterActivity from 'ComponentsVue/modal/filter/FilterActivity';
  import FilterFamily from 'ComponentsVue/modal/filter/FilterFamily';

  Vue.component('in-change-status', changeStatus);
  Vue.component('in-change-activity', changeActivity);

  import { range } from "JsLib/range";

  Vue.component('vue-slider', vueSlider);
  export default {
    components: {
      FilterStatus,
      FilterActivity,
      FilterFamily
    },
    data(){
      return {
        activityArray: [],
        statusArray: [],
        chooseStatus: {id: '', value: ''},
        chooseActivity: {id: '', value: ''},
        chooseFamily: '',
        homePostCount: '',
        gender: '',
        location: '',
        geolocation: '',
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
        }
      }
    },
    mounted(){
      this.getRatingSettings();
    },
    methods: {
      getRatingSettings() {
        axios.get('v1/me/settings/get')
          .then(res =>{
            let data = res.data.user_filters.rating_posts_filter;
            console.log('data',data)
            if(!data.age){
              this.value = [data.age.from, data.age.to];
            }
            this.gender = !!data.gender ? data.gender : '';
            this.chooseFamily = !!data.family ? data.family : '';
            this.chooseActivity = !!data.field_of_activity ? data.field_of_activity : {id: '', value: ''};
            this.chooseStatus = !!data.social_status ? data.social_status : {id: '', value: ''};
            this.geolocation = !!data.location ? data.location.google_place_id : '';
            this.location = !!data.location ? data.location.location : '';
          })
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
      changeGender(status){
        this.gender = status;
      },
      chooseHome(){
        this.$modal.show('chooseHome');
      },
      closeHome(){
        this.$modal.hide('chooseHome');
      },
      chooseGender(){
        this.$modal.show('chooseGender');
      },
      hideGender(){
        this.$modal.hide('chooseGender');
      },
      changeMyHome(status){
        this.homePostCount = status;
      },
      googleAutoComplete(){
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
      sendFilters(){
        let data = new FormData();
        data.append('type', 'rating_posts');
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
        axios.get('v1/me/settings/filters/edit?type=rating_posts&value=' + finallyValue)
        .then(res =>{
          this.$notify({
            group: 'change-profile',
            duration: 5000,
            speed: 300
          })
        })
        .catch(err => console.log(err.response));
      },
      nullSend(){
        let value = {};
        let finallyValue = JSON.stringify(value);
        axios.get('v1/me/settings/filters/edit?type=rating_posts&value=' + finallyValue)
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
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/changeprofile.less';
  @import '~LessStyle/settings.less';

  .settings-age{
    width: 80%;
    margin: auto;
  }

  .vue-slider-component .vue-slider-dot{
    border-radius: 5px;
  }

  .v--modal-overlay{
    z-index: 1222;
  }
</style>
