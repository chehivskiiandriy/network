<template>
  <div class="register-modal">
    <in-bg-scroll-block :scroll="isScroll"/>

    <div class="registration">
      <div class="login-header">
        <h3 class="login-title"> {{$lang.variables.newUniqueSocialNetwork}} </h3>
        <img
          class="login-logo"
          src="https://media.inrating.top/storage/img/logo/Inrating_logo_white_tifany.png">
        <h2 class="form-title">{{$lang.variables.welcomeToTheWorld}}</h2>
      </div>
      <div class="reg-step1">
        <!--<div class="login-blur"></div>-->
        <div class="registration-header">
          <div v-if="showMsg">
            <in-download-normal-browser/>
          </div>
          <h3> {{$lang.variables.register}} </h3>
        </div>
        <div class="registration-body">
          <form ref="firstStep">
            <div :class="checkNameKey" class="registration-item">
              <div class="registration-item--header">
                <p>{{$lang.variables.enterTheFirstAndLastName}}:</p>
              </div>
              <div class="info-error">{{infoError.name}}</div>
              <input
                :disabled="validated == 1"
                autocomplete="on | off"
                v-model="name"
                class="registration-input"
                @blur="coinsEarn($event.target,'name',true)"
                name="nameLast"
                ref="name"
                type="text"
                :placeholder="$lang.variables.yourNameAndLastname"
                id="name"
                pattern="[^0-9]{3,255}">
            </div>
            <div :class="checkNicknameKey" class="registration-item">

              <div class="registration-item--header">
                <p> {{$lang.variables.nicknameMustContain}}: </p>
                <!--<p class="registration-coins">+100 INC <img class="registration-coins-img" src="http://storage.innet.club/img/default/R-coin.png" alt=""></p>-->
              </div>
              <div class="info-error">{{infoError.nickname}}</div>
              <input
                :disabled="validated == 1"
                autocomplete="on | off"
                class="registration-input"
                name="nickname"
                v-model="nickname"
                @blur="nicknameBlurHandler"
                @focus="nicknameFocusHandler"
                type="text"
                ref="nickname"
                :placeholder="$lang.variables.nickname"
                id="nickname"
                maxlength="16"
                pattern="[a-zA-Z0-9-]+">
            </div>
            <div class="registration-item">
              <div class="registration-item--header">
                <p> {{$lang.variables.yourMobilePhoneNumber}}:</p>
                <!--<p class="registration-coins">+200 INC <img class="registration-coins-img" src="http://storage.innet.club/img/default/R-coin.png" alt=""></p>-->
              </div>
              <div class="info-error">{{infoError.phone}}</div>
              <div :class="checkPhoneKey" class="mob">
                <div
                  class="country-click"
                  @click="showAllCountries">
                  <img :src="'https://media.inrating.top/images/country/'+phoneImg">
                </div>
                <div
                  v-if="countryList"
                  class="country-list">
                  <p
                    class="country-list--item"
                    v-for="mask in allMask"
                    @click="changeMask(mask.mask,mask.img)"
                  >
                    <img :src="'https://media.inrating.top/images/country/'+mask.img">
                    <span v-text="mask.info"></span>
                  </p>
                </div>
                <div class="info-error">{{infoError.phone}}</div>
                <in-masked-phone-input
                  v-model="mobile"
                  name="newtelephone"
                  class="registration-input registration-phone"
                  id="telua"
                  ref="phoneInput"
                  @focus.native="phoneFocusHandler"
                  @blur.native="phoneBlurHandler"
                  :country="mobileCountry"/>
              </div>
            </div>
            <div class="registration-item">
              <div class="registration-item--header">
                <p> {{$lang.variables.selectAvatar}}:</p>
                <!--<p class="registration-coins">+100 INC <img class="registration-coins-img" src="http://storage.innet.club/img/default/R-coin.png" alt=""></p>-->
              </div>
              <div class="info-error">{{infoError.img}}</div>
              <button
                type="button"
                v-show="isShow.chooseAvaButton"
                @click="chooseAvatarButton($event.target)">{{$lang.variables.addAvatar}}
              </button>
            </div>
            <div
              id="avatar-attention"
              v-show="isShow.avatarAttention"
              ref="avatarAttention"
            >
              <p class="avatar-title-block">{{$lang.variables.addAvatar}}</p>
              <span>&nbsp &nbsp {{$lang.variables.ruleAvatar1}}</span>
              <br>
              <span>&nbsp &nbsp {{$lang.variables.ruleAvatar2}}</span>
              <div
                class="accept-rules"
                @click="acceptRules()">
                <div class="checkbox-div">
                  <i class="accept-check icon-check-f" v-show="isShow.acceptCheck"></i>
                </div>
                {{$lang.variables.invalidRuleSocial}}
              </div>
              <p class="rule-link">
                <router-link to="/rule-page">{{$lang.variables.network_rules}}</router-link>
              </p>
            </div>
            <div
              v-show="isShow.regCrop"
              class="registration-item">
              <div v-show="showCropp" class="cropp">
                <div class="crop-container">
                  <croppa
                    v-model="myCroppa"
                    :width=imageSize
                    :height=imageSize
                    :quality="qualityImage"
                    :prevent-white-space="true"
                    :show-remove-button="false"
                    placeholder-color="#9e9e9e"
                    :placeholder-font-size="20"
                    :placeholder="placeholder"
                    :initial-image="avatarImage">
                    <in-spinner :loading="loadingAvatar" class="spinner-center"></in-spinner>
                  </croppa>
                  <img class="icon-cropper" src="https://media.inrating.top/storage/img/default/cropp-action.svg" alt="">
                </div>
                <label class="avatar-title">{{$lang.variables.chooseAvatar}}</label>
                <button
                  class="log-button"
                  type="button"
                  @click="removeFromCropp">{{$lang.variables.delete}}
                </button>
                <button
                  class="log-button"
                  type="button"
                  @click="addToCropp">{{$lang.variables.apply}}
                </button>
              </div>
              <img v-show="!showCropp"
                class='previewPhoto'
                @click="newAvatar()"
                :src="image"/>
            </div>
            <div></div>
            <div :class="checkPasswordKey" class="registration-item">
              <div class="registration-item--header">
                <p> {{$lang.variables.makeUpYourPassword}}: </p>
              </div>
              <div class="info-error">{{infoError.password}}</div>
              <input
                :disabled="validated === 1"
                autocomplete="on | off"
                name="oldpassword"
                class="registration-input"
                @blur="coinsEarn($event.target,'password',true)"
                type="password"
                ref="password"
                id="password"
                v-model="password"
                :placeholder="$lang.variables.password">
              <div
                @click="showPassFunc($event,'password')"
                class="registration-eye">
                <i class="icon-eye-close"></i>
              </div>
            </div>
            <div
              ref="passwordRepeat"
              :class="checkPasswordRepeatKey"
              class="registration-item"
            >
              <div class="registration-item--header">
                <p> {{$lang.variables.сonfirmPassword}}: </p>
              </div>
              <div class="info-error">{{infoError.passwordRepeat}}</div>
              <input
                :disabled="validated === 1"
                class="registration-input"
                type="password"
                @blur="coinsEarn($event.target,'passwordRepeat',true)"
                v-model="passwordRepeat"
                id="passwordRepeat"
                :placeholder="$lang.variables.сonfirmPassword">
              <div
                @click="showPassFunc($event,'passwordRepeat')"
                class="registration-eye">
                <i class="icon-eye-close"></i>
              </div>
            </div>
            <!--<p >{{$lang.registration.getMoney}} {{coinsSum}} INCoins</p>-->
            <p> {{$lang.variables.addMoreInfoAndGet60InCoins}} </p>
            <div class="registration-item">
              <button
                class="log-button"
                @click="sendRegistration">
                {{$lang.variables.register}}
              </button>
            </div>
          </form>
        </div>
        <modal
          name="infoForRegistration"
          width="90%"
          classes=" v--modal info-modal"
          height="auto"
        >
          <div class="info-space">
            <p>By continuing you agree to:</p>
            -<a
            class="click"
            @click="newPageInfo('https://m.inrating.top/rule-page')">InRating Rules
          </a>
            -<a
            class="click"
            @click="newPageInfo('https://m.inrating.top/public-offer-and-confidentiality')">InRating Privacy Policy
          </a>
            -<a
            class="click"
            @click="newPageInfo('https://media.inrating.top/docs/GDPR_ru.pdf')">transfer and processing of your data
          </a>
            submitted to us at the registration stage and during the use of InRating.
          </div>
          <div class="btn-space">
            <button
              class="btn btn-primary"
              @click="$modal.hide('infoForRegistration')">
              {{$lang.variables.continue}}
            </button>
          </div>
        </modal>
      </div>
      <div class="login-item">
        <button @click="$router.go(-1)">{{$lang.variables.back}}</button>
      </div>
      <div class="login-item">
        <button @click="guestCome">{{$lang.variables.guestLogin}}</button>
      </div>
      <in-loginfooter></in-loginfooter>
    </div>
    <in-spinner-bg :loading="isShow.loading || isRegistrationPassing"></in-spinner-bg>

  </div>
