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
          <div
            v-if="message"
            class="settings-menu-block-section settings-menu-block-top">
            <div class="settings-menu-block-item">
              <div>{{message}}</div>
              <div
                v-if="subMessage"
                class="sub-message">{{subMessage}}</div>
            </div>
          </div>
          <div class="settings-menu-block-section settings-menu-block-center">
            <div
              class="settings-menu-block-item"
              @click="confirmHandler">{{$lang.variables.yes}}</div>
            <div
              class="settings-menu-block-item"
              @click="cancelHandler">{{$lang.variables.no}}</div>
          </div>
        </div>
      </in-transition-component>
    </in-settings-menu>
  </in-transition-component>
</template>

<script>
  export default {
    name: "ConfirmationSettingsModal",
    props: {
      show: {
        type: Boolean,
        required: true
      },
      message: {
        type: String
      },
      subMessage: {
        type: String
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
  .sub-message {
    font-size: 3.5vw;
    color: #ff0000;
  }
</style>
