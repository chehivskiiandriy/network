<template>
  <in-transition-component name="translateX">
    <div class="wallet-presents-modal">
      <header class="wallet-presents-modal-header">
        <div
          @click="goBack"
          class="wallet-presents-modal-header-back">
          <i class="icon-left-f"></i>
        </div>
        <div class="wallet-presents-modal-header-content">
          {{$lang.variables.sendAGift}}
        </div>
      </header>

      <div class="wallet-presents-modal-container">
        <swiper
          ref="slider"
          :options="swiperOption">
          <swiper-slide v-for="present in presents">
            <in-wallet-presents-modal-item
              :present="present"
              @open-present-send-modal="openPresentSendModal"
              @open-money-send-modal="openMoneySendModal"/>
          </swiper-slide>
          <div
            class="swiper-pagination presents-pagination"
            slot="pagination"></div>
        </swiper>
      </div>
    </div>
  </in-transition-component>
</template>

<script>
  import {mapGetters} from 'vuex';

  import {
    moduleName as walletModule,
    PRESENTS
  } from "Store/modules/wallet";

  import WalletPresentsModalItem from 'ComponentsVue/wallet/WalletPresentsModalItem';

  export default {
    name: "WalletPresentsModal",
    props: {
      show: Boolean,
      activeSlide: Number
    },
    components: {
      inWalletPresentsModalItem: WalletPresentsModalItem
    },
    data() {
      return {
        swiperOption: {
          slidesPerView: 1,
          initialSlide: this.activeSlide,
          loop: true,
          pagination: {
            el: '.swiper-pagination'
          }
        },
      }
    },
    computed: {
      ...mapGetters({
        presents: walletModule + PRESENTS
      })
    },
    methods: {
      goBack() {
        this.$emit('hideModal');
      },
      openPresentSendModal(event) {
        this.$emit('open-present-send-modal', event);
      },
      openMoneySendModal() {
        this.$emit('open-money-send-modal');
      }
    }
  }
</script>

<style lang="less">
  @import "~LessStyle/variables.less";

  .wallet-presents-modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 14000;
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
      height: 100vh;
    }

    .swiper-pagination-bullet {
      border-radius: 2px;
      margin: 0 2px !important;
      background: @gray-grad;
    }

    .swiper-pagination-bullet-active {
      background: linear-gradient(to left top, #000fbc, #30c2be 50%);
    }

    .presents-pagination {
      top: 3px;
      left: 50% !important;
      transform: translateX(-50%);
      width: 100%;
      height: 0;
    }
  }
</style>
