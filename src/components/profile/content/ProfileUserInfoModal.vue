<template>
  <modal name="userInfoInModal"
         width="90%"
         classes=" v--modal banned-user-modal"
         :scrollable="true"
         height="auto">
    <p>{{$lang.variables.nickname}}:{{getUserInfo.nickname}}</p>
    <p>{{$lang.variables.name}}:{{getUserInfo.name}}</p>
    <p>{{$lang.variables.surname}}:{{getUserInfo.lastname}}</p>

  </modal>
</template>
<script>
  export default  {
    computed: {
      getUserInfo() {
        return window.storeUser.getters.getUserInfo;
      }
    }
  }
</script>
<style>

</style>
