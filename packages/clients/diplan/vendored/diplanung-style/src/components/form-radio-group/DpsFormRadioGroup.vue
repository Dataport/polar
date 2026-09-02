<script lang="ts">
  import DpsFormRadio from "@/components/form-radio/DpsFormRadio.vue";
  import sanitizeHtml from "sanitize-html";
  import { defineComponent } from "vue";
  import type { PropType } from "vue";
  import { getUniqueId } from "@/services/id.ts";

  export interface DpsFormRadioGroupOptionExtras {
    disabled?: boolean;
    readonly?: boolean;
    error?: boolean;
    tooltip?: string;
  }

  export type DpsFormRadioGroupOption = {
    [key: string]: string | boolean;
  } & DpsFormRadioGroupOptionExtras;

  export interface DpsFormRadioGroupData {
    selected: undefined | string | boolean | number;
  }

  export default defineComponent({
    name: "DpsFormRadioGroup",
    components: {
      DpsFormRadio,
    },
    props: {
      /**
       * The unique identifier for the radio group (optional).
       * @default undefined
       */
      id: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * ModelValue of the radio group.
       * @default undefined
       */
      modelValue: {
        type: [String, Boolean, Number],
        required: false,
        default: undefined,
      },
      /**
       * Name of the radio inputs.
       */
      name: {
        type: String,
        required: true,
      },
      /**
       * Label for the radio group.
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
       * Array of options to be displayed.
       */
      options: {
        type: Array as PropType<DpsFormRadioGroupOption[]>,
        required: true,
      },
      /**
       * Which key to use for the option value.
       * @default "value"
       */
      optionValue: {
        type: String,
        required: false,
        default: "value",
      },
      /**
       * Which key to use for the option label.
       * @default "label"
       */
      optionLabel: {
        type: String,
        required: false,
        default: "label",
      },
      /**
       * Whether the radio group should be disabled.
       * @default false
       */
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Whether the radio inputs should be displayed in line.
       * @default false
       */
      inline: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Whether the labels should be truncated.
       * @default false
       */
      truncate: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    emits: [
      /**
       * Emitted when the selected value changes.
       * @event module:DpsFormRadioGroup#update:modelValue
       */
      "update:modelValue",
    ],
    data(): DpsFormRadioGroupData {
      return {
        selected: undefined,
      };
    },
    computed: {
      mappedOptions() {
        const intermediateOptions: DpsFormRadioGroupOption[] = [];

        this.options.forEach((elem) => {
          let option: DpsFormRadioGroupOption = {};

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
        return this.id ? this.id : getUniqueId("dps-form-radio-group-");
      },
    },
    watch: {
      modelValue(value) {
        this.selected = value;
      },
    },
    created() {
      this.selected = this.modelValue;
    },
    methods: {
      handleChange(event: string) {
        this.$emit("update:modelValue", event);
      },
      getLabelContent(option: DpsFormRadioGroupOption) {
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
    class="dps-form-radio-group"
    :class="{ 'dps-form-radio-group--inline': inline }"
  >
    <legend v-if="label" class="dps-label" :class="{ 'visually-hidden': hideLabel }">
      {{ label }}
    </legend>

    <div class="dps-input-wrapper">
      <DpsFormRadio
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
        :model-value="selected"
        @update:model-value="handleChange"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="getLabelContent(option)"></span>
      </DpsFormRadio>
    </div>
  </fieldset>
</template>
