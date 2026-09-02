import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsAlphabeticFilter from "@/components/alphabetic-filter/DpsAlphabeticFilter.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsAlphabeticFilter", () => {
  const wrapper = mount(DpsAlphabeticFilter, {
    props: {},
  });

  test("builds", () => {
    expect(wrapper).toBeTruthy();
  });

  test("matches snapshot", () => {
    expect(wrapper.wrapperElement).toMatchSnapshot();
  });

  describe("Template:", () => {
    describe("disabled='true'", () => {
      const wrapper = mount(DpsAlphabeticFilter, {
        props: {
          disabled: true,
        },
      });

      test("Buttons have disabled attribute", () => {
        const buttons = wrapper.findAll(".dps-alphabetic-filter__option-button");

        buttons.forEach((button) => {
          expect(button.attributes("disabled")).toBeDefined();
        });
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-alphabetic-filter--disabled")).toBe(true);
      });
    });
  });

  describe("Interactions:", () => {
    describe("required='false'", () => {
      const wrapper = mount(DpsAlphabeticFilter, {
        props: {
          required: true,
          modelValue: "A-G",
        },
      });
      const button = wrapper.findAll(".dps-alphabetic-filter__option-button")[2];

      test("Click on an option emits the update:modelValue event", async () => {
        await button.trigger("click");

        expect(wrapper.emitted()["update:modelValue"]).toBeTruthy();
      });

      test("Click on an active option emits the update:modelValue event", async () => {
        await button.trigger("click");

        expect(wrapper.emitted()["update:modelValue"]).toBeTruthy();
      });
    });

    describe("required='true'", () => {
      const wrapper = mount(DpsAlphabeticFilter, {
        props: {
          required: true,
        },
      });
      const button = wrapper.findAll(".dps-alphabetic-filter__option-button")[2];

      test("Click on an option emits the update:modelValue event", async () => {
        await button.trigger("click");

        expect(wrapper.emitted()["update:modelValue"]).toBeTruthy();
      });

      test("Click on an active option emits the update:modelValue event", async () => {
        await button.trigger("click");

        expect(wrapper.emitted()["update:modelValue"]).toEqual([["O-U"], ["O-U"]]);
      });
    });

    describe("disabled='true'", () => {
      const wrapper = mount(DpsAlphabeticFilter, {
        props: {
          disabled: true,
        },
      });
      const button = wrapper.findAll(".dps-alphabetic-filter__option-button")[2];

      test("Click on an option does not emit the update:modelValue event", async () => {
        await button.trigger("click");

        expect(wrapper.emitted()["update:modelValue"]).toBeFalsy();
      });
    });
  });
});
