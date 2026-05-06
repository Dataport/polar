<script lang="ts">
  import { getUniqueId } from "@/services/id.ts";
  import { defineComponent } from "vue";

  export default defineComponent({
    name: "DpsFormRadio",
    props: {
      /**
       * Unique ID for the radio (optional)
       * @default undefined
       */
      id: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * ModelValue of the radio.
       * @default undefined
       */
      modelValue: {
        type: [String, Boolean, Number],
        required: false,
        default: undefined,
      },
      /**
       * Name attribute of the radio input.
       */
      name: {
        type: String,
        required: true,
      },
      /**
       * Value of the radio input.
       */
      value: {
        type: [String, Boolean, Number],
        required: true,
      },
      /**
       * Disables the radio input.
       * @default false
       */
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      readonly: {
        type: Boolean,
        required: false,
        default: false,
      },
      error: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Displays the component as a block.
       * @default false
       */
      block: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Truncates the label.
       * @default false
       */
      truncate: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Hides the label.
       * @default false
       */
      hideLabel: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    emits: [
      /**
       * Emitted when the selected value changes.
       * @event module:DpsFormRadio#update:modelValue
       */
      "update:modelValue",
    ],
    computed: {
      uniqueId() {
        return this.id ? this.id : getUniqueId("dps-form-radio-");
      },
      isChecked() {
        return this.modelValue === this.value;
      },
    },
    methods: {
      handleChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const value = target.value;

        this.$emit("update:modelValue", value);
      },
    },
  });
</script>

<template>
  <div
    class="dps-form-radio dps-input-wrapper"
    :class="{ 'dps-form-radio--block': block || truncate }"
  >
    <input
      :id="uniqueId"
      class="dps-form-radio__input dps-radio"
      :class="{ 'dps-radio--error': error }"
      type="radio"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="disabled || readonly"
      :readonly="readonly"
      @change="handleChange"
    />

    <label
      :for="uniqueId"
      class="dps-form-radio__label dps-label"
      :class="{
        'dps-form-radio__label--input-only': hideLabel,
        'dps-text--ellipse': truncate,
      }"
    >
      <span v-if="hideLabel" class="sr-only">
        <!-- @slot default - Label content -->
        <slot />
      </span>
      <template v-else>
        <!-- @slot default - Label content -->
        <slot />
      </template>
    </label>
  </div>
</template>
