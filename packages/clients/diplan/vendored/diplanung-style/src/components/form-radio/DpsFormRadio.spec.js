import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsFormRadio from "@/components/form-radio/DpsFormRadio.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsFormRadio", () => {
  const wrapper = mount(DpsFormRadio, {
    props: {
      id: "dps-form-radio-1",
      name: "DpsFormRadio",
      value: "Value",
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
      const wrapper = mount(DpsFormRadio, {
        props: {
          name: "Name",
          value: "Value",
        },
        slots: {
          default: "Label",
        },
      });

      test("Input has correct name attribute", () => {
        const input = wrapper.find(".dps-form-radio__input");

        expect(input.exists()).toBe(true);

        expect(input.attributes("name")).toBe(wrapper.props().name);
      });
    });

    describe("value='foo'", () => {
      const wrapper = mount(DpsFormRadio, {
        props: {
          name: "DpsFormRadio",
          value: "foo",
        },
        slots: {
          default: "Label",
        },
      });

      test("Input has correct name attribute", () => {
        const input = wrapper.find(".dps-form-radio__input");

        expect(input.exists()).toBe(true);

        expect(input.attributes("value")).toBe(wrapper.props().value);
      });
    });

    describe("disabled='true'", () => {
      const wrapper = mount(DpsFormRadio, {
        props: {
          name: "DpsFormRadio",
          value: "Value",
          disabled: true,
        },
        slots: {
          default: "Label",
        },
      });

      test("Input has necessary disabled attribute", () => {
        const input = wrapper.find(".dps-form-radio__input");

        expect(input.exists()).toBe(true);

        expect(input.attributes("disabled")).toBeDefined();
      });
    });

    describe("readonly='true'", () => {
      test.todo("disabled attr");
      test.todo("readonly attr");
    });

    describe("error='true'", () => {
      test.todo("wrapper .dps-radio--error");
    });

    describe("block='true'", () => {
      const wrapper = mount(DpsFormRadio, {
        props: {
          name: "DpsFormRadio",
          value: "Value",
          block: true,
        },
        slots: {
          default: "Label",
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-form-radio--block")).toBe(true);
      });
    });

    describe("truncate='true'", () => {
      const wrapper = mount(DpsFormRadio, {
        props: {
          name: "DpsFormRadio",
          value: "Value",
          truncate: true,
        },
        slots: {
          default: "Label",
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-form-radio--block")).toBe(true);
      });

      test("Label has necessary modifier CSS class", () => {
        const label = wrapper.find(".dps-form-radio__label");

        expect(label.exists()).toBe(true);

        expect(label.classes("dps-text--ellipse")).toBe(true);
      });
    });

    describe("hideLabel='true'", () => {
      const wrapper = mount(DpsFormRadio, {
        props: {
          name: "DpsFormRadio",
          value: "Value",
          hideLabel: true,
        },
        slots: {
          default: "Label",
        },
      });

      test("Label has necessary modifier CSS class", () => {
        const label = wrapper.find(".dps-form-radio__label");

        expect(label.exists()).toBe(true);

        expect(label.classes("dps-form-radio__label--input-only")).toBe(true);
      });

      test("Label is wrapped in an screenreader only element", () => {
        const label = wrapper.find(".dps-form-radio__label");
        const innerLabel = label.find(".sr-only");

        expect(label.exists()).toBe(true);

        expect(innerLabel.exists()).toBe(true);

        expect(innerLabel.text()).toBe("Label");
      });
    });
  });

  describe("Interactions:", () => {
    describe("update", () => {
      test.todo("DpsFormRadio");
    });
  });
});
