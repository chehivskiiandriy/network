<template>
  <modal name="groupSubjectModal"
         width="90%"
         classes=" v--modal "
         :scrollable="true"
         height="auto">
    <div class="group-subject-modal">{{subject}}</div>
  </modal>
</template>

<script>
  export default {
    name: "groupSubjectModal",
    props: {
      subject: String
    }
  }
</script>

<style lang="less">
  .group-subject-modal {
    padding: 10px 3%;
  }
</style>
