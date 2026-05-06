export interface DpsTableRowData {
    isExpanded: boolean;
}
declare const _default: import("vue").DefineComponent<{
    /**
     * The unique identifier for the collapsible element. This identifier is used to associate the
     * collapsible content with its corresponding trigger for accessibility and Bootstrap's collapse functionality.
     * @default undefined
     */
    collapseId: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * The number of columns the collapsible content should span when expanded.
     * This controls the width of the collapsible content.
     *
     * @default undefined
     */
    collapseColspan: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
    /**
     * The starting position (column index) where the collapsible content should be displayed.
     * This can be used to create an offset within the row.
     *
     * @default 0
     */
    collapseColstart: {
        type: NumberConstructor;
        required: false;
        default: number;
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
}, unknown, DpsTableRowData, {
    uniqueId(): string;
    isCollapsible(): boolean;
}, {
    handleEnter(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("hide" | "show")[], "hide" | "show", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * The unique identifier for the collapsible element. This identifier is used to associate the
     * collapsible content with its corresponding trigger for accessibility and Bootstrap's collapse functionality.
     * @default undefined
     */
    collapseId: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * The number of columns the collapsible content should span when expanded.
     * This controls the width of the collapsible content.
     *
     * @default undefined
     */
    collapseColspan: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
    /**
     * The starting position (column index) where the collapsible content should be displayed.
     * This can be used to create an offset within the row.
     *
     * @default 0
     */
    collapseColstart: {
        type: NumberConstructor;
        required: false;
        default: number;
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
    expanded: boolean;
    collapseId: string;
    collapseColspan: number;
    collapseColstart: number;
}, {}>;
export default _default;
