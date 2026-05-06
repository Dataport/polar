import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsBadge from "@/components/badge/DpsBadge.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsBadge", () => {
  const wrapper = mount(DpsBadge, {
    props: {},
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
    const variants = ["info", "success", "warning", "error", "outline", "primary"];

    describe.each(variants)("variant='%s'", (variant) => {
      const wrapper = mount(DpsBadge, {
        props: {
          variant: variant,
        },
        slots: {
          default: "Test",
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-badge--" + variant)).toBe(true);
      });
    });

    describe("rounded='true'", () => {
      const wrapper = mount(DpsBadge, {
        props: {
          rounded: true,
        },
        slots: {
          default: "Test",
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-badge--rounded")).toBe(true);
      });
    });
  });
});
