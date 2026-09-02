declare const _default: import("vue").DefineComponent<{
    /**
     * The unique identifier for the menu.
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * The HTML tag to be used for the menu container.
     * @default "ul"
     */
    tag: {
        type: StringConstructor;
        default: string;
        required: false;
    };
    /**
     * The icon to be used for the trigger button.
     * @default "more-horiz"
     */
    icon: {
        type: StringConstructor;
        default: string;
        required: false;
    };
    /**
     * The label for the trigger button.
     * @default ""
     */
    label: {
        type: StringConstructor;
        default: string;
        required: false;
    };
    /**
     * The title attribute for the trigger button.
     * @default "Aktions-Menu öffnen"
     */
    title: {
        type: StringConstructor;
        default: string;
        required: false;
    };
    /**
     * Whether to show a close button in the menu.
     * @default false
     */
    showCloseButton: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    /**
     * Whether to show a chevron icon in the trigger button.
     * @default false
     */
    showTriggerChevron: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    /**
     * The headline text for the menu.
     * @default undefined
     */
    headline: {
        type: StringConstructor;
        default: undefined;
        required: false;
    };
    /**
     * Whether the menu should automatically close after an action is selected.
     * @default true
     */
    autoClose: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    /**
     * Whether the menu is disabled.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
}, unknown, unknown, {
    uniqueId(): string;
    dropdownElement(): HTMLElement | null;
    dropdownBootstrapElement(): any;
    isHeaderVisible(): string | true | undefined;
}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("hide" | "show")[], "hide" | "show", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * The unique identifier for the menu.
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * The HTML tag to be used for the menu container.
     * @default "ul"
     */
    tag: {
        type: StringConstructor;
        default: string;
        required: false;
    };
    /**
     * The icon to be used for the trigger button.
     * @default "more-horiz"
     */
    icon: {
        type: StringConstructor;
        default: string;
        required: false;
    };
    /**
     * The label for the trigger button.
     * @default ""
     */
    label: {
        type: StringConstructor;
        default: string;
        required: false;
    };
    /**
     * The title attribute for the trigger button.
     * @default "Aktions-Menu öffnen"
     */
    title: {
        type: StringConstructor;
        default: string;
        required: false;
    };
    /**
     * Whether to show a close button in the menu.
     * @default false
     */
    showCloseButton: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    /**
     * Whether to show a chevron icon in the trigger button.
     * @default false
     */
    showTriggerChevron: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    /**
     * The headline text for the menu.
     * @default undefined
     */
    headline: {
        type: StringConstructor;
        default: undefined;
        required: false;
    };
    /**
     * Whether the menu should automatically close after an action is selected.
     * @default true
     */
    autoClose: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    /**
     * Whether the menu is disabled.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
}>> & {
    onHide?: ((...args: any[]) => any) | undefined;
    onShow?: ((...args: any[]) => any) | undefined;
}, {
    icon: string;
    disabled: boolean;
    label: string;
    title: string;
    id: string;
    tag: string;
    showCloseButton: boolean;
    showTriggerChevron: boolean;
    headline: string;
    autoClose: boolean;
}, {}>;
export default _default;
