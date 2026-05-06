import DpsSortSelect from "@/components/sort-select/DpsSortSelect.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/SortSelect",
  component: DpsSortSelect,
  render: (args) => ({
    components: { DpsSortSelect },
    setup() {
      return { args };
    },
    data() {
      return {
        selected: "name_desc",
      };
    },
    template: `
      <DpsSortSelect v-model="selected" v-bind="args" />
      <pre class="mt-4">Selected: {{selected}}</pre>
    `,
  }),
  argTypes: {},
  parameters: {
    badges: [BADGE.STABLE],
  },
};

export default meta;

export const Default = {
  args: {
    options: [
      { label: "Name Mustervorlage A-Z", value: "name_asc" },
      { label: "Name Mustervorlage Z-A", value: "name_desc" },
    ],
  },
};

export const Disabled = {
  args: {
    ...Default.args,
    disabled: true,
  },
};
