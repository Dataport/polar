import { describe, test, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import DpsTable from "@/components/table/DpsTable.vue";
import { nextTick } from "vue";
import { unescapeHtml } from "@/services/html.ts";
import * as services from "@/services/id.ts";

vi.spyOn(services, "getUniqueId").mockReturnValue("1234");

const fields = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "version", label: "Version" },
  { key: "date", label: "Date" },
];

const items = [
  {
    name: "Row 1",
    id: "505615cf-ef1d-45c5-814e",
    description: "Lorem ipsum dolor sit amet",
    version: "1.0",
    date: "2024-05-29T13:53+0000",
  },
  {
    name: "Row 2",
    id: "683fa785-8328-403d-af77",
    description:
      "Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.",
    version: "1.21",
    date: "2024-06-20T12:10+0000",
  },
  {
    name: "Row 3",
    id: "76a8a3ce-acf6-4589-8cb3",
    description:
      "Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet",
    version: "1.2",
    date: "2024-06-20T13:43+0000",
  },
];

window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsTable", () => {
  const wrapper = mount(DpsTable, {
    props: {
      fields,
      items,
    },
  });

  test("builds", () => {
    expect(wrapper).toBeTruthy();
  });

  test("matches snapshot", () => {
    expect(wrapper.wrapperElement).toMatchSnapshot();
  });

  test("setStickyStyles() returns void if the table does not contain any columns", () => {
    const wrapper = mount(DpsTable, {
      props: {
        fields: [],
        items: [],
      },
    });

    expect(wrapper.vm.setStickyStyles()).toBeUndefined();
  });

  describe("Template:", () => {
    describe("Sortable", () => {
      const wrapper = mount(DpsTable, {
        props: {
          fields: fields.map((item) => ({
            ...item,
            sortable: item.key !== "description",
          })),
          items,
        },
      });

      test("Header cols have necessary aria-sort attribute", () => {
        const expectation = {
          ID: "none",
          Name: "none",
          Description: undefined,
          Version: "none",
          Date: "none",
        };

        const headerCols = wrapper.findAll("thead th");

        for (const headerCol of headerCols) {
          const label = headerCol.text();

          expect(headerCol.attributes("aria-sort")).toBe(expectation[label]);
        }
      });

      test("Header cols have necessary title attribute", () => {
        const expectation = {
          ID: 'Reihenfolge der Spalte "ID" ändern',
          Name: 'Reihenfolge der Spalte "Name" ändern',
          Description: undefined,
          Version: 'Reihenfolge der Spalte "Version" ändern',
          Date: 'Reihenfolge der Spalte "Date" ändern',
        };

        const headerCols = wrapper.findAll("thead th");

        for (const headerCol of headerCols) {
          const label = headerCol.text();

          expect(headerCol.attributes("title")).toBe(expectation[label]);
        }
      });

      test("Header cols have necessary tabindex attribute", () => {
        const expectation = {
          ID: "0",
          Name: "0",
          Description: undefined,
          Version: "0",
          Date: "0",
        };

        const headerCols = wrapper.findAll("thead th");

        for (const headerCol of headerCols) {
          const label = headerCol.text();

          expect(headerCol.attributes("tabindex")).toBe(expectation[label]);
        }
      });

      test("Header cols contain SVG when sortable", () => {
        const headerCols = wrapper.findAll("thead th");

        for (const headerCol of headerCols) {
          const svg = headerCol.find("svg");

          expect(svg.exists()).toBe(headerCol.text() !== "Description");
        }
      });

      describe("sortBy='id'", () => {
        const wrapper = mount(DpsTable, {
          props: {
            fields: fields.map((item) => ({
              ...item,
              sortable: item.key !== "description",
            })),
            items,
            sortBy: "id",
          },
        });

        test("matches snapshot", () => {
          expect(wrapper.find("tbody").wrapperElement).toMatchSnapshot();
        });

        test("Header cols have correct aria-sort attribute", () => {
          const expectation = {
            ID: "ascending",
            Name: "none",
            Description: undefined,
            Version: "none",
            Date: "none",
          };

          const headerCols = wrapper.findAll("thead th");

          for (const headerCol of headerCols) {
            const label = headerCol.text();

            expect(headerCol.attributes("aria-sort")).toBe(expectation[label]);
          }
        });

        test("SVG paths are filled correctly", () => {
          const expectation = {
            ID: ["#04071A", "#C8CACC"],
            Name: ["#C8CACC", "#C8CACC"],
            Description: undefined,
            Version: ["#C8CACC", "#C8CACC"],
            Date: ["#C8CACC", "#C8CACC"],
          };

          const headerCols = wrapper.findAll("thead th");

          for (const headerCol of headerCols) {
            const label = headerCol.text();

            if (label !== "Description") {
              const paths = headerCol.findAll("svg > path");

              expect(paths[0].attributes("fill")).toBe(expectation[label][0]);
              expect(paths[1].attributes("fill")).toBe(expectation[label][1]);
            }
          }
        });
      });

      describe("sortBy='id' sortDesc='true'", () => {
        const wrapper = mount(DpsTable, {
          props: {
            fields: fields.map((item) => ({
              ...item,
              sortable: item.key !== "description",
            })),
            items,
            sortBy: "id",
            sortDesc: true,
          },
        });

        test("matches snapshot", () => {
          expect(wrapper.find("tbody").wrapperElement).toMatchSnapshot();
        });

        test("Header cols have correct aria-sort attribute", () => {
          const expectation = {
            ID: "descending",
            Name: "none",
            Description: undefined,
            Version: "none",
            Date: "none",
          };

          const headerCols = wrapper.findAll("thead th");

          for (const headerCol of headerCols) {
            const label = headerCol.text();

            expect(headerCol.attributes("aria-sort")).toBe(expectation[label]);
          }
        });

        test("SVG paths are filled correctly", () => {
          const expectation = {
            ID: ["#C8CACC", "#04071A"],
            Name: ["#C8CACC", "#C8CACC"],
            Description: undefined,
            Version: ["#C8CACC", "#C8CACC"],
            Date: ["#C8CACC", "#C8CACC"],
          };

          const headerCols = wrapper.findAll("thead th");

          for (const headerCol of headerCols) {
            const label = headerCol.text();

            if (label !== "Description") {
              const paths = headerCol.findAll("svg > path");

              expect(paths[0].attributes("fill")).toBe(expectation[label][0]);
              expect(paths[1].attributes("fill")).toBe(expectation[label][1]);
            }
          }
        });
      });

      describe("sortedItems()", () => {
        test("sorts items by valid dates when sortBy is a date field", () => {
          const wrapper = mount(DpsTable, {
            props: {
              items: [
                { date: "2024-06-20T12:10+0000" },
                { date: "2024-05-29T13:53+0000" },
                { date: "2024-06-20T13:43+0000" },
              ],
              fields: [{ key: "date" }],
              sortBy: "date",
              sortDesc: false,
            },
          });

          const result = wrapper.vm.sortedItems;

          expect(result).toEqual([
            { date: "2024-05-29T13:53+0000" },
            { date: "2024-06-20T12:10+0000" },
            { date: "2024-06-20T13:43+0000" },
          ]);
        });

        test("sorts items in descending order by valid dates when sortDesc is true", () => {
          const wrapper = mount(DpsTable, {
            props: {
              items: [
                { date: "2024-06-20T12:10+0000" },
                { date: "2024-05-29T13:53+0000" },
                { date: "2024-06-20T13:43+0000" },
              ],
              fields: [{ key: "date" }],
              sortBy: "date",
              sortDesc: true,
            },
          });

          const result = wrapper.vm.sortedItems;

          expect(result).toEqual([
            { date: "2024-06-20T13:43+0000" },
            { date: "2024-06-20T12:10+0000" },
            { date: "2024-05-29T13:53+0000" },
          ]);
        });

        test("handles invalid date formats gracefully and falls back to string comparison", () => {
          const wrapper = mount(DpsTable, {
            props: {
              items: [
                { date: "invalid-date" },
                { date: "2024-06-20T12:10+0000" },
                { date: "another-invalid-date" },
              ],
              fields: [{ key: "date" }],
              sortBy: "date",
              sortDesc: false,
            },
          });

          const result = wrapper.vm.sortedItems;

          expect(result).toEqual([
            { date: "2024-06-20T12:10+0000" },
            { date: "another-invalid-date" },
            { date: "invalid-date" },
          ]);
        });

        test("handles null or undefined values gracefully in string comparison", () => {
          const wrapper = mount(DpsTable, {
            props: {
              items: [{ name: null }, { name: "Alice" }, { name: undefined }, { name: "Charlie" }],
              fields: [{ key: "name" }],
              sortBy: "name",
              sortDesc: false,
            },
          });

          const result = wrapper.vm.sortedItems;

          expect(result).toEqual([
            { name: null },
            { name: undefined },
            { name: "Alice" },
            { name: "Charlie" },
          ]);
        });
      });
    });

    describe("Sticky column", async () => {
      const wrapper = mount(DpsTable, {
        props: {
          fields: fields.map((item) => ({
            ...item,
            sticky: item.key === "id",
          })),
          items,
        },
      });

      await wrapper.setData({
        isScrollable: true,
      });

      test("Sticky header cols get necessary data-sticky attribute", () => {
        const expectation = {
          ID: "",
          Name: undefined,
          Description: undefined,
          Version: undefined,
          Date: undefined,
        };

        const headerCols = wrapper.findAll("thead th");

        for (const headerCol of headerCols) {
          const label = headerCol.text();

          expect(headerCol.attributes("data-sticky")).toBe(expectation[label]);
        }
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-table--sticky")).toBe(true);
      });

      test("Changed items trigger the setStickyStyles method", async () => {
        let bodyRows = wrapper.findAll("tbody tr");

        expect(bodyRows.length).toBe(3);

        await wrapper.setProps({
          items: [
            ...items,
            {
              name: "Row X",
              id: "505615cf-ef1d-45c5-1234",
              description: "Foo",
              version: "1.100",
              date: "2024-06-10T09:23+0000",
            },
          ],
        });

        await nextTick();

        bodyRows = wrapper.findAll("tbody tr");

        expect(bodyRows.length).toBe(4);

        const newBodyRowCols = bodyRows[3].findAll("td");

        for (const newBodyRowCol of newBodyRowCols) {
          if (newBodyRowCol.text() === "505615cf-ef1d-45c5-1234") {
            expect(newBodyRowCol.attributes("data-sticky")).toBe("");
          }
        }
      });
    });

    describe("Multiple sticky columns", async () => {
      const wrapper = mount(DpsTable, {
        props: {
          fields: fields.map((item) => ({
            ...item,
            sticky: ["id", "name"].includes(item.key),
          })),
          items,
        },
      });

      await wrapper.setData({
        isScrollable: true,
      });

      test("matches snapshot", () => {
        expect(wrapper.wrapperElement).toMatchSnapshot();
      });

      test("Sticky header cols get necessary data-sticky attribute", () => {
        const expectation = {
          ID: "",
          Name: "",
          Description: undefined,
          Version: undefined,
          Date: undefined,
        };

        const headerCols = wrapper.findAll("thead th");

        for (const headerCol of headerCols) {
          const label = headerCol.text();

          expect(headerCol.attributes("data-sticky")).toBe(expectation[label]);
        }
      });
    });

    describe("Checkbox", () => {
      const fields = [
        {
          key: "check",
          label: "Check all",
          checkbox: true,
          checkboxChecked: false,
        },
        {
          key: "description",
          label: "Description",
        },
      ];

      const wrapper = mount(DpsTable, {
        props: {
          fields,
          items: [],
        },
        global: {
          stubs: ["DpsFormCheckbox"],
          renderStubDefaultSlot: true,
        },
      });

      describe("Checkbox is rendered correctly", () => {
        const headerCols = wrapper.findAll("thead th");
        const headerCheckbox = headerCols[0].find("dps-form-checkbox-stub");

        test("Checkbox is rendered at the correct position", () => {
          expect(headerCheckbox.exists()).toBe(true);
        });

        test("Checkbox renders its specified label", () => {
          expect(headerCheckbox.text()).toBe(wrapper.props().fields[0].label);
        });

        test("Checkbox component has correct properties", () => {
          expect(headerCheckbox.attributes("tooltip")).toBe(wrapper.props().fields[0].label);
          expect(headerCheckbox.attributes("hidelabel")).toBe("true");
          expect(headerCheckbox.attributes("modelvalue")).toBe(
            wrapper.props().fields[0].checkboxChecked.toString(),
          );
        });
      });

      describe("Checkbox is checked if specified", () => {
        test("Checkbox updates its checked state correctly", async () => {
          await wrapper.setProps({
            fields: [
              {
                key: "check",
                label: "Check all",
                checkbox: true,
                checkboxChecked: true,
              },
              {
                key: "description",
                label: "Description",
              },
            ],
          });

          expect(wrapper.find(".dps-form-checkbox__input").attributes("value")).toBe(
            wrapper.props().fields[0].checkboxChecked.toString(),
          );
        });
      });

      describe("Checkbox is disabled if specified", () => {
        test("Checkbox updates its disabled state correctly", async () => {
          await wrapper.setProps({
            fields: [
              {
                key: "check",
                label: "Check all",
                checkbox: true,
                checkboxChecked: true,
                checkboxDisabled: true,
              },
              {
                key: "description",
                label: "Description",
              },
            ],
          });

          expect(wrapper.find(".dps-form-checkbox__input").attributes("disabled")).toBe("");
        });
      });
    });

    describe("hideHeader='true'", () => {
      const wrapper = mount(DpsTable, {
        props: {
          fields,
          items,
          hideHeader: true,
        },
      });

      test("thead element has necessary CSS class", () => {
        expect(wrapper.find("thead").classes("visually-hidden")).toBe(true);
      });
    });

    describe("Missing properties", () => {
      const wrapper = mount(DpsTable, {
        props: {
          fields: fields.map((item) => ({
            ...item,
            sortable: true,
          })),
          items: [
            {
              name: "Row 1",
              id: "505615cf-ef1d-45c5-814e",
              description: "Lorem ipsum dolor sit amet",
              version: "1.10",
              date: "2024-05-29T13:53+0000",
            },
            {
              name: "Row 2",
              id: "683fa785-8328-403d-af77",
              date: "2024-06-20T12:10+0000",
              version: "1.11",
            },
            {
              id: "76a8a3ce-acf6-4589-8cb3",
              name: "Row 3",
              description:
                "Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet",
              date: "2024-06-20T13:43+0000",
            },
          ],
        },
      });

      test("matches snapshot", () => {
        expect(wrapper.find("tbody").wrapperElement).toMatchSnapshot();
      });
    });

    describe("Custom template", () => {
      const wrapper = mount(DpsTable, {
        props: {
          fields,
          items,
        },
        slots: {
          "table-row": (props) => `
            <td>
              <div class="d-flex justify-content-between gap-2">
                <span class="text-nowrap fw-bold">${props.content.id}</span>

                <DpsActionMenu>
                  <li>Action 1</li>
                  <li>Action 2</li>
                </DpsActionMenu>
              </div>
            </td>
            <td>${props.content.name}</td>
            <td><div style="width: 600px">${props.content.description}</div></td>
            <td>${props.content.version}</td>
            <td>${props.content.date}</td>
          `,
        },
      });

      test("matches snapshot", () => {
        expect(unescapeHtml(wrapper.find("tbody").html())).toMatchSnapshot();
      });
    });

    describe("Collapsible rows", () => {
      const wrapper = mount(DpsTable, {
        props: {
          fields,
          items,
        },
        slots: {
          "table-row": (props) => `
            <td class="text-nowrap">${props.content.id}</td>
            <td>${props.content.name}</td>
            <td>${props.content.description}</td>
            <td>${props.content.version}</td>
            <td>${props.content.date}</td>`,
          "table-row-collapsible-content": (props) => `
            <pre>${JSON.stringify(props.content)}</pre>
          `,
        },
      });

      test("matches snapshot", () => {
        expect(unescapeHtml(wrapper.find("tbody").html())).toMatchSnapshot();
      });
    });
  });

  describe("Interactions:", () => {
    describe("Sorting", () => {
      const keys = [
        { key: "id", index: 0 },
        { key: "name", index: 1 },
        { key: "description", index: 2 },
        { key: "version", index: 3 },
        { key: "date", index: 4 },
      ];

      describe.each(keys)("Click on the $key header col", async ({ key, index }) => {
        const wrapper = mount(DpsTable, {
          props: {
            fields: fields.map((item) => ({
              ...item,
              sortable: item.key !== "description",
            })),
            items,
          },
        });

        const headerCols = wrapper.findAll("thead th");

        await headerCols[index].trigger("click");

        if (key !== "description") {
          test("... emits the update:sort-by event", () => {
            expect(wrapper.emitted("update:sort-by")).toBeTruthy();
            expect(wrapper.emitted("update:sort-by")[0][0]).toBe(key);
          });

          test("... emits the update:sort-desc event", () => {
            expect(wrapper.emitted("update:sort-desc")).toBeTruthy();
            expect(wrapper.emitted("update:sort-desc")[0][0]).toBe(false);
          });
        } else {
          test("... does not emit the update:sort-by event", () => {
            expect(wrapper.emitted("update:sort-by")).toBeFalsy();
          });

          test("... does not emit the update:sort-desc event", () => {
            expect(wrapper.emitted("update:sort-desc")).toBeFalsy();
          });
        }
      });

      describe("Click on the header col of an already sorted row", async () => {
        const wrapper = mount(DpsTable, {
          props: {
            fields: fields.map((item) => ({
              ...item,
              sortable: item.key !== "description",
            })),
            items,
            sortBy: "id",
          },
        });

        const headerCols = wrapper.findAll("thead th");

        await headerCols[0].trigger("click");

        test("... does not emit the update:sort-by event", () => {
          expect(wrapper.emitted("update:sort-by")).toBeFalsy();
        });

        test("... emits the update:sort-desc event", () => {
          expect(wrapper.emitted("update:sort-desc")).toBeTruthy();
          expect(wrapper.emitted("update:sort-desc")[0][0]).toBe(true);
        });
      });
    });

    describe("Checkbox", async () => {
      const fields = [
        {
          key: "check",
          label: "Check all",
          checkbox: true,
          checkboxChecked: false,
        },
        {
          key: "description",
          label: "Description",
        },
      ];

      const items = [
        {
          name: "Row 1",
          description: "Lorem ipsum dolor sit amet",
        },
        {
          name: "Row 2",
          description:
            "Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.",
        },
        {
          name: "Row 3",
          description:
            "Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet",
        },
      ];

      const wrapper = mount(DpsTable, {
        props: {
          fields,
          items,
        },
      });

      const headerCheckbox = wrapper.find("thead th .dps-form-checkbox__input");

      await headerCheckbox.trigger("change");

      test("Click on the header checkbox emits the change-checked event", () => {
        expect(wrapper.emitted("change-checked")).toBeTruthy();
        expect(wrapper.emitted("change-checked")[0][0]).toBe(0);
      });
    });
  });
});
