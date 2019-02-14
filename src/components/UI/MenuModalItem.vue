<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      danger: Boolean,
    },
    computed: {
      classes() {
        return {
          'menu-modal__item': true,
          'settings-menu-block-item': true,
          'settings-menu-block-item-danger': this.danger,
        }
      }
    }
  }
</script>
