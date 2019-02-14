<template>
  <form id="album-form" @submit.prevent="submitHandler">
    <in-text-field :value="albumTitle" @input="$emit('update:albumTitle', $event)"
                   name="title" type="text" :placeholder="$lang.variables.Title"
                   :error="albumTitleError" />
    <in-text-field :value="albumDescription" @input="$emit('update:albumDescription', $event)"
                   name="desc" type="text" :placeholder="$lang.variables.description" />
    <input type="submit" class="group_album_submit" :value="submitButtonText">
  </form>
</template>

<script>
  import TextField from 'ComponentsVue/fields/TextField';

  export default {
    components: {
      inTextField: TextField
    },
    props: {
      albumTitle: String,
      albumDescription: String,
      submitButtonText: String,
    },
    data() {
      return {
        isUserTriedToSubmit: false,
      };
    },
    computed: {
      isAlbumTitleFilled() {
        return !this.isUserTriedToSubmit || this.albumTitle;
      },
      albumTitleError() {
        return this.isAlbumTitleFilled
          ? null
          : this.$lang.variables.completeRequireFields;
      },
    },
    methods: {
      submitHandler() {
        this.isUserTriedToSubmit = true;
        if(!this.isAlbumTitleFilled) {
          this.emitNotificationAboutNotAllFilledFields();
          return;
        }
        this.$emit('submit');
      },
      emitNotificationAboutNotAllFilledFields() {
        this.$notify({
          group: 'not-allfields-album',
          duration: 3000,
          speed: 300,
        });
      },
    }
  }
</script>
