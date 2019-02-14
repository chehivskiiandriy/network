<template>
  <modal
    name="changeStatusFilter"
    width="100%"
    classes=" v--modal "
    height="100%"
    :scrollable="true">
    <div class="status-header">
      <i
        @click="hideStatus()"
        class="icon-left-f closeStatus"></i>
      <h3>{{$lang.variables.chooseStatus}}</h3>
    </div>
    <div class="status-block">
      <div
        class="status-child"
        v-for="(status,index) in statusArray"
        @click="changeSocialStatus(status)">
        <div
          class="status-item"
          v-if="index < 9">
          <div
            class="status-item--text">
            <p v-text="dataStatusLang[index]"></p>
            <i v-if="choose.value === status.value" class="icon-check-f active"></i>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
  export default {
    name: "FilterStatus",
    props: {
      statusArray: Array,
      chooseStatus: Object
    },
    data() {
      return {
        choose: this.chooseStatus,
        dataStatusLang:[this.$lang.variables.student,this.$lang.variables.businesswomen,
          this.$lang.variables.manager,this.$lang.variables.top_manager,this.$lang.variables.official,
          this.$lang.variables.athlete,this.$lang.variables.blogger,this.$lang.variables.media_person,this.$lang.variables.creative_person],
      }
    },
    methods: {
      hideStatus() {
        this.$modal.hide('changeStatusFilter');
        this.$emit('socialStatus', this.choose);
      },
      changeSocialStatus(status) {
        this.choose = status;
      },
    }
  }
</script>

<style lang="less">

  .status-item{
    display: flex;
    align-items: center;
    padding: 0px 10px;
    justify-content: space-between;
  }

  .status-item--radio{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #d3d3d3;
    background: #fff;
  }

  .status-item--radio.active {
    background: #5ac5c6;
  }

  .status-item--text{
    width: 95%;
    margin-left: 5%;
    text-align: left;
    border-bottom: 1px solid #d3d3d3;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .status-item--text i {
    color: #0cb4be;
  }

  .status-item--text p {
    margin: 0px;
    padding: 10px 0px;
  }

  .status-header{
    text-align: center;
    color: #000;
    position: relative;
    font-weight: 300;
  }

  .closeStatus{
    position: absolute;
    left: 10px;
    top: 3px;
  }

  .status-block{
    border-bottom: 1px solid #d3d3d3;
    margin-bottom: 30px;
  }

  .v--modal-overlay.scrollable{
    padding-bottom: 0px;
  }

  .status-block:last-child{
    border-bottom: 0px;
  }

</style>
