import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsActionMenuItem from "@/components/action-menu-item/DpsActionMenuItem.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsActionMenuItem", () => {
  const wrapper = mount(DpsActionMenuItem, {
    props: {},
  });

  test("builds", () => {
    expect(wrapper).toBeTruthy();
  });

  test("matches snapshot", () => {
    expect(wrapper.wrapperElement).toMatchSnapshot();
  });

  describe("Template:", () => {
    describe("title='Title'", () => {
      const wrapper = mount(DpsActionMenuItem, {
        props: {
          title: "Title",
        },
      });

      test("Item has correct title text", () => {
        const itemElement = wrapper.find(".dps-action-menu-item__element");

        expect(itemElement.exists()).toBe(true);

        expect(itemElement.attributes("title")).toBe("Title");
      });
    });

    describe("icon='placeholder'", () => {
      const wrapper = mount(DpsActionMenuItem, {
        props: {
          icon: "placeholder",
        },
      });

      test("Item has correct icon", () => {
        const itemIcon = wrapper.find(".dps-action-menu-item__icon");

        expect(itemIcon.exists()).toBe(true);

        expect(itemIcon.classes("dps-icon--" + wrapper.props().icon)).toBe(true);
      });
    });

    describe("disabled='true'", () => {
      const wrapper = mount(DpsActionMenuItem, {
        props: {
          disabled: true,
        },
      });
      const itemElement = wrapper.find(".dps-action-menu-item__element");

      test("Item has disabled attribute", () => {
        expect(itemElement.exists()).toBe(true);

        expect(itemElement.attributes("disabled")).toBeDefined();
      });

      test("Item has necessary modifier CSS class", () => {
        expect(itemElement.exists()).toBe(true);

        expect(itemElement.classes("dps-action-menu-item__element--disabled")).toBe(true);
      });
    });

    describe("tag='div'", () => {
      const wrapper = mount(DpsActionMenuItem, {
        props: {
          tag: "div",
        },
      });

      test("Item has disabled attribute", () => {
        expect(wrapper.element.tagName).toBe("DIV");
      });
    });

    describe("href='test.html'", () => {
      const wrapper = mount(DpsActionMenuItem, {
        props: {
          href: "test.html",
        },
      });
      const itemElement = wrapper.find(".dps-action-menu-item__element");

      test("Item has correct HTML tag", () => {
        expect(itemElement.exists()).toBe(true);

        expect(itemElement.element.tagName).toBe("A");
      });

      test("Item has correct href attribute", () => {
        expect(itemElement.exists()).toBe(true);

        expect(itemElement.attributes("href")).toBe("test.html");
      });
    });

    describe("target='_blank'", () => {
      const wrapper = mount(DpsActionMenuItem, {
        props: {
          href: "test.html",
          target: "_blank",
        },
      });

      test("Item has correct href attribute", () => {
        const itemElement = wrapper.find(".dps-action-menu-item__element");

        expect(itemElement.exists()).toBe(true);

        expect(itemElement.attributes("target")).toBe("_blank");
      });
    });

    describe("rel='noopener noreferrer'", () => {
      const wrapper = mount(DpsActionMenuItem, {
        props: {
          href: "test.html",
          rel: "noopener noreferrer",
        },
      });

      test("Item has correct rel attribute", () => {
        const itemElement = wrapper.find(".dps-action-menu-item__element");

        expect(itemElement.exists()).toBe(true);

        expect(itemElement.attributes("rel")).toBe(wrapper.props().rel);
      });
    });

    describe("danger='true'", () => {
      const wrapper = mount(DpsActionMenuItem, {
        props: {
          danger: true,
        },
      });
      const itemElement = wrapper.find(".dps-action-menu-item__element");

      test("Item has necessary modifier CSS class", () => {
        expect(itemElement.exists()).toBe(true);

        expect(itemElement.classes("dps-action-menu-item__element--danger")).toBe(true);
      });
    });
  });

  describe("Interactions:", () => {
    describe("Click on the element emits the click event", () => {
      const wrapper = mount(DpsActionMenuItem, {
        props: {},
      });
      const itemElement = wrapper.find(".dps-action-menu-item__element");

      test("Click on trigger shows dropdown menu", async () => {
        expect(itemElement.exists()).toBe(true);

        await itemElement.trigger("click");

        expect(wrapper.emitted().click).toBeTruthy();
      });
    });

    describe("Click on disabled element does not emit the click event", () => {
      const wrapper = mount(DpsActionMenuItem, {
        props: {
          disabled: true,
        },
      });
      const itemElement = wrapper.find(".dps-action-menu-item__element");

      test("Click on trigger shows dropdown menu", async () => {
        expect(itemElement.exists()).toBe(true);

        await itemElement.trigger("click");

        expect(wrapper.emitted().click).toBeUndefined();
      });
    });
  });
});