</template>

<script>
  import api from 'utils/api';
  import apiDrotr from 'utils/apiDrotr';

  import axios from 'axios';
  import Vue from 'vue';
  import { mapActions, mapGetters } from 'vuex';
  import downloadBrowser from 'ComponentsVue/DownloadNormalBrowser'
  import imageHelper from 'JsLib/imageHelper'
  import loginFooter from 'ComponentsVue/login/loginFooter'
  import BgScrollBlock from 'ComponentsVue/login/BgScrollBlock';
  import setAuthorizationHeader from 'utils/setAuthorizationHeader';
  import {FETCH_CURRENT_USER, moduleName as userModule} from "Store/modules/authUser/user";

  import {
    REGISTER,
    IS_LIMIT_EXCEEDED,
    REGISTRATION_ERROR,
    IS_REGISTRATION_PASSING,
    moduleName as registrationModule
  } from 'Store/modules/registration';

  import {
    AUTHENTICATE,
    ACCESS_TOKEN,
    AUTHENTICATION_ERROR,
    IS_AUTHENTICATION_PASSING,
    moduleName as authenticationModule
  } from 'Store/modules/authentication';

  Vue.component('in-download-normal-browser', downloadBrowser);
  Vue.component('in-loginfooter',loginFooter);
  export default {
    name: 'registrationModal',
    components: {
      inBgScrollBlock: BgScrollBlock,
    },
    data() {
      return {
        inputFlags: {
          name: false,
          nickname: false,
          phone: false,
          password: false,
          passwordRepeat: false,
        },
        isShow: {
          loading: false,
          chooseAvaButton: true,
          avatarAttention: false,
          regCrop: false,
          acceptCheck: false,
        },

        mobile: '',
        image: '',
        name: '',
        nickname: '',
        password: '',
        passwordRepeat: '',
        //showPasswordRepeat: true, // not in use ?
        myCroppa: {},
        validated: 0,
        imageSize: 0,
        qualityImage: 4,
        avatarImage: '',
        countdown: '00:05:00',
        showPass: false,
        showCropp: false,
        coinsCount: 0,
        params: {},
        fileUpload: {},
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
          {img: '145-ukraine.png', alt: 'Ukraine', mask: 'ua', info: 'Ukraine +380'},
          {img: '013-italy.png', alt: 'Italia', mask: 'italia', info: 'Italia +39'},
          {img: '149-czech-republic.png', alt: 'Chech Republic', mask: 'chech', info: 'Chech Republic +420'},
          {img: '211-poland.png', alt: 'Poland', mask: 'poland', info: 'Poland +48'},
          {img: '162-germany.png', alt: 'Germany', mask: 'germany', info: 'Germany +49'},
          {img: '234-australia.png', alt: 'Australia', mask: 'australia', info: 'Australia +61'},
          {img: '248-russia.png', alt: 'Россия', mask: 'ru', info: 'Россия +7'},
          {img: '218-turkey.png', alt: 'Turkey', mask: 'turkey', info: 'Turkey +90'},
          {img: '151-united-arab-emirates.png', alt: 'United Arab Emirates', mask: 'arab', info: 'United Arab Emirates +971'},
          {img: '256-georgia.png', alt: 'Georgia', mask: 'georgia', info: 'Georgia +995'},
          {img: '074-kazakhstan.png', alt: 'Kazakhstan', mask: 'kazakhstan', info: 'Kazakhstan +7'},
        ],
        phoneImg: 'small/ukraine.png',
        showPhoneAccept: false,
        mobileCountry: 'ua',
        countryList: false,
        showMsg: false,
        correctNickname: false,
        // error info under input
        infoError: {
          name: '',
          nickname: '',
          phone: '',
          img: '',
          password: '',
          passwordRepeat: '',
        },

        pattern: {
          name: /^[^-](([^0-9_.;`~!@#$%^&*()+"№:?=,|-])-?(\1))+[^-]$/,
          nameNegative: /(^-|[0-9_.;`~!@#$%^&*()+"№:?=,|]|-{2,}|-$)/,
          nickname: /^[a-zA-Z0-9_.]+$/,
          password: /^[^А-Яа-яґєҐЄІіЇї\s ]+$/,

        },

        //infoErrorName: '',
        infoErrorNickname: '',
        infoErrorPhone: '',
        infoErrorImg: '',
        infoErrorPassword: '',
        infoErrorPasswordRepeat: '',

        coinsName: 0,
        coinsNickname: 0,
        coinsPhone: 0,
        coinsAvatar: 0,
        phoneTouched: false,
        isScroll: false,
        isNicknameInputFocused: false,
        isPhoneInputFocused: false,
        isPhoneBusy: false,
      }
    },
    computed: {
      ...mapGetters({
        registrationError: registrationModule + REGISTRATION_ERROR,
        isLimitExceeded: registrationModule + IS_LIMIT_EXCEEDED,
        isRegistrationPassing: registrationModule + IS_REGISTRATION_PASSING,
        authenticationError: authenticationModule + AUTHENTICATION_ERROR,
        isAuthenticationPassing: authenticationModule + IS_AUTHENTICATION_PASSING,
        accessToken: authenticationModule + ACCESS_TOKEN,
      }),
      correctMobileNumber: function() {
        return this.mobile.replace(/[()-]/gi, '') || ''
      },
      isCorrectNickname: function () {
        return this.pattern.nickname.test(this.nickname);
      },
      isCorrectPassword: function () {
        return this.pattern.password.test(this.password);
      },
      isCorrectPasswordRepeat: function () {
        return this.pattern.password.test(this.passwordRepeat);
      },
      escapedCorrectNickname: function () {
        return this.nickname.replace(/[^a-zA-Z0-9_.]/gi, '') || '';
      },
      loadingAvatar() {
        return this.myCroppa && this.myCroppa.loading
      },
      placeholder() {
        return this.loadingAvatar ? '' : this.$lang.variables.avatar
      },
      coinsSum() {
        return this.coinsName + this.coinsNickname + this.coinsPhone + this.coinsAvatar
      },
      checkNameKey() {
        const regexName = /^[^-][^0-9_.;`~!@#$%^&*()+"№:?=,|]+[^-]$/;

        let nameArray = this.name.split(' ');
        if (nameArray[nameArray.length - 1] === '' && nameArray.length > 2) {
          let fixName = this.name;
          this.name=fixName.slice(0,-1);
          nameArray.pop();
        }

        let name = nameArray[0],
          surname = nameArray.length === 2 && nameArray[1];

        if (surname) {
          // check if name and surname match pattern
          console.log(nameArray);
          const name = nameArray[0], surname = nameArray[1];
          const isNameCorrect = !this.pattern.nameNegative.test(name) ,
            isSurnameCorrect = !this.pattern.nameNegative.test(surname),
            isFullNameCorrect = isNameCorrect && isSurnameCorrect;
          if (isFullNameCorrect) {
            this.coinsName = 10;
            return 'right-item';
          } else{
            this.coinsName = 0;
            this.infoError.name = this.$lang.variables.invalidSymbols;
            return 'error';
          }
        } else if (name.length > 0 && this.inputFlags.name === true) {
          this.coinsName = 0;
          this.infoError.name = this.$lang.variables.enterSurname;
          return 'error';
        }
      },

      checkNicknameKey() {
        if (this.nickname.length <= 16 && this.nickname.length >= 3 && this.isCorrectNickname) {
          if (this.correctNickname) {
            this.coinsNickname = 10;
            return 'right-item';
          } else if (!this.isNicknameInputFocused) {
            this.coinsNickname = 0;
            this.infoError.nickname = this.$lang.variables.nicknameBusy;
            return 'error'
          }
        } else if (!this.isNicknameInputFocused && this.isCorrectNickname === false && this.nickname.length > 0) {
          this.nickname = this.escapedCorrectNickname;
          this.infoError.nickname = this.$lang.variables.nicknameBusy;
          this.coinsNickname = 0;
          return 'error';
        } else if (!this.isNicknameInputFocused && this.nickname.length > 0 && this.inputFlags.nickname === true) {
          this.infoError.nickname = this.$lang.variables.lengthTextMin3;
          this.coinsNickname = 0;
          return 'error';
        }
      },
      checkPhoneKey() {
        this.checkCorrectPhone();
        if (this.inputFlags.phone) {
          if (this.correctPhone) {
            return 'right-mob-item'
          }
          else if(!this.isPhoneInputFocused) {
            this.infoError.phone = 'Номер занят';
            return 'error'
          }
        }
      },
      checkPasswordKey() {
        if (this.password.length >= 6 && this.isCorrectPassword) {
          return 'right-item';
        } else if(this.password.length < 6 && this.inputFlags.password === true){
          this.infoError.password = this.$lang.variables.passwordMin6Symbol;
          return 'error';
        } else if (this.password.length > 0 && this.inputFlags.password === true) {
          this.infoError.password = this.$lang.variables.invalidFormat;
          return 'error';
        }
      },
      checkPasswordRepeatKey() {
        if (this.password.length >= 6) {
          if (this.passwordRepeat === this.password && this.isCorrectPasswordRepeat) {
            return 'right-one-password right-item';
          } else if (this.passwordRepeat.length > 0 && this.inputFlags.passwordRepeat === true) {
            this.infoError.passwordRepeat = this.$lang.variables.passwordNotMatch;
            return 'right-one-password error';
          }
        } else {
          this.infoError.passwordRepeat = this.$lang.variables.invalidFormat;
          return 'error-one-password error';
        }
      },
    },
    mounted() {
      const listener = e => {
        if(this.countryList) {
          e.stopPropagation();
          this.countryList = !this.countryList;
        }
      };

      window.addEventListener('click', listener);
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('click', listener);
      });

      this.getBrowUser();
      let image = localStorage.getItem('clientWidth');
      this.imageSize = parseInt(image) * 0.75;
      this.qualityImage = Math.ceil(1080 / this.imageSize);
      document.querySelector('.registration-phone').addEventListener('blur', function (event) {
        let phoneLength = document.querySelector('.registration-phone').value.replace(/[()_-]/gi, '').length;
        this.phoneTouched = true;
        if (phoneLength > 3) {
          this.coinsCount += 10;
        }
        else {
          this.coinsCount -= 10;
        }
      }, true);
    },
    methods: {
      ...mapActions({
        fetchCurrentUser: userModule + FETCH_CURRENT_USER,
        register: registrationModule + REGISTER,
        authenticate: authenticationModule + AUTHENTICATE,
      }),
      removeFromCropp() {
        this.coinsAvatar = 0;
        this.myCroppa.remove();
      },
      showNotAvailableModal() {
        this.$notify({
          group: 'app-not-available',
          duration: 4000,
          speed: 300
        })
      },
      setLang() {
        let e = document.getElementById('selectLang');
        let strUser = e.options[e.selectedIndex].value;
        this.$lang.setLang(strUser)
      },
      checkInput(input) {
        switch (input) {
          case 'name': {
            return this.checkNameKey;
          }
          case 'nickname': {
            return this.checkNicknameKey;
          }
          case 'password': {
            return this.checkPasswordKey;
          }
        }
      },
      checkCorrectNickname() {
        let dataCheckInfoOnRegister = new FormData();
        dataCheckInfoOnRegister.append('nickname', this.nickname);
        dataCheckInfoOnRegister.append('unique', true);
        axios.post('v1/check-credentials', dataCheckInfoOnRegister)
          .then(res => {
            if (!res.data.state) {
              this.$notify({
                group: 'nickname-reg',
                duration: 3000,
                speed: 300,
              });
              this.correctNickname = false;
            }
            else {
              this.correctNickname = true;
            }
          })
      },
      checkCorrectPhone() {
        let dataCheckInfoOnRegister = new FormData();
        //dataCheckInfoOnRegister.append('phone', this.mobile.replace(/[()-]/gi, ''));
        dataCheckInfoOnRegister.append('phone', this.correctMobileNumber);
        dataCheckInfoOnRegister.append('unique', true);
        axios.post('v1/check-credentials', dataCheckInfoOnRegister)
          .then(res => {
            if (!res.data.state) {
              this.coinsPhone = 0;
              this.correctPhone = false;
              this.isPhoneBusy = true;
              this.infoError.phone = this.$lang.variables.phoneBusy;
            }
            else {
              this.coinsPhone = 10;
              this.isPhoneBusy = false;
              this.correctPhone = true;
            }
          })
          .catch(e => {
            this.coinsPhone = 0;
          })
      },
      getBrowUser() {
        let ua = navigator.userAgent, tem,
          M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
          tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
          return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
          tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
          if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        let Brow = M.join(' ');
        switch (Brow.split(' ')[0]) {
          case 'IE':
            this.showMsg = true;
            break;
          default:
            this.showMsg = false;
        }
      },
      showPassFunc(e, password) {
        this.showPass = !this.showPass;
        if (this.showPass) {
          document.getElementById(password).type = 'text';
          e.target.classList.add('icon-eye');
          e.target.classList.remove('icon-eye-close');
        }
        else {
          document.getElementById(password).type = 'password';
          e.target.classList.remove('icon-eye');
          e.target.classList.add('icon-eye-close');
        }

      },
      checkPhone() {
        if(this.mobile.indexOf('_') !== -1) {
          this.$notify({
            group: 'phone-incorrect',
            duration: 3000,
            speed: 300,
          });

          return false;
        }

        return true;
      },
      checkInfoToRegister() {
        if(this.checkPhone()) {
          this.isShow.loading = true;
          //let nickname = this.nickname;
          let dataCheckInfoOnRegister = new FormData();
          dataCheckInfoOnRegister.append('nickname', this.nickname);
          //dataCheckInfoOnRegister.append('phone', this.mobile.replace(/[()-]/gi, ''));
          dataCheckInfoOnRegister.append('phone', this.correctMobileNumber);
          dataCheckInfoOnRegister.append('unique', true);
          axios.post('v1/check-credentials', dataCheckInfoOnRegister)
            .then(res => {
              if (res.data.state) {
                this.isShow.loading = false;
                if (this.sendSmsAgain === false) {
                  this.$modal.show('infoForRegistration');
                }

                this.sendRegistration();
              } else {
                this.isShow.loading = false;
                let errorArray = res.data.failed_fields;
                errorArray.map((error) => {
                  if (error === 'phone') {
                    this.$notify({
                      group: 'phone-reg',
                      duration: 3000,
                      speed: 300,
                    })
                  }
                  else if (error === 'nickname') {
                    this.$notify({
                      group: 'nickname-reg',
                      duration: 3000,
                      speed: 300,
                    })
                  }
                })
              }
            })
        }
      },
      coinsEarn(e,title,bool) {
        this.inputFlags[title]=bool;
        this.checkInput(title);
        if (e.value !== '') {
          this.coinsCount += 10;
        }
        else {
          this.coinsCount -= 10;
        }

      },
      nicknameFocusHandler() {
        this.isNicknameInputFocused = true;
        this.correctNickname = true;
      },
      nicknameBlurHandler({ target }) {
        this.checkCorrectNickname();
        this.isNicknameInputFocused = false;
        this.coinsEarn(target, 'nickname', true);
      },
      phoneFocusHandler() {
        this.isPhoneInputFocused = true;
        this.correctPhone = true;
      },
      phoneBlurHandler({ target }) {
        this.checkCorrectPhone();
        this.isPhoneInputFocused = false;
        this.coinsEarn(target, 'phone', true);
      },
      async sendRegistration() {
        this.sendForm();

        console.log(this.correctMobileNumber);
        let nameArray = this.$refs.name.value.split(' ');

        const validateName = !!(nameArray.length === 2 && !this.pattern.nameNegative.test(nameArray[0]) && !this.pattern.nameNegative.test(nameArray[1]) );
        const validatePass = !!( this.password.length >= 6 && (this.password === this.passwordRepeat) && this.isCorrectPassword );
        if (validateName && validatePass && this.isCorrectNickname && this.dataUrl && !this.isPhoneBusy) {

          const name = nameArray[0],
            lastName = nameArray[1];

          const response = await this.register({
            name,
            lastName,
            nickname: this.nickname,
            phone: this.correctMobileNumber,
            password: this.password,
            file: this.fileUpload,
          });
          if(this.registrationError) {
            this.notifyAboutSomethingWentWrongDuringRegistration();
          } else {
            this.successRegistrationHandler();
          }
        } else {
          this.notifyAboutNotValidData(validateName, validatePass);
        }
      },
      notifyAboutSomethingWentWrongDuringRegistration() {
        console.error(this.registrationError || this.authenticationError);
        /* FIXME: fix
         * probably replace alert with notification,
         * definitely replace hardcoded message with lang variable
         */
        let message = 'Произошла ошибка при регистрации.Попробуйте использовать' +
          'другой номер телефона или обратитесь в тех. поддержку 0800 50 36 99';
        if(this.isLimitExceeded) {
          message = this.$lang.variables.ipLimit;
        }
        alert(message);
        if(this.isLimitExceeded) {
          this.$router.push('/login');
        }
      },
      notifyAboutNotValidData(validateName, validatePass, validateNick) {
        if(this.isPhoneBusy) {
          this.$notify({
            group: 'phone-reg',
            duration: 3000,
            speed: 300,
          });
        } else if (!validateName) {
          this.$notify({
            group: 'send-name',
            duration: 3000,
            speed: 300,
          });
        } else if (!validatePass) {
          this.$notify({
            group: 'send-pass',
            duration: 3000,
            speed: 300,
          });
        } else if (!this.isCorrectNickname) {
          this.$notify({
            group: 'send-nickname',
            duration: 3000,
            speed: 300,
          });
        } else {
          this.$notify({
            group: 'send-avatar',
            duration: 3000,
            speed: 300,
          });
        }
      },
      successRegistrationHandler() {
        this.sendAuthentication();
      },
      async sendAuthentication() {
        await this.authenticate({
          username: this.nickname,
          password: this.password
        });
        const { accessToken, authenticationError } = this;
        if(!authenticationError) {
          this.$root.$emit('newBearer', accessToken);
          this.$router.push('/u/' + this.nickname);
        } else {
          this.notifyAboutSomethingWentWrongDuringRegistration();
        }
      },
      sendRegistrationOld() {
        this.sendForm();

        let nameArray = this.$refs.name.value.split(' ');
        const regexName = /^[^0-9_.;`~!@#$%^&*()+"№:?=,|]+$/;
        const regexNick = /^[a-zA-Z0-9_.]+$/;
        const regexPass = /^[^ ]+$/;

        const validateName = !!(nameArray.length === 2 && this.pattern.name.test(nameArray[0]) && this.pattern.name.test(nameArray[1]) );
        const validatePass = !!( this.password.length >= 6 && (this.password === this.passwordRepeat) && this.isCorrectPassword );
        if (validateName && validatePass && this.isCorrectNickname && this.dataUrl) {

          this.params = new FormData();
          this.params.append('name', nameArray[0]);
          this.params.append('lastname', nameArray[1]);
          this.params.append('nickname', this.nickname);
          //this.params.append('phone', this.mobile.replace(/[()-]/gi, ''));
          this.params.append('phone', this.correctMobileNumber);
          this.params.append('password', this.password);
          this.params.append('file', this.fileUpload);
          let data = {
            //'phone': this.mobile.replace(/[()-]/gi, ''),
            'phone': this.correctMobileNumber,
          };
          let config = {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'text/html',
            }
          };

          apiDrotr.regPhone(data, config)
            .then(
              res => {
                this.showPhoneAccept = true;
                this.validated = 1;
                this.timeStart();
                //this.$modal.show('phoneAccept');
                document.querySelector('.registration-phone').disabled = true;
                // document.querySelector('.confirm-phone').focus;

              }
            )
            .catch(err => {

              if (err.response.data.status === 'error') {
                this.$notify({
                  group: 'wrong-phone',
                  duration: 3000,
                  speed: 300,
                })
              }
              if (err.response.status === 409) {
                this.showPhoneAccept = true;
                this.validated = 1;
                document.querySelector('.registration-phone').disabled = true;
                this.timeStart();
              }
            })
        }
        else {

          if (validateName === false) {
            this.$notify({
              group: 'send-name',
              duration: 3000,
              speed: 300,
            });
          }
          else if (validatePass === false) {

            this.$notify({
              group: 'send-pass',
              duration: 3000,
              speed: 300,
            });
          }
          else if (validateNick === false) {
            this.$notify({
              group: 'send-nickname',
              duration: 3000,
              speed: 300,
            });
          }
          else {
            this.$notify({
              group: 'send-avatar',
              duration: 3000,
              speed: 300,
            });
          }
        }
      },
      timeStart() {
        let time = (300 * 1000);
        if (time > 0) {
          this.$timeBack(Math.floor(time / 1000), (res) => {
            if(res === '0:00:00') {
              this.endTimer = true;
              this.showPhoneAccept = false;
              this.sendSmsAgain = false;
              return this.countdown = '00:00:00'
            }
            if((this.endTimer === false && this.sendSmsAgain === false) || (this.sendSmsAgain === true))
              return this.countdown = res;

          });
        } else {
          return this.countdown = '00:00:00'
        }
      },
      confirmPhone() {
        this.isShow.loading = true;
        let finalCode = this.code1 + this.code2 + this.code3 + this.code4;
        let data = {
          os: 'android',
          vsn: '0.0.0',
          //phone: this.mobile.replace(/[()-]/gi, ''),
          phone: this.correctMobileNumber,
          code: finalCode,
        };
        apiDrotr.confirmPhone(data)
          .then(res => {

            if (res.data.status = 'success') {
              this.params.append('token_type', res.data.token_type);
              this.params.append('access_token', res.data.access_token);
              this.params.append('refresh_token', res.data.refresh_token);

              axios.post('v1/register', this.params)
                .then(res => {
                  let requestTokenData = {
                    client_id: 2,
                    client_secret: '0123456789987654321',
                    grant_type: 'password',
                    username: this.nickname,
                    password: this.password
                  };
                  axios.post('oauth/token', requestTokenData)
                    .then(res => {
                      let $token = res.data.access_token;
                      localStorage.setItem('token', $token);
                      let config = {headers: {'Authorization': 'Bearer ' + res.data.access_token}};
                      this.$root.$emit('newBearer', res.data.access_token);
                      return axios.get('v1/me', config);
                    })
                    .then(res => {
                      this.isShow.loading = false;
                      let user = JSON.stringify(res.data);
                      localStorage.setItem('user', user);
                      this.$router.push('/u/' + res.data.nickname);
                      //window.location.href = '/u/' + res.data.nickname;
                    })
                    .catch(err => {
                      this.isShow.loading = false;
                      console.error(err);
                      alert('Произошла ошибка при регистрации. Попробуйте использовать другой номер телефона или обратитесь в тех. поддержку 0800 50 36 99')
                    });
                })
                .catch(err => {
                  this.isShow.loading = false;
                  console.error(err);
                  if (err.response.data.errorInfo.errorCode === 1001) {
                    alert(this.$lang.variables.ipLimit);
                    this.$router.push('/login');
                    //window.location.href = '/login';
                  } else {
                    alert('Произошла ошибка при регистрации. Попробуйте использовать другой номер телефона или обратитесь в тех. поддержку 0800 50 36 99')
                  }
                });
            }
            else {
              this.isShow.loading = false;
              this.$notify({
                group: 'wrong-phone-code',
                duration: 3000,
                speed: 300,
              });
            }
          })
          .catch(err => {
            this.isShow.loading = false;
            console.error(err);
            this.$notify({
              group: 'wrong-phone-code',
              duration: 3000,
              speed: 300,
            });
          })


      },
      sendForm() {
        let form = this.$refs.firstStep;
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          return false;
        })
      },
      showAllCountries(e) {
        e.stopPropagation();

        if (this.validated !== 1) {
          this.countryList = !this.countryList;
        }
      },
      changeMask(_mask, _img) {
        this.phoneSeen = false;
        this.phoneImg = _img;
        this.mobileCountry = _mask;
        this.countryList = false;
      },
      nextCell(e, _next) {
        if(e.keyCode !== 8){
          if(_next < 5){
            this.$refs['code' + _next].focus();
          }
        }
        else{
          //if ()

          switch(_next){
            /*
            case 2:{

            }
              break;
            */
            case 3:{
              if(this.code2.length === 0){
                this.$refs['code' + (_next - 2)].focus();
              }
            }
              break;
            case 4:{
              if(this.code3.length === 0){
                this.$refs['code' + (_next - 2)].focus();
              }
            }
              break;
            case 5:{
              if(this.code4.length === 0){
                this.$refs['code' + (_next - 2)].focus();
              }
            }
              break;
          }
        }
      },
      chooseAvatarButton() {
        this.isShow.avatarAttention = true;
        this.isShow.chooseAvaButton = false;
      },
      acceptRules() {
        this.isShow.acceptCheck = true;
        document.querySelector('.accept-check').style.display = 'block';
        setTimeout(() => {
          this.showCropp = true;
          document.querySelector('input[type=file]').click();
          this.isShow.avatarAttention = false;
          this.isShow.regCrop = true;
        }, 1000);
      },
      addToCropp() {
        this.dataUrl = this.myCroppa.generateDataUrl();
        let inputFile = document.querySelector('input ');
        if (this.dataUrl !== '') {
          this.image = this.dataUrl;
          this.fileUpload = imageHelper.formatPhoto(this.image);
          this.myCroppa.remove();
          this.coinsCount += 10;
          this.showCropp=false;
          this.coinsAvatar = 10;
        }
        else {
          this.$notify({
            group: 'send-avatar',
            duration: 3000,
            speed: 300,
          });
        }
      },
      newAvatar() {
        if (this.validated !== 1) {
          this.showCropp=true;
          this.image = '';
        }
      },
      newPageInfo(link) {
        window.open(link, '_blank');
      },
      onSuccess() {
        this.$router.push('/');
        window.location.reload();
      },
      onFail() {
        this.$router.push('/registration');
      },
      guestCome() {
        let user = JSON.parse(localStorage.getItem('user'));
        let userLang = localStorage.getItem('lang');
        if(!userLang) userLang = 'en';

        if (user == null || user.status !== 'guest') {
          let userLang = localStorage.getItem('lang');
          if(!userLang) userLang = 'en';
          axios.get('v1/guest/get?lang=' + userLang)
            .then(res =>{
                let requestTokenData = {
                  client_id: 2,
                  client_secret: '0123456789987654321',
                  grant_type: 'password',
                  username: res.data.nickname,
                  password: res.data.nickname,
                };
                axios.post('oauth/token', requestTokenData)
                  .then(res =>{
                    let token = res.data.access_token;
                    localStorage.setItem('token', token);

                    const payload = { onSuccess: this.onSuccess, onFail: this.onFail };

                    setAuthorizationHeader(token);
                    this.fetchCurrentUser(payload);
                  })
                  .catch(err =>{
                    }
                  );
              }
            )
            .catch(err => console.log(err));
        }
        else {
          this.$router.push('/');
        }
      },

    }
  }
