<script lang="ts">
  import DpsFormCheckbox from "@/components/form-checkbox/DpsFormCheckbox.vue";
  import DpsTableRow from "@/components/table-row/DpsTableRow.vue";
  import { defineComponent, nextTick, type PropType } from "vue";

  export interface DpsTableField {
    /** Specifies the column’s unique identifier. */
    key: string;
    /** Defines the display label for the header column. */
    label: string;
    /** Sets the header checkbox as checked by default. */
    checkboxChecked?: boolean;
    /** Disables the header checkbox. */
    checkboxDisabled?: boolean;
    /** Displays a checkbox in the header column. */
    checkbox?: boolean;
    /** Applies a custom CSS class to the header column. */
    class?: string;
    /** Enables sorting functionality for the column. */
    sortable?: boolean;
    /** Fixes the column position to the left. */
    sticky?: boolean;
  }

  export interface DpsTableItem {
    [key: string]: unknown;
  }

  export interface DpsTableData {
    isScrollable: boolean;
    isScrolledToRight: boolean;
    isScrolledToLeft: boolean;
  }

  export default defineComponent({
    name: "DpsTable",
    components: { DpsTableRow, DpsFormCheckbox },
    props: {
      /**
       * An array of field definition objects, each defining the properties of a table column.
       *
       * @default []
       */
      fields: {
        type: Array as PropType<DpsTableField[]>,
        default() {
          return [];
        },
      },
      /**
       * An array of data objects to be displayed in the table rows.
       * Each object should match the structure defined by the `fields` array.
       *
       * @default []
       */
      items: {
        type: Array as PropType<DpsTableItem[]>,
        default() {
          return [];
        },
      },
      /**
       * Whether to hide the table header while keeping it accessible for screen readers.
       * This is useful for visually minimalist tables while maintaining accessibility.
       *
       * @default false
       */
      hideHeader: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * The key  of the field currently being used for sorting the table.
       * Should correspond to one of the `key` values defined in the `fields` array.
       *
       * @default undefined
       */
      sortBy: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Indicates whether the sorting is in descending order.
       * When set to `true`, the table will be sorted in descending order; otherwise, it will be in ascending order.
       *
       * @default false
       */
      sortDesc: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * The starting column index where the collapsible content should be displayed.
       * This can create an offset within the table row for the collapsible section.
       *
       * @default undefined
       */
      collapseColstart: {
        type: Number,
        required: false,
        default: undefined,
      },
      /**
       * The number of columns the collapsible content should span when expanded.
       * Determines the width of the collapsible content section.
       *
       * @default undefined
       */
      collapseColspan: {
        type: Number,
        required: false,
        default: undefined,
      },
    },
    emits: [
      /**
       * Emitted when the sortBy property changes.
       *
       * @event update:sort-by
       * @property {string} - The key of the field being sorted. Corresponds to the `key` property in the `fields` array.
       */
      "update:sort-by",
      /**
       * Emitted when the sortDesc property changes.
       *
       * @event update:sort-desc
       * @property {boolean} - Indicates the sort direction. `true` for descending order, `false` for ascending order.
       */
      "update:sort-desc",
      /**
       * Emitted when the status of a header checkbox changes.
       *
       * @event change-checked
       * @property {number} - The key of the field whose checkbox status was changed.
       */
      "change-checked",
    ],
    data(): DpsTableData {
      return {
        isScrollable: false,
        isScrolledToRight: false,
        isScrolledToLeft: true,
      };
    },
    computed: {
      hasCustomTemplate() {
        return !!this.$slots["table-row"];
      },
      stickyColumns() {
        return this.fields.reduce((acc, field, index) => {
          if (field.sticky) {
            acc.push(index);
          }

          return acc;
        }, [] as number[]);
      },
      sortedItems() {
        const keys = this.fields.map((field) => field.key);

        if (this.sortBy === undefined || !keys.includes(this.sortBy)) {
          return this.items;
        }

        const isValidDate = (dateString: unknown) => {
          // Versuchen, das Datum zu parsen
          const parsedDate = new Date(dateString as string);

          // Überprüfen, ob der String erfolgreich geparst wurde und das Datum valide ist
          return !isNaN(parsedDate.getTime());
        };

        return this.items.slice().sort((a, b) => {
          const sortBy = this.sortBy as string;
          const valA = a[sortBy];
          const valB = b[sortBy];

          if (isValidDate(valA) && isValidDate(valB)) {
            const dateValA = String(valA);
            const dateValB = String(valB);

            return this.sortDesc
              ? new Date(dateValB).getTime() - new Date(dateValA).getTime()
              : new Date(dateValA).getTime() - new Date(dateValB).getTime();
          }

          const strA = (valA || "").toString().toLowerCase();
          const strB = (valB || "").toString().toLowerCase();

          return this.sortDesc ? strB.localeCompare(strA) : strA.localeCompare(strB);
        });
      },
      ariaSort() {
        return this.fields.reduce(
          (obj, field) => (
            (obj[field.key] = field.sortable
              ? this.sortBy === field.key
                ? this.sortDesc
                  ? "descending"
                  : "ascending"
                : "none"
              : undefined),
            obj
          ),
          {} as { [key: string]: undefined | "descending" | "ascending" | "none" },
        );
      },
    },
    watch: {
      items: {
        handler() {
          nextTick(this.setStickyStyles);
        },
        deep: true,
      },
      isScrollable() {
        this.setStickyStyles();
      },
    },
    mounted() {
      this.observeTableWidth();
      this.observeScrollPos();
    },
    methods: {
      updateSorting(field: DpsTableField) {
        if (!field.sortable) {
          return;
        }

        if (field.key !== this.sortBy) {
          this.$emit("update:sort-by", field.key);
          this.$emit("update:sort-desc", false);
        } else {
          this.$emit("update:sort-desc", !this.sortDesc);
        }
      },
      observeTableWidth() {
        const tableEl = this.$refs.table as HTMLElement;
        const tableWrapperEl = this.$refs.tableWrapper as HTMLElement;

        const resizeObserver = new ResizeObserver(() => {
          if (tableEl.clientWidth && tableWrapperEl.clientWidth) {
            this.isScrollable = tableEl.clientWidth > tableWrapperEl.clientWidth;
          }
        });

        resizeObserver.observe(tableWrapperEl);
        resizeObserver.observe(tableEl);
      },
      observeScrollPos() {
        const container = this.$refs.tableWrapper as HTMLElement;

        container.addEventListener("scroll", () => {
          this.isScrolledToRight =
            container.scrollWidth - container.scrollLeft - container.clientWidth < 2;
          this.isScrolledToLeft = container.scrollLeft < 2;
        });
      },
      setStickyStyles() {
        const tableEl = this.$refs.table as HTMLElement;
        const tableWrapperEl = this.$refs.tableWrapper as HTMLElement;

        if (this.stickyColumns.length === 0) {
          return;
        }

        // Reset horizontal scroll position
        tableWrapperEl.scrollLeft = 0;

        const rows = tableEl.querySelectorAll("tr");

        for (const row of Array.from(rows)) {
          const cols = row.querySelectorAll("th, td") as NodeListOf<HTMLTableColElement>;

          for (const [colIndex, col] of Array.from(cols).entries()) {
            col.style.removeProperty("left");
            col.removeAttribute("data-sticky");

            if (this.stickyColumns.includes(+colIndex)) {
              col.setAttribute("data-sticky", "");
              col.style.left =
                +colIndex !== this.stickyColumns[0]
                  ? `${cols[colIndex - 1].getBoundingClientRect().width + 1}px`
                  : `${col.offsetLeft}px`;
            }
          }
        }
      },
    },
  });
