import type { PropType } from "vue";
declare const _default: import("vue").DefineComponent<{
    /**
     * The unique identifier for the checkbox (optional).
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * modelValue of the checkbox.
     * @default undefined
     */
    modelValue: {
        type: PropType<string | boolean | number | string[] | boolean[] | number[]>;
        required: false;
        default: undefined;
    };
    /**
     * Name attribute of the input.
     * @default undefined
     */
    name: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Value attribute of the input.
     * @default true
     */
    value: {
        type: (StringConstructor | BooleanConstructor | NumberConstructor)[];
        required: false;
        default: boolean;
    };
    /**
     * Title attribute of the component.
     * @default undefined
     */
    tooltip: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Disables the checkbox.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    readonly: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    error: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Checkbox is displayed as block.
     * @default false
     */
    block: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Truncates the label.
     * @default false
     */
    truncate: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Hides the label.
     * @default false
     */
    hideLabel: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * The size of the component.
     * @default undefined
     */
    size: {
        type: PropType<"sm">;
        required: false;
        default: undefined;
    };
}, unknown, unknown, {
    uniqueId(): string;
    isChecked(): boolean;
}, {
    handleChange(event: Event): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * The unique identifier for the checkbox (optional).
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * modelValue of the checkbox.
     * @default undefined
     */
    modelValue: {
        type: PropType<string | boolean | number | string[] | boolean[] | number[]>;
        required: false;
        default: undefined;
    };
    /**
     * Name attribute of the input.
     * @default undefined
     */
    name: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Value attribute of the input.
     * @default true
     */
    value: {
        type: (StringConstructor | BooleanConstructor | NumberConstructor)[];
        required: false;
        default: boolean;
    };
    /**
     * Title attribute of the component.
     * @default undefined
     */
    tooltip: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Disables the checkbox.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    readonly: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    error: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Checkbox is displayed as block.
     * @default false
     */
    block: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Truncates the label.
     * @default false
     */
    truncate: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Hides the label.
     * @default false
     */
    hideLabel: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * The size of the component.
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
    size: "sm";
    id: string;
    readonly: boolean;
    error: boolean;
    modelValue: string | number | boolean | string[] | boolean[] | number[];
    value: string | number | boolean;
    tooltip: string;
    block: boolean;
    truncate: boolean;
    hideLabel: boolean;
}, {}>;
export default _default;
