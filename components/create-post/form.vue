<template>
  <b-form class="post form form--post" @submit.prevent="onSubmit">
    <div class="post__top-create">
      <div class="post__left">
        <label for="file" class="form-file-label post-file-label">
          <input
            id="file"
            ref="uploadFile"
            type="file"
            accept="image/*"
            class="post-file-input form-file"
            multiple
            :disabled="upload"
            @change="selectFile"
          />
          <div class="post-file-dropzone form-file-dropzone">
            <span>
              <b-icon icon="card-image" />
            </span>
            <p>Drag or Browse your file</p>
          </div>
        </label>
        <div
          v-if="$v.formFields.imgFiles.$error && $v.$dirty"
          class="form-file-helpers"
        >
          <p v-if="!$v.formFields.imgFiles.required">Field is required</p>
        </div>
      </div>
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
    <h4 class="post__uploaded-images-title">Upload images</h4>
    <p
      v-if="!formFields.imgFiles?.length && !upload"
      class="post__uploaded-images-text"
    >
      You have not added any files to the post yet
      <span @click="$refs.uploadFile.click()">Please upload</span>
    </p>
    <div v-if="formFields.imgFiles?.length" class="post__uploaded-images">
      <Container
        orientation="horizontal"
        behaviour="contain"
        @drop="changeQueue"
      >
        <Draggable v-for="(item, idx) in  formFields.imgFiles" :key="idx">
          <div
            :class="[
              { 'post__uploaded-image--exists': item.exists },
              { 'post__uploaded-image--uploaded': item.uploaded },
              'post__uploaded-image',
            ]"
          >
            <img :src="item.reader.result" alt="" />
            <div
              v-if="!upload"
              class="post__uploaded-image-remove"
              @click="removeImg(idx)"
            >
              <b-icon icon="x" />
            </div>
            <div v-if="!item.uploaded" class="post__uploaded-image-index">
              {{ idx + 1 }}
            </div>
            <div v-if="upload" class="post__uploaded-image-percent">
              <span>{{ item.uploadedPercent }}%</span>
              <div
                class="post__uploaded-image-percent-line"
                :style="{
                  width: `${item.uploadedPercent}%`,
                }"
              ></div>
            </div>
            <div class="post__uploaded-image-info">
              <span class="post__uploaded-image-info-name">
                {{ item.file.name }}
              </span>
              <span class="post__uploaded-image-info-size">
                {{ formatBytes(item.file.size) }}
              </span>
            </div>
          </div>
        </Draggable>
      </Container>
      <div
        v-if="!upload && files.length < 5"
        class="post__uploaded-add"
        @click="$refs.uploadFile.click()"
      >
        <span><b-icon icon="file-earmark-plus-fill" /></span>
      </div>
    </div>
    <div v-if="formFields.imgFiles.length" class="w-100 d-flex mt-2 mb-4">
      <button
        v-if="!upload"
        class="button button--sm button--fluid button--warning"
        type="button"
        @click="openConfirmModal"
      >
        Upload
      </button>
      <p
        v-if="upload"
        :class="[
          { 'text-warning': uploadProcess === 'Wait please' },
          'w-100 text-center text-success',
        ]"
      >
        {{ uploadProcess }}
        <b-icon
          :icon="uploadProcess === 'Wait please' ? 'hourglass-split' : 'check2'"
        />
      </p>
    </div>
    <div class="w-100 d-flex justify-content-end">
      <button type="submit" class="button button-primary">Create</button>
    </div>
    <client-only>
      <AppModal id="upload">
        <template #title> Upload Images </template>
        <template #default>
          <h5 class="mb-4 d-flex justify-content-center">
            Are you sure you want to upload those {{ files.length }} items?
            You can't add new images after upload !!
          </h5>
          <div class="d-flex w-100 justify-content-end">
            <button
              class="button button--danger mr-2"
              type="buton"
              @click="$bvModal.hide('upload')"
            >
              Cancel
            </button>
            <button class="button" type="button" @click="uploadToStorage">
              Upload
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
import uploadStorage from '@/mixins/upload.js'
import dragndrop from '@/mixins/dragndrop.js'
import selectFile from '@/mixins/selectFile.js'
import AppWysiwyg from '@/components/ui/app-wysiwyg'

