import DpsCollapsible from "@/components/collapsible/DpsCollapsible.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/Collapsible",
  component: DpsCollapsible,
  render: (args) => ({
    components: { DpsCollapsible },
    setup() {
      return { args };
    },
    template: `
      <DpsCollapsible v-bind="args" style="width: 400px">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab accusantium at corporis 
        deserunt distinctio dolore exercitationem illum ipsam natus nulla obcaecati odio 
        praesentium quaerat quia quisquam, quo tenetur velit vitae!
      </DpsCollapsible>`,
  }),
  argTypes: {
    variant: { control: "select", options: [undefined, "secondary", "tertiary"] },
  },
  parameters: {
    badges: [BADGE.STABLE],
  },
};

export default meta;

export const Default = {
  args: {
    toggleText: "Expand lorem ipsum",
    toggleTextExpanded: "Collapse lorem ipsum",
  },
};

export const SizeLg = {
  args: {
    ...Default.args,
    size: "lg",
  },
};

export const Secondary = {
  args: {
    ...Default.args,
    variant: "secondary",
  },
};

export const Tertiary = {
  args: {
    ...Default.args,
    variant: "tertiary",
  },
};

export const Expanded = {
  args: {
    ...Default.args,
    expanded: true,
  },
};

export const Locked = {
  args: {
    ...Default.args,
    locked: true,
  },
};

export const LockedExpanded = {
  args: {
    ...Default.args,
    locked: true,
    expanded: true,
  },
};

export const Nested = {
  render: (args) => ({
    components: { DpsCollapsible },
    setup() {
      return { args };
    },
    template: `
      <DpsCollapsible size="lg" toggle-text="Toggle" style="width: 400px" expanded>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab accusantium at corporis 
        deserunt distinctio dolore exercitationem illum ipsam natus nulla obcaecati odio 
        praesentium quaerat quia quisquam, quo tenetur velit vitae!

        <br />
        <br />
        
        <DpsCollapsible toggle-text="Toggle 2" expanded>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab accusantium at corporis
          deserunt distinctio dolore exercitationem illum ipsam natus nulla obcaecati odio
          praesentium quaerat quia quisquam, quo tenetur velit vitae!
        </DpsCollapsible>
      </DpsCollapsible>`,
  }),
};

export const HeaderSlot = {
  render: (args) => ({
    components: { DpsCollapsible },
    setup() {
      return { args };
    },
    template: `
      <DpsCollapsible size="lg" toggle-text="Toggle" style="width: 400px" expanded>
        <template #header>
          <div style="border: 1px solid #000; padding: 4px">Toggle</div>
          with a
          <b>bold</b>
          <i>HEADLINE</i>
        </template>
        
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab accusantium at corporis 
        deserunt distinctio dolore exercitationem illum ipsam natus nulla obcaecati odio 
        praesentium quaerat quia quisquam, quo tenetur velit vitae!
      </DpsCollapsible>`,
  }),
};
