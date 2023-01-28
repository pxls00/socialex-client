<template>
  <b-card header-tag="header" footer-tag="footer">
    <template #header>
      <AppAccountHeader :account="data.user" class="account--post">
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
                @click="copyPostURL(data)"
              >
                <span class="post__dropdown__item-more-link">Copy link</span>
                <span class="post__dropdown__item-more-icon"
                  ><b-icon icon="link-45deg"
                /></span>
              </div>
              <div
                v-if="!getOwnPost"
                class="d-flex py-1 px-2 justify-content-between dropdown-item-btn"
                @click="$router.push($getRoutePath('user', data.user._id))"
              >
                <span class="post__dropdown__item-more-link"
                  >Author account</span
                >
                <span class="post__dropdown__item-more-icon"
                  ><b-icon icon="person"
                /></span>
              </div>
              <div
                class="d-flex py-1 px-2 justify-content-between dropdown-item-btn"
                @click="$router.push($getRoutePath('post', data._id))"
              >
                <span class="post__dropdown__item-more-link">Go to post</span>
                <span class="post__dropdown__item-more-icon"
                  ><b-icon icon="life-preserver"
                /></span>
              </div>

              <div
                v-if="getOwnPost"
                class="d-flex py-1 px-2 justify-content-between dropdown-item-btn"
                @click="showMoreInfoBtn"
              >
                <span class="post__dropdown__item-more-link">More post</span>
                <span class="post__dropdown__item-more-icon"
                  ><b-icon icon="bar-chart-line"
                /></span>
              </div>

              <div
                v-if="getOwnPost"
                class="d-flex py-1 px-2 justify-content-between dropdown-item-btn"
                @click="$router.push($getRoutePath('editPost', data._id))"
              >
                <span class="post__dropdown__item-more-link">Edit post</span>
                <span class="post__dropdown__item-more-icon"
                  ><b-icon icon="pencil"
                /></span>
              </div>

              <div
                v-if="getOwnPost"
                class="d-flex py-1 px-2 justify-content-between dropdown-item-btn"
                @click="deleteItemBtn"
              >
                <span class="post__dropdown__item-more-link">Delete post</span>
                <span class="post__dropdown__item-more-icon"
                  ><b-icon icon="trash"
                /></span>
              </div>
            </b-dropdown>
          </div>
        </template>
      </AppAccountHeader>
    </template>
    <b-carousel
      id="carousel-1"
      :controls="data.media?.length > 1"
      :indicators="data.media?.length > 1"
      img-height="350"
      :interval="0"
    >
      <b-carousel-slide
        v-for="(imgItem, key) in data.media"
        :key="key"
        alt="Image"
      >
        <template #img>
          <img class="d-block mx-auto" height="350" :src="imgItem.url" />
        </template>
      </b-carousel-slide>
    </b-carousel>
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
            @click="$router.push($getRoutePath('post', data._id))"
          >
            <b-icon icon="chat-dots"></b-icon>
          </span>
          <span
            v-b-tooltip.hover.right="'Copy to clipboard'"
            class="post__bottom-action post__bottom-action--send"
            @click="copyPostURL(data)"
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
          <span class="post__bottom-info-likes" @click="showLikedUsersListBtn"
            ><b>{{ data.likes.length }}</b> likes</span
          >
          <span class="post__bottom-info-date">Posted in {{ getTime }}</span>
        </div>
        <div class="post__bottom-desc">
          <h5>
            <router-link :to="$getRoutePath(...getRouteAccount(data.user))">{{
              data.user.name
            }}</router-link>
            <span>{{ data.title }}</span>
          </h5>
        </div>
        <router-link
          :to="$getRoutePath('post', data._id)"
          class="post__bottom-comments-link"
          >{{
            !!data?.commentsLength
              ? `View all (${data?.commentsLength}) comments`
              : 'No comments yet'
          }}</router-link
        >
      </div>
    </template>
  </b-card>
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
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('auth', ['user']),

    getLike() {
      if (
        this.data?.likes.find(
          (item) => item._id.toString() === this.user._id.toString()
        )
      ) {
        return true
      }
      return false
    },

    getSave() {
      if (
        this.data?.savedUsers.find(
          (item) => item._id.toString() === this.user._id.toString()
        )
      ) {
        return true
      }
      return false
    },

    getOwnPost() {
      if (this.data?.user._id.toString() === this.user._id.toString()) {
        return true
      }
      return false
    },

    getTime() {
      return this.formatTime()
    },
  },
  methods: {
    getRouteAccount(account = {}) {
      if ('_id' in account) {
        if (account._id.toString() === this.user._id.toString()) {
          return ['profile']
        }
      }
      return ['user', account._id]
    },

    formatTime() {
      const date = new Date(this.data.createdData)
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDay()
      const hour = date.getHours()
      const minutes = date.getMinutes()
      return `${day}.0${month + 1}.${year} ${hour}:${
        minutes < 10 ? `0${minutes}` : minutes
      }`
    },

    like() {
      if (this.getLike) {
        this.$emit('unlike', this.data)
      } else {
        this.$emit('like', this.data)
      }
    },

    save() {
      if (this.getSave) {
        this.$emit('unsave', this.data)
      } else {
        this.$emit('save', this.data)
      }
    },

    async copyPostURL(data) {
      const url = `https://socialex-test.vercel.app/posts/${data._id}`
      try {
        await navigator.clipboard.writeText(url)
        this.$notify({ message: 'Copied to clipboard', variant: 'success' })
      } catch (error) {
        this.handleError(error)
      }
    },

    showLikedUsersListBtn() {
      this.$emit('likeList', this.data)
    },

    showMoreInfoBtn() {
      this.$emit('getMoreInfo', this.data)
    },

    deleteItemBtn() {
      this.$emit('deletePost', this.data)
    },
  },
}
</script>
