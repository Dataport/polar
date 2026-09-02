import DpsFormRadioGroup from "@/components/form-radio-group/DpsFormRadioGroup.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

export default {
  title: "Vue/FormRadioGroup",
  component: DpsFormRadioGroup,
  render: (args) => ({
    components: { DpsFormRadioGroup },
    setup() {
      return { args };
    },
    data() {
      return {
        selected: "opt-2",
      };
    },
    template: `
      <DpsFormRadioGroup v-model="selected" v-bind="args"></DpsFormRadioGroup>
      <div class="mt-4">
        Selected: {{ selected }}
      </div>
    `,
  }),
  argTypes: {
    onChange: { action: "input" },
  },
  parameters: {
    badges: [BADGE.STABLE],
  },
};

export const Default = {
  args: {
    label: "Label",
    name: "default-example",
    options: [
      { label: "Option 1", value: "opt-1" },
      { label: "Option 2", value: "opt-2" },
      { label: "Option 3", value: "opt-3" },
    ],
  },
};

export const HtmlLabels = {
  render: (args) => ({
    components: { DpsFormRadioGroup },
    setup() {
      return { args };
    },
    data() {
      return {
        selected: "opt-2",
      };
    },
    template: `
      <DpsFormRadioGroup v-model="selected" v-bind="args"></DpsFormRadioGroup>
      <div class="mt-4">
        Selected: {{ selected }}
      </div>
    `,
  }),
  args: {
    ...Default.args,
    name: "html-example",
    options: [
      {
        label: "<b>Option 1</b>",
        value: "opt-1",
      },
      { label: "<i>Option 2</i>", value: "opt-2" },
      { label: "<u>Option 3</u>", value: "opt-3" },
    ],
  },
};

export const DisabledGroup = {
  args: {
    ...Default.args,
    name: "disabled-group-example",
    disabled: true,
  },
};

export const DisabledOption = {
  args: {
    ...Default.args,
    name: "disabled-option-example",
    options: [
      {
        label: "<b>Option 1</b>",
        value: "opt-1",
      },
      { label: "<i>Option 2</i>", value: "opt-2" },
      { label: "<u>Option 3</u>", value: "opt-3", disabled: true },
    ],
  },
};

export const ReadonlyOption = {
  args: {
    ...Default.args,
    name: "readonly-option-example",
    options: [
      {
        label: "<b>Option 1</b>",
        value: "opt-1",
      },
      { label: "<i>Option 2</i>", value: "opt-2" },
      { label: "<u>Option 3</u>", value: "opt-3", readonly: true },
    ],
  },
};

export const ErrorOption = {
  args: {
    ...Default.args,
    name: "error-option-example",
    options: [
      {
        label: "<b>Option 1</b>",
        value: "opt-1",
      },
      { label: "<i>Option 2</i>", value: "opt-2" },
      { label: "<u>Option 3</u>", value: "opt-3", error: true },
    ],
  },
};

export const TruncatedLabels = {
  render: (args) => ({
    components: { DpsFormRadioGroup },
    setup() {
      return { args };
    },
    data() {
      return {
        selected: "opt-2",
      };
    },
    template: `
      <div class="overflow-hidden" style="width: 200px">
        <DpsFormRadioGroup v-model="selected" v-bind="args"></DpsFormRadioGroup>
        <div class="mt-4">
          Selected: {{ selected }}
        </div>
      </div>
    `,
  }),
  args: {
    ...Default.args,
    name: "truncated-labels-example",
    options: [
      {
        label: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        value: "opt-1",
      },
      {
        label: "At, consectetur cupiditate dignissimos doloremque earum.",
        value: "opt-2",
      },
      {
        label:
          "Enim eos, esse inventore iste minus molestias necessitatibus obcaecati officia " +
          "officiis quibusdam rerum soluta tempora voluptatem.",
        value: "opt-3",
      },
    ],
    truncate: true,
  },
};

export const ObjectValues = {
  args: {
    ...Default.args,
    name: "object-values-example",
    optionLabel: "value1",
    optionValue: "value2",
    options: [
      {
        value1: "Option 1",
        value2: "opt-1",
        value3: "Lorem",
        value4: "Ipsum",
        value5: "Dolor",
        value6: "Sit",
        value7: "Amet",
      },
      {
        value1: "Option 2",
        value2: "opt-2",
        value3: "Lorem",
        value4: "Ipsum",
        value5: "Dolor",
        value6: "Sit",
        value7: "Amet",
      },
      {
        value1: "Option 3",
        value2: "opt-3",
        value3: "Lorem",
        value4: "Ipsum",
        value5: "Dolor",
        value6: "Sit",
        value7: "Amet",
      },
    ],
  },
};

export const Inline = {
  args: {
    ...Default.args,
    name: "inline-example",
    inline: true,
  },
};
