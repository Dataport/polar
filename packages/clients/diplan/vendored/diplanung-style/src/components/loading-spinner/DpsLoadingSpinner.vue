<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    name: "DpsLoadingSpinner",
    props: {
      /**
       * Aria label for the spinner.
       * @default undefined
       */
      ariaLabel: {
        type: String,
        required: false,
        default: "Laden",
      },
    },
  });
</script>

<template>
  <div
    class="dps-loading-spinner align-content-center d-flex gap-2"
    aria-busy="true"
    :aria-label="ariaLabel"
  >
    <!-- @slot default - Loading spinner content -->
    <slot />
    <span class="dps-icon dps-icon--ladeanimation"></span>
  </div>
</template>
