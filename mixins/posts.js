export default {
  methods: {
    async removeLike(item) {
      this.$loader.show()
      try {
        await this.$api.postLike.removePostLike({}, { id: item._id })
      } catch (error) {
        this.handleError(error)
      } finally {
        this.$loader.hide()
      }
    },

    async addLike(item) {
      this.$loader.show()
      try {
        await this.$api.postLike.addPostLike({}, { id: item._id })
      } catch (error) {
        this.handleError(error)
      } finally {
        this.$loader.hide()

      }
    },

    async savePost(item) {
      this.$loader.show()
      try {
        await this.$api.postSave.savePost({}, { id: item._id })
      } catch (error) {
        this.handleError(error)
      } finally {
        this.$loader.hide()
      }
    },

    async removeSavedPost(item) {
      this.$loader.show()
      try {
        await this.$api.postSave.removeSavedPost({}, { id: item._id })
      } catch (error) {
        this.handleError(error)
      } finally {
        this.$loader.hide()
      }
    },

    async deletePostItem(item) {
      this.$loader.show()
      try {
        await this.$api.posts.deletePostsItem({}, {id: item._id})
      } catch (error) {
        this.handleError(error)
      } finally {
        this.$loader.hide()
      }
    },

    showLikeList(data) {
      this.postItem = data
      this.$bvModal.show('likedUsersModal')
    },

    closeLikedUsersModal() {
      this.postItem = {}
    },

    showMoreInfo(data) {
      this.postItem = data
      this.$bvModal.show('moreInfoPostModal')
    },

    closeMoreInfoPostModal() {
      this.postItem = {}
    },

    showDeleteItem(data) {
      this.postItem = data
      this.$bvModal.show('deletePost')
    }
  },
}
