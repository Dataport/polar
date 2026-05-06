<script lang="ts">
  import { defineComponent } from "vue";
  import type { PropType } from "vue";

  export default defineComponent({
    name: "DpsBadge",
    props: {
      /**
       * Determines the styling of the badge.
       * @default undefined
       */
      variant: {
        type: String as PropType<"info" | "success" | "warning" | "error" | "outline" | "primary">,
        required: false,
        default: undefined,
      },
      /**
       * Rounds the badge.
       * @default false
       */
      rounded: {
        type: Boolean,
        default: false,
      },
    },
  });
</script>

<template>
  <span
    class="dps-badge"
    :class="{
      ['dps-badge--' + variant]: variant,
      'dps-badge--rounded': rounded,
    }"
  >
    <!-- @slot default - Label content -->
    <slot />
  </span>
</template>
