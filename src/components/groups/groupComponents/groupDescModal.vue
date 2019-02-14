<template>
    <modal name="groupDescModal"
           width="90%"
           classes=" v--modal "
           :scrollable="true"
           height="auto">
          <div class="groupdesc-modal">{{desc}}</div>
    </modal>
</template>
<script>
  export default  {
    props: ['desc'],
  }
</script>
<style>
  .groupdesc-modal {
    padding: 10px 3%;
  }
</style>
