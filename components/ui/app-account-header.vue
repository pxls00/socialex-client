<template>
  <div class="account">
    <div class="account-avatar">
      <nuxt-link :to="$getRoutePath(...getCurrent)">
        <img :src="account.image" alt="profile logo" />
      </nuxt-link>
    </div>
    <div class="account-info">
      <div class="account-name">
        <nuxt-link :to="$getRoutePath(...getCurrent)">
          <h3>{{ account.name }}</h3>
        </nuxt-link>
      </div>
      <div class="account-email">
        <nuxt-link :to="$getRoutePath(...getCurrent)">
          <p>{{ account.email }}</p>
        </nuxt-link>
      </div>
    </div>
    <slot name="actions" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AppAccountHeaderComponent',
  props: {
    account: {
      type: Object,
      required: true
    },
  },

  computed: {
    ...mapState('auth', ['user']),
    getCurrent() {
      if('_id' in this.account) {
        if(this.account._id.toString() === this.user._id.toString()) {
          return ['profile']
        }
      }
      return ['user', this.account._id]
    }
  }
}
</script>
