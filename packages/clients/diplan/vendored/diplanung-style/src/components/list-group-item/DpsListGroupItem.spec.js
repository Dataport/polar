import { describe, test, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import DpsListGroupItem from "@/components/list-group-item/DpsListGroupItem.vue";
import { nextTick } from "vue";

describe("DpsListGroupItem", () => {
  const wrapper = mount(DpsListGroupItem, {
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
    test("Wrapper does not contain the collapse element", () => {
      const collapse = wrapper.find(".dps-list-group-item__collapse");

      expect(collapse.exists()).toBe(false);
    });

    test("Wrapper renders slot content", () => {
      expect(wrapper.text()).toBe("Test");
    });

    describe("tag='li'", () => {
      const wrapper = mount(DpsListGroupItem, {
        props: {
          tag: "li",
        },
      });

      test("Wrapper has disabled attribute", () => {
        expect(wrapper.element.tagName).toBe("LI");
      });
    });

    describe("href='https://example.com'", () => {
      const wrapper = mount(DpsListGroupItem, {
        props: {
          href: "https://example.com",
        },
      });

      test("Wrapper has correct HTML tag", () => {
        expect(wrapper.element.tagName).toBe("A");
      });

      test("Wrapper has correct href attribute", () => {
        expect(wrapper.attributes("href")).toBe("https://example.com");
      });
    });

    describe("expanded='true'", () => {
      const wrapper = mount(DpsListGroupItem, {
        props: {
          expanded: true,
        },
      });

      test("Wrapper has no modifier CSS class", () => {
        expect(wrapper.classes("dps-list-group-item--expanded")).toBe(false);
      });

      test("Wrapper has no aria-expanded attribute", () => {
        expect(wrapper.attributes("aria-expanded")).toBeUndefined();
      });
    });

    describe("Filled collapsible-content slot", () => {
      const wrapper = mount(DpsListGroupItem, {
        props: {
          collapseId: "test",
        },
        slots: {
          "collapsible-content":
            "<div class='test-list-group-item-collapsible'>Collapsible Content</div>",
        },
      });

      test("Wrapper contains the collapse element", () => {
        const collapse = wrapper.find(".dps-list-group-item__collapse");

        expect(collapse.exists()).toBe(true);
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-list-group-item--collapsible")).toBe(true);
      });

      test("Trigger has necessary ARIA attributes", () => {
        const trigger = wrapper.find(".dps-list-group-item__trigger");

        expect(trigger.attributes("aria-controls")).toBe(wrapper.props().collapseId);
      });

      test("Collapsible item contains a collapse with the specified id attribute", () => {
        expect(wrapper.find(".collapse").attributes("id")).toBe(wrapper.props().collapseId);
      });

      test("Collapsible content is rendered correctly ", () => {
        expect(wrapper.find(".dps-list-group-item__collapsible-content").exists()).toBe(true);

        expect(
          wrapper
            .find(".dps-list-group-item__collapsible-content > .test-list-group-item-collapsible")
            .exists(),
        ).toBe(true);

        expect(
          wrapper
            .find(".dps-list-group-item__collapsible-content > .test-list-group-item-collapsible")
            .text(),
        ).toBe("Collapsible Content");
      });

      describe("expanded='true'", () => {
        const wrapper = mount(DpsListGroupItem, {
          props: {
            expanded: true,
          },
          slots: {
            "collapsible-content":
              "<div class='test-list-group-item-collapsible'>Collapsible Content</div>",
          },
        });

        test("Wrapper has necessary modifier CSS class", () => {
          expect(wrapper.classes("dps-list-group-item--expanded")).toBe(true);
        });

        test("Change of property", async () => {
          await wrapper.setProps({ expanded: false });

          expect(wrapper.classes("dps-list-group-item--expanded")).toBe(false);
        });
      });
    });
  });

  describe("Interactions:", () => {
    describe("show", () => {
      const wrapper = mount(DpsListGroupItem, {
        props: {
          collapseId: "test",
        },
        slots: {
          "collapsible-content":
            "<div class='test-list-group-item-collapsible'>Collapsible Content</div>",
        },
      });

      test("Bootstrap's show.bs.collapse event emits the component's show event", async () => {
        const collapseEl = wrapper.find(".collapse").element;

        collapseEl.dispatchEvent(new Event("show.bs.collapse"));

        await nextTick();

        expect(wrapper.emitted().show).toBeTruthy();
        expect(wrapper.emitted().hide).toBeUndefined();
      });
    });

    describe("hide", () => {
      const wrapper = mount(DpsListGroupItem, {
        props: {
          collapseId: "test",
        },
        slots: {
          "collapsible-content":
            "<div class='test-list-group-item-collapsible'>Collapsible Content</div>",
        },
      });

      test("Bootstrap's hide.bs.collapse event emits the component's hide event", async () => {
        const collapseEl = wrapper.find(".collapse").element;

        collapseEl.dispatchEvent(new Event("hide.bs.collapse"));

        await nextTick();

        expect(wrapper.emitted().show).toBeUndefined();
        expect(wrapper.emitted().hide).toBeTruthy();
      });
    });

    describe("@keydown.enter", () => {
      const wrapper = mount(DpsListGroupItem, {
        props: {
          collapseId: "test",
        },
        slots: {
          "collapsible-content":
            "<div class='test-list-group-item-collapsible'>Collapsible Content</div>",
        },
      });

      test("Enter triggers a click on the trigger element", async () => {
        const trigger = wrapper.find(".dps-list-group-item__trigger");
        const clickSpy = vi.spyOn(trigger.element, "click");

        await trigger.trigger("keydown.enter");

        expect(clickSpy).toHaveBeenCalled();

        clickSpy.mockRestore();
      });
    });
  });
});
