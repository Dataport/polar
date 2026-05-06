import DpsAlert from "@/components/alert/DpsAlert.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/Alert",
  component: DpsAlert,
  render: (args) => ({
    components: { DpsAlert },
    setup() {
      return { args };
    },
    template: `
      <DpsAlert v-bind="args">
        Lorem ipsum dolor sit amet consectetur. Tempus pellentesque auctor vel mi aliquet elementum
        nisl nibh. Elit cras ultrices sagittis enim mattis placerat neque facilisi.
      </DpsAlert>
    `,
  }),
  argTypes: {
    variant: { control: "select", options: ["warning", "error", "info", "success"] },
  },
  parameters: {
    badges: [BADGE.STABLE],
  },
};

export default meta;

export const Default = {
  args: {},
};

export const Info = {
  args: {
    variant: "info",
  },
};

export const Warning = {
  args: {
    variant: "warning",
  },
};

export const Success = {
  args: {
    variant: "success",
  },
};

export const Error = {
  args: {
    variant: "error",
  },
};

export const WithHeading = {
  args: {
    heading: "Info: Lorem ipsum",
  },
};

export const MultipleParagraphs = {
  render: (args) => ({
    components: { DpsAlert },
    setup() {
      return { args };
    },
    template: `
      <DpsAlert v-bind="args">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos dolor eaque est!
        </p>
        <p>
          Architecto aut dicta exercitationem neque nihil quam reprehenderit voluptatem. Alias aut, 
          beatae dolores, ducimus, fuga labore libero maxime molestias nihil sint tempore.
        </p>
        <p>Elit cras ultrices sagittis enim mattis placerat neque facilisi.</p>
      </DpsAlert>
    `,
  }),
  args: {
    variant: "success",
    heading: "success: Lorem ipsum",
  },
};

export const HideIcon = {
  args: {
    hideIcon: true,
  },
};
