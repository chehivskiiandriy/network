<template>
  <div ref="confirmationCodeField">
    <input v-for="(cell, index) in cells"
           :key="index"
           @input="inputHandler(index, $event.target.value)"
           :value="cell"
           class="confirm-phone"
           @keyup="nextCell(index)"
           type="number">
  </div>
</template>

<script>
  import Vue from 'vue';

  export default {
    name: 'ConfirmationCodeField',
    props: {
      value: String,
      codeLength: {
        type: Number,
        default: 4,
      },
    },
    watch: {
      value(nextValue) {
        nextValue && nextValue.split('').forEach((digit, index) => {
          Vue.set(this.cells, index, digit);
        });
      }
    },
    computed: {
      code() {
        return this.cells.map(cell => cell || ' ').join('');
      },
    },
    data() {
      const { codeLength } = this;

      return {
        cells: new Array(codeLength).fill(''),
        canRefocus: false,
      };
    },
    methods: {
      nextCell(index) {
        this.$nextTick(function () {
          if(this.canRefocus) {
            let children = this.$refs.confirmationCodeField.childNodes;
            let nextIndex = index + 1;
            if (nextIndex < this.codeLength) {
              children[nextIndex].focus();
            }
            this.canRefocus = false;
          }
        });
      },
      inputHandler(index, value) {
        const newValue = value.toString(),
          oldValue = this.cells[index];
        const leftSymbol = newValue[0],
          rightSymbol = newValue[1];
        let digit = oldValue === leftSymbol
          ? rightSymbol
          : leftSymbol;
        console.log(`${newValue === null}, ${oldValue}, ${digit}`);
        if(digit || newValue === '') {
          Vue.set(this.cells, index, digit);
          this.$emit('input', this.code);
        }
        this.canRefocus = !!digit;
      },
    },
  }
</script>
