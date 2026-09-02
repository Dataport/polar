<script lang="ts">
  import DpsInputGroup from "@/components/input-group/DpsInputGroup.vue";
  import DpsButton from "@/components/button/DpsButton.vue";
  import { getUniqueId } from "@/services/id.ts";
  import DpsFormGroup from "@/components/form-group/DpsFormGroup.vue";
  import DpsFormFile from "@/components/form-file/DpsFormFile.vue";
  import { defineComponent } from "vue";
  import type { PropType } from "vue";

  export interface DpsUploadFormGroupData {
    hasError: boolean;
    filesSelected: File | File[] | null;
    uniqID: string;
    rerenderCounter: number;
  }

  export default defineComponent({
    name: "DpsUploadFormGroup",
    components: { DpsFormFile, DpsFormGroup, DpsButton, DpsInputGroup },
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
       * The label for the component.
       * @default ""
       */
      label: {
        type: String,
        required: false,
        default: "",
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
       * The label for the upload button.
       * @default "Hochladen"
       */
      uploadButtonLabel: {
        type: String,
        required: false,
        default: "Hochladen",
      },
      /**
       * The title for the upload button.
       * Defaults to the button label if no title is set.
       * @default undefined
       */
      uploadButtonTitle: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Which file formats to accept.
       * Can be either file extension or mime-type or mixed
       * e.g. ['.pdf'], ['application/pdf'] or ['.pdf', 'application/pdf']
       * @default []
       */
      fileAccept: {
        type: Array as PropType<string[]>,
        required: false,
        default() {
          return [];
        },
      },
      /**
       * Allows selecting multiple files at once.
       * @default false
       */
      fileMultiple: {
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
       * Defaults to the label if no title is set.
       * @default undefined
       */
      title: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Disables the upload button.
       * @default false
       */
      disableUploadButton: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Displays the component without the upload button.
       * @default false
       */
      hideUploadButton: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Changes the state to error and displays the provided error message.
       * @default ""
       */
      uploadErrorMessage: {
        type: String,
        required: false,
        default: "",
      },
      /**
       * Required attribute of the input.
       * @default false
       */
      fileRequired: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    emits: [
      /**
       * Emitted when the file selection changes.
       * @event module:DpsFormFile#input
       */
      "input",
      /**
       * Emitted when the upload button gets clicked.
       * @event module:DpsFormFile#upload
       */
      "upload",
    ],
    data(): DpsUploadFormGroupData {
      return {
        hasError: false,
        filesSelected: null,
        uniqID: this.id ?? getUniqueId("dps-upload-form-group-"),
        rerenderCounter: 0,
      };
    },
    computed: {
      fileSearchTitle() {
        return this.title ?? this.label;
      },
      acceptedFilesAsString() {
        if (!Array.isArray(this.fileAccept)) {
          return undefined;
        }
        return this.fileAccept.join(", ");
      },
      acceptedFilesDescription() {
        return this.acceptedFilesAsString
          ? `${this.fileAccept?.length > 1 ? "Erlaubte Dateiformate" : "Erlaubtes Dateiformat"}: ${
              this.acceptedFilesAsString
            }`
          : undefined;
      },
      acceptedFilesErrorMessage() {
        return this.acceptedFilesAsString
          ? `Die ${this.fileMultiple ? "gewählten Dateien entsprechen" : "gewählte Datei entspricht"} nicht ${
              this.fileAccept?.length > 1
                ? "den erlaubten Dateiformaten"
                : "dem erlaubten Dateiformat"
            }`
          : "";
      },
      errorMessage() {
        return this.uploadErrorMessage ? this.uploadErrorMessage : this.acceptedFilesErrorMessage;
      },
      isUploadButtonDisabled() {
        return (
          !(Array.isArray(this.filesSelected) ? this.filesSelected?.length : this.filesSelected) ||
          this.disabled ||
          this.disableUploadButton
        );
      },
    },
    watch: {
      uploadErrorMessage(value) {
        if (value) {
          this.hasError = true;
        }
      },
    },
    mounted() {
      this.hasError = !!this.uploadErrorMessage;
    },
    methods: {
      validateFileType(fileObj: File) {
        const fileExtension = "." + fileObj.name.split(".").pop();

        // Check if the file object type matches accepted mime types (e.g. "application/pdf")
        // Or if it matches accepted file format extensions (e.g. ".pdf")
        return this.fileAccept.includes(fileObj.type) || this.fileAccept.includes(fileExtension);
      },
      handleSelectionChange(selectedFiles: File | File[] | null) {
        if (!selectedFiles) {
          this.filesSelected = null;
          this.$emit("input", this.filesSelected);
          return false;
        }
        this.filesSelected = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles];

        if (this.acceptedFilesAsString) {
          const isValid = Array.from(this.filesSelected).reduce(
            (acc, file) => acc && file && this.validateFileType(file),
            true,
          );

          if (!isValid) {
            this.resetSelection(true);
            return false;
          }
        }
        this.hasError = false;
        this.$emit("input", this.filesSelected);
      },
      // May be called as an API method from outside - do not remove!
      resetSelection(onError = false) {
        this.filesSelected = this.fileMultiple ? [] : null;
        this.rerenderCounter++;
        this.$emit("input", this.filesSelected);
        this.hasError = onError;
      },
    },
    expose: ["resetSelection"],
  });
</script>

<template>
  <DpsFormGroup
    :id="uniqID + '-form-group'"
    class="dps-upload-form-group"
    :class="{ 'dps-upload-form-group--disabled': disabled }"
    :label="label"
    :hide-label="hideLabel"
    :description="acceptedFilesDescription"
    :error-feedback="errorMessage"
    :valid="!hasError"
    :disabled="disabled"
  >
    <DpsInputGroup
      :id="uniqID + '-input-group'"
      collapsed
      class="dps-upload-form-group__input-group"
    >
      <template #default>
        <DpsFormFile
          :id="uniqID"
          :key="'file-input-' + rerenderCounter"
          ref="fileInput"
          :model-value="filesSelected"
          :accept="acceptedFilesAsString"
          :multiple="fileMultiple"
          :disabled="disabled"
          :error="hasError"
          :title="fileSearchTitle"
          :required="fileRequired"
          @update:model-value="handleSelectionChange"
        />
      </template>
      <template #append>
        <DpsButton
          v-if="!hideUploadButton"
          :title="uploadButtonTitle ?? uploadButtonLabel"
          class="dps-upload-form-group__upload-button"
          :class="{
            'dps-upload-form-group__upload-button--error': hasError,
            'dps-upload-form-group__upload-button--all-disabled': disabled,
          }"
          squared
          size="lg"
          :disabled="isUploadButtonDisabled"
          @click="$emit('upload', uniqID)"
        >
          {{ uploadButtonLabel }}
        </DpsButton>
      </template>
    </DpsInputGroup>
  </DpsFormGroup>
</template>
