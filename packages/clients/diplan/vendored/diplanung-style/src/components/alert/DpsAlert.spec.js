import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsAlert from "@/components/alert/DpsAlert.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsAlert", () => {
  const variants = [undefined, "info", "warning", "success", "error"];
  const icons = {
    info: "information",
    warning: "warning",
    success: "success",
    error: "warning",
  };

  const wrapper = mount(DpsAlert, {
    slots: {
      default: "Test",
    },
  });

  test("builds", () => {
    expect(wrapper).toBeTruthy();
  });

  test("matches snapshot", () => {
    expect(wrapper.wrapperElement).toMatchSnapshot();
  });

  describe("Template:", () => {
    describe("heading='Heading'", () => {
      const wrapper = mount(DpsAlert, {
        props: {
          heading: "Heading",
        },
        slots: {
          default: "Test",
        },
      });

      test("Header shows the specified content", () => {
        const header = wrapper.find(".dps-alert__content-header");

        expect(header.exists()).toBe(true);

        expect(header.text()).toBe(wrapper.props().heading);
      });
    });

    describe.each(variants)("variant='%s'", (variant) => {
      const wrapper = mount(DpsAlert, {
        props: {
          variant: variant,
        },
        slots: {
          default: "Test",
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes(variant ? "dps-alert--" + variant : "dps-alert")).toBe(true);
      });

      test("Wrapper contains correct variant icon", () => {
        const variantIcon = wrapper.find(
          ".dps-alert__icon-wrapper > .dps-icon--" + (variant ? icons[variant] : "information"),
        );

        expect(variantIcon.exists()).toBe(true);
      });

      test("should hide icon if hideIcon prop is true", async () => {
        await wrapper.setProps({ hideIcon: true });

        const variantIcon = wrapper.find(
          ".dps-alert__icon-wrapper > .dps-icon--" + (variant ? icons[variant] : "information"),
        );

        expect(variantIcon.exists()).toBe(false);
      });
    });
  });
});
