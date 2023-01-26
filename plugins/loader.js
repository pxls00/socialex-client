export default (ctx, inject) => {
  const loader = {
    show() {
      if (process.client) {
        window.$nuxt.$emit('overlay-on')
      }
      return this
    },
    hide() {
      if (process.client) {
        window.$nuxt.$emit('overlay-off')
      }
      return null
    },
  }

  // Inject $loader
  inject('loader', loader)
}
