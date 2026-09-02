import type { PropType } from "vue";
export interface DpsFormCheckboxGroupOptionExtras {
    disabled?: boolean;
    readonly?: boolean;
    error?: boolean;
    tooltip?: string;
}
export type DpsFormCheckboxGroupOption = {
    [key: string]: string | boolean;
} & DpsFormCheckboxGroupOptionExtras;
export interface DpsFormCheckboxGroupData {
    selected: undefined | string[];
}
declare const _default: import("vue").DefineComponent<{
    /**
     * The unique identifier for the checkbox group (optional).
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * modelValue of the checkbox group.
     * @default undefined
     */
    modelValue: {
        type: PropType<string[]>;
        required: false;
        default: undefined;
    };
    /**
     * Name attribute of the checkboxes.
     * @default undefined
     */
    name: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Label for the checkbox group.
     * @default undefined
     */
    label: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Whether the label should be visually hidden.
     * @default false
     */
    hideLabel: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Array of checkbox data to be displayed.
     */
    options: {
        type: PropType<DpsFormCheckboxGroupOption[]>;
        required: true;
    };
    /**
     * Key to use for the checkbox values.
     * @default "value"
     */
    optionValue: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Key to use for the checkbox labels.
     * @default "label"
     */
    optionLabel: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Disables the checkbox group.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Checkboxes displayed in line.
     * @default false
     */
    inline: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Truncates the labels.
     * @default false
     */
    truncate: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Size of the checkboxes.
     * @default undefined
     */
    size: {
        type: PropType<"sm">;
        required: false;
        default: undefined;
    };
}, unknown, DpsFormCheckboxGroupData, {
    mappedOptions(): DpsFormCheckboxGroupOption[];
    uniqueId(): string;
}, {
    handleChange(value: string[]): void;
    getLabelContent(option: DpsFormCheckboxGroupOption): string;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * The unique identifier for the checkbox group (optional).
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * modelValue of the checkbox group.
     * @default undefined
     */
    modelValue: {
        type: PropType<string[]>;
        required: false;
        default: undefined;
    };
    /**
     * Name attribute of the checkboxes.
     * @default undefined
     */
    name: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Label for the checkbox group.
     * @default undefined
     */
    label: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Whether the label should be visually hidden.
     * @default false
     */
    hideLabel: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Array of checkbox data to be displayed.
     */
    options: {
        type: PropType<DpsFormCheckboxGroupOption[]>;
        required: true;
    };
    /**
     * Key to use for the checkbox values.
     * @default "value"
     */
    optionValue: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Key to use for the checkbox labels.
     * @default "label"
     */
    optionLabel: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Disables the checkbox group.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Checkboxes displayed in line.
     * @default false
     */
    inline: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Truncates the labels.
     * @default false
     */
    truncate: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Size of the checkboxes.
     * @default undefined
     */
    size: {
        type: PropType<"sm">;
        required: false;
        default: undefined;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    name: string;
    disabled: boolean;
    label: string;
    size: "sm";
    id: string;
    modelValue: string[];
    truncate: boolean;
    hideLabel: boolean;
    optionValue: string;
    optionLabel: string;
    inline: boolean;
}, {}>;
export default _default;
