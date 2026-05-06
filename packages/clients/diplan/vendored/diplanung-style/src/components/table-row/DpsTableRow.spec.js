import { describe, test, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import DpsTableRow from "@/components/table-row/DpsTableRow.vue";
import { nextTick } from "vue";
import { unescapeHtml } from "@/services/html.ts";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsTableRow", () => {
  const wrapper = mount(DpsTableRow, {
    slots: {
      default: "Test",
    },
  });

  test("builds", () => {
    expect(wrapper).toBeTruthy();
  });

  test("matches snapshot", () => {
    expect(unescapeHtml(wrapper.html())).toMatchSnapshot();
  });

  describe("Template:", () => {
    describe("Filled collapsible-content slot", () => {
      const wrapper = mount(DpsTableRow, {
        props: {
          collapseId: "test",
        },
        slots: {
          "collapsible-content":
            "<div class='test-table-row-collapsible'>Collapsible Content</div>",
        },
      });

      test("Wrapper contains two rows", () => {
        const rows = wrapper.findAll("tr");

        expect(rows.length).toBe(2);
      });

      test("First row has necessary modifier CSS class", () => {
        const rows = wrapper.findAll("tr");

        expect(rows[0].classes("dps-table-row--collapsible")).toBe(true);
      });

      test("First row has necessary ARIA attributes", () => {
        const rows = wrapper.findAll("tr");

        expect(rows[0].attributes("aria-controls")).toBe(wrapper.props().collapseId);
      });

      test("Wrapper contains a collapsible row", () => {
        expect(wrapper.find("tr.dps-table-row--collapse").exists()).toBe(true);
      });

      test("Collapsible row contains a collapse with the specified id attribute", () => {
        expect(wrapper.find(".collapse").attributes("id")).toBe(wrapper.props().collapseId);
      });

      test("Collapsible content is rendered correctly ", () => {
        expect(wrapper.find(".dps-table-row__collapsible-content").exists()).toBe(true);

        expect(
          wrapper
            .find(".dps-table-row__collapsible-content > .test-table-row-collapsible")
            .exists(),
        ).toBe(true);

        expect(
          wrapper.find(".dps-table-row__collapsible-content > .test-table-row-collapsible").text(),
        ).toBe("Collapsible Content");
      });

      describe("collapseColspan='1'", () => {
        const wrapper = mount(DpsTableRow, {
          props: {
            collapseColspan: 1,
          },
          slots: {
            "collapsible-content":
              "<div class='test-table-row-collapsible'>Collapsible Content</div>",
          },
        });

        test("Collapse has the specified colspan", () => {
          const rows = wrapper.findAll("tr");
          const cols = rows[1].findAll("td");

          expect(cols.length).toBe(1);

          expect(cols[0].attributes("colspan")).toBe(wrapper.props().collapseColspan.toString());
        });
      });

      describe("collapseColstart='1'", () => {
        const wrapper = mount(DpsTableRow, {
          props: {
            collapseColstart: 1,
          },
          slots: {
            "collapsible-content":
              "<div class='test-table-row-collapsible'>Collapsible Content</div>",
          },
        });

        test("Collapse has the specified colspan offset", () => {
          const rows = wrapper.findAll("tr");
          const cols = rows[1].findAll("td");

          expect(cols.length).toBe(2);

          expect(cols[0].attributes("colspan")).toBe(wrapper.props().collapseColstart.toString());
        });
      });

      describe("expanded='true'", () => {
        const wrapper = mount(DpsTableRow, {
          props: {
            expanded: true,
          },
          slots: {
            "collapsible-content":
              "<div class='test-table-row-collapsible'>Collapsible Content</div>",
          },
        });

        test("First row has necessary modifier CSS class", () => {
          const rows = wrapper.findAll("tr");

          expect(rows[0].classes("dps-table-row--expanded")).toBe(true);
        });

        test("Change of property", async () => {
          await wrapper.setProps({ expanded: false });

          const rows = wrapper.findAll("tr");

          expect(rows[0].classes("dps-table-row--expanded")).toBe(false);
        });
      });
    });
  });

  describe("Interactions:", () => {
    describe("show", () => {
      const wrapper = mount(DpsTableRow, {
        props: {
          collapseId: "test",
        },
        slots: {
          "collapsible-content":
            "<div class='test-table-row-collapsible'>Collapsible Content</div>",
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
      const wrapper = mount(DpsTableRow, {
        props: {
          collapseId: "test",
          expanded: true,
        },
        slots: {
          "collapsible-content":
            "<div class='test-table-row-collapsible'>Collapsible Content</div>",
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
      describe("Without collapse content", () => {
        const wrapper = mount(DpsTableRow);

        test("Enter does not trigger a click on the trigger element", async () => {
          const rootElements = wrapper.findAll("tr");
          const mainElement = rootElements[0];
          const clickSpy = vi.spyOn(mainElement.element, "click");

          await mainElement.trigger("keydown.enter");

          expect(clickSpy).not.toHaveBeenCalled();

          clickSpy.mockRestore();
        });
      });

      describe("With collapse content", () => {
        const wrapper = mount(DpsTableRow, {
          props: {
            collapseId: "test",
          },
          slots: {
            "collapsible-content":
              "<div class='test-list-group-item-collapsible'>Collapsible Content</div>",
          },
        });

        test("Enter triggers a click on the trigger element", async () => {
          const rootElements = wrapper.findAll("tr");
          const mainElement = rootElements[0];
          const clickSpy = vi.spyOn(mainElement.element, "click");

          await mainElement.trigger("keydown.enter");

          expect(clickSpy).toHaveBeenCalled();

          clickSpy.mockRestore();
        });
      });
    });
  });
});
