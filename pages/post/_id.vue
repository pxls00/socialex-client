<template>
  <div class="post-page">
    <PostMain
      :post="postItem"
      @unlike="removeLikeClicked"
      @like="addLikeClicked"
      @unsave="removeSavedPostClicked"
      @save="savePostClicked"
      @likeList="$bvModal.show('likedUsersModal')"
      @getMoreInfo="$bvModal.show('moreInfoPostModal')"
      @add-comment="$refs.addInput.focus()"
      @deletePost="$bvModal.show('deletePost')"
    >
      <template #post-comments>
        <CommentItem
          v-for="(item, idx) in postItem.comments"
          :key="idx"
          :item="item"
        />
      </template>
      <template #post-input>
        <div v-if="reply" class="post__bottom-reply">
          <button class="post__botttom-reply-close" @click="closeReply">
            <b-icon icon="x" />
          </button>
          <p>
            Reply to:
            <span class="post__bottom-reply-name"
              >@{{ replyItem.user.name }}</span
            >
          </p>
          <p>
            Comment:
            <span class="post__bottom-reply-body">{{ replyItem.body }}</span>
          </p>
        </div>
        <form class="post__bottom-input" @submit.prevent="onSubmit">
          <input
            ref="addInput"
            v-model="replyBody"
            type="text"
            class="post-comment-input"
            placeholder="Add comment"
          />
          <button
            v-if="!editReply"
            type="submit"
            :class="[
              { 'button--disabled': !replyBody },
              'button button-sm post-comment-btn',
            ]"
            :disabled="!replyBody"
          >
            Add
          </button>
          <button
            v-if="editReply"
            type="submit"
            :class="[
              { 'button--disabled': !replyBody },
              'button button-sm post-comment-btn',
            ]"
            :disabled="!replyBody"
          >
            Save
          </button>
        </form>
      </template>
    </PostMain>
    <client-only>
      <AppModal id="likedUsersModal">
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
      <AppModal id="moreInfoPostModal">
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
      <AppModal id="deleteReply">
        <template #default>
          <h5 class="mb-4">
            Are you sure you want to delete comment "{{ deleteItem?.body }}" ?
          </h5>
          <div class="d-flex w-100 justify-content-end">
            <button
              class="button mr-2"
              type="buton"
              @click="$bvModal.hide('deleteReply')"
            >
              Cancel
            </button>
            <button
              class="button button--danger"
              type="button"
              @click="deleteItemReplyClicked"
            >
              Delete
            </button>
          </div>
        </template>
      </AppModal>
    </client-only>
    <client-only>
      <AppModal id="deletePost">
        <template #default>
          <h5 class="mb-4">Are you sure you want to delete the post ?</h5>
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
import PostMain from '@/components/post/main-item.vue'
import CommentItem from '@/components/comment/index.vue'
import postsMixin from '@/mixins/posts.js'
import AppAccountHeader from '@/components/ui/app-account-header.vue'
import eventBus from '@/bus/eventBus'

