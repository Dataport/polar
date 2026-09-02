import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsFormCheckbox from "@/components/form-checkbox/DpsFormCheckbox.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsFormCheckbox", () => {
  const wrapper = mount(DpsFormCheckbox, {
    props: {
      id: "dps-form-checkbox-1",
    },
    slots: {
      default: "Label",
    },
  });

  test("builds", () => {
    expect(wrapper).toBeTruthy();
  });

  test("matches snapshot", () => {
    expect(wrapper.wrapperElement).toMatchSnapshot();
  });

  describe("Template:", () => {
    describe("name='Name'", () => {
      const wrapper = mount(DpsFormCheckbox, {
        props: {
          name: "Name",
        },
        slots: {
          default: "Label",
        },
      });

      test("Input has correct name attribute", () => {
        const input = wrapper.find(".dps-form-checkbox__input");

        expect(input.exists()).toBe(true);

        expect(input.attributes("name")).toBe(wrapper.props().name);
      });
    });

    describe("value='foo'", () => {
      const wrapper = mount(DpsFormCheckbox, {
        props: {
          value: "foo",
        },
        slots: {
          default: "Label",
        },
      });

      test("Input has correct name attribute", () => {
        const input = wrapper.find(".dps-form-checkbox__input");

        expect(input.exists()).toBe(true);

        expect(input.attributes("value")).toBe(wrapper.props().value);
      });
    });

    describe("tooltip='Tooltip'", () => {
      const wrapper = mount(DpsFormCheckbox, {
        props: {
          tooltip: "Tooltip",
        },
        slots: {
          default: "Label",
        },
      });

      test("Label has correct title attribute", () => {
        const label = wrapper.find(".dps-form-checkbox__label");

        expect(label.exists()).toBe(true);

        expect(label.attributes("title")).toBe(wrapper.props().tooltip);
      });
    });

    describe("disabled='true'", () => {
      const wrapper = mount(DpsFormCheckbox, {
        props: {
          disabled: true,
        },
        slots: {
          default: "Label",
        },
      });

      test("Input has necessary disabled attribute", () => {
        const input = wrapper.find(".dps-form-checkbox__input");

        expect(input.exists()).toBe(true);

        expect(input.attributes("disabled")).toBeDefined();
      });
    });

    describe("readonly='true'", () => {
      test.todo("disabled attr");
      test.todo("readonly attr");
    });

    describe("error='true'", () => {
      test.todo("wrapper .dps-checkbox--error");
    });

    describe("block='true'", () => {
      const wrapper = mount(DpsFormCheckbox, {
        props: {
          block: true,
        },
        slots: {
          default: "Label",
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-form-checkbox--block")).toBe(true);
      });
    });

    describe("truncate='true'", () => {
      const wrapper = mount(DpsFormCheckbox, {
        props: {
          truncate: true,
        },
        slots: {
          default: "Label",
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-form-checkbox--block")).toBe(true);
      });

      test("Label has necessary modifier CSS class", () => {
        const label = wrapper.find(".dps-form-checkbox__label");

        expect(label.exists()).toBe(true);

        expect(label.classes("dps-text--ellipse")).toBe(true);
      });
    });

    describe("hideLabel='true'", () => {
      const wrapper = mount(DpsFormCheckbox, {
        props: {
          hideLabel: true,
        },
        slots: {
          default: "Label",
        },
      });

      test("Label has necessary modifier CSS class", () => {
        const label = wrapper.find(".dps-form-checkbox__label");

        expect(label.exists()).toBe(true);

        expect(label.classes("dps-form-checkbox__label--input-only")).toBe(true);
      });

      test("Label is wrapped in an screenreader only element", () => {
        const label = wrapper.find(".dps-form-checkbox__label");
        const innerLabel = label.find(".sr-only");

        expect(label.exists()).toBe(true);

        expect(innerLabel.exists()).toBe(true);

        expect(innerLabel.text()).toBe("Label");
      });
    });
  });

  describe("Interactions:", () => {
    test("Click on an unchecked element emits the correct update:modelValue event", async () => {
      const wrapper = mount(DpsFormCheckbox, {
        props: {
          modelValue: false,
        },
        slots: {
          default: "Label",
        },
      });
      const inputElement = wrapper.find(".dps-form-checkbox__input");

      expect(inputElement.exists()).toBe(true);

      await inputElement.trigger("change");

      expect(wrapper.emitted()["update:modelValue"]).toEqual([[true]]);
    });

    test("Click on a checked element emits the correct update:modelValue event", async () => {
      const wrapper = mount(DpsFormCheckbox, {
        props: {
          modelValue: true,
        },
        slots: {
          default: "Label",
        },
      });
      const inputElement = wrapper.find(".dps-form-checkbox__input");

      expect(inputElement.exists()).toBe(true);

      await inputElement.trigger("change");

      expect(wrapper.emitted()["update:modelValue"]).toEqual([[false]]);
    });
  });
});
