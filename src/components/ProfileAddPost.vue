<template>
    <div>

        <router-view></router-view>
    </div>

</template>
<script>

export default {

  head: {
    title() {
      return {
        inner: this.$lang.variables.addPost
      }

    },
  }
}
</script>
<style>
 body{
     margin: 0px;
 }
 .croppa-container  canvas {
     border:1px solid #d3d3d3;
     border-radius: 10px;
 }
 .croppImage{
     width:90%;
     height: auto;
     margin: auto;
 }
</style>
