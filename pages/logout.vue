<template>
  <div></div>
</template>

<script>
export default {
  name: 'LogOut',
  middleware: ['auth'],
  beforeCreate() {
    this.$loader.show()
  },
  async mounted() {
    try {
      await this.$auth.logout()
    } catch (error) {
      this.handleError(error)
    } finally {
      this.$router.push(this.$getRoutePath('login'))
      this.$loader.hide()
    }
  },
}
</script>
