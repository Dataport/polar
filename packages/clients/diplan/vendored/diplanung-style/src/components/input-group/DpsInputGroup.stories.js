import DpsInputGroup from "@/components/input-group/DpsInputGroup.vue";
import DpsButton from "@/components/button/DpsButton.vue";
import DpsFormInput from "@/components/form-input/DpsFormInput.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/InputGroup",
  component: DpsInputGroup,
  argTypes: {},
  render: (args) => ({
    components: { DpsInputGroup, DpsButton, DpsFormInput },
    setup() {
      return { args };
    },
    template: `
      <DpsInputGroup v-bind="args">
        <template #prepend>
          <span class="dps-icon dps-icon--search p-4"/>
        </template>
        <template #default>
          <DpsFormInput placeholder="Platzhalter" />
        </template>
        <template #append>
          <DpsButton squared size="lg">
            Button
          </DpsButton>
        </template>
      </DpsInputGroup>`,
  }),
  parameters: {
    badges: [BADGE.STABLE],
  },
};

export default meta;

export const Default = {
  args: {},
};

export const Collapsed = {
  args: {
    collapsed: true,
  },
};

export const MultipleButtons = {
  render: (args) => ({
    components: { DpsInputGroup, DpsButton, DpsFormInput },
    setup() {
      return { args };
    },
    template: `
      <DpsInputGroup v-bind="args">
        <template #prepend>
          <span class="dps-icon dps-icon--search p-4"/>
        </template>
        <template #default>
          <DpsFormInput placeholder="Platzhalter" />
        </template>
        <template #append>
          <DpsButton squared size="lg">
            Button 1
          </DpsButton>
          <DpsButton squared variant="secondary" size="lg">
            Button 2
          </DpsButton>
        </template>
      </DpsInputGroup>`,
  }),
  args: {},
};
