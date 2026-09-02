<script lang="ts">
  import { defineComponent } from "vue";
  import type { PropType } from "vue";

  export default defineComponent({
    name: "DpsButton",
    props: {
      /**
       * The HTML button type (ignored when used as a link).
       * When not set defaults to 'button'.
       * @default undefined
       */
      type: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * The URL that the hyperlink points to.
       * When set the component will be rendered as an anchor element.
       * @default undefined
       */
      href: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Disables the button.
       * @default false
       */
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Determines the styling of the component.
       * @default undefined
       */
      variant: {
        type: String as PropType<"secondary" | "link" | "link-darker">,
        required: false,
        default: undefined,
      },
      /**
       * Determines the size of the button.
       * @default undefined
       */
      size: {
        type: String as PropType<"sm" | "lg">,
        required: false,
        default: undefined,
      },
      /**
       * Squared edges.
       * @default false
       */
      squared: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Optional icon displayed inside the button.
       * @default undefined
       */
      icon: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Position of the icon.
       * @default 'start'
       */
      iconPosition: {
        type: String as PropType<"start" | "end">,
        required: false,
        default: "start",
      },
      /**
       * Removes the padding.
       * @default false
       */
      noPadding: {
        type: Boolean,
        required: false,
        default: false,
      },
      loading: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    emits: [
      /**
       * Emitted when the button gets clicked.
       * @event module:DpsButton#click
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
    class="dps-button"
    :class="{
      'dps-button--squared': squared,
      ['dps-button--size-' + size]: size,
      ['dps-button--' + variant]: variant,
      'dps-button--disabled': disabled,
      'dps-button--loading': loading,
      'dps-button--no-padding': noPadding,
    }"
    :type="typeAttribute"
    :href="href"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <template v-if="icon || loading">
      <span
        v-if="iconPosition === 'start'"
        class="dps-icon"
        :class="{
          'dps-icon--ladeanimation': loading,
          ['dps-icon--' + icon]: !loading,
        }"
        :role="loading ? 'status' : undefined"
        aria-hidden="true"
      ></span>
      <span v-if="$slots.default" class="dps-button__text"><slot /></span>
      <span
        v-if="iconPosition === 'end'"
        class="dps-icon"
        :class="{
          'dps-icon--ladeanimation': loading,
          ['dps-icon--' + icon]: !loading,
        }"
        :role="loading ? 'status' : undefined"
        aria-hidden="true"
      ></span>
    </template>
    <template v-else-if="variant === 'link' || variant === 'link-darker'">
      <span class="dps-button__text"><slot /></span>
    </template>
    <template v-else>
      <!-- @slot default - Label content -->
      <slot />
    </template>
  </component>
</template>
