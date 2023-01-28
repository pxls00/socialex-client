<template>
  <div class="search">
    <FetchPaginationLayout ref="fetchPaginationLayout" :get-items="getItems">
      <template #default="{ items }">
        <div v-if="!searchByUser" class="search__post-list">
          <div v-for="(item, key) in items" :key="key" class="post-item">
            <PostItem
              :data="item"
              @unlike="removeLikeClicked"
              @like="addLikeClicked"
              @unsave="removeSavedPostClicked"
              @save="savePostClicked"
              @likeList="showLikeList"
              @getMoreInfo="showMoreInfo"
            />
          </div>
        </div>
        <div v-else-if="searchByUser" class="search__user-list">
          <AccountComponent
            v-for="(item, key) in items"
            :key="key"
            :account="item"
            class="search__user-item"
            @followers="openFollowersList"
            @followings="openFollowingsList"
            @unfollow="unfollow"
            @follow="follow"
          />
        </div>
      </template>
      <template #filter>
        <b-form-select
          v-model="selected"
          :options="filterOptions"
          @change="changeSearchOption"
        />
      </template>
    </FetchPaginationLayout>
    <client-only>
      <AppModal id="followers">
        <template #title>Followers</template>
        <template #default>
          <AppAccountHeader
            v-for="(follower, idx) in userAccount.followers || []"
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
          <p v-if="!userAccount.followers?.length">No followers yet</p>
        </template>
      </AppModal>
    </client-only>
    <client-only>
      <AppModal id="followings">
        <template #title>Followings</template>
        <template #default>
          <AppAccountHeader
            v-for="(following, idx) in userAccount.followings || []"
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
          <p v-if="!userAccount.followings?.length">No followings yet</p>
        </template>
      </AppModal>
    </client-only>
    <client-only>
      <AppModal id="moreInfoPostModal" @close="closeMoreInfoPostModal">
        <template #title>More about post</template>
        <template #default>
          <div class="w-100 d-flex justify-content-center">
            <div class="w-25 d-flex flex-column align-items-center">
              <span>
                <b-icon icon="heart" />
              </span>
              <b class="text-center">{{ postItem.likes?.length }}</b>
            </div>
            <div class="w-25 d-flex flex-column align-items-center">
              <span>
                <b-icon icon="bookmark-plus" />
              </span>
              <b class="text-center">{{ postItem.savedUsers?.length }}</b>
            </div>
            <div class="w-25 d-flex flex-column align-items-center">
              <span>
                <b-icon icon="chat-dots" />
              </span>
              <b class="text-center">{{ postItem.comments?.length }}</b>
            </div>
          </div>
        </template>
      </AppModal>
    </client-only>
    <client-only>
      <AppModal id="likedUsersModal" @close="closeLikedUsersModal">
        <template #title
          >Likes <b>{{ postItem.likes?.length }}</b></template
        >
        <template #default>
          <AppAccountHeader
            v-for="(user, idx) in postItem?.likes"
            :key="idx"
            :account="user"
            class="account--item"
          >
            <template #actions>
              <div class="sugg-action">
                <nuxt-link :to="$getRoutePath('user', user._id)">
                  <button class="button button--sm">Watch</button>
                </nuxt-link>
              </div>
            </template>
          </AppAccountHeader>
        </template>
      </AppModal>
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import FetchPaginationLayout from '@/components/layout/fetch-pagination-layout.vue'
import AccountComponent from '@/components/account/search-item.vue'
import AppAccountHeader from '@/components/ui/app-account-header.vue'
import PostItem from '@/components/post/home-item.vue'
import postsMixin from '@/mixins/posts.js'
import followMixin from '@/mixins/follow.js'

