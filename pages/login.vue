<template>
  <AuthForm @submit="onSubmit" />
</template>

<script>
import AuthForm from '@/components/auth/form'
export default {
  name: 'AuthLoginPage',
  components: {
    AuthForm,
  },
  layout: 'auth-layout',
  middleware: ['auth'],
  head() {
    return {
      title: 'Login',
      meta: [
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'SocialEx',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Login to SocialeX',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'The project of pxls00. Editing and publication of content on the website as directed by the digital content manager',
        },
      ],
    }
  },
  mounted() {
    if (this.$route.query.message) {
      this.$notify({
        message:
          'Please sign in with the credentials you just created for sign up',
        variant: 'primary',
      })
    }
  },
  methods: {
    async onSubmit(data) {
      this.$loader.show()
      try {
        await this.$auth.loginWith('local', { data })
      } catch (error) {
        this.handleError(error)
      } finally {
        this.$router.push(this.$getRoutePath('home'))
        this.$loader.hide()
      }
    },
  },
}
</script>
