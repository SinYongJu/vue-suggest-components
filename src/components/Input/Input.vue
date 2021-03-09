<template>
  <div class="input_comm">
    <label class="lab_comm" :class="{ screen_out: screenOut }" :for="id">{{ label }}</label>
    <input
      class="inp_comm"
      v-model="input"
      :name="name"
      :type="type"
      :id="id"
      :class="{ on_error: error }"
      :placeholder="placeholder"
      @keydown="onKeyDown"
      @input="onInput"
      @focus="focus"
      @blur="blur"
      ref="input"
      v-bind="$attrs"
    />
    <p v-if="error && errorText" class="desc_error">{{ errorText }}</p>
  </div>
</template>

<script>
export default {
  name: 'common-input',
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    screenOut: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    errorText: {
      type: String,
      default: ''
    }
  },
  computed: {
    input: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('update:value', value)
      }
    }
  },
  methods: {
    onInput(event) {
      this.$emit('onInput', event)
    },
    focus(event) {
      this.$refs.input.focus()
      this.$emit('update:focus', event)
    },
    blur(event) {
      this.$refs.input.blur()
      this.$emit('update:blur', event)
    },
    onKeyDown(event) {
      // key down event Listener
      this.$emit('keydown', event)
    }
  }
}
</script>
<style scoped>
/* input component */
.input_comm {
  position: relative;
}
.input_comm .lab_comm {
  display: block;
}
.input_comm .inp_comm {
  width: 100%;
  border: 0;
  background-color: transparent;
  padding: 5px 11px;
  box-sizing: border-box;
  border: 1px solid #e1e1e1;
  border-radius: 2px;
  font-size: 12px;
  line-height: 20px;
  color: #555;
}

.input_comm .inp_comm:focus {
  border-color: #555;
}
.input_comm .inp_comm.on_error {
  border-color: #f8626c;
}
.input_comm .inp_comm:disabled {
  background-color: #fbfbfb;
  border-color: #f0f0f0;
}
.input_line .inp_comm {
  padding: 17px 0 15px;
  font-size: 16px;
  line-height: 18px;
  border-radius: 0;
  border: 2px solid #555;
  border-width: 0 0 2px 0;
  color: #222;
}
.input_line .inp_comm:disabled {
  background-color: #fff;
  border-color: #555;
}
.input_comm >>> .inp_comm::-webkit-input-placeholder {
  color: #bbb;
}
.input_comm >>> .inp_comm::-moz-placeholder {
  color: #bbb;
}
.input_comm >>> .inp_comm:-ms-input-placeholder {
  color: #bbb;
}
.input_comm >>> .inp_comm:-moz-placeholder {
  color: #bbb;
}
.input_comm >>> .desc_error {
  margin-top: 4px;
  font-size: 12px;
  border-bottom: 1px solid #f8626c;
  color: #f8626c;
  line-height: 18px;
}
</style>
