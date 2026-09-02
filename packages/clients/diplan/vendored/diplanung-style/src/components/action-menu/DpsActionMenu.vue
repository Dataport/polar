<script lang="ts">
  import { getUniqueId } from "@/services/id.ts";
  import DpsIconButton from "@/components/icon-button/DpsIconButton.vue";
  import { defineComponent } from "vue";

  export default defineComponent({
    name: "DpsActionMenu",
    components: { DpsIconButton },
    props: {
      /**
       * The unique identifier for the menu.
       * @default undefined
       */
      id: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * The HTML tag to be used for the menu container.
       * @default "ul"
       */
      tag: {
        type: String,
        default: "ul",
        required: false,
      },
      /**
       * The icon to be used for the trigger button.
       * @default "more-horiz"
       */
      icon: {
        type: String,
        default: "more-horiz",
        required: false,
      },
      /**
       * The label for the trigger button.
       * @default ""
       */
      label: {
        type: String,
        default: "",
        required: false,
      },
      /**
       * The title attribute for the trigger button.
       * @default "Aktions-Menu öffnen"
       */
      title: {
        type: String,
        default: "Aktions-Menu öffnen",
        required: false,
      },
      /**
       * Whether to show a close button in the menu.
       * @default false
       */
      showCloseButton: {
        type: Boolean,
        default: false,
        required: false,
      },
      /**
       * Whether to show a chevron icon in the trigger button.
       * @default false
       */
      showTriggerChevron: {
        type: Boolean,
        default: false,
        required: false,
      },
      /**
       * The headline text for the menu.
       * @default undefined
       */
      headline: {
        type: String,
        default: undefined,
        required: false,
      },
      /**
       * Whether the menu should automatically close after an action is selected.
       * @default true
       */
      autoClose: {
        type: Boolean,
        default: true,
        required: false,
      },
      /**
       * Whether the menu is disabled.
       * @default false
       */
      disabled: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
    emits: [
      /**
       * Emitted when the menu is hidden.
       * @event module:DpsActionMenu#hide
       */
      "hide",
      /**
       * Emitted when the menu is shown.
       * @event module:DpsActionMenu#show
       */
      "show",
    ],
    computed: {
      uniqueId() {
        return this.id ? this.id : getUniqueId("dps-action-menu-");
      },
      dropdownElement() {
        return document.getElementById(this.uniqueId);
      },
      dropdownBootstrapElement() {
        if (this.dropdownElement) {
          // eslint-disable-next-line
          return new (window as any).Bootstrap.Dropdown(this.dropdownElement);
        }

        return undefined;
      },
      isHeaderVisible() {
        return this.showCloseButton || this.headline;
      },
    },
    mounted() {
      if (this.dropdownElement) {
        this.dropdownElement.addEventListener("hide.bs.dropdown", (event: Event) => {
          this.$emit("hide", event);
        });
        this.dropdownElement.addEventListener("show.bs.dropdown", (event: Event) => {
          this.$emit("show", event);
        });
      }
    },
  });
</script>

<template>
  <div class="dps-action-menu">
    <!-- @slot trigger - Trigger element -->
    <slot name="trigger">
      <button
        :id="uniqueId"
        type="button"
        class="dps-action-menu__trigger-button"
        :class="{
          'dps-action-menu__trigger-button--icon': !label,
          'dps-action-menu__trigger-button--text': label,
          'dps-action-menu__trigger-button--disabled': disabled,
        }"
        :title="title"
        :disabled="disabled"
        aria-label="Toggle dropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        data-bs-offset="0,10"
        :data-bs-auto-close="autoClose ? 'true' : 'outside'"
      >
        <template v-if="label">
          <span class="dps-action-menu__trigger-button-label">{{ label }}</span>
          <span v-if="showTriggerChevron" class="dps-icon dps-icon--chevron-down"></span>
        </template>
        <span v-else class="dps-icon" :class="'dps-icon--' + icon"></span>
      </button>
    </slot>

    <div
      class="dps-action-menu__dropdown dropdown-menu"
      :class="{ 'dps-action-menu__dropdown--with-header': isHeaderVisible }"
      :aria-labelledby="uniqueId"
    >
      <header v-if="isHeaderVisible" class="dps-action-menu__dropdown-header">
        <div v-if="headline" class="dps-action-menu__dropdown-headline">{{ headline }}</div>

        <DpsIconButton
          v-if="showCloseButton"
          class="dps-action-menu__dropdown-close-button"
          title="Schließen"
          aria-label="Schließen"
          icon="close"
          @click="dropdownBootstrapElement?.hide()"
        />
      </header>

      <component :is="tag" class="dps-action-menu__dropdown-list">
        <!-- @slot default - Dropdown content -->
        <slot />
      </component>
    </div>
  </div>
</template>
