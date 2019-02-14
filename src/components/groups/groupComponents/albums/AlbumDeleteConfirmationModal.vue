<template>
  <in-transition-component name="timeout">
    <in-settings-menu
      v-show="show"
      @click="closeHandler"
      class="settings-menu-block">
      <in-transition-component name="fade">
        <div
          v-if="show"
          @click="closeHandler"
          class="settings-menu-block-bg"></div>
      </in-transition-component>
      <in-transition-component name="translateY">
        <div v-if="show" class="settings-menu-block-container">
          <div class="settings-menu-block-section settings-menu-block-top">
            <div class="settings-menu-block-item">
              Are you sure you want delete this album?
            </div>
          </div>
          <div class="settings-menu-block-section settings-menu-block-center">
            <div
              class="settings-menu-block-item"
              @click="okHandler">Ok<!--{{$lang.variables.goToProfile}}--></div>
            <div
              class="settings-menu-block-item"
              @click="closeHandler">Cancel<!--{{$lang.variables.writeToChat}}--></div>
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
      okHandler(){
        this.$emit('select:ok');
        this.closeHandler();
      },
      closeHandler() {
        this.$emit('update:show', false);
      }
    }
  }
</script>
