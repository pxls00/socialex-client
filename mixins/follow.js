export default {
  methods: {
    async unFollowUser(id) {
      this.$loader.show()
      try {
        await this.$api.follow.unFollowUser({}, { id })
      } catch (error) {
        this.handleError(error)
      } finally {
        this.$loader.hide()
      }
    },

    async followUser(id) {
      this.$loader.show()
      try {
        await this.$api.follow.followUser({}, { id })
      } catch (error) {
        this.handleError(error)
      } finally {
        this.$loader.hide()

      }
    },
  },
}
