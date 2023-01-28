<template>
  <div>
    <AccountComponent
      :account="userProfile"
      :post-lenght="posts.length"
      @followers="$bvModal.show('followers')"
      @followings="$bvModal.show('followings')"
      @unfollow="unfollow"
      @follow="follow"
    >
      <template #tabs>
        <div v-if="posts.length" class="posts mt-4">
          <AppAccountPost
            v-for="(item, idx) in posts"
            :key="idx"
            :item="item"
            @goToPost="toPost"
          />
        </div>
        <p v-else>{{ userProfile.name }} has not created posts yet</p>
      </template>
    </AccountComponent>
    <client-only>
      <AppModal id="followers">
        <template #title>Followers</template>
        <template #default>
          <AppAccountHeader
            v-for="(follower, idx) in userProfile.followers || []"
            :key="idx"
            :account="follower"
            class="account--item"
          >
            <template #actions>
              <div class="sugg-action">
                <nuxt-link :to="$getRoutePath(...getCurrent(follower._id))">
                  <button class="button button--sm">Watch</button>
                </nuxt-link>
              </div>
            </template>
          </AppAccountHeader>
          <p v-if="!userProfile.followers?.length">No followers yet</p>
        </template>
      </AppModal>
    </client-only>
    <client-only>
      <AppModal id="followings">
        <template #title>Followings</template>
        <template #default>
          <AppAccountHeader
            v-for="(following, idx) in userProfile.followings || []"
            :key="idx"
            :account="following"
            class="account--item"
          >
            <template #actions>
              <div class="sugg-action">
                <nuxt-link :to="$getRoutePath(...getCurrent(following._id))">
                  <button class="button button--sm">Watch</button>
                </nuxt-link>
              </div>
            </template>
          </AppAccountHeader>
          <p v-if="!userProfile.followings?.length">No followings yet</p>
        </template>
      </AppModal>
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AccountComponent from '@/components/account/main-item.vue'
import AppAccountHeader from '@/components/ui/app-account-header.vue'
import AppAccountPost from '@/components/post/account-item.vue'
import followMixin from '@/mixins/follow.js'

export default {
  name: 'ProfilePage',
  components: {
    AccountComponent,
    AppAccountHeader,
    AppAccountPost,
  },
  mixins: [followMixin],
  middleware: ['auth'],

  data() {
    return {
      userProfile: {},
      posts: [],
    }
  },

  async fetch() {
    await this.getUser(this.$route.params.id)
    await this.getUserPosts(this.$route.params.id)
  },

  head() {
    return {
      title: this.userProfile?.name,
      meta: [
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'SocialEx',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `Account-${this.userProfile?.name}`,
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
    getCurrent(id) {
      if (id.toString() === this.user._id.toString()) {
        return ['profile']
      }
      return ['user', this.account._id]
    },

    toPost(data) {
      this.$router.push(this.$getRoutePath('post', data._id))
    },

    async getUser(id) {
      this.$loader.show()
      try {
        this.userProfile = await this.$api.users.getUserById({}, { id })
      } catch (error) {
        this.handleError(error)
      } finally {
        this.$loader.hide()
      }
    },

    async getUserPosts(id) {
      this.$loader.show()
      try {
        const posts = await this.$api.posts.getPostsList({
          params: { user: id },
        })
        this.posts = await posts.data
        this.userProfile.postsLength = await posts.count
      } catch (error) {
        this.handleError(error)
      } finally {
        this.$loader.hide()
      }
    },

    async unfollow() {
      try {
        await this.unFollowUser(this.userProfile._id)
      } catch (error) {
        this.handleError(error)
      } finally {
        await this.$fetch()
        this.$notify({
          message: `${this.userProfile.name} has been unfollowed`,
          variant: 'success',
          delay: 2000,
        })
      }
    },

    async follow() {
      try {
        await this.followUser(this.userProfile._id)
      } catch (error) {
        this.handleError(error)
      } finally {
        await this.$fetch()
        this.$notify({
          message: `${this.userProfile.name} has been followed`,
          variant: 'success',
          delay: 2000,
        })
      }
    },
  },
}
</script>
