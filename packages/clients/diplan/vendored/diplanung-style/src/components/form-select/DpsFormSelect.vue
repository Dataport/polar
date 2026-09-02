<script lang="ts">
  import Multiselect from "vue-multiselect";
  import { getUniqueId } from "@/services/id.ts";
  import DpsFilterButton from "@/components/filter-button/DpsFilterButton.vue";
  import { defineComponent } from "vue";
  import type { PropType } from "vue";

  export interface DpsFormSelectOption {
    [key: string]: string | number;
  }

  interface VueMultiselect {
    $el: HTMLDivElement;
  }

  export interface DpsFormSelectData {
    selected:
      | undefined
      | string
      | number
      | string[]
      | number[]
      | DpsFormSelectOption[]
      | DpsFormSelectOption;
    multiselectEl: null | HTMLDivElement;
  }

  export default defineComponent({
    name: "DpsFormSelect",
    components: { DpsFilterButton, Multiselect },
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
       * Size of the select.
       * @default undefined
       */
      size: {
        type: String as PropType<"sm">,
        required: false,
        default: undefined,
      },
      /**
       * Style variant of the select.
       * @default undefined
       */
      variant: {
        type: String as PropType<"filter" | "simple">,
        required: false,
        default: undefined,
      },
      /**
       * Hides tags for selected elements (only for multiple).
       * @default false
       */
      hideTags: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * ModelValue for the select.
       * @default undefined
       */
      modelValue: {
        type: [String, Number, Array, Object] as PropType<
          string | number | string[] | number[] | DpsFormSelectOption[] | DpsFormSelectOption
        >,
        required: false,
        default: undefined,
      },
      /**
       * Key for the label text in the option object.
       * @default "label"
       */
      optionLabel: {
        type: String,
        required: false,
        default: "label",
      },
      /**
       * Key for the value in the option object.
       * @default "value"
       */
      optionValue: {
        type: String,
        required: false,
        default: "value",
      },
      /**
       * Makes the select readonly.
       * @default false
       */
      readonly: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Requires a value to be selected.
       * @default false
       */
      required: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Title attribute of the select.
       * @default props.placeholder
       */
      title: {
        type: String,
        required: false,
        default(props: { placeholder?: string }) {
          return props.placeholder;
        },
      },
      /**
       * Label for the select.
       * @default undefined
       */
      label: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Icon placed before the select in the simple variant.
       * @default undefined
       */
      icon: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Success state of the select.
       * @default false
       */
      success: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Error state of the select.
       * @default false
       */
      error: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Aligns the dropdown left or right.
       * @default "start"
       */
      align: {
        type: String as PropType<"start" | "end">,
        required: false,
        default: "start",
      },
      // -----------------------
      // Vue-Multiselect
      // -----------------------
      /**
       * Array of available options: Objects, Strings or Integers. If array of objects, visible label will default to option.label.
       */
      options: {
        type: Array as PropType<DpsFormSelectOption[] | string[] | number[]>,
        required: true,
      },
      /**
       * Clear the search input after `select()`. Use only when multiple is true.
       * @default true
       */
      clearOnSelect: {
        type: Boolean,
        required: false,
        default: true,
      },
      /**
       * Enable/disable closing after selecting an option
       * @default true
       */
      closeOnSelect: {
        type: Boolean,
        required: false,
        default: true,
      },
      /**
       * Enable/disable the multiselect.
       * @default false
       */
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Number of allowed selected options.
       * @default undefined
       */
      max: {
        type: Number,
        required: false,
        default: undefined,
      },
      /**
       * Equivalent to the multiple attribute on a `<select>` input.
       * @default false
       */
      multiple: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Fixed opening direction (instead of auto). Options are "above"/"top" or "below"/"bottom"
       * @default ""
       */
      openDirection: {
        type: String as PropType<"" | "above" | "top" | "below" | "bottom">,
        required: false,
        default: "",
      },
      /**
       * Equivalent to the placeholder attribute on a `<select>` input.
       * @default "Bitte wählen"
       */
      placeholder: {
        type: String,
        required: false,
        default: "Bitte wählen",
      },
      /**
       * Selects the first option if initial value is empty
       * @default false
       */
      preselectFirst: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * If set to true, will preserve the search query when opening/closing the component.
       * @default false
       */
      preserveSearch: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Add / removes search input.
       * @default false
       */
      searchable: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    emits: [
      /**
       * Emitted when a value gets selected.
       */
      "select",
      /**
       * Emitted after removing an option.
       */
      "remove",
      /**
       * Emitted after the search query changes.
       */
      "search-change",
      /**
       * Emitted after user attempts to add a tag.
       */
      "tag",
      /**
       * Emitted when the dropdown opens. Useful for detecting when touched.
       */
      "open",
      /**
       * Emitted when the dropdown closes.
       */
      "close",
      /**
       * Emitted after this.modelValue changes.
       */
      "update:modelValue",
    ],
    data(): DpsFormSelectData {
      return {
        selected: undefined,
        multiselectEl: null,
      };
    },
    computed: {
      uniqueId() {
        return this.id ? this.id : getUniqueId("dps-form-select-");
      },
      multiselectOptions() {
        const options = [];

        for (const option of this.options) {
          if (typeof option !== "object") {
            const fixedOption: DpsFormSelectOption = {};

            fixedOption[this.optionValue] = option;
            fixedOption[this.optionLabel] = option;

            options.push(fixedOption);
          } else {
            options.push(option);
          }
        }

        return options;
      },
    },
    watch: {
      modelValue(newValue) {
        this.selected = newValue;
      },
      selected(newValue, oldValue) {
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          this.$emit("update:modelValue", newValue);
        }
      },
    },
    mounted() {
      const multiselect = this.$refs.multiselect as VueMultiselect;

      this.multiselectEl = multiselect?.$el;

      this.improveMultiselectAccessibility();
      this.improveElementAccessibility();
      this.improveContentAccessibility();
    },
    created() {
      // TODO check
      this.selected = this.modelValue;
    },
    methods: {
      improveMultiselectAccessibility() {
        this.multiselectEl?.setAttribute("aria-expanded", "false");
        this.multiselectEl?.setAttribute("aria-controls", "listbox-" + this.uniqueId);
      },
      improveContentAccessibility() {
        const content = this.multiselectEl?.querySelector(".multiselect__content");

        if (content) {
          content.ariaLabel = "Auswahlliste";
        }
      },
      improveElementAccessibility() {
        const options = this.multiselectEl?.querySelectorAll(".multiselect__option");

        if (options) {
          for (const option of Array.from(options)) {
            const parentEl = option.parentElement;

            if (parentEl?.classList.contains("multiselect__element")) {
              if (option.classList.contains("multiselect__option--selected")) {
                parentEl.ariaSelected = "true";
              } else {
                parentEl.ariaSelected = "false";
              }
            }
          }
        }

        const emptyItems = this.multiselectEl?.querySelectorAll(
          ".multiselect__content > li:not(.multiselect__element)",
        );

        if (emptyItems) {
          for (const emptyItem of Array.from(emptyItems)) {
            emptyItem.role = "option";
          }
        }

        const searchInput = this.multiselectEl?.querySelector(
          ".multiselect__input",
        ) as HTMLInputElement;

        if (searchInput) {
          searchInput.placeholder = "Suchbegriff ...";
        }
      },
      handleSelect(event: DpsFormSelectOption) {
        this.$emit("select", event);

        this.$nextTick(() => {
          this.improveElementAccessibility();
        });
      },
      handleRemove(event: DpsFormSelectOption) {
        this.$emit("remove", event);

        this.$nextTick(() => {
          this.improveElementAccessibility();
        });
      },
      handleOpen(event: string) {
        this.$emit("open", event);

        this.multiselectEl?.setAttribute("aria-expanded", "true");

        this.$nextTick(() => {
          this.setSearchInputWidth();
        });
      },
      handleClose(event: DpsFormSelectOption | null) {
        this.$emit("close", event);

        this.multiselectEl?.setAttribute("aria-expanded", "false");
      },
      handleTag(event: string) {
        this.$emit("tag", event);
      },
      handleSearchChange(event: string) {
        this.$emit("search-change", event);
      },
      setSearchInputWidth() {
        const paddingInline = 12;
        const searchInput = this.multiselectEl?.querySelector(
          ".multiselect__input",
        ) as HTMLInputElement;
        const contentWrapper = this.multiselectEl?.querySelector(
          ".multiselect__content",
        ) as HTMLUListElement;

        if (searchInput && contentWrapper) {
          const width = contentWrapper.offsetWidth;

          searchInput.style.setProperty("--width", width - paddingInline + "px");
        }
      },
    },
  });
