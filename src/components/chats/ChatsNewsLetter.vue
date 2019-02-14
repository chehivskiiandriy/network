<template>
  <div class="chats-news-letter">
    <in-chats-common-header :name="$lang.variables.makeANewsletter"/>

    <div class="chats-news-letter-message">
      <textarea
        :placeholder="$lang.variables.enterMessage"
        v-model="message"
        class="chats-news-letter-message-input"></textarea>
    </div>

    <in-search-people @select-user="selectUser" />

    <div
      @click="createNewsLetter"
      class="chats-news-letter-create">
      <button
        class="chats-news-letter-create-button"
        :class="{'chats-news-letter-create-button-active' : selected.length > 0 && this.message}">
        {{$lang.variables.create}}
      </button>
    </div>
  </div>
</template>

<script>
  import ChatsCommonHeader from 'ComponentsVue/chats/ChatsCommonHeader';
  import SearchPeople from 'ComponentsVue/chats/SearchPeople';

  export default {
    name: "ChatsNewsLetter",
    components: {
      inChatsCommonHeader: ChatsCommonHeader,
      inSearchPeople: SearchPeople
    },
    data() {
      return {
        selected: [],
        message: '',
        loading: false
      }
    },
    methods: {
      selectUser(value) {
        this.selected = value;
      },
      async createNewsLetter() {
        if(this.selected.length > 0 && this.message && !this.loading) {
          this.loading = true;

          let ids = [];

          for(let i = 0; i < this.selected.length; i++) {
            ids.push(this.selected[i].id);
          }

          const data = new FormData();
          data.append('message', this.message);
          data.append('ids', JSON.stringify(ids));

          try {
            let { data: { state } } = await this.$api.messages.distribution(data);
            if(state) {
              this.$router.push('/messages');
            }
          } catch (e) {
            this.loading = false;
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~LessStyle/variables.less";

  .chats-news-letter {
    &-message {
      width: calc(~'100vw - 10px');
      margin: 5px;
      padding-top: 5px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;

      ::-webkit-scrollbar {
        width: 0;
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: #FF0000;
      }

      &-input {
        border: 2px solid @contest-list-text-color;
        font-size: 4vw;
        width: 100%;
        resize: none;
        overflow: auto;
        padding: 5px;
        height: 14vh;
        border-radius: 5px;
      }
    }

    &-create {
      border-top: 1px solid #bbb;
      width: 100%;
      position: fixed;
      bottom: 0;
      background: @white;

      &-button {
        border-radius: 5px;
        color: @dark_grey;
        box-shadow: inset 0 0 0 1px @dark_grey;
        padding: 8px 10px;
        width: 50%;
        box-sizing: border-box;
        border: none;
        margin: 20px 0;
        font-size: 4.2vw;

        &-active {
          color: @white;
          box-shadow: none;
          .bgc-grad();
        }
      }
    }
  }
</style>
