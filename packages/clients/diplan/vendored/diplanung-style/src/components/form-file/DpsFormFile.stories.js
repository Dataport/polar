import DpsFormFile from "@/components/form-file/DpsFormFile.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/FormFile",
  component: DpsFormFile,
  render: (args) => ({
    components: { DpsFormFile },
    setup() {
      return { args };
    },
    data() {
      return {
        selected: null,
      };
    },
    template: `<div style="width: 500px">
      <DpsFormFile v-bind="args" v-model="selected" />
      <pre class="mt-4">Selected: {{ Array.isArray(selected) ? selected?.map((file) => file.name).join(", ") : selected?.name }}</pre>
    </div>`,
  }),
  parameters: {
    badges: [BADGE.EXPERIMENTAL],
  },
};

export default meta;

export const Default = {
  args: {},
};

export const Accept = {
  args: {
    accept: ".xml, application/pdf",
  },
};

export const Multiple = {
  args: {
    multiple: true,
  },
};

export const Disabled = {
  args: {
    disabled: true,
  },
};

export const Title = {
  args: {
    title: "Lorem ipsum dor atem",
  },
};

export const Error = {
  args: {
    error: true,
  },
};

export const Required = {
  render: (args) => ({
    components: { DpsFormFile },
    setup() {
      return { args };
    },
    data() {
      return {
        selected: undefined,
      };
    },
    template: `<div style="width: 500px">
      <form>
        <DpsFormFile v-bind="args" v-model="selected" />
        <button type="submit" class="mt-4">Absenden</button>
      </form>  
      <pre class="mt-4">Selected: {{ Array.isArray(selected) ? selected?.map((file) => file.name).join(", ") : selected?.name }}</pre>
    </div>`,
  }),
  args: {
    required: true,
  },
};
