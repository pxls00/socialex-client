<template>
  <div>
    <AccountComponent
      :account="userProfile"
      :post-lenght="posts.length"
      @followers="$bvModal.show('followers')"
      @followings="$bvModal.show('followings')"
    >
      <template #tabs>
        <div class="d-flex justify-content-center mt-4 mb-4">
          <button :class="[{'anactive': !postsPage}, 'button button--lg']" @click="postsPage = true">
            POSTS
            <b-icon icon="life-preserver" />
          </button>
          <button :class="[{'anactive': postsPage}, 'button button--lg ml-2']" @click="postsPage = false">
            SAVED
            <b-icon icon="save-fill" />
          </button>
        </div>
        <div v-if="postsPage && posts.length" class="posts">
          <AppAccountPost v-for="(item, idx) in posts" :key="idx" :item="item" @goToPost="toPost"/>
        </div>
        <div v-else-if="!postsPage && savedPosts.length" class="posts">
          <AppAccountPost v-for="(item, idx) in savedPosts" :key="idx" :item="item" @goToPost="toPost"/>
        </div>
        <p v-else-if="!posts.length">You have not created posts yet</p>
        <p v-else-if="!savedPosts.length">You have not saved posts yet</p>
      </template>
    </AccountComponent>
    <client-only>
      <AppModal id="followers" @close="$bvModal.hide('followers')">
        <template #title>Followers</template>
        <template #default>
          <AppAccountHeader
            v-for="(follower, idx) in userProfile.followers"
            :key="idx"
            :account="follower"
            class="account--item"
          >
            <template #actions>
              <div class="sugg-action">
                <nuxt-link :to="$getRoutePath('user', follower._id)">
                  <button class="button button--sm">Watch</button>
                </nuxt-link>
              </div>
            </template>
          </AppAccountHeader>
          <p v-if="!userProfile.followers?.length">You have no followers yet</p>
        </template>
      </AppModal>
    </client-only>
    <client-only>
      <AppModal id="followings" @close="$bvModal.hide('followings')">
        <template #title>Followings</template>
        <template #default>
          <AppAccountHeader
            v-for="(following, idx) in userProfile.followings"
            :key="idx"
            :account="following"
            class="account--item"
          >
            <template #actions>
              <div class="sugg-action">
                <button
                  class="button button--sm button--danger"
                  @click="unFollowUser(following._id)"
                >
                  Unfollow
                </button>
              </div>
            </template>
          </AppAccountHeader>
          <p v-if="!userProfile.followings?.length">
            You have no followings yet
          </p>
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

export default {
  name: 'ProfilePage',
  components: {
    AccountComponent,
    AppAccountHeader,
    AppAccountPost
  },

  middleware: ['auth'],

  data() {
    return {
      userProfile: {},
      posts: [],
      savedPosts: [],
      postsPage: true
    }
  },

  async fetch() {
    await this.getUser(this.user._id)
    await this.getUserPosts(this.user._id)
  },

  head() {
    return {
      title: 'Profile',
      meta: [
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'SocialEx',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `Profile page`,
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
    toPost(data) {
      this.$router.push(this.$getRoutePath('post', data._id))
    },

    async getUser(id) {
      this.$loader.show()
      try {
        this.userProfile = await this.$api.users.getUserById({}, { id })
        this.savedPosts = await this.userProfile.savedPosts
      } catch (error) {
        this.handleError(error)
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

    async unFollowUser(id) {
      this.$loader.show()
      const user = this.userProfile.followings.find(
        (item) => item._id.toString() === id.toString()
      )
      try {
        await this.$api.follow.unFollowUser({}, { id })
        await this.$auth.fetchUser()
        this.userProfile.followings = this.userProfile.followings.filter(
          (item) => item._id.toString() !== id.toString()
        )
      } catch (error) {
        this.handleError(error)
      } finally {
        this.$loader.hide()
        this.$notify({
          message: `${user.name} has been unfollowed`,
          variant: 'success',
          delay: 2000,
        })
      }
    },
    // async getSavedPosts(id) {
    //   this.$loader.show()
    //   try {
    //     const posts = await this.getPostsList({params: {user: id}})
    //     this.posts = await posts.data
    //   } catch (error) {
    //     this.handleError(error)
    //   } finally {
    //     this.$loader.hide()
    //   }
    // }
  },
}
</script>