</script>

<template>
  <Multiselect
    :id="uniqueId"
    ref="multiselect"
    v-model="selected"
    class="dps-form-select"
    :class="{
      'dps-form-select--readonly': readonly,
      'dps-form-select--multiple': multiple,
      'dps-form-select--searchable': searchable,
      'dps-form-select--labelled': label,
      'dps-form-select--filter': variant === 'filter',
      'dps-form-select--simple': variant === 'simple',
      'dps-form-select--size-sm': size === 'sm',
      'dps-form-select--success': success,
      'dps-form-select--error': error,
      'dps-form-select--align-end': align === 'end',
    }"
    :options="multiselectOptions"
    :allow-empty="!required"
    :clear-on-select="clearOnSelect"
    :close-on-select="closeOnSelect"
    :disabled="disabled || readonly"
    :label="optionLabel"
    :max="max"
    :multiple="multiple"
    :open-direction="openDirection"
    :placeholder="placeholder"
    :preselect-first="preselectFirst"
    :preserve-search="preserveSearch"
    :searchable="searchable"
    :track-by="optionValue"
    :title="title"
    @close="handleClose"
    @open="handleOpen"
    @remove="handleRemove"
    @search-change="handleSearchChange"
    @select="handleSelect"
    @tag="handleTag"
  >
    <template #option="props">
      <span v-if="multiple" class="multiselect__option-checkbox">
        <span class="dps-icon dps-icon--check"></span>
      </span>

      <span
        v-if="props.option.icon"
        class="multiselect__option-icon dps-icon"
        :class="'dps-icon--' + props.option.icon"
      >
      </span>

      <span class="multiselect__option-label">
        <!-- @slot option - For custom option slot content -->
        <slot name="option" v-bind="props">
          {{ props.option[optionLabel] }}
        </slot>
      </span>

      <span v-if="!multiple" class="multiselect__option-checkbox">
        <span class="dps-icon dps-icon--check"></span>
      </span>
    </template>

    <template #tag="props">
      <DpsFilterButton
        :disabled="disabled"
        :readonly="readonly"
        @click="props.remove(props.option)"
      >
        <!-- @slot tag - For custom tag slot content -->
        <slot name="tag" v-bind="props"> {{ props.option[optionLabel] }}</slot>
      </DpsFilterButton>
    </template>

    <template v-if="multiple" #selection="props">
      <template v-if="props.values.length === 0 || hideTags">
        <div v-if="label" class="multiselect__single multiselect__single--label">
          {{ label }}
        </div>

        <div v-else class="multiselect__placeholder multiselect__placeholder--label">
          <!-- @slot selection - For custom selection slot content -->
          <slot name="selection" v-bind="props"> {{ placeholder }} </slot>
        </div>
      </template>

      <div v-else class="multiselect__tags-wrap">
        <DpsFilterButton
          v-for="(option, index) in props.values"
          :key="'option-' + index"
          :disabled="disabled"
          :readonly="readonly"
          @click="props.remove(option)"
        >
          <slot name="selection" v-bind="props" :option="option"> {{ option[optionLabel] }} </slot>
        </DpsFilterButton>
      </div>
    </template>

    <template v-else #selection="props">
      <span v-if="variant === 'simple' && icon" :class="['dps-icon dps-icon--' + icon]"></span>
      <div v-if="label" class="multiselect__single multiselect__single--label">
        {{ label }}
      </div>

      <div
        v-if="modelValue && modelValue[optionLabel]"
        class="multiselect__placeholder multiselect__placeholder--label"
      >
        <slot name="selection" v-bind="props"> {{ modelValue[optionLabel] }} </slot>
      </div>

      <div v-else class="multiselect__placeholder multiselect__placeholder--label">
        <slot name="selection" v-bind="props"> {{ placeholder }} </slot>
      </div>
    </template>

    <template #noOptions>
      <span class="multiselect__option-results">
        <!-- @slot noOptions - For custom noOptions slot content -->
        <slot name="noOptions">Keine Elemente</slot>
      </span>
    </template>

    <template #noResult>
      <span class="multiselect__option-results">
        <!-- @slot noResult - For custom noResult slot content -->
        <slot name="noResult"> Es wurden keine Elemente gefunden. </slot>
      </span>
    </template>

    <template #maxElements>
      <span class="multiselect__option-results">
        <!-- @slot maxElements - For custom maxElements slot content -->
        <slot name="maxElements">
          Maximale Anzahl von Elementen erreicht. Bitte zuerst ein Element abwählen bevor Sie eine
          erneute Auswahl treffen.
        </slot>
      </span>
    </template>

    <template v-if="$slots['beforeList']" #beforeList>
      <!-- @slot beforeList - For custom beforeList slot content -->
      <slot name="beforeList" />
    </template>

    <template v-if="$slots['afterList']" #afterList>
      <!-- @slot afterList - For custom afterList slot content-->
      <slot name="afterList" />
    </template>
  </Multiselect>
</template>
