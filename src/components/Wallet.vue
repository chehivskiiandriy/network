<template>
  <div id="wallet">
    <div class="wallet-header">
      <div class="wallet-tabs">
        <div
          @click="changeActiveTab('wallet')"
          class="wallet-header--item"
          :class="{'active': activeTab === 'wallet'}">
          <i :class="walletIcon"></i>
          <p>{{$lang.variables.wallet}}</p>
        </div>
        <div
          @click="changeActiveTab('gifts')"
          class="wallet-header--item"
          :class="{'active': activeTab === 'gifts'}">
          <i class="icon-gift"></i>
          <p>{{$lang.variables.gifts}}</p>
        </div>
      </div>
      <div class="my-balance">
        <span v-text="$lang.variables.yourBalance" class="my-current-balance"></span>
        <span class="my-balance-block">
          <img
          class="my-balance-img"
          src="http://storage.innet.club/img/default/R-coin.png">
          <span
            class="count-balance"
            v-text="currentBalance"></span>
        </span>
        <span class="my-balance-block">
          <img
            class="my-balance-img my-balance-img-premium"
            src="https://media.inrating.top/storage/img/icons/gift_icons/high_res/42.png">
          <span
            class="count-balance"
            v-text="giftGoldAmount"></span>
        </span>
        <span class="my-balance-block">
          <img
            class="my-balance-img my-balance-img-premium"
            src="https://media.inrating.top/storage/img/icons/gift_icons/high_res/41.png">
          <span
            class="count-balance"
            v-text="giftCrownAmount"></span>
        </span>
      </div>
    </div>
    <div class="wallet-content">
      <in-wallet-presents
        v-if="activeTab === 'gifts'"
        :currentBalance="currentBalance"/>
      <in-wallet-money v-else />
    </div>
  </div>
</template>
<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex';

  import {
    moduleName as walletModule,
    ACTIVE_TAB,
    CHANGE_ACTIVE_TAB,
    FETCH_WALLET_INFO,
    CURRENT_BALANCE,
    GIFT_CROWN_AMOUNT,
    GIFT_GOLD_AMOUNT
  } from "Store/modules/wallet";

  import WalletMoney from 'ComponentsVue/wallet/WalletMoney';
  import WalletPresents from 'ComponentsVue/wallet/WalletPresents';

  export default {
    components: {
      inWalletMoney: WalletMoney,
      inWalletPresents: WalletPresents
    },
    computed: {
      ...mapGetters({
        activeTab: walletModule + ACTIVE_TAB,
        currentBalance: walletModule + CURRENT_BALANCE,
        giftGoldAmount: walletModule + GIFT_GOLD_AMOUNT,
        giftCrownAmount: walletModule + GIFT_CROWN_AMOUNT
      }),
      walletIcon() {
        return this.activeTab === 'gifts' ? 'icon-dollar' : 'icon-dollar-f'
      }
    },
    mounted(){
      this.fetchWalletInfo();

      this.$root.$on('changeTabToWallet', () => {
        this.changeActiveTab('wallet');
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      });

      if (this.$route.query.wallet) {
        this.changeActiveTab('wallet');
      }
    },
    methods: {
      ...mapActions({
        fetchWalletInfo: walletModule + FETCH_WALLET_INFO
      }),
      ...mapMutations({
        changeActiveTab: walletModule + CHANGE_ACTIVE_TAB
      })
    },
    head: {
      title(){
        return {
          inner: this.$lang.variables.wallet
        }
      }
    }
  }
</script>
<style lang='less'>
  @import '~LessStyle/wallet.less';
</style>
