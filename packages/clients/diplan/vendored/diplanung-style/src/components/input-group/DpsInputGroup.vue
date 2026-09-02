<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    name: "DpsInputGroup",
    props: {
      /**
       * Whether there should be no gap between the
       * elements.
       */
      collapsed: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
  });
</script>

<template>
  <div role="group" class="dps-input-group" :class="{ 'dps-input-group--collapsed': collapsed }">
    <div v-if="$slots.prepend" class="dps-input-group__content dps-input-group__content--prepend">
      <!-- @slot prepend - Left content slot -->
      <slot name="prepend" />
    </div>
    <div class="dps-input-group__content dps-input-group__content--default">
      <!-- @slot default - Middle content slot -->
      <slot />
    </div>
    <div v-if="$slots.append" class="dps-input-group__content dps-input-group__content--append">
      <!-- @slot append - Right content slot -->
      <slot name="append" />
    </div>
  </div>
</template>