export default {
  name: 'PostItemPage',
  components: {
    PostMain,
    AppAccountHeader,
    CommentItem,
  },
  mixins: [postsMixin],
  middleware: ['auth'],

  data() {
    return {
      postItem: {},
      postComments: [],
      reply: false,
      replyItem: {},
      replyBody: '',
      editReply: false,
      editItem: false,
      deleteItem: {},
    }
  },

  async fetch() {
    await this.getPost()
  },

  head() {
    return {
      meta: [
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'SocialEx',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.postItem?.title,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.postItem?.description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.postItem?.media ? this.postItem?.media[0].url : '',
        },
      ],
    }
  },

  created() {
    this.replyItemEvent()
    this.editItemEvent()
    this.deleteItemEvent()
  },
  methods: {
    async getPost() {
      this.$loader.show()
      try {
        this.postItem = await this.$api.posts.getPostItem(
          {},
          { id: this.$route.params.id }
        )
      } catch (error) {
        this.handleError(error)
      } finally {
        this.$loader.hide()
      }
    },

    async removeLikeClicked() {
      try {
        await this.removeLike(this.postItem)
      } catch (error) {
        this.handleError(error)
      } finally {
        await this.$fetch()
        this.$notify({
          message: 'Post has been unliked sucessfully',
          variant: 'success',
        })
      }
    },

    async addLikeClicked() {
      try {
        await this.addLike(this.postItem)
      } catch (error) {
        this.handleError(error)
      } finally {
        await this.$fetch()
        this.$notify({
          message: 'Post has been liked sucessfully',
          variant: 'success',
        })
      }
    },

    async removeSavedPostClicked() {
      try {
        await this.removeSavedPost(this.postItem)
      } catch (error) {
        this.handleError(error)
      } finally {
        await this.$fetch()
        this.$notify({
          message: 'Post has been removed sucessfully',
          variant: 'success',
        })
      }
    },

    async savePostClicked() {
      try {
        await this.savePost(this.postItem)
      } catch (error) {
        this.handleError(error)
      } finally {
        await this.$fetch()
        this.$notify({
          message: 'Post has been saved sucessfully',
          variant: 'success',
          delay: 2000,
        })
      }
    },

    replyItemEvent() {
      eventBus.$on('replyItem', (item) => {
        this.editReply = false
        this.editItem = {}
        this.reply = true
        this.replyItem = item
        this.replyBody = ''
      })
    },

    editItemEvent() {
      eventBus.$on('editItem', (item) => {
        this.reply = false
        this.replyItem = {}
        this.editReply = true
        this.editItem = item
        this.replyBody = item.body
      })
    },

    deleteItemEvent() {
      eventBus.$on('deleteItem', (item) => {
        this.reply = false
        this.replyItem = {}
        this.editReply = false
        this.editItem = {}
        this.deleteItem = item
        this.$bvModal.show('deleteReply')
      })
    },

    closeReply() {
      this.reply = false
      this.replyItem = false
      this.$refs.addInput.blur()
      this.replyBody = ''
    },

    async addReplySubmitted() {
      const requestData = {}
      if (!this.replyBody.trim()) {
        this.$notify({
          message: 'If you want to add comment input field must not be empty',
          variant: 'warning',
        })
        this.replyBody = ''
        return
      }
      requestData.body = this.replyBody.trim()
      try {
        if (this.reply) {
          await this.addReply(requestData, {
            postId: this.postItem._id,
            replyId: this.replyItem._id,
          })
        } else {
          await this.addComment(requestData, this.postItem._id)
        }
      } catch (error) {
        this.handleError(error)
      } finally {
        await this.$fetch()
        this.$notify({
          message: 'Your comment added successfully',
          variant: 'success',
          delay: 2000,
        })
        this.replyBody = ''
        this.reply = false
        this.replyItem = {}
      }
    },

    async editReplySubmitted() {
      const requestData = {}
      if (!this.replyBody.trim()) {
        this.$notify({
          message: 'If you want to delete comment just click to delete btn',
          variant: 'warning',
        })
        this.replyBody = ''
        return
      }
      requestData.body = this.replyBody.trim()
      try {
        await this.editComment(requestData, {
          postId: this.postItem._id,
          replyId: this.editItem._id,
        })
      } catch (error) {
        this.handleError(error)
      } finally {
        await this.$fetch()
        this.$notify({
          message: 'Your comment edited successfully',
          variant: 'success',
          delay: 2000,
        })
        this.replyBody = ''
        this.editReply = false
        this.editItem = {}
      }
    },

    async onSubmit() {
      if (!this.editReply) {
        await this.addReplySubmitted()
      } else {
        await this.editReplySubmitted()
      }
    },

    async deleteItemReplyClicked() {
      try {
        await this.deleteComment(
          {},
          { postId: this.postItem._id, replyId: this.deleteItem._id }
        )
        this.$bvModal.hide('deleteReply')
      } catch (error) {
        this.handleError(error)
      } finally {
        await this.$fetch()
        this.$notify({
          message: 'Your comment has been deleted successfully',
          variant: 'success',
          delay: 2000,
        })
        this.deleteItem = {}
      }
    },

    async addComment(requestData, id) {
      this.$loader.show()
      try {
        await this.$api.postComment.addPostComment(
          { data: requestData },
          { id }
        )
      } catch (error) {
        this.handleError()
      } finally {
        this.$loader.hide()
      }
    },

    async addReply(requestData, { postId, replyId }) {
      this.$loader.show()
      try {
        await this.$api.postReply.addPostReply(
          { data: requestData },
          { postId, replyId }
        )
      } catch (error) {
        this.handleError()
      } finally {
        this.$loader.hide()
      }
    },

    async editComment(requestData, { postId, replyId }) {
      this.$loader.show()
      try {
        await this.$api.postReply.editPostReply(
          { data: requestData },
          { postId, replyId }
        )
      } catch (error) {
        this.handleError()
      } finally {
        this.$loader.hide()
      }
    },

    async deleteComment(requestData, { postId, replyId }) {
      this.$loader.show()
      try {
        await this.$api.postReply.deletePostReply(
          { data: requestData },
          { postId, replyId }
        )
      } catch (error) {
        this.handleError()
      } finally {
        this.$loader.hide()
      }
    },

    async deletePostItemClicked() {
      try {
        await this.deletePostItem(this.postItem)
      } catch (error) {
        this.handleError(error)
      } finally {
        this.$router.push(this.$getRoutePath('home'))
        this.$bvModal.hide('deletePost')
      }
    },
  },
}
</script>
