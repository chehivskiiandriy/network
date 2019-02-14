export const scrollOnBottom = {
  data() {
    return {
      bottom: false
    }
  },
  created() {
    window.addEventListener('scroll', this.handleBottomVisible)
  },
  updated() {
    this.bottom = false;
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleBottomVisible);
  },
  methods: {
    handleBottomVisible() {
      this.bottom = this.bottomVisible()
    },
    bottomVisible() {
      const scrollY = window.scrollY;
      const visible = document.documentElement.clientHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const bottomOfPage = visible + scrollY + 400 >= pageHeight;
      return bottomOfPage || pageHeight < visible
    }
  }
};
