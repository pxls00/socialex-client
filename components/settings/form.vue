<template>
  <b-form class="settings form form--post" @submit.prevent="onSubmit">
    <div class="settings__top">
      <div class="settings__left">
        <label
          v-show="false"
          for="file"
          class="form-file-label post-file-label"
        >
          <input
            id="file"
            ref="uploadFile"
            type="file"
            accept="image/*"
            class="post-file-input form-file"
            @change="selectFile"
          />
          <div class="post-file-dropzone form-file-dropzone">
            <span>
              <b-icon icon="card-image" />
            </span>
            <p>Drag or Browse your profile image</p>
          </div>
        </label>
        <div class="settings__left-avatar">
          <img
            :src="
              'result' in formFields.imageFile
                ? formFields.imageFile.result
                : formFields?.image
            "
          />
          <div
            class="settings__left-avatar-btn"
            @click="$refs.uploadFile.click()"
          >
            <span><b-icon icon="camera" /></span>
            <p>Change Photo</p>
          </div>
        </div>
      </div>
      <div class="settings__right">
        <b-form-group label="Name:" label-for="input-name">
          <b-form-input
            id="input-name"
            v-model="$v.formFields.name.$model"
            :state="validateState('name')"
            aria-describedby="input-name-feedback"
            class="settings__input"
            type="text"
            placeholder="User name:"
          />
          <b-form-invalid-feedback id="input-name-feedback">
            <p v-if="!$v.formFields.name.required">This is a required field</p>
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group label="Email:" label-for="input-email">
          <b-form-input
            id="input-email"
            v-model="$v.formFields.email.$model"
            :state="validateState('email')"
            aria-describedby="input-email-feedback"
            class="settings__input"
            type="email"
            placeholder="User email:"
          />
          <b-form-invalid-feedback id="input-email-feedback">
            <p v-if="!$v.formFields.email.required">This is a required field</p>
            <p v-else-if="!$v.formFields.email.email">
              This field must include @
            </p>
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
    </div>
    <div class="settings__field">
      <b-form-group label="User name:" label-for="input-username">
        <b-form-input
          id="input-username"
          v-model="formFields.username"
          class="settings__input"
          type="text"
          placeholder="User username:"
        />
      </b-form-group>
    </div>
    <div class="settings__field">
      <b-form-group>
        <client-only placeholder="loading...">
          <AppWysiwyg
            v-model="formFields.bio"
            class="w-100"
            placeholder="User bio"
          >
          </AppWysiwyg>
        </client-only>
      </b-form-group>
    </div>
    <div class="w-100 d-flex justify-content-end mt-5">
      <button
        type="button"
        class="button button--danger mr-1"
        @click="$bvModal.show('deleteAccount')"
      >
        Delete Account
      </button>
      <button
        type="button"
        class="button button--warning mr-1"
        @click="cancelUpdateClicked"
      >
        Cancel
      </button>
      <button type="submit" class="button">Update</button>
    </div>
    <client-only>
      <AppModal id="deleteAccount">
        <template #default>
          <h5 class="mb-4">
            Are you sure you want to delete your account? 
            All your data will be lost and cannot be recovered !!
          </h5>
          <div class="d-flex w-100 justify-content-end">
            <button
              class="button mr-2"
              type="buton"
              @click="$bvModal.hide('deleteAccount')"
            >
              Cancel
            </button>
            <button
              class="button button--danger"
              type="button"
              @click="deleteAccount"
            >
              Delete
            </button>
          </div>
        </template>
      </AppModal>
    </client-only>
    <client-only>
      <AppModal id="cancelUpdate">
        <template #default>
          <h5 class="mb-4">Are you sure you want to stop the update ?</h5>
          <div class="d-flex w-100 justify-content-end">
            <button
              class="button mr-2"
              type="buton"
              @click="$bvModal.hide('cancelUpdate')"
            >
              No
            </button>
            <button
              class="button button--danger"
              type="button"
              @click="cancelUpdate"
            >
              Yes
            </button>
          </div>
        </template>
      </AppModal>
    </client-only>
    <client-only>
      <AppModal id="cropImage">
        <Cropper
          ref="cropper"
          class="cropper"
          :stencil-props="{
            aspectRatio: 1,
          }"
          :debounce="false"
          :src="
            formFields.imageFile ? formFields.imageFile.url : formFields.image
          "
        />
        <div class="d-flex w-100 justify-content-end mt-4">
          <button class="button button--danger" @click="closeCropModal">
            Cancel
          </button>
          <button class="button ml-2" @click="cropImage">Crop</button>
        </div>
      </AppModal>
    </client-only>
  </b-form>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email, minLength, maxLength } from 'vuelidate/lib/validators'
