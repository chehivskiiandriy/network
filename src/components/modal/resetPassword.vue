<template>
  <!--<modal-->
    <!--name="resetPassword"-->
    <!--width="100%"-->
    <!--classes=" v&#45;&#45;modal register-modal "-->
    <!--height="100%"-->
    <!--:scrollable="true">-->
  <div id="reset-password">
    <in-bg-scroll-block :scroll="false"/>

    <div class="reset-password">

      <div class="login-header">
        <i
          @click="hideReset()"
          class="icon-delete-f"></i>
        <img
          class="login-logo reset-password-logo"
          src="https://media.inrating.top/storage/img/logo/Inrating_logo_white_tifany.png">
      </div>
      <div class="login-body reset-body">
        <div class="reset-block">
          <p class="reset-title"> {{$lang.variables.passwordReset}} </p>
          <div v-if="!secondStep">
            <div class="choose-type-restore">
              <div
                @click="type='phone'"
                class="choose-restore-item"> {{$lang.variables.byPhone}} <p v-if="type === 'phone'"></p></div>
              <div
                @click="changeTypeReset"
                class="choose-restore-item"> {{$lang.variables.byEmail}} <p v-if="type === 'email'"></p></div>
            </div>
            <input
              v-if="type === 'email'"
              type="email"
              class="reset-email"
              ref="mailUpldate"
              placeholder="E-Mail"
              name="email"
              value="">
            <div
              v-if="type === 'phone'"
              class="forggot-country">
              <div
                class="country-click"
                @click="showAllCountries">
                <img :src="'https://media.inrating.top/images/country/'+phoneImg">
              </div>
              <div
                v-if="countryList"
                class="country-list-top">
                <p
                  class="country-list--item"
                  v-for="mask in allMask"
                  @click="changeMask(mask.mask,mask.img)">
                  <img :src="'https://media.inrating.top/images/country/'+mask.img">
                  <span v-text="mask.info"></span>
                </p>
              </div>
              <in-masked-phone-input
                v-model="mobile"
                class="registration-input registration-phone"
                id="telua"
                ref="phoneInput"
                :country="mobileCountry"
                @keyup.enter.native="showUpdatePassword"
                type="text"/>
            </div>
            <div class="login-item">
              <button @click="showUpdatePassword">{{$lang.variables.restore}}</button>
            </div>
            <div class="login-item">
              <button @click="hideReset">{{$lang.variables.back}}</button>
            </div>
          </div>
          <div v-else class="reset-pass">
            <p v-if="type === 'phone'">{{$lang.variables.codeFromMessage}} </p>
            <p v-else>{{$lang.variables.enterTheCode}} no-reply@drotr.com</p>
            <reset-password-timer :run.sync="runTimer"></reset-password-timer>
            <!--<div class="input-phone-block">-->
              <!--<input v-for="number in [1,2,3,4]"-->
                     <!--:key="number"-->
                <!--class="confirm-phone"-->
                <!--maxlength="1"-->
                <!--:ref="`confirmPhoneCode${number}`"-->
                <!--@keyup="nextCell($event.target)"-->
                <!--type="number">-->
            <!--</div>-->
            <confirmation-code-field
              class="input-phone-block"
              v-model="confirmationCode"
            ></confirmation-code-field>
            <!--<div class="info-error">{{infoErrorPassword}}</div>-->
            <!--<input-->
            <!--class="reset-pass-input"-->
            <!--type="password"-->
            <!--v-model="password"-->
            <!--ref="password"-->
            <!--id="password"-->
            <!--:placeholder="$lang.registration.password_new">-->
            <!--<div class="info-error">{{infoErrorPasswordRepeat}}</div>-->
            <!--<input-->
            <!--class="reset-pass-input"-->
            <!--type="password"-->
            <!--ref="passwordRepeat"-->
            <!--id="passwordRepeat"-->
            <!--:placeholder="$lang.registration.repeatNewPassword">-->
            <div :class="passwordFieldClasses">
              <div class="registration-item--header">
                <p> {{$lang.variables.makeUpYourPassword}}*: </p>
              </div>
              <div class="info-error">{{passwordErrorMessage}}</div>
              <input
                autocomplete="on | off"
                name="oldpassword"
                class="registration-input"
                type="password"
                ref="password"
                id="resetRassword"
                v-model="password"
                :placeholder="$lang.variables.newPassword">
              <div
                @click="showPassFunc($event,'resetRassword')"
                class="registration-eye">
                <i class="icon-eye-close"></i>
              </div>

              <!--<input class="registration-input" type="password" ref="passwordRepeat" id="passwordRepeat" :placeholder="$lang.registration.password_repeat">-->
            </div>
            <div
              ref="passwordRepeat"
              :class="passwordRepeatFieldClasses">
              <div class="registration-item--header">
                <p> {{$lang.variables.сonfirmPassword}}*: </p>
              </div>
              <div class="info-error">{{passwordRepeatErrorMessage}}</div>
              <input
                class="registration-input"
                type="password"
                v-model="passwordRepeat"
                id="resetPasswordRepeat"
                :placeholder="$lang.variables.сonfirmPassword">
              <div
                @click="showPassFunc($event,'resetPasswordRepeat')"
                class="registration-eye">
                <i class="icon-eye-close"></i>
              </div>
            </div>
            <button @click="restorePass">{{$lang.variables.confirm}}</button>
          </div>
          <div v-else>

          </div>
        </div>
        <!--<div class="login-blur"></div>-->
      </div>
      <in-loginfooter></in-loginfooter>
    </div>
    <!--<div class="bgc-grad"></div>-->
  </div>

  <!--</modal>-->
