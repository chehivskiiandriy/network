<template>
  <in-transition-component name="timeout">
    <in-settings-menu
      v-show="show"
      class="settings-menu-block">
      <in-transition-component name="fade">
        <div
          v-if="show"
          @click="closeSettings"
          class="settings-menu-block-bg"></div>
      </in-transition-component>
      <in-transition-component name="translateY">
        <div
          v-if="show"
          class="settings-menu-block-container">
          <div class="settings-menu-block-section settings-menu-block-center">
            <div
              class="settings-menu-block-item"
              @click="restoreHandler">{{$lang.variables.continueTheDialogue}}</div>
            <div
              class="settings-menu-block-item"
              @click="deleteHandler">{{$lang.variables.deleteDialog}}</div>
          </div>
          <div class="settings-menu-block-section settings-menu-block-bottom">
            <div
              @click="closeSettings"
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
    name: "ChatsArchiveSettingsMenu",
    props: {
      show: {
        type: Boolean,
        required: true
      }
    },
    methods: {
      restoreHandler() {
        this.$emit('restore-dialog');
      },
      deleteHandler() {
        this.$emit('delete-dialog')
      },
      closeSettings() {
        this.$emit('close-settings');
      }
    }
  }
</script>

<style scoped>

</style>
