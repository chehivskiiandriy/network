<template>
  <i :class="iconClasses"></i>
</template>

<script>
  export default {
    props: {
      className: {
        type: String,
        required: true,
      },
      activeClassName: String,
      isActive: Boolean,
    },
    computed: {
      iconClasses() {
        const { isActive, className, activeClassName } = this;
        return isActive
          ? activeClassName || `${className}-f`
          : className;
      },
    },
  }
</script>
