<script lang="ts">
  import type { PropType } from "vue";
  import { defineComponent } from "vue";
  import { getUniqueId } from "@/services/id.ts";

  export interface DpsCollapsibleData {
    isExpanded: boolean;
  }

  export default defineComponent({
    name: "DpsCollapsible",
    props: {
      /**
       * The unique identifier for the menu (optional).
       * @default undefined
       */
      id: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Collapsible expanded.
       * @default false
       */
      expanded: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Whether the collapsible can not be interacted with.
       * @default false
       */
      locked: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Size of the collapsible.
       * @default undefined
       */
      size: {
        type: String as PropType<"lg">,
        required: false,
        default: undefined,
      },
      /**
       * Styling of the collapsible.
       * @default undefined
       */
      variant: {
        type: String as PropType<"secondary" | "tertiary">,
        required: false,
        default: undefined,
      },
      /**
       * Headline text when collapsible is expanded.
       * @default undefined
       */
      toggleTextExpanded: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Headline text when collapsible is not expanded.
       * @default undefined
       */
      toggleText: {
        type: String,
        required: false,
        default: undefined,
      },
    },
    emits: [
      /**
       * Emitted immediately when collapsible content gets hidden.
       * @event module:DpsCollapsible#hide-collapsible
       */
      "hide-collapsible",
      /**
       * Emitted when collapsible content has been hidden (after CSS transitions).
       * @event module:DpsCollapsible#hidden-collapsible
       */
      "hidden-collapsible",
      /**
       * Emitted immediately when collapsible content gets shown.
       * @event module:DpsCollapsible#show-collapsible
       */
      "show-collapsible",
      /**
       * Emitted when collapsible content has been made visible (after CSS transitions).
       * @event module:DpsCollapsible#shown-collapsible
       */
      "shown-collapsible",
    ],
    data(): DpsCollapsibleData {
      return {
        isExpanded: false,
      };
    },
    computed: {
      uniqueId() {
        return this.id ? this.id : getUniqueId("dps-collapsible-");
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

      collapsibleEl.addEventListener("hide.bs.collapse", (ev) => {
        if (ev.target !== ev.currentTarget) return;

        ev.stopPropagation();
        this.isExpanded = false;
        this.$emit("hide-collapsible", ev);
      });

      collapsibleEl.addEventListener("hidden.bs.collapse", (ev) => {
        if (ev.target !== ev.currentTarget) return;

        ev.stopPropagation();
        this.$emit("hidden-collapsible", ev);
      });

      collapsibleEl.addEventListener("show.bs.collapse", (ev) => {
        if (ev.target !== ev.currentTarget) return;

        ev.stopPropagation();
        this.isExpanded = true;
        this.$emit("show-collapsible", ev);
      });

      collapsibleEl.addEventListener("shown.bs.collapse", (ev) => {
        if (ev.target !== ev.currentTarget) return;

        ev.stopPropagation();
        this.$emit("shown-collapsible", ev);
      });
    },
  });
</script>

<template>
  <div
    class="dps-collapsible"
    :class="{
      'dps-collapsible--expanded': isExpanded,
      ['dps-collapsible--' + variant]: variant,
      ['dps-collapsible--size-' + size]: size,
    }"
  >
    <div class="dps-collapsible__header">
      <template v-if="locked">
        <!-- @slot header - Header content -->
        <slot name="header">
          {{ (isExpanded && toggleTextExpanded) || toggleText }}
        </slot>
      </template>
      <button
        v-else
        class="dps-collapsible__trigger-button"
        type="button"
        data-bs-toggle="collapse"
        :data-bs-target="'#' + uniqueId"
        :aria-expanded="expanded"
        :aria-controls="uniqueId"
      >
        <span
          class="dps-icon"
          :class="{
            'dps-icon--chevron-down': size === 'lg' && variant !== 'tertiary',
            'dps-icon--chevron-down-small': size !== 'lg' && variant !== 'tertiary',
            'dps-icon--plus': variant === 'tertiary' && !isExpanded,
            'dps-icon--minus': variant === 'tertiary' && isExpanded,
          }"
        ></span>
        <!-- @slot header - Header content -->
        <slot name="header">
          {{ (isExpanded && toggleTextExpanded) || toggleText }}
        </slot>
      </button>
    </div>

    <div
      :id="!locked ? uniqueId : undefined"
      ref="collapsible"
      class="dps-collapsible__collapsible collapse"
      :class="{ show: expanded }"
    >
      <div class="dps-collapsible__body">
        <!-- @slot default - Body content -->
        <slot />
      </div>
    </div>
  </div>
</template>
