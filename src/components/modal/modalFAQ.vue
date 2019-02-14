<template>
  <modal
    name="modalFAQ"
    width="100%"
    classes=" v--modal "
    height="100%"
    :scrollable="true">
    <div class="settings-header">
      <div class="modal-title">{{$lang.variables.FAQ}}</div>
      <i
        @click="closeFAQ"
        class="icon-left-f icon-back"></i>
    </div>
    <div class="faq">
      <div class="settings-faq" v-for="faq in allFAQ">
        <div class="faq-content" @click="openModalFAQ(faq.question,faq.answer)">
          <p class="faq-top">{{faq.question}}</p>
          <i class="icon-right-f"></i>
        </div>
      </div>

      <modal class="SettingPage-FAQModal" name="modal-faq" height="100%" :scrollable="true" width="100%">
        <div class="settings-header">
          <div class="modal-title">{{$lang.variables.FAQ}}</div>
          <i
            @click="closeFAQItem"
            class="icon-left-f icon-back"></i>
        </div>
        <div class="faq-wrap">
          <p class="faq-title" v-html="modalTitle"></p>
          <p class="faq-text" v-html="modalText"></p>
        </div>
      </modal>

    </div>
  </modal>
</template>
<script>
  import axios from 'axios';

  export default {
    props: {
      question: String,
    },
    data() {
      return {
        allFAQ: [],
        modalTitle: '',
        modalText: ''
      }
    },
    mounted() {
      this.getAllFAQ();
    },
    methods: {
      getAllFAQ() {

        axios.post('v1/faq/all?lang='+this.$lang.current_lang)
          .then(res => {
            this.allFAQ = res.data.data;
            if(this.question) {
              const qa = this.allFAQ.find(qa => qa.question.toLowerCase() === 'What is the Exchange?'.trim().toLowerCase());
              if(qa) {
                this.openModalFAQ(qa.question, qa.answer)
              }
            }
          })
      },
      openModalFAQ(_title, _text) {
        this.modalTitle = _title;
        this.modalText = _text;
        this.$modal.show('modal-faq');
      },
      closeFAQ() {
        this.$modal.hide('modalFAQ');
      },
      closeFAQItem() {
        this.$modal.hide('modal-faq');
      }
    }
  }

</script>
<style lang="less">
  @import '~LessStyle/changeprofile.less';
  @import '~LessStyle/settings.less';

  .faq {
    width: 90%;
    padding: 0 5%;
    /* 41px = 5px * 2 (.modal-title padding) +
     * 30px (.modal-title line-height) +
     * 1px (.settings-header border-bottom) */
    height: ~"calc(100% - 41px)";
    overflow-y: scroll;

    a {
      color: #666;
      /*font-weight: bold;*/
    }

    .faq-top {
      color: #666;
      margin: 10px 0;
    }

    .faq-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #d3d3d3;

      i {
        color: #d3d3d3;
      }
    }

    .faq-wrap {
      overflow-y: scroll;
      height: calc(~'100% - 40px');
    }

    .faq-title {
      text-align: center;
      font-size: 24px;
      margin: 10px;
      color: #666;
    }

    .faq-text {
      font-size: 16px;
      color: #666;
      margin: 0 15px 10px;

      p {
        margin: 0;
      }
    }
  }

  [data-modal="modalFAQ"] {
    .settings-header h3 {
      text-align: center;
      margin: 0 0 5px 0;
    }

    .change-status--item div {
      width: 70%;
    }

    .settings-lenta {
      text-align: left;
    }
  }

</style>
