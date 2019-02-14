<template>
  <div class="add-story-album-cover-selection-cropper">
    <croppa
      v-model="cropper"
      :width="cropperSize"
      :height="cropperSize"
      :quality="qualityImage"
      :prevent-white-space="true"
      :show-remove-button="false"
      :disable-drag-and-drop="false"
      :disable-click-to-choose="false"
      :placeholder="$lang.variables.choose"
      :initial-image="selectedCover"
      accept="image/jpeg"
      @loading-end="newImageHandler">
    </croppa>
    <in-grid/>
  </div>
</template>

<script>
  import Grid from 'ComponentsVue/UI/Grid';


  export default {
    components: {
      inGrid: Grid,
    },
    props: {
      selectedCover: String,
    },
    watch: {
      selectedCover() {
        this.cropper && this.cropper.refresh();
      },
    },
    data() {
      return {
        cropper: {},
        windowWidth: window.innerWidth,
        qualityImage: 1,
      };
    },
    created() {
      window.addEventListener('resize', this.resizeWindowHandler)
    },
    destroyed() {
      window.removeEventListener('resize', this.resizeWindowHandler);
    },
    computed: {
      cropperSize() {
        return this.windowWidth;
      },
    },
    methods: {
      resizeWindowHandler() {
        this.windowWidth = window.innerWidth;
      },
      getDataUrl() {
        return this.cropper.generateDataUrl('image/jpeg', 0.8);
      },
      getBlob(callback) {
        return this.cropper.generateBlob(callback, 'image/jpeg', 0.8);
      },
      getMetadata() {
        return this.cropper.getMetadata();
      },
      newImageHandler() {
        this.getBlob(blob => this.$emit('upload', URL.createObjectURL(blob)));
      },
      changeImage() {
        this.cropper.chooseFile();
      }
    },
  }
</script>

<style lang="less">
  .add-story-album-cover-selection-cropper {
    position: relative;
  }

  .add-story-album-cover-selection-cropper .croppa-container canvas {
    border-radius: 0;
  }
</style>
