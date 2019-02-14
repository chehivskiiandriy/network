<template>
  <div>
    <i :class="actionToggle" @click="profileAction"></i>
  </div>
</template>
<script>
  import axios from 'axios';

  export default {
    props: ['className', 'classNameActive', 'fillType', 'statusFieldName', 'userId'],
    created() {

      this.changeStatusFieldName = this.statusFieldName;
      this.updateSub = this.statusFieldName;
    },
    data() {
      return {
        changeStatusFieldName: '',
        updateSub: '',

      }
    },
    mounted() {
      this.changeStatusFieldName = this.statusFieldName;
      this.updateSub = this.statusFieldName;
    },
    methods: {
      profileAction() {
        if (this.fillType == 'vote') {
          let userIds = {
            id: this.userId,
          }
          axios.post('v1/users/vote', userIds)
            .then(
              res => {
                if (res.data.state) {
                  //this.user.is_voted=res.data.state;
                  this.changeStatusFieldName = res.data.state;
                  alert('Вы успешно подняли рейтинг');
                }
                else {
                  alert('Вы уже подняли рейтинг этому пользователю');
                }
              }
            )
        }
        else if (this.fillType == 'subscribe') {
          let subscribe = this.updateSub;
          if (subscribe) {
            axios.get('v1/users/subscribe?id=' + this.userId + '&delete=false')
              .then(
                res => {

                  this.changeStatusFieldName = res.data.state;
                  this.updateSub = res.data.state;

                }
              )
          }
          else {

            axios.get('v1/users/subscribe?id=' + this.userId)
              .then(
                res => {
                  this.changeStatusFieldName = res.data.state;
                  this.updateSub = res.data.state;
                }
              )
          }
        }
        else if (this.fillType == 'chin-chin') {
          axios.get('v1/me/chats/messages/chin?id=' + this.userId)
            .then(
              res => {
              }
            )
        }

      }
    },
    computed: {
      actionToggle() {
        return this.changeStatusFieldName
          ? this.classNameActive
          : this.className
      }
    }
  }
</script>
