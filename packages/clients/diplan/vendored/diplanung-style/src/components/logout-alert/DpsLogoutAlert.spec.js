import { describe, test, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import DpsLogoutAlert from "@/components/logout-alert/DpsLogoutAlert.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsLogoutAlert", () => {
  const defaultThreshold = 3;
  const wrapper = mount(DpsLogoutAlert, {
    props: {
      expirationTime: Date.now() / 1000 + 30,
    },
  });

  test("builds", () => {
    expect(wrapper).toBeTruthy();
  });

  test("matches snapshot", () => {
    expect(wrapper.wrapperElement).toMatchSnapshot();
  });

  describe("Template:", () => {
    describe("Before expiration", () => {
      const wrapper = mount(DpsLogoutAlert, {
        props: {
          expirationTime: Date.now() / 1000 + 30,
        },
      });

      test("DpsAlert is in template", () => {
        expect(wrapper.classes("dps-logout-alert")).toBe(true);
      });

      test("Template includes '1 Minute'", () => {
        expect(wrapper.text().includes("1 Minute")).toBe(true);
      });
    });

    describe("After expiration", () => {
      const wrapper = mount(DpsLogoutAlert, {
        props: {
          expirationTime: Date.now() / 1000 - 30,
        },
      });

      test("DpsAlert is in template", () => {
        expect(wrapper.classes("dps-logout-alert")).toBe(true);
      });

      test("Template includes 'Kürze'", () => {
        expect(wrapper.text().includes("Kürze")).toBe(true);
      });
    });

    describe("Before hitting the threshold", () => {
      const wrapper = mount(DpsLogoutAlert, {
        props: {
          expirationTime: Date.now() / 1000 + defaultThreshold * 60 + 30,
        },
      });

      test("DpsAlert is not in template", () => {
        expect(wrapper.classes("dps-logout-alert")).toBe(false);
      });
    });

    describe("threshold='10'", () => {
      const wrapper = mount(DpsLogoutAlert, {
        props: {
          expirationTime: Date.now() / 1000 + 9 * 60,
          threshold: 10,
        },
      });

      test("Template includes '9 Minuten'", () => {
        expect(wrapper.text().includes("9 Minuten")).toBe(true);
      });
    });
  });

  describe("Interactions:", () => {
    const wrapper = mount(DpsLogoutAlert, {
      props: {
        expirationTime: Date.now() / 1000 + 30,
        threshold: 10,
      },
    });

    test("Click on 'Neu anmelden' button emits the click event", async () => {
      const button = wrapper.find(".dps-logout-alert__logout-button");

      expect(button.exists()).toBe(true);

      await button.trigger("click");

      expect(wrapper.emitted().click).toBeTruthy();
    });

    test("updated expirationTime", async () => {
      await wrapper.setProps({
        expirationTime: Date.now() / 1000 + 300,
      });

      await wrapper.vm.$nextTick();

      expect(wrapper.text().includes("5 Minuten")).toBe(true);
    });

    test("Interval is cleared on unmount", () => {
      // eslint-disable-next-line no-undef
      const clearIntervalSpy = vi.spyOn(global, "clearInterval");

      expect(wrapper.vm.interval).not.toBeNull();

      wrapper.unmount();

      expect(clearIntervalSpy).toHaveBeenCalledWith(wrapper.vm.interval);

      clearIntervalSpy.mockRestore();
    });
  });
});
