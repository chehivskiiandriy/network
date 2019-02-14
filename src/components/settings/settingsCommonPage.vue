<template>
  <div id="mainCommonRaiting">
    <!--<div class="change-status--header">
            {{$lang.settings.all_settings}}
    </div>-->
    <div class="settings-lenta">
      <div
        @click="goTo('/setting/user')"
        class="change-status--item">
        <div class="status-item--title not-active">
          <router-link to="/setting/user">{{$lang.variables.editProfile}}</router-link>
        </div>
        <div class="choose-status"></div>
        <i class="icon-right-f"></i>
      </div>
      <div
        @click="showAccount()"
        class="change-status--item">
        <div class="status-item--title">{{$lang.variables.myAccount}}</div>
        <div class="choose-status"></div>
        <i class="icon-right-f"></i>
      </div>
      <div
        @click="goTo('/setting/private-settings')"
        class="change-status--item">
        <div class="status-item--title not-active">
          <router-link to="/setting/private-settings">{{$lang.variables.settingPrivate}}</router-link>
        </div>
        <div class="choose-status"></div>
        <i class="icon-right-f"></i>
      </div>
      <div
        @click="showLanguage(1)"
        class="change-status--item">
        <div class="status-item--title">{{$lang.variables.language}}</div>
        <div class="choose-status"></div>
        <i class="icon-right-f"></i>
      </div>
      <div
        @click="goTo('/add-to-black-list')"
        class="change-status--item">
        <div class="status-item--title not-active">
          <a>{{$lang.variables.addToBlackList}}</a>
        </div>
        <div class="choose-status"></div>
        <i class="icon-right-f"></i>
      </div>
      <div
        @click="goTo(`/u/${authUser.nickname}/subscribers`)"
        class="change-status--item">
        <div class="status-item--title not-active">
          <a>{{$lang.variables.removeFromBlackList}}</a>
        </div>
        <div class="choose-status"></div>
        <i class="icon-right-f"></i>
      </div>
      <!--<div class="change-status--item">
          <div class="status-item--title">{{$lang.settings.sound}}</div>
          <toggle-button :value="false"
              color="#5ac5c6"
              :labels="{checked: '<i class=icon-check-f></i>', unchecked: '<i class=icon-delete-f></i>'}"/>
      </div>!-->
    </div>

    <!--<div class="change-status&#45;&#45;header">-->
      <!--{{$lang.variables.chatSettings}}-->
    <!--</div>-->
    <!--<div class="settings-lenta">-->
      <!--<div-->
        <!--@click="showLanguage(2)"-->
        <!--class="change-status&#45;&#45;item">-->
        <!--<div class="status-item&#45;&#45;title"> {{$lang.variables.myLanguageChat}}</div>-->
        <!--<div class="choose-status"></div>-->
        <!--<i class="icon-right-f"></i>-->
      <!--</div>-->
      <!--<div-->
        <!--@click="showLanguage(3)"-->
        <!--class="change-status&#45;&#45;item">-->
        <!--<div class="status-item&#45;&#45;title"> {{$lang.variables.doNotTranslateFrom}}</div>-->
        <!--<div class="choose-status"></div>-->
        <!--<i class="icon-right-f"></i>-->
      <!--</div>-->
    <!--</div>-->

    <div class="change-status--header">
      {{$lang.variables.inratingInfo}}
    </div>
    <div class="settings-lenta">
      <div
        @click="modalFAQShow()"
        class="change-status--item">
        <div class="status-item--title"> {{$lang.variables.FAQ}}</div>
        <div class="choose-status"></div>
        <i class="icon-right-f"></i>
      </div>
    </div>
    <div class="change-status--header">
      {{$lang.variables.helpAndSupport}}
    </div>
    <div class="settings-question">
      <p>{{$lang.variables.askAQuestion}}</p>
      <textarea
        class="question"
        :class="{active: question !== ''}"
        v-model="question"
        :placeholder="$lang.variables.writeAQuestions"
      >
      </textarea>
      <div class="actions" :class="{active: question !== ''}">
        <button @click="question = ''">{{$lang.variables.clear}}</button>
        <button @click="sendQuestion">{{$lang.variables.send}}</button>
      </div>
    </div>
    <div class="settings-info">
      <p>E-mail:info@inrating.club </p>
      <p>Tel:0 800 50 36 99 </p>
    </div>
    <p
      class="exitAccount"
      @click="exitAccount"> {{$lang.variables.exit}} </p>
    <!--<p
      class="self-desctruction"
      @click="selfDestruction()">
      <span v-if="user.status=='active'">{{$lang.variables.openAPrivateAccount}}</span>
      <span v-else="user.status=='disabled by admin'">{{$lang.variables.temporaryCloseAccount}}</span>
    </p>-->
    <in-account-change/>
    <in-modal-text :text="modalText"/>
    <in-FAQ :question="$route.params.question"/>
    <in-choose-language/>
  </div>
