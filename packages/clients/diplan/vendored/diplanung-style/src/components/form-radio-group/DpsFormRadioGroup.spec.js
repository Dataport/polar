import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsFormRadioGroup from "@/components/form-radio-group/DpsFormRadioGroup.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsFormRadioGroup", () => {
  const options = [
    {
      value: "opt-1",
      label: "Option 1",
    },
    {
      value: "opt-2",
      label: "Option 2",
    },
    {
      value: "opt-3",
      label: "Option 3",
    },
    {
      value: "opt-4",
      label: "Option 4",
    },
  ];

  const wrapper = mount(DpsFormRadioGroup, {
    props: {
      id: "test",
      name: "DpsFormRadioGroup",
      options: options,
    },
    global: {
      stubs: {
        DpsFormRadio: true,
      },
    },
  });

  test("builds", () => {
    expect(wrapper).toBeTruthy();
  });

  test("matches snapshot", () => {
    expect(wrapper.wrapperElement).toMatchSnapshot();
  });

  describe("Template:", () => {
    describe("label='Label'", () => {
      const wrapper = mount(DpsFormRadioGroup, {
        props: {
          name: "DpsFormRadioGroup",
          options: options,
          label: "Label",
        },
        global: {
          stubs: {
            DpsFormRadio: true,
          },
        },
      });
      const labelElement = wrapper.find(".dps-label");

      test("Wrapper contains a label", () => {
        expect(labelElement.exists()).toBe(true);

        expect(labelElement.text()).toBe(wrapper.props().label);
      });
    });

    describe("name='dps-radio-test'", () => {
      const wrapper = mount(DpsFormRadioGroup, {
        props: {
          options: options,
          label: "Label",
          name: "dps-radio-test",
        },
        global: {
          stubs: {
            DpsFormRadio: true,
          },
        },
      });

      test("DpsFormRadio components have the correct 'name' attribute", () => {
        const radios = wrapper.findAllComponents({ name: "DpsFormRadio" });
        let valid = true;

        for (const radio of radios) {
          if (radio.attributes("name") !== wrapper.props().name) {
            valid = false;
          }
        }

        expect(valid).toBe(true);
      });
    });

    describe("optionValue='code'", () => {
      const customOptions = [
        {
          code: "code-1",
          label: "Code 1",
        },
        {
          code: "code-2",
          label: "Code 2",
        },
        {
          code: "code-3",
          label: "Code 3",
        },
        {
          code: "code-4",
          label: "Code 4",
        },
      ];

      const wrapper = mount(DpsFormRadioGroup, {
        props: {
          name: "DpsFormRadioGroup",
          options: customOptions,
          optionValue: "code",
        },
        global: {
          stubs: {
            DpsFormRadio: true,
          },
        },
      });

      test("DpsFormRadio components have the correct 'value' attribute", () => {
        const radios = wrapper.findAllComponents({ name: "DpsFormRadio" });
        let valid = true;

        radios.forEach((radio, index) => {
          if (radio.attributes("value") !== customOptions[index].code) {
            valid = false;
          }
        });

        expect(valid).toBe(true);
      });
    });

    describe("optionLabel='name'", () => {
      const customOptions = [
        {
          value: "code-1",
          name: "Code 1",
        },
        {
          value: "code-2",
          name: "Code 2",
        },
        {
          value: "code-3",
          name: "Code 3",
        },
        {
          value: "code-4",
          name: "Code 4",
        },
      ];

      const wrapper = mount(DpsFormRadioGroup, {
        props: {
          name: "DpsFormRadioGroup",
          options: customOptions,
          optionLabel: "name",
        },
      });

      test("DpsFormRadio components have the correct 'value' attribute", () => {
        const radios = wrapper.findAllComponents({ name: "DpsFormRadio" });
        let valid = true;

        radios.forEach((radio, index) => {
          if (radio.text() !== customOptions[index].name) {
            valid = false;
          }
        });

        expect(valid).toBe(true);
      });
    });

    describe("disabled='true'", () => {
      const wrapper = mount(DpsFormRadioGroup, {
        props: {
          name: "DpsFormRadioGroup",
          options: options,
          disabled: true,
        },
        global: {
          stubs: {
            DpsFormRadio: true,
          },
        },
      });

      test("DpsFormRadio components have the correct 'disabled' attribute", () => {
        const radios = wrapper.findAllComponents({ name: "DpsFormRadio" });
        let valid = true;

        for (const radio of radios) {
          if (radio.attributes("disabled") !== "true") {
            valid = false;
          }
        }

        expect(valid).toBe(true);
      });
    });

    describe("inline='true'", () => {
      const wrapper = mount(DpsFormRadioGroup, {
        props: {
          name: "DpsFormRadioGroup",
          options: options,
          inline: true,
        },
        global: {
          stubs: {
            DpsFormRadio: true,
          },
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-form-radio-group--inline")).toBe(true);
      });

      test("DpsFormRadio components have the correct 'block' attribute", () => {
        const radios = wrapper.findAllComponents({ name: "DpsFormRadio" });
        let valid = true;

        for (const radio of radios) {
          if (radio.attributes("block") !== "false") {
            valid = false;
          }
        }

        expect(valid).toBe(true);
      });
    });

    describe("truncate='true'", () => {
      const wrapper = mount(DpsFormRadioGroup, {
        props: {
          name: "DpsFormRadioGroup",
          options: options,
          truncate: true,
        },
        global: {
          stubs: {
            DpsFormRadio: true,
          },
        },
      });

      test("DpsFormRadio components have the correct 'truncate' attribute", () => {
        const radios = wrapper.findAllComponents({ name: "DpsFormRadio" });
        let valid = true;

        for (const radio of radios) {
          if (radio.attributes("truncate") !== "true") {
            valid = false;
          }
        }

        expect(valid).toBe(true);
      });
    });
  });

  describe("Interactions:", () => {
    describe("update", () => {
      test.todo("DpsFormRadioGroup");
    });
  });
});
