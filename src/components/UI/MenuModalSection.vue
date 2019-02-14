<template>
  <div class="menu-modal__section settings-menu-block-section">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      show: Boolean,
    }
  }
</script>
