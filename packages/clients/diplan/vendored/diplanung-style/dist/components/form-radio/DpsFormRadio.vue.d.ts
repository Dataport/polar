declare const _default: import("vue").DefineComponent<{
    /**
     * Unique ID for the radio (optional)
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * ModelValue of the radio.
     * @default undefined
     */
    modelValue: {
        type: (StringConstructor | BooleanConstructor | NumberConstructor)[];
        required: false;
        default: undefined;
    };
    /**
     * Name attribute of the radio input.
     */
    name: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Value of the radio input.
     */
    value: {
        type: (StringConstructor | BooleanConstructor | NumberConstructor)[];
        required: true;
    };
    /**
     * Disables the radio input.
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
     * Displays the component as a block.
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
}, unknown, unknown, {
    uniqueId(): string;
    isChecked(): boolean;
}, {
    handleChange(event: Event): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Unique ID for the radio (optional)
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * ModelValue of the radio.
     * @default undefined
     */
    modelValue: {
        type: (StringConstructor | BooleanConstructor | NumberConstructor)[];
        required: false;
        default: undefined;
    };
    /**
     * Name attribute of the radio input.
     */
    name: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Value of the radio input.
     */
    value: {
        type: (StringConstructor | BooleanConstructor | NumberConstructor)[];
        required: true;
    };
    /**
     * Disables the radio input.
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
     * Displays the component as a block.
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
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    disabled: boolean;
    id: string;
    readonly: boolean;
    error: boolean;
    modelValue: string | number | boolean;
    block: boolean;
    truncate: boolean;
    hideLabel: boolean;
}, {}>;
export default _default;
