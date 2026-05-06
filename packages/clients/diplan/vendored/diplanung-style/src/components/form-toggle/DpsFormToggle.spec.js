import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsFormToggle from "@/components/form-toggle/DpsFormToggle.vue";

describe("DpsFormToggle", () => {
  // Utility function to create a wrapper
  const createWrapper = (props = {}, slots = {}) => {
    return mount(DpsFormToggle, {
      props,
      slots,
    });
  };

  test("builds", () => {
    const wrapper = createWrapper();

    expect(wrapper).toBeTruthy();
  });

  test("matches snapshot", () => {
    const wrapper = createWrapper();

    expect(wrapper.wrapperElement).toMatchSnapshot();
  });

  describe("Template:", () => {
    test("renders a checkbox input", () => {
      const wrapper = createWrapper();
      const input = wrapper.find("input[type='checkbox']");

      expect(input.exists()).toBe(true);
    });

    test("renders the label slot when provided", () => {
      const wrapper = createWrapper({}, { default: "Test Label" });
      const label = wrapper.find(".dps-form-toggle__label");

      expect(label.exists()).toBe(true);
      expect(label.text()).toBe("Test Label");
    });

    test("applies size class based on prop", () => {
      const wrapper = createWrapper({ size: "sm" });
      const slider = wrapper.find(".dps-form-toggle__slider");

      expect(slider.classes()).toContain("dps-form-toggle__slider--size-sm");
    });
  });

  describe("Interactions:", () => {
    test("emits update:modelValue event on toggle change", async () => {
      const wrapper = createWrapper();
      const input = wrapper.find("input[type='checkbox']");

      await input.setChecked(true);

      expect(wrapper.emitted()["update:modelValue"]).toBeTruthy();
      expect(wrapper.emitted()["update:modelValue"][0]).toEqual([true]);
    });

    test("updates modelValue prop when input is toggled", async () => {
      const wrapper = createWrapper({ modelValue: false });
      const input = wrapper.find("input[type='checkbox']");

      expect(input.element.checked).toBe(false);

      await input.setChecked(true);

      expect(wrapper.emitted()["update:modelValue"]).toBeTruthy();
      expect(wrapper.emitted()["update:modelValue"][0]).toEqual([true]);
    });

    test("disables input when disabled prop is true", () => {
      const wrapper = createWrapper({ disabled: true });
      const input = wrapper.find("input[type='checkbox']");

      expect(input.element.disabled).toBe(true);
    });

    test("applies aria-label and aria-labelledby correctly", () => {
      const wrapper = createWrapper({
        ariaLabel: "Toggle this option",
        ariaLabelledby: "toggle-label",
      });
      const input = wrapper.find("input[type='checkbox']");

      expect(input.attributes("aria-label")).toBe("Toggle this option");
      expect(input.attributes("aria-labelledby")).toBe("toggle-label");
    });

    test("applies aria-describedby correctly", () => {
      const wrapper = createWrapper({
        ariaDescribedby: "toggle-description",
      });
      const input = wrapper.find("input[type='checkbox']");

      expect(input.attributes("aria-describedby")).toBe("toggle-description");
    });
  });

  describe("Props Handling:", () => {
    test("id prop is applied correctly to input", () => {
      const wrapper = createWrapper({ id: "toggle-id" });
      const input = wrapper.find("input[type='checkbox']");

      expect(input.attributes("id")).toBe("toggle-id");
    });

    test("title prop is applied as a tooltip", () => {
      const wrapper = createWrapper({ title: "Toggle title" });
      const input = wrapper.find(".dps-form-toggle__container");

      expect(input.attributes("title")).toBe("Toggle title");
    });
  });
});
