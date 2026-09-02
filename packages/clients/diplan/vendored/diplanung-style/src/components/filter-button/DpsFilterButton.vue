<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    name: "DpsFilterButton",
    props: {
      /**
       * Disables the button.
       * @default false
       */
      disabled: {
        type: Boolean,
        default: false,
        required: false,
      },
      /**
       * Makes the button readonly.
       * @default false
       */
      readonly: {
        type: Boolean,
        default: false,
        required: false,
      },
      /**
       * Title attribute of the button.
       * @default undefined
       */
      title: {
        type: String,
        default: undefined,
        required: false,
      },
    },
    emits: [
      /**
       * Emitted when the button is clicked.
       * @event module:DpsFilterButton#click
       */
      "click",
    ],
    computed: {
      titleAttribute() {
        if (this.title) {
          return this.title;
        }

        return "Filter entfernen";
      },
    },
    methods: {
      handleClick(event: Event) {
        if (!this.disabled) {
          this.$emit("click", event);
        }
      },
    },
  });
</script>

<template>
  <button
    class="dps-filter-button"
    :class="{
      'dps-filter-button--disabled': disabled,
      'dps-filter-button--readonly': readonly,
    }"
    type="button"
    :title="titleAttribute"
    :disabled="disabled || readonly"
    @click="handleClick"
  >
    <span>
      <!-- @slot default - Label content -->
      <slot />
    </span>
    <span class="dps-icon dps-icon--close"></span>
  </button>
</template>
