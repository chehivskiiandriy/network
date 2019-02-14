<script>
  export default {
    props: {
      status: String,
      tag: {
        type: String,
        default: 'span',
      },
      iconClasses: [String, Object],
      iconOnNextLine: Boolean,
    },
    computed: {
      isOfficial() {
        return this.status === 'official_page';
      },
      rootClasses() {
        return {
          'nickname': true,
          'nickname_horizontal': !this.iconOnNextLine,
          'nickname_vertical': this.iconOnNextLine,
        };
      },
      iconClassesPrepared() {
        const { iconClasses } = this;
        if(typeof iconClasses === 'string') {
          return iconClasses + ' icon-official_2';
        } else if (typeof iconClasses === 'object') {
          return {
            ...iconClasses,
            'icon-official_2': true,
          };
        } else {
          return 'nickname__official-icon icon-official_2';
        }
      },
    },
    render(createElement) {
      const children = !this.isOfficial
        ? [this.renderContent(createElement)]
        : this.renderContentWithIcon(createElement);
      return createElement(this.tag, {
        class: this.rootClasses,
      }, children);
    },
    methods: {
      renderContent(createElement) {
        return createElement('div', {
          class: 'nickname__content'
        }, this.$slots.default);
      },
      renderContentWithIcon(createElement) {
        return [this.renderContent(createElement), createElement(
          'i',
          {
            class: this.iconClassesPrepared,
          },
        )];
      },
    },
  }
</script>

<style lang="less">
  @import "~LessStyle/variables.less";


  .nickname {
    display: flex;
    flex-wrap: nowrap;
    max-width: 100%;
    align-items: center;
  }

  .nickname_horizontal {
    flex-direction: row;
  }

  .nickname_vertical {
    flex-direction: column;
  }

  .nickname_horizontal .nickname__official-icon {
    margin-left: 0.8em;
  }

  .nickname_vertical .nickname__content {
    width: 100%;
  }

  .nickname__content {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nickname__official-icon {
    .text-grad();
  }
</style>
