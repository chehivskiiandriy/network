<template>
  <modal
    name="changePassword"
    width="80%"
    classes=" v--modal changePassword"
    height="auto"
    :scrollable="true">
    <h3>{{$lang.variables.changePassword}}</h3>
    <div class="input-block">
      <input class="password-input" type="password" :placeholder="$lang.variables.oldPassword"><i
      class="icon-eye" @click="showInput(0,$event)"></i>
      <input class="password-input" type="password" :placeholder="$lang.variables.newPassword"><i
      class="icon-eye" @click="showInput(1,$event)"></i>
      <input class="password-input" type="password" :placeholder="$lang.variables.repeatPassword"><i
      class="icon-eye" @click="showInput(2,$event)"></i>
    </div>
    <button @click="passwordFunction()">{{$lang.variables.save}}</button>
  </modal>
</template>

<script>
  import axios from 'axios';

  export default {
    methods: {
      passwordFunction() {
        let input_array = document.getElementsByClassName('password-input');
        let data = new FormData();
        data.append('current_password', input_array[0].value);
        data.append('password', input_array[1].value);
        data.append('password_confirmation', input_array[2].value);
        if (input_array[1].value == input_array[2].value) {
          axios.post('v1/me/settings/base/edit', data)
            .then(
              res => {
                this.$modal.hide('changePassword');
                this.$notify({
                  group: 'change-pass',
                  duration: 4000,
                  speed: 300
                })
              }
            )
        }
      },
      showInput(id, e) {
        let input_array = document.getElementsByClassName('password-input');
        if (input_array[id].type == 'password') {
          input_array[id].type = 'text';
          e.target.classList.add("icon-eye-close");
          e.target.classList.remove("icon-eye");
        }
        else {
          input_array[id].type = 'password';
          e.target.classList.add("icon-eye");
          e.target.classList.remove("icon-eye-close");
        }

      }
    }
  }
</script>

<style>
  .v--modal h3 {
    border-radius: 15px;
    text-align: center;
  }

  .password-input {
    border: 0px;
    border-bottom: 1px solid #5ac5c6;
  }

  .input-block {
    text-align: center;
    padding-bottom: 10px;
  }

  .input-block input {
    margin: 10px;
  }

  .changePassword {
    text-align: center;
    padding: 20px;
  }
</style>
