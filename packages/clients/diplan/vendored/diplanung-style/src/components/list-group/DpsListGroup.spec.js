import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsListGroup from "@/components/list-group/DpsListGroup.vue";

describe("DpsListGroup", () => {
  const wrapper = mount(DpsListGroup, {
    slots: {
      default: "Test",
    },
  });

  test("builds", () => {
    expect(wrapper).toBeTruthy();
  });

  test("matches snapshot", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  describe("Template:", () => {
    describe("Counter slot", () => {
      const wrapper = mount(DpsListGroup, {
        slots: {
          counter: "3 Items",
        },
      });

      test("Counter shows the specified content", () => {
        const counterElement = wrapper.find(".dps-list-group__counter");

        expect(counterElement.exists()).toBe(true);

        expect(counterElement.text()).toBe("3 Items");
      });
    });

    describe("bordered='true'", () => {
      const wrapper = mount(DpsListGroup, {
        props: {
          bordered: true,
        },
      });

      test("Content element has necessary modifier CSS class", () => {
        const contentElement = wrapper.find(".dps-list-group__content");

        expect(contentElement.classes("dps-list-group__content--bordered")).toBe(true);
      });
    });

    describe("tag='ul'", () => {
      const wrapper = mount(DpsListGroup, {
        props: {
          tag: "ul",
        },
      });

      test("renders with correct tag when 'tag' prop is provided", () => {
        const contentElement = wrapper.find(".dps-list-group__content");

        expect(contentElement.exists()).toBe(true);

        expect(contentElement.element.tagName).toBe("UL");
      });
    });
  });
});
