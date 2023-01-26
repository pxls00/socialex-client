<template>
  <b-form class="post form form--post" @submit.prevent="onSubmit">
    <div class="post__top-create">
      <div class="post__right">
        <b-form-group label="Title:" label-for="input-name">
          <b-form-input
            id="input-name"
            v-model="$v.formFields.title.$model"
            :state="validateState('title')"
            aria-describedby="input-title-feedback"
            class="post__input"
            type="text"
            placeholder="Post title"
          />
          <b-form-invalid-feedback id="input-title-feedback">
            <p v-if="!$v.formFields.title.required">This is a required field</p>
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group>
          <client-only placeholder="loading...">
            <AppWysiwyg
              v-model="$v.formFields.description.$model"
              :has-error="$v.formFields.description.$error && $v.$dirty"
              placeholder="Description"
            >
              <template
                v-if="$v.formFields.description.$error && $v.$dirty"
                #help
              >
                <p v-if="!$v.formFields.description.required">
                  Field is required.
                </p>
              </template>
            </AppWysiwyg>
          </client-only>
        </b-form-group>
      </div>
    </div>
    <h4 class="post__uploaded-images-title">Post images</h4>
    <div v-if="formFields.images?.length" class="post__uploaded-images">
      <Container
        orientation="horizontal"
        behaviour="contain"
        @drop="changeQueue"
      >
        <Draggable v-for="(item, idx) in formFields.images" :key="idx">
          <div :class="['post__uploaded-image']">
            <img :src="item.url" alt="" />
            <div
              v-if="formFields.images.length > 1"
              class="post__uploaded-image-remove"
              @click="removeImg(idx)"
            >
              <b-icon icon="x" />
            </div>
            <div class="post__uploaded-image-index">
              {{ idx + 1 }}
            </div>
          </div>
        </Draggable>
      </Container>
    </div>
    <div class="w-100 d-flex justify-content-end">
      <button
        type="button"
        class="button button--warning"
        @click="$router.push($getRoutePath('home'))"
      >
        Cancel
      </button>
      <button
        type="button"
        class="button ml-1 button--danger"
        @click="deleteItemBtn"
      >
        Delete
      </button>
      <button type="submit" class="button ml-1">Save</button>
    </div>
    <client-only>
      <AppModal id="deleteItemImage">
        <template #default>
          <h5 class="mb-4">
            Are you sure you want to delete the image of post ? You can't add
            new image after deletion !
          </h5>
          <div class="d-flex w-100 justify-content-end">
            <button
              class="button mr-2"
              type="buton"
              @click="$bvModal.hide('deleteItemImage')"
            >
              Cancel
            </button>
            <button
              class="button button--danger"
              type="button"
              @click="deleteImagePost"
            >
              Delete
            </button>
          </div>
        </template>
      </AppModal>
    </client-only>
  </b-form>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import dragndrop from '@/mixins/dragndrop.js'
import AppWysiwyg from '@/components/ui/app-wysiwyg'

export default {
  name: 'FormEditPostComponent',

  components: {
    AppWysiwyg,
    Container,
    Draggable,
  },

  mixins: [validationMixin, dragndrop],

  props: {
    initialData: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      formFields: {
        title: '',
        description: '',
        images: [],
      },
      imageIndex: 0,
    }
  },

  watch: {
    initialData() {
      this.setFormData(this.initialData)
    },
  },

  mounted() {
    this.setFormData(this.initialData)
  },

  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.formFields[name]
      return $dirty ? !$error : null
    },

    clearFormData() {
      this.formFields.title = ''
      this.formFields.description = ''
      this.formFields.images = []
    },

    setFormData(data) {
      if (Object.keys(data).length) {
        this.formFields.title = data.title
        this.formFields.description = data.description
        this.formFields.images = data.media
      }
    },

    removeImg(idx) {
      this.imageIndex = idx
      this.$bvModal.show('deleteItemImage')
    },

    deleteImagePost() {
      this.formFields.images.splice(this.imageIndex, 1)
      this.$bvModal.hide('deleteItemImage')
      this.$notify({
        message: 'Click to save button for saving changes',
        variant: 'warning',
      })
    },

    changeQueue(result) {
      if (this.formFields.images.length <= 1) {
        return this.$notify({
          message: 'You can not change queue of images',
          variant: 'warning',
        })
      }
      this.formFields.images = this.onDrop(result, this.formFields.images)
      this.$notify({
        message: 'Click to save button for saving changes',
        variant: 'warning',
      })
    },

    onSubmit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        try {
          const requestData = { ...this.initialData }
          requestData.title = this.formFields.title
          requestData.description = this.formFields.description
          requestData.media = this.formFields.images
          return this.$emit('submit', requestData)
        } catch (error) {
          this.handleError(error)
        }
      }
    },

    deleteItemBtn() {
      this.$emit('deletePost', this.post)
    },
  },

  validations: {
    formFields: {
      title: {
        required,
      },
      description: {
        required,
      },
    },
  },
}
</script>
