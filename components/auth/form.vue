<template>
  <b-form class="form" @submit.prevent="onSubmit">
    <div class="form__logo">
      <img
        src="~/assets/images/socialex_logo.png"
        height="45"
        width="200"
        alt="Logo"
        class="logo"
      />
    </div>
    <div class="form__title">
      <h4>{{ register ? 'Sign up' : 'Sign in' }}</h4>
    </div>
    <div class="form__body">
      <div>
        <b-form-group v-if="register" id="name-form-group" class="form__field">
          <b-input
            id="input-name"
            v-model="$v.formFields.name.$model"
            :state="validateState('name')"
            aria-describedby="input-name-feedback"
            class="form__field-input"
            type="text"
            placeholder="User name"
            trim
          />
          <b-form-invalid-feedback id="input-name-feedback">
            <p v-if="!$v.formFields.name.required">This is a required field</p>
            <p
              v-else-if="
                !$v.formFields.name.minLength || !$v.formFields.name.maxLength
              "
            >
              Name of the user must be more 5 and lesser 30, now your name's
              length is {{ formFields.name.length }}
            </p></b-form-invalid-feedback
          >
        </b-form-group>
        <b-form-group id="email-form-group" class="form__field">
          <b-input
            id="input-email"
            v-model="$v.formFields.email.$model"
            :state="validateState('email')"
            aria-describedby="input-email-feedback"
            class="form__field-input"
            type="email"
            placeholder="User email"
            trim
          />
          <b-form-invalid-feedback id="input-email-feedback">
            <p v-if="!$v.formFields.email.required">This is a required field</p>
            <p v-else-if="!$v.formFields.email.email">Email must contain @</p>
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="password-form-group" class="form__field">
          <b-input
            id="input-password"
            v-model="$v.formFields.password.$model"
            class="form__field-input"
            placeholder="User password"
            :state="validateState('password')"
            aria-describedby="input-password-feedback"
            type="password"
          />
          <b-form-invalid-feedback id="input-password-feedback">
            <p v-if="!$v.formFields.password.required">
              This is a required field
            </p>
            <p
              v-else-if="
                !$v.formFields.password.minLength ||
                !$v.formFields.password.maxLength
              "
            >
              Password of the user must be more 8 and lesser 16, now your name's
              length is {{ formFields.password.length }}
            </p>
          </b-form-invalid-feedback>
        </b-form-group>
        <p>
          <span>{{
            register ? 'Have an account?' : "Don't have an account?"
          }}</span>
          <nuxt-link
            :to="register ? $getRoutePath('login') : $getRoutePath('register')"
            >{{ register ? 'Sign in' : 'Sign up' }}</nuxt-link
          >
        </p>
      </div>
    </div>
    <div class="form__actions">
      <button
        type="submit"
        class="form__submit-btn button button--fluid"
      >
        {{ register ? 'Sign up' : 'Sign in' }}
      </button>
    </div>
  </b-form>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'AuthFormComponent',

  mixins: [validationMixin],

  props: {
    register: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      formFields: {
        name: '',
        email: '',
        password: '',
      },
    }
  },

  mounted() {
    this.setFormFieldsData()
  },

  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.formFields[name]
      return $dirty ? !$error : null
    },

    setFormFieldsData() {
      !this.register ? delete this.formFields.name : (this.formFields.name = '')
    },

    onSubmit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.$emit('submit', this.formFields)
      }
    },
  },

  validations() {
    const validateObject = {
      formFields: {
        email: {
          required,
          email,
        },
        password: {
          required,
          minLength: minLength(8),
          maxLength: maxLength(16),
        },
      },
    }
    if (this.register) {
      validateObject.formFields.name = {
        required,
        minLength: minLength(5),
        maxLength: maxLength(30),
      }
    }
    return validateObject
  },
}
</script>
