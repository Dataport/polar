import DpsBadge from "@/components/badge/DpsBadge.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/Badge",
  component: DpsBadge,
  argTypes: {
    variant: {
      control: "select",
      options: ["undefined", "info", "success", "warning", "error", "outline", "primary"],
    },
    rounded: {
      control: "boolean",
    },
  },
  render: (args) => ({
    components: { DpsBadge },
    setup() {
      return { args };
    },
    template: `<DpsBadge v-bind="args">{{ args.rounded ? "8" : "Lorem ipsum" }}</DpsBadge>`,
  }),
  parameters: {
    badges: [BADGE.STABLE],
  },
};

export default meta;

export const Default = {
  args: {},
};

export const Primary = {
  args: {
    variant: "primary",
  },
};

export const Info = {
  args: {
    variant: "info",
  },
};

export const Success = {
  args: {
    variant: "success",
  },
};

export const Warning = {
  args: {
    variant: "warning",
  },
};

export const Error = {
  args: {
    variant: "error",
  },
};

export const RoundedOutline = {
  args: {
    variant: "outline",
    rounded: true,
  },
};

export const RoundedPrimary = {
  args: {
    variant: "primary",
    rounded: true,
  },
};
