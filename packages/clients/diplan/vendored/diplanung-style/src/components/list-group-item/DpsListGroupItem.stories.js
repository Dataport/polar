import DpsIconButton from "@/components/icon-button/DpsIconButton.vue";
import DpsListGroupItem from "../list-group-item/DpsListGroupItem.vue";

const meta = {
  title: "Vue/ListGroupItem",
  component: DpsListGroupItem,
  argTypes: {},
  render: (args) => ({
    components: { DpsListGroupItem, DpsIconButton },
    setup() {
      return { args };
    },
    template: `
      <DpsListGroupItem v-bind="args">
        Lorem ipsum
      </DpsListGroupItem>
    `,
  }),
};

export default meta;

export const Default = {
  args: {},
};

export const HtmlLabel = {
  render: (args) => ({
    components: { DpsListGroupItem, DpsIconButton },
    setup() {
      return { args };
    },
    template: `
      <DpsListGroupItem v-bind="args">
        <div class="d-flex">
          <span>Lorem ipsum</span>
          <DpsIconButton class="ms-4" title="Löschen" aria-label="Löschen" icon="delete" danger/>
          <DpsIconButton title="Wiederherstellen" aria-label="Wiederherstellen" icon="refresh"/>
        </div>
      </DpsListGroupItem>
    `,
  }),
  args: {},
};

export const Tag = {
  args: {
    tag: "li",
  },
};

export const Href = {
  args: {
    tag: "a",
    href: "https://example.com",
    target: "_blank",
    rel: "bookmark",
  },
};

export const Collapsible = {
  render: (args) => ({
    components: { DpsListGroupItem },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 400px">
        <DpsListGroupItem v-bind="args">
          Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet
          
          <template #collapsible-content>
            Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
          </template>
        </DpsListGroupItem>
      </div>
    `,
  }),
  args: {},
};
