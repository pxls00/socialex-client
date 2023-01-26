<template>
  <div class="settings-page">
    <FormUserSettings :initial-data="user" @submit="updateSettings" />
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
  },
}
</script>
