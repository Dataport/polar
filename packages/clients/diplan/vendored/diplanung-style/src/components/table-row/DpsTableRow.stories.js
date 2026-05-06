import DpsTableRow from "@/components/table-row/DpsTableRow.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/TableRow",
  component: DpsTableRow,
  argTypes: {},
  render: (args) => ({
    components: { DpsTableRow },
    setup() {
      return { args };
    },
    template: `
      <table>
        <DpsTableRow v-bind="args">
          <td>Lorem</td>
          <td>Ipsum</td>
          <td>Dolor</td>
          <td>
            Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet
          </td>
        </DpsTableRow>
      </table>
    `,
  }),
  parameters: {
    badges: [BADGE.EXPERIMENTAL],
  },
};

export default meta;

export const Default = {
  args: {},
};

export const Collapsible = {
  render: (args) => ({
    components: { DpsTableRow },
    setup() {
      return { args };
    },
    template: `
      <table>
        <DpsTableRow v-bind="args">
          <td>Lorem</td>
          <td>Ipsum</td>
          <td>Dolor</td>
          <td style="padding-right: 48px">
            Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet
          </td>
          
          <template #collapsible-content>
            Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
          </template>
        </DpsTableRow>
      </table>
    `,
  }),
  args: {
    collapseColspan: 4,
  },
};

export const CollapseColspan = {
  render: Collapsible.render,
  args: {
    collapseColspan: 3,
  },
};

export const CollapseColstart = {
  render: Collapsible.render,
  args: {
    collapseColstart: 3,
    collapseColspan: 1,
  },
};

export const Expanded = {
  render: Collapsible.render,
  args: {
    expanded: true,
    collapseColspan: 4,
  },
};
