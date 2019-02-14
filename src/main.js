import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueHead from 'vue-head'
import VModal from 'vue-js-modal'
import Notifications from 'vue-notification'
import Lang from 'vuejs-localization'
import VueLazyload from 'vue-lazyload'
import axios from 'axios';

import 'JsLib/prototype'
import 'JsLib/global-variables'
import 'JsLib/audio-variables'
import InAudio from 'JsLib/audio'
import 'JsLib/checkuser'
import './lib.js'
import {Plugin} from 'JsLib/vue-prototype'
import './store'
import store from 'Store/store';
import api from 'utils/api';
import Grid from "vue-js-grid";

Vue.use(Grid);
//import Legends from 'chartist-plugin-legend'

window.InAudio = InAudio;

Vue.config.productionTip = false;

Vue.use(VueLazyload);
Vue.use(Plugin);
Lang.requireAll(require.context('./lang', true, /\.js$/));
Vue.use(VueHead);
Vue.use(Notifications);
Vue.use(VModal);
//Vue.use(Legends);
//Vue.use(Lang);


let userLang = localStorage.getItem('lang');

if(userLang === 'ua') {
  localStorage.setItem('lang', 'uk');
  window.location.reload();
}

if(userLang !== 'ru' && userLang !== 'en' && userLang !== 'uk') {
  let lang = (navigator.languages && navigator.languages[0])
    || navigator.language
    || navigator.userLanguage
    || 'en';

  userLang = lang.split('-')[0];

  if (userLang === 'ru' || userLang === 'en' || userLang === 'uk') {
    localStorage.setItem('lang', userLang);
    window.location.reload();
  } else {
    localStorage.setItem('lang', 'en');
    window.location.reload();
  }
}
axios.defaults.baseURL = 'https://api.inrating.top/';

// axios.defaults.baseURL = 'http://dev3.core.innet.club/';
let token = localStorage.getItem('token');
axios.defaults.headers['Authorization']  = `Bearer ${token}`;

// setAuthorizationHeader(token);

Vue.prototype.$api = api;

Vue.use(Lang, {
  default: lang,
});
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
});


