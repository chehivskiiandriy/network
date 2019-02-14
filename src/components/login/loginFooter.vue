<template>
  <div class="login-footer">
    <p class="choose-lang-text">Choose Language:</p>
    <div class="login-item">
      <select
        v-model="selectedLanguage"
        @change="setLang()"
        id="selectLang"
        class="selectpicker dropup"
        data-dropup-auto="false">
        <!--<option> {{$lang.settings.language}}</option>-->
        <option value="ru"> Русский</option>
        <option value="uk">Українська</option>
        <option value="en">English</option>
        <option>Deutsch</option>
        <option>Français</option>
        <option>Español</option>
        <option>Italiano</option>
        <option>Portugues</option>
        <option>Polski</option>
        <option>Türk</option>
        <option>العربية</option>
        <option>हिन्दी</option>
        <option>中國</option>
        <option>한국어</option>
        <option>日本語</option>
      </select>
    </div>
    <div class="login-item concat-item">
      <div ><a href="tel:0800503699" >0 800 50 36 99</a></div>
      <div ><a href="mailto:info@inrating.club">info@inrating.club</a></div>
    </div>
    <div class="login-item concat-item">
      <img @click="goToAppStore" src="https://media.inrating.top/images/logo/iso_3.png">
      <img @click="goToGooglePlay" src="https://media.inrating.top/images/logo/gp_3.png">
    </div>
    <p class="login-information"><router-link to="/public-offer-and-confidentiality">{{$lang.variables.privacyPolicy}}</router-link></p>
    <p class="login-information"><router-link to="/rule-page">{{$lang.variables.networkRules}}</router-link></p>
    <p class="login-information"><b>In Rating Group FZC © 2018</b></p>
  </div>
</template>
<script>
  export default {
    name:'loginFooter',
    data() {
      return {
        selectedLanguage: localStorage.getItem('lang') || 'en'
      }
    },
    methods: {
      showNotAvailableModal() {
        this.$notify({
          group: 'app-not-available',
          duration: 4000,
          speed: 300
        })
      },
      setLang() {
        let e = document.getElementById("selectLang");
        this.strUser = e.options[e.selectedIndex].value;
        localStorage.setItem('lang',this.strUser);
        this.$lang.setLang(this.strUser)
      },
      goToGooglePlay() {
        window.location.href='https://play.google.com/store/apps/details?id=com.inrating.android';
      },
      goToAppStore() {
        window.location.href='https://itunes.apple.com/us/app/inrating/id1336983710'
      }
    }
  }
</script>
<style lang="less">
  @import '~LessStyle/login.less';
</style>
