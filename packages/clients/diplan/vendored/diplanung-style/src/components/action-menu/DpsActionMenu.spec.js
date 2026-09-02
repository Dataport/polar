import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsActionMenu from "@/components/action-menu/DpsActionMenu.vue";
import { nextTick } from "vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsActionMenu", () => {
  const wrapper = mount(DpsActionMenu, {
    props: {
      id: "DpsActionMenu",
    },
    attachTo: document.body,
  });

  test("builds", () => {
    expect(wrapper).toBeTruthy();
  });

  test("matches snapshot", () => {
    expect(wrapper.wrapperElement).toMatchSnapshot();
  });

  describe("Template:", () => {
    describe("tag='ul'", () => {
      const wrapper = mount(DpsActionMenu, {
        props: {
          id: "DpsActionMenu",
          tag: "ul",
        },
        attachTo: document.body,
      });

      test("Dropdown list has correct tag", () => {
        const dropdownElement = wrapper.find(".dps-action-menu__dropdown-list");

        expect(dropdownElement.exists()).toBe(true);

        expect(dropdownElement.element.tagName).toBe("UL");
      });
    });

    describe("icon='placeholder'", () => {
      const wrapper = mount(DpsActionMenu, {
        props: {
          id: "DpsActionMenu",
          icon: "placeholder",
        },
        attachTo: document.body,
      });

      test("Dropdown trigger has correct icon", () => {
        const dropdownTriggerButtonIcon = wrapper.find(
          ".dps-action-menu__trigger-button > .dps-icon",
        );

        expect(dropdownTriggerButtonIcon.exists()).toBe(true);

        expect(dropdownTriggerButtonIcon.classes("dps-icon--placeholder")).toBe(true);
      });

      test("Dropdown trigger has necessary modifier CSS class", () => {
        const dropdownTriggerButton = wrapper.find(".dps-action-menu__trigger-button");

        expect(dropdownTriggerButton.exists()).toBe(true);

        expect(dropdownTriggerButton.classes("dps-action-menu__trigger-button--icon")).toBe(true);
      });
    });

    describe("label='Label'", () => {
      const wrapper = mount(DpsActionMenu, {
        props: {
          id: "DpsActionMenu",
          label: "Label",
        },
        attachTo: document.body,
      });

      test("Dropdown trigger has correct label text", () => {
        const dropdownTriggerButton = wrapper.find(".dps-action-menu__trigger-button");

        expect(dropdownTriggerButton.exists()).toBe(true);

        expect(dropdownTriggerButton.text()).toBe("Label");
      });

      test("Dropdown trigger has necessary modifier CSS class", () => {
        const dropdownTriggerButton = wrapper.find(".dps-action-menu__trigger-button");

        expect(dropdownTriggerButton.exists()).toBe(true);

        expect(dropdownTriggerButton.classes("dps-action-menu__trigger-button--text")).toBe(true);
      });
    });

    describe("title='Title'", () => {
      const wrapper = mount(DpsActionMenu, {
        props: {
          id: "DpsActionMenu",
          title: "Title",
        },
        attachTo: document.body,
      });

      test("Dropdown trigger has correct title text", () => {
        const dropdownTriggerButton = wrapper.find(".dps-action-menu__trigger-button");

        expect(dropdownTriggerButton.exists()).toBe(true);

        expect(dropdownTriggerButton.attributes("title")).toBe("Title");
      });
    });

    describe("showCloseButton='true'", () => {
      const wrapper = mount(DpsActionMenu, {
        props: {
          id: "DpsActionMenu",
          showCloseButton: true,
        },
        attachTo: document.body,
      });
      const dropdownMenu = wrapper.find(".dps-action-menu__dropdown");

      test("Dropdown menu shows a header", () => {
        expect(dropdownMenu.exists()).toBe(true);

        const dropdownMenuHeader = dropdownMenu.find(".dps-action-menu__dropdown-header");

        expect(dropdownMenuHeader.exists()).toBe(true);
      });

      test("Dropdown menu shows a close button", () => {
        expect(dropdownMenu.exists()).toBe(true);

        const dropdownMenuCloseButton = dropdownMenu.find(
          ".dps-action-menu__dropdown-close-button",
        );

        expect(dropdownMenuCloseButton.exists()).toBe(true);
      });
    });

    describe("headline='Headline'", () => {
      const wrapper = mount(DpsActionMenu, {
        props: {
          id: "DpsActionMenu",
          headline: "Headline",
        },
        attachTo: document.body,
      });
      const dropdownMenu = wrapper.find(".dps-action-menu__dropdown");

      test("Dropdown menu shows a header", () => {
        expect(dropdownMenu.exists()).toBe(true);

        const dropdownMenuHeader = dropdownMenu.find(".dps-action-menu__dropdown-header");

        expect(dropdownMenuHeader.exists()).toBe(true);
      });

      test("Dropdown menu shows the specified headline", () => {
        expect(dropdownMenu.exists()).toBe(true);

        const dropdownMenuHeadline = dropdownMenu.find(".dps-action-menu__dropdown-headline");

        expect(dropdownMenuHeadline.exists()).toBe(true);
      });
    });

    describe("autoClose='false'", () => {
      const wrapper = mount(DpsActionMenu, {
        props: {
          id: "DpsActionMenu",
          autoClose: false,
        },
        attachTo: document.body,
      });

      test("Dropdown trigger has necessary Bootstrap attributes", () => {
        const dropdownTriggerButton = wrapper.find(".dps-action-menu__trigger-button");

        expect(dropdownTriggerButton.exists()).toBe(true);

        expect(dropdownTriggerButton.attributes("data-bs-auto-close")).toBe("outside");
      });
    });

    describe("disabled='true'", () => {
      const wrapper = mount(DpsActionMenu, {
        props: {
          id: "DpsActionMenu",
          disabled: true,
        },
        attachTo: document.body,
      });
      const dropdownTriggerButton = wrapper.find(".dps-action-menu__trigger-button");

      test("Dropdown trigger has disabled attribute", () => {
        expect(dropdownTriggerButton.exists()).toBe(true);

        expect(dropdownTriggerButton.attributes("disabled")).toBeDefined();
      });

      test("Dropdown trigger has necessary modifier CSS class", () => {
        expect(dropdownTriggerButton.exists()).toBe(true);

        expect(dropdownTriggerButton.classes("dps-action-menu__trigger-button--disabled")).toBe(
          true,
        );
      });
    });

    describe("Bootstrap classes and attributes", () => {
      const wrapper = mount(DpsActionMenu, {
        props: {
          id: "DpsActionMenu",
        },
        attachTo: document.body,
      });
      const dropdownMenu = wrapper.find(".dps-action-menu__dropdown");

      test("Dropdown trigger has necessary attributes", () => {
        const dropdownTriggerButton = wrapper.find(".dps-action-menu__trigger-button");

        expect(dropdownTriggerButton.exists()).toBe(true);

        expect(dropdownTriggerButton.attributes("data-bs-toggle")).toBe("dropdown");
        expect(dropdownTriggerButton.attributes("data-bs-auto-close")).toBeDefined();
        expect(dropdownTriggerButton.attributes("aria-expanded")).toBe("false");
      });

      test("Dropdown menu has necessary CSS class and ARIA attribute", () => {
        expect(dropdownMenu.exists()).toBe(true);

        expect(dropdownMenu.classes("dropdown-menu")).toBe(true);
        expect(dropdownMenu.attributes("aria-labelledby")).toBe(wrapper.props().id);
      });
    });
  });

  describe("Interactions:", () => {
    describe("Toggle visibility (show/hide)", () => {
      test("Bootstrap's show.bs.dropdown event emits the component's show event", async () => {
        const wrapper = mount(DpsActionMenu, {
          props: {
            id: "DpsActionMenu",
          },
          attachTo: document.body,
        });

        const dropdownElement = document.getElementById(wrapper.props().id);

        dropdownElement.dispatchEvent(new Event("show.bs.dropdown"));

        await nextTick();

        expect(wrapper.emitted().show).toBeTruthy();
        expect(wrapper.emitted().hide).toBeUndefined();
      });

      test("Bootstrap's hide.bs.dropdown event emits the component's hide event", async () => {
        const wrapper = mount(DpsActionMenu, {
          props: {
            id: "DpsActionMenu",
            expanded: true,
          },
          attachTo: document.body,
        });

        const dropdownElement = document.getElementById(wrapper.props().id);

        dropdownElement.dispatchEvent(new Event("hide.bs.dropdown"));

        await nextTick();

        expect(wrapper.emitted().show).toBeUndefined();
        expect(wrapper.emitted().hide).toBeTruthy();
      });
    });
  });
});
