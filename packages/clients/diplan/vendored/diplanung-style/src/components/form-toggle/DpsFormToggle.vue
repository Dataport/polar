<script>
  // TODO Refactoring: Fix sizes
  export default {
    name: "DpsFormToggle",
    props: {
      /**
       * The unique identifier for the input element.
       * @default undefined
       */
      id: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * The current value of the toggle switch (on/off).
       * @default false
       */
      modelValue: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * The title attribute for the input element, shown as a tooltip on hover.
       * @default undefined
       */
      title: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Disables the toggle switch when set to true.
       * @default false
       */
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * An ARIA label for accessibility, describing the input element.
       * @default undefined
       */
      ariaLabel: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * ID of an element that labels the input element.
       * @default undefined
       */
      ariaLabelledby: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * ID of an element that describes the input element.
       * @default undefined
       */
      ariaDescribedby: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Size of the toggle switch. Can be 'sm' for small, 'md' for medium, or undefined for default.
       * @default undefined
       */
      size: {
        type: String,
        required: false,
        default: undefined,
        validator(value) {
          return [undefined, "sm", "md"].includes(value); // TODO Fix
        },
      },
    },
    emits: [
      /**
       * Emitted when the toggle switch's value changes.
       * @event update:modelValue
       * @type { boolean }
       */
      "update:modelValue",
    ],
  };
</script>

<template>
  <div class="dps-form-toggle dps-input-wrapper">
    <label :title="title" class="dps-form-toggle__container">
      <input
        :id="id"
        ref="input"
        type="checkbox"
        :checked="modelValue"
        class="dps-toggle"
        :disabled="disabled"
        :aria-label="ariaLabel"
        :aria-describedby="ariaDescribedby"
        :aria-labelledby="ariaLabelledby"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <span
        :class="{ ['dps-form-toggle__slider--size-' + size]: size }"
        class="dps-form-toggle__slider"
      >
      </span>
      <span v-if="$slots.default" class="dps-form-toggle__label">
        <!-- @slot default - Label content -->
        <slot />
      </span>
    </label>
  </div>
</template>