</script>

<style lang="less">
  @import '~LessStyle/login.less';
  @import "~LessStyle/registration.less";

  .registration .v--modal-overlay {
    /*bottom: 0;*/
    top: 35%;
  }

  .crop-container {
    position: relative;
  }

  .icon-cropper {
    position: absolute;
    width: 8vw !important;
    bottom: 4vw;
    right: 4vw;
  }

  #avatar-attention {
    width: 90%;
    margin: auto;
    text-align: left;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #d3d3d3;
    border-radius: 10px;
    margin-bottom: 20px;
    background: @white;
    color: @dark_grey;
  }

  #avatar-attention p {
    text-align: center;
    margin: 10px 0px;
  }

  #avatar-attention span {
    font-size: 12px;
    margin-bottom: 10px;
  }

  .accept-rules {
    display: flex;
    align-items: center;
    width: 80%;
    margin: 10px auto;
    font-size: 14px;
    justify-content: center;
  }

  .checkbox-div {
    width: 20px;
    height: 20px;
    border: 2px solid @contest-list-text-color;
    border-radius: 4px;
    position: relative;
    margin-right: 10px;
  }

  .rule-link a {
    color: @red;
    font-size: 13px;
  }

  .avatar-title-block {
    font-size: 23px;
  }

  .accept-check {
    position: absolute;
    font-size: 20px;
    color: @contest-list-text-color;
  }

  .right-item {
    transition: 1s linear;
  }

  .error-item input {
    box-shadow: 0 0 10px #eb0323;
    border: 1px solid #b53b45;
  }

  .right-item input {

    box-shadow: 0 0 10px #79b9b9;
    border: 1px solid #4f7a7a;
  }

  .right-mob-item {
    box-shadow: 0 0 10px #79b9b9;
    border: 1px solid #4f7a7a;
  }

  .error-mob-item {
    box-shadow: 0 0 10px #eb0323;
    border: 1px solid #b53b45;
  }

  .mob {
    display: flex !important;
    width: 100% !important;
  }

  .info-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: #fff;
    /*text-align: center;*/
    color: #2c3e50;
    padding: 15px;
    width: 85vw !important;
    left: 0 !important;
  }

  .info-space {
    padding-bottom: 20px;
  }

  .info-space a {
    color: #2c3e50;
  }

  .info-space p {
    text-transform: uppercase;
  }

  .info-space-item {
    padding: 5px 0;
  }

  .btn-space button {
    font-size: 16px;
  }
</style>
