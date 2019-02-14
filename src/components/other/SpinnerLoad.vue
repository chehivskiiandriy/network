<template>
  <div class="spinnerLoad">
    <img id="SpinnerPreload"
         class="spinner-svg"
         src="https://media.inrating.top/images/Spinner.svg"/>
  </div>
</template>
<script>
  export default  {
    name:'spinnerLoad',

  }
</script>
<style>
  .spinnerLoad {
    position: fixed;
    top: 0px;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 50%;
    }
  }
</style>
