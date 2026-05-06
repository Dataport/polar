import DpsFormCheckbox from "@/components/form-checkbox/DpsFormCheckbox.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const CheckedRender = (args) => ({
  components: { DpsFormCheckbox },
  setup() {
    return { args };
  },
  data() {
    return {
      selected: "opt-1",
    };
  },
  template: `<DpsFormCheckbox v-bind="args" v-model="selected"> Label </DpsFormCheckbox>`,
});

const meta = {
  title: "Vue/FormCheckbox",
  component: DpsFormCheckbox,
  render: (args) => ({
    components: { DpsFormCheckbox },
    setup() {
      return { args };
    },
    template: `<DpsFormCheckbox v-bind="args"> Label </DpsFormCheckbox>`,
  }),
  argTypes: {
    onClick: { action: "checked" },
    size: { control: "select", options: [undefined, "sm"] },
  },
  args: {
    value: "opt-1",
  },
  parameters: {
    badges: [BADGE.STABLE],
  },
};

export default meta;

export const Default = {
  args: {},
};

export const Checked = {
  render: CheckedRender,
  args: {},
};

export const Disabled = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked = {
  render: CheckedRender,
  args: {
    disabled: true,
  },
};

export const Readonly = {
  args: {
    readonly: true,
  },
};

export const ReadonlyChecked = {
  render: CheckedRender,
  args: {
    readonly: true,
  },
};

export const Error = {
  args: {
    error: true,
  },
};

export const ErrorChecked = {
  render: CheckedRender,
  args: {
    error: true,
  },
};

export const SizeSm = {
  args: {
    size: "sm",
  },
};

export const Block = {
  render: (args) => ({
    components: { DpsFormCheckbox },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 200px">
        <DpsFormCheckbox v-bind="args">
          Label
        </DpsFormCheckbox>
      </div>
    `,
  }),
  args: {
    block: true,
  },
};

export const TruncatedLabel = {
  render: (args) => ({
    components: { DpsFormCheckbox },
    setup() {
      return { args };
    },
    template: `
      <div class="overflow-hidden" style="width: 200px">
        <DpsFormCheckbox v-bind="args">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aliquid eum exercitationem 
          expedita ipsa nisi. Asperiores earum eligendi fugit possimus!
        </DpsFormCheckbox>
      </div>
    `,
  }),
  args: {
    truncate: true,
  },
};

export const HtmlLabel = {
  render: (args) => ({
    components: { DpsFormCheckbox },
    setup() {
      return { args };
    },
    template: `
      <DpsFormCheckbox v-bind="args">
        <b>I am a bold text</b> followed by <i>an italic text</i>
      </DpsFormCheckbox>
    `,
  }),
  args: {},
};

export const HideLabel = {
  args: {
    hideLabel: true,
  },
};

export const Multiple = {
  render: () => ({
    components: { DpsFormCheckbox },
    data() {
      return {
        selected: [],
      };
    },
    template: `
      <div class="d-flex flex-column gap-2">
        <DpsFormCheckbox v-model="selected" value="opt-1" name="multiple-example">
          Option 1
        </DpsFormCheckbox>
        <DpsFormCheckbox v-model="selected" value="opt-2" name="multiple-example">
          Option 2
        </DpsFormCheckbox>
        <DpsFormCheckbox v-model="selected" value="opt-3" name="multiple-example">
          Option 3
        </DpsFormCheckbox>
      </div>
      <div class="mt-4">
        Selected: {{ selected }}
      </div>
    `,
  }),
};
