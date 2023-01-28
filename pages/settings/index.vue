<template>
  <div class="settings-page">
    <FormUserSettings :initial-data="user" @submit="updateSettings" @deleteAccount="deleteAccount"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import FormUserSettings from '@/components/settings/form.vue'
export default {
  name: 'UserSettingsPage',
  components: {
    FormUserSettings,
  },
  head() {
    return {
      title: 'Settings account',
      meta: [
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'SocialEx',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `Settings page account`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'The project of pxls00. Editing and publication of content on the website as directed by the digital content manager',
        },
      ],
    }
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    async updateSettings(data) {
        try {
          const requestData = {
            image: data.image,
            name: data.name,
            username: data.username,
            email: data.email,
            bio: data.bio,
          }
          await this.$api.settings.updateUsersSettings({
            data: requestData
          })
        } catch (error) {
          this.handleError(error)
        } finally {
          await this.$auth.fetchUser()
          this.$router.push(this.$getRoutePath('profile'))
          this.$loader.hide()
        }
    },
    async deleteAccount() {
      this.$loader.show()
      try {
        await this.$api.settings.deleteCurrentAccount()
      } catch (error) {
        this.handleError(error)
      } finally {
        this.$loader.hide()
        this.$router.push("/register?message=deleted")
      }
    }
  },
}
</script>
