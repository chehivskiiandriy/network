<template>
  <modal name="phoneConfirmModal"
         width="100%"
         classes=" v--modal phone-send-block register-modal"
         :scrollable="true"
         height="100%">
    <i @click="hideConfirmPhone()" class="icon-delete-f close-phone-send"></i>
    <div class="bgc-grad-register"></div>
    <div class="phone-send">
      <p>{{$lang.variables.codeFromMessage}}</p>
      <div class="input-phone-block">
        <input class="confirm-phone" maxlength="1" ref="confirmPhoneCode1" @keyup="nextCell($event.target)" type="number">
        <input class="confirm-phone" maxlength="1" ref="confirmPhoneCode2" @keyup="nextCell($event.target)" type="number">
        <input class="confirm-phone" maxlength="1" ref="confirmPhoneCode3" @keyup="nextCell($event.target)" type="number">
        <input class="confirm-phone" maxlength="1" ref="confirmPhoneCode4" @keyup="nextCell($event.target)" type="number">
      </div>
      <button @click="confirmPhone()">{{$lang.variables.confirm}}</button>
    </div>
  </modal>
</template>
<script>
  import apiDrotr from 'utils/apiDrotr';
  import axios from 'axios';

  export default  {
    data() {
      return {
        user:{},
        userPhone:'',
        params:{},
      }
    },
    mounted() {
      this.user=JSON.parse(localStorage.getItem('user'));
      this.userPhone=this.user.phone.replace(/[()-]/gi, '');
    },
    methods:{
      confirmPhone() {
        let code1=this.$refs.confirmPhoneCode1.value;
        let code2=this.$refs.confirmPhoneCode2.value;
        let code3=this.$refs.confirmPhoneCode3.value;
        let code4=this.$refs.confirmPhoneCode4.value;
        let finallcode=code1+code2+code3+code4;

        let code=finallcode;
        let data={
          os:'android',
          vsn: "0.0.0",
          phone:this.userPhone ,
          code:code,
        };
        apiDrotr.confirmPhone(data)
          .then(
            res=> {
              if (res.data.status="success") {
                this.params.phone=this.userPhone;
                this.params.token_type=res.data.token_type;
                this.params.access_token=res.data.access_token;
                this.params.refresh_token=res.data.refresh_token;
                this.params.lang='ru';
                axios.post('v1/confirm-drotr',this.params)
                  .then(
                    res=>{
                      if (res.data.state) {
                        axios.get('v1/me')
                          .then(
                            res => {
                              let user=JSON.stringify(res.data);
                              localStorage.setItem('user', user);
                              window.location.href='/'
                            }
                          )
                      }

                    }
                  )
              }
            })
        },
      hideConfirmPhone() {
        this.$modal.hide('phoneConfirmModal');
      },
      nextCell(el) {
        let index='';
        let children=el.parentNode.childNodes;
        for (let i=0; i < children.length; i++) {
          if (children[i] == el) {
            index=i;
          }
        }
        if (index+2<children.length)
        children[index+2].focus();
      }
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

  .input-phone-block {
    width: 47.3%;
    margin:auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .confirm-phone {
    width: 20%;
    display: block;
    text-align: center;
    padding: 5px;
    font-size: 27px;
    margin: 0 2px 10px 2px;
    border-radius: 6px;
    border: 1px solid #5ac5c6;
  }
  .phone-send p {color:#fff;margin-bottom: 10px}

  .register-modal{
    background-image: url(https://media.inrating.top/storage/img/backgrounds/FON_M_NEW_2.png);
    background-size: cover;
  }
</style>
