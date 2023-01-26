<template>
  <div class="search__user-item">
    <AppAccountHeader class="search__user-header" :account="account">
      <template #actions>
        <div class="sugg-action">
          <nuxt-link v-if="getCurrent" :to="$getRoutePath('settings')">
            <button class="button">Edit profile</button>
          </nuxt-link>
          <button v-else-if="getFollowed" class="button button--danger" @click="$emit('unfollow', account)">Unfollow</button>
          <button v-else-if="!getFollowed" class="button" @click="$emit('follow', account)">Follow</button>
        </div>
      </template>
    </AppAccountHeader>
    <div class="search__user-credentials">
      <div class="profile__top-credentials">
        <p
          class="profile__top-credentials-item profile__top-credentials-followers"
        >
          <span @click="getFollowers">{{ account.followers?.length }}</span>
          followers
        </p>
        <p
          class="profile__top-credentials-item profile__top-credentials-followings"
        >
          <span @click="getFollowings">{{ account.followings?.length }}</span>
          following
        </p>
      </div>
      <div class="profile__top-desc" v-html="account.bio">
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppAccountHeader from '@/components/ui/app-account-header.vue'

export default {
  name: 'SearchAccountComponent',
  components: {
    AppAccountHeader,
  },
  props: {
    account: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('auth', ['user']),
    getCurrent() {
      if(Object.keys(this.account).length) {
        if(this.account._id.toString() === this.user._id.toString()) {
          return true
        }
      }
      return false
    },

    getFollowed() {
      if(!this.getCurrent && Object.keys(this.account).length) {
        if(this.account.followers) {
          if(this.account.followers.find(item => item._id === this.user._id.toString())) {
            return true
          }
        }
      }
      return false
    }
  },
  methods: {
    getFollowers() {
      this.$emit('followers', this.account)
    },

    getFollowings() {
      this.$emit('followings', this.account)
    },

  }
}
</script>
