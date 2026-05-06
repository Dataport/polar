import DpsFormGroup from "@/components/form-group/DpsFormGroup.vue";
import DpsFormInput from "@/components/form-input/DpsFormInput.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/FormGroup",
  component: DpsFormGroup,
  render: (args) => ({
    components: { DpsFormGroup, DpsFormInput },
    setup() {
      return { args };
    },
    template: `
      <DpsFormGroup 
        v-bind="args" 
        v-slot="{ slotProps }"
      >
        <DpsFormInput 
          :id="args.id + '__form-input'" 
          placeholder="Placeholder"
          :success="slotProps.success" 
          :error="slotProps.error" 
          :disabled="slotProps.disabled"
          :aria-describedby="slotProps.ariaDescribedby"
        />
      </DpsFormGroup>
    `,
  }),
  parameters: {
    badges: [BADGE.STABLE],
  },
};

export default meta;

export const Default = {
  args: {
    id: "fieldset-1",
    label: "Label",
    labelFor: "fieldset-1__form-input",
    successFeedback: "Success feedback",
    errorFeedback: "Error feedback",
  },
};

export const Description = {
  args: {
    ...Default.args,
    id: "fieldset-2",
    labelFor: "fieldset-2__form-input",
    description: "Description",
  },
};

export const Success = {
  args: {
    ...Default.args,
    id: "fieldset-3",
    labelFor: "fieldset-3__form-input",
    valid: true,
  },
};

export const Error = {
  args: {
    ...Default.args,
    id: "fieldset-4",
    labelFor: "fieldset-4__form-input",
    valid: false,
  },
};

export const WithValidation = {
  render: (args) => ({
    components: { DpsFormGroup, DpsFormInput },
    setup() {
      return { args };
    },
    data() {
      return {
        text: "",
      };
    },
    computed: {
      valid() {
        if (this.text !== "") {
          return this.text.length > 3;
        }

        return undefined;
      },
    },
    template: `
      <DpsFormGroup 
        v-bind="args" 
        v-slot="{ slotProps }"
        :valid="valid"
      >
        <DpsFormInput 
          v-model="text"
          :id="args.id + '__form-input'"
          placeholder="Placeholder"
          :success="slotProps.success" 
          :error="slotProps.error" 
          :disabled="slotProps.disabled"
          :aria-describedby="slotProps.ariaDescribedby"
        />
      </DpsFormGroup>
    `,
  }),
  args: {
    ...Default.args,
    id: "fieldset-5",
    labelFor: "fieldset-5__form-input",
    successFeedback: "You're good to go!",
    errorFeedback: "Enter at least 4 characters.",
  },
};

export const Disabled = {
  args: {
    ...Default.args,
    id: "fieldset-6",
    labelFor: "fieldset-6__form-input",
    disabled: true,
  },
};
