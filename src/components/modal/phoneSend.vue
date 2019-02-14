<template>
  <modal name="modalPhoneSend"
         width="100%"
         classes=" v--modal phone-send-block register-modal"
         :scrollable="true"
         height="100%">
    <i @click="hideSendPhone()" class="icon-delete-f close-phone-send"></i>
    <div class="bgc-grad-register"></div>
    <div class="phone-send">
      <p>{{$lang.variables.enterPhone}}</p>
      <input class="confirm-phone-enter" v-model="userPhone" ref="confirmPhoneSend" type="text">
      <button @click="confirmPhoneSend()">{{$lang.variables.getCode}}</button>
    </div>

  </modal>
</template>
<script>
  import apiDrotr from 'utils/apiDrotr';

  export default  {
    data() {
      return {
        user:{},
        userPhone:'',
      }
    },
    mounted() {
        this.user=JSON.parse(localStorage.getItem('user'));
        this.userPhone=this.user.phone.replace(/[()-]/gi, '');
    },
    methods: {
      confirmPhoneSend() {
        let data={
          phone: this.$refs.confirmPhoneSend.value,
        };
        let config = {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/html',
          }
        };
        this.$modal.show('phoneAccept');
        this.$modal.show('phoneConfirmModal');
        apiDrotr.regPhone(data, config)
          .then(
            res=> {
              //this.$modal.show('phoneConfirmModal');

            }
          )
      },
      hideSendPhone() {
        this.$modal.hide('modalPhoneSend');
      },
    }
  }
</script>
<style>
  .phone-send-block{
    display:flex ;
    align-items: center;
    justify-content: center;

  }
  .bgc-grad-register {
    background: linear-gradient(0deg,#000,transparent,#000);
    opacity: .7;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    content: "";
    z-index: 1;
  }
  .phone-send {
    text-align: center;
    z-index: 111;
  }
  .phone-send p {color:#fff;margin-bottom: 10px}
  .close-phone-send {
    position: absolute;
    color:#fff;
    top:10px;
    right: 10px;
    z-index: 11;
  }


  .confirm-phone-enter {
    width: 100%;
    display: block;
    padding: 5px;
    margin: 0 10px 10px 10px;
    border-radius: 6px;
    border: 1px solid #5ac5c6;
  }
  .register-modal{
    background-image: url(https://media.inrating.top/storage/img/backgrounds/FON_M_NEW_2.png);
    background-size: cover;
  }

</style>
