import DpsLoadingSpinner from "@/components/loading-spinner/DpsLoadingSpinner.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/LoadingSpinner",
  component: DpsLoadingSpinner,
  argTypes: {},
  render: (args) => ({
    components: { DpsLoadingSpinner },
    setup() {
      return { args };
    },
    template: `<DpsLoadingSpinner v-bind="args">Slot content</DpsLoadingSpinner>`,
  }),
  parameters: {
    badges: [BADGE.STABLE],
  },
};

export default meta;

export const Default = {
  args: {},
};