export default {
  name: 'FormPostComponent',

  components: {
    AppWysiwyg,
    Container,
    Draggable,
  },

  mixins: [validationMixin, uploadStorage, dragndrop, selectFile],

  props: {
  },

  data() {
    return {
      formFields: {
        title: '',
        description: '',
        images: [],
        imgFiles: [],
      },
      files: [],
      upload: false,
      idFolderStorage: '',
    }
  },

  computed: {
    uploadProcess() {
      return this.formFields.imgFiles.every((item) => item.uploaded)
        ? 'Uploaded'
        : 'Wait please'
    },
  },

  mounted() {
    this.clearFormData()
  },

  methods: {
    openConfirmModal() {
      this.$bvModal.show('upload')
    },

    validateState(name) {
      const { $dirty, $error } = this.$v.formFields[name]
      return $dirty ? !$error : null
    },

    clearFormData() {
      this.formFields.title = ''
      this.formFields.description = ''
      this.formFields.images = []
      this.formFields.imgFiles = []
      this.upload = false
      this.idFolderStorage = ''
      this.files = []
    },

    changeQueue(result) {
      if (this.upload && this.files.length > 1) {
        return this.$notify({
          message: 'You can not change queue of images',
        })
      }
      this.formFields.imgFiles = this.onDrop(result, this.formFields.imgFiles)
      this.files = this.formFields.imgFiles.map((item) => item.file)
    },

    selectFile(val) {
      const files = Array.from(val.target.files)
      if (this.upload) {
        return this.$notify({
          message:
            'You already uploaded images, so if you want to change, post the post after you can edit the post',
          variant: 'warning',
        })
      }
      if (files.length > 5 || this.files.length + files.length > 5) {
        return this.$notify({
          message: 'You can add max 5 images',
          variant: 'warning',
        })
      }
      files.forEach((file) => {
        if (file.type.includes('image')) {
          const fileSize = this.formatBytes(file.size)
          const reader = new FileReader()
          reader.onload = (ev) => {
            const objFile = {
              file,
              reader: ev.target,
            }
            this.$set(objFile, 'exists', false)
            this.$set(objFile, 'uploadedPercent', 0)
            this.$set(objFile, 'uploaded', false)
            const existFile = this.formFields.imgFiles.find(
              (item) => item.file.name === objFile.file.name
            )
            if (file.size > 400000) {
              return this.$notify({
                message: `You are tried to upload the file "${file.name}" with size ${fileSize} but max size is 400KB`,
                variant: 'danger',
              })
            }
            if (existFile) {
              existFile.exists = true
              setTimeout(() => {
                existFile.exists = false
              }, 3000)
              return this.$notify({
                message: 'You are trying to upload the exists file',
                variant: 'danger',
              })
            } else {
              this.formFields.imgFiles.push(objFile)
            }
          }
          reader.readAsDataURL(file)
        } else {
          this.$notify({
            error: {
              message: 'You are trying to upload the wrong file type.',
            },
            variant: 'danger',
          })
        }
      })
      const currentFiles = this.formFields.imgFiles.map((item) => item.file)
      this.files = (currentFiles.length && currentFiles) || files
    },

    removeImg(idx) {
      this.formFields.imgFiles.splice(idx, 1)
      this.files = this.formFields.imgFiles.map((item) => item.file)
    },

    async onSubmit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        if (!this.upload) {
          return this.$notify({
            message: 'Please click to upload btn',
            variant: 'warning',
          })
        } else if (this.uploadProcess === 'Wait please') {
          return this.$notify({
            message: 'Please wait your images are uploading',
            variant: 'warning',
          })
        }
        try {
          this.formFields.images = await this.getUploadedPostImages(
            this.idFolderStorage
          )
          return this.$emit('submit', this.formFields)
        } catch (error) {
          this.handleError(error)
        }
      }
    },

    uploadToStorage() {
      try {
        this.idFolderStorage = Date.now().toString()
        this.upload = true
        this.files.forEach(async (file) => {
          await this.uploadFiles(
            file,
            this.idFolderStorage,
            this.formFields.imgFiles
          )
        })
      } catch (error) {
        this.handleError(error)
      } finally {
        this.$bvModal.hide('upload')
      }
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
      imgFiles: {
        required,
      },
    },
  },
}
</script>
