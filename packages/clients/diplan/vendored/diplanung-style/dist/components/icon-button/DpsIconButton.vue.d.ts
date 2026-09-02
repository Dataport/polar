declare const _default: import("vue").DefineComponent<{
    /**
     * Icon to be displayed in the button.
     */
    icon: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Applies the 'danger' styles to the button.
     * @default false
     */
    danger: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    /**
     * Disables the button.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    /**
     * Show a loading spinner.
     * @default undefined
     */
    loading: {
        type: BooleanConstructor;
        default: undefined;
        required: false;
    };
    /**
     * The HTML button type attribute. If undefined
     * the type defaults to 'button'.
     * @default undefined
     */
    type: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * The URL that the hyperlink points to.
     * If href is set an anchor
     * element is rendered instead of a button.
     * @default undefined
     */
    href: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
}, unknown, unknown, {
    typeAttribute(): string | undefined;
}, {
    handleClick(event: Event): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "click"[], "click", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Icon to be displayed in the button.
     */
    icon: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Applies the 'danger' styles to the button.
     * @default false
     */
    danger: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    /**
     * Disables the button.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    /**
     * Show a loading spinner.
     * @default undefined
     */
    loading: {
        type: BooleanConstructor;
        default: undefined;
        required: false;
    };
    /**
     * The HTML button type attribute. If undefined
     * the type defaults to 'button'.
     * @default undefined
     */
    type: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * The URL that the hyperlink points to.
     * If href is set an anchor
     * element is rendered instead of a button.
     * @default undefined
     */
    href: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
}>> & {
    onClick?: ((...args: any[]) => any) | undefined;
}, {
    danger: boolean;
    disabled: boolean;
    loading: boolean;
    type: string;
    href: string;
}, {}>;
export default _default;
