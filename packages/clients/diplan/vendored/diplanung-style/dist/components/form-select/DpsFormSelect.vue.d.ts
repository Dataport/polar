import type { PropType } from "vue";
export interface DpsFormSelectOption {
    [key: string]: string | number;
}
export interface DpsFormSelectData {
    selected: undefined | string | number | string[] | number[] | DpsFormSelectOption[] | DpsFormSelectOption;
    multiselectEl: null | HTMLDivElement;
}
declare const _default: import("vue").DefineComponent<{
    /**
     * Unique ID of the select (optional).
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Size of the select.
     * @default undefined
     */
    size: {
        type: PropType<"sm">;
        required: false;
        default: undefined;
    };
    /**
     * Style variant of the select.
     * @default undefined
     */
    variant: {
        type: PropType<"filter" | "simple">;
        required: false;
        default: undefined;
    };
    /**
     * Hides tags for selected elements (only for multiple).
     * @default false
     */
    hideTags: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * ModelValue for the select.
     * @default undefined
     */
    modelValue: {
        type: PropType<string | number | string[] | number[] | DpsFormSelectOption[] | DpsFormSelectOption>;
        required: false;
        default: undefined;
    };
    /**
     * Key for the label text in the option object.
     * @default "label"
     */
    optionLabel: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Key for the value in the option object.
     * @default "value"
     */
    optionValue: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Makes the select readonly.
     * @default false
     */
    readonly: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Requires a value to be selected.
     * @default false
     */
    required: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Title attribute of the select.
     * @default props.placeholder
     */
    title: {
        type: StringConstructor;
        required: false;
        default(props: {
            placeholder?: string;
        }): string | undefined;
    };
    /**
     * Label for the select.
     * @default undefined
     */
    label: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Icon placed before the select in the simple variant.
     * @default undefined
     */
    icon: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Success state of the select.
     * @default false
     */
    success: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Error state of the select.
     * @default false
     */
    error: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Aligns the dropdown left or right.
     * @default "start"
     */
    align: {
        type: PropType<"start" | "end">;
        required: false;
        default: string;
    };
    /**
     * Array of available options: Objects, Strings or Integers. If array of objects, visible label will default to option.label.
     */
    options: {
        type: PropType<DpsFormSelectOption[] | string[] | number[]>;
        required: true;
    };
    /**
     * Clear the search input after `select()`. Use only when multiple is true.
     * @default true
     */
    clearOnSelect: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Enable/disable closing after selecting an option
     * @default true
     */
    closeOnSelect: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Enable/disable the multiselect.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Number of allowed selected options.
     * @default undefined
     */
    max: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Equivalent to the multiple attribute on a `<select>` input.
     * @default false
     */
    multiple: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Fixed opening direction (instead of auto). Options are "above"/"top" or "below"/"bottom"
     * @default ""
     */
    openDirection: {
        type: PropType<"" | "above" | "top" | "below" | "bottom">;
        required: false;
        default: string;
    };
    /**
     * Equivalent to the placeholder attribute on a `<select>` input.
     * @default "Bitte wählen"
     */
    placeholder: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Selects the first option if initial value is empty
     * @default false
     */
    preselectFirst: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * If set to true, will preserve the search query when opening/closing the component.
     * @default false
     */
    preserveSearch: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Add / removes search input.
     * @default false
     */
    searchable: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}, unknown, DpsFormSelectData, {
    uniqueId(): string;
    multiselectOptions(): DpsFormSelectOption[];
}, {
    improveMultiselectAccessibility(): void;
    improveContentAccessibility(): void;
    improveElementAccessibility(): void;
    handleSelect(event: DpsFormSelectOption): void;
    handleRemove(event: DpsFormSelectOption): void;
    handleOpen(event: string): void;
    handleClose(event: DpsFormSelectOption | null): void;
    handleTag(event: string): void;
    handleSearchChange(event: string): void;
    setSearchInputWidth(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("select" | "tag" | "close" | "update:modelValue" | "remove" | "search-change" | "open")[], "select" | "tag" | "close" | "update:modelValue" | "remove" | "search-change" | "open", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Unique ID of the select (optional).
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Size of the select.
     * @default undefined
     */
    size: {
        type: PropType<"sm">;
        required: false;
        default: undefined;
    };
    /**
     * Style variant of the select.
     * @default undefined
     */
    variant: {
        type: PropType<"filter" | "simple">;
        required: false;
        default: undefined;
    };
    /**
     * Hides tags for selected elements (only for multiple).
     * @default false
     */
    hideTags: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * ModelValue for the select.
     * @default undefined
     */
    modelValue: {
        type: PropType<string | number | string[] | number[] | DpsFormSelectOption[] | DpsFormSelectOption>;
        required: false;
        default: undefined;
    };
    /**
     * Key for the label text in the option object.
     * @default "label"
     */
    optionLabel: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Key for the value in the option object.
     * @default "value"
     */
    optionValue: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Makes the select readonly.
     * @default false
     */
    readonly: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Requires a value to be selected.
     * @default false
     */
    required: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Title attribute of the select.
     * @default props.placeholder
     */
    title: {
        type: StringConstructor;
        required: false;
        default(props: {
            placeholder?: string;
        }): string | undefined;
    };
    /**
     * Label for the select.
     * @default undefined
     */
    label: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Icon placed before the select in the simple variant.
     * @default undefined
     */
    icon: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Success state of the select.
     * @default false
     */
    success: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Error state of the select.
     * @default false
     */
    error: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Aligns the dropdown left or right.
     * @default "start"
     */
    align: {
        type: PropType<"start" | "end">;
        required: false;
        default: string;
    };
    /**
     * Array of available options: Objects, Strings or Integers. If array of objects, visible label will default to option.label.
     */
    options: {
        type: PropType<DpsFormSelectOption[] | string[] | number[]>;
        required: true;
    };
    /**
     * Clear the search input after `select()`. Use only when multiple is true.
     * @default true
     */
    clearOnSelect: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Enable/disable closing after selecting an option
     * @default true
     */
    closeOnSelect: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Enable/disable the multiselect.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Number of allowed selected options.
     * @default undefined
     */
    max: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Equivalent to the multiple attribute on a `<select>` input.
     * @default false
     */
    multiple: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Fixed opening direction (instead of auto). Options are "above"/"top" or "below"/"bottom"
     * @default ""
     */
    openDirection: {
        type: PropType<"" | "above" | "top" | "below" | "bottom">;
        required: false;
        default: string;
    };
    /**
     * Equivalent to the placeholder attribute on a `<select>` input.
     * @default "Bitte wählen"
     */
    placeholder: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Selects the first option if initial value is empty
     * @default false
     */
    preselectFirst: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * If set to true, will preserve the search query when opening/closing the component.
     * @default false
     */
    preserveSearch: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Add / removes search input.
     * @default false
     */
    searchable: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}>> & {
    onSelect?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    onTag?: ((...args: any[]) => any) | undefined;
    onClose?: ((...args: any[]) => any) | undefined;
    onRemove?: ((...args: any[]) => any) | undefined;
    "onSearch-change"?: ((...args: any[]) => any) | undefined;
    onOpen?: ((...args: any[]) => any) | undefined;
}, {
    icon: string;
    disabled: boolean;
    required: boolean;
    label: string;
    title: string;
    size: "sm";
    id: string;
    readonly: boolean;
    error: boolean;
    modelValue: string | number | string[] | number[] | DpsFormSelectOption | DpsFormSelectOption[];
    success: boolean;
    variant: "filter" | "simple";
    optionValue: string;
    optionLabel: string;
    placeholder: string;
    max: number;
    hideTags: boolean;
    align: "start" | "end";
    clearOnSelect: boolean;
    closeOnSelect: boolean;
    multiple: boolean;
    openDirection: "" | "above" | "top" | "below" | "bottom";
    preselectFirst: boolean;
    preserveSearch: boolean;
    searchable: boolean;
}, {}>;
export default _default;
