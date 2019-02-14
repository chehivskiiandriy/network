<template>
  <masked-input
    :value="value"
    @input="$emit('input', $event)"
    :name="name"
    :id="id"
    :mask="mask"
    :guide="true"
    placeholderChar="_"
    :placeholder="placeholder"
    :disabled="disabled"
    type="tel"/>
</template>

<script>
  import MaskedInput from 'vue-text-mask'

  const COUNTRIES = {
    'usa': {
      mask: '+1(###)###-####',
      placeholder: '+1(_)_-__',
    },
    'canada': {
      mask: '+1(###)###-####',
      placeholder: '+1(_)_-__',
    },
    'australia': {
      mask: '+61(###)###-###',
      placeholder: '+61(_)_-_',
    },
    'france': {
      mask: '+33-#-##-##-##-##',
      placeholder: '+33-_----',
    },
    'germany': {
      mask: '+49-##-########',
      placeholder: '+49--____',
    },
    'italia': {
      mask: '+39-###-#######',
      placeholder: '+39-_-_____',
    },
    'spain': {
      mask: '+34-###-###-###',
      placeholder: '+34-_-_-_',
    },
    'moldova': {
      mask: '+373-####-##-##',
      placeholder: '+373-__--',
    },
    'greece': {
      mask: '+30-###-###-####',
      placeholder: '+30-_-_-__',
    },
    'chech': {
      mask: '+420-###-###-###',
      placeholder: '+420-_-_-_',
    },
    'georgia': {
      mask: '+995-###-##-##-##',
      placeholder: '+995-_---',
    },
    'hungary': {
      mask: '+36(##)###-####',
      placeholder: '+36()_-__',
    },
    'poland': {
      mask: '+48-###-###-###',
      placeholder: '+48-_-_-_',
    },
    'estonia': {
      mask: '+372-####-####',
      placeholder: '+372-__-__',
    },
    'belarus': {
      mask: '+375-###-######',
      placeholder: '+375-_-____',
    },
    'lithuania': {
      mask: '+370(#-###)#####',
      placeholder: '+370(_-_)___',
    },
    'turkey': {
      mask: '+90-####-###-####',
      placeholder: '+90-__-_-__',
    },
    'arab': {
      mask: '+971-###-###-####',
      placeholder: '+971-_-_-__',
    },
    'ua': {
      mask: '+38(###)###-##-##',
      placeholder: '+38(_)_--',
    },
    'ru': {
      mask: '+7(###)###-##-##',
      placeholder: '+7(_)_--',
    },
    'kazakhstan': {
      mask: '+7(###)###-##-##',
      placeholder: '+7(_)_--',
    },
  };

  function prepareMaskForInput(mask) {
    return mask
      .split('')
      .map(char =>
        char === '#'
          ? /\d/
          : char);
  }

  for(const countryName in COUNTRIES) {
    if(COUNTRIES.hasOwnProperty(countryName)) {
      COUNTRIES[countryName].maskForInput = prepareMaskForInput(COUNTRIES[countryName].mask);
    }
  }

  export default {
    components: {
      MaskedInput,
    },
    data() {
      return {
        countries: COUNTRIES
      }
    },
    props: {
      value: {
        type: String,
        required: false,
        default: ''
      },
      disabled: Boolean,
      country: {
        type: String,
        required: true,
        validator(value) {
          return COUNTRIES.hasOwnProperty(value);
        }
      },
      name: String,
      id: String,
      // ref: String,
    },
    computed: {
      countryData() {
        return this.countries[this.country];
      },
      mask() {
        return this.countryData.maskForInput;
      },
      placeholder() {
        return this.countryData.placeholder;
      }
    },
  }
</script>
