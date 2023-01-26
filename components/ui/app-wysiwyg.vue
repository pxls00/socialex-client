<template>
  <div
    ref="block"
    :class="[
      $style['block'],
      { [$style['block--focus']]: inFocus },
      { [$style['block--required']]: required },
      { [$style['block--disabled']]: disabled },
      { [$style['block--has-error']]: hasError },
      { [$style['block--filled']]: value && value.length },
    ]"
  >
    <div :class="$style['block_field']" @click.prevent="handleWrapperClick">
      <div :class="$style['block_input']">
        <div
          :class="$style['block_placeholder']"
          :style="{ marginTop: `-${fieldScrollTop}px` }"
        >
          {{ placeholder }}
        </div>
        <ckeditor-nuxt
          ref="blockTextarea"
          :value="value"
          :config="editorConfig"
          :disabled="disabled"
          :class="[...inputClasses]"
          @input="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </div>
    </div>

    <div v-if="$slots.help" :class="$style['block_help']">
      <slot name="help"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppWysiwyg',
  components: {
    'ckeditor-nuxt': () => {
      if (process.client) {
        return import('@blowstack/ckeditor-nuxt')
      }
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    hasError: {
      type: Boolean,
      default: false,
    },
    inputClasses: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      inFocus: false,
      fieldScrollTop: 0,
      editorConfig: {
        removePlugins: ['Title'],
      },
    }
  },
  methods: {
    handleChange(e) {
      this.$emit('change', e)
    },
    handleFocus() {
      this.inFocus = true
      this.$emit('focus')
    },
    handleBlur() {
      this.inFocus = false
      this.$emit('blur')
    },
    handleWrapperClick() {
      const editableDiv =
        this.$refs.blockTextarea.$el.parentElement.querySelector(
          '[contenteditable="true"]'
        )
      editableDiv.focus()
    },
  },
}
</script>

<style lang="scss" module>
$secondary: var(--secondary);
.block {
  textarea {
    display: block;
    width: 100%;
    height: auto;
    min-height: 48px;
    box-sizing: border-box;
    color: $primary-black;
    border-radius: 5px;
    padding: 22px 16px 4px;
    -webkit-appearance: none;
    -moz-appearance: none;
    box-shadow: none;
    outline: none;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &::placeholder {
      font-size: 16px;
      line-height: 1.4;
      color: rgba($secondary, 0.8);
    }
  }

  &_field {
    overflow: hidden;
  }

  &_input {
    position: relative;
    flex: 1 1 100%;
    padding-top: 20px;
  }

  &_placeholder {
    position: absolute;
    top: 73px;
    left: 0;
    cursor: text;
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: rgba($primary-black-07, 0.8);
    padding: 0 16px;
    transition: transform 0.2s, font-size 0.2s, color 0.2s;
    z-index: 2;
  }

  &_help {
    font-size: 12px;
    line-height: 1.2;
    color: rgba($primary-black-07, 0.8);
    padding: 0 16px;
    margin: 4px 0 0 0;
    p {
      margin: 0;
    }
  }

  &--focus {
    .block_placeholder {
      font-size: 12px;
      color: $primary-black-05;
      top: 0;
    }
  }

  &--filled {
    .block_placeholder {
      font-size: 12px;
      top: 0;
    }
  }

  &--required {
    .block_placeholder {
      &:after {
        content: '*';
        display: inline-block;
      }
    }
  }

  &--disabled {
    .block {
      &_field {
        cursor: not-allowed;
        opacity: 0.6;
      }
      &_placeholder {
        pointer-events: none;
      }
    }
    textarea {
      cursor: not-allowed;
    }
  }

  &--has-error {
    .block {
      &_help,
      &_placeholder {
        color: $primary-red;
      }
    }
  }
}
</style>
