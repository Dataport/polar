import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsFormDatepicker from "@/components/form-datepicker/DpsFormDatepicker.vue";

describe("DpsFormDatepicker", () => {
  const wrapper = mount(DpsFormDatepicker, {
    props: {},
    slots: {},
    global: {},
  });

  test("builds", () => {
    expect(wrapper).toBeTruthy();
  });

  test("matches snapshot", () => {
    expect(wrapper.wrapperElement).toMatchSnapshot();
  });

  describe("Template:", () => {
    test("renders the checkbox when `hasCheckbox` prop is true", async () => {
      await wrapper.setProps({ hasCheckbox: true });
      await wrapper.setData({ isOpenDatepicker: true });
      const checkbox = wrapper.findComponent({ name: "DpsFormCheckbox" });

      expect(checkbox.exists()).toBe(true);
    });

    test("does not render the checkbox when `hasCheckbox` prop is false", async () => {
      await wrapper.setProps({ hasCheckbox: false });
      const checkbox = wrapper.findComponent({ name: "DpsFormCheckbox" });

      expect(checkbox.exists()).toBe(false);
    });

    test("renders the placeholder when no date is selected", () => {
      const input = wrapper.find("input");

      expect(input.attributes("placeholder")).toBe("TT.MM.JJJJ");
    });
  });

  describe("Interactions:", () => {
    test("updates the checkbox state when clicked", async () => {
      await wrapper.setProps({ hasCheckbox: true });
      const checkbox = wrapper.findComponent({ name: "DpsFormCheckbox" });

      await checkbox.setValue(true);
      expect(wrapper.vm.isChecked).toBe(true);

      await checkbox.setValue(false);
      expect(wrapper.vm.isChecked).toBe(false);
    });

    test("emits the correct date on `handleChange`", async () => {
      const selectedDates = "2024-09-01"; // ISO 8601 Format

      await wrapper.vm.handleChange(selectedDates);
      expect(wrapper.emitted("date-picker-value")[0]).toEqual(["01.09.2024"]);
    });
  });
});
