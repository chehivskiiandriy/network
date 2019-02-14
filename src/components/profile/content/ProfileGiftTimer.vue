<docs>
  # info test
</docs>

<template>
  <div class="userContentGift-info-time">

    <span
      v-if="giftAcceptBool === true"
      class="active">
      <i class="icon-time"></i> <span>{{time}}</span>
    </span>

    <span
      v-if="giftAcceptBool === false && giftOutDate === false"
      class="can">
      <i class="icon-time"></i> <span>{{time}}</span>
    </span>

    <span
      v-if="giftAcceptBool === false && giftOutDate === true"
      class="cant">
      <i class="icon-time"></i> <span>{{time}}</span>
    </span>

  </div>
</template>

<script>

  export default {
    name: 'user-cabinet-gift-time',
    props: {
      gift: Object
    },
    data(){
      return {
        time: '00:00:00'
      }
    },
    mounted(){
      this.getTime;
    },
    computed: {
      giftAcceptBool(){
        if(this.gift){
          return !!this.gift.is_accepted
        }else{
          return false;
        }
      },
      giftOutDate(){
        if(this.gift){
          return this.gift.is_outdated
        }else{
          return false;
        }
      },
      getTime(){
        if(this.gift){
          let time = (this.gift.expire_at_timestamp * 1000) - Date.now();
          if(time > 0){
            this.$timeBack(Math.floor(time / 1000), (res) =>{
              return this.time = res;
            });
          }else{
            return this.time = '00:00:00'
          }
        }else{
          return this.time = '00:00:00'
        }
      }
    },
  }
</script>

<style lang="less">

</style>
