<template>
  <div id="change-profile">
    <div class="profile-header">
      <div
        class="title"> {{$lang.variables.editProfile}}
      </div>
      <i
        @click="goBackSettings()"
        class="icon-left-f icon-back"></i>
    </div>
    <div
      class="extra-fields"
      v-if="extraSum > 0">
      {{$lang.profile.moreСoins}} + {{extraSum}} INCoins
    </div>
    <div class="change-avatar">
      <img :src="dataUrl">
      <button @click="showChangeAvatar"> {{$lang.variables.chooseAvatar}}</button>
    </div>
    <div class="change-names">
      <div class="change-profile-item" :class="{ error: infoErrorName.length > 0 }">
        <p class="label-item">{{$lang.variables.name}}:</p>
        <div class="info-error">{{infoErrorName}}</div>
        <p class="input-block">
          <input
            class="change-input"
            v-model="changeName"
            @keyup="checkName"
            id="change-name"
            type="text">
        </p>
      </div>
      <div class="change-profile-item" :class="{ error: infoErrorLastname.length > 0 }">
        <p class="label-item">{{$lang.variables.surname}}:</p>
        <div class="info-error">{{infoErrorLastname}}</div>
        <p class="input-block">
          <input
            class="change-input"
            v-model="changeLastname"
            @keyup="checkLastname"
            id="change-lastname"
            type="text">
        </p>
      </div>
      <div class="change-profile-item" :class="{ error: infoErrorNickname.length > 0 }">
        <p class="label-item">{{$lang.variables.nickname}}:</p>
        <div class="info-error">{{infoErrorNickname}}</div>
        <p class="input-block">
          <input
            class="change-input"
            v-model="changeNickname"
            @keyup="checkNickname"
            id="change-nickname"
            type="text">
        </p>
      </div>
    </div>

    <div class="change-status--header">
      {{$lang.profile.extraInformation}}
    </div>

    <div class="change-names">
      <div>
        <p class="label">{{$lang.profile.status}}:</p>
        <p>
          <input
            class="change-input"
            v-model="changeStatus"
            id="change-personalStatus"
            type="text">
        </p>
        <p>
        <p class="label">{{$lang.variables.email}}:
          <span
            class="edit-bonus-coins"
            v-if="bonusEmail">+{{extraFieldsObj.email.coins}} INC</span>
        </p>
        <div class="email-block">
          <input
            class="change-input"
            @blur="coinsEarn($event.target)"
            v-model="changeHashEmail"
            id="change-email"
            disabled
            type="text">
          <i class="icon-edit" @click="showChangeEmail"></i>
        </div>
      </div>
      <div>
        <p class="label">{{$lang.variables.location}}:
          <span
            class="edit-bonus-coins"
            v-if="bonusGeoId">+{{extraFieldsObj.geo_id.coins}} INC</span>
        </p>
        <input
          type="text"
          class="change-input"
          @blur="coinsEarn($event.target)"
          @click="googleAutoComplete()"
          v-model="changeLocation"
          value=""
          :placeholder="$lang.variables.location"
          id="place"
          name="place"/>
        <input
          type="hidden"
          name="placeId"
          id="placeId"
          value=""/>
      </div>
      <div>
        <div class="change-gender">
          <p class="label">{{$lang.settings.choose_gender}}:
            <span
              :class="classGender"
              v-if="bonusGender">+{{extraFieldsObj.gender.coins}} INC</span>
          </p>
          <div class="gender-list">
            <template v-if="gender=='male'">
              <span
                class="gender-item-change active-gender"
                @click="gender='male'">{{$lang.variables.male}}</span>
              <span
                class="gender-item-change"
                @click="gender='female'">{{$lang.variables.female}}</span>
              <span
                class="gender-item-change"
                @click="gender=''">{{$lang.variables.notSelected}}</span>
            </template>
            <template v-else-if="gender=='female'">
              <span
                class="gender-item-change"
                @click="gender='male'">{{$lang.variables.male}}</span>
              <span
                class="gender-item-change active-gender"
                @click="gender='female'">{{$lang.variables.female}}</span>
              <span
                class="gender-item-change"
                @click="gender=''">{{$lang.variables.notSelected}}</span>
            </template>
            <template v-else>
              <span
                class="gender-item-change"
                @click="gender='male'">{{$lang.variables.male}}</span>
              <span
                class="gender-item-change"
                @click="gender='female'">{{$lang.variables.female}}</span>
              <span
                class="gender-item-change active-gender"
                @click="gender=''">{{$lang.variables.notSelected}}</span>
            </template>
          </div>
        </div>
      </div>
      <div>
        <p class="label">{{$lang.variables.dateOfBirth}}:
          <span
            class="edit-bonus-coins"
            v-if="bonusBirth">+{{extraFieldsObj.birth_date.coins}} INC</span>
        </p>
        <input
          class="change-input"
          @blur="coinsEarn($event.target)"
          v-model="changeBirth"
          id="change-"
          type="date">
      </div>
    </div>
    <div class="change-status">
      <div class="change-status--header">
        {{$lang.variables.socialSphere}}
      </div>
      <div class="change-status-content">
        <div
          class="change-status--item"
          @click="changeFamily()">
          <div class="status-item--title">{{$lang.variables.familyStatus}}
            <span
              :class="familyClass"
              v-if="bonusFamilyStatus">+{{extraFieldsObj.family_status.coins}} INC</span>
          </div>
          <div
            class="choose-status"
            v-text="showFamilyArray "></div>
          <i class="icon-right-f"></i>
        </div>
        <div
          class="change-status--item"
          @click="changeSocial()">
          <div class="status-item--title">{{$lang.variables.socialStatus}}
            <span
              :class="socialClass"
              v-if="bonusSocialStatus">+{{extraFieldsObj.social_status.coins}} INC</span>
          </div>
          <div
            class="choose-status"
            v-text="this.chooseStatusArray[0] "></div>
          <i class="icon-right-f"></i>
        </div>
        <div
          class="change-status--item"
          @click="changeActivity()">
          <div class="status-item--title">{{$lang.variables.myFieldOfActivity}}
            <span
              :class="activityClass"
              v-if="bonusActivityStatus">+{{extraFieldsObj.activity_status.coins}} INC</span>
          </div>
          <div
            class="choose-status"
            v-text="this.chooseActivityArray[0] "></div>
          <i class="icon-right-f"></i>
        </div>
      </div>
    </div>
    <in-change-status
      :chooseStatusArray="chooseStatusArray"
      :user="user"/>
    <in-change-activity
      :chooseActivityArray="chooseActivityArray"
      :user="user"/>
    <button @click="saveProfile()"> {{$lang.variables.save}}</button>
    <modal
      name="changeFamily"
      width="100%"
      classes=" v--modal "
      height="100%"
      :scrollable="true">
      <div class="family-header">
        <i
          @click="hideFamily()"
          class="icon-left-f closeFamily"></i>
        <h3>{{$lang.variables.familyStatus}} </h3>
      </div>
      <div class="family-block">
        <div
          class="family-item--text"
          @click="changeFamilyStatus('married')">
          <p class="family-item">
            <span class="item-content"><i class="icon-weding"></i>{{$lang.variables.married}}</span>
            <span v-if="chooseFamilyArray=='married'"><i class="icon-check-f"></i></span>
          </p>
        </div>
        <div
          class="family-item--text"
          @click="changeFamilyStatus('in_relationship')">
          <p class="family-item">
            <span class="item-content"><i class="icon-relationships"></i>{{$lang.variables.inRelations}}</span>
            <span v-if="chooseFamilyArray=='in_relationship'"><i class="icon-check-f"></i></span>
          </p>
        </div>
        <div
          class="family-item--text"
          @click="changeFamilyStatus('single')">
          <p class="family-item">
            <span class="item-content"><i class="icon-bez-paru"></i>{{$lang.variables.single}}</span>
            <span v-if="chooseFamilyArray=='single'"><i class="icon-check-f"></i></span>
          </p>
        </div>
        <div
          class="family-item--text"
          @click="changeFamilyStatus('in_search')">
          <p class="family-item">
            <span class="item-content"><i class="icon-insearch"></i>{{$lang.variables.inSearch}}</span>
            <span v-if="chooseFamilyArray=='in_search'"><i class="icon-check-f"></i></span>
          </p>
        </div>
        <div
          class="family-item--text"
          @click="changeFamilyStatus('in_active_search')">
          <p class="family-item">
            <span class="item-content"><i class="icon-inRsearch"></i>{{$lang.variables.inActiveSearchInRating}}</span>
            <span v-if="chooseFamilyArray=='in_active_search'"><i class="icon-check-f"></i></span>
          </p>
        </div>
      </div>
    </modal>
    <modal
      name="changeAvatar"
      width="100%"
      classes=" v--modal "
      height="100%"
      :scrollable="true">
      <div class="post-add-cropp change-avatar-croppa">
        <i
          @click="hideAvatar()"
          class="icon-delete-f"></i>
        <div class="crop-container">
          <croppa
            v-model="changeCroppa"
            :width="imageSize"
            :height="imageSize"
            :quality="qualityImage"
            :show-remove-button="false"
            :prevent-white-space="true"
            :placeholder="$lang.variables.chooseAPhoto">
          </croppa>
          <img class="icon-cropper" src="https://media.inrating.top/storage/img/default/cropp-action.svg" alt="">
        </div>
        <div class="crop-container__buttons-container">
          <button class="crop-container__button" @click="changeCroppa.remove()">{{$lang.variables.cancelChoice}}</button>
          <button class="crop-container__button" @click="newAvatar()">{{$lang.variables.cropAndApply}}</button>
        </div>
      </div>
      <in-spinner-bg :loading="loaded"></in-spinner-bg>
    </modal>

    <modal
      name="changeEmailModal"
      class="changeInput"
      height="auto"
      classes="change-email-modal"
      @before-open="resetEmailModalProps"
      width="95%">

      <!--<div class="close-change-email">-->
        <!--<i-->
          <!--class="icon-delete-f"-->
          <!--@click="hideChangeEmail()"></i>-->
      <!--</div>-->

      <p class="change-email-title">{{$lang.variables.updateEmail}}</p>

      <div class="error-change-email">
        <template v-if="infoErrorActiveEmail">
          {{infoErrorActiveEmail}}
        </template>
        <template v-else-if="infoErrorNewEmail">
          {{infoErrorNewEmail}}
        </template>
      </div>
      <template v-if="changeEmail">
        <input
          type="text"
          name="email"
          class="change-modal-input"
          :class="{error: !!infoErrorActiveEmail}"
          @blur="touchedActive"
          @keyup="checkActiveEmail"
          :placeholder="$lang.variables.enterCurrentEmail"
          v-model="activeEmail">
      </template>

      <input
        type="text"
        name="newEmail"
        class="change-modal-input"
        :class="{error: !!infoErrorNewEmail}"
        @blur="touchedNew"
        @keyup="checkNewEmail"
        :placeholder="$lang.variables.enterNewEmail"
        v-model="newEmail">

      <button :disabled="infoErrorActiveEmail !== '' || infoErrorNewEmail !== ''"
        class="save-email"
        @click="updateEmail">{{$lang.variables.save}}</button>

    </modal>
    <div
      v-if="loading"
      class="spinner-bg">
      <img
        class="spinner-svg"
        src="https://media.inrating.top/images/Spinner.svg"/>
    </div>

  </div>