</template>

<script>
  import axios from 'axios';

  import {mapGetters, mapMutations} from 'vuex';
  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user"

  import Vue from 'vue'
  import ToggleButton from 'vue-js-toggle-button'
  import accountChange from 'ComponentsVue/settings/accountChange.vue'
  import modalText from 'ComponentsVue/modal/modalText'
  import inFAQ from 'ComponentsVue/modal/modalFAQ'
  import chooseLanguage from 'ComponentsVue/settings/settingsChooseLanguage'

  import {
    LOG_OUT,
    moduleName as authenticationModuleName
  } from 'Store/modules/authentication';

  Vue.component('in-FAQ', inFAQ);
  Vue.component('in-modal-text', modalText);
  Vue.component('in-account-change', accountChange);
  Vue.component('in-choose-language', chooseLanguage);
  Vue.use(ToggleButton);
  export default {
    data(){
      return {
        // user: JSON.parse(localStorage.getItem('user')),
        modalText: '',
        question: ''
      }
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER
      })
    },
    mounted() {
      if(this.$route.meta.faq) {
        this.modalFAQShow();
      }
    },
    methods: {
      ...mapMutations({
        logOut: authenticationModuleName + LOG_OUT,
      }),
      goTo(path) {
        this.$router.push(path);
      },
      sendQuestion() {
        if(this.question !== '') {
          const data = new FormData();
          data.append('title', 'critical');
          data.append('desc', this.question);

          axios.post('v1/me/support/letter', data)
            .then(res => {
              if(res.data.state) {
                this.question = '';
                this.$notify({
                  group: 'support-question-send',
                  duration: 3000,
                  speed: 300
                });
              } else {
                this.$notify({
                  group: 'action-error',
                  duration: 3000,
                  speed: 300
                });
              }
            })
            .catch(e => {
              this.$notify({
                group: 'action-error',
                duration: 3000,
                speed: 300
              });
            });
        }
      },
      showAccount(){
        this.$modal.show('accountChange');
      },
      showLanguage(type){
        this.$modal.show('languageChange');
        this.$root.$emit('settingsLang', type);
      },
      exitAccount(){
        this.logOut();
        // лень чистить стор, тупа рефрешим пожилое приложение, рэально
        window.location.href = '/login';
      },
      selfDestruction(){

        if(this.user.status != 'disabled by user'){
          axios.get('v1/me/selfdestruction')
          .then(res =>{
            axios.get('v1/me')
            .then(res =>{
              localStorage.setItem('user', JSON.stringify(res.data));
              location.reload();
            })
          })
        }
        else{
          axios.get('v1/me/selfdestruction?delete=0')
          .then(res =>{
            axios.get('v1/me')
            .then(res =>{
              localStorage.setItem('user', JSON.stringify(res.data));
              location.reload();
            })
          })
        }

      },
      modalFAQShow(){
        this.$modal.show('modalFAQ');
      }

    }

  }
</script>

<style lang="less">
  @import '~LessStyle/changeprofile.less';
  @import '~LessStyle/settings.less';


</style>
