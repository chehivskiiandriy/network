<template>
  <modal name="Login"
            width="100%"
            classes=" v--modal "
            height="100%">
            <div class="login">
                <div class="login-header">
                  <i  @click="hideLogin()" class="icon-delete-f"></i>
                  <in-loginheader></in-loginheader>
                </div>
                <div class="login-body">
                    <div>
                        <p > Вход </p>
                        <div class="login-item">
                            <input type="email" placeholder="login" v-model="username" required>
                        </div>
                        <div class="login-item">
                            <input type="password" placeholder="password" v-model="password" required>
                        </div>
                        <div class="login-item">
                            <button @click="loginFunc()">Вход</button>
                        </div>
                        <div class="login-item">
                            <a  @click="showResetPassword()">Забыли парfоль?</a>
                        </div>
                        <div class="login-item">
                            <button @click="showRegistrationStep1()">Регистрация</button>
                            <button>Гостевой вход</button>
                        </div>
                        <div class="container-fluid" >
                            <img src="https://m.inrating.top/images/social_network/FaceBook_Icon.svg">
                            <img src="https://m.inrating.top/images/social_network/Instagramm_Icon.svg">
                            <img src="https://m.inrating.top/images/social_network/LinkedIn_Icon.svg">
                            <img src="https://m.inrating.top/images/social_network/VK_Icon.svg">
                            <img src="https://m.inrating.top/images/social_network/Twitter_Icon.svg">
                            <img src="https://m.inrating.top/images/social_network/YouTube_Icon.svg">
                        </div>
                    </div>
                    <div class="login-blur"></div>
                </div>
            </div>
            <in-regestationstep1-modal></in-regestationstep1-modal>
            <in-resetpassword-modal></in-resetpassword-modal>
     </modal>
</template>

<script>
  import axios from 'axios';

  import Vue from 'vue'
  import RegistretionStep1 from './registrationModalStep1.vue'
  import resetPassword from './resetPassword.vue'
  import loginHeader from '../login/loginHeader.vue'

  Vue.component('in-regestationstep1-modal', RegistretionStep1)
Vue.component('in-resetpassword-modal', resetPassword)
Vue.component('in-loginheader', loginHeader)
export default {
    data() {
        return {
            token: "",
            password: "",
            username: "",
            user: "",
        }
    },

    methods: {
        hideLogin() {
            this.$modal.hide('Login');
        },
        showResetPassword() {
            this.$modal.show('resetPassword');
        },
        loginFunc() {
            let requestTokenData = {
                client_id: 2,
                client_secret: "0123456789987654321",
                grant_type: "password",
                username: this.username,
                password: this.password
            };
            axios.post('oauth/token', requestTokenData)
                .then(res => {
                    let $token = res.data.access_token;
                    localStorage.setItem('token', $token);
                    document.querySelector('[href="#/"]');
                    axios.get('v1/me')
                    .then(
                    res => {
                        let user=JSON.stringify(res.data);
                        window.location.href='/'
                    }
                    )
                    .catch(err => {
                    }
                    );
                    //window.location.href='/home'
                })
                .catch(err => {
                    }
                );
            },
        showRegistrationStep1() {
            this.$modal.show('registetionStep1');
            },
        },

}
</script>

<style>
    @import '~LessStyle/login.less';
</style>
