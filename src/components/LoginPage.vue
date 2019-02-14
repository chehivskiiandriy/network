<template>
  <div id="Login">
    <in-bg-scroll-block :scroll="isScroll"/>
    <template v-if="isMainPage">
      <div class="main-block">
        <h2>{{$lang.variables.welcomeTo}}</h2>
        <img
          class="login-logo main-login-logo"
          src="https://media.inrating.top/storage/img/logo/Inrating_logo_white_tifany.png">
        <button
          class="login-page"
          @click="goToLogin">{{$lang.variables.login}}</button>
        <button
          class="login-page"
          @click="goToRegistration">{{$lang.variables.register}}</button>
      </div>
    </template>
    <template v-else>
      <div class="login-block">
        <div class="login-header">
          <in-loginheader></in-loginheader>
        </div>
        <div class="login-body">
            <p class="login-title"> {{$lang.variables.login}} </p>
            <div class="login-item">
              <input type="text" :placeholder="$lang.variables.nicknameEmailOrPhoneNumber" v-model="username" required>
            </div>
            <div class="login-item">
              <input type="password" :placeholder="$lang.variables.password" v-model="password" required>
            </div>
            <div class="login-item forggot-password">
              <div class="forgot-password">
                <a @click="showResetPassword()">{{$lang.variables.forgotPassword}}</a>
              </div>
              <button @click="loginFunc()">{{$lang.variables.login}}</button>
            </div>
            <div class="login-item buttons-continue">
              <button @click="goToRegistration()">{{$lang.variables.register}}</button>
              <button @click="guestCome()">{{$lang.variables.guestLogin}}</button>
            </div>
        </div>
        <!--<in-regestationstep1-modal></in-regestationstep1-modal>!-->
        <!--<in-resetpassword-modal></in-resetpassword-modal>-->
        <in-loginfooter></in-loginfooter>
      </div>
    </template>

  </div>
</template>

<script>
  import axios from 'axios';

  import Vue from 'vue'
  import { mapActions,  mapGetters } from 'vuex';
  import BgScrollBlock from 'ComponentsVue/login/BgScrollBlock';
  //import RegistretionStep1 from 'ComponentsVue/modal/registrationModalStep1.vue'
  import loginHeader from 'ComponentsVue/login/loginHeader.vue'
  import loginFooter from 'ComponentsVue/login/loginFooter'
  import setAuthorizationHeader from 'utils/setAuthorizationHeader';
  import {FETCH_CURRENT_USER, moduleName as userModule} from "Store/modules/authUser/user";
  import {
    AUTHENTICATE,
    AUTHENTICATE_AS_A_GUEST,
    AUTHENTICATION_ERROR,
    moduleName as authenticationModuleName
  } from 'Store/modules/authentication';

  //Vue.component('in-regestationstep1-modal', RegistretionStep1)
  // Vue.component('in-resetpassword-modal', resetPassword)
  Vue.component('in-loginheader', loginHeader);
  Vue.component('in-loginfooter', loginFooter);
  export default {
    data() {
      return {
        token: "",
        password: "",
        username: "",
        user: "",
        isScroll: true,
        isMainPage: true
      }
    },
    components: {
      inBgScrollBlock: BgScrollBlock
    },
    computed: {
      ...mapGetters({
        authenticationError: authenticationModuleName + AUTHENTICATION_ERROR,
      }),
    },
    mounted() {
      let clientWidth= window.innerWidth;
      localStorage.setItem('clientWidth',clientWidth);
      localStorage.setItem('postOutCount',1);
    },
    methods: {
      ...mapActions({
        fetchCurrentUser: userModule + FETCH_CURRENT_USER,
        authenticate: authenticationModuleName + AUTHENTICATE,
        authenticateAsAGuest: authenticationModuleName + AUTHENTICATE_AS_A_GUEST,
      }),
      goToLogin() {
        this.isMainPage = false;
        this.isScroll = false;
      },
      showResetPassword() {
        // TODO: under construction
        alert(this.$lang.variables.cannotRestorePasswordYetPleaseContactTheSupport);
        // this.$router.push('/reset-password');
        // this.$modal.show('resetPassword');
      },
      onSuccess() {
        this.$router.push('/');
        window.location.reload();
      },
      onFail() {
        this.$router.push('/login');
      },
      guestCome() {
        let user = JSON.parse(localStorage.getItem('user'));

        if (user == null || user.status !== 'guest') {
          this.authenticateAsAGuest();
        }
        else {
          this.$router.replace('/');
        }
      },
      async loginFunc() {
        await this.authenticate({
          username: this.username,
          password: this.password,
        });
        if(this.authenticationError) {
          this.$notify({
            group: 'bad-login',
            duration:3000,
            speed:300,
          });
        } else {
          this.$router.replace('/')
        }
      },
      showRegistrationStep1() {
        this.$modal.show('registetionStep1');
      },
      goToRegistration() {
        this.$router.push('/registration');
      }
    },
    head: {
      title() {
        return {
          inner: this.$lang.variables.login
        }

      },
    },
  }
</script>

<style lang="less">
  @import '~LessStyle/login.less';

  @import '~LessStyle/registration.less';

  .myVideo {
    display: none;
  }

</style>
