<docs>
  ## Специальный блок и обозначения для того что бы оставлять комментарии внутри кода, очч удобно кстати, во время
  компиляции все удаляется.
  ## Наша страница регистрации
</docs>

<template>
  <div id="loginfrom">
    <h1>Привет {{user.name}} {{user.lastname}} {{user.email}}</h1>
    <input
      type="email"
      placeholder="login"
      v-model="username"
      required>
    <input
      type="password"
      placeholder="password"
      v-model="password"
      required>
    <br>
    <br>
    <button
      type="submit"
      class="btn"
      v-on:click="makeAuthPassword()">Вход
    </button>
    <button
      class="btn"
      v-on:click="getAllUsers()">Получить всех пользователей
    </button>
    <button
      class="btn"
      v-on:click="getMyUser()">Получить все данные обо мне
    </button>
    <ul v-for="usr in userall">
      <li>
        <p v-text="usr.name"></p>
        <p v-text="usr.lastname"></p>
        <p v-text="usr.email"></p>
        <hr>
      </li>
    </ul>
    <p @click="showRegistrationStep1()"> Пройти регистрацию </p>
    <in-regestationstep1-modal/>
    <p @click="showRegistrationStep2()"> Пройти регистрацию 2 </p>
    <in-regestationstep2-modal/>
    <p @click="showLogin()"> Войти </p>
    <in-login-modal/>
  </div>
</template>

<script>
  import axios from 'axios';

  import Vue from 'vue'
  import RegistretionStep1 from './modal/registrationModalStep1.vue'
  import RegistretionStep2 from './modal/registrationModalStep2.vue'
  import Login from './modal/Login.vue'

  Vue.component('in-regestationstep1-modal', RegistretionStep1)
  Vue.component('in-regestationstep2-modal', RegistretionStep2)
  Vue.component('in-login-modal', Login)
  export default {
    name: 'LoginForm',
    data(){
      return {
        token: '',
        password: '',
        username: '',
        user: '',
        userall: [],
        isBlurred: true,
      }
    }, //это своеродный конструктор для базовых переменных.
    methods: {
      getMyUser(){
        axios.get('v1/users/get')
        .then(res =>{
          this.user = res.data;
        })
        .catch(err =>{
        });

      },
      makeAuthPassword(){
        let requestTokenData = {
          client_id: 2,
          client_secret: '0123456789987654321',
          grant_type: 'password',
          username: this.username,
          password: this.password
        };

        axios
        .post('oauth/token', requestTokenData)
        .then(res =>{
          let $token = res.data.access_token;
          localStorage.setItem('token', $token);
          document.querySelector('[href="#/"]');
          axios.get('v1/me')
          .then(res =>{
            let user = JSON.stringify(res.data);
            localStorage.setItem('user', user);
            window.location.href = '/'
          })
          .catch(err =>{
            }
          );
          //window.location.href='/home'
        })
        .catch(err =>{
          }
        );
      },
      getAllUsers(){
        axios.get('v1/users/all')
        .then(res =>{
          this.userall = res.data.data;
        })
        .catch(err => console.log(err.response));
      },
      showRegistrationStep1(){
        this.$modal.show('registetionStep1');
      },
      showRegistrationStep2(){
        this.$modal.show('registetionStep2');
      },
      showLogin(){
        this.$modal.show('Login');
      },
    },
    mounted(){
      let clientWidth = window.innerWidth;
      localStorage.setItem('clientWidth', clientWidth);
      localStorage.setItem('postOutCount', 1);
      localStorage.setItem('user', user);
    }
  }
</script>

<style>
  @import '~LessStyle/registration.less';

  #app{
    text-align: center;

  }
</style>