</template>

<script>
  import axios from 'axios';
  import apiDrotr from 'utils/apiDrotr';

  import BgScrollBlock from 'ComponentsVue/login/BgScrollBlock';
  import ConfirmationCodeField from 'ComponentsVue/fields/ConfirmationCodeField';
  import ResetPasswordTimer from 'ComponentsVue/ResetPasswordTimer';
  import loginFooter from 'ComponentsVue/login/loginFooter'

  export default {
    name: 'resetPassword',
    components: {
      inBgScrollBlock: BgScrollBlock,
      ResetPasswordTimer,
      ConfirmationCodeField,
      'in-loginfooter': loginFooter,
    },
    data() {
      return {
        password: '',
        passwordRepeat: '',
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
        mobileCountry: 'ua',
        countryList: false,
        type: 'phone',
        mobile: '',
        email: '',
        secondStep: false,
        showPass: false,
        infoErrorPassword: '',
        infoErrorPasswordRepeat: '',
        runTimer: false,
        confirmationCode: '',
      }
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
    },
    computed: {
      isPasswordEmpty() {
        return this.password === '';
      },
      isPasswordHasCorrectLength() {
        return this.checkPasswordLength(this.password)
      },
      isPasswordHasCorrectFormat() {
        return this.checkPasswordFormat(this.password)
      },
      passwordFieldClasses() {
        let classes = 'registration-item ';
        if(!this.isPasswordEmpty){
          classes += this.isPasswordHasCorrectLength && this.isPasswordHasCorrectFormat
            ? ' right-item'
            : ' error';
        }
        return classes;
      },
      passwordErrorMessage() {
        if(this.isPasswordHasCorrectLength && this.isPasswordHasCorrectFormat) {
          return '';
        } else if (!this.isPasswordHasCorrectLength) {
          return this.$lang.variables.passwordMin6Symbol;
        } else {
          return this.$lang.variables.passwordIncorrectSymbols || this.$lang.variables.invalidFormat;
        }
      },
      isPasswordRepeatEmpty() {
        return this.passwordRepeat === '';
      },
      isPasswordRepeatHasCorrectLength() {
        return this.checkPasswordLength(this.passwordRepeat)
      },
      isPasswordRepeatHasCorrectFormat() {
        return this.checkPasswordFormat(this.passwordRepeat)
      },
      isPasswordMatches() {
        return this.password === this.passwordRepeat;
      },
      passwordRepeatFieldSpecialClass() {
        return this.isPasswordHasCorrectLength && this.isPasswordHasCorrectFormat
          ? ' right-one-password'
          : ' error-one-password';
      },
      passwordRepeatFieldClasses() {
        let classes = `registration-item ${this.passwordRepeatFieldSpecialClass} `;
        if(!this.isPasswordRepeatEmpty){
          classes += this.isPasswordMatches && this.isPasswordRepeatHasCorrectFormat
            ? ' right-item'
            : ' error'
        }
        return classes;
      },
      passwordRepeatErrorMessage() {
        if(this.isPasswordHasCorrectLength && this.isPasswordHasCorrectFormat) {
          if(!this.isPasswordMatches || !this.isPasswordRepeatHasCorrectFormat) {
            return this.$lang.variables.passwordNotMatch;
          }
          return '';
        }
        return this.$lang.variables.invalidFormat;
      },
      // checkPasswordKey() {
      //   if (this.password == '') {
      //     return 'registration-item ';
      //   } else {
      //     let passwordPatt = /^[^А-Яа-яґєҐЄІіЇї\s ]+$/.test(this.password);
      //     if (this.password.length >= 6 && passwordPatt) {
      //       this.infoErrorPassword = '';
      //       return 'registration-item right-item';
      //     } else if (this.password.length < 6) {
      //       this.infoErrorPassword = this.$lang.variables.passwordMin6Symbol;
      //       return 'registration-item error';
      //     } else {
      //       this.infoErrorPassword = this.$lang.variables.invalidFormat;//'Некорректный формат';
      //       return 'registration-item error';
      //     }
      //   }
      // },
      // checkPasswordRepeatKey() {
      //   if (this.password.length >= 6) {
      //     let passwordPatt = /^[^А-Яа-яґєҐЄІіЇї\s ]+$/.test(this.passwordRepeat);
      //     if (this.passwordRepeat == '') {
      //       return 'registration-item ';
      //     } else {
      //       if (this.passwordRepeat == this.password && passwordPatt) {
      //         this.infoErrorPasswordRepeat = '';
      //         return 'registration-item right-one-password right-item';
      //       } else {
      //         this.infoErrorPasswordRepeat = 'Passwords do not match';
      //         return 'registration-item right-one-password error';
      //       }
      //     }
      //   } else {
      //     this.infoErrorPasswordRepeat = 'Некорректный формат';
      //     return 'registration-item error-one-password error';
      //   }
      // },
    },
    methods: {
      checkPasswordLength(password) {
        return password && password.length >= 6;
      },
      checkPasswordFormat(password) {
        return /^[^А-Яа-яґєҐЄІіЇї\s ]+$/.test(password);
      },
      hideReset() {
        this.password = '';
        this.passwordRepeat = '';
        this.mobile = '';
        this.secondStep = false;
        this.$modal.hide('resetPassword');
        this.$router.go(-1);
      },
      showUpdatePassword() {

        if (this.type == 'email') {
          this.email = this.$refs.mailUpldate.value;
          axios.post('v1/check-credentials?unique=0&email=' + this.email)
            .then(res => {
              if (res.data.state) {
                this.secondStep = true;
                this.startTimer();
                let data = {
                  email: this.email,
                };
                apiDrotr.regEmail(data)
                  .then(res => {
                  })
              }
              else {
                this.$notify({
                  group: 'wrong-email',
                  duration: 4000,
                  speed: 300
                })
              }
            })
        }
        else if (this.type == 'phone') {

          let params = {
            unique: false,
            phone: this.mobile.replace(/[()-]/gi, ''),
          };
          axios.post('v1/check-credentials', params)
            .then(res => {
              if (res.data.state) {
                this.secondStep = true;
                this.startTimer();
                //this.$modal.show('updatePassword');
                let data = {
                  phone: this.mobile.replace(/[()-]/gi, ''),
                };
                apiDrotr.regPhone(data)
                  .then(res => {

                  })
              }
              else {
                this.$notify({
                  group: 'wrong-phone',
                  duration: 4000,
                  speed: 300
                })
              }
            })
        }

        //this.$modal.show('updatePassword');
      },
      restorePass() {

        let password = this.password;
        let finalCode = this.confirmationCode;
        // let code1 = this.$refs.confirmPhoneCode1.value;
        // let code2 = this.$refs.confirmPhoneCode2.value;
        // let code3 = this.$refs.confirmPhoneCode3.value;
        // let code4 = this.$refs.confirmPhoneCode4.value;
        // let finalCode = code1 + code2 + code3 + code4;
        let paramsFinal = {};
        if (this.mobile != '') {
          paramsFinal = {
            code: finalCode,
            phone: this.mobile.replace(/[()-]/gi, ''),
            password: password,
          }
        }
        else {
          paramsFinal = {
            code: finalCode,
            email: this.email,
            password: password,
          }

        }

        if(finalCode.length !== 4) {
          this.$notify({
            group: 'wrong-phone-code',
            duration: 3000,
            speed: 300,
          })
        }

        if(this.infoErrorPassword === '' && this.infoErrorPasswordRepeat === '' && finalCode.length === 4) {
          axios.post('v1/restore-password', paramsFinal)
            .then(res => {
              this.$notify({
                group: 'change-pass',
                duration: 10000,
                speed: 300,
              });
              this.password = '';
              this.passwordRepeat = '';
              this.mobile = '';
              this.secondStep = false;
              // this.$modal.hide('resetPassword');
              this.$router.push('/login');
            }).catch(e =>
              this.$notify({
                group: 'wrong-phone-code',
                duration: 3000,
                speed: 300,
              })
          )
        }
      },
      showAllCountries(e) {
        e.stopPropagation();
        this.countryList = !this.countryList;
      },
      changeMask(_mask, _img) {
        this.phoneSeen = false;
        this.phoneImg = _img;
        this.mobileCountry = _mask;
        this.countryList = false;
      },
      nextCell(el) {
        let index = '';
        let children = el.parentNode.childNodes;
        for (let i = 0; i < children.length; i++) {
          if (children[i] == el) {
            index = i;
          }
        }
        if (index + 2 < children.length)
          children[index + 2].focus();
      },
      changeTypeReset() {
        this.mobile = '';
        this.type = 'email';
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
      startTimer() {
        this.$nextTick(function () {
          this.runTimer = true;
        });
      },
    },
  }
</script>

<style lang="less">
  @import '~LessStyle/login.less';

  #reset-password {
    /*background-image: url(https://media.inrating.top/storage/img/backgrounds/FON_M_NEW_2.png);*/
    /*background-size: cover;*/
    /*position: fixed;*/
    width: 100vw;
    height: 100vh;
    /*top: 0;*/
    /*bottom: 0;*/
    /*left: 0;*/
    /*right: 0;*/
  }

  .reset-password-logo {
    margin-top: 20px;
  }

  .reset-body {
    margin-top: 0;
  }

  .reset-password {
    z-index: 111;
    border-radius: 10px 10px 0 0;
    text-align: center;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    width: 85vw;
    /*animation: tr 0.5s ease-out forwards;*/
    animation: opa 1s ease-out forwards;
    posititon: relative;
    padding-top: 15px;
    padding-bottom: 40px;
    margin: 5vh auto 0 auto;
  }

  @keyframes opa {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes tr {
    from {
      transform: translate(-50%, 100vh);
    }
    to {
      transform: translate(-50%, 0);
    }
  }

  .login-header {
    opacity: 0;
    animation: trY 0.5s ease-out 1s forwards;
  }

  .login-body {
    opacity: 0;
    animation: trY 0.5s ease-out 1s forwards;
  }

  .reset-block {
    padding-bottom: 20px;
    background: transparent !important;
  }

  .choose-type-restore {
    display: flex;
    justify-content: space-around;
    margin: 25px 0 5px 0;
  }

  .reset-title {
    margin-top: 5px;
  }

  .choose-restore-item {
    width: 40%;
    text-align: center;
    color: #fff;
    padding-bottom: 5px;

  }

  .choose-restore-item > p {
    border-bottom: 1px solid #fff;
  }

  .country-list-top {
    position: absolute;
    width: 100%;
    height: 250px;
    bottom: 100%;
    box-sizing: border-box;
    background: #fff;
    padding: 5px;
    border-radius: 10px;
    overflow-y: auto;
    z-index: 100;
  }

  .country-list--item {
    display: flex;
    align-items: center;
    color: #000 !important;
    margin: 0 auto 5px auto;
  }
  .forggot-country {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin: 0 auto 20px auto;
    width: 80%;
  }

  .confirm-phone {
    width: 20%;
    display: block;
    text-align: center;
    padding: 5px;
    font-size: 27px;
    margin: 0 2px 10px 2px;
    border-radius: 6px;
    border: 1px solid #5ac5c6;
  }

  .reset-pass {
    width: 80%;
    margin: 0 auto;

    /*height: 40px;*/
    /*font-size: 16px;*/
    /*background-color: hsla(0, 0%, 100%, .7);*/
    /*border: 1px solid #f1f1f1;*/
    /*outline: 0;*/
    /*padding: 0 5px;*/
    /*box-sizing: border-box;*/
    /*border-radius: 5px;*/
    /*margin-bottom: 10px;*/
  }

  .reset-pass .registration-eye {
    top: 50%;
    right: 5%;
  }



</style>
