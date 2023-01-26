<template>
  <div class="comment-item">
    <AppAccountHeader :account="item.user" class="account-comment">
      <template #actions>
        <div class="comment-credentials">
          <span class="comment-reply" @click="replyBtn"><b-icon icon="reply-fill"/></span>
          <span v-if="getOwnComment" class="comment-edit" @click="editBtn"><b-icon icon="pencil-fill"/></span>
          <span v-if="getOwnComment" class="comment-delete" @click="deleteBtn"><b-icon icon="trash"/></span>
        </div>
      </template>
    </AppAccountHeader>
    <div class="comment-body">
      <p>{{ item.body }}</p>
    </div>
    <span v-if="!showReplies && item.comments?.length" class="comment-replies-controler" @click="showReplies = true">Show replies <b-icon icon="arrow-bar-down"/></span>
    <span v-if="showReplies && item.comments?.length" class="comment-replies-controler" @click="showReplies = false">Hide replies <b-icon icon="arrow-bar-up"/></span>
    <div v-if="showReplies" class="comment-replies">
      <ReplyItem v-for="(replyItem, idx) in item.comments" :key="idx" :item="replyItem"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppAccountHeader from '@/components/ui/app-account-header.vue'
import eventBus from '@/bus/eventBus'

export default {
  name: 'ReplyItem',
  components: {
    AppAccountHeader
  },

  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      showReplies: false
    }
  },

  computed: {
    ...mapState('auth', ['user']),
    getOwnComment() {
      if('user' in this.item) {
        if(this.item.user._id.toString() === this.user._id.toString()) {
          return true
        }
      }
      return false
    },
  },

  methods: {
    replyBtn() {
      eventBus.$emit('replyItem', this.item)
    },
    editBtn() {
      eventBus.$emit('editItem', this.item)
    },
    deleteBtn() {
      eventBus.$emit('deleteItem', this.item)
    },
  }
}
</script>
