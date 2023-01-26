<template>
  <div class="profile">
    <div class="profile__top">
      <div class="profile__top-left">
        <div class="profile__top-avatar">
          <img
            :src="account.image"
          />
        </div>
      </div>
      <div class="profile__top-right">
        <div class="profile__top-info">
          <h4 class="profile__top-name">{{ account.name }}</h4>
          <nuxt-link v-if="getCurrent" :to="$getRoutePath('settings')">
            <button class="button">Edit profile</button>
          </nuxt-link>
          <button v-else-if="getFollowed" class="button button--danger" @click="$emit('unfollow')">Unfollow</button>
          <button v-else-if="!getFollowed" class="button" @click="$emit('follow')">Follow</button>
        </div>
        <div class="profile__top-credentials">
          <p
            class="profile__top-credentials-item profile__top-credentials-posts"
          >
            <span @click="getPosts">{{ postLenght || 0 }}</span> posts
          </p>
          <p
            class="profile__top-credentials-item profile__top-credentials-followers"
          >
            <span @click="getFollowers">{{ account.followers?.length }}</span> followers
          </p>
          <p
            class="profile__top-credentials-item profile__top-credentials-followings"
          >
            <span @click="getFollowings">{{ account.followings?.length }}</span> following
          </p>
        </div>
        <div class="profile__top-desc">{{ account.bio }}</div>
        <div class="profile__top-desc" v-html="account.bio" />
      </div>
    </div>
    <div class="profile__divider"></div>
    <slot name="tabs" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ProfileAccountComponent',
  props: {
    account: {
      type: Object,
      required: true
    },
    postLenght: {
      type: Number,
      required: true
    }
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
        if(this.account.followers.find(item => item._id === this.user._id.toString())) {
          return true
        }
      }
      return false
    }
  },
  methods: {
    getPosts() {
      this.$emit('getPosts')
    },

    getFollowers() {
      this.$emit('followers')
    },

    getFollowings() {
      this.$emit('followings')
    }
  }
}
</script>