export default {
  name: 'SearchPage',
  components: {
    FetchPaginationLayout,
    PostItem,
    AccountComponent,
    AppAccountHeader,
  },

  mixins: [postsMixin, followMixin],

  middleware: ['auth'],

  data() {
    return {
      filterOptions: [
        {
          value: null,
          text: 'Select option for search',
        },
        {
          value: 'post',
          text: 'Search by post title',
        },
        {
          value: 'users',
          text: 'Search by user name',
        },
      ],
      selected: 'users',
      userAccount: {},
      postItem: {},
      searchByUser: true,
    }
  },

  head() {
    return {
      title: 'Search',
      meta: [
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'SocialEx',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `Search accounts or posts in SocialeX`,
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
  created() {
    this.getItems = this.getUserItems
  },
  methods: {
    getCurrent(id) {
      if (id.toString() === this.user._id.toString()) {
        return ['profile']
      }
      return ['user', id]
    },

    openFollowersList(data) {
      this.userAccount = data
      this.$bvModal.show('followers')
    },

    openFollowingsList(data) {
      this.userAccount = data
      this.$bvModal.show('followings')
    },

    getItems() {},

    getUserItems(requestData) {
      return new Promise((resolve, reject) => {
        this.$api.users
          .getUsersList(requestData)
          .then((data) => {
            resolve(data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    getPostItems(requestData) {
      return new Promise((resolve, reject) => {
        this.$api.posts
          .getPostsList(requestData)
          .then((data) => {
            resolve(data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    async changeSearchOption() {
      try {
        if (this.selected === 'post') {
          this.getItems = this.getPostItems
          this.$refs.fetchPaginationLayout.getItemsFunc = this.getItems
          await this.$refs.fetchPaginationLayout.$fetch()
          this.searchByUser = false
        } else if (this.selected === 'users') {
          this.getItems = this.getUserItems
          this.$refs.fetchPaginationLayout.getItemsFunc = this.getItems
          this.searchByUser = true
          await this.$refs.fetchPaginationLayout.$fetch()
        }
      } catch (error) {
        this.handelError(error)
      }
    },

    async unfollow(data) {
      try {
        this.userAccount = data
        await this.unFollowUser(this.userAccount._id)
      } catch (error) {
        this.handleError(error)
      } finally {
        await this.$refs.fetchPaginationLayout.fetchItems()
        this.$notify({
          message: `${this.userAccount.name} has been unfollowed`,
          variant: 'success',
          delay: 2000,
        })
      }
    },

    async follow(data) {
      try {
        this.userAccount = data
        await this.followUser(this.userAccount._id)
      } catch (error) {
        this.handleError(error)
      } finally {
        await this.$refs.fetchPaginationLayout.fetchItems()
        this.$notify({
          message: `${this.userAccount.name} has been followed`,
          variant: 'success',
          delay: 2000,
        })
      }
    },

    async removeLikeClicked(item) {
      try {
        await this.removeLike(item)
      } catch (error) {
        this.handleError(error)
      } finally {
        await this.$refs.fetchPaginationLayout.fetchItems()
        this.$notify({
          message: 'Post has been unliked sucessfully',
          variant: 'success',
        })
      }
    },

    async addLikeClicked(item) {
      try {
        await this.addLike(item)
      } catch (error) {
        this.handleError(error)
      } finally {
        await this.$refs.fetchPaginationLayout.fetchItems()
        this.$notify({
          message: 'Post has been liked sucessfully',
          variant: 'success',
        })
      }
    },

    async removeSavedPostClicked(item) {
      try {
        await this.removeSavedPost(item)
      } catch (error) {
        this.handleError(error)
      } finally {
        await this.$refs.fetchPaginationLayout.fetchItems()
        this.$notify({
          message: 'Post has been removed sucessfully',
          variant: 'success',
        })
      }
    },

    async savePostClicked(item) {
      try {
        await this.savePost(item)
      } catch (error) {
        this.handleError(error)
      } finally {
        await this.$refs.fetchPaginationLayout.fetchItems()
        this.$notify({
          message: 'Post has been saved sucessfully',
          variant: 'success',
        })
      }
    },
  },
}
</script>
