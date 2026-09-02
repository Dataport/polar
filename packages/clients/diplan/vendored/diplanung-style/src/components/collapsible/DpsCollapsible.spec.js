import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsCollapsible from "@/components/collapsible/DpsCollapsible.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsCollapsible", () => {
  const variants = ["secondary", "tertiary"];
  const sizes = ["lg"];

  const wrapper = mount(DpsCollapsible, {
    props: {
      id: "dps-collapsible-1",
      toggleText: "Toggle Text",
    },
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
    describe("Header slot", () => {
      const wrapper = mount(DpsCollapsible, {
        props: {
          toggleText: "Toggle Text",
        },
        slots: {
          default: "Test",
          header: `<div class="foo">Custom Header</div>`,
        },
      });

      test("Header shows the specified content", () => {
        expect(wrapper.find(".dps-collapsible__trigger-button > .foo").exists()).toBe(true);

        expect(wrapper.find(".dps-collapsible__trigger-button > .foo").text()).toBe(
          "Custom Header",
        );
      });
    });

    describe("toggleText='Toggle Text'", () => {
      const wrapper = mount(DpsCollapsible, {
        props: {
          toggleText: "Toggle Text",
          toggleTextExpanded: "Toggle Text Expanded",
        },
        slots: {
          default: "Test",
        },
      });

      test("Collapsible trigger shows the specified text", () => {
        expect(wrapper.find(".dps-collapsible__trigger-button").text()).toBe(
          wrapper.props().toggleText,
        );
      });

      describe("locked='true'", () => {
        const wrapper = mount(DpsCollapsible, {
          props: {
            locked: true,
            toggleText: "Toggle Text",
            toggleTextExpanded: "Toggle Text Expanded",
          },
          slots: {
            default: "Test",
          },
        });

        test("Header contains no trigger button", () => {
          expect(wrapper.find(".dps-collapsible__trigger-button").exists()).toBe(false);
        });

        test("Header shows the specified text", () => {
          expect(wrapper.find(".dps-collapsible__header").text()).toBe(wrapper.props().toggleText);
        });

        test("Collapsible does not have status CSS class", () => {
          expect(wrapper.find(".dps-collapsible__collapsible").classes("show")).toBe(false);
        });
      });
    });

    describe("toggleTextExpanded='undefined'", () => {
      const wrapper = mount(DpsCollapsible, {
        props: {
          expanded: true,
          toggleText: "Toggle Text",
        },
        slots: {
          default: "Test",
        },
      });

      test("Collapsible trigger shows the specified text for expanded state", () => {
        expect(wrapper.find(".dps-collapsible__trigger-button").text()).toBe(
          wrapper.props().toggleText,
        );
      });
    });

    describe("expanded='true'", () => {
      const wrapper = mount(DpsCollapsible, {
        props: {
          expanded: true,
          toggleText: "Toggle Text",
          toggleTextExpanded: "Toggle Text Expanded",
        },
        slots: {
          default: "Test",
        },
      });

      test("Header shows the specified text", () => {
        expect(wrapper.find(".dps-collapsible__header").text()).toBe(
          wrapper.props().toggleTextExpanded,
        );
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-collapsible--expanded")).toBe(true);
      });

      test("Collapsible trigger has necessary ARIA attribute", () => {
        expect(wrapper.find(".dps-collapsible__trigger-button").exists()).toBe(true);

        expect(wrapper.find(".dps-collapsible__trigger-button").attributes("aria-expanded")).toBe(
          "true",
        );
      });

      test("Collapsible has necessary status CSS class", () => {
        expect(wrapper.find(".dps-collapsible__collapsible").classes("show")).toBe(true);
      });

      describe("locked='true'", () => {
        const wrapper = mount(DpsCollapsible, {
          props: {
            locked: true,
            expanded: true,
            toggleText: "Toggle Text",
            toggleTextExpanded: "Toggle Text Expanded",
          },
          slots: {
            default: "Test",
          },
        });

        test("Header contains no trigger button", () => {
          expect(wrapper.find(".dps-collapsible__trigger-button").exists()).toBe(false);
        });

        test("Collapsible has no id", () => {
          expect(wrapper.find(".dps-collapsible__collapsible").attributes("id")).toBeUndefined();
        });
      });
    });

    describe.each(variants)("variant='%s'", (variant) => {
      const wrapper = mount(DpsCollapsible, {
        props: {
          variant: variant,
          toggleText: "Toggle Text",
        },
        slots: {
          default: "Test",
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-collapsible--" + variant)).toBe(true);
      });
    });

    describe.each(sizes)("size='%s'", (size) => {
      const wrapper = mount(DpsCollapsible, {
        props: {
          size: size,
          toggleText: "Toggle Text",
        },
        slots: {
          default: "Test",
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-collapsible--size-" + size)).toBe(true);
      });
    });

    describe("Bootstrap classes and attributes", () => {
      const wrapper = mount(DpsCollapsible, {
        props: {
          toggleText: "Toggle Text",
        },
        slots: {
          default: "Test",
        },
      });

      test("Collapsible trigger has necessary attributes", () => {
        const collapsibleTriggerButton = wrapper.find(".dps-collapsible__trigger-button");
        const collapsible = wrapper.find(".dps-collapsible__collapsible");

        expect(collapsibleTriggerButton.exists()).toBe(true);
        expect(collapsible.exists()).toBe(true);

        expect(collapsibleTriggerButton.attributes("aria-expanded")).toBe("false");
        expect(collapsibleTriggerButton.attributes("aria-controls")).toBe(
          collapsible.attributes("id"),
        );
      });
    });
  });
});
