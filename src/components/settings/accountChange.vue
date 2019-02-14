<template>
  <modal name="accountChange"
         width="100%"
         classes=" v--modal "
         height="100%"
         :scrollable="true">
    <div class="account-change">
      {{$lang.variables.account}}
      <i @click="hideAccount()" class="icon-left-f"></i>
    </div>
    <div class="account-contacts">
      <p>{{$lang.variables.phone}}</p>

      <div class="account-phone">
        <div class="country-click" @click="showAllCountries()">
          <img :src="'https://media.inrating.top/images/country/'+phoneImg">
        </div>
        <div v-if="countryList" class="country-list">
          <p class="country-list--item" v-for="mask in allMask" @click="changeMask(mask.mask,mask.img)">
            <img :src="'https://media.inrating.top/images/country/'+mask.img">
            <span v-text="mask.info"></span>
          </p>
        </div>
        <in-masked-phone-input v-model="mobile" disabled="disabled" class="registration-input registration-phone" id="telua"
                      ref="phoneInput" :country="mobileCountry"/>
      </div>
      <!--<button @click="saveNewTelephone">
        Сохранить
      </button>-->
    </div>
    <div class="settings-lenta">
      <div class="change-status--item">
        <div class="status-item--title" @click="changePassword()">{{$lang.variables.changePassword}}</div>
        <div class="choose-status"></div>
        <i class="icon-right-f"></i>
      </div>
      <div class="change-status--item">
        <div class="status-item--title">{{$lang.variables.likesHistory}}</div>
        <div class="choose-status"></div>
        <i class="icon-right-f"></i>
      </div>
      <div class="change-status--item">
        <div class="status-item--title">{{$lang.variables.blackList}}</div>
        <div class="choose-status"></div>
        <i class="icon-right-f"></i>
      </div>
      <div class="change-status--item">
        <div class="status-item--title">{{$lang.variables.temporarilyCloseAccount}}</div>
        <div class="choose-status"></div>
        <i class="icon-right-f"></i>
      </div>
    </div>
    <in-changepassword></in-changepassword>
  </modal>
</template>

<script>
  import Vue from 'vue'
  import changePassword from 'ComponentsVue/settings/passwordChange.vue'

  Vue.component('in-changepassword', changePassword)
  export default {
    data() {
      return {
        allMask: [
          {img: 'united-states.png', alt: 'United States of America', mask: 'usa', info: 'USA +1'},
          {img: '243-canada.png', alt: 'Canada', mask: 'canada', info: 'Canada +1'},
          {img: '170-greece.png', alt: 'Greece', mask: 'greece', info: 'Greece +30'},
          {img: '195-france.png', alt: 'France', mask: 'france', info: 'France +33'},
          {img: '128-spain.png', alt: 'Spain', mask: 'spain', info: 'Spain +34'},
          {img: '115-hungary.png', alt: 'Hungary', mask: 'hungary', info: 'Hungary +36'},
          {img: '064-lithuania.png', alt: 'Lithuania', mask: 'lithuania', info: 'Lithuania +370'},
          {img: '008-estonia.png', alt: 'Estonia', mask: 'estonia', info: 'Estonia +372'},
          {img: '212-moldova.png', alt: 'Moldova', mask: 'moldova', info: 'Moldova +373'},
          {img: '135-belarus.png', alt: 'Belarus', mask: 'estonia', info: 'Belarus +375'},
          {img: '145-ukraine.png', alt: 'Украина', mask: 'ua', info: 'Украина +380'},
          {img: '013-italy.png', alt: 'Italia', mask: 'italia', info: 'Italia +39'},
          {img: '149-czech-republic.png', alt: 'Chech Republic', mask: 'chech', info: 'Chech Republic +420'},
          {img: '211-poland.png', alt: 'Poland', mask: 'poland', info: 'Poland +48'},
          {img: '162-germany.png', alt: 'Germany', mask: 'germany', info: 'Germany +49'},
          {img: '234-australia.png', alt: 'Australia', mask: 'australia', info: 'Australia +61'},
          {img: '248-russia.png', alt: 'Россия', mask: 'ru', info: 'Россия +7'},
          {img: '218-turkey.png', alt: 'Turkey', mask: 'turkey', info: 'Turkey +90'},
          {
            img: '151-united-arab-emirates.png',
            alt: 'United Arab Emirates',
            mask: 'arab',
            info: 'United Arab Emirates +971'
          },
          {img: '256-georgia.png', alt: 'Georgia', mask: 'georgia', info: 'Georgia +995'},
        ],
        phoneImg: 'small/ukraine.png',
        showPhoneAccept: false,
        mobileCountry: 'ua',
        countryList: false,
        showMsg: false,
        mobile: JSON.parse(localStorage.getItem('user')).phone.replace('+38',''),
      }
    },
    methods: {
      hideAccount() {
        this.$modal.hide('accountChange');
      },
      changePassword() {
        this.$modal.show('changePassword')
      },
      showAllCountries() {
        this.countryList = !this.countryList;
      },
      changeMask(_mask, _img) {
        this.phoneSeen = false;
        this.phoneImg = _img;
        this.mobileCountry = _mask;
        this.countryList = false;
      },
      saveNewTelephone() {

      }
    }
  }
</script>

<style>
  .account-change {
    background: #0cb4be;
    text-align: center;
    position: relative;
    padding: 5px 0;
    color: #fff;
    font-weight: 600;
    font-size: 22px;
    line-height: 30px;
    max-height: 40px;
    box-sizing: border-box;
  }

  .account-change > .icon-left-f {
    position: absolute;
    left: 10px;
    top: 10px;
    color: #fff;
  }

  .account-phone {
    width: 66%;
    border-radius: 10px;
    border: 1px solid #5ac5c6;
    position: relative;
    box-sizing: border-box;
    display: flex;
  }

  .account-contacts {
    padding-left: 5%;
    padding-right: 5%;
    padding-top: 10px;
    margin-bottom: 10px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    border-top: 1px solid #d3d3d3;
  }

  .account-contacts p {
    width: 100%;
  }

  .country-list {
    z-index: 111;
  }
</style>
