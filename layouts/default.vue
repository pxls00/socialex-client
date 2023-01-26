<template>
  <b-overlay :show="overlayShowed" rounded="lg" opacity="0.85">
    <div class="wrapper">
      <Sidebar :sidebar-close="sidebarClose" @open="sidebarClose = true" @close="sidebarClose = false"/>
      <div :class="[{'wrapper-content--fluid': sidebarClose},'wrapper-content']">
        <nuxt />
      </div>
    </div>
  </b-overlay>
</template>

<script>
import Sidebar from '@/components/app/sidebar.vue'
export default {
  name: 'DefaultLayout',
  components: {
    Sidebar,
  },

  data() {
    return {
      overlayShowed: false,
      sidebarClose: false
    }
  },

  mounted() {
    this.$nuxt.$on('overlay-on', () => {
      this.overlayShowed = true
    })
    this.$nuxt.$on('overlay-off', () => {
      this.overlayShowed = false
    })
  },
}
</script>
