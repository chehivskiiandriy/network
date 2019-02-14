<template>
  <in-transition-component name="timeout">
    <in-settings-menu
      v-show="show"
      @click="closeHandler"
      class="settings-menu-block">
      <in-transition-component name="fade">
        <div
          v-show="show"
          @click="closeHandler"
          class="settings-menu-block-bg"></div>
      </in-transition-component>
      <in-transition-component name="translateY">
        <div v-show="show" class="settings-menu-block-container">
          <slot></slot>
          <div class="settings-menu-block-section settings-menu-block-bottom">
            <div
              @click="closeHandler"
              class="settings-menu-block-item">{{$lang.variables.cancel}}</div>
          </div>
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
        return this.$emit('update:show', false);
      },
    },
  }

  export const BottomMenuSection = {
    props: {
      position: {
        type: String,
        validator(position) {
          const isOneOfAvailable = ['top', 'center', 'bottom'].indexOf(position) !== -1;
          if(!isOneOfAvailable) {
            console.error('Prop position of BottomMenuSection component ' +
              'must be one of follow values: "top", "center" or "bottom", ' +
              'but got ' + position);
          }
          return isOneOfAvailable;
        },
        default: 'center',
      },
    },
    render(createElement) {
      return createElement('div', {
        class: 'settings-menu-block-section settings-menu-block-' + this.position,
      }, this.$slots.default);
    },
  };

  export const BottomMenuItem = {
    props: {
      action: String,
    },
    render(createElement) {
      return createElement('div', {
        class: 'settings-menu-block-item',
        on: {
          click: this.clickHandler,
        },
      }, this.$slots.default)
    },
    methods: {
      clickHandler() {
        this.$emit('action');
      },
    },
  };
</script>
