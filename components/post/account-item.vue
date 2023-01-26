<template>
  <div class="posts__item">
    <div class="posts__item-img">
      <img :src="item.media ? item.media[0].url : item.img" alt="" width="250px" height="250px">
    </div>
    <div class="posts__item-credentials" @click="toPostBtn">
      <span class="posts__item-credentials-item posts__item-credentials--like">
        {{  Array.isArray(item.likes) ? item.likes?.length : item.likes }} <b-icon :icon="getLiked ? 'heart-fill': 'heart'"/>
      </span>
      <span class="posts__item-credentials-item posts__item-credentials--comment">
        {{ item?.commentsLength }} <b-icon icon="chat-dots"/>
      </span>
      <span v-if="item.savedUsers" class="posts__item-credentials-item posts__item-credentials--save">
        {{ Array.isArray(item.savedUsers) ? item.savedUsers?.length : item.savedUsers }} <b-icon :icon="getSaved ? 'bookmark-plus-fill': 'bookmark-plus'"/>
      </span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AccountPostComponent',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState('auth', ['user']),

    getLiked() {
      if (
        this.item.likes.find(
          (item) => item._id.toString() === this.user._id.toString()
        )
      ) {
        return true
      }
      return false
    },

    getSaved() {

      if (
        this.item.savedUsers && this.item.savedUsers.find(
          (item) => item._id.toString() === this.user._id.toString()
        )
      ) {
        return true
      }
      return false
    }
  },
  methods: {
    toPostBtn() {
      this.$emit('goToPost', this.item)
    }
  }
}
</script>