</script>

<template>
  <div
    class="dps-table"
    :class="{
      'dps-table--scroll-shadow-right': isScrollable && !isScrolledToRight,
      'dps-table--scroll-shadow-left': isScrollable && !isScrolledToLeft,
      'dps-table--sticky': stickyColumns.length > 0,
    }"
  >
    <div ref="tableWrapper" class="table-responsive">
      <table ref="table" class="table">
        <thead :class="{ 'visually-hidden': hideHeader }">
          <tr>
            <template v-for="(field, key) in fields" :key="'th-' + key">
              <th
                :class="field.class"
                :title="
                  field.sortable
                    ? `Reihenfolge der Spalte &quot;${field.label}&quot; ändern`
                    : undefined
                "
                scope="col"
                :aria-colindex="key + 1"
                :aria-sort="ariaSort[field.key]"
                :tabindex="field.sortable ? '0' : undefined"
                @click="updateSorting(field)"
              >
                <DpsFormCheckbox
                  v-if="field.checkbox"
                  v-model="field.checkboxChecked"
                  :tooltip="field.label"
                  :hide-label="true"
                  :disabled="field.checkboxDisabled"
                  @update:model-value="$emit('change-checked', key)"
                >
                  {{ field.label }}
                </DpsFormCheckbox>

                <div v-else class="dps-table__header-label">
                  {{ field.label }}

                  <svg
                    v-if="field.sortable"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M4.19526 6.0286C3.93491 6.28895 3.93491 6.71106 4.19526 6.97141C4.45561 7.23175 4.87772 7.23175 5.13807 6.97141L8 4.10948L10.8619 6.97141C11.1223 7.23175 11.5444 7.23176 11.8047 6.97141C12.0651 6.71106 12.0651 6.28895 11.8047 6.0286L8.47141 2.69526C8.34638 2.57024 8.17681 2.5 8 2.5C7.82319 2.5 7.65362 2.57024 7.5286 2.69526L4.19526 6.0286Z"
                      :fill="sortBy === field.key && !sortDesc ? '#04071A' : '#C8CACC'"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.8047 10.9714C12.0651 10.7111 12.0651 10.289 11.8047 10.0286C11.5444 9.76829 11.1223 9.76829 10.8619 10.0286L8 12.8906L5.13807 10.0286C4.87772 9.76829 4.45561 9.76829 4.19526 10.0286C3.93491 10.289 3.93491 10.7111 4.19526 10.9714L7.5286 14.3048C7.78895 14.5651 8.21106 14.5651 8.47141 14.3048L11.8047 10.9714Z"
                      :fill="sortBy === field.key && sortDesc ? '#04071A' : '#C8CACC'"
                    />
                  </svg>
                </div>
              </th>
            </template>
          </tr>
        </thead>

        <tbody>
          <template v-if="hasCustomTemplate">
            <DpsTableRow
              v-for="(item, key) in sortedItems"
              :key="'table-row-' + key"
              :collapse-colspan="collapseColspan ?? fields.length"
              :collapse-colstart="collapseColstart"
            >
              <!-- @slot table-row - Table row content -->
              <slot name="table-row" :content="item" />

              <template v-if="$slots['table-row-collapsible-content']" #collapsible-content>
                <!-- @slot table-row-collapsible-content - Table row collapsible content -->
                <slot name="table-row-collapsible-content" :content="item" />
              </template>
            </DpsTableRow>
          </template>
          <template v-else>
            <tr v-for="(item, itemKey) in sortedItems" :key="itemKey">
              <td v-for="(field, fieldIndex) in fields" :key="itemKey + '-' + fieldIndex">
                {{ item[field.key] ?? "-" }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
