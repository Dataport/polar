import DpsFormSelect from "@/components/form-select/DpsFormSelect.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/FormSelect",
  component: DpsFormSelect,
  render: (args) => ({
    components: { DpsFormSelect },
    setup() {
      return { args };
    },
    data() {
      return {
        selected: undefined,
      };
    },
    template: `
      <div style="min-height: 260px; width: 300px">
        <DpsFormSelect v-model="selected" v-bind="args" />
        <pre class="mt-4">Selected: {{ selected }}</pre>
      </div>
    `,
  }),
  args: {
    options: [
      {
        label: "Option 1",
        value: "option-1",
      },
      {
        label: "Option 2",
        value: "option-2",
      },
      {
        label: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        value: "option-3",
      },
      {
        label: "Option 4",
        value: "option-4",
        $isDisabled: true,
      },
    ],
    placeholder: "Bitte wählen",
  },
  argTypes: {
    size: { control: "select", options: [undefined, "sm"] },
    variant: { control: "select", options: [undefined, "filter", "simple"] },
    align: { control: "select", options: ["start", "end"] },
    openDirection: { control: "select", options: ["", "above", "top", "below", "bottom"] },
  },
  parameters: {
    badges: [BADGE.STABLE],
  },
};

export default meta;

export const Default = {
  args: {},
};

export const Filter = {
  args: {
    variant: "filter",
  },
};

export const Simple = {
  args: {
    variant: "simple",
  },
};

export const AlignEnd = {
  args: {
    variant: "simple",
    align: "end",
  },
};

export const SizeSm = {
  args: {
    size: "sm",
  },
};

export const Disabled = {
  args: {
    disabled: true,
  },
};

// TODO: should it be focusable? (a11y)
export const Readonly = {
  args: {
    readonly: true,
  },
};

export const Required = {
  args: {
    required: true,
  },
};

export const Label = {
  args: {
    label: "Label",
  },
};

export const Error = {
  args: {
    error: true,
  },
};

export const Success = {
  args: {
    success: true,
  },
};

export const OptionIcon = {
  args: {
    options: [
      {
        label: "Option 1",
        value: "option-1",
      },
      {
        label: "Option 2",
        value: "option-2",
        icon: "map",
      },
      {
        label: "Option 3",
        value: "option-3",
        icon: "refresh",
      },
      {
        label: "Option 4",
        value: "option-4",
        icon: "telephone",
        $isDisabled: true,
      },
    ],
  },
};

export const Searchable = {
  args: {
    searchable: true,
  },
};

export const Multiple = {
  args: {
    multiple: true,
    closeOnSelect: false,
  },
};

export const MultipleSearchable = {
  args: {
    multiple: true,
    searchable: true,
    closeOnSelect: false,
    clearOnSelect: false,
  },
};

export const SimpleOptions = {
  args: {
    options: ["Eimsbuettel", "Hamburg-Mitte", "FNPLapro", "Altona"],
  },
};

export const CustomOptions = {
  args: {
    options: [
      { code: "Eimsbuettel", name: "Eimsbüttel" },
      { code: "Hamburg-Mitte", name: "Hamburg-Mitte" },
      { code: "FNPLapro", name: "BSW FNP / Lapro" },
      { code: "Altona", name: "Altona" },
    ],
    optionLabel: "name",
    optionValue: "code",
    multiple: true,
    closeOnSelect: false,
    clearOnSelect: false,
  },
};

export const FilterFullExample = {
  args: {
    variant: "filter",
    size: "sm",
    multiple: true,
    searchable: true,
    hideTags: true,
    label: "Label",
    closeOnSelect: false,
    clearOnSelect: false,
  },
};
