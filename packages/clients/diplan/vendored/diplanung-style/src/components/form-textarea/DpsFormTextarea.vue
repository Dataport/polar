<script lang="ts">
  import { defineComponent } from "vue";
  import type { PropType } from "vue";

  export default defineComponent({
    name: "DpsFormTextarea",
    props: {
      /**
       * ModelValue of the textarea.
       * @default undefined
       */
      modelValue: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Sets whether the textarea is resizable, and if so, in which directions.
       * @default false
       */
      resizable: {
        type: [Boolean, String] as PropType<boolean | "vertical" | "horizontal">,
        required: false,
        default: false,
      },
      /**
       * Success state of the textarea.
       * @default false
       */
      success: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Error state of the textarea.
       * @default false
       */
      error: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * The number of visible text lines.
       * @default 3
       */
      rows: {
        type: Number,
        required: false,
        default: 3,
      },
      /**
       * Makes the textarea readonly.
       * @default false
       */
      readonly: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Disables the textarea.
       * @default false
       */
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    emits: [
      /**
       * Emitted when the value changes.
       */
      "update:modelValue",
    ],
    methods: {
      handleInput(event: Event) {
        const target = event.target as HTMLTextAreaElement;
        const value = target.value;

        this.$emit("update:modelValue", value);
      },
    },
  });
</script>

<template>
  <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
  <textarea
    class="dps-form-textarea dps-textarea"
    :class="{
      'dps-form-textarea--resize': resizable === true,
      'dps-form-textarea--resize-v': resizable === 'vertical',
      'dps-form-textarea--resize-h': resizable === 'horizontal',
      'dps-form-textarea--success': success,
      'dps-form-textarea--error': error,
    }"
    :value="modelValue"
    :rows="rows"
    :readonly="readonly"
    :disabled="disabled"
    @input="handleInput"
  />
</template>
