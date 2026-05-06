import DpsFormDatepicker from "@/components/form-datepicker/DpsFormDatepicker.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/FormDatepicker",
  component: DpsFormDatepicker,
  argTypes: {
    initialDate: {
      control: { type: "object" }, // Ensures that it's treated as an object, not a date picker
    },
  },
  render: (args) => ({
    components: { DpsFormDatepicker },
    setup() {
      return { args };
    },
    template: `<DpsFormDatepicker v-bind="args"></DpsFormDatepicker>`,
  }),
  parameters: {
    badges: [BADGE.EXPERIMENTAL],
  },
};

export default meta;

export const Default = {
  args: {},
};

export const Checkbox = {
  args: {
    hasCheckbox: true,
    checkboxTitle: "Checkbox title",
    isCheckboxChecked: false,
  },
};

export const Placeholder = {
  args: {
    placeholder: "Placeholder",
  },
};

export const Range = {
  args: {
    range: true,
    zeitraum: {
      beginn: new Date(2024, 9, 1),
      ende: new Date(2024, 9, 10),
    },
  },
};

export const DateBlackList = {
  args: {
    dateBlackList: [
      {
        title: "Winterferien 2025",
        from: "2025-02-01",
        to: "2025-02-02",
      },
      {
        title: "Osterferien 2025",
        from: "2025-03-04",
        to: "2025-03-16",
      },
    ],
  },
};

export const InputAttr = {
  args: {
    inputAttr: { title: "Example title" },
  },
};

export const Editable = {
  args: {
    editable: true,
  },
};

export const Disabled = {
  args: {
    disabled: true,
  },
};

export const ClearablePicker = {
  args: {
    clearable: true,
    initialDate: "2024-10-02",
  },
};
