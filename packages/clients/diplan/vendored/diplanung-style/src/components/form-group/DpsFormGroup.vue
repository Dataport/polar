<script lang="ts">
  import { getUniqueId } from "@/services/id.ts";
  import { defineComponent } from "vue";

  export default defineComponent({
    name: "DpsFormGroup",
    props: {
      /**
       * Unique ID for the component (optional).
       * @default undefined
       */
      id: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Description text shown under the content.
       * @default undefined
       */
      description: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Label for the group.
       * @default undefined
       */
      label: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * ID of the element the label is for.
       * @default undefined
       */
      labelFor: {
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
       * Text shown on success.
       * @default undefined
       */
      successFeedback: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Text shown on error.
       * @default undefined
       */
      errorFeedback: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Whether the input is valid or not.
       * `undefined` if the state is neutral.
       * @default undefined
       */
      valid: {
        type: Boolean,
        required: false,
        default: undefined,
      },
      /**
       * Whether the group is disabled.
       * @default false
       */
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    computed: {
      uniqueId() {
        return this.id ? this.id : getUniqueId("dps-form-group-");
      },
      hasError() {
        return this.valid === false;
      },
      hasSuccess() {
        return this.valid === true;
      },
      ariaDescribedby() {
        const arr = [];

        if (this.description) {
          arr.push(this.uniqueId + "__description");
        }

        if (this.successFeedback && this.hasSuccess) {
          arr.push(this.uniqueId + "__success-feedback");
        }

        if (this.errorFeedback && this.hasError) {
          arr.push(this.uniqueId + "__error-feedback");
        }

        if (arr.length) {
          return arr.join(" ");
        }

        return undefined;
      },
    },
  });
</script>

<template>
  <div
    :id="uniqueId"
    class="dps-form-group"
    :class="{
      'dps-form-group--disabled': disabled,
    }"
    role="group"
    :aria-invalid="hasError ? 'true' : undefined"
  >
    <label
      v-if="label"
      :id="uniqueId + '__label'"
      :for="labelFor"
      class="dps-form-group__label"
      :class="{ 'visually-hidden': hideLabel }"
    >
      {{ label }}
    </label>

    <div>
      <!-- @slot default - Body content -->
      <slot
        :slot-props="{
          success: hasSuccess,
          error: hasError,
          disabled,
          description,
          ariaDescribedby,
        }"
      />

      <div
        v-if="errorFeedback"
        v-show="hasError"
        :id="uniqueId + '__error-feedback'"
        tabindex="-1"
        aria-live="assertive"
        class="dps-form-group__feedback dps-form-group__feedback--error"
      >
        {{ errorFeedback }}
      </div>

      <div
        v-if="successFeedback"
        v-show="hasSuccess"
        :id="uniqueId + '__success-feedback'"
        tabindex="-1"
        aria-live="assertive"
        class="dps-form-group__feedback dps-form-group__feedback--success"
      >
        {{ successFeedback }}
      </div>

      <div
        v-if="description"
        :id="uniqueId + '__description'"
        tabindex="-1"
        class="dps-form-group__description"
      >
        {{ description }}
      </div>
    </div>
  </div>
</template>
