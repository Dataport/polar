<script lang="ts">
  import DpsFormCheckbox from "@/components/form-checkbox/DpsFormCheckbox.vue";
  import sanitizeHtml from "sanitize-html";
  import { defineComponent } from "vue";
  import type { PropType } from "vue";
  import { getUniqueId } from "@/services/id.ts";

  export interface DpsFormCheckboxGroupOptionExtras {
    disabled?: boolean;
    readonly?: boolean;
    error?: boolean;
    tooltip?: string;
  }

  export type DpsFormCheckboxGroupOption = {
    [key: string]: string | boolean;
  } & DpsFormCheckboxGroupOptionExtras;

  export interface DpsFormCheckboxGroupData {
    selected: undefined | string[];
  }

  export default defineComponent({
    name: "DpsFormCheckboxGroup",
    components: {
      DpsFormCheckbox,
    },
    props: {
      /**
       * The unique identifier for the checkbox group (optional).
       * @default undefined
       */
      id: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * modelValue of the checkbox group.
       * @default undefined
       */
      modelValue: {
        type: Array as PropType<string[]>,
        required: false,
        default: undefined,
      },
      /**
       * Name attribute of the checkboxes.
       * @default undefined
       */
      name: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Label for the checkbox group.
       * @default undefined
       */
      label: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Whether the label should be visually hidden.
       * @default false
       */
      hideLabel: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Array of checkbox data to be displayed.
       */
      options: {
        type: Array as PropType<DpsFormCheckboxGroupOption[]>,
        required: true,
      },
      /**
       * Key to use for the checkbox values.
       * @default "value"
       */
      optionValue: {
        type: String,
        required: false,
        default: "value",
      },
      /**
       * Key to use for the checkbox labels.
       * @default "label"
       */
      optionLabel: {
        type: String,
        required: false,
        default: "label",
      },
      /**
       * Disables the checkbox group.
       * @default false
       */
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Checkboxes displayed in line.
       * @default false
       */
      inline: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Truncates the labels.
       * @default false
       */
      truncate: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Size of the checkboxes.
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
       * Emitted when one of the values changes.
       * @event module:DpsFormCheckboxGroup#update:modelValue
       */
      "update:modelValue",
    ],
    data(): DpsFormCheckboxGroupData {
      return {
        selected: undefined,
      };
    },
    computed: {
      mappedOptions() {
        const intermediateOptions: DpsFormCheckboxGroupOption[] = [];

        this.options.forEach((elem) => {
          let option: DpsFormCheckboxGroupOption = {};

          if (typeof elem !== "object") {
            option[this.optionValue] = elem;
            option[this.optionLabel] = elem;
          } else {
            option = JSON.parse(JSON.stringify(elem));
          }

          intermediateOptions.push(option);
        });

        return intermediateOptions;
      },
      uniqueId() {
        return this.id ? this.id : getUniqueId("dps-form-checkbox-group-");
      },
    },
    created() {
      this.selected = this.modelValue;
    },
    methods: {
      handleChange(value: string[]) {
        this.selected = value;

        this.$emit("update:modelValue", value);
      },
      getLabelContent(option: DpsFormCheckboxGroupOption) {
        const value = option[this.optionLabel];

        if (typeof value === "string") {
          return sanitizeHtml(value);
        }

        return value.toString();
      },
    },
  });
</script>

<template>
  <fieldset
    :id="uniqueId"
    class="dps-form-checkbox-group"
    :class="{ 'dps-form-checkbox-group--inline': inline }"
  >
    <legend v-if="label" class="dps-label" :class="{ 'visually-hidden': hideLabel }">
      {{ label }}
    </legend>

    <div class="dps-input-wrapper">
      <DpsFormCheckbox
        v-for="(option, index) in mappedOptions"
        :id="uniqueId + '-option-' + index"
        :key="'option-' + index"
        :name="name"
        :value="option[optionValue]"
        :disabled="disabled || option.disabled"
        :readonly="option.readonly"
        :error="option.error"
        :block="!inline"
        :truncate="truncate"
        :tooltip="option.tooltip"
        :size="size"
        :model-value="selected"
        @update:model-value="handleChange"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="getLabelContent(option)"></span>
      </DpsFormCheckbox>
    </div>
  </fieldset>
</template>
