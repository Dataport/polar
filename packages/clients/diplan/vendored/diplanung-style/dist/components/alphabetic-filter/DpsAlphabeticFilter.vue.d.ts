import type { PropType } from "vue";
declare const _default: import("vue").DefineComponent<{
    /**
     * Array of available filter options.
     * @default ["A-G", "H-N", "O-U", "V-Z"]
     */
    options: {
        type: PropType<string[]>;
        default: () => string[];
        required: false;
    };
    /**
     * The modelValue
     * @default undefined
     */
    modelValue: {
        type: StringConstructor;
        default: undefined;
        required: false;
    };
    /**
     * Requires some option to be active.
     * @default false
     */
    required: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    /**
     * Disables the component.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
}, unknown, unknown, {}, {
    selectOption(value: string): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Array of available filter options.
     * @default ["A-G", "H-N", "O-U", "V-Z"]
     */
    options: {
        type: PropType<string[]>;
        default: () => string[];
        required: false;
    };
    /**
     * The modelValue
     * @default undefined
     */
    modelValue: {
        type: StringConstructor;
        default: undefined;
        required: false;
    };
    /**
     * Requires some option to be active.
     * @default false
     */
    required: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    /**
     * Disables the component.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    disabled: boolean;
    required: boolean;
    options: string[];
    modelValue: string;
}, {}>;
export default _default;
