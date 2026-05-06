import DpsActionMenu from "@/components/action-menu/DpsActionMenu.vue";
import DpsActionMenuItem from "@/components/action-menu-item/DpsActionMenuItem.vue";
import DpsFormCheckboxGroup from "@/components/form-checkbox-group/DpsFormCheckboxGroup.vue";
import DpsFormRadioGroup from "@/components/form-radio-group/DpsFormRadioGroup.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/ActionMenu",
  component: DpsActionMenu,
  render: (args) => ({
    components: { DpsActionMenu, DpsActionMenuItem },
    setup() {
      return { args };
    },
    template: `
      <DpsActionMenu v-bind="args" style="padding-bottom: 300px;">
          <DpsActionMenuItem>
            Simple
          </DpsActionMenuItem>
          <DpsActionMenuItem icon="download">
            Herunterladen
          </DpsActionMenuItem>
          <DpsActionMenuItem icon="create" href="#">
            Bearbeiten
          </DpsActionMenuItem>
          <DpsActionMenuItem icon="veroeffentlichen" disabled>
            Veröffentlichen
          </DpsActionMenuItem>
          <DpsActionMenuItem icon="delete" danger>
            Löschen
          </DpsActionMenuItem>
      </DpsActionMenu>
    `,
  }),
  parameters: {
    badges: [BADGE.STABLE],
  },
};

export default meta;

export const Default = {
  args: {},
};

export const Label = {
  args: {
    label: "Label",
  },
};

export const Disabled = {
  args: {
    label: "Label",
    disabled: true,
  },
};

export const ShowCloseButton = {
  args: {
    showCloseButton: true,
  },
};

export const ShowTriggerChevron = {
  args: {
    label: "Label",
    showTriggerChevron: true,
  },
};

export const Headline = {
  args: {
    showCloseButton: true,
    headline: "Headline",
  },
};

export const CheckboxGroup = {
  render: (args) => ({
    components: { DpsActionMenu, DpsFormCheckboxGroup },
    setup() {
      return { args };
    },
    data() {
      return {
        selected: ["opt-4"],
      };
    },
    template: `
      <DpsActionMenu v-bind="args" style="padding-bottom: 300px;">
        <DpsFormCheckboxGroup
          v-model="selected"
          :options="[
            { label: 'Option 1', value: 'opt-1' },
            { label: 'Option 2', value: 'opt-2', disabled: true },
            { label: 'Option 3', value: 'opt-3' },
            { label: 'Option 4', value: 'opt-4' },
          ]" 
        />
      </DpsActionMenu>
    `,
  }),
  args: {
    autoClose: false,
  },
};

export const RadioGroup = {
  render: (args) => ({
    components: { DpsActionMenu, DpsFormRadioGroup },
    setup() {
      return { args };
    },
    data() {
      return {
        selected: "opt-4",
      };
    },
    template: `
      <DpsActionMenu v-bind="args" style="padding-bottom: 300px;">
        <DpsFormRadioGroup  
          v-model="selected"
          name="radio-group"
          :options="[
            { label: 'Option 1', value: 'opt-1' },
            { label: 'Option 2', value: 'opt-2', disabled: true },
            { label: 'Option 3', value: 'opt-3' },
            { label: 'Option 4', value: 'opt-4' },
          ]" 
        />
      </DpsActionMenu>
    `,
  }),
  args: {
    autoClose: false,
  },
};

export const CustomTrigger = {
  render: (args) => ({
    components: { DpsActionMenu, DpsActionMenuItem },
    setup() {
      return { args };
    },
    template: `
      <DpsActionMenu v-bind="args" style="padding-bottom: 300px;">
        <template #trigger>
          <button
            :id="args.id"
            type="button"
            data-bs-toggle="dropdown"
            data-bs-offset="0,10"
            data-bs-auto-close="outside"
            aria-expanded="false"
          >
            Custom Trigger
          </button>
        </template>

        <DpsActionMenuItem>
          Simple
        </DpsActionMenuItem>
        <DpsActionMenuItem icon="download">
          Herunterladen
        </DpsActionMenuItem>
        <DpsActionMenuItem icon="create" href="#">
          Bearbeiten
        </DpsActionMenuItem>
        <DpsActionMenuItem icon="veroeffentlichen" disabled>
          Veröffentlichen
        </DpsActionMenuItem>
        <DpsActionMenuItem icon="delete" danger>
          Löschen
        </DpsActionMenuItem>
      </DpsActionMenu>
    `,
  }),
  args: {
    id: "custom-trigger",
  },
};
