<script lang="ts">
  import { getUniqueId } from "@/services/id.ts";
  import { defineComponent } from "vue";
  import type { PropType } from "vue";

  export interface DpsFormFileData {
    uniqID: string;
  }

  export default defineComponent({
    name: "DpsFormFile",
    props: {
      /**
       * The unique identifier for the input (optional).
       * @default undefined
       */
      id: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * ModelValue of the input.
       * With inputs of type file, normally this is uni-directional.
       * However, you can clear the file input's selected files by setting the modelValue to either null
       * (for single mode) or an empty array [] (for multiple mode).
       * @default null
       */
      modelValue: {
        type: [File, Array, null] as PropType<File | File[] | null>,
        required: false,
        default: null,
      },
      /**
       * Which file formats to accept.
       * Can be either file extension or mime-type or mixed
       * e.g. '.pdf', 'application/pdf' or '.pdf, application/pdf'
       * @default ""
       */
      accept: {
        type: String,
        required: false,
        default: "",
      },
      /**
       * Allows selecting multiple files at once.
       * @default false
       */
      multiple: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Disables the component.
       * @default false
       */
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Title for the search button.
       * Defaults to "Datei auswählen" if no title is set.
       * @default undefined
       */
      title: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Changes the state to error.
       * @default false
       */
      error: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Required attribute of the input.
       * @default false
       */
      required: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    emits: [
      /**
       * Emitted when the file selection changes.
       * @event module:DpsFormFile#update:modelValue
       */
      "update:modelValue",
    ],
    data(): DpsFormFileData {
      return {
        uniqID: this.id ?? getUniqueId("dps-form-file-"),
      };
    },
    computed: {
      fileSearchTitle() {
        return this.title ?? `Datei${this.multiple ? "en" : ""} auswählen`;
      },
    },
    watch: {
      modelValue: {
        handler(value) {
          if (!value || (this.multiple && !value.length)) {
            (this.$refs.fileInput as HTMLInputElement).value = "";
          }
        },
      },
    },
    methods: {
      getUniqueId,
      handleSelectionChange() {
        const files = (this.$refs.fileInput as HTMLInputElement).files as FileList;

        files.length === 0
          ? this.$emit("update:modelValue", this.multiple ? [] : null)
          : this.$emit("update:modelValue", this.multiple ? Array.from(files) : files[0]);
      },
      resetSelection() {
        (this.$refs.fileInput as HTMLInputElement).value = "";
        this.$emit("update:modelValue", this.multiple ? [] : null);
      },
    },
  });
</script>

<template>
  <div
    class="dps-form-file"
    :class="{
      'dps-form-file--selected':
        multiple && Array.isArray(modelValue) ? modelValue.length : modelValue,
      'dps-form-file--disabled': disabled,
      'dps-form-file--error': error,
    }"
  >
    <label :for="uniqID" :title="fileSearchTitle">
      <span class="dps-icon dps-icon--search" aria-hidden="true" />
      <span class="sr-only">{{ fileSearchTitle }}</span>
    </label>
    <input
      :id="uniqID"
      ref="fileInput"
      type="file"
      class="dps-form-file__input"
      :accept="accept"
      :required="required"
      :multiple="multiple ? true : undefined"
      :disabled="disabled"
      @change="handleSelectionChange"
      @cancel="resetSelection"
      @click="(event: MouseEvent) => ((event.target as HTMLInputElement).value = '')"
    />
  </div>
</template>
