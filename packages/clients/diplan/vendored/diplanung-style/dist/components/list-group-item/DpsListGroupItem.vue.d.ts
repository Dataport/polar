export interface DpsListGroupItemData {
    isExpanded: boolean;
}
declare const _default: import("vue").DefineComponent<{
    /**
     * The unique identifier for the collapsible element. This identifier is used to associate the
     * collapsible content with its corresponding trigger for accessibility and Bootstrap's collapse functionality.
     *
     * @default undefined
     */
    collapseId: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Specifies the HTML tag to use for the root element.
     * @default "div"
     */
    tag: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * The URL that the hyperlink points to.
     * @default undefined
     */
    href: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Indicates whether the collapsible row content is initially expanded.
     * When set to true, the collapsible content will be visible by default.
     *
     * @default false
     */
    expanded: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}, unknown, DpsListGroupItemData, {
    uniqueId(): string;
    computedTag(): string;
    isCollapsible(): boolean;
}, {
    handleEnter(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("hide" | "show")[], "hide" | "show", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * The unique identifier for the collapsible element. This identifier is used to associate the
     * collapsible content with its corresponding trigger for accessibility and Bootstrap's collapse functionality.
     *
     * @default undefined
     */
    collapseId: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Specifies the HTML tag to use for the root element.
     * @default "div"
     */
    tag: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * The URL that the hyperlink points to.
     * @default undefined
     */
    href: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Indicates whether the collapsible row content is initially expanded.
     * When set to true, the collapsible content will be visible by default.
     *
     * @default false
     */
    expanded: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}>> & {
    onHide?: ((...args: any[]) => any) | undefined;
    onShow?: ((...args: any[]) => any) | undefined;
}, {
    href: string;
    tag: string;
    expanded: boolean;
    collapseId: string;
}, {}>;
export default _default;
