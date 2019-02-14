<template>
  <in-transition-component name="timeout">
    <in-settings-menu
      v-show="show"
      class="settings-menu-block">
      <in-transition-component name="fade">
        <div
          v-if="show"
          @click="cancelHandler"
          class="settings-menu-block-bg"></div>
      </in-transition-component>
      <in-transition-component name="translateY">
        <div
          v-if="show"
          class="settings-menu-block-container">
          <div class="settings-menu-block-section settings-menu-block-center">
            <div class="settings-menu-block-item">
              <div class="gift-for">{{$lang.variables.giftFor}} {{nicknames}}</div>
              <div class="gift-image">
                <img :src="gift.image">
              </div>
              <div
                v-if="message"
                class="gift-message">
                {{message}}
              </div>
              <div v-if="giftForCoins" class="coins-count">
                <img
                  class="coins-count-img"
                  :src="balanceImage">
                <span class="count">{{countInCoins}}</span>
                <span>INCoins</span>
              </div>
            </div>
            <div
              class="settings-menu-block-item"
              @click="confirmHandler">{{$lang.variables.send}}
            </div>
          </div>
          <div class="settings-menu-block-section settings-menu-block-bottom">
            <div
              @click="cancelHandler"
              class="settings-menu-block-item">{{$lang.variables.cancel}}
            </div>
          </div>
        </div>
      </in-transition-component>
    </in-settings-menu>
  </in-transition-component>
</template>

<script>
  export default {
    name: "ConfirmationPresentSendModal",
    props: {
      show: {
        type: Boolean,
        required: true
      },
      gift: Object,
      selected: Array,
      message: String,
      sendSum: [Number, undefined]
    },
    computed: {
      nicknames() {
        let nicknames = '';

        for (let i = 0; i < this.selected.length; i++) {
          if (nicknames.length > 0) {
            nicknames += ', '
          }
          nicknames += this.selected[i].nickname;
        }

        return nicknames
      },
      giftForCoins() {
        return this.gift.id !== 41 && this.gift.id !== 42
      },
      countInCoins() {
        return this.sendSum ? this.sendSum : (this.gift.id === 41 || this.gift.id === 42) ? this.selected.length : this.gift.cost * this.selected.length
      },
      balanceImage() {
        if (this.gift.id === 41) {
          return 'https://media.inrating.top/storage/img/icons/gift_icons/high_res/42.png'
        } else if (this.gift.id === 42) {
          return 'https://media.inrating.top/storage/img/icons/gift_icons/high_res/41.png'
        } else {
          return 'http://storage.innet.club/img/default/R-coin.png'
        }
      }
    },
    methods: {
      confirmHandler() {
        this.$emit('confirm');
      },
      cancelHandler() {
        this.$emit('cancel');
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .gift-for {
    font-style: italic;
    color: #2c3e50;
    font-size: 4vw;
    margin: 10px;
    box-sizing: border-box;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    //.truncate();
  }

  .gift-image {
    width: 30vw;
    height: 30vw;
    margin: 0 auto;
    background: #ccc;
    border-radius: 10px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .gift-message {
    color: #2c3e50;
    font-size: 3.8vw;
    margin: 10px auto 0 auto;
    width: 90%;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .coins-count {
    font-size: 4vw;
    line-height: 4vw;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    color: #000000;
    font-weight: bold;
    padding: 10px 0 7vw 0;

    &-img {
      height: 4.8vw;
    }

    .count {
      padding: 0 5px;
    }
  }
</style>
