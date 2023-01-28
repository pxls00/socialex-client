<template>
  <div class="d-flex post-main">
    <div class="post-main__left w-50">
      <b-carousel
        id="carousel-1"
        :controls="post.media?.length > 1"
        :indicators="post.media?.length > 1"
        :interval="0"
      >
        <b-carousel-slide
          v-for="(imgItem, key) in post.media"
          :key="key"
          alt="Image"
        >
          <template #img>
            <img class="d-block mx-auto post-main__left-item w-100" :src="imgItem.url" />
          </template>
        </b-carousel-slide>
      </b-carousel>
    </div>
    <div class="post-main__right w-50">
      <b-card header-tag="header" footer-tag="footer">
        <template #header>
          <AppAccountHeader
            :account="post.user ? post.user : {}"
            class="account--post"
          >
            <template #actions>
              <div class="post__top-more">
                <b-dropdown
                  id="dropdown-dropup"
                  class="post__top-more-btn"
                  dropdown
                  dropleft
                >
                  <template #button-content>
                    <b-icon icon="three-dots"></b-icon>
                  </template>
                  <div
                    class="d-flex py-1 px-2 justify-content-between dropdown-item-btn"
                    @click="copyPostURL(post)"
                  >
                    <span class="post__dropdown__item-more-link"
                      >Copy link</span
                    >
                    <span class="post__dropdown__item-more-icon"
                      ><b-icon icon="link-45deg"
                    /></span>
                  </div>
                  <div
                    v-if="!getOwnPost"
                    class="d-flex py-1 px-2 justify-content-between dropdown-item-btn"
                    @click="$router.push($getRoutePath('user', post.user._id))"
                  >
                    <span class="post__dropdown__item-more-link"
                      >Author account</span
                    >
                    <span class="post__dropdown__item-more-icon"
                      ><b-icon icon="person"
                    /></span>
                  </div>

                  <div
                    v-if="getOwnPost"
                    class="d-flex py-1 px-2 justify-content-between dropdown-item-btn"
                    @click="showMoreInfoBtn"
                  >
                    <span class="post__dropdown__item-more-link"
                      >More post</span
                    >
                    <span class="post__dropdown__item-more-icon"
                      ><b-icon icon="bar-chart-line"
                    /></span>
                  </div>

                  <div
                    v-if="getOwnPost"
                    class="d-flex py-1 px-2 justify-content-between dropdown-item-btn"
                    @click="$router.push($getRoutePath('editPost', post._id))"
                  >
                    <span class="post__dropdown__item-more-link"
                      >Edit post</span
                    >
                    <span class="post__dropdown__item-more-icon"
                    ><b-icon icon="pencil"
                    /></span>
                  </div>

                  <div
                    v-if="getOwnPost"
                    class="d-flex py-1 px-2 justify-content-between dropdown-item-btn"
                    @click="deleteItemBtn"
                  >
                    <span class="post__dropdown__item-more-link"
                      >Delete post</span
                    >
                    <span class="post__dropdown__item-more-icon"
                    ><b-icon icon="trash"
                    /></span>
                  </div>

                </b-dropdown>
              </div>
            </template>
          </AppAccountHeader>
        </template>
        <template #default>
          <div class="post__bottom-desc">
            <h5>
              <router-link :to="$getRoutePath(...getRouteAccount(post.user))">{{ post.user?.name }}</router-link>
              <span>{{ post.title }}</span>
            </h5>
            <p v-if="post.description" v-html="post.description" ></p>
          </div>
          <div class="post__comments">
            <slot name="post-comments" />
          </div>
        </template>
        <template #footer>
          <div class="post__bottom">
            <div class="post__bottom-actions">
              <span
                :class="[
                  { 'post__bottom-action--like': getLike },
                  'post__bottom-action',
                ]"
                @click="like"
              >
                <b-icon :icon="getLike ? 'heart-fill' : 'heart'"></b-icon>
              </span>
              <span
                class="post__bottom-action post__bottom-action--comment"
                @click="$emit('add-comment')"
              >
                <b-icon icon="chat-dots"></b-icon>
              </span>
              <span
                v-b-tooltip.hover.right="'Copy to clipboard'"
                class="post__bottom-action post__bottom-action--send"
                @click="copyPostURL(post)"
              >
                <b-icon icon="link-45deg"></b-icon>
              </span>
              <span
                class="post__bottom-action post__bottom-action--save"
                @click="save"
              >
                <b-icon
                  :icon="getSave ? 'bookmark-plus-fill' : 'bookmark-plus'"
                ></b-icon>
              </span>
            </div>
            <div class="post__bottom-info">
              <span
                class="post__bottom-info-likes"
                @click="showLikedUsersListBtn"
                ><b>{{ post.likes?.length }}</b> likes</span
              >
              <span class="post__bottom-info-date"
                >Posted in {{ formatTime() }}</span
              >
            </div>
            <div class="post__bottom-comment">
              <slot name="post-input" />
            </div>
          </div>
        </template>
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppAccountHeader from '@/components/ui/app-account-header.vue'

export default {
  name: 'PostComponent',
  components: {
    AppAccountHeader,
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('auth', ['user']),

    getOwnPost() {
      if ('user' in this.post) {
        if (this.post.user._id.toString() === this.user._id.toString()) {
          return true
        }
      }
      return false
    },

    getLike() {
      if ('likes' in this.post) {
        if (
          this.post.likes.find(
            (item) => item._id.toString() === this.user._id.toString()
          )
        ) {
          return true
        }
      }
      return false
    },

    getSave() {
      if ('savedUsers' in this.post) {
        if (
          this.post.savedUsers.find(
            (item) => item._id.toString() === this.user._id.toString()
          )
        ) {
          return true
        }
      }
      return false
    },
  },
  methods: {
    getRouteAccount(account = {}) {
      if('_id' in account) {
        if(account._id.toString() === this.user._id.toString()) {
          return ['profile']
        }
      }
      return ['user', account._id]
    },

    async copyPostURL(data) {
      const url = `https://socialex-static.vercel.app/posts/${data._id}`
      try {
        await navigator.clipboard.writeText(url)
        this.$notify({ message: 'Copied to clipboard', variant: 'success' })
      } catch (error) {
        this.handleError(error)
      }
    },

    formatTime() {
      if ('createdData' in this.post) {
        const date = new Date(this.post.createdData)
        const year = date.getFullYear()
        const month = date.getMonth()
        const day = date.getDay()
        const hour = date.getHours()
        const minutes = date.getMinutes()
        return `${day}.0${month + 1}.${year} ${hour}:${minutes < 10 ? `0${minutes}` : minutes}`
      }
    },

    like() {
      if (this.getLike) {
        this.$emit('unlike')
      } else {
        this.$emit('like')
      }
    },

    save() {
      if (this.getSave) {
        this.$emit('unsave')
      } else {
        this.$emit('save')
      }
    },

    showLikedUsersListBtn() {
      this.$emit('likeList', this.post)
    },

    showMoreInfoBtn() {
      this.$emit('getMoreInfo', this.post)
    },

    deleteItemBtn() {
      this.$emit('deletePost', this.post)
    }
  },
}
</script>
