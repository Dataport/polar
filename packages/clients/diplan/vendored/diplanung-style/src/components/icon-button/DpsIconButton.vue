<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    name: "DpsIconButton",
    props: {
      /**
       * Icon to be displayed in the button.
       */
      icon: {
        type: String,
        required: true,
      },
      /**
       * Applies the 'danger' styles to the button.
       * @default false
       */
      danger: {
        type: Boolean,
        default: false,
        required: false,
      },
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
       * Show a loading spinner.
       * @default undefined
       */
      loading: {
        type: Boolean,
        default: undefined,
        required: false,
      },
      /**
       * The HTML button type attribute. If undefined
       * the type defaults to 'button'.
       * @default undefined
       */
      type: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * The URL that the hyperlink points to.
       * If href is set an anchor
       * element is rendered instead of a button.
       * @default undefined
       */
      href: {
        type: String,
        required: false,
        default: undefined,
      },
    },
    emits: [
      /**
       * Emitted when the button gets clicked.
       */
      "click",
    ],
    computed: {
      typeAttribute() {
        if (this.href) {
          return undefined;
        }

        if (this.type) {
          return this.type;
        }

        return "button";
      },
    },
    methods: {
      handleClick(event: Event) {
        if (this.disabled || this.loading) {
          event.preventDefault();
        } else {
          this.$emit("click", event);
        }
      },
    },
  });
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    class="dps-icon-button"
    :class="{
      'dps-icon-button--danger': danger,
      'dps-icon-button--disabled': disabled,
      'dps-icon-button--loading': loading,
    }"
    :type="typeAttribute"
    :href="href"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span
      class="dps-icon"
      :class="{
        'dps-icon--ladeanimation': loading,
        ['dps-icon--' + icon]: !loading,
      }"
      :role="loading ? 'status' : undefined"
      aria-hidden="true"
    ></span>
  </component>
</template>
