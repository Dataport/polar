import DpsPagination from "@/components/pagination/DpsPagination.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/Pagination",
  component: DpsPagination,
  render: (args) => ({
    components: { DpsPagination },
    setup() {
      return { args };
    },
    template: `<DpsPagination v-bind="args"/>`,
  }),
  parameters: {
    badges: [BADGE.NEEDS_REVISION],
  },
};

export default meta;

export const Default = {
  args: { numberOfElements: 99 },
};

export const Custom = {
  args: {
    ariaLabel: "News Paginierung",
    ariaContentId: "content-id",
    numberOfElements: 99,
    elementsPerPageOptions: [5, 10, 15],
    numberOfPageNumbers: 3,
  },
};

export const Server = {
  args: {
    numberOfElements: 150,
    numberOfPagesAsProp: 3,
    currentPageAsProp: 1,
    elementsPerPageAsProp: 50,
  },
};
