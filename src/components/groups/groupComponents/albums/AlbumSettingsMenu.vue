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
          <div class="settings-menu-block-section settings-menu-block-center">
            <div
              class="settings-menu-block-item"
              @click="updateHandler">{{$lang.variables.updateAlbum}}</div>
            <div
              class="settings-menu-block-item"
              @click="deleteHandler">{{$lang.variables.deleteAlbum}}</div>
          </div>
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
      updateHandler(){
        this.$emit('select:update');
        this.closeHandler();
      },
      deleteHandler(){
        this.$emit('select:delete');
        this.closeHandler();
      },
      closeHandler() {
        this.$emit('update:show', false);
      }
    }
  }
</script>
