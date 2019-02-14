<template>
  <modal
    name="registetionStep1"
    width="100%"
    classes=" v--modal register-modal"
    :scrollable="true"
    height="auto">
    <div class="bgc-grad-register"></div>
    <div class="registration">
      <div class="login-header">
        <h3 class="login-title"> {{$lang.variables.newUniqueSocialNetwork}} </h3>
        <img
          class="login-logo"
          src="https://media.inrating.top/storage/img/logo/Inrating_logo_white_tifany.png">
        <h2 class="form-title">{{$lang.variables.welcomeToTheWorld}}</h2>
      </div>
      <i
        @click="hideRegistration()"
        class="icon-delete-f"></i>
      <div class="reg-step1">
        <div class="login-blur"></div>
        <div class="registration-header">
          <h3> {{$lang.variables.register}} </h3>
        </div>
        <div class="registration-body">
          <form ref="firstStep">
            <div class="registration-item">
              <p> {{$lang.variables.enterTheFirstAndLastName}}: </p>
              <input
                class="registration-input"
                name="nameLast"
                ref="name"
                type="text"
                :placeholder="$lang.variables.yourNameAndLastname"
                id="name"
                pattern="[^0-9]{3,255}">
            </div>
            <div class="registration-item">
              <p> {{$lang.variables.nicknameMustContain}}: </p>
              <input
                class="registration-input"
                type="text"
                ref="nickname"
                :placeholder="$lang.variables.nickname"
                id="nickname"
                pattern="[a-zA-Z0-9-]+">
            </div>
            <div class="registration-item">
              <label>{{$lang.variables.yourMobilePhoneNumber}}:</label>
              <div class="registration-country">
                <div
                  class="country-click"
                  @click="showAllCountries()">
                  <img :src="'https://media.inrating.top/images/country/'+phoneImg">

                </div>
                <div
                  v-if="countryList"
                  class="country-list">
                  <p
                    class="country-list--item"
                    v-for="mask in allMask"
                    @click="changeMask(mask.mask,mask.img)">
                    <img :src="'https://media.inrating.top/images/country/'+mask.img">
                    <span v-text="mask.info"></span>
                  </p>
                </div>
                <!--<masked-input-->
                  <!--v-model="mobile"-->
                  <!--class="registration-input registration-phone"-->
                  <!--id="telua"-->
                  <!--ref="phoneInput"-->
                  <!--:mask="phoneMask"-->
                  <!--:placeholder="phonePlaceholder"-->
                  <!--type="text"/>-->
              </div>
            </div>
            <!--<div class="registration-item">
                <p> Почта для подтверждения аккаунта </p>
                <input class="registration-input" type="email"ref="email"  placeholder="Ваш E-mail" id="email">
            </div>!-->
            <div class="registration-item">
              <p> {{$lang.variables.makeUpYourPassword}}: </p>
              <input
                class="registration-input"
                type="password"
                ref="password"
                id="password"
                :placeholder="$lang.variables.password">
              <input
                class="registration-input"
                type="password"
                ref="passwordRepeat"
                id="passwordRepeat"
                :placeholder="$lang.variables.сonfirmPassword">
            </div>
            <div class="registration-item">
              <button
                type="button"
                @click="checkInfoToRegister()"> {{$lang.variables.signUp}}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="login-item concat-item">
        <div ><a href="tel:0800503699" >0 800 50 36 99</a></div>
        <div ><a href="mailto:info@inrating.club">info@inrating.club</a></div>
      </div>
      <div class="login-item concat-item">
        <img src="https://media.inrating.top/images/logo/iso_3.png">
        <img src="https://media.inrating.top/images/logo/gp_3.png">
      </div>
      <p class="login-information">{{$lang.variables.privacyPolicy}}</p>
      <p class="login-information">{{$lang.variables.networkRules}}</p>
      <p class="login-information"><b>InRating Inc © 2018</b></p>
    </div>

    <modal
      name="phoneAccept"
      width="100%"
      classes=" v--modal phone-send-block register-modal"
      :scrollable="true"
      height="100%">
      <div class="bgc-grad-register"></div>
      <div class="phone-send">
        <p>{{$lang.variables.codeFromMessage}}</p>
        <div class="input-phone-block">
          <input
            class="confirm-phone"
            maxlength="1"
            ref="confirmPhoneCode1"
            @keyup="nextCell($event.target)"
            type="text">
          <input
            class="confirm-phone"
            maxlength="1"
            ref="confirmPhoneCode2"
            @keyup="nextCell($event.target)"
            type="text">
          <input
            class="confirm-phone"
            maxlength="1"
            ref="confirmPhoneCode3"
            @keyup="nextCell($event.target)"
            type="text">
          <input
            class="confirm-phone"
            maxlength="1"
            ref="confirmPhoneCode4"
            @keyup="nextCell($event.target)"
            type="text">
        </div>
        <button @click="confirmPhone()">{{$lang.variables.confirm}}</button>
      </div>
    </modal>

  </modal>
