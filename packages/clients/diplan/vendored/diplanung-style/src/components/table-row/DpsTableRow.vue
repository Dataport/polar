<script lang="ts">
  import { getUniqueId } from "@/services/id.ts";
  import { defineComponent } from "vue";

  export interface DpsTableRowData {
    isExpanded: boolean;
  }

  export default defineComponent({
    name: "DpsTableRow",
    props: {
      /**
       * The unique identifier for the collapsible element. This identifier is used to associate the
       * collapsible content with its corresponding trigger for accessibility and Bootstrap's collapse functionality.
       * @default undefined
       */
      collapseId: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * The number of columns the collapsible content should span when expanded.
       * This controls the width of the collapsible content.
       *
       * @default undefined
       */
      collapseColspan: {
        type: Number,
        required: false,
        default: undefined,
      },
      /**
       * The starting position (column index) where the collapsible content should be displayed.
       * This can be used to create an offset within the row.
       *
       * @default 0
       */
      collapseColstart: {
        type: Number,
        required: false,
        default: 0,
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
    data(): DpsTableRowData {
      return {
        isExpanded: false,
      };
    },
    computed: {
      uniqueId() {
        return this.collapseId ? this.collapseId : getUniqueId("dps-table-row-");
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
          const mainElement = this.$refs.mainElement as HTMLElement;

          mainElement.click();
        }
      },
    },
  });
</script>

<template>
  <tr
    ref="mainElement"
    class="dps-table-row"
    :class="{
      'dps-table-row--collapsible': isCollapsible,
      'dps-table-row--expanded': isCollapsible && isExpanded,
    }"
    :data-bs-toggle="isCollapsible ? 'collapse' : undefined"
    :data-bs-target="isCollapsible ? '#' + uniqueId : undefined"
    :aria-expanded="isCollapsible ? expanded : undefined"
    :aria-controls="isCollapsible ? uniqueId : undefined"
    :tabindex="isCollapsible ? '0' : undefined"
    :role="isCollapsible ? 'button' : undefined"
    @keydown.enter="handleEnter"
  >
    <!-- @slot default - Row content -->
    <slot />
  </tr>
  <tr v-if="isCollapsible" class="dps-table-row dps-table-row--collapse">
    <td v-if="collapseColstart > 0" :colspan="collapseColstart"></td>
    <td :colspan="collapseColspan">
      <div :id="uniqueId" ref="collapsible" class="collapse" :class="{ show: expanded }">
        <div class="dps-table-row__collapsible-content">
          <!-- @slot collapsible-content - Row collapsible content -->
          <slot name="collapsible-content" />
        </div>
      </div>
    </td>
  </tr>
</template>
