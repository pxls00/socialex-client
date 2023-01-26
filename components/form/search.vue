<template>
  <b-form class="w-100" @submit.prevent="onSubmit">
    <b-input-group
      :class="[
        'input_group',
        {
          ['input_group--fill']: val.trim() !== '',
        },
      ]"
    >
      <b-input-group-prepend
        is-text
        class="cursor-pointer"
        @click="onSubmit"
      >
        <b-icon icon="search"></b-icon>
      </b-input-group-prepend>
      <b-form-input
        v-model.trim="val"
        type="text"
        placeholder="Search"
        class="search_input"
      />
      <span class="input_group__clear">
        <b-icon icon="x" class="text-dark" @click="onClear" />
      </span>
    </b-input-group>
  </b-form>
</template>

<script>
export default {
  name: 'FormSearch',

  props: {
    searchVal: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      val: '',
    }
  },

  mounted() {
    this.val = this.searchVal
  },


  methods: {
    onSubmit() {
      this.$emit('submit', this.val)
    },
    onClear(val) {
      this.val = ''
      this.onSubmit()
    },
  },
}
</script>

