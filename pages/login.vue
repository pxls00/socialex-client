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
