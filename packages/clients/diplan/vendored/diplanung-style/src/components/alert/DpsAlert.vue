<script lang="ts">
  import sanitizeHtml from "sanitize-html";
  import { defineComponent } from "vue";
  import type { PropType } from "vue";

  export default defineComponent({
    name: "DpsAlert",
    props: {
      /**
       * The variant determines the color and icon of the alert.
       * @default undefined
       */
      variant: {
        type: String as PropType<"warning" | "error" | "info" | "success">,
        default: undefined,
        required: false,
      },
      /**
       * Headline of the alert.
       * @default undefined
       */
      heading: {
        type: String,
        default: undefined,
        required: false,
      },
      /**
       * Hides the icon.
       * @default false
       */
      hideIcon: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
    computed: {
      variantIcon() {
        const icons = {
          info: "information",
          warning: "warning",
          success: "success",
          error: "warning",
        };

        return icons[this.variant ?? "info"];
      },
    },
    methods: {
      sanitizeHtml: sanitizeHtml,
    },
  });
</script>

<template>
  <div class="dps-alert" :class="{ ['dps-alert--' + variant]: variant }">
    <div v-if="!hideIcon" class="dps-alert__icon-wrapper">
      <span class="dps-icon" :class="'dps-icon--' + variantIcon" />
    </div>

    <div class="dps-alert__content-wrapper">
      <!-- eslint-disable vue/no-v-html -->
      <header
        v-if="heading"
        class="dps-alert__content-header"
        v-html="sanitizeHtml(heading)"
      ></header>
      <!-- eslint-enable vue/no-v-html -->

      <!-- @slot default - Body content -->
      <slot />
    </div>
  </div>
</template>
