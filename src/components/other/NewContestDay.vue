<docs>
  #
</docs>

<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <img class="rule-miss-img" src="https://media.inrating.top/images/default/miss-ukraine-day_mob.png">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'new-contest-week'
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  .rule-page-miss{
    margin-top: 75px;
    background-color: #fff;
    text-align: center;
    padding: 15px;
    .border-radius(10px);
    .setShadow();
  }

  .rule-miss-img {
    width: 100%;
    height: auto;
    margin-top:-3px;
  }
</style>
