<script lang="ts">
  import { defineComponent } from "vue";
  import type { PropType } from "vue";

  export default defineComponent({
    name: "DpsFormInput",
    props: {
      /**
       * Unique ID of the input field.
       * @default undefined
       */
      id: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * ModelValue of the input.
       * @default undefined
       */
      modelValue: {
        type: [String, Number],
        required: false,
        default: undefined,
      },
      /**
       * Icon displayed at the end of the input field.
       * @default undefined
       */
      icon: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Placeholder text.
       * @default undefined
       */
      placeholder: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Title attribute of the input.
       * @default undefined
       */
      title: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Makes the field readonly.
       * @default false
       */
      readonly: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Disables the field.
       * @default false
       */
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * The maximum string length that the user can enter.
       * @default -1
       */
      maxlength: {
        type: Number,
        required: false,
        default: -1,
      },
      /**
       * The type of the input field.
       * @default "text"
       */
      type: {
        type: String as PropType<"text" | "url" | "email" | "number" | "search">,
        required: false,
        default: "text",
      },
      /**
       * The step attribute specifying the granularity number values have to
       * adhere to.
       * @default 1
       */
      step: {
        type: Number,
        required: false,
        default: 1,
      },
      /**
       * The minimum value to accept for this input.
       * @default undefined
       */
      min: {
        type: Number,
        required: false,
        default: undefined,
      },
      /**
       * The maximum value to accept for this input.
       * @default undefined
       */
      max: {
        type: Number,
        required: false,
        default: undefined,
      },
      /**
       * Pattern the value must match to be valid.
       * @default undefined
       */
      pattern: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Required field.
       * @default false
       */
      required: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Aria label for the input.
       * @default undefined
       */
      ariaLabel: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * ID of the element that labels the input.
       * @default undefined
       */
      ariaLabelledby: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * ID of the element that describes the input.
       * @default undefined
       */
      ariaDescribedby: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Vertical size of the input field.
       * @default undefined
       */
      size: {
        type: String as PropType<"sm">,
        required: false,
        default: undefined,
      },
      /**
       * Displays the success state.
       * @default false
       */
      success: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Displays the error state.
       * @default false
       */
      error: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    emits: [
      /**
       * Emitted when the value changes.
       * @event module:DpsFormInput#update:modelValue
       */
      "update:modelValue",
      /**
       * Emitted on keyup.
       * @event module:DpsFormInput#keyup
       */
      "keyup",
      /**
       * Emitted on keydown.
       * @event module:DpsFormInput#keydown
       */
      "keydown",
      /**
       * Emitted on blur.
       * @event module:DpsFormInput#blur
       */
      "blur",
      /**
       * Emitted on focus.
       * @event module:DpsFormInput#focus
       */
      "focus",
    ],
    computed: {
      iconName() {
        if (this.icon) {
          return this.icon;
        }

        if (this.error) {
          return "warning";
        } else if (this.success) {
          return "check";
        }

        return undefined;
      },
      showSearchCancelButton() {
        return (
          this.type === "search" &&
          typeof this.modelValue === "string" &&
          this.modelValue?.length > 0
        );
      },
    },
    methods: {
      focus() {
        const input = this.$refs.input as HTMLInputElement;

        input.focus();
      },
      cancelSearch() {
        this.$emit("update:modelValue", "");
        this.focus();
      },
      handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        const value = target.value;

        this.$emit("update:modelValue", value);
      },
    },
  });
</script>

<template>
  <div
    class="dps-form-input dps-input-wrapper"
    :class="{
      'dps-form-input--success': success,
      'dps-form-input--error': error,
    }"
  >
    <input
      :id="id"
      ref="input"
      :value="modelValue"
      class="dps-input"
      :class="{
        'dps-input--success': success,
        'dps-input--error': error,
        'dps-input--size-sm': size === 'sm',
        'dps-input--icon': iconName,
      }"
      :type="type"
      :step="type === 'number' ? step : undefined"
      :min="type === 'number' ? min : undefined"
      :max="type === 'number' ? max : undefined"
      :placeholder="placeholder"
      :title="title"
      :pattern="pattern"
      :required="required"
      :readonly="readonly"
      :disabled="disabled"
      :maxlength="maxlength"
      :aria-label="ariaLabel"
      :aria-describedby="ariaDescribedby"
      :aria-labelledby="ariaLabelledby"
      @keyup.stop="$emit('keyup', $event)"
      @keydown.stop="$emit('keydown', $event)"
      @blur.stop="$emit('blur', $event)"
      @focus.stop="$emit('focus', $event)"
      @input="handleInput"
    />

    <button
      v-if="showSearchCancelButton"
      type="button"
      class="dps-form-input__search-cancel-button dps-icon dps-icon--close"
      title="Eingabe zurücksetzen"
      @click="cancelSearch"
    />
    <span v-else-if="iconName" class="dps-icon" :class="'dps-icon--' + iconName" />
  </div>
</template>
