<template>
  <div
    class="present-item"
    @click="showPresentsModal">
    <div class="present-left">
      <div class="present-avatar">
        <img :src="present.image"/>
      </div>
      <div v-if="present.bonus !== '0'" class="present-name">
        <b>{{present.name}}</b>
        <span>{{present.bonus}}</span>
      </div>
      <div v-else class="present-name without-bonus">
        <b>{{present.name}}</b>
      </div>
    </div>
    <div class="present-right">
      <div v-if="present.status.toLowerCase() === 'premium'" class="present-more">
        {{$lang.variables.more}}
      </div>
      <div v-else class="present-price">
        <img src="http://storage.innet.club/img/default/R-coin.png"/>
        <span v-text="present.cost"></span>
      </div>
      <div class="present-go">
        <i class="icon-right-f"></i>
      </div>
    </div>
    <div
      class="present-bottom"
      :class="present.status.toLowerCase()">
    </div>
  </div>
</template>
<script>
  export default {
    name: 'presentsItem',
    props: {
      present: Object,
      index: Number
    },
    methods: {
      showPresentsModal() {
        this.$emit('show-presents-modal', this.index);
      }
    }
  }
</script>
<style lang="less">
  @import '~LessStyle/presentitem.less';
</style>
