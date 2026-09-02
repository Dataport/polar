declare const _default: import("vue").DefineComponent<{
    /**
     * The unique identifier for the input element.
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * The current value of the toggle switch (on/off).
     * @default false
     */
    modelValue: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * The title attribute for the input element, shown as a tooltip on hover.
     * @default undefined
     */
    title: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Disables the toggle switch when set to true.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * An ARIA label for accessibility, describing the input element.
     * @default undefined
     */
    ariaLabel: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * ID of an element that labels the input element.
     * @default undefined
     */
    ariaLabelledby: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * ID of an element that describes the input element.
     * @default undefined
     */
    ariaDescribedby: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Size of the toggle switch. Can be 'sm' for small, 'md' for medium, or undefined for default.
     * @default undefined
     */
    size: {
        type: StringConstructor;
        required: false;
        default: undefined;
        validator(value: unknown): boolean;
    };
}, any, any, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * The unique identifier for the input element.
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * The current value of the toggle switch (on/off).
     * @default false
     */
    modelValue: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * The title attribute for the input element, shown as a tooltip on hover.
     * @default undefined
     */
    title: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Disables the toggle switch when set to true.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * An ARIA label for accessibility, describing the input element.
     * @default undefined
     */
    ariaLabel: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * ID of an element that labels the input element.
     * @default undefined
     */
    ariaLabelledby: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * ID of an element that describes the input element.
     * @default undefined
     */
    ariaDescribedby: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Size of the toggle switch. Can be 'sm' for small, 'md' for medium, or undefined for default.
     * @default undefined
     */
    size: {
        type: StringConstructor;
        required: false;
        default: undefined;
        validator(value: unknown): boolean;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    disabled: boolean;
    title: string;
    size: string;
    id: string;
    modelValue: boolean;
    ariaDescribedby: string;
    ariaLabel: string;
    ariaLabelledby: string;
}, {}>;
export default _default;
