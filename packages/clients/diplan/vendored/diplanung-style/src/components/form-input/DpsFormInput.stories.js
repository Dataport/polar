import DpsFormInput from "@/components/form-input/DpsFormInput.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/FormInput",
  component: DpsFormInput,
  render: (args) => ({
    components: { DpsFormInput },
    setup() {
      return { args };
    },
    data() {
      return {
        text: "",
      };
    },
    template: `
      <DpsFormInput v-bind="args" v-model="text" />
      <pre class="mt-4">{{ text }}</pre>
    `,
  }),
  argTypes: {
    size: { control: "select", options: [undefined, "sm"] },
    type: { control: "select", options: ["text", "url", "email", "number", "search"] },
  },
  parameters: {
    badges: [BADGE.STABLE],
  },
};

export default meta;

export const Default = {
  args: {},
};

export const Placeholder = {
  args: {
    placeholder: "Placeholder",
  },
};

export const Filled = {
  render: (args) => ({
    components: { DpsFormInput },
    setup() {
      return { args };
    },
    data() {
      return {
        text: "Lorem ipsum",
      };
    },
    template: `
      <DpsFormInput v-bind="args" v-model="text" />
      <pre class="mt-4">Value: {{ text }}</pre>
    `,
  }),
  args: {},
};

export const Error = {
  args: {
    ...Placeholder.args,
    error: true,
  },
};

export const Success = {
  args: {
    ...Placeholder.args,
    success: true,
  },
};

export const Readonly = {
  args: {
    ...Placeholder.args,
    readonly: true,
  },
};

export const Disabled = {
  args: {
    ...Placeholder.args,
    disabled: true,
  },
};

export const Icon = {
  args: {
    ...Placeholder.args,
    icon: "placeholder",
  },
};

export const TypeUrl = {
  args: {
    ...Placeholder.args,
    type: "url",
  },
};

export const TypeEmail = {
  args: {
    ...Placeholder.args,
    type: "email",
  },
};

export const TypeNumber = {
  args: {
    ...Placeholder.args,
    type: "number",
  },
};

export const TypeSearch = {
  args: {
    ...Placeholder.args,
    icon: "search",
    type: "search",
  },
};

export const SizeSm = {
  args: {
    ...Placeholder.args,
    size: "sm",
  },
};
