import DpsActionMenu from "@/components/action-menu/DpsActionMenu.vue";
import DpsTable from "./DpsTable.vue";
import { BADGE } from "@geometricpanda/storybook-addon-badges";
import { ref } from "vue";
import DpsFormCheckbox from "@/components/form-checkbox/DpsFormCheckbox.vue";
import moment from "moment";
import { setStickyColumnStyles } from "@/services/table.ts";

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

const meta = {
  title: "Vue/Table",
  component: DpsTable,
  argTypes: {},
  render: (args) => ({
    components: { DpsTable },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 32px; display: flex;">
        <DpsTable v-bind="args" style=" width: 100%; max-width: 800px; margin: auto;" />
      </div>`,
  }),
  parameters: {
    badges: [BADGE.EXPERIMENTAL],
    layout: "fullscreen",
  },
};

export default meta;

export const Default = {
  args: {
    fields,
    items,
  },
};

export const Sortable = {
  render: (args) => ({
    components: { DpsTable },
    setup() {
      const sortBy = ref(null);
      const sortDesc = ref(false);

      return { args, sortBy, sortDesc };
    },
    template: `
      <div style="padding: 32px; display: flex; flex-direction: column; gap: 32px;">
        <DpsTable v-bind="args" v-model:sort-by="sortBy" v-model:sort-desc="sortDesc" style=" width: 100%; max-width: 800px; margin: auto;" />
        
        <pre style="margin: auto">sortBy: {{ sortBy }} | sortDesc: {{ sortDesc }}</pre>
      </div>
    `,
  }),
  args: {
    fields: fields.map((item) => ({
      ...item,
      sortable: item.key !== "description",
    })),
    items,
  },
};

export const StickyColumn = {
  render: (args) => ({
    components: { DpsTable, DpsActionMenu },
    setup() {
      return { args };
    },
    template: `
      <div style="padding: 32px; display: flex;">
        <DpsTable v-bind="args" style=" width: 100%; max-width: 1200px; margin: auto;">
          <template #table-row="{ content }">
            <td class="text-nowrap">{{ content.id }}</td>
            <td class="text-nowrap">{{ content.name }}</td>
            <td><div style="width: 1000px">{{ content.description }}</div></td>
            <td>{{ content.version }}</td>
            <td class="text-nowrap">{{ content.date }}</td>
          </template>
        </DpsTable>
      </div>`,
  }),
  args: {
    fields: fields.map((item) => ({
      ...item,
      sticky: item.key === "id",
    })),
    items,
  },
};

export const StickyColumnActionMenu = {
  render: (args) => ({
    components: { DpsTable, DpsActionMenu },
    setup() {
      const actionMenuOpen = ref("");
      const tableEl = ref(null);

      const handleShow = (event, contentId) => {
        setStickyColumnStyles(tableEl.value.$el);

        actionMenuOpen.value = contentId;
      };

      const handleHide = () => {
        actionMenuOpen.value = "";
      };

      return { args, tableEl, moment, actionMenuOpen, handleShow, handleHide };
    },
    template: `
      <div style="padding: 32px; display: flex;">
        <DpsTable v-bind="args" ref="tableEl" style=" width: 100%; max-width: 1200px; margin: auto;">
          <template #table-row="{ content }">
            <td :class="{ active : actionMenuOpen === content.id }">
              <div class="sticky-wrapper">
                <div class="d-flex justify-content-between gap-2 w-100">
                  <span class="text-nowrap fw-bold">{{ content.id }}</span>
                  
                  <DpsActionMenu @show="handleShow($event, content.id)" @hide="handleHide">
                    <li>Action 1</li>
                    <li>Action 2</li>
                  </DpsActionMenu>
                </div>
              </div>
            </td>
            <td class="text-nowrap">{{ content.name }}</td>
            <td><div style="width: 1000px">{{ content.description }}</div></td>
            <td>{{ content.version }}</td>
            <td class="text-nowrap">{{ moment(content.date).format("DD.MM.YYYY, HH:mm") }}</td>
          </template>
        </DpsTable>
      </div>`,
  }),
  args: {
    fields: fields.map((item) => ({
      ...item,
      sticky: item.key === "id",
    })),
    items,
  },
};

export const Checkbox = {
  render: (args) => ({
    components: { DpsTable, DpsFormCheckbox },
    setup() {
      const handleChangeChecked = (key) => {
        const value = args.fields[key].checkboxChecked;

        for (const item of args.items) {
          item.checked = value;
        }
      };

      const handleCheck = () => {
        let checked = 0;

        for (const item of args.items) {
          if (item.checked) {
            checked++;
          }
        }

        args.fields[0].checkboxChecked = checked === items.length;
      };

      return { args, handleCheck, handleChangeChecked };
    },
    template: `
      <div style="padding: 32px; display: flex;">
        <DpsTable v-bind="args" style=" width: 100%; max-width: 800px; margin: auto;" @change-checked="handleChangeChecked">
          <template #table-row="{ content }">
            <td>
              <DpsFormCheckbox v-model="content.checked" hide-label @update:model-value="handleCheck">
                Check
              </DpsFormCheckbox>
            </td>
            <td>{{ content.description }}</td>
          </template>
        </DpsTable>
      </div>
    `,
  }),
  args: {
    fields: [
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
    ],
    items: [
      {
        checked: false,
        description: "Lorem ipsum dolor sit amet",
      },
      {
        checked: true,
        description:
          "Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.",
      },
      {
        checked: false,
        description:
          "Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet",
      },
    ],
  },
};

export const HideHeader = {
  args: {
    fields: fields,
    items: items,
    hideHeader: true,
  },
};

export const MissingProperties = {
  render: (args) => ({
    components: { DpsTable },
    setup() {
      const sortBy = ref(null);
      const sortDesc = ref(false);

      return { args, sortBy, sortDesc };
    },
    template: `
      <div style="padding: 32px; display: flex; flex-direction: column; gap: 32px;">
        <DpsTable v-bind="args" v-model:sort-by="sortBy" v-model:sort-desc="sortDesc" style=" width: 100%; max-width: 800px; margin: auto;" />
        
        <pre style="margin: auto">sortBy: {{ sortBy }} | sortDesc: {{ sortDesc }}</pre>
      </div>
    `,
  }),
  args: {
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
        date: "2024-06-10T09:23+0000",
      },
    ],
  },
};

export const CustomTemplate = {
  render: (args) => ({
    components: { DpsTable, DpsActionMenu },
    setup() {
      return { args, moment };
    },
    template: `
      <div style="padding: 32px; display: flex;">
        <DpsTable v-bind="args" ref="tableEl" style=" width: 100%; max-width: 1800px; margin: auto;">
          <template #table-row="{ content }">
            <td><span class="text-nowrap fw-bold">{{ content.id }}</span></td>
            <td class="text-nowrap">{{ content.name }}</td>
            <td><div style="width: 600px">{{ content.description }}</div></td>
            <td>{{ content.version }}</td>
            <td class="text-nowrap">{{ moment(content.date).format("DD.MM.YYYY, HH:mm") }}</td>
          </template>
        </DpsTable>
      </div>`,
  }),
  args: {
    fields,
    items,
  },
};

export const CollapsibleRows = {
  args: {
    fields,
    items,
  },
  render: (args) => ({
    components: { DpsTable },
    setup() {
      return { args, moment };
    },
    template: `
      <div style="padding: 32px; display: flex;">
        <DpsTable v-bind="args" style=" width: 100%; max-width: 800px; margin: auto;">
          <template #table-row="{ content }">
            <td class="text-nowrap">{{ content.id }}</td>
            <td>{{ content.name }}</td>
            <td>{{ content.description }}</td>
            <td>{{ content.version }}</td>
            <td>{{ moment(content.date).format("DD.MM.YYYY, HH:mm") }}</td>
          </template>
          <template #table-row-collapsible-content="{ content }">
            <pre style="white-space: break-spaces">{{ content }}</pre>
          </template>
        </DpsTable>
      </div>
    `,
  }),
};

export const CollapsibleRowsColspanColstart = {
  args: {
    fields,
    items,
    collapseColstart: 1,
    collapseColspan: 4,
  },
  render: CollapsibleRows.render,
};
