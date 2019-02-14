<template>
  <in-menu-modal :show="show" @update:show="$emit('update:show', $event)">
    <in-menu-modal-section v-if="isByAuthorizedUser">
      <in-menu-modal-item @click.native="$emit('action:delete')" danger>
        {{$lang.variables.deleteStory}}
      </in-menu-modal-item>
    </in-menu-modal-section>

    <in-menu-modal-section v-else>
      <in-menu-modal-item v-if="isAuthorizedUserFollowAuthor" @click.native="$emit('action:unsubscribe')">
        {{$lang.variables.unsubscribe}}
      </in-menu-modal-item>
      <in-menu-modal-item v-else @click.native="$emit('action:add-to-blacklist')">
        {{$lang.variables.addToBlackList}}
      </in-menu-modal-item>
    </in-menu-modal-section>

    <in-menu-modal-section v-if="isStoryAlbum">
      <in-menu-modal-item @click.native="$emit('action:delete-story-album')">
        {{$lang.variables.deleteStoryAlbum}}
      </in-menu-modal-item>
    </in-menu-modal-section>
  </in-menu-modal>
</template>

<script>
  export default {
    name: 'StoryMenu',
    props: {
      show: Boolean,
      isByAuthorizedUser: Boolean,
      isAuthorizedUserFollowAuthor: Boolean,
      isStoryAlbum: Boolean,
    },
    methods: {
    },
  }
</script>
