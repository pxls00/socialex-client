<template>
  <b-modal v-bind="$attrs" scrollable hide-footer @close="$emit('close')">
    <template #modal-title>
      <slot name="title" />
    </template>
    <slot />
  </b-modal>
</template>

<script>
export default {
  name: 'AppModal',
}
</script>
