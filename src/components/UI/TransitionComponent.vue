<template>
  <transition :name="name" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </transition>
</template>

<script>
  export default {
    name: "TransitionComponent",
    props: {
      name: {
        type: String,
        default: 'translateY'
      }
    }
  }
</script>

<style lang="less" scoped>
  .timeout-enter-active, .timeout-leave-active {
    transition: opacity .3s;
  }

  .timeout-enter, .timeout-leave-to {
    opacity: 0;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .translateY-enter-active {
    animation: translateY-in 0.3s ease-out forwards;
  }

  .translateY-leave-active {
    animation: translateY-out 0.3s ease-out forwards;
  }

  @keyframes translateY-out {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(100%);
    }
  }

  @keyframes translateY-in {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  .translateX-enter-active {
    animation: translateX-in 0.2s ease-out forwards;
  }

  .translateX-leave-active {
    animation: translateX-out 0.2s ease-out forwards;
  }

  @keyframes translateX-out {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(100%);
    }
  }

  @keyframes translateX-in {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .scale-enter-active {
    animation: scale-in 0.2s ease-out forwards;
  }

  .scale-leave-active {
    animation: scale-out 0.1s ease-out forwards;
  }

  @keyframes scale-in {
    from {
      transform: scale(0.5);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes scale-out {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(0.2);
    }
  }
</style>
