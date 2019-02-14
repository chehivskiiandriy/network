<template>
  <div
    @click="makeActive"
    class="contest-tabs-items"
    :class="contestActive">
    <p
      v-html="contestTypeText"
      class="contest-tabs-text"></p>
  </div>
</template>
<script>
  export default {
    computed: {
      contestActive(){
        if(this.isActive)
          return 'active-tab-contest';
        else
          return '';
      }
    },
    props: ['type', 'showSponsors', 'active', 'organisator'],
    data(){
      return {
        contestTypeText: this.organisator,
        isActive: this.active,
        timeContest: '',
      }
    },

    mounted(){
      this.$root.$on('makeNewTab', () =>{
        this.isActive = false;
      });
    },
    methods: {
      makeActive(){
        this.$root.$emit('makeNewTab');
        this.$root.$emit('changeUsers', this.type);
        let sponsor = {
          name: this.organisator,
          show: this.showSponsors,
          type: this.type,
        };
        this.$root.$emit('changeMemberBlock', sponsor);
        this.isActive = true;
      }
    }
  }
</script>
<style lang="less">
  .contest-tabs-text {
    margin: 5px 0;
    font-size: 3vw;
  }
</style>
