<template>
  <div class="profile-gift-item">
    <div class="gift-sender-avatar gift-item-div">
      <router-link :to="'/u/'+gift.sender.nickname">
        <img
          class="gift-sender-avatar-img"
          :src="gift.sender.avatar_image.url_medium">
      </router-link>
      <div v-if="gift.sender.active_gift!=null">
        <img
          class="gift-sender-activegift"
          :src="gift.sender.active_gift.image"
          alt="">
      </div>
    </div>
    <div class="gift-item-sender gift-item-div">

      <b v-text="gift.sender.nickname"></b>
      <p class="gift-sender-message">{{$lang.variables.sentYouGift}}</p>
      <in-time :time="gift.created_at_timestamp"/>
      <in-gift-timer :gift="gift"/>

    </div>
    <div class="gift-item-avatar gift-item-div" @click="showGift">
      <img :src="gift.gift_model.image">
      <i v-if="gift.message" class="icon-letter-v-podarki"></i>
    </div>
    <div class="gift-item-timeout gift-item-div">
      <p>
        <i @click="chatCheck(gift.sender.id)" class="icon-letter"></i>
      </p>
      <p v-if="gift.sender.is_subscribed" @click="changeSubscribe">
        <i class="icon-plus-guy-f"></i>
      </p>
      <p v-else @click="changeSubscribe">
        <i class="icon-plus-guy"></i>
      </p>
    </div>
    <div class="gift-item-accept gift-item-div">
      <p v-if="gift.is_accepted === true">
        <span class="gift-accepted" v-text="$lang.variables.gift + $lang.variables.giftAccepted"></span>
      </p>
      <p v-if="gift.is_accepted === false && gift.is_outdated === true ">
        <span class="gift-notaccepted">{{$lang.variables.gift + $lang.variables.giftNotAccepted}}</span>
      </p>
      <div v-if="gift.is_accepted === false && gift.is_outdated === false ">
        <p @click="acceptGift">
          <span class="gift-acceptnow">{{$lang.variables.acceptAGift}}</span>
        </p>
      </div>
    </div>

    <div v-if="showPresent" class="bg-accept" @click="hideGift">
      <div
        class="present-accept present-modalheader"
        id=""
        v-if="showPresent && gift.gift_model!=null">
        <i
          class="goto-presents-accept icon-delete-f"
          @click="hideGift()"></i>
        <h2 class="present-modaltitle">
          Подарок от "{{gift.sender.nickname}}"
        </h2>
        <div class="present-modalcontainer">
          <div class="present-modalimage">
            <img :src="gift.gift_model.image">
          </div>
          <div class="present-modaltext">
            <p
              class="present-modalname"
              v-text="gift.gift_model.name"></p>
            <div
              class="present-modalstatus"
              :style="{ 'backgroundImage': 'url(http://storage.innet.club/img/default/'+ capitalizeString(gift.gift_model.status) +'.png)'  }">
              <span v-text="gift.gift_model.status"> </span>
              <!--<div class="present-blur"></div>-->
            </div>
            <p
              class="present-modalbonus"
              v-text="gift.gift_model.bonus"></p>
            <span
              class="present-duration"
              v-if="gift.gift_model.status==='platinum'">
              <i class="icon-clock"></i><span
              class="present-hours"
              v-text="gift.gift_model.properties.duration.d"></span> дней
            </span>
            <span
              class="present-duration"
              v-else>
                <i class="icon-clock"></i><span
              class="present-hours"
              v-text="gift.gift_model.properties.duration.h"></span> часа
            </span>
          </div>
          <div class="present-description">
            <p v-text="gift.gift_model.description"></p>
            <div
              v-if="gift.message"
              class="present-message">{{gift.message}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';
  import {mapActions} from 'vuex';

  import Vue from 'vue'
  import giftTimer from 'ComponentsVue/profile/content/ProfileGiftTimer'
  import {CHANGE_SUBSCRIBE_USER, moduleName as usersModule} from 'Store/modules/users/users';
  import {ACCEPT_GIFT, moduleName as userModule} from "Store/modules/authUser/user";

  Vue.component('in-gift-timer', giftTimer);
  export default {
    props: {
      gift: Object,
      authUser: Object
    },
    data() {
      return {
        showPresent: false
      }
    },
    methods: {
      ...mapActions({
        changeSubscribeUser: usersModule + CHANGE_SUBSCRIBE_USER,
        acceptGiftAction: userModule + ACCEPT_GIFT
      }),
      capitalizeString(string) {
        return string[0].toUpperCase() + string.slice(1);
      },
      showGift() {
        this.showPresent = true;
      },
      hideGift() {
        this.showPresent = false;
      },
      changeSubscribe() {
        const payload = {
          nickname: this.gift.sender.nickname,
          delete: this.gift.sender.is_subscribed ? '1' : '0',
          onRequest: this.onRequestSubscribe
        };

        this.changeSubscribeUser(payload);
      },
      onRequestSubscribe() {
        this.$notify({
          group: 'send-subscriber-request',
          duration: 3000,
          speed: 300,
        });
      },
      acceptGift() {
        if (this.gift.can_accept && !this.authUser.active_gift) {
          this.acceptGiftAction(this.gift.id);
          // let acceptedGift = {
          //   gift_id: this.gift.gift_model.id,
          //   sender_id: this.gift.sender.id,
          //   event_id: this.gift.id,
          // };
        }
        else {
          this.$notify({
              group: 'one-more-gift',
              duration: 3000,
              speed: 300,
            }
          )
        }
      },
      chatCheck(id) {
        if (this.$userStatus(this.authUser)) {
          if (this.authUser.id !== id) {
            axios.get('v1/me/chats/check?id=' + id)
              .then(res => {
                if (res.data.state)
                  this.$router.push('/messages/' + res.data.id);
                else
                  this.$router.push('/new-chat/' + id);
              })
          }
          else {
            this.$notify({
              group: 'write-to-you',
              duration: 3000,
              speed: 300,
            });
          }
        }


      },

    },
  }
</script>
<style lang="less">
  @import '~LessStyle/profileGift.less';
  @import '~LessStyle/presentmodal.less';

  .present-accept {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    height: auto;
    z-index: 1000;
    background: #fff;
    border-radius: 10px;

    .present-modaltitle {
      font-size: 20px;
    }
  }

  .bg-accept {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
  }
</style>

