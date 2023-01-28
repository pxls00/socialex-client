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
  head() {
    return {
      title: 'Register',
      meta: [
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'SocialEx',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Register to SocialeX',
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
          'Your account has been deleted, You can create new',
        variant: 'primary',
      })
    }
  },
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
