<template>
  <in-transition-component name="translateX">
    <div class="wallet-presents-user-modal">
      <header class="wallet-presents-user-modal-header">
        <div
          @click="goBack"
          class="wallet-presents-user-modal-header-back">
          <i class="icon-left-f"></i>
        </div>
        <div class="wallet-presents-user-modal-header-content">
          {{$lang.variables.sendAGift}}
        </div>
      </header>

      <in-wallet-presents
        :currentBalance="currentBalance"
        @hide-modal="goBack"/>
    </div>
  </in-transition-component>
</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex';

  import {
    moduleName as walletModule,
    FETCH_WALLET_INFO,
    CURRENT_BALANCE,
    CHANGE_SELECTED_USER
  } from "Store/modules/wallet";

  import WalletPresents from 'ComponentsVue/wallet/WalletPresents';

  export default {
    name: "WalletPresentsUserModal",
    components: {
      inWalletPresents: WalletPresents
    },
    computed: {
      ...mapGetters({
        currentBalance: walletModule + CURRENT_BALANCE,
      }),
    },
    mounted() {
      this.fetchWalletInfo();
    },
    beforeDestroy() {
      this.changeSelectedUser(null);
    },
    methods: {
      ...mapActions({
        fetchWalletInfo: walletModule + FETCH_WALLET_INFO
      }),
      ...mapMutations({
        changeSelectedUser: walletModule + CHANGE_SELECTED_USER
      }),
      goBack() {
        this.$emit('hide-present-modal');
      }
    }
  }
</script>

<style lang="less" scoped>
  .wallet-presents-user-modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 14005;
    background: #fff;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    padding-top: 40px;

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
  }
</style>
