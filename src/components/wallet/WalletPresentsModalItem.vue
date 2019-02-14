<template>
  <div class="wallet-presents-modal-item">
    <div class="wallet-presents-modal-item-top">
      <div class="item-present-container">
        <div
          class="item-present-container-image"
          :class="present.status.toLowerCase()">
          <img :src="present.image">
        </div>
      </div>
      <div class="item-present-title">
        <div class="item-present-name">{{present.name}}</div>
        <div
          class="item-present-status"
          :class="present.status.toLowerCase()">{{present.status.toUpperCase()}}
        </div>
        <div
          v-if="present.bonus !== '0'"
          class="item-present-bonus">{{present.bonus}}
        </div>
        <div
          v-if="presentDuration"
          class="item-present-duration">
          <i class="icon-time"></i>
          <span>{{presentDuration}}</span>
        </div>
      </div>
    </div>

    <div class="wallet-presents-modal-item-description">
      {{present.description}}
    </div>

    <div class="wallet-presents-modal-item-send">
      <div
        v-if="canSend"
        @click="send"
        class="present-send">
        <span class="present-send-text">{{sendText}}</span>
        <span
          v-if="present.cost !== 0"
          class="present-cost">
          <img src="http://storage.innet.club/img/default/R-coin.png">
          <span>{{present.cost}}</span>
        </span>
      </div>

      <div v-else class="present-send-buy">
        <div
          class="present-buy"
          @click="buyCoins">
            <span class="present-buy-cost">
              <div class="item">
                <img
                  class="present-coin"
                  src="http://storage.innet.club/img/default/R-coin.png">
                <span class="count">{{countInCoins}} +</span>
                <div class="present-image-small">
                  <img
                    class="present-image"
                    :src="present.image">
                </div>
              </div>
              <div class="item right">
                <div class="price">{{buyCoinsPrice}}</div>
                <i class="icon-right-f"></i>
              </div>
            </span>
        </div>
        <div class="attention">
          <span v-if="present.id !== 43">{{$lang.variables.giftAttention}} {{countInCoins}}</span>
          <span class="attention-small">{{attentionText}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  import {
    moduleName as walletModule,
    CURRENT_BALANCE
  } from "Store/modules/wallet";

  export default {
    name: "WalletPresentsModalItem",
    props: ['present', 'keeperId', 'keeperNickname'],
    computed: {
      ...mapGetters({
        currentBalance: walletModule + CURRENT_BALANCE
      }),
      duration() {
        return this.present && this.present.properties && this.present.properties.duration
      },
      presentDuration() {
        if (!this.duration) {
          return ''
        }
        if (this.duration.d) {
          return this.duration.d + this.$lang.variables.days
        }
        if (this.duration.h) {
          return this.duration.h + this.$lang.variables.hours
        }
      },
      sendText() {
        return this.present.id === 43 ? this.$lang.variables.sendMoney : this.$lang.variables.sendAGift
      },
      countInCoins() {
        return this.present.id === 41 ? '5000 INC' : '20000 INC'
      },
      attentionText() {
        return this.present.id === 43 ? this.$lang.variables.giftSmallAttentionCoins : this.$lang.variables.giftSmallAttention
      },
      buyCoinsPrice() {
        return this.present.id === 43 ? '50 $' : '200 $'
      },
      canSend() {
        return !this.present.extra || this.present.extra.can_send === true
      }
    },
    methods: {
      send() {
        if (this.present.id === 43) {
          this.openPresentSearchMoney();
        } else {
          this.openPresentSearch();
        }
      },
      openPresentSearch() {
        if (this.currentBalance < this.present.cost) {
          this.$notify({
            group: 'not-enough-money',
            duration: 3000,
            speed: 300,
          });
        } else {
          this.$emit('open-present-send-modal', this.present);
        }
      },
      openPresentSearchMoney() {
        if (this.currentBalance < 20000) {
          this.$notify({
            group: 'not-enough-money',
            duration: 3000,
            speed: 300,
          });
        } else {
          this.$emit('open-money-send-modal');
        }
      },
      async buyCoins() {
        const id = this.present.id === 41 ? 4 : 6;

        if (this.$userStatus(this.authUser)) {
          const {data: {url}} = await this.$api.user.buyCoinPack({params: {coin_pack_id: id}});
          window.location.href = url;
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~LessStyle/variables.less";

  .wallet-presents-modal-item {
    padding-top: 30px;
    min-height: calc(~'100vh - 50px');
    box-sizing: border-box;

    &-top {
      display: flex;
      justify-content: center;
      align-items: center;

      .item-present {
        &-container {
          width: 50vw;
          height: 44vw;
          display: flex;
          justify-content: center;

          &-image {
            width: calc(~'44vw - 4px');
            height: calc(~'44vw - 4px');
            display: flex;
            justify-content: center;
            align-items: center;
            border: double 2px transparent;
            border-radius: 5px;
            background-origin: border-box;
            background-clip: content-box, border-box;

            img {
              width: calc(~'44vw - 4px');
              height: calc(~'44vw - 4px');
            }

            &.gold {
              background-image: linear-gradient(white, white), linear-gradient(-112deg, #E0B447 0%, #FFDF5D 14%, #D0A74C 31%, #FFE694 41%, #E5BE25 79%, #FFE682 84%, #DFB134 100%);
            }

            &.platinum {
              background-image: linear-gradient(white, white), linear-gradient(54deg, #C9D0D7 0%, #F6F6F6 21%, #D4DCDF 36%, #EEEEEE 38%, #D3D4DA 61%, #F8F8F8 75%, #CFD0DD 100%);
            }

            &.vip {
              background-image: linear-gradient(white, white), linear-gradient(56deg, #5AC6C5 0%, #5EC7C6 16%, #96EAE9 21%, #5FC7C6 40%, #B2F8F8 61%, #60C8C7 90%, #5EC7C6 100%);
            }

            &.premium {
              background-image: linear-gradient(white, white), linear-gradient(56deg, #636362 0%, #222221 16%, #5C5C5B 21%, #222221 40%, #666565 61%, #222221 90%, #636362 100%);
            }
          }

        }

        &-title {
          width: 50vw;
          height: 44vw;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-evenly;
        }

        &-name {
          font-size: 5.5vw;
        }

        &-status {
          padding: 4px 0;
          border-radius: 5px;
          width: 36vw;
          font-size: 3.5vw;
          -webkit-animation: AnimationName 2s linear infinite;
          -moz-animation: AnimationName 2s linear infinite;
          animation: AnimationName 3s linear infinite;
          background-size: 200% 100%;
          animation-fill-mode: forwards;

          @-webkit-keyframes AnimationName {
            0% {
              background-position: 0 0
            }
            100% {
              background-position: 200% 0
            }
          }
          @-moz-keyframes AnimationName {
            0% {
              background-position: 0 0
            }
            100% {
              background-position: 200% 0
            }
          }
          @keyframes AnimationName {
            0% {
              background-position: -100% 50%
            }
            100% {
              background-position: 100% 50%
            }
          }

          &.gold {
            background-image: linear-gradient(-112deg, #FFE682, #DFB134, #FFE682);
          }

          &.platinum {
            background-image: linear-gradient(54deg, #D3D4DA, #F8F8F8, #D3D4DA);
          }

          &.vip {
            background-image: linear-gradient(56deg, #5dbdbc, #9aeeed, #5dbdbc);
          }

          &.premium {
            color: #fff;
            background-image: linear-gradient(286deg, #666565, #222221, #666565);
          }
        }

        &-bonus {
          font-size: 6vw;
          .text-grad();
        }

        &-duration {
          display: flex;
          align-items: center;

          font-size: 4vw;
          .text-grad();

          .icon-time {
            font-size: 6vw;
            padding-right: 5px;
            .text-grad();
          }
        }
      }
    }

    &-description {
      font-size: 3.4vw;
      padding: 7vw 3.5vw;
    }

    &-send {
      .present-send {
        background: @grad;
        width: 80%;
        padding: 2.4vw;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        border-radius: 5px;
        color: #fff;

        &-text {
          font-size: 4vw;
        }

        .present-cost {
          display: flex;
          align-items: flex-end;
          font-size: 4vw;
          line-height: 4vw;
          font-weight: bold;

          img {
            height: 4.8vw;
            padding: 0 10px 0 15px;
          }
        }
      }

      .present-send-buy {
        .present-buy {
          width: 85%;
          padding: 0;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          border: 2px solid transparent;
          border-radius: 5px;
          background-origin: border-box;
          background-clip: content-box, border-box;
          background-image: linear-gradient(white, white), @grad;

          @media(max-width: 350px) {
            width: 90%;
          }

          &-cost {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 5px;
            box-sizing: border-box;

            .item {
              display: flex;
              align-items: center;

              &.right {
                .price {
                  color: #fff;
                  background: @grad;
                  border-radius: 5px;
                  font-weight: bold;
                  height: 8vw;
                  padding: 0 10px;
                  vertical-align: middle;
                  line-height: 8vw;
                  font-size: 4.5vw;
                }

                .icon-right-f {
                  padding-left: 7px;
                  font-size: 16px;
                  .text-grad();
                }
              }
            }

            .count {
              padding: 0 7px;
              font-size: 4.5vw;
            }

            .present-image-small {
              width: 8vw;
              height: 8vw;
              border: 1px solid @middle_grey;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }

        .present-coin {
          height: 8vw;
        }

        .present-image {
          height: 7.5vw;
        }
      }

      .attention {
        color: @red;
        margin: 20px 40px;
        font-size: 3.5vw;

        &-small {
          font-size: 2.7vw;
          display: block;
          margin-top: 30px;
          font-style: italic;
          color: @red;
        }
      }
    }
  }
</style>
