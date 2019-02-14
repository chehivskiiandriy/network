<template>
  <div id="how-to-earn-incoins">
    <div class="settings-header">
      <div class="modal-title">{{$lang.variables.FAQ}}</div>
      <i
        @click="goToMain"
        class="icon-left-f icon-back"></i>
    </div>
    <div class="faq-wrap">
      <p class="faq-title" v-html="modalTitle"></p>
      <p class="faq-text" v-html="modalText"></p>
    </div>
  </div>
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
        modalText: '',
        availableQuestions: {
          rating: [
            'Что такое рейтинг?',
            'What is Rating?',
          ].map(question => question.trim().toLowerCase()),
        },
        defaultQuestion: {
          rating: 'Что такое рейтинг?',
        },
        defaultAnswer: {
          rating: '<p><strong>Рейтинг </strong>– это ваш персональный показатель популярности в Сети <strong>InRating</strong>.<br /> Чем выше ваш рейтинг , тем более высокую позицию в ленте вы занимаете.</p>' +
            '<p>Пользователи с самым высоким рейтингом дня, недели или месяца попадают в топ дня, недели или месяца соответственно. Пользователи, вошедшие в топ 5 лидеров по результатам месяца, получат ценные призы и подарки от Сети <strong>InRating</strong>.</p>' +
            '<p><strong>Повышение вашего рейтинга возможно за счет следующих видов активности:<br /> 1.</strong>+1 балл к вашему рейтингу - раз в 24 часа на странице вашего профиля другие пользователи могут повысить ваш рейтинг нажав кнопку <strong>[R]</strong>.<br /> <strong>2.</strong>+1 балл к вашему рейтингу – вы получаете при размещении 5 персональных постов с фото контентом <br /> <strong>3.</strong>+1 балл к вашему рейтингу  - если вы получили 10 лайков от других Пользователей Сети<br /> <strong>4.</strong> При получении подарков разных статусов, от других Пользователей Сети вам начисляются баллы, в зависимости от статуса и рейтинговой ценности подарка – Подробнее раздел <a href="https://inrating.top/gift">«Подарки»</a></p>' +
            '<p> </p>' +
            '<p>Баллы рейтинга могут не начисляться в случае не соблюдения <a href="https://inrating.top/rule-page"><strong>правил</strong></a> пользования ресурсом <a href="https://inrating.top/">InRating.top</a> <br /> </p>' +
            '<p>При отсутствии в Сети <strong>InRating</strong> в течении 24 часов, ваш персональный рейтинг понижается на 1%*. <br /> * Если при вычислении процентов из общей суммы рейтинга Пользователя, рейтинг имеет не целое число, происходит округление до целого в пользу Пользователя.<br /> <br /> </p>' +
            '<p><strong>Что такое рейтинг дня, недели и месяца?</strong></p>' +
            '<p><strong>Рейтинг дня –</strong> это показатель балов рейтинга пользователя, полученных за сутки (24 часа), который отображается в его профиле и в ленте рейтинга в разделе <a href="https://inrating.top/rating">«Рейтинг дня»</a></p>' +
            '<p><strong>Рейтинг недели </strong>– это показатель балов рейтинга пользователя, полученных за неделю (7 дней), который отображается в его профиле и в ленте рейтинга в разделе <a href="https://inrating.top/rating/week">«Рейтинг недели»</a>  </p>' +
            '<p><strong>Рейтинг месяца - </strong>это показатель балов рейтинга пользователя, полученных за месяц, который отображается в его профиле и в ленте рейтинга в разделе <a href="https://inrating.top/rating/month">«Рейтинг месяца»</a></p>' +
            '<p>Пользователи с самым высоким рейтингом дня, недели или месяца попадают в топ дня, недели или месяца соответственно. Пользователи, вошедшие в топ 5 лидеров по результатам месяца, получат ценные призы и подарки от Сети <strong>InRating</strong>.</p>' +
            '<p>Ежемесячно Сеть <strong>InRating</strong> публикует перечень подарков и призов в разделе <a href="https://inrating.top/rating/prize">«Призы InRating»</a> (В ленте рейтинга в версии для десктопа либо в нижнем меню на смартфонах).<br /> Стать лидером и попасть в топ 5 месяца и получить ценный приз или подарок от Сети, можно единоразово.</p>' +
            '<p><strong> </strong></p>' +
            '<p><strong>Как получить свой приз месяца?<br /> </strong>Если вы стали топ лидером месяца, с вами свяжется представитель Сети <strong>InRating</strong> в вашем регионе для обсуждения удобного способа получения подарка.</p>' +
            '<p><strong> </strong></p>' +
            '<p><strong>Как стать лидером рейтинга?<br /> </strong>У вас есть возможность стать лидером рейтинга за счет своей активности, а также активности других Пользователей Сети <strong>InRating</strong> по отношению к вам.<br /> Подробнее о получении рейтинга за счет активности в Сети <strong>InRating</strong> описано выше.</p>',
        },
      }
    },
    computed: {
      subject() {
        return this.$route.meta.subject;
      },
    },
    mounted() {
      this.getAllFAQ();
    },
    methods: {
      async getAllFAQ() {

        const requestData = new FormData();
        requestData.append('limit', 100);
        const {data} = await axios.post('v1/faq/all?lang=' + (this.$route.query.lang || this.$lang.current_lang), requestData);
        this.allFAQ = data.data;
        const qa = this.allFAQ.find(qa => this.availableQuestions[this.subject].indexOf(qa.question.trim().toLowerCase()) !== -1);
        if (qa) {
          this.openModalFAQ(qa.question, qa.answer)
        } else {
          this.openModalFAQ(this.defaultQuestion[this.subject], this.defaultAnswer[this.subject]);
        }
      },
      openModalFAQ(_title, _text) {
        this.modalTitle = _title;
        this.modalText = _text;
      },
      goToMain() {
        window.location.href = '/';
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/settings.less';

  #how-to-earn-incoins {
    margin-top: -43px;
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
</style>
