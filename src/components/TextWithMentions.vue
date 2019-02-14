<template>
  <div>
    <component :is="processedText"></component>
  </div>
</template>

<script>
  export default {
    props: {
      text: String,
      linkStyles: String
    },
    data() {
      const symbolsToEscape = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
        },
        regexToEscapeSymbols = new RegExp(`[${Object.keys(symbolsToEscape).join('')}]`, 'gm');
      return {
        symbolsToEscape,
        regexToEscapeSymbols,
        regexToActivateInRatingLinks: /(https?:\/\/(m\.)?(innet\.club|inrating\.top))(\/(.*?))?([^\w\d.\-\/@_+,]|$)/gm,
        regexToActivateMentions: /(@([\w\d.-]+?))([^\w\d.-]|$)/gm,
        regexToReplaceNewLineSymbolsWithBrTags: /\n/gm,
        regexToActivateIntags: /(\^\^([\w\d.-]+?))([^\w\d.-]|$)/gm,
      };
    },
    computed: {
      processedText() {
        const {text} = this;

        const processedText = text && this.replaceNewLineSymbolsWithBrTags(
          this.replaceInactiveInRatingLinksWithRouterLinks(
            this.replaceIntagsWithRouterLinks(
              this.replaceMentionsWithRouterLinks(
                this.escapeTags(text)
              )
            )
          )
        );

        const template = `<span>${processedText || ''}</span>`;
        return {
          template,
          props: this.$options.props,
        };
      },
    },
    methods: {
      escapeTags(text) {
        return text.replace(this.regexToEscapeSymbols, this.getSafeSymbol);
      },
      replaceMentionsWithRouterLinks(text) {
        return text.replace(this.regexToActivateMentions, `<router-link style="${this.linkStyles}" to="/u/$2">$1</router-link>$3`);
      },
      replaceIntagsWithRouterLinks(text) {
        return text.replace(this.regexToActivateIntags, `<router-link style="${this.linkStyles}" to="/intag/$2">$1</router-link>$3`);
      },
      replaceInactiveInRatingLinksWithRouterLinks(text) {
        return text.replace(this.regexToActivateInRatingLinks, this.inratingLinksReplacer);
      },
      inratingLinksReplacer(fullLink, baseLink, p2, p3, p4, subLink, extraText, offset, string) {
        console.log(`${fullLink}, ${baseLink}, ${p2}, ${p3}, ${subLink}, ${extraText}`);
        return window.location.href.startsWith(baseLink)
          ? `<router-link to="/${subLink}">${fullLink}</router-link>${extraText}`
          : `<a href="${fullLink}">${fullLink}</a>${extraText}`;
      },
      replaceNewLineSymbolsWithBrTags(text) {
        return text.replace(this.regexToReplaceNewLineSymbolsWithBrTags, '<br/>');
      },
      getSafeSymbol(symbolToEscape) {
        return this.symbolsToEscape[symbolToEscape];
      }
    }
  }
</script>

<style lang="less">
  .z-index {
    z-index: 100;
  }
</style>
