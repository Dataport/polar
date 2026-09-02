<script lang="ts">
  import { defineComponent } from "vue";
  import type { PropType } from "vue";

  export default defineComponent({
    name: "DpsAlphabeticFilter",
    props: {
      /**
       * Array of available filter options.
       * @default ["A-G", "H-N", "O-U", "V-Z"]
       */
      options: {
        type: Array as PropType<string[]>,
        default: () => ["A-G", "H-N", "O-U", "V-Z"],
        required: false,
      },
      /**
       * The modelValue
       * @default undefined
       */
      modelValue: {
        type: String,
        default: undefined,
        required: false,
      },
      /**
       * Requires some option to be active.
       * @default false
       */
      required: {
        type: Boolean,
        default: false,
        required: false,
      },
      /**
       * Disables the component.
       * @default false
       */
      disabled: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
    emits: [
      /**
       * Emitted when the selected value changes.
       * @event module:DpsAlphabeticFilter#update:modelValue
       */
      "update:modelValue",
    ],
    methods: {
      selectOption(value: string) {
        let newValue: string | undefined = value;

        if (this.disabled) {
          return;
        }

        if (this.required) {
          if (newValue !== this.modelValue) {
            this.$emit("update:modelValue", newValue);
          }
        } else {
          newValue = newValue === this.modelValue ? undefined : value;

          this.$emit("update:modelValue", newValue);
        }
      },
    },
  });
</script>

<template>
  <ul
    role="tablist"
    class="dps-alphabetic-filter"
    :class="{ 'dps-alphabetic-filter--disabled': disabled }"
  >
    <li
      v-for="(option, key) in options"
      :key="'alphabetic-filter-' + key"
      class="dps-alphabetic-filter__list-item"
      role="presentation"
    >
      <button
        class="dps-alphabetic-filter__option-button"
        :class="{
          'dps-alphabetic-filter__option-button--active': modelValue === option,
        }"
        type="button"
        role="tab"
        aria-controls="filter"
        :aria-selected="modelValue === option"
        :disabled="disabled"
        @click="selectOption(option)"
      >
        {{ option }}
      </button>
    </li>
  </ul>
</template>
