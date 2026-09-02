<script lang="ts">
  import DpsIconButton from "@/components/icon-button/DpsIconButton.vue";
  import DpsBadge from "@/components/badge/DpsBadge.vue";
  import { getUniqueId } from "@/services/id.js";
  import { defineComponent } from "vue";

  export interface DpsListGroupItemData {
    isExpanded: boolean;
  }

  export default defineComponent({
    name: "DpsListGroupItem",
    components: { DpsBadge, DpsIconButton },
    props: {
      /**
       * The unique identifier for the collapsible element. This identifier is used to associate the
       * collapsible content with its corresponding trigger for accessibility and Bootstrap's collapse functionality.
       *
       * @default undefined
       */
      collapseId: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Specifies the HTML tag to use for the root element.
       * @default "div"
       */
      tag: {
        type: String,
        required: false,
        default: "div",
      },
      /**
       * The URL that the hyperlink points to.
       * @default undefined
       */
      href: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Indicates whether the collapsible row content is initially expanded.
       * When set to true, the collapsible content will be visible by default.
       *
       * @default false
       */
      expanded: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    emits: [
      /**
       * This event is fired immediately when the show method has been called.
       */
      "show",
      /**
       * This event is fired immediately when the hide method has been called.
       */
      "hide",
    ],
    data(): DpsListGroupItemData {
      return {
        isExpanded: false,
      };
    },
    computed: {
      uniqueId() {
        return this.collapseId ? this.collapseId : getUniqueId("dps-list-group-item-");
      },
      computedTag() {
        return this.href ? "a" : this.tag;
      },
      isCollapsible() {
        return !!this.$slots["collapsible-content"];
      },
    },
    watch: {
      expanded(value) {
        this.isExpanded = value;
      },
    },
    mounted() {
      const collapsibleEl = this.$refs.collapsible as HTMLDivElement;

      this.isExpanded = this.expanded;

      if (!collapsibleEl) return;

      collapsibleEl.addEventListener("hide.bs.collapse", () => {
        this.isExpanded = false;

        this.$emit("hide");
      });

      collapsibleEl.addEventListener("show.bs.collapse", () => {
        this.isExpanded = true;

        this.$emit("show");
      });
    },
    methods: {
      handleEnter() {
        if (this.isCollapsible) {
          const trigger = this.$refs.trigger as HTMLElement;

          trigger.click();
        }
      },
    },
  });
</script>

<template>
  <component
    :is="computedTag"
    class="dps-list-group-item"
    :class="{
      'dps-list-group-item--collapsible': isCollapsible,
      'dps-list-group-item--expanded': isCollapsible && isExpanded,
    }"
    :href="href"
  >
    <template v-if="isCollapsible">
      <div
        ref="trigger"
        class="dps-list-group-item__trigger"
        data-bs-toggle="collapse"
        :data-bs-target="'#' + uniqueId"
        :aria-controls="uniqueId"
        :aria-expanded="expanded"
        tabindex="0"
        role="button"
        @keydown.enter="handleEnter"
      >
        <!-- @slot default - Item content -->
        <slot />
      </div>

      <div class="dps-list-group-item__collapse">
        <div :id="uniqueId" ref="collapsible" class="collapse" :class="{ show: expanded }">
          <div class="dps-list-group-item__collapsible-content">
            <!-- @slot collapsible-content - Item collapsible content -->
            <slot name="collapsible-content" />
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <!-- @slot default - Item content -->
      <slot />
    </template>
  </component>
</template>