</template>

<script>
  import axios from 'axios';
  import {mapActions, mapGetters, mapMutations} from 'vuex';

  import {AUTH_USER, CHANGE_AVATAR, moduleName as userModule, UPDATE_AUTH_USER} from "Store/modules/authUser/user";

  import Vue from 'vue'
  //import changeAvatar from 'ComponentsVue/modal/change-profile/changeAvatar.vue'
  import changeActivity from 'ComponentsVue/modal/change-profile/changeActivity.vue'
  import imageHelper from 'JsLib/imageHelper'
  //import changeFamily from 'ComponentsVue/modal/change-profile/changeFamily.vue'
  import changeStatus from 'ComponentsVue/modal/change-profile/changeStatus.vue'
  import Croppa from 'vue-croppa'

  Vue.use(Croppa);
  Vue.component('in-change-status', changeStatus);
  Vue.component('in-change-activity', changeActivity);
  export default {
    data() {
      return {
        loaded:false,
        user: [],
        extraFields: [],
        extraFieldsObj: {},
        changeName: '',
        loading:false,
        changeLastname: '',
        changeNickname: '',
        changePhone: '',
        changeStatus: '',
        changeLocation: '',
        changeLocationId: '',
        changeBirth: '',
        changeEmail: '',
        dataUrl: '',
        image: '',
        gender: '',
        chooseActivityArray: [],
        chooseStatusArray: [],
        chooseFamilyArray: '',
        showFamilyArray: '',
        boolAvatar: false,
        activity: '',
        status: '',
        changeCroppa: {},
        imageSize: '',
        qualityImage: 4,
        dataUrlB: '',
        imageFile: '',
        bonusGender: false,
        bonusEmail: false,
        bonusBirth: false,
        bonusSocialStatus: false,
        bonusActivityStatus: false,
        bonusFamilyStatus: false,
        bonusGeoId: false,
        extraSum: 0,
        infoErrorName: '',
        infoErrorLastname: '',
        infoErrorNickname: '',
        infoErrorActiveEmail: '',
        infoErrorNewEmail: '',
        changeHashEmail: '',
        activeEmail: '',
        newEmail: '',
        touchedActiveEmail: false,
        touchedNewEmail: false,
      }
    },
    watch: {
      changeEmail(changeEmail) {
        this.changeHashEmail = this.hashEmail(changeEmail);
      }
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER
      }),
      classGender() {
        if (!this.gender)
          return 'edit-bonus-coins';
        else
          return 'edit-bonus-coins empy-gender'
      },
      familyClass() {
        if (!this.chooseFamilyArray)
          return 'edit-bonus-coins-status';
        else
          return 'edit-bonus-coins-status empy-gender'
      },
      socialClass() {
        if (this.chooseStatusArray.length === 0)
        // if(this.bonusSocialStatus === true)
          return 'edit-bonus-coins-status';
        else
          return 'edit-bonus-coins-status empy-gender'
      },
      activityClass() {
        if (this.chooseActivityArray.length === 0)
          return 'edit-bonus-coins-status';
        else
          return 'edit-bonus-coins-status empy-gender'
      }
    },
    mounted() {
      let user =JSON.parse(localStorage.getItem('user'));
      if (user.status==='guest')
        this.$router.push('/login');
      let image = localStorage.getItem('clientWidth');
      this.imageSize = parseInt(image) - 10;
      this.qualityImage = Math.ceil(1080 / this.imageSize);
      axios.get('v1/me')
        .then(res => {
          this.user = res.data;
          this.changeName = this.user.name;
          this.changeLastname = this.user.lastname;
          this.changeNickname = this.user.nickname;
          this.changePhone = this.user.phone;
          this.gender = this.user.gender;
          this.changeStatus = this.user.personal_status;
          this.dataUrl = this.user.avatar_image.url_large;
          if (this.user.geo_id != null) {
            this.changeLocation = this.user.geo_id.location;
            this.changeLocationId = this.user.geo_id.google_place_id;
          }
          this.changeBirth = this.user.birth_date;
          this.changeEmail = this.user.email;
          this.changeHashEmail = this.hashEmail(this.changeEmail);
          this.dataUrlB = this.dataUrl;
          if (this.user.activity_statuses != null) {
            this.chooseActivityArray = this.user.activity_statuses.map((status) => {
              return status.value;
            })

          }
          if (this.user.social_statuses != null) {

            this.chooseStatusArray = this.user.social_statuses.map((status) => {
              return status.value;
            })
          }

          this.chooseFamilyArray = this.user.family_status;
          this.changeFamilyStatus(this.chooseFamilyArray);
        });
      axios.get('v1/me/settings/bonus-fields')
        .then(res => {
          this.extraFields = res.data;
          for (let i = 0; i < this.extraFields.length; i++) {
            switch (this.extraFields[i].action) {
              case 'gender':
                this.extraFieldsObj.gender = this.extraFields[i];
                this.extraSum = this.extraSum + this.extraFields[i].coins;
                this.bonusGender = true;
                break;
              case 'email':
                this.extraFieldsObj.email = this.extraFields[i];
                this.extraSum = this.extraSum + this.extraFields[i].coins;
                this.bonusEmail = true;
                break;
              case 'birth_date':
                this.extraFieldsObj.birth_date = this.extraFields[i];
                this.extraSum = this.extraSum + this.extraFields[i].coins;
                this.bonusBirth = true;
                break;
              case 'social_status':
                this.extraFieldsObj.social_status = this.extraFields[i];
                this.extraSum = this.extraSum + this.extraFields[i].coins;
                this.bonusSocialStatus = true;
                break;
              case 'activity_status':
                this.extraFieldsObj.activity_status = this.extraFields[i];
                this.extraSum = this.extraSum + this.extraFields[i].coins;
                this.bonusActivityStatus = true;
                break;
              case 'family_status':
                this.extraFieldsObj.family_status = this.extraFields[i];
                this.extraSum = this.extraSum + this.extraFields[i].coins;
                this.bonusFamilyStatus = true;
                break;
              case 'geo_id':
                this.extraFieldsObj.geo_id = this.extraFields[i];
                this.extraSum = this.extraSum + this.extraFields[i].coins;
                this.bonusGeoId = true;
                break;
            }
          }
        })
    },
    methods: {
      ...mapActions({
        changeAvatar: userModule + CHANGE_AVATAR
      }),
      ...mapMutations({
        updateAuthUser: userModule + UPDATE_AUTH_USER
      }),
      touchedActive() {
        this.touchedActiveEmail = true;
        this.checkActiveEmail();
      },
      touchedNew() {
        this.touchedNewEmail = true;
        this.checkNewEmail();
      },
      showChangeEmail() {
        this.$modal.show('changeEmailModal');
      },
      hashEmail(email) {
        let partsEmail = email.split('@');
        return partsEmail[0].slice(0, 3) + "*".repeat(partsEmail[0].length - 3) + "@" + partsEmail[1];
      },
      hideChangeEmail() {
        this.$modal.hide('changeEmailModal');
        this.resetEmailModalProps();
      },
      resetEmailModalProps() {
        this.infoErrorNewEmail = '';
        this.infoErrorActiveEmail = '';
        this.touchedNewEmail = false;
        this.touchedActiveEmail = false;
        this.newEmail = '';
        this.activeEmail = '';
      },
      updateEmail() {
        let dataEmail = new FormData();

        dataEmail.append('email', this.newEmail);
        if(this.activeEmail === this.changeEmail || this.changeEmail === null){
          axios.post('v1/me/settings/base/edit', dataEmail)
            .then(res =>{
              this.changeEmail = this.newEmail;
              this.hideChangeEmail();
            })
            .catch(err =>{
            })
        }
      },
      checkActiveEmail() {
        if(this.touchedActiveEmail) {
          let patt = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(this.activeEmail);

          if(this.activeEmail === '') {
            this.infoErrorActiveEmail = this.$lang.variables.enterCurrentEmail;
          } else if(!patt){
            this.infoErrorActiveEmail = this.$lang.variables.incorrectEmail;
          } else if(this.activeEmail !== this.changeEmail) {
            this.infoErrorActiveEmail = this.$lang.variables.incorrectEmail;
          }
          else{
            this.infoErrorActiveEmail = ''
          }
        }
      },
      checkNewEmail() {
        if(this.touchedNewEmail) {
          let patt = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(this.newEmail);

          if(this.newEmail === '') {
            this.infoErrorNewEmail = this.$lang.variables.enterNewEmail;
          } else if(!patt){
            this.infoErrorNewEmail = this.$lang.variables.incorrectEmail;
          } else {
            this.checkCorrectEmail();
            this.infoErrorNewEmail = ''
          }
        }
      },
      checkName() {
        let name = this.changeName;
        let patName = /^[^0-9_.;`~!@#$%^&*()+"№:?=,|]+$/.test(name);

        if (name === '') {
          this.infoErrorName = this.$lang.variables.enterName;
        } else if (!patName) {
          this.infoErrorName = this.$lang.variables.invalidSymbols;
        } else {
          this.infoErrorName = '';
        }
      },
      checkLastname() {
        let name = this.changeLastname;
        let patName = /^[^0-9_.;`~!@#$%^&*()+"№:?=,|]+$/.test(name);

        if (name === '') {
          this.infoErrorLastname = this.$lang.variables.enterSurname;
        } else if (!patName) {
          this.infoErrorLastname = this.$lang.variables.invalidSymbols;
        } else {
          this.infoErrorLastname = '';
        }
      },
      checkNickname() {
        let nickname = this.changeNickname;
        let patt = /^[a-zA-Z0-9_.]+$/.test(nickname);

        if (nickname === '') {
          this.infoErrorNickname = this.$lang.variables.enterNickname;
        } else if (!patt) {
          this.infoErrorNickname = this.$lang.variables.invalidSymbols;
        }
        else if (nickname.length < 3 || nickname.length > 16) {
          this.infoErrorNickname = this.$lang.variables.nicknameMustContain
        } else {
          this.checkCorrectNickname();
          this.infoErrorNickname = '';
        }

      },
      checkCorrectNickname() {
        let dataCheckInfo = new FormData();
        dataCheckInfo.append('nickname', this.changeNickname);
        dataCheckInfo.append('unique', true);
        axios.post('v1/check-credentials', dataCheckInfo)
          .then(res => {
            if (!res.data.state) {
              this.$notify({
                group: 'nickname-reg',
                duration: 3000,
                speed: 300,
              });
              this.infoErrorNickname = this.$lang.variables.nicknameBusy;
            }
            else {
              this.infoErrorNickname = '';
            }
          });
      },
      checkCorrectEmail() {
        let dataCheckInfo = new FormData();
        dataCheckInfo.append('email', this.newEmail);
        dataCheckInfo.append('unique', true);
        axios.post('v1/check-credentials', dataCheckInfo)
          .then(res => {
            if (!res.data.state) {
              this.infoErrorNewEmail = this.$lang.variables.emailBusy;
            }
            else {
              this.infoErrorNewEmail = '';
            }
          });
      },
      goBackSettings() {
        history.go(-1);
      },
      coinsEarn(item) {
        let parentItem = item.parentNode.querySelector('.edit-bonus-coins');
        if (!!parentItem) {

          parentItem.style.display = 'none';
        }
      },
      showChangeAvatar() {
        this.$modal.show('changeAvatar');
        setTimeout(() => {
          this.changeCroppa.chooseFile()
        }, 100);
      },

      changeActivity() {
        this.$modal.show('changeActivity');
      },
      changeSocial() {

        this.$modal.show('changeStatus');
      },
      changeFamily() {
        this.$modal.show('changeFamily');
        this.$parent.$emit('chooseFamily', this.chooseFamilyArray);
      },
      hideFamily() {
        this.$modal.hide('changeFamily');
      },
      changeFamilyStatus(status) {
        this.chooseFamilyArray = status;
        switch (status) {
          case 'married':
            this.showFamilyArray = this.$lang.variables.married;
            break;
          case 'in_relationship':
            this.showFamilyArray = this.$lang.variables.inRelations;
            break;
          case 'single':
            this.showFamilyArray = this.$lang.variables.single;
            break;
          case 'in_search':
            this.showFamilyArray = this.$lang.variables.inSearch;
            break;
          case 'in_active_search':
            this.showFamilyArray = this.$lang.variables.inActiveSearchInRating;
            break;
        }
      },
      hideAvatar() {
        this.$modal.hide('changeAvatar');
      },

      googleAutoComplete() {
        let place = document.getElementById('place');
        let placeId = document.getElementById('placeId');

        let autocomplete = new google.maps.places.Autocomplete(place);
        autocomplete.addListener('place_changed', () => {
          let place = autocomplete.getPlace();
          placeId.value = place.place_id;
          this.changeLocation = place.formatted_address;
          this.changeLocationId = place.place_id;
          this.$modal.hide('location');
        });
      },
      newAvatar() {
        this.dataUrl = this.changeCroppa.generateDataUrl();

        if (this.dataUrl) {
          this.loaded = true;

          this.imageFile = imageHelper.formatPhoto(this.dataUrl);

          const payload = {
            file: this.imageFile,
            onSuccess: this.changeAvatarOnSuccess,
            onFail: this.changeAvatarOnFail
          };

          this.changeAvatar(payload);
        } else {
          this.$notify({
            group: 'send-avatar',
            duration: 3000,
            speed: 300,
          });
        }
      },
      changeAvatarOnSuccess() {
        this.loaded = false;
        this.hideAvatar();
      },
      changeAvatarOnFail() {

      },
      saveProfile() {
        //document.getElementById('SpinnerPreload').style.display = 'block';
        this.loading=true;
        let data = new FormData();
        let dataStatus = new FormData();
        let activitys = JSON.stringify(this.chooseActivityArray);
        let statuses = JSON.stringify(this.chooseStatusArray);
        data.append('name', this.changeName || '');
        data.append('lastname', this.changeLastname || '');
        data.append('nickname', this.changeNickname || '');
        dataStatus.append('geo_id', this.changeLocationId || '');
        dataStatus.append('personal_status', this.changeStatus || '');
        data.append('gender', this.gender || '');
        if (this.changeEmail)
          data.append('email', this.changeEmail);
        if (this.changeBirth)
          data.append('birth_date', this.changeBirth);
        if (this.chooseFamilyArray)
          dataStatus.append('family_status', this.chooseFamilyArray);
        if (this.chooseActivityArray.length)
          dataStatus.append('activity_status', activitys);
        if (this.chooseStatusArray.length)
          dataStatus.append('social_status', statuses);


        axios.post('v1/me/settings/base/edit', data)
          .then(res => {
            axios.post('v1/me/settings/edit', dataStatus)
              .then(res => {
                axios.get('v1/me')
                  .then(res => {
                    this.loading = false;
                    this.updateAuthUser(res.data);
                    localStorage.setItem('user', JSON.stringify(res.data));
                    this.$notify({
                      group: 'change-profile',
                      duration: 3000,
                      speed: 300,
                    });
                    this.$router.push(`/u/${res.data.nickname}`)
                  });
              })
          })
      }
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/changeprofile.less';


  .crop-container__buttons-container {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-evenly;
  }

  .crop-container__button {
    width: 48%;
  }
</style>
