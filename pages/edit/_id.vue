<template>
  <div class="edit-post-page">
    <EditPostForm ref="formEditPost" :initial-data="post" @submit="onSubmit" @deletePost="$bvModal.show('deletePost')"/>
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
import EditPostForm from '@/components/edit-post/form.vue'
import postsMixin from '@/mixins/posts.js'

export default {
  name: 'EditPostPage',
  components: {
    EditPostForm,
  },
  mixins: [postsMixin],

  middleware: ['auth'],
  data() {
    return {
      post: {}
    }
  },
  async fetch() {
    this.post = await this.getPostItem(this.$route.params.id)
  },
  head() {
    return {
      title: 'Edit post',
      meta: [
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'SocialEx',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `Edit post page`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'The project of pxls00. Editing and publication of content on the website as directed by the digital content manager',
        },
      ],
    }
  },
  methods: {
    async onSubmit(data) {
      this.$loader.show()
        try {
          const requestData = {
            title: data.title,
            description: data.description,
            media: data.media
          }
          await this.$api.posts.editPostsItem({ data: requestData }, {id: data._id})
        } catch (error) {
          this.handleError(error)
        } finally {
          this.$router.push(this.$getRoutePath('home'))
          this.$loader.hide()
        }
    },
    async getPostItem(id) {
      this.$loader.show()
      try {
        const post = await this.$api.posts.getPostItem({}, {id})
        return await post
      } catch (error) {
        this.handleError(error)
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
    }
  },
}
</script>
