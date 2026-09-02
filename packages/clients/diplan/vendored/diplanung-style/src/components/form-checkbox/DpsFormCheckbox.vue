<script lang="ts">
  import { getUniqueId } from "@/services/id.ts";
  import { defineComponent } from "vue";
  import type { PropType } from "vue";

  export default defineComponent({
    name: "DpsFormCheckbox",
    props: {
      /**
       * The unique identifier for the checkbox (optional).
       * @default undefined
       */
      id: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * modelValue of the checkbox.
       * @default undefined
       */
      modelValue: {
        type: [String, Boolean, Number, Array] as PropType<
          string | boolean | number | string[] | boolean[] | number[]
        >,
        required: false,
        default: undefined,
      },
      /**
       * Name attribute of the input.
       * @default undefined
       */
      name: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Value attribute of the input.
       * @default true
       */
      value: {
        type: [String, Boolean, Number],
        required: false,
        default: true,
      },
      /**
       * Title attribute of the component.
       * @default undefined
       */
      tooltip: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Disables the checkbox.
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
       * Checkbox is displayed as block.
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
      /**
       * The size of the component.
       * @default undefined
       */
      size: {
        type: String as PropType<"sm">,
        required: false,
        default: undefined,
      },
    },
    emits: [
      /**
       * Emitted when the value changes.
       * @event module:DpsFormCheckbox#update:modelValue
       */
      "update:modelValue",
    ],
    computed: {
      uniqueId() {
        return this.id ? this.id : getUniqueId("dps-form-checkbox-");
      },
      isChecked() {
        if (Array.isArray(this.modelValue)) {
          return this.modelValue.includes(this.value as never);
        }

        return this.modelValue === this.value;
      },
    },
    methods: {
      handleChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        let newModelValue;

        if (Array.isArray(this.modelValue)) {
          newModelValue = [...this.modelValue];

          if (this.modelValue.includes(value as never)) {
            newModelValue = newModelValue.filter((item) => item !== value);
          } else {
            newModelValue = [...newModelValue, value];
          }
        } else if (typeof this.modelValue === "boolean") {
          newModelValue = false;

          if (this.modelValue !== Boolean(value)) {
            newModelValue = Boolean(value);
          }
        } else if (typeof this.modelValue === "number") {
          newModelValue = 0;

          if (this.modelValue !== Number(value)) {
            newModelValue = Number(value);
          }
        } else {
          newModelValue = "";

          if (this.modelValue !== value) {
            newModelValue = value;
          }
        }

        this.$emit("update:modelValue", newModelValue);
      },
    },
  });
</script>

<template>
  <div
    class="dps-form-checkbox dps-input-wrapper"
    :class="{
      ['dps-form-checkbox--size-' + size]: size,
      'dps-form-checkbox--block': block || truncate,
    }"
  >
    <input
      :id="uniqueId"
      class="dps-form-checkbox__input dps-checkbox"
      :class="{
        ['dps-checkbox--size-' + size]: size,
        'dps-checkbox--error': error,
      }"
      type="checkbox"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="disabled || readonly"
      :readonly="readonly"
      @change="handleChange"
    />

    <label
      :for="uniqueId"
      :title="tooltip"
      class="dps-form-checkbox__label dps-label"
      :class="{
        'dps-form-checkbox__label--input-only': hideLabel,
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
