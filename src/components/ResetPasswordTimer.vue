<template>
  <p>{{countdown}}</p>
</template>

<script>
  export default {
    props: {
      run: {
        type: Boolean,
        default: false,
      },
      initialTime: {
        type: Number,
        default: (5 * 60 * 1000),
      },
    },
    watch: {
      run(nextRun, oldRun) {
        if(!oldRun && nextRun) {
          this.start();
        }
      }
    },
    data() {
      return {
        nullCountdown: '0:00:00',
        countdown: '0:05:00',
      };
    },
    methods: {
      start() {
        let time = this.initialTime;
        if (time > 0) {
          this.$timeBack(Math.floor(time / 1000), (res) => {
            if(res === '0:00:00') {
              // this.endTimer = true;
              // this.showPhoneAccept = false;
              // this.sendSmsAgain = false;
              this.$emit('update:run', false);
              return this.countdown = this.nullCountdown;
            }
            if(this.run) { // (this.endTimer === false && this.sendSmsAgain === false) || (this.sendSmsAgain === true)
              return this.countdown = res;
            }
          });
        } else {
          return this.countdown = this.nullCountdown;
        }
      },
    },
  }
</script>
