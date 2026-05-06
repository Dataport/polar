import DpsIconButton from "@/components/icon-button/DpsIconButton.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/IconButton",
  component: DpsIconButton,
  render: (args) => ({
    components: { DpsIconButton },
    setup() {
      return { args };
    },
    template: `<DpsIconButton v-bind="args" />`,
  }),
  parameters: {
    badges: [BADGE.STABLE],
  },
};

export default meta;

export const Default = {
  args: {
    icon: "placeholder",
  },
};

export const Disabled = {
  args: {
    icon: "create",
    disabled: true,
  },
};

export const Loading = {
  args: {
    icon: "placeholder",
    loading: true,
  },
};

export const Danger = {
  args: {
    icon: "delete",
    danger: true,
  },
};

export const Href = {
  args: {
    icon: "placeholder",
    href: "http://example.com",
  },
};
