<template>
  <in-transition-component name="timeout">
    <in-settings-menu
      v-show="show"
      @click="closeHandler"
      class="menu-modal settings-menu-block">
      <in-transition-component name="fade">
        <div
          v-if="show"
          @click="closeHandler"
          class="menu-modal__bg settings-menu-block-bg"></div>
      </in-transition-component>
      <in-transition-component name="translateY">
        <div v-if="show" class="menu-modal__container settings-menu-block-container">
          <slot></slot>
        </div>
      </in-transition-component>
    </in-settings-menu>
  </in-transition-component>
</template>

<script>
  export default {
    props: {
      show: Boolean,
    },
    methods: {
      closeHandler() {
        this.$emit('update:show', false);
      }
    }
  }
</script>

<style lang="less">
  .menu-modal__container {
    margin: auto 10px;
  }
</style>
