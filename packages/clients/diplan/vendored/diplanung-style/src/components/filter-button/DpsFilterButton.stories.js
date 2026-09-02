import DpsFilterButton from "@/components/filter-button/DpsFilterButton.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/FilterButton",
  component: DpsFilterButton,
  render: (args) => ({
    components: { DpsFilterButton },
    setup() {
      return { args };
    },
    template: `
      <DpsFilterButton v-bind="args">
        Group: Lorem ipsum
      </DpsFilterButton>
    `,
  }),
  parameters: {
    badges: [BADGE.STABLE],
  },
};

export default meta;

export const Default = {
  args: {},
};

export const Disabled = {
  args: {
    disabled: true,
  },
};

export const Readonly = {
  args: {
    readonly: true,
  },
};
