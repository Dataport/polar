import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsFormCheckboxGroup from "@/components/form-checkbox-group/DpsFormCheckboxGroup.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsFormCheckboxGroup", () => {
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

  const wrapper = mount(DpsFormCheckboxGroup, {
    props: {
      id: "test",
      options: options,
    },
    global: {
      stubs: {
        DpsFormCheckbox: true,
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
      const wrapper = mount(DpsFormCheckboxGroup, {
        props: {
          options: options,
          label: "Label",
        },
        global: {
          stubs: {
            DpsFormCheckbox: true,
          },
        },
      });
      const labelElement = wrapper.find(".dps-label");

      test("Wrapper contains a label", () => {
        expect(labelElement.exists()).toBe(true);

        expect(labelElement.text()).toBe(wrapper.props().label);
      });
    });

    describe("name='dps-checkbox-test'", () => {
      const wrapper = mount(DpsFormCheckboxGroup, {
        props: {
          options: options,
          label: "Label",
          name: "dps-checkbox-test",
        },
        global: {
          stubs: {
            DpsFormCheckbox: true,
          },
        },
      });

      test("DpsFormCheckbox components have the correct 'name' attribute", () => {
        const checkboxes = wrapper.findAllComponents({
          name: "DpsFormCheckbox",
        });
        let valid = true;

        for (const checkbox of checkboxes) {
          if (checkbox.attributes("name") !== wrapper.props().name) {
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

      const wrapper = mount(DpsFormCheckboxGroup, {
        props: {
          options: customOptions,
          optionValue: "code",
        },
        global: {
          stubs: {
            DpsFormCheckbox: true,
          },
        },
      });

      test("DpsFormCheckbox components have the correct 'value' attribute", () => {
        const checkboxes = wrapper.findAllComponents({
          name: "DpsFormCheckbox",
        });
        let valid = true;

        checkboxes.forEach((checkbox, index) => {
          if (checkbox.attributes("value") !== customOptions[index].code) {
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

      const wrapper = mount(DpsFormCheckboxGroup, {
        props: {
          options: customOptions,
          optionLabel: "name",
        },
      });

      test("DpsFormCheckbox components have the correct 'value' attribute", () => {
        const checkboxes = wrapper.findAllComponents({
          name: "DpsFormCheckbox",
        });
        let valid = true;

        checkboxes.forEach((checkbox, index) => {
          if (checkbox.text() !== customOptions[index].name) {
            valid = false;
          }
        });

        expect(valid).toBe(true);
      });
    });

    describe("disabled='true'", () => {
      const wrapper = mount(DpsFormCheckboxGroup, {
        props: {
          options: options,
          disabled: true,
        },
        global: {
          stubs: {
            DpsFormCheckbox: true,
          },
        },
      });

      test("DpsFormCheckbox components have the correct 'disabled' attribute", () => {
        const checkboxes = wrapper.findAllComponents({
          name: "DpsFormCheckbox",
        });
        let valid = true;

        for (const checkbox of checkboxes) {
          if (checkbox.attributes("disabled") !== "true") {
            valid = false;
          }
        }

        expect(valid).toBe(true);
      });
    });

    describe("inline='true'", () => {
      const wrapper = mount(DpsFormCheckboxGroup, {
        props: {
          options: options,
          inline: true,
        },
        global: {
          stubs: {
            DpsFormCheckbox: true,
          },
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-form-checkbox-group--inline")).toBe(true);
      });

      test("DpsFormCheckbox components have the correct 'block' attribute", () => {
        const checkboxes = wrapper.findAllComponents({
          name: "DpsFormCheckbox",
        });
        let valid = true;

        for (const checkbox of checkboxes) {
          if (checkbox.attributes("block") !== "false") {
            valid = false;
          }
        }

        expect(valid).toBe(true);
      });
    });

    describe("truncate='true'", () => {
      const wrapper = mount(DpsFormCheckboxGroup, {
        props: {
          options: options,
          truncate: true,
        },
        global: {
          stubs: {
            DpsFormCheckbox: true,
          },
        },
      });

      test("DpsFormCheckbox components have the correct 'truncate' attribute", () => {
        const checkboxes = wrapper.findAllComponents({
          name: "DpsFormCheckbox",
        });
        let valid = true;

        for (const checkbox of checkboxes) {
          if (checkbox.attributes("truncate") !== "true") {
            valid = false;
          }
        }

        expect(valid).toBe(true);
      });
    });
  });

  describe("Interactions:", () => {
    describe("update", () => {
      test.todo("DpsFormCheckboxGroup");
    });
  });
});
