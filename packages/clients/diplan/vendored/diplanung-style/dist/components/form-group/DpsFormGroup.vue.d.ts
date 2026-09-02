declare const _default: import("vue").DefineComponent<{
    /**
     * Unique ID for the component (optional).
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Description text shown under the content.
     * @default undefined
     */
    description: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Label for the group.
     * @default undefined
     */
    label: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * ID of the element the label is for.
     * @default undefined
     */
    labelFor: {
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
     * Text shown on success.
     * @default undefined
     */
    successFeedback: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Text shown on error.
     * @default undefined
     */
    errorFeedback: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Whether the input is valid or not.
     * `undefined` if the state is neutral.
     * @default undefined
     */
    valid: {
        type: BooleanConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Whether the group is disabled.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}, unknown, unknown, {
    uniqueId(): string;
    hasError(): boolean;
    hasSuccess(): boolean;
    ariaDescribedby(): string | undefined;
}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Unique ID for the component (optional).
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Description text shown under the content.
     * @default undefined
     */
    description: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Label for the group.
     * @default undefined
     */
    label: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * ID of the element the label is for.
     * @default undefined
     */
    labelFor: {
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
     * Text shown on success.
     * @default undefined
     */
    successFeedback: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Text shown on error.
     * @default undefined
     */
    errorFeedback: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Whether the input is valid or not.
     * `undefined` if the state is neutral.
     * @default undefined
     */
    valid: {
        type: BooleanConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Whether the group is disabled.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}>>, {
    disabled: boolean;
    label: string;
    id: string;
    description: string;
    hideLabel: boolean;
    labelFor: string;
    successFeedback: string;
    errorFeedback: string;
    valid: boolean;
}, {}>;
export default _default;
