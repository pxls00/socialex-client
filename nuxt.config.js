export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s | SocialeX',
    title: 'SocialX',

    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/scss/main.scss'],
  styleResources: {
    scss: ['~/assets/scss/parts/vars.scss'],
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/get-route-path.js' },
    { src: '~/plugins/bootstrap.js' },
    { src: '~/plugins/api.js' },
    { src: '~/plugins/notify.js' },
    { src: '~/plugins/loader.js' },
    { src: '~/plugins/vuelidate.js' },
    { src: '~/plugins/app-modal.js', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',

    '@nuxtjs/style-resources',

    '@nuxtjs/auth-next',

    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: 'AIzaSyAKBPnaRiMzIizQtRYBWuwxlnTWHRJ0tYo',
          authDomain: 'socialex-75528.firebaseapp.com',
          projectId: 'socialex-75528',
          storageBucket: 'socialex-75528.appspot.com',
          messagingSenderId: '695987940287',
          appId: '1:695987940287:web:8b15bd3d6b98cb9de48f0a',
        },
        services: {
          storage: true,
        },
      },
    ],
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.APP_API_URL,
  },

  bootstrapVue: {
    icons: true,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: false,
  },

  auth: {
    plugins: [
      /* '~/plugins/store-helpers.js' */
    ],
    redirect: {
      login: '/login',
      logout: '/login',
      home: '/',
    },
    strategies: {
      local: {
        token: {
          property: 'token',
        },
        user: {
          property: false,
          autoFetch: true,
        },
        endpoints: {
          login: {
            url: 'http://localhost:8000/api/auth/login',
            method: 'post',
          },
          user: {
            url: 'http://localhost:8000/api/settings',
            method: 'get',
          },
          logout: {
            url: 'http://localhost:8000/api/auth/logout',
            method: 'delete',
          },
          refresh: false,
        },
      },
    },
  },
}
