<template>
  <div class="create-post-page">
    <CreatePostForm ref="formCreatePost" @submit="onSubmit"/>
  </div>
</template>

<script>
import CreatePostForm from '@/components/create-post/form.vue'
export default {
  name: 'CreatePostPage',
  components: {
    CreatePostForm,
  },
  middleware: ['auth'],
  data() {
    return {
      post: {}
    }
  },
  async fetch() {
    if(this.$route.query.edit) {
      this.post = await this.getPostItem(this.$route.query.edit)
    }
  },
  head() {
    return {
      title: 'Create post',
      meta: [
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'SocialEx',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `Create post page`,
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
    onSubmit(data) {
      this.$loader.show()
      setTimeout(async () => {
        try {
          const requestData = {
            title: data.title,
            media: data.images.map((item) => {
              return { url: item }
            }),
            description: data.description,
          }
          await this.$api.posts.craetePostsItem({ data: requestData })
          this.$router.push(this.$getRoutePath('home'))
        } catch (error) {
          this.handleError(error)
        } finally {
          this.$refs.formCreatePost.clearFormData()
          this.$loader.hide()
        }
      }, 6000)
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
    }
  },
}
</script>
