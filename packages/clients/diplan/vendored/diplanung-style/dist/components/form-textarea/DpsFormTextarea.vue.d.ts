import type { PropType } from "vue";
declare const _default: import("vue").DefineComponent<{
    /**
     * ModelValue of the textarea.
     * @default undefined
     */
    modelValue: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Sets whether the textarea is resizable, and if so, in which directions.
     * @default false
     */
    resizable: {
        type: PropType<boolean | "vertical" | "horizontal">;
        required: false;
        default: boolean;
    };
    /**
     * Success state of the textarea.
     * @default false
     */
    success: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Error state of the textarea.
     * @default false
     */
    error: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * The number of visible text lines.
     * @default 3
     */
    rows: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    /**
     * Makes the textarea readonly.
     * @default false
     */
    readonly: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Disables the textarea.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}, unknown, unknown, {}, {
    handleInput(event: Event): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * ModelValue of the textarea.
     * @default undefined
     */
    modelValue: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Sets whether the textarea is resizable, and if so, in which directions.
     * @default false
     */
    resizable: {
        type: PropType<boolean | "vertical" | "horizontal">;
        required: false;
        default: boolean;
    };
    /**
     * Success state of the textarea.
     * @default false
     */
    success: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Error state of the textarea.
     * @default false
     */
    error: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * The number of visible text lines.
     * @default 3
     */
    rows: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    /**
     * Makes the textarea readonly.
     * @default false
     */
    readonly: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Disables the textarea.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    disabled: boolean;
    readonly: boolean;
    error: boolean;
    modelValue: string;
    success: boolean;
    resizable: boolean | "vertical" | "horizontal";
    rows: number;
}, {}>;
export default _default;
