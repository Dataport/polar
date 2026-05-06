import DpsButton from "@/components/button/DpsButton.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/Button",
  component: DpsButton,
  render: (args) => ({
    components: { DpsButton },
    setup() {
      return { args };
    },
    template: `<DpsButton v-bind="args">Click me</DpsButton>`,
  }),
  argTypes: {
    variant: {
      control: "select",
      options: [undefined, "secondary", "link", "link-darker"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    iconPosition: { control: "select", options: ["start", "end"] },
    onClick: { action: "clicked" },
  },
  parameters: {
    badges: [BADGE.STABLE],
  },
};

export default meta;

export const Default = {};

export const Secondary = {
  args: {
    variant: "secondary",
  },
};

export const Link = {
  args: {
    variant: "link",
  },
};

export const LinkDarker = {
  args: {
    variant: "link-darker",
  },
};

export const SizeSm = {
  args: {
    size: "sm",
  },
};

export const SizeLg = {
  args: {
    size: "lg",
  },
};

export const Squared = {
  args: {
    name: "Squared",
    squared: true,
  },
};

export const Href = {
  args: {
    href: "http://example.com",
  },
};

export const Icon = {
  args: {
    icon: "placeholder",
  },
};

export const IconPosition = {
  args: {
    icon: "placeholder",
    iconPosition: "end",
  },
};

export const Disabled = {
  args: {
    disabled: true,
    icon: "placeholder",
    iconPosition: "end",
  },
};

export const Loading = {
  args: {
    loading: true,
  },
};

export const NoPadding = {
  render: (args) => ({
    components: { DpsButton },
    setup() {
      return { args };
    },
    template: `<DpsButton v-bind="args" aria-label="Click me"></DpsButton>`,
  }),
  args: {
    noPadding: true,
    variant: "link",
    icon: "placeholder",
  },
};
