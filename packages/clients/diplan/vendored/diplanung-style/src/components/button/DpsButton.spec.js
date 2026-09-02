import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsButton from "@/components/button/DpsButton.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsButton", () => {
  const variants = ["secondary", "link"];
  const sizes = ["sm", "lg"];

  const wrapper = mount(DpsButton, {
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
    describe("type='submit'", () => {
      const wrapper = mount(DpsButton, {
        props: {
          type: "submit",
        },
        slots: {
          default: "Test",
        },
      });

      test("Wrapper has correct type attribute ", () => {
        expect(wrapper.attributes("type")).toBe(wrapper.props().type);
      });
    });

    describe("href='test.html'", () => {
      const wrapper = mount(DpsButton, {
        props: {
          href: "test.html",
        },
        slots: {
          default: "Test",
        },
      });

      test("Wrapper has no type attribute", () => {
        expect(wrapper.attributes("type")).toBeUndefined();
      });

      test("Wrapper has correct href attribute", () => {
        expect(wrapper.attributes("href")).toBe(wrapper.props().href);
      });

      test("Wrapper has correct tag", () => {
        expect(wrapper.element.tagName).toBe("A");
      });
    });

    describe("disabled='true'", () => {
      const wrapper = mount(DpsButton, {
        props: {
          disabled: true,
        },
        slots: {
          default: "Test",
        },
      });

      test("Wrapper has necessary disabled attribute", () => {
        expect(wrapper.attributes("disabled")).toBeDefined();
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-button--disabled")).toBe(true);
      });
    });

    describe("loading='true'", () => {
      const wrapper = mount(DpsButton, {
        props: {
          loading: true,
        },
        slots: {
          default: "Test",
        },
      });

      test("Wrapper has necessary disabled attribute", () => {
        expect(wrapper.attributes("disabled")).toBeDefined();
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-button--loading")).toBe(true);
      });

      test("Loading spinner is rendered correctly", () => {
        const buttonIcon = wrapper.find(".dps-icon");

        expect(buttonIcon.exists()).toBe(true);

        expect(buttonIcon.classes("dps-icon--ladeanimation")).toBe(true);
      });

      test("Loading spinner has correct role", () => {
        const buttonIcon = wrapper.find(".dps-icon");

        expect(buttonIcon.exists()).toBe(true);

        expect(buttonIcon.attributes("role")).toBe("status");
      });

      test("Loading spinner replaces the defined icon", () => {
        const buttonIcon = wrapper.find(".dps-icon");

        wrapper.setProps({ icon: "placeholder" });

        expect(buttonIcon.exists()).toBe(true);

        expect(buttonIcon.classes("dps-icon--" + wrapper.props().icon)).toBe(false);

        expect(buttonIcon.classes("dps-icon--ladeanimation")).toBe(true);
      });
    });

    describe.each(variants)("variant='%s'", (variant) => {
      const wrapper = mount(DpsButton, {
        props: {
          variant: variant,
        },
        slots: {
          default: "Test",
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-button--" + variant)).toBe(true);
      });
    });

    describe.each(sizes)("size='%s'", (size) => {
      const wrapper = mount(DpsButton, {
        props: {
          size: size,
        },
        slots: {
          default: "Test",
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-button--size-" + size)).toBe(true);
      });
    });

    describe("squared='true'", () => {
      const wrapper = mount(DpsButton, {
        props: {
          squared: true,
        },
        slots: {
          default: "Test",
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-button--squared")).toBe(true);
      });
    });

    describe("icon='placeholder'", () => {
      const wrapper = mount(DpsButton, {
        props: {
          icon: "placeholder",
        },
        slots: {
          default: "Test",
        },
      });

      test("Icon is rendered", () => {
        const buttonIcon = wrapper.find(".dps-icon");

        expect(buttonIcon.exists()).toBe(true);

        expect(buttonIcon.classes("dps-icon--placeholder")).toBe(true);
      });
    });

    describe("iconPosition='end'", () => {
      const wrapper = mount(DpsButton, {
        props: {
          icon: "placeholder",
          iconPosition: "end",
        },
        slots: {
          default: "Test",
        },
      });

      test("Icon is positioned at the end of the text", () => {
        const buttonIcon = wrapper.find(".dps-button__text + .dps-icon");

        expect(buttonIcon.exists()).toBe(true);

        expect(buttonIcon.classes("dps-icon--placeholder")).toBe(true);
      });
    });

    describe("noPadding='true'", () => {
      const wrapper = mount(DpsButton, {
        props: {
          noPadding: true,
        },
        slots: {
          default: "Test",
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-button--no-padding")).toBe(true);
      });
    });
  });

  describe("Interactions:", () => {
    describe("Click", () => {
      const wrapper = mount(DpsButton, {
        props: {},
        slots: {
          default: "Test",
        },
      });

      test("Click on the element emits the click event", async () => {
        await wrapper.trigger("click");

        expect(wrapper.emitted().click).toBeTruthy();
      });

      describe("disabled='true'", () => {
        const wrapper = mount(DpsButton, {
          props: {
            disabled: true,
          },
          slots: {
            default: "Test",
          },
        });

        test("Click on disabled element does not emit the click event", async () => {
          await wrapper.trigger("click");

          expect(wrapper.emitted().click).toBeUndefined();
        });
      });
    });
  });
});
