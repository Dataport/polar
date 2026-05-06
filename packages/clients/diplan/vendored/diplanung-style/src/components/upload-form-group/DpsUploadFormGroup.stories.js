import DpsUploadFormGroup from "@/components/upload-form-group/DpsUploadFormGroup.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";

const meta = {
  title: "Vue/UploadFormGroup",
  component: DpsUploadFormGroup,
  argTypes: {
    onUpload: { action: "upload" },
  },
  render: (args) => ({
    components: { DpsUploadFormGroup },
    setup() {
      return { args };
    },
    data() {
      return {
        selected: undefined,
      };
    },
    template: `<div style="width: 500px">
      <DpsUploadFormGroup v-bind="args" @input="(files) => selected = files" />
      <pre class="mt-4">Selected: {{ selected?.map((file) => file?.name)?.join(", ") }}</pre>
    </div>`,
  }),
  parameters: {
    badges: [BADGE.EXPERIMENTAL],
  },
};

export default meta;

export const Default = {
  args: {
    label: "Label",
  },
};

export const HideLabel = {
  args: {
    label: "Label",
    hideLabel: true,
  },
};

export const UploadButtonLabel = {
  args: {
    label: "Label",
    uploadButtonLabel: "Lorem ipsum",
  },
};

export const UploadButtonTitle = {
  args: {
    label: "Label",
    uploadButtonTitle: "Beispieltitel",
  },
};

export const Title = {
  args: {
    label: "Label",
    title: "Lorem ipsum dor atem",
  },
};

export const Disabled = {
  args: {
    label: "Label",
    disabled: true,
  },
};

export const DisableUploadButton = {
  args: {
    label: "Label",
    disableUploadButton: true,
  },
};

export const FileAccept = {
  args: {
    label: "Label",
    fileAccept: [".xml", "application/pdf"],
  },
};

export const FileMultiple = {
  args: {
    label: "Label",
    fileMultiple: true,
  },
};

export const HideUploadButton = {
  args: {
    label: "Label",
    hideUploadButton: true,
  },
};

export const FileRequired = {
  render: (args) => ({
    components: { DpsUploadFormGroup },
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
        <DpsUploadFormGroup v-bind="args" @input="(files) => selected = files" />
        <button type="submit" class="mt-4">Absenden</button>
      </form>
      <pre class="mt-4">Selected: {{ selected?.map((file) => file?.name)?.join(", ") }}</pre>
    </div>`,
  }),
  args: {
    label: "Label",
    hideUploadButton: true,
    fileRequired: true,
  },
};

export const UploadErrorMessage = {
  args: {
    label: "Label",
    accept: [".xml", "application/pdf"],
    uploadErrorMessage: "Fehlermeldung: Lorem ipsum dor atem\nFehler ID: 1234567890",
  },
};
