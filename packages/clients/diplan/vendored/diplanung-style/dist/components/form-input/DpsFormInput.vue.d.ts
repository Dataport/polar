import type { PropType } from "vue";
declare const _default: import("vue").DefineComponent<{
    /**
     * Unique ID of the input field.
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * ModelValue of the input.
     * @default undefined
     */
    modelValue: {
        type: (StringConstructor | NumberConstructor)[];
        required: false;
        default: undefined;
    };
    /**
     * Icon displayed at the end of the input field.
     * @default undefined
     */
    icon: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Placeholder text.
     * @default undefined
     */
    placeholder: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Title attribute of the input.
     * @default undefined
     */
    title: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Makes the field readonly.
     * @default false
     */
    readonly: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Disables the field.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * The maximum string length that the user can enter.
     * @default -1
     */
    maxlength: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    /**
     * The type of the input field.
     * @default "text"
     */
    type: {
        type: PropType<"text" | "url" | "email" | "number" | "search">;
        required: false;
        default: string;
    };
    /**
     * The step attribute specifying the granularity number values have to
     * adhere to.
     * @default 1
     */
    step: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    /**
     * The minimum value to accept for this input.
     * @default undefined
     */
    min: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
    /**
     * The maximum value to accept for this input.
     * @default undefined
     */
    max: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Pattern the value must match to be valid.
     * @default undefined
     */
    pattern: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Required field.
     * @default false
     */
    required: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Aria label for the input.
     * @default undefined
     */
    ariaLabel: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * ID of the element that labels the input.
     * @default undefined
     */
    ariaLabelledby: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * ID of the element that describes the input.
     * @default undefined
     */
    ariaDescribedby: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Vertical size of the input field.
     * @default undefined
     */
    size: {
        type: PropType<"sm">;
        required: false;
        default: undefined;
    };
    /**
     * Displays the success state.
     * @default false
     */
    success: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Displays the error state.
     * @default false
     */
    error: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}, unknown, unknown, {
    iconName(): string | undefined;
    showSearchCancelButton(): boolean;
}, {
    focus(): void;
    cancelSearch(): void;
    handleInput(event: Event): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("blur" | "focus" | "keydown" | "keyup" | "update:modelValue")[], "blur" | "focus" | "keydown" | "keyup" | "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Unique ID of the input field.
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * ModelValue of the input.
     * @default undefined
     */
    modelValue: {
        type: (StringConstructor | NumberConstructor)[];
        required: false;
        default: undefined;
    };
    /**
     * Icon displayed at the end of the input field.
     * @default undefined
     */
    icon: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Placeholder text.
     * @default undefined
     */
    placeholder: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Title attribute of the input.
     * @default undefined
     */
    title: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Makes the field readonly.
     * @default false
     */
    readonly: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Disables the field.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * The maximum string length that the user can enter.
     * @default -1
     */
    maxlength: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    /**
     * The type of the input field.
     * @default "text"
     */
    type: {
        type: PropType<"text" | "url" | "email" | "number" | "search">;
        required: false;
        default: string;
    };
    /**
     * The step attribute specifying the granularity number values have to
     * adhere to.
     * @default 1
     */
    step: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    /**
     * The minimum value to accept for this input.
     * @default undefined
     */
    min: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
    /**
     * The maximum value to accept for this input.
     * @default undefined
     */
    max: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Pattern the value must match to be valid.
     * @default undefined
     */
    pattern: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Required field.
     * @default false
     */
    required: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Aria label for the input.
     * @default undefined
     */
    ariaLabel: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * ID of the element that labels the input.
     * @default undefined
     */
    ariaLabelledby: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * ID of the element that describes the input.
     * @default undefined
     */
    ariaDescribedby: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Vertical size of the input field.
     * @default undefined
     */
    size: {
        type: PropType<"sm">;
        required: false;
        default: undefined;
    };
    /**
     * Displays the success state.
     * @default false
     */
    success: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Displays the error state.
     * @default false
     */
    error: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}>> & {
    onFocus?: ((...args: any[]) => any) | undefined;
    onBlur?: ((...args: any[]) => any) | undefined;
    onKeydown?: ((...args: any[]) => any) | undefined;
    onKeyup?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    icon: string;
    disabled: boolean;
    type: "number" | "search" | "text" | "email" | "url";
    required: boolean;
    title: string;
    pattern: string;
    size: "sm";
    id: string;
    readonly: boolean;
    error: boolean;
    modelValue: string | number;
    success: boolean;
    ariaDescribedby: string;
    placeholder: string;
    maxlength: number;
    step: number;
    min: number;
    max: number;
    ariaLabel: string;
    ariaLabelledby: string;
}, {}>;
export default _default;
