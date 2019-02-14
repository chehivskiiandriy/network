<template>
    <div>
        <i @click="openShare()" class="icon-share-ios"></i>
    </div>
</template>

<script>
export default {
    props:['post'],
    methods: {
        openShare() {
          this.$root.$emit('sharePost', this.post);
          this.$modal.show('openShare');
        }
    }

}
</script>

<style>

</style>
