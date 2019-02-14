<template>
  <div class="recommend-item">
    <div class="recommend-item-image">
      <router-link :to="'u/'+recommendation.nickname">
        <img
          class="recommend-image"
          :src="recommendation.avatar_image.url_small"
        />
      </router-link>
    </div>
    <div class="recommend-item-names">
      <router-link :to="'u/'+recommendation.nickname">
        <span class="recommend-nickname"> {{ recommendation.nickname }} </span>
      </router-link>
      <router-link :to="'u/'+recommendation.nickname">
        <span class="recommend-username"> {{ recommendation.name }} {{ recommendation.lastname }} </span>
      </router-link>
    </div>
    <div class="recommend-item-subscribe-button" @click="changeSubscribe">
      <div
        v-if="recommendation.is_subscribed"
        class="recommend-button subscribed"
      >
        {{$lang.variables.subscribed}}
      </div>
      <div
        v-else
        class="recommend-button unsubscribed"
      >
        {{$lang.variables.subscribe}}
      </div>
      <i
        class="recommend-guy"
        :class="{
          'icon-plus-guy-f': recommendation.is_subscribed === true,
          'icon-plus-guy': recommendation.is_subscribed === false
        }"
      ></i>
    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';
  import {CHANGE_SUBSCRIBE_USER, moduleName as usersModule} from "../../store/modules/users/users";

  export default {
    name: 'RecommendationItem',
    props: {
      recommendation: {
        type: Object,
        required: true
      },
    },
    data() {
      return {
        hello: '',
      }
    },
    methods: {
    ...mapActions({
        changeSubscribeUser: usersModule + CHANGE_SUBSCRIBE_USER
      }),
      changeSubscribe() {
        const payload = {
          nickname: this.recommendation.nickname,
          delete: this.recommendation.is_subscribed ? '1' : '0',
          onSuccess: this.onSubscribe,
          onRequest: this.onRequestSubscribe
        };
        console.log('aaaaa',this.recommendation);
        this.changeSubscribeUser(payload);
      },
      onRequestSubscribe() {
        this.$notify({
          group: 'send-subscriber-request',
          duration: 3000,
          speed: 300,
        });
      },
      onSubscribe(result) {
        if (result.status === 'request') {
          this.$notify({
            group: 'send-subscriber-request',
            duration: 3000,
            speed: 300
          });
        }
        else {
          const payload = {
            nickname: this.recommendation.nickname,
            isSubscribed: !this.recommendation.is_subscribed
          };
          this.$emit('changeActivity', payload);
        }
      },

    }
  }
</script>

<style lang="less">
  @import "~LessStyle/variables.less";

  .recommend-item{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 1vw;
    border-radius: 10px;
    border: 1px solid @background;
    margin: 0 0.3vw 0.3vw 0.3vw;
  }

  .recommend-item:nth-child(5n){
    margin-bottom: 0;
  }

  .recommend-item-names{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .recommend-item-subscribe-button{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 30%;
    margin: 0 0.25rem 0 0.5rem;
  }

  .recommend-item-names{
    width: 50%;
    margin: 0 0 0 0.5rem;
  }

  .recommend-nickname, .recommend-username{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    text-align: left;
  }

  .recommend-nickname{
    font-size: 3.5vw;
    font-weight: 600;
    color: @black;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .recommend-username{
    font-size: 3.5vw;
    color: @dark_dark_grey;
  }

  .recommend-button{
    font-size: 2.8vw;
    color: @contest-list-text-color;
    margin-left: 1.5vw;
  }

  .recommend-guy{
    font-size: 6.5vw;
    .text-grad();
    margin-left: 0.5rem;
  }

  .recommend-image{
    width: 12vw;
    height: 12vw;
    border-radius: 4px;
    display: block;
    font-size: 28px;
  }

  .subscribed{
    color: @contest-list-text-color;
  }

  .unsubscribed{
    color: @dark_grey;
  }

</style>
