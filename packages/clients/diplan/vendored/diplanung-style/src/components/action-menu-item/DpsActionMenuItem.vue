<script lang="ts">
  import { defineComponent } from "vue";
  import type { PropType } from "vue";

  export default defineComponent({
    name: "DpsActionMenuItem",
    props: {
      /**
       * The icon displayed before the menu item
       * @default undefined
       */
      icon: {
        type: String,
        default: undefined,
        required: false,
      },
      /**
       * The title attribute of the menu item
       * @default undefined
       */
      title: {
        type: String,
        default: undefined,
        required: false,
      },
      /**
       * Disables the menu item.
       * @default false
       */
      disabled: {
        type: Boolean,
        default: false,
        required: false,
      },
      /**
       * The link target attribute.(e.g.: _blank)
       * @default undefined
       */
      target: {
        type: String as PropType<"_blank" | "_self" | "_parent" | "_top" | string>,
        default: undefined,
        required: false,
      },
      /**
       * The URL that the hyperlink points to.
       * @default undefined
       */
      href: {
        type: String,
        default: undefined,
        required: false,
      },
      /**
       * The relationship of the linked URL as space-separated link types.
       * @default undefined
       */
      rel: {
        type: String,
        default: undefined,
        required: false,
      },
      /**
       * Applies the 'danger' styles (red on hover).
       * @default false
       */
      danger: {
        type: Boolean,
        default: false,
        required: false,
      },
      /**
       * HTML tag of the wrapper element.
       * @default 'li'
       */
      tag: {
        type: String,
        default: "li",
      },
    },
    emits: [
      /**
       * Emitted when the element is clicked.
       * @event module:DPSActionMenuItem#click
       */
      "click",
    ],
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
  <component :is="tag" class="dps-action-menu-item">
    <component
      :is="href ? 'a' : 'button'"
      :type="href ? undefined : 'button'"
      :href="href"
      :rel="rel"
      :target="target"
      :title="title"
      class="dps-action-menu-item__element"
      :class="{
        'dps-action-menu-item__element--danger': danger,
        'dps-action-menu-item__element--disabled': disabled,
      }"
      :disabled="disabled"
      @click="handleClick"
    >
      <span
        v-if="icon"
        class="dps-action-menu-item__icon dps-icon"
        :class="'dps-icon--' + icon"
      ></span>
      <span class="dps-action-menu-item__text"><slot /></span>
    </component>
  </component>
</template>
