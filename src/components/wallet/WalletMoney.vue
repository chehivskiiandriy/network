<template>
  <div id="money">
    <div
      class="money-item"
      v-for="coin in coinPacks"
      :key="coin.id">
      <div
        class="money-incoins"
        @click="buyCoins(coin.id)">
        <div class="coins-money">
          <img src="http://storage.innet.club/img/default/R-coin.png"/>
          {{coin.value}} INC
        </div>

        <span v-if="coin.bonus">
          <template v-if="coin.bonus.gift_gold_amount">
            + <img src="https://media.inrating.top/storage/img/icons/gift_icons/high_res/42.png">
            <span v-if="coin.bonus.gift_gold_amount>1" class="amount-count">X {{coin.bonus.gift_gold_amount}}</span>
          </template>

          <template v-if="coin.bonus.gift_crown_amount">
            + <img src="https://media.inrating.top/storage/img/icons/gift_icons/high_res/41.png">
          </template>
        </span>
      </div>
      <div
        class="money-bye-arrow"
        @click="buyCoins(coin.id)">
        <div class="money-bye">
          <span>{{coin.price}} $</span>
        </div>
        <div class="money-arrow">
          <i class="icon-right-f"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';

  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";
  import {
    moduleName as walletModule,
    FETCH_COIN_PACKS,
    COIN_PACKS
  } from "Store/modules/wallet";

  export default {
    name: "WalletMoney",
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER,
        coinPacks: walletModule + COIN_PACKS
      }),
    },
    mounted() {
      if(!this.coinPacks) {
        this.fetchCoinPacks();
      }
    },
    methods: {
      ...mapActions({
        fetchCoinPacks: walletModule + FETCH_COIN_PACKS
      }),
      async buyCoins(id){
        if (this.$userStatus(this.authUser)) {
          const { data: { url } } = await this.$api.user.buyCoinPack({ params: { coin_pack_id: id } });
          window.location.href = url;
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/wallet.less';
</style>
