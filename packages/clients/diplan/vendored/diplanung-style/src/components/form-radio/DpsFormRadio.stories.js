import DpsFormRadio from "@/components/form-radio/DpsFormRadio.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const CheckedRender = (args) => ({
  components: { DpsFormRadio },
  setup() {
    return { args };
  },
  data() {
    return {
      selected: "Value",
    };
  },
  template: `
      <DpsFormRadio v-bind="args" v-model="selected"> Label </DpsFormRadio>
    `,
});

const meta = {
  title: "Vue/FormRadio",
  component: DpsFormRadio,
  render: (args) => ({
    components: { DpsFormRadio },
    setup() {
      return { args };
    },
    template: `<DpsFormRadio v-bind="args"> Label </DpsFormRadio>`,
  }),
  argTypes: {
    onClick: { action: "checked" },
  },
  parameters: {
    badges: [BADGE.STABLE],
  },
};

export default meta;

export const Default = {
  args: {
    name: "default-example",
    value: "Value",
  },
};

export const Checked = {
  render: CheckedRender,
  args: {
    ...Default.args,
    name: "checked-example",
  },
};

export const Disabled = {
  args: {
    ...Default.args,
    name: "disabled-example",
    disabled: true,
  },
};

export const DisabledChecked = {
  render: CheckedRender,
  args: {
    ...Default.args,
    name: "disabled-example",
    disabled: true,
  },
};

export const Readonly = {
  args: {
    ...Default.args,
    name: "readonly-example",
    readonly: true,
  },
};

export const ReadonlyChecked = {
  render: CheckedRender,
  args: {
    ...Default.args,
    name: "readonly-example",
    readonly: true,
  },
};

export const Error = {
  args: {
    ...Default.args,
    name: "error-example",
    error: true,
  },
};

export const ErrorChecked = {
  render: CheckedRender,
  args: {
    ...Default.args,
    name: "error-example",
    error: true,
  },
};

export const Block = {
  render: (args) => ({
    components: { DpsFormRadio },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 200px">
        <DpsFormRadio v-bind="args">
          Label
        </DpsFormRadio>
      </div>
    `,
  }),
  args: {
    ...Default.args,
    name: "block-example",
    block: true,
  },
};

export const TruncatedLabel = {
  render: (args) => ({
    components: { DpsFormRadio },
    setup() {
      return { args };
    },
    template: `
      <div class="overflow-hidden" style="width: 200px">
        <DpsFormRadio v-bind="args">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aliquid 
          eum exercitationem expedita ipsa nisi. Asperiores earum eligendi 
          fugit possimus!
        </DpsFormRadio>
      </div>
    `,
  }),
  args: {
    ...Default.args,
    name: "truncated-example",
    truncate: true,
  },
};

export const HtmlLabel = {
  render: (args) => ({
    components: { DpsFormRadio },
    setup() {
      return { args };
    },
    template: `
      <DpsFormRadio v-bind="args">
        <b>I am a bold text</b> followed by <i>an italic text</i>
      </DpsFormRadio>
    `,
  }),
  args: {
    ...Default.args,
    name: "html-label-example",
  },
};

export const HideLabel = {
  args: {
    ...Default.args,
    name: "without-label-example",
    hideLabel: true,
  },
};

export const Multiple = {
  render: () => ({
    components: { DpsFormRadio },
    data() {
      return {
        selected: "opt-3",
      };
    },
    template: `
      <div class="d-flex flex-column gap-2">
        <DpsFormRadio v-model="selected" value="opt-1" name="multiple-example">
          Option 1
        </DpsFormRadio>
        <DpsFormRadio v-model="selected" value="opt-2" name="multiple-example">
          Option 2
        </DpsFormRadio>
        <DpsFormRadio v-model="selected" value="opt-3" name="multiple-example">
          Option 3
        </DpsFormRadio>
      </div>
      <div class="mt-4">
        Selected: {{ selected }}
      </div>
    `,
  }),
};
