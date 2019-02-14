<template>
  <modal
    name="contestCreatedModal"
    width="100%"
    classes=" v--modal"
    height="100%">
    <div class="contest-created-modal">
      <div class="contest-created-modal-header">
        <p class="modal-title">{{$lang.variables.contestForm}}</p>
      </div>
      <div class="contest-created-modal-content">
        <h2>{{$lang.variables.title}}</h2>
        <p>{{$lang.variables.contestFormDesc1}}</p>
        <div class="contest-description">
          <span>{{$lang.variables.contestFormDesc2}}</span>
          <img src="https://media.inrating.top/storage/img/default/contest-dop-info.jpg" alt="">
          <span>{{$lang.variables.contestFormDesc3}}</span>
        </div>
        <button
          class="contest-created-button"
          @click="closeModal">{{$lang.variables.complete}}</button>
      </div>
    </div>
  </modal>
</template>

<script>
  export default {
    name: "contestCreatedModal",
    methods: {
      closeModal() {
        this.$modal.hide('contestCreatedModal');
        this.$router.push('/contests');
      }
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  .contest-created-modal {
    text-align: center;

    .modal-title {
      font-size: 18px;
    }

    &-content {
      h2, p {
        width: 80%;
        margin: 0 auto;
        padding: 15px 0;
      }
    }

    .contest-description {
      padding: 15px 10%;
      width: 80%;
      border-top: 1px solid @middle_grey;
      border-bottom: 1px solid @middle_grey;
      margin-bottom: 20px;

      span {
        /*padding: 10px 0;*/
      }

      img {
        width: 100%;
        padding: 10px 0;
      }
    }

    .contest-created-button {
      width: 50%;
      color: @white;
      border: none;
      .bgc-grad();
    }
  }
</style>
