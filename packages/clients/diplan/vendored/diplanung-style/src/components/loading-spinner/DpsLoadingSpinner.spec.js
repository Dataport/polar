import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsLoadingSpinner from "@/components/loading-spinner/DpsLoadingSpinner.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsLoadingSpinner", () => {
  const wrapper = mount(DpsLoadingSpinner, {
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
    test("renders the component", () => {
      const wrapper = mount(DpsLoadingSpinner);

      expect(wrapper.classes()).toContain("dps-loading-spinner");
      expect(wrapper.attributes("aria-busy")).toBe("true");
      expect(wrapper.attributes("aria-label")).toBe("Laden");
    });

    test("contains the loading animation span", () => {
      const wrapper = mount(DpsLoadingSpinner);
      const icon = wrapper.find(".dps-icon--ladeanimation");

      expect(icon.exists()).toBe(true);
    });
  });
});
