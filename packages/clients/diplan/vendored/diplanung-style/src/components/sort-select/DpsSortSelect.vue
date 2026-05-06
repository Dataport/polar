<script lang="ts">
  import DpsFormSelect, { DpsFormSelectOption } from "@/components/form-select/DpsFormSelect.vue";
  import { getUniqueId } from "@/services/id.ts";
  import { defineComponent } from "vue";
  import type { PropType } from "vue";

  export interface DpsSortSelectData {
    selected: undefined | DpsFormSelectOption;
  }

  export default defineComponent({
    name: "DpsSortSelect",
    components: { DpsFormSelect },
    props: {
      /**
       * Unique ID of the select (optional).
       * @default undefined
       */
      id: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Array of options to be displayed.
       */
      options: {
        type: Array as PropType<DpsFormSelectOption[]>,
        required: true,
      },
      /**
       * ModelValue of the select.
       */
      modelValue: {
        type: String,
        required: true,
      },
      /**
       * Title attribute of the select.
       * @default "Sortierung anpassen"
       */
      title: {
        type: String,
        default: "Sortierung anpassen",
        required: false,
      },
      /**
       * Disables the select.
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
       */
      "update:modelValue",
    ],
    data(): DpsSortSelectData {
      return {
        selected: undefined,
      };
    },
    computed: {
      uniqueId() {
        return this.id ? this.id : getUniqueId("dps-sort-select-");
      },
    },
    watch: {
      modelValue() {
        this.setSelectedOption();
      },
    },
    created() {
      this.setSelectedOption();
    },
    methods: {
      setSelectedOption() {
        let defaultValue = this.options[0];

        for (const option of this.options) {
          if (option.value === this.modelValue) {
            defaultValue = option;
          }
        }

        this.selected = defaultValue;
      },
      handleChange(payload: DpsFormSelectOption) {
        this.$emit("update:modelValue", payload.value);
      },
    },
  });
</script>

<template>
  <DpsFormSelect
    :id="uniqueId"
    class="dps-sort-select"
    :class="{ 'dps-sort-select--disabled': disabled }"
    :model-value="selected"
    :options="options"
    :disabled="disabled"
    :title="title"
    required
    @update:model-value="handleChange"
  />
</template>
