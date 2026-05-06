import { type PropType } from "vue";
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
declare const _default: import("vue").DefineComponent<{
    /**
     * An array of field definition objects, each defining the properties of a table column.
     *
     * @default []
     */
    fields: {
        type: PropType<DpsTableField[]>;
        default(): never[];
    };
    /**
     * An array of data objects to be displayed in the table rows.
     * Each object should match the structure defined by the `fields` array.
     *
     * @default []
     */
    items: {
        type: PropType<DpsTableItem[]>;
        default(): never[];
    };
    /**
     * Whether to hide the table header while keeping it accessible for screen readers.
     * This is useful for visually minimalist tables while maintaining accessibility.
     *
     * @default false
     */
    hideHeader: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * The key  of the field currently being used for sorting the table.
     * Should correspond to one of the `key` values defined in the `fields` array.
     *
     * @default undefined
     */
    sortBy: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Indicates whether the sorting is in descending order.
     * When set to `true`, the table will be sorted in descending order; otherwise, it will be in ascending order.
     *
     * @default false
     */
    sortDesc: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * The starting column index where the collapsible content should be displayed.
     * This can create an offset within the table row for the collapsible section.
     *
     * @default undefined
     */
    collapseColstart: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
    /**
     * The number of columns the collapsible content should span when expanded.
     * Determines the width of the collapsible content section.
     *
     * @default undefined
     */
    collapseColspan: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
}, unknown, DpsTableData, {
    hasCustomTemplate(): boolean;
    stickyColumns(): number[];
    sortedItems(): DpsTableItem[];
    ariaSort(): {
        [key: string]: "none" | "descending" | "ascending" | undefined;
    };
}, {
    updateSorting(field: DpsTableField): void;
    observeTableWidth(): void;
    observeScrollPos(): void;
    setStickyStyles(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:sort-by" | "update:sort-desc" | "change-checked")[], "update:sort-by" | "update:sort-desc" | "change-checked", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * An array of field definition objects, each defining the properties of a table column.
     *
     * @default []
     */
    fields: {
        type: PropType<DpsTableField[]>;
        default(): never[];
    };
    /**
     * An array of data objects to be displayed in the table rows.
     * Each object should match the structure defined by the `fields` array.
     *
     * @default []
     */
    items: {
        type: PropType<DpsTableItem[]>;
        default(): never[];
    };
    /**
     * Whether to hide the table header while keeping it accessible for screen readers.
     * This is useful for visually minimalist tables while maintaining accessibility.
     *
     * @default false
     */
    hideHeader: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * The key  of the field currently being used for sorting the table.
     * Should correspond to one of the `key` values defined in the `fields` array.
     *
     * @default undefined
     */
    sortBy: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Indicates whether the sorting is in descending order.
     * When set to `true`, the table will be sorted in descending order; otherwise, it will be in ascending order.
     *
     * @default false
     */
    sortDesc: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * The starting column index where the collapsible content should be displayed.
     * This can create an offset within the table row for the collapsible section.
     *
     * @default undefined
     */
    collapseColstart: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
    /**
     * The number of columns the collapsible content should span when expanded.
     * Determines the width of the collapsible content section.
     *
     * @default undefined
     */
    collapseColspan: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
}>> & {
    "onUpdate:sort-by"?: ((...args: any[]) => any) | undefined;
    "onUpdate:sort-desc"?: ((...args: any[]) => any) | undefined;
    "onChange-checked"?: ((...args: any[]) => any) | undefined;
}, {
    collapseColspan: number;
    collapseColstart: number;
    items: DpsTableItem[];
    fields: DpsTableField[];
    hideHeader: boolean;
    sortBy: string;
    sortDesc: boolean;
}, {}>;
export default _default;
