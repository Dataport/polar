import DpsFormToggle from "@/components/form-toggle/DpsFormToggle.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/FormToggle",
  component: DpsFormToggle,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", undefined],
    },
  },
  render: (args) => ({
    components: { DpsFormToggle },
    setup() {
      return { args };
    },
    template: `<DpsFormToggle v-bind="args" />`,
  }),
  args: {
    modelValue: false,
  },
  parameters: {
    badges: [BADGE.NEEDS_REVISION],
  },
};

export default meta;

export const Default = {
  args: {},
};

export const Label = {
  render: (args) => ({
    components: { DpsFormToggle },
    setup() {
      return { args };
    },
    template: `<DpsFormToggle v-bind="args">Toggle Label</DpsFormToggle>`,
  }),
};

export const Checked = {
  args: {
    modelValue: true,
  },
};

export const Disabled = {
  args: {
    disabled: true,
  },
};

export const SizeSm = {
  args: {
    size: "sm",
  },
};

export const WithAriaAttributes = {
  args: {
    ariaLabel: "Toggle this option",
    ariaDescribedby: "This is a description for the toggle.",
  },
};
