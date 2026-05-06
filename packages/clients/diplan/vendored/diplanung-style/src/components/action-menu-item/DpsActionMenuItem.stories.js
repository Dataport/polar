import DpsActionMenuItem from "@/components/action-menu-item/DpsActionMenuItem.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/ActionMenuItem",
  component: DpsActionMenuItem,
  render: (args) => ({
    components: { DpsActionMenuItem },
    setup() {
      return { args };
    },
    template: `
      <DpsActionMenuItem v-bind="args">
        Label
      </DpsActionMenuItem>
    `,
  }),
  parameters: {
    badges: [BADGE.STABLE],
  },
};

export default meta;

export const Default = {
  args: {
    title: "Title",
  },
};

export const Icon = {
  args: {
    icon: "placeholder",
  },
};

export const Disabled = {
  args: {
    icon: "placeholder",
    disabled: true,
  },
};

export const Danger = {
  args: {
    icon: "placeholder",
    danger: true,
  },
};

export const Href = {
  args: {
    icon: "placeholder",
    href: "#",
  },
};

export const Tag = {
  args: {
    tag: "div",
  },
};
