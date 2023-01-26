<template>
  <AuthForm :register="true" @submit="onSubmit" />
</template>

<script>
import AuthForm from '@/components/auth/form'
export default {
  name: 'AuthRegisterPage',
  components: {
    AuthForm,
  },
  layout: 'auth-layout',
  middleware: ['auth'],
  auth: false,
  methods: {
    async onSubmit(data) {
      this.$loader.show()
      try {
        const res = await this.$api.auth.register({ data })
        // eslint-disable-next-line no-console
        if(await res.status === 201) {
          this.$router.push('/login?message=signIn')
        }
      } catch (error) {
        this.handleError(error)
      } finally {
        this.$loader.hide()
      }
    },
  },
}
</script>
