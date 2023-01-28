<template>
  <div class="home">
    <FetchPaginationLayout ref="fetchPaginationLayout" :get-items="getItems">
      <template #default="{ items }">
        <div class="home__post-list">
          <div v-for="(item, key) in items" :key="key" class="post-item">
            <PostItem
              :data="item"
              @unlike="removeLikeClicked"
              @like="addLikeClicked"
              @unsave="removeSavedPostClicked"
              @save="savePostClicked"
              @likeList="showLikeList"
              @getMoreInfo="showMoreInfo"
              @deletePost="showDeleteItem"
            />
          </div>
        </div>
      </template>
    </FetchPaginationLayout>
    <div class="home__sugg-users">
      <p
        class="home__sugg-users-text mb-2 w-100 d-flex justify-content-between"
      >
        Your current profile
        <router-link :to="$getRoutePath('settings')"
          ><span>Settings</span></router-link
        >
      </p>
      <AppAccountHeader :account="currentAccount" class="account--sugg">
        <template #actions>
          <div class="sugg-action">
            <nuxt-link :to="$getRoutePath('profile')">
              <button class="button button--sm">Watch</button>
            </nuxt-link>
          </div>
        </template>
      </AppAccountHeader>
      <p
        class="home__sugg-users-text mt-3 mb-2 w-100 d-flex justify-content-between"
      >
        Suggestions for you
      </p>
      <ul class="home__sugg-list">
        <AppAccountHeader
          v-for="(item, idx) in suggAccounts"
          :key="idx"
          :account="item"
          class="account--sugg"
        >
          <template #actions>
            <div class="sugg-action">
              <nuxt-link :to="$getRoutePath('user', item._id)">
                <button class="button button--sm">Watch</button>
              </nuxt-link>
            </div>
          </template>
        </AppAccountHeader>
      </ul>
    </div>
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
      <AppModal id="deletePost">
        <template #default>
          <h5 class="mb-4">
            Are you sure you want to delete the post ?
          </h5>
          <div class="d-flex w-100 justify-content-end">
            <button
              class="button mr-2"
              type="buton"
              @click="$bvModal.hide('deletePost')"
            >
              Cancel
            </button>
            <button
              class="button button--danger"
              type="button"
              @click="deletePostItemClicked"
            >
              Delete
            </button>
          </div>
        </template>
      </AppModal>
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PostItem from '@/components/post/home-item.vue'
import AppAccountHeader from '@/components/ui/app-account-header.vue'
import FetchPaginationLayout from '@/components/layout/fetch-pagination-layout.vue'
import postsMixin from '@/mixins/posts.js'
export default {
  name: 'IndexPage',
  components: {
    PostItem,
    AppAccountHeader,
    FetchPaginationLayout,
  },
  mixins: [postsMixin],

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
      selected: null,
      postItem: {},
      currentAccount: {},
      suggAccounts: [],
    }
  },

  async fetch() {
    await this.getSuggUsers()
  },

  head() {
    return {
      title: 'Home',
      meta: [
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'SocialEx',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Posts, Home page',
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
    changeSearchOption() {},

    async getSuggUsers() {
      this.$loader.show()

      try {
        const users = await this.$api.users.getUsersList()
        this.currentAccount = await users.data.find(
          (item) => item._id.toString() === this.user._id.toString()
        )
        this.suggAccounts = await users.data.filter(
          (item) => item._id.toString() !== this.user._id.toString()
        )
      } catch (error) {
        this.handleError(error)
      } finally {
        this.$loader.hide()
      }
    },

    getItems(requestData) {
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

    async deletePostItemClicked() {
      try {
        await this.deletePostItem(this.postItem)
      } catch (error) {
        this.handleError(error)
      } finally {
        await this.$refs.fetchPaginationLayout.fetchItems()
        this.$bvModal.hide('deletePost')

      }
    }
  },
}
</script>
