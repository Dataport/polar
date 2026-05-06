<script lang="ts">
  import { defineComponent } from "vue";
  import type { PropType } from "vue";

  export default defineComponent({
    name: "DpsLink",
    props: {
      /**
       * The URL that the hyperlink points to.
       */
      href: {
        type: String,
        required: true,
      },
      /**
       * Icon to be displayed in front of the link text.
       * Can be set to 'false' when using external links to
       * hide the icon.
       * @default undefined
       */
      icon: {
        type: [String, Boolean],
        required: false,
        default: undefined,
      },
      /**
       * The relationship of the linked URL as space-separated
       * link types. "noopener noreferrer" gets set automatically
       * when "external" is true.
       * @default undefined
       */
      rel: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Where to display the linked URL,
       * as the name for a browsing context.
       * Gets set to "_blank" automatically when "external" is true.
       * @default undefined
       */
      target: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Whether the link is an external link.
       * @default false
       */
      external: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * How to format the link (telephone or email formatting).
       * @default undefined
       */
      format: {
        type: String as PropType<"telephone" | "email">,
        required: false,
        default: undefined,
      },
      /**
       * Whether the link should be a slightly darker blue.
       * @default false
       */
      darker: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    emits: [
      /**
       * Emitted when the link is clicked.
       */
      "click",
    ],
    computed: {
      hrefAttribute() {
        if (this.format === "telephone") {
          const href = this.href
            .replaceAll(" ", "")
            .replaceAll("-", "")
            .replaceAll("/", "")
            .replaceAll("(", "")
            .replaceAll(")", "");

          return "tel:" + href;
        } else if (this.format === "email") {
          return "mailto:" + this.href.replaceAll(" ", "");
        }

        return this.href;
      },
      relAttribute() {
        if (this.rel) {
          return this.rel;
        }

        if (this.external) {
          return "noopener noreferrer";
        }

        return undefined;
      },
      targetAttribute() {
        if (this.target) {
          return this.target;
        }

        if (this.external) {
          return "_blank";
        }

        return undefined;
      },
      iconName() {
        if (this.icon !== false) {
          if (this.icon && typeof this.icon === "string") {
            return this.icon;
          }

          if (this.external) {
            return "external-link";
          }
        }

        return undefined;
      },
    },
    methods: {
      handleClick(event: Event) {
        if (!this.external && !this.format) {
          event.preventDefault();

          if (this.$router) {
            this.$router.push(this.hrefAttribute);
          }
        }

        this.$emit("click", event);
      },
    },
  });
</script>

<template>
  <a
    class="dps-link"
    :class="{
      'dps-link--icon': iconName,
      'dps-link--darker': darker,
    }"
    :href="hrefAttribute"
    :rel="relAttribute"
    :target="targetAttribute"
    @click="handleClick"
  >
    <template v-if="iconName">
      <span class="dps-icon" :class="'dps-icon--' + iconName"></span>
      <span>
        <!-- @slot default - Label content -->
        <slot />
      </span>
    </template>
    <template v-else>
      <!-- @slot default - Label content -->
      <slot />
    </template>
  </a>
</template>
