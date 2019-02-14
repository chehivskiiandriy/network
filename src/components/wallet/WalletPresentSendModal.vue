<template>
  <in-transition-component name="translateX">
    <div
      @scroll="handleBottomVisible"
      ref="searchPeople"
      class="wallet-present-send-modal">
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
        <div class="wallet-present-send-modal-message">
          <textarea
            :placeholder="$lang.variables.enterMessage"
            v-model="message"
            class="wallet-present-send-modal-message-input"></textarea>
        </div>

        <in-search-people-modal
          :bottom="bottom"
          @select-user="selectUser"/>

        <div
          @click="openConfirmation"
          class="wallet-present-send-modal-create"
          :class="{'wallet-present-send-modal-create-active' : selected.length > 0}">
          {{$lang.variables.send}}
        </div>
      </div>

      <in-confirmation-present-send-modal
        :show="isShowConfirmationPresentModal"
        :gift="selectedGift"
        :selected="selected"
        :message="message"
        @confirm="sendGifts"
        @cancel="cancelSend"/>
    </div>
  </in-transition-component>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex';

  import {
    moduleName as walletModule,
    CURRENT_BALANCE,
    GIFT_GOLD_AMOUNT,
    GIFT_CROWN_AMOUNT,
    CHANGE_CURRENT_BALANCE,
    CHANGE_CURRENT_GOLD_BALANCE,
    CHANGE_CURRENT_CROWN_BALANCE
  } from "Store/modules/wallet";
  import SearchPeopleModal from 'ComponentsVue/search/SearchPeopleModal';
  import ConfirmationPresentSendModal from 'ComponentsVue/wallet/ConfirmationPresentSendModal';

  export default {
    name: "WalletPresentSendModal",
    components: {
      inSearchPeopleModal: SearchPeopleModal,
      inConfirmationPresentSendModal: ConfirmationPresentSendModal
    },
    props: {
      selectedGift: [Object, null]
    },
    data() {
      return {
        selected: [],
        message: '',
        loading: false,
        isShowConfirmationPresentModal: false,
        bottom: false
      }
    },
    computed: {
      ...mapGetters({
        currentBalance: walletModule + CURRENT_BALANCE,
        giftGoldAmount: walletModule + GIFT_GOLD_AMOUNT,
        giftCrownAmount: walletModule + GIFT_CROWN_AMOUNT
      })
    },
    updated() {
      this.bottom = false;
    },
    methods: {
      ...mapMutations({
        changeCurrentBalance: walletModule + CHANGE_CURRENT_BALANCE,
        changeCurrentGoldBalance: walletModule + CHANGE_CURRENT_GOLD_BALANCE,
        changeCurrentCrownBalance: walletModule + CHANGE_CURRENT_CROWN_BALANCE
      }),
      handleBottomVisible() {
        this.bottom = this.bottomVisible();
      },
      bottomVisible() {
        const {clientHeight, scrollTop, scrollHeight} = this.$refs.searchPeople;
        return (clientHeight + scrollTop + 400) >= scrollHeight;
      },
      selectUser(value) {
        this.selected = value;
      },
      goBack() {
        this.$emit('hide-present-send-modal');
      },
      openConfirmation() {
        if (this.selected.length === 0 ||
          (this.selectedGift.id === 41 && this.selected.length > this.giftGoldAmount)
          || (this.selectedGift.id === 42 && this.selected.length > this.giftCrownAmount)
          || (this.selectedGift.cost * this.selected.length > this.currentBalance)) {
          this.$notify({
            group: 'not-enough-money',
            duration: 3000,
            speed: 300,
          });
          return;
        }

        this.isShowConfirmationPresentModal = true;
      },
      cancelSend() {
        this.isShowConfirmationPresentModal = false;
      },
      async sendGifts() {
        if (this.selected.length > 0 && !this.loading) {
          this.loading = true;

          let ids = [];

          for (let i = 0; i < this.selected.length; i++) {
            ids.push(this.selected[i].id);
          }

          const data = new FormData();
          data.append('gift_id', this.selectedGift.id);
          data.append('message', this.message);
          data.append('receiver_ids', JSON.stringify(ids));

          try {
            await this.$api.gifts.send(data);

            this.$notify({
              group: 'gift-send',
              duration: 3000,
              speed: 300,
            });
            if (this.selectedGift.id === 41) {
              this.changeCurrentGoldBalance(-this.selected.length);
            } else if (this.selectedGift.id === 42) {
              this.changeCurrentCrownBalance(-this.selected.length);
            } else {
              this.changeCurrentBalance(-this.selectedGift.cost * this.selected.length);

            }
            this.$emit('present-send');
          } catch (e) {
            this.loading = false;

            this.$notify({
              group: 'action-error',
              duration: 3000,
              speed: 300,
            });
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~LessStyle/variables.less";

  .wallet-present-send-modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 14005;
    background: #fff;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    &-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;

      &-back {
        position: absolute;
        width: 40px;
        height: 40px;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon-left-f {
          font-size: 20px;
        }
      }
    }

    &-container {
      width: 100vw;
      padding-top: 40px;
      box-sizing: border-box;
    }

    &-message {
      width: calc(~'100vw - 10px');
      margin: 5px;
      padding-top: 5px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;

      ::-webkit-scrollbar {
        width: 0;
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: #FF0000;
      }

      &-input {
        border: 2px solid @contest-list-text-color;
        font-size: 4vw;
        width: 100%;
        resize: none;
        overflow: auto;
        padding: 5px;
        height: 14vh;
        border-radius: 5px;
      }
    }

    &-create {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      border-top: 1px solid @middle_grey;
      background: @white;
      text-align: center;
      padding: 15px 0;
      font-weight: bold;
      color: @middle_grey;

      &-active {
        color: @contest-list-text-color;
      }
    }
  }
</style>
