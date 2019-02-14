<template>
  <modal
    name="languageChange"
    width="100%"
    classes=" v--modal"
    height="auto"
    :scrollable="true">
    <div class="account-change">
      {{$lang.variables.languages}}
      <i @click="hideLanguage()" class="icon-left-f"></i>
    </div>
    <div v-if="typeSettingsLang === 1" class="settings-lenta">
      <div class="change-status--item" v-for="lang in allLangHelp" @click="changeLang(lang.shortName)">
        <p class="lang-item"><img :src="'http://storage.innet.club/img/icons/country_icons/small/'+lang.img"><span
          v-text="lang.name"></span></p>
        <i v-if="langLocal === lang.shortName" class="icon-check-f active"></i>
      </div>
    </div>
    <div v-else-if="typeSettingsLang === 2" class="settings-lenta">
      <div class="change-status--item" v-for="lang in allLangHelp" @click="changeChatLang(lang.shortName)">
        <p class="lang-item"><img :src="'http://storage.innet.club/img/icons/country_icons/small/'+lang.img"><span
          v-text="lang.name"></span></p>
        <i v-if="chatLang === lang.shortName" class="icon-check-f active"></i>
      </div>
    </div>
    <div v-else-if="typeSettingsLang === 3" class="settings-lenta">
      <div class="change-status--item" v-for="lang in allLangHelp" @click="changeChatLangNotTranslate(lang.shortName)">
        <p class="lang-item"><img :src="'http://storage.innet.club/img/icons/country_icons/small/'+lang.img"><span
          v-text="lang.name"></span></p>
        <i v-if="chatNotTranslateLangs.includes(lang.shortName)" class="icon-check-f active"></i>
      </div>
    </div>
  </modal>
</template>
<script>
  import axios from 'axios';
  import moment from 'moment';

  export default {
    data() {
      return {
        typeSettingsLang: 1,
        langLocal: localStorage.getItem('lang'),
        chatLang: '',
        chatNotTranslateLangs: [],
        langSettings: {},
        allLang: [
          {'name': 'English', 'img': 'english.png', 'shortName': 'en'},
          {'name': 'Deutsch', 'img': 'germany.png', 'shortName': 'de'},
          {'name': 'Français', 'img': 'france.png', 'shortName': 'en'},
          {'name': 'Español', 'img': 'spain.png', 'shortName': 'es'},
          {'name': 'Italiano', 'img': 'italy.png', 'shortName': 'en'},
          {'name': 'Portugues', 'img': 'portugal.png', 'shortName': 'en'},
          {'name': 'Українська', 'img': 'ukraine.png', 'shortName': 'uk'},
          {'name': 'Русский', 'img': 'russia.png', 'shortName': 'ru'},
          {'name': 'Polski', 'img': 'poland.png', 'shortName': 'en'},
          {'name': 'Türk', 'img': 'turkish.png', 'shortName': 'en'},
          {'name': 'العربية', 'img': 'arabian.png', 'shortName': 'en'},
          {'name': 'हिन्दी', 'img': 'india.png', 'shortName': 'en'},
          {'name': '中國', 'img': 'china.png', 'shortName': 'en', 'avaible': 'no'},
          {'name': '한국어', 'img': 'korea.png', 'shortName': 'en', 'avaible': 'no'},
          {'name': '日本語', 'img': 'japan.png', 'shortName': 'en', 'avaible': 'no'},
        ],
        allLangHelp: [
          {'name': 'English', 'img': 'english.png', 'shortName': 'en'},
          {'name': 'Deutsch', 'img': 'germany.png', 'shortName': 'de'},
          {'name': 'Français', 'img': 'france.png', 'shortName': 'fr'},
          {'name': 'Español', 'img': 'spain.png', 'shortName': 'es'},
          {'name': 'Italiano', 'img': 'italy.png', 'shortName': 'it'},
          {'name': 'Portugues', 'img': 'portugal.png', 'shortName': 'pt'},
          {'name': 'Українська', 'img': 'ukraine.png', 'shortName': 'uk'},
          {'name': 'Русский', 'img': 'russia.png', 'shortName': 'ru'},
          {'name': 'Polski', 'img': 'poland.png', 'shortName': 'pl'},
          {'name': 'Türk', 'img': 'turkish.png', 'shortName': 'tr'},
          {'name': 'العربية', 'img': 'arabian.png', 'shortName': 'ar'},
          {'name': 'हिन्दी', 'img': 'india.png', 'shortName': 'hi'},
          {'name': '中國', 'img': 'china.png', 'shortName': 'zn', 'avaible': 'no'},
          {'name': '한국어', 'img': 'korea.png', 'shortName': 'kr', 'avaible': 'no'},
          {'name': '日本語', 'img': 'japan.png', 'shortName': 'jp', 'avaible': 'no'},
        ],
      }
    },
    mounted() {
      axios.get('v1/me')
        .then(res => {
          let settings = res.data.settings;
          this.langSettings = settings;
          this.langLocal = settings.lang;
          this.chatLang = settings.chat_langs.main_lang;
          this.chatNotTranslateLangs = settings.chat_langs.sub_langs;
        });

      this.$root.$on('settingsLang', (e) => {
        this.typeSettingsLang = e;
      });
    },
    methods: {
      hideLanguage() {
        let type = this.typeSettingsLang;

        if (type === 1)
          this.setLang();
        else if (type === 2)
          this.setChatLang();
        else if (type === 3)
          this.setChatLangNotTranslate();

        this.$modal.hide('languageChange');
      },
      changeLang(name) {
        this.langLocal = name;
      },
      changeChatLang(name) {
        this.chatLang = name;
      },
      changeChatLangNotTranslate(name) {
        let index = this.chatNotTranslateLangs.indexOf(name);

        if (index !== -1) {
          this.chatNotTranslateLangs.splice(index, 1);
        } else {
          this.chatNotTranslateLangs.push(name);
        }
      },
      setLang() {
        let data = new FormData();
        data.append('lang', this.langLocal);

        axios.post('v1/me/settings/edit', data)
          .then(res => {
            localStorage.setItem('lang', this.langLocal);
            moment.locale(this.langLocal);

            this.$lang.setLang(localStorage.getItem('lang'));

          })
          .catch(e => {
            this.notifyError();
            this.langLocal = this.langSettings.lang;
          });
      },
      setChatLang() {
        let data = new FormData();
        data.append('main_lang', this.chatLang);

        axios.post('v1/me/settings/lang/edit', data)
          .then(res => {
          })
          .catch(e => {
            this.notifyError();
            this.langLocal = this.langSettings.chat_langs.main_lang;
          })
      },
      setChatLangNotTranslate() {
        let data = new FormData();
        data.append('sub_langs', JSON.stringify(this.chatNotTranslateLangs));

        axios.post('v1/me/settings/lang/edit', data)
          .then(res => {
          })
          .catch(e => {
            this.notifyError();
            this.langLocal = this.langSettings.chat_langs.sub_langs;
          })
      },
      notifyError() {
        this.$notify({
          group: 'action-error',
          duration: 3000,
          speed: 300
        });
      }
    },
  }
</script>
<style>
  .lang-item {
    margin: 7px 0;
    display: flex;
    align-items: center;
  }

  .lang-item > span {
    margin-left: 5px;
  }

  .active {
    color: #5ac5c6;
  }
</style>
