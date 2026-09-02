import DpsFormTextarea from "@/components/form-textarea/DpsFormTextarea.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/FormTextarea",
  component: DpsFormTextarea,
  render: (args) => ({
    components: { DpsFormTextarea },
    setup() {
      return { args };
    },
    data() {
      return {
        text: "",
      };
    },
    template: `
      <DpsFormTextarea v-bind="args" v-model="text" />
      <pre class="mt-4">{{ text }}</pre>
    `,
  }),
  argTypes: {
    resizable: {
      control: "select",
      options: [true, false, "vertical", "horizontal"],
    },
  },
  parameters: {
    badges: [BADGE.STABLE],
  },
};

export default meta;

export const Default = {
  args: {
    placeholder: "Placeholder",
  },
};

export const Filled = {
  render: (args) => ({
    components: { DpsFormTextarea },
    setup() {
      return { args };
    },
    data() {
      return {
        text: "Lorem ipsum",
      };
    },
    template: `
      <DpsFormTextarea v-bind="args" v-model="text" />
      <pre class="mt-4">{{ text }}</pre>
    `,
  }),
  args: {
    ...Default.args,
  },
};

export const Error = {
  args: {
    ...Default.args,
    error: true,
  },
};

export const Success = {
  args: {
    ...Default.args,
    success: true,
  },
};

export const Readonly = {
  args: {
    ...Default.args,
    readonly: true,
  },
};

export const Disabled = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const Resizable = {
  args: {
    ...Default.args,
    resizable: true,
  },
};

export const ResizableVertical = {
  args: {
    ...Default.args,
    resizable: "vertical",
  },
};

export const ResizableHorizontal = {
  args: {
    ...Default.args,
    resizable: "horizontal",
  },
};

export const Rows = {
  args: {
    ...Default.args,
    rows: 6,
  },
};
