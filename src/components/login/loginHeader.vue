<template>
  <div>
      <h3 class="login-title"> {{$lang.variables.newUniqueSocialNetwork}}  </h3>
       <img class="login-logo" src="https://media.inrating.top/storage/img/logo/Inrating_logo_white_tifany.png">
      <h2 class="form-title">{{$lang.variables.welcomeToTheWorld}}</h2>
  </div>
</template>

<script>
export default {

}
</script>

<style>
  .login-title {
    color:#fff;
    margin-bottom: 20px;
    margin-top: 0;
    font-size: 18px;
  }

  .login-logo {
    max-width: 200px;
    width: 100%;
  }

  .bgc-grad {
    background: linear-gradient(0deg,#000,transparent,#00000087);
    opacity: .7;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    content: "";
    z-index: 0;
}

  .bgc-grad-register {
    background: linear-gradient(0deg,#000,transparent,#000);
    opacity: .7;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    content: "";
    z-index: 1;
  }



</style>
