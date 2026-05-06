import DpsAlphabeticFilter from "@/components/alphabetic-filter/DpsAlphabeticFilter.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/AlphabeticFilter",
  component: DpsAlphabeticFilter,
  render: (args) => ({
    components: { DpsAlphabeticFilter },
    setup() {
      return { args };
    },
    data() {
      return {
        selected: undefined,
      };
    },
    template: `
      <DpsAlphabeticFilter v-bind="args" v-model="selected" />
      <div class="mt-4">
        Selected: {{ selected }}
      </div>
    `,
  }),
  parameters: {
    badges: [BADGE.STABLE],
  },
};

export default meta;

export const Default = {};

export const Selected = {
  render: (args) => ({
    components: { DpsAlphabeticFilter },
    setup() {
      return { args };
    },
    data() {
      return {
        selected: "A-G",
      };
    },
    template: `
      <DpsAlphabeticFilter v-bind="args" v-model="selected" />
      <div class="mt-4">
        Selected: {{ selected }}
      </div>
    `,
  }),
};

export const Required = {
  render: (args) => ({
    components: { DpsAlphabeticFilter },
    setup() {
      return { args };
    },
    data() {
      return {
        selected: "A-G",
      };
    },
    template: `
      <DpsAlphabeticFilter v-bind="args" v-model="selected" />
      <div class="mt-4">
        Selected: {{ selected }}
      </div>
    `,
  }),
  args: {
    required: true,
  },
};

export const Disabled = {
  args: {
    disabled: true,
  },
};
