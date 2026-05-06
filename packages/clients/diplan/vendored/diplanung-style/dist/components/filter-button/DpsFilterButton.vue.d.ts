declare const _default: import("vue").DefineComponent<{
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
     * Makes the button readonly.
     * @default false
     */
    readonly: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    /**
     * Title attribute of the button.
     * @default undefined
     */
    title: {
        type: StringConstructor;
        default: undefined;
        required: false;
    };
}, unknown, unknown, {
    titleAttribute(): string;
}, {
    handleClick(event: Event): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "click"[], "click", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
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
     * Makes the button readonly.
     * @default false
     */
    readonly: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    /**
     * Title attribute of the button.
     * @default undefined
     */
    title: {
        type: StringConstructor;
        default: undefined;
        required: false;
    };
}>> & {
    onClick?: ((...args: any[]) => any) | undefined;
}, {
    disabled: boolean;
    title: string;
    readonly: boolean;
}, {}>;
export default _default;
