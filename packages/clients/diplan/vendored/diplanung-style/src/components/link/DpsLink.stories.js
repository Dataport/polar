import DpsLink from "@/components/link/DpsLink.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/Link",
  component: DpsLink,
  render: (args) => ({
    components: { DpsLink },
    setup() {
      return { args };
    },
    template: `<DpsLink v-bind="args">Link default</DpsLink>`,
  }),
  argTypes: {
    icon: {
      control: "select",
      options: [
        undefined,
        "telephone",
        "lock-error",
        "inhalt",
        "profil",
        "layer-select",
        "vector",
        "group",
        "minus",
        "external-link",
      ],
    },
    target: {
      control: "select",
      options: [undefined, "_self", "_blank", "_parent", "_top"],
    },
    format: {
      control: "select",
      options: [undefined, "telephone", "email"],
    },
  },
  parameters: {
    badges: [BADGE.STABLE],
  },
};

export default meta;

export const Default = {
  args: {
    href: "http://localhost:9001",
  },
};

export const Icon = {
  args: {
    ...Default.args,
    icon: "create",
  },
};

export const External = {
  render: (args) => ({
    components: { DpsLink },
    setup() {
      return { args };
    },
    template: `<DpsLink v-bind="args">Link external</DpsLink>`,
  }),
  args: {
    href: "https://xleitstelle.de/xplanung",
    external: true,
  },
};

export const FormatEmail = {
  render: (args) => ({
    components: { DpsLink },
    setup() {
      return { args };
    },
    template: `<DpsLink v-bind="args">user@domain.com</DpsLink>`,
  }),
  args: {
    href: "user@domain.com",
    format: "email",
  },
};

export const FormatTelephone = {
  render: (args) => ({
    components: { DpsLink },
    setup() {
      return { args };
    },
    template: `<DpsLink v-bind="args">(+49) 40 428 46 2694</DpsLink>`,
  }),
  args: {
    href: "(+49) 40 428 46 2694",
    icon: "telephone",
    format: "telephone",
  },
};

export const Darker = {
  args: {
    href: "http://localhost:9001",
    darker: true,
  },
};
