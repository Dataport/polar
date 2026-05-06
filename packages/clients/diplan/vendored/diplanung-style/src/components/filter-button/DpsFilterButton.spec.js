import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsFilterButton from "@/components/filter-button/DpsFilterButton.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsFilterButton", () => {
  const wrapper = mount(DpsFilterButton, {
    props: {},
    slots: {
      default: "Filter Button",
    },
  });

  test("builds", () => {
    expect(wrapper).toBeTruthy();
  });

  test("matches snapshot", () => {
    expect(wrapper.wrapperElement).toMatchSnapshot();
  });

  describe("Template:", () => {
    describe("disabled='true'", () => {
      const wrapper = mount(DpsFilterButton, {
        props: {
          disabled: true,
        },
        slots: {
          default: "Filter Button",
        },
      });

      test("Wrapper has necessary disabled attribute", () => {
        expect(wrapper.attributes("disabled")).toBeDefined();
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-filter-button--disabled")).toBe(true);
      });
    });

    describe("readonly='true'", () => {
      const wrapper = mount(DpsFilterButton, {
        props: {
          readonly: true,
        },
        slots: {
          default: "Filter Button",
        },
      });

      test("Wrapper has necessary disabled attribute", () => {
        expect(wrapper.attributes("disabled")).toBeDefined();
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-filter-button--readonly")).toBe(true);
      });
    });

    describe("title='Title'", () => {
      const wrapper = mount(DpsFilterButton, {
        props: {
          title: "Title",
        },
        slots: {
          default: "Filter Button",
        },
      });

      test("Wrapper has necessary disabled attribute", () => {
        expect(wrapper.attributes("title")).toBe(wrapper.props().title);
      });
    });
  });

  describe("Interactions:", () => {
    describe("Click", () => {
      const wrapper = mount(DpsFilterButton, {
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
        const wrapper = mount(DpsFilterButton, {
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