</template>

<script>
  import apiDrotr from 'utils/apiDrotr';

  import axios from 'axios';

  export default {
    name: 'registrationModal',
    data(){
      return {
        mobile: '',
        params: {},
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
        phonePlaceholder: '+38(___)___-__-__',
        phoneMask: '\\+\\3\\8(111)111-11-11',
        countryList: false,
      }
    },
    methods: {
      hideRegistration(){
        this.$modal.hide('registetionStep1');
      },

      checkInfoToRegister(){
        let nickname = this.$refs.nickname.value;
        let dataCheckInfoOnRegister = new FormData();
        dataCheckInfoOnRegister.append('nickname', nickname);
        dataCheckInfoOnRegister.append('phone', this.mobile.replace(/[()-]/gi, ''));
        dataCheckInfoOnRegister.append('unique', true);

        axios.post('v1/check-credentials', dataCheckInfoOnRegister)
        .then(res =>{
          if(res.data.state){
            this.sendRegistration();
          }else{
            let errorArray = res.data.failed_fields;
            errorArray.map((error) =>{
              if(error == 'phone'){
                this.$notify({
                  group: 'phone-reg',
                  duration: 3000,
                  speed: 300,
                })
              }
              else if(error == 'nickname'){
              }
            })
          }
        })

      },

      sendRegistration(){
        this.sendForm();
        let name = '';
        let lastname = '';
        let sendName = false;
        let sendPassword = false
        let nameArray = this.$refs.name.value.split(' ');
        if(nameArray.length == 2){
          name = nameArray[0];
          lastname = nameArray[1];

          sendName = true;
        }
        else{
          sendName = false;
        }
        let nickname = this.$refs.nickname.value;
        let password = this.$refs.password.value;
        let passwordRepeat = this.$refs.passwordRepeat.value;
        if(password == passwordRepeat)
          sendPassword = true;
        else
          sendPassword = false;
        if(sendPassword && sendName){
          this.params = {
            name: name,
            lastname: lastname,
            nickname, nickname,
            phone: this.mobile.replace(/[()-]/gi, ''),
            password: password
          }
          let data = {
            'phone': this.mobile.replace(/[()-]/gi, ''),
          };
          let config = {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'text/html',
            }
          };
          this.$modal.show('phoneAccept');
          apiDrotr.regPhone(data, config)
            .then(
            res =>{


            }
          )
        }
        else{
          if(sendName == false){
            this.$notify({
              group: 'send-name',
              duration: 3000,
              speed: 300,
            });
          }
          else{
            this.$notify({
              group: 'send-pass',
              duration: 3000,
              speed: 300,
            });
          }
        }
      },
      confirmPhone(){
        let code1 = this.$refs.confirmPhoneCode1.value;
        let code2 = this.$refs.confirmPhoneCode2.value;
        let code3 = this.$refs.confirmPhoneCode3.value;
        let code4 = this.$refs.confirmPhoneCode4.value;
        let finallcode = code1 + code2 + code3 + code4;
        let code = parseInt(finallcode);
        let data = {
          os: 'android',
          vsn: '0.0.0',
          phone: this.mobile.replace(/[()-]/gi, ''),
          code: code,
        };
        apiDrotr.confirmPhone(data)
        .then(
          res =>{
            if(res.data.status = 'success'){
              this.params.token_type = res.data.token_type;
              this.params.access_token = res.data.access_token;
              this.params.refresh_token = res.data.refresh_token;

              axios.post('v1/register-step-1', this.params)
              .then(
                res =>{

                  let requestTokenData = {
                    client_id: 2,
                    client_secret: '0123456789987654321',
                    grant_type: 'password',
                    username: this.params.nickname,
                    password: this.params.password
                  };
                  axios
                  .post('oauth/token', requestTokenData)
                  .then(res =>{
                    let $token = res.data.access_token;
                    localStorage.setItem('token', $token);
                    let config = {headers: {'Authorization': 'Bearer ' + res.data.access_token}};
                    this.$root.$emit('newBearer', res.data.access_token);
                    return axios.get('v1/me', config);

                    //window.location.href='/home'
                  })
                  .then(
                    res =>{
                      let user = JSON.stringify(res.data);
                      localStorage.setItem('user', user);
                      this.$modal.show('registetionStep2');
                    }
                  )
                  .catch(err =>{
                    }
                  );
                }
              )
            }
          }
        )

      },
      sendForm(){
        let form = this.$refs.firstStep;
        form.addEventListener('submit', function(e){
          e.preventDefault();
          return false;
        })
      },
      showAllCountries(){
        this.countryList = !this.countryList;
      },
      changeMask(_mask, _img){
        this.phoneSeen = false;
        this.phoneImg = _img;
        switch(_mask){
          case 'usa':{
            this.phoneMask = '\\+\\1(111)111-1111';
            this.phonePlaceholder = '+1(_)_-__';
          }
            break;
          case 'canada':{
            this.phoneMask = '\\+\\1(111)111-1111';
            this.phonePlaceholder = '+1(_)_-__';
          }
            break;
          case 'australia':{
            this.phoneMask = '\\+\\6\\1(111)111-111';
            this.phonePlaceholder = '+61(_)_-_';
          }
            break;
          case 'france':{
            this.phoneMask = '\\+\\3\\3-1-11-11-11-11';
            this.phonePlaceholder = '+33-_----';
          }
            break;
          case 'germany':{
            this.phoneMask = '\\+\\4\\9-11-11111111';
            this.phonePlaceholder = '+49--____';
          }
            break;
          case 'italia':{
            this.phoneMask = '\\+\\3\\9-111-1111111';
            this.phonePlaceholder = '+39-_-_____';
          }
            break;
          case 'spain':{
            this.phoneMask = '\\+\\3\\4-111-111-111';
            this.phonePlaceholder = '+34-_-_-_';
          }
            break;
          case 'moldova':{
            this.phoneMask = '\\+\\3\\7\\3-1111-11-111';
            this.phonePlaceholder = '+373-__--_';
          }
            break;
          case 'greece':{
            this.phoneMask = '\\+\\3\\0-111-111-1111';
            this.phonePlaceholder = '+30-_-_-__';
          }
            break;
          case 'chech':{
            this.phoneMask = '\\+\\4\\2\\0-111-111-111';
            this.phonePlaceholder = '+420-_-_-_';
          }
            break;
          case 'georgia':{
            this.phoneMask = '\\+\\9\\9\\5-111-11-11-11';
            this.phonePlaceholder = '+995-_---';
          }
            break;
          case 'hungary':{
            this.phoneMask = '\\+\\3\\6(11)111-1111';
            this.phonePlaceholder = '+36()_-__';
          }
            break;
          case 'poland':{
            this.phoneMask = '\\+\\4\\8-111-111-111';
            this.phonePlaceholder = '+48-_-_-_';
          }
            break;
          case 'estonia':{
            this.phoneMask = '\\+\\3\\7\\2-1111-1111';
            this.phonePlaceholder = '+372-__-__';
          }
            break;
          case 'belarus':{
            this.phoneMask = '\\+\\3\\7\\5-111-111111';
            this.phonePlaceholder = '+375-_-____';
          }
            break;
          case 'lithuania':{
            this.phoneMask = '\\+\\3\\7\\0(1-111)11111';
            this.phonePlaceholder = '+370(_-_)___';
          }
            break;
          case 'turkey':{
            this.phoneMask = '\\+\\9\\0-1111-111-1111';
            this.phonePlaceholder = '+90-__-_-__';
          }
            break;
          case 'arab':{
            this.phoneMask = '\\+\\9\\7\\1-111-111-1111';
            this.phonePlaceholder = '+971-_-_-__';
          }
            break;
          case 'ua':{
            this.phoneMask = '\\+\\3\\8(111)111-11-11';
            this.phonePlaceholder = '+38(_)_--';
          }
            break;
          case 'ru':{
            this.phoneMask = '\\+\\7(111)111-11-11';
            this.phonePlaceholder = '+7(_)_--';
          }
            break;
        }
        this.countryList = false;
      },
      nextCell(el){
        let index = '';
        let children = el.parentNode.childNodes;
        for(let i = 0; i < children.length; i++){
          if(children[i] == el){
            index = i;
          }
        }
        if(index + 2 < children.length)
          children[index + 2].focus();
      }
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/login.less';

  .input-phone-block{
    width: 47.3%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .confirm-phone{
    width: 20%;
    display: block;
    padding: 5px;
    margin: 0 2px 10px 2px;
    border-radius: 6px;
    font-size: 27px;
    border: 1px solid #5ac5c6;
    text-align: center;
  }

  .phone-send-block{
    display: flex;
    align-items: center;
    justify-content: center;

  }

  .bgc-grad-register{
    background: linear-gradient(0deg, #000, transparent, #000);
    opacity: .7;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    content: "";
    z-index: 1;
  }

  .phone-send{
    text-align: center;
    z-index: 111;
  }

  .phone-send p{
    color: #fff;
    margin-bottom: 10px
  }

  .close-phone-send{
    position: absolute;
    color: #fff;

    top: 10px;
    right: 10px;
    z-index: 11;
  }

  .reg-step1{
    position: relative;
    /*width: 88%;*/
    margin: auto;
    margin-bottom: 20px;
  }

  .register-modal{
    background-image: url(https://media.inrating.top/storage/img/backgrounds/FON_M_NEW_2.png);
    background-size: cover;
  }
</style>
