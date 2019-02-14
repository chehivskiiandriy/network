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
              @click="deleteHandler">{{$lang.variables.deleteDialog}}
            </div>
            <div
              class="settings-menu-block-item"
              @click="addHandler">{{$lang.variables.addToArchive}}
            </div>
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
    name: "ChatsAllItemSettingsMenu",
    props: {
      show: {
        type: Boolean,
        required: true
      }
    },
    methods: {
      deleteHandler() {
        this.$emit('delete-dialog');
      },
      addHandler() {
        this.$emit('add-to-archive');
      },
      closeSettings() {
        this.$emit('close-settings');
      }
    }
  }
</script>

<style scoped>

</style>
