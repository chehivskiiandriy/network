<template>
  <div
    class="wallet-presents-container"
    :class="{'modal-presents-container': $route.path.indexOf('/u/') !== -1 || $route.path.indexOf('/story/') !== -1}">
    <h2>GOLD</h2>
    <in-present-item
      v-for="(present, index) in goldPresents"
      :present="present"
      :index="index"
      @show-presents-modal="showPresentsModal"/>
    <h2>PLATINUM</h2>
    <in-present-item
      v-for="(present, index) in platinumPresents"
      :present="present"
      :index="3 + index"
      @show-presents-modal="showPresentsModal"/>
    <h2>VIP</h2>
    <in-present-item
      v-for="(present, index) in vipPresents"
      :present="present"
      :index="6 + index"
      @show-presents-modal="showPresentsModal"/>
    <h2>Premium</h2>
    <in-present-item
      v-for="(present, index) in premiumPresents"
      :present="present"
      :index="9 + index"
      @show-presents-modal="showPresentsModal"/>

    <in-wallet-presents-modal
      v-if="isShowPresentsModal"
      :show="isShowPresentsModal"
      :activeSlide="activeSlide"
      @hideModal="hideModal"
      @open-present-send-modal="openPresentSendModal"
      @open-money-send-modal="openMoneySendModal"/>

    <in-wallet-present-send-modal
      v-if="isShowPresentSendModal"
      :selectedGift="selectedGift"
      @hide-present-send-modal="hidePresentSendModal"
      @present-send="hideAllModals"/>

    <in-wallet-money-send-modal
      v-if="isShowMoneySendModal"
      :selectedGift="premiumPresents[2]"
      @hide-money-send-modal="hideMoneySendModal"
      @money-send="hideAllMoneyModals"
    />
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';

  import {
    moduleName as walletModule,
    FETCH_PRESENTS,
    GOLD_PRESENTS,
    PLATINUM_PRESENTS,
    VIP_PRESENTS,
    PREMIUM_PRESENTS
  } from "Store/modules/wallet";
  import PresentItem from 'ComponentsVue/wallet/presentItem.vue'
  import WalletPresentsModal from 'ComponentsVue/wallet/WalletPresentsModal';
  import WalletPresentSendModal from 'ComponentsVue/wallet/WalletPresentSendModal';
  import WalletMoneySendModal from 'ComponentsVue/wallet/WalletMoneySendModal'

  export default {
    name: "WalletPresents",
    props: ['currentBalance'],
    components: {
      inPresentItem: PresentItem,
      inWalletPresentsModal: WalletPresentsModal,
      inWalletPresentSendModal: WalletPresentSendModal,
      inWalletMoneySendModal: WalletMoneySendModal
    },
    data() {
      return {
        soloPresent: {},
        soloType: '',
        isShowPresentsModal: false,
        activeSlide: 0,
        isShowPresentSendModal: false,
        selectedGift: null,
        isShowMoneySendModal: false
      }
    },
    computed: {
      ...mapGetters({
        goldPresents: walletModule + GOLD_PRESENTS,
        platinumPresents: walletModule + PLATINUM_PRESENTS,
        vipPresents: walletModule + VIP_PRESENTS,
        premiumPresents: walletModule + PREMIUM_PRESENTS
      })
    },
    mounted() {
      if (!this.goldPresents) {
        this.fetchPresents();
      }


    },
    methods: {
      ...mapActions({
        fetchPresents: walletModule + FETCH_PRESENTS
      }),
      showPresentsModal(index) {
        this.activeSlide = index;
        this.isShowPresentsModal = true;
      },
      hideModal() {
        this.isShowPresentsModal = false;
        this.$emit('hide-modal');
      },
      openPresentSendModal(event) {
        this.selectedGift = event;
        this.isShowPresentSendModal = true;
      },
      hidePresentSendModal() {
        this.isShowPresentSendModal = false;
        this.selectedGift = null;
      },
      hideAllModals() {
        this.hideModal();
        this.hidePresentSendModal();
      },
      openMoneySendModal() {
        this.isShowMoneySendModal = true;
      },
      hideMoneySendModal() {
        this.isShowMoneySendModal = false;
      },
      hideAllMoneyModals() {
        this.hideModal();
        this.hideMoneySendModal();
      }
    }
  }
</script>

<style lang="less" scoped>
  .modal-presents-container {
    padding-bottom: 50px;
  }

  .wallet-presents-container {
    padding-bottom: 60px;
  }

  .wallet-presents-container > h2 {
    text-align: center;
    margin: 5px auto;
  }
</style>
