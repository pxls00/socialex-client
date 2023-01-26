export default {
  methods: {
    getErrorMessage(error) {
      if (error.response?.data?.message) {
        return error.response.data.message
      } else if (error.error && error.error.message) {
        return error.error.message
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.errors &&
        error.response.data.errors.some((_error) => _error.message)
      ) {
        return error.response.data.errors.find((_error) => _error.message)
          .message
      } else {
        return 'Something went wrong.'
      }
    },
    handleError(error) {
      if (!this.$axios.isCancel(error)) {
        const message = this.getErrorMessage(error)
        if(error.message === 'User unauthorized') {
          return this.$router.push('/login')
        }
        this.$bvToast.toast(message, {
          // title: 'Title',
          autoHideDelay: 5000,
          toaster: 'b-toaster-top-center',
          variant: 'danger',
          noCloseButton: true,
          noHoverPause: true,
          solid: true,
          appendToast: false,
        })
      }
    },
    $notify(notifyConfig) {
      if (notifyConfig.message) {
        const config = {
          autoHideDelay: notifyConfig.delay || 5000,
          toaster: notifyConfig.position || 'b-toaster-top-center',
          variant: notifyConfig.variant || 'primary',
          noCloseButton: true,
          noHoverPause: true,
          solid: true,
          appendToast: false,
        }
        this.$bvToast.toast(notifyConfig.message, config)
      }
    },
  },
}
