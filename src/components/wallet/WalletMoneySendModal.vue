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
        <div class="wallet-present-send-modal-current-balance">
          <span>{{$lang.variables.yourBalance}} </span>
          <img
            class="present-coin"
            src="http://storage.innet.club/img/default/R-coin.png">
          <span>{{currentBalance}} INCoins</span>
        </div>
        <in-search-people-modal
          :bottom="bottom"
          withCoins
          @select-user="selectUser"/>

        <div
          @click="nextStep"
          class="wallet-present-send-modal-create"
          :class="{'wallet-present-send-modal-create-active' : selected.length > 0}">
          {{$lang.variables.further}}
        </div>
      </div>

      <in-money-send-input-coins-modal
        v-if="isShowMoneySendInputCoinsModal"
        :selected="selected"
        :currentBalance="currentBalance"
        :selectedGift="selectedGift"
        @money-send="hideAllModals"
        @hide-money-send-input-coins-modal="hideMoneySendInputCoinsModal"/>
    </div>
  </in-transition-component>
</template>

<script>
  import {mapGetters} from 'vuex';

  import {
    moduleName as walletModule,
    CURRENT_BALANCE,
    SELECTED_USER
  } from "Store/modules/wallet";
  import SearchPeopleModal from 'ComponentsVue/search/SearchPeopleModal';
  import MoneySendInputCoinsModal from 'ComponentsVue/wallet/MoneySendInputCoinsModal';

  export default {
    name: "WalletMoneySendModal",
    components: {
      inSearchPeopleModal: SearchPeopleModal,
      inMoneySendInputCoinsModal: MoneySendInputCoinsModal
    },
    props: {
      selectedGift: [Object, null]
    },
    data() {
      return {
        selected: [],
        loading: false,
        isShowMoneySendInputCoinsModal: false,
        bottom: false
      }
    },
    computed: {
      ...mapGetters({
        currentBalance: walletModule + CURRENT_BALANCE,
        selectedUser: walletModule + SELECTED_USER
      })
    },
    mounted() {
      if(this.selectedUser) {
        this.nextStep();
      }
    },
    updated() {
      this.bottom = false;
    },
    methods: {
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
        this.$emit('hide-money-send-modal');
      },
      nextStep() {
        this.isShowMoneySendInputCoinsModal = true;
      },
      hideMoneySendInputCoinsModal() {
        this.isShowMoneySendInputCoinsModal = false;
      },
      hideAllModals() {
        this.$emit('money-send');
        this.hideMoneySendInputCoinsModal();
      }
    }
  }
</script>

<style lang="less">
  @import "~LessStyle/variables.less";

  .wallet-present-send-modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 14005;
    background: #fff;
    overflow-y: scroll;
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

    &-current-balance {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 10px 0;
      border-bottom: 1px solid @middle_grey;
      margin: 0;

      .present-coin {
        height: 18px;
        margin: 0 4px 2px;
      }
    }
  }
</style>
