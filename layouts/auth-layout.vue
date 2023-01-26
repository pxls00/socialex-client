<template>
  <b-overlay :show="overlayShowed" rounded="lg" opacity="0.85">
    <div :class="$style['auth-layout']">
      <nuxt />
    </div>
  </b-overlay>
</template>

<script>
export default {
  name: 'AuthLayout',

  data() {
    return {
      overlayShowed: false,
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

  beforeDestroy() {
    this.$nuxt.$off('overlay-on')
    this.$nuxt.$off('overlay-off')
  },
}
</script>

<style lang="scss" module>
  .auth-layout {
    width: 100%;
    height: 1000%;
    min-height: 100vh;
    background: $primary-black-05;
    padding-top: 70px;
  }
</style>
