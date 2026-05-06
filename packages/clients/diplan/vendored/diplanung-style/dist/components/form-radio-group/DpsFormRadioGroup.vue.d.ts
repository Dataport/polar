import type { PropType } from "vue";
export interface DpsFormRadioGroupOptionExtras {
    disabled?: boolean;
    readonly?: boolean;
    error?: boolean;
    tooltip?: string;
}
export type DpsFormRadioGroupOption = {
    [key: string]: string | boolean;
} & DpsFormRadioGroupOptionExtras;
export interface DpsFormRadioGroupData {
    selected: undefined | string | boolean | number;
}
declare const _default: import("vue").DefineComponent<{
    /**
     * The unique identifier for the radio group (optional).
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * ModelValue of the radio group.
     * @default undefined
     */
    modelValue: {
        type: (StringConstructor | BooleanConstructor | NumberConstructor)[];
        required: false;
        default: undefined;
    };
    /**
     * Name of the radio inputs.
     */
    name: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Label for the radio group.
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
     * Array of options to be displayed.
     */
    options: {
        type: PropType<DpsFormRadioGroupOption[]>;
        required: true;
    };
    /**
     * Which key to use for the option value.
     * @default "value"
     */
    optionValue: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Which key to use for the option label.
     * @default "label"
     */
    optionLabel: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Whether the radio group should be disabled.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Whether the radio inputs should be displayed in line.
     * @default false
     */
    inline: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Whether the labels should be truncated.
     * @default false
     */
    truncate: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}, unknown, DpsFormRadioGroupData, {
    mappedOptions(): DpsFormRadioGroupOption[];
    uniqueId(): string;
}, {
    handleChange(event: string): void;
    getLabelContent(option: DpsFormRadioGroupOption): string;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * The unique identifier for the radio group (optional).
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * ModelValue of the radio group.
     * @default undefined
     */
    modelValue: {
        type: (StringConstructor | BooleanConstructor | NumberConstructor)[];
        required: false;
        default: undefined;
    };
    /**
     * Name of the radio inputs.
     */
    name: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Label for the radio group.
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
     * Array of options to be displayed.
     */
    options: {
        type: PropType<DpsFormRadioGroupOption[]>;
        required: true;
    };
    /**
     * Which key to use for the option value.
     * @default "value"
     */
    optionValue: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Which key to use for the option label.
     * @default "label"
     */
    optionLabel: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Whether the radio group should be disabled.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Whether the radio inputs should be displayed in line.
     * @default false
     */
    inline: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Whether the labels should be truncated.
     * @default false
     */
    truncate: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    disabled: boolean;
    label: string;
    id: string;
    modelValue: string | number | boolean;
    truncate: boolean;
    hideLabel: boolean;
    optionValue: string;
    optionLabel: string;
    inline: boolean;
}, {}>;
export default _default;