import { Cropper } from 'vue-advanced-cropper'
import selectFile from '@/mixins/selectFile.js'
import uploadStorage from '@/mixins/upload.js'
import AppWysiwyg from '@/components/ui/app-wysiwyg'
import 'vue-advanced-cropper/dist/style.css'

export default {
  name: 'FormSettingsComponent',

  components: {
    AppWysiwyg,
    Cropper,
    // eslint-disable-next-line vue/no-unused-components
  },

  mixins: [validationMixin, selectFile, uploadStorage],

  props: {
    initialData: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      formFields: {
        name: '',
        username: '',
        bio: '',
        email: '',
        imageFile: {},
        image: '',
      },
      file: '',
    }
  },

  mounted() {
    this.setFormData(this.initialData)
  },

  methods: {
    deleteAccount() {
      this.$emit('deleteAccount')
      this.$bvModal.hide('deleteAccount')
    },

    cancelUpdateClicked() {
      if (
        this.formFields.name !== this.initialData.name ||
        this.formFields.username !== this.initialData.username ||
        this.formFields.bio !== this.initialData.bio ||
        Object.keys(this.formFields.imageFile).length
      ) {
        this.$bvModal.show('cancelUpdate')
      } else {
        this.cancelUpdate()
      }
    },

    cancelUpdate() {
      this.clearFormData()
      this.$router.push(this.$getRoutePath('home'))
    },

    validateState(name) {
      const { $dirty, $error } = this.$v.formFields[name]
      return $dirty ? !$error : null
    },

    setFormData(data) {
      if (Object.keys(data).length) {
        this.formFields.name = data.name
        this.formFields.username = data.username
        this.formFields.bio = data.bio
        this.formFields.email = data.email
        this.formFields.image = data.image
      }
    },

    clearFormData() {
      this.formFields.name = ''
      this.formFields.username = ''
      this.formFields.bio = ''
      this.formFields.email = ''
      this.formFields.image = ''
      this.formFields.imageFile = {}
      this.file = ''
    },

    selectFile(val) {
      this.$loader.show()
      const file = val.target.files[0]
      const fileSize = this.formatBytes(file.size)
      if (!file.type.includes('image')) {
        this.$loader.hide()
        this.$notify({
          message: `You are tried to upload the wrong file type "${file.type}" accepts only for ['.png', '.jpg', '.jpeg', '.gif']`,
          variant: 'danger',
        })
        return
      }

      if (file.size > 400000) {
        this.$loader.hide()
        this.$notify({
          message: `You are tried to upload the file "${file.name}" with size ${fileSize} but max size is 400KB`,
          variant: 'danger',
        })
        return
      }
      // eslint-disable-next-line no-new
      new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          resolve({
            file,
            url: event.target.result,
          })
        }
        reader.readAsDataURL(file)
        if (reader.error) {
          reject(reader.error)
        }
      }).then((photo) => {
        this.$loader.hide()
        this.formFields.imageFile = photo
        this.$set(this.formFields.imageFile, 'uploaded', false)
        this.$bvModal.show('cropImage')
      })
    },

    closeCropModal() {
      this.formFields.imageFile = ''
      this.$bvModal.hide('cropImage')
    },

    cropImage() {
      const result = this.$refs.cropper.getResult()
      this.file = this.formFields.imageFile.file
      this.$set(
        this.formFields.imageFile,
        'result',
        result.canvas.toDataURL(this.formFields.imageFile.file.type)
      )
      this.$bvModal.hide('cropImage')
    },

    uploadFile() {
      try {
        const folderName = this.initialData._id.toString()
        this.uploadProfileFile(this.formFields.imageFile, folderName).then(
          () => {
            this.getUploadedFile()
          }
        )
      } catch (error) {
        this.handleError(error)
      }
    },

    getUploadedFile() {
      try {
        const folderName = this.initialData._id.toString()
        this.getUploadedProfileFile(folderName).then(() => {
          setTimeout(() => {
            this.$emit('submit', this.formFields)
          }, 3000)
        })
      } catch (error) {
        this.handleError(error)
      }
    },

    async onSubmit() {
      this.$loader.show()
      this.$v.$touch()
      if (!this.$v.$invalid) {
        if (
          Object.keys(this.formFields.imageFile).length &&
          this.formFields.imageFile
        ) {
          await this.uploadFile()
        } else {
          this.$emit('submit', this.formFields)
        }
      }
    },
  },

  validations: {
    formFields: {
      name: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(30),
      },
      email: {
        required,
        email,
      },
      username: {
        maxLength: maxLength(30),
      },
    },
  },
}
</script>
