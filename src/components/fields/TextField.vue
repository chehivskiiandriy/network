<template>
  <div class="text-field">
    <in-transition-component name="timeout">
      <div v-if="error" class="text-field__error">{{error}}</div>
    </in-transition-component>
    <input :class="inputClasses" :name="name" :type="type" :placeholder="placeholder"
           :value="value" @input="$emit('input', $event.target.value)" />
  </div>
</template>

<script>
  export default {
    props: {
      value: String,
      placeholder: String,
      name: String,
      type: String,
      error: String,
    },
    computed: {
      inputClasses() {
        return {
          'text-field__input': true,
          // 'group_input': true,
          'text-field__input_error': !!this.error,
        };
      }
    }
  };
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  .text-field {
    margin: 20px;
    position: relative;
  }

  .text-field__input {
    width: 90%;
    height: 35px;
    font-size: 16px;
    background-color: rgba(255, 255, 255, 0.7);
    outline: 0;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid @base_green;
    box-sizing: border-box;
    color: #b7bac0;

    transition: border .4s;
  }

  .text-field__input_error {
    border: 1px solid #ff2e2f;
  }

  .text-field__error {
    transition: 0.5s;
    font-size: 12px;
    color: #ff2e2f;
    text-align: left;
    padding: 0 0 4px 5%;
  }
</style>
