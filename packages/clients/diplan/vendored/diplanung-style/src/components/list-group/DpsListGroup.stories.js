import DpsListGroup from "@/components/list-group/DpsListGroup.vue";
import DpsListGroupItem from "@/components/list-group-item/DpsListGroupItem.vue";

const meta = {
  title: "Vue/ListGroup",
  component: DpsListGroup,
  argTypes: {},
  render: (args) => ({
    components: { DpsListGroup, DpsListGroupItem },
    setup() {
      return { args };
    },
    template: `
      <DpsListGroup v-bind="args">
        <template #default>
          <DpsListGroupItem>DpsListGroupItem</DpsListGroupItem>
          <DpsListGroupItem>DpsListGroupItem</DpsListGroupItem>
        </template>
      </DpsListGroup>
    `,
  }),
};

export default meta;

export const Default = {
  args: {},
};

export const Bordered = {
  args: {
    bordered: true,
  },
};

export const Tag = {
  args: {
    tag: "ul",
  },
};

export const CounterSlot = {
  render: (args) => ({
    components: { DpsListGroup, DpsListGroupItem },
    setup() {
      return { args };
    },
    template: `
      <DpsListGroup v-bind="args">
        <template #counter>Counter Slot</template>
        
        <DpsListGroupItem>DpsListGroupItem</DpsListGroupItem>
        <DpsListGroupItem>DpsListGroupItem</DpsListGroupItem>
      </DpsListGroup>
    `,
  }),
};

export const CollapsibleItems = {
  render: (args) => ({
    components: { DpsListGroup, DpsListGroupItem },
    setup() {
      return { args };
    },
    template: `
      <DpsListGroup v-bind="args" style="width: 400px">
        <DpsListGroupItem v-for="index in 5">
          Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet
  
          <template #collapsible-content>
            Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
          </template>
        </DpsListGroupItem>
      </DpsListGroup>
    `,
  }),
  args: {
    bordered: true,
  },
};
