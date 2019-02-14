<template>
  <in-transition-component name="translateX">
    <div
      ref="searchPeople"
      class="wallet-present-send-modal money-send-input-coins-modal">
      <header class="wallet-present-send-modal-header">
        <div
          @click="goBack"
          class="wallet-present-send-modal-header-back">
          <i class="icon-left-f"></i>
        </div>
        <div class="wallet-present-send-modal-header-content">
          {{$lang.variables.sendAGift}}
        </div>
      </header>

      <div
        class="wallet-present-send-modal-container">
        <div class="wallet-present-send-modal-current-balance">
          <span>{{$lang.variables.yourBalance}} </span>
          <img
            class="present-coin"
            src="http://storage.innet.club/img/default/R-coin.png">
          <span>{{currentBalance}} INCoins</span>
        </div>
        <div class="selected-users">
          <in-user-card
            v-for="(user, index) in selected"
            :key="user.id">
            <div class="user-card">
              <div class="user-card-avatar">
                <img
                  class="user-card-avatar-preview"
                  :src="user.avatar_image.url_medium">
              </div>
              <div class="user-card-info user-card-info-small">
                <div class="user-card-info-container">
                  <in-nickname tag="p" class="user-card-nickname" :status="user.status">{{user.nickname}}</in-nickname>
                  <p class="user-card-name">
                    <span v-text="user.name"></span>
                    <span v-text="user.lastname"></span>
                  </p>
                </div>
              </div>
              <div class="present-sum">
                <img
                  class="present-coin"
                  src="http://storage.innet.club/img/default/R-coin.png">
                <input
                  type="number"
                  min="1"
                  :ref="'coins' + index"
                  @keyup="countSumCoins"
                  v-model="user.coins"
                  class="present-money-input"
                  :class="{error: user.coins < 1 || !isInteger(+user.coins)}">
              </div>
            </div>
          </in-user-card>
        </div>

        <div class="present-send-coins">
          <span>{{$lang.variables.total}}:</span>
          <img
            class="present-coin"
            src="http://storage.innet.club/img/default/R-coin.png">
          <span>{{sendSum}} INCoins</span>
        </div>
        <button
          type="button"
          :disabled="currentBalance < sendSum || invalidInputCoins"
          @click="openConfirmation"
          class="send-coins">{{$lang.variables.send}}
        </button>
      </div>

      <in-confirmation-present-send-modal
        :show="isShowConfirmationPresentModal"
        :gift="selectedGift"
        :selected="selected"
        :sendSum="sendSum"
        @confirm="sendCoins"
        @cancel="cancelSend"/>
    </div>
  </in-transition-component>
</template>

<script>
  import {mapMutations} from 'vuex';

  import {
    moduleName as walletModule,
    CHANGE_CURRENT_BALANCE,
  } from "Store/modules/wallet";
  import ConfirmationPresentSendModal from 'ComponentsVue/wallet/ConfirmationPresentSendModal';

  export default {
    name: "MoneySendInputCoinsModal",
    props: {
      currentBalance: Number,
      selected: Array,
      selectedGift: [Object, null]
    },
    components: {
      inConfirmationPresentSendModal: ConfirmationPresentSendModal,
    },
    data() {
      return {
        sendSum: 0,
        invalidInputCoins: false,
        isShowConfirmationPresentModal: false
      }
    },
    mounted() {
      this.$refs.coins0[0].focus();
      this.countSumCoins();
    },
    methods: {
      ...mapMutations({
        changeCurrentBalance: walletModule + CHANGE_CURRENT_BALANCE
      }),
      openConfirmation() {
        this.isShowConfirmationPresentModal = true;
      },
      cancelSend() {
        this.isShowConfirmationPresentModal = false;
      },
      goBack() {
        this.$emit('hide-money-send-input-coins-modal');
      },
      isInteger(number) {
        return (number ^ 0) === number;
      },
      async sendCoins() {
        if (this.currentBalance >= this.sendSum && !this.loading) {
          this.loading = true;

          let ids = [];
          for (let i = 0; i < this.selected.length; i++) {
            ids.push({
              user_id: this.selected[i].id,
              coins: this.selected[i].coins
            });
          }

          const data = new FormData();
          data.append('ids', JSON.stringify(ids));

          try {
            this.cancelSend();
            await this.$api.gifts.sendCoins(data);

            this.loading = false;

            this.$notify({
              group: 'money-send',
              duration: 3000,
              speed: 300,
            });

            this.cancelSend();
            this.$emit('money-send');
          } catch (e) {
            this.loading = false;

            this.$notify({
              group: 'action-error',
              duration: 3000,
              speed: 300,
            });
          }
        }
      },
      countSumCoins() {
        let sum = 0;
        let flag = true;

        for (let i = 0; i < this.selected.length; i++) {
          let tmp = +this.selected[i].coins;

          if (tmp < 1 || !this.isInteger(tmp)) {
            this.invalidInputCoins = true;
            flag = false
          }
          sum += tmp;
        }
        if (flag) this.invalidInputCoins = false;

        this.sendSum = sum;
      },
    }
  }
</script>

<style lang="less">
  @import "~LessStyle/variables.less";

  .money-send-input-coins-modal {
    z-index: 14010;

    .selected-users {
      display: flex;
      flex-wrap: wrap;
      margin: 5px;

      .present-sum {
        width: 45vw;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .present-coin {
          height: 18px;
          margin-right: 4px;
        }

        .present-money-input {
          border: 1px solid @contest-list-text-color;
          border-radius: 5px;
          width: 80%;
          padding: 6px 10px;
          color: #000;
          max-width: 100px;
          margin: 0 3px;
          font-size: 16px;

          &.error {
            border: 1px solid @red;
          }
        }
      }
    }

    .present-send-coins {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 20px 0;
      margin: 0;
      font-weight: bold;

      .present-coin {
        height: 18px;
        margin: 0 4px 2px;
      }
    }

    .send-coins {
      padding: 8px 10px;
      background: @grad;
      width: 40%;
      display: flex;
      justify-content: center;
      color: @white;
      border-radius: 3px;
      margin: 0 auto;

      &:disabled {
        background: @light__grey;
        border: 1px solid @light__grey;
      }
    }
  }
</style>
