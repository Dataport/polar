import type { PropType } from "vue";
declare const _default: import("vue").DefineComponent<{
    /**
     * The icon displayed before the menu item
     * @default undefined
     */
    icon: {
        type: StringConstructor;
        default: undefined;
        required: false;
    };
    /**
     * The title attribute of the menu item
     * @default undefined
     */
    title: {
        type: StringConstructor;
        default: undefined;
        required: false;
    };
    /**
     * Disables the menu item.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    /**
     * The link target attribute.(e.g.: _blank)
     * @default undefined
     */
    target: {
        type: PropType<"_blank" | "_self" | "_parent" | "_top" | string>;
        default: undefined;
        required: false;
    };
    /**
     * The URL that the hyperlink points to.
     * @default undefined
     */
    href: {
        type: StringConstructor;
        default: undefined;
        required: false;
    };
    /**
     * The relationship of the linked URL as space-separated link types.
     * @default undefined
     */
    rel: {
        type: StringConstructor;
        default: undefined;
        required: false;
    };
    /**
     * Applies the 'danger' styles (red on hover).
     * @default false
     */
    danger: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    /**
     * HTML tag of the wrapper element.
     * @default 'li'
     */
    tag: {
        type: StringConstructor;
        default: string;
    };
}, unknown, unknown, {}, {
    handleClick(event: Event): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "click"[], "click", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * The icon displayed before the menu item
     * @default undefined
     */
    icon: {
        type: StringConstructor;
        default: undefined;
        required: false;
    };
    /**
     * The title attribute of the menu item
     * @default undefined
     */
    title: {
        type: StringConstructor;
        default: undefined;
        required: false;
    };
    /**
     * Disables the menu item.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    /**
     * The link target attribute.(e.g.: _blank)
     * @default undefined
     */
    target: {
        type: PropType<"_blank" | "_self" | "_parent" | "_top" | string>;
        default: undefined;
        required: false;
    };
    /**
     * The URL that the hyperlink points to.
     * @default undefined
     */
    href: {
        type: StringConstructor;
        default: undefined;
        required: false;
    };
    /**
     * The relationship of the linked URL as space-separated link types.
     * @default undefined
     */
    rel: {
        type: StringConstructor;
        default: undefined;
        required: false;
    };
    /**
     * Applies the 'danger' styles (red on hover).
     * @default false
     */
    danger: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    /**
     * HTML tag of the wrapper element.
     * @default 'li'
     */
    tag: {
        type: StringConstructor;
        default: string;
    };
}>> & {
    onClick?: ((...args: any[]) => any) | undefined;
}, {
    icon: string;
    danger: boolean;
    disabled: boolean;
    href: string;
    title: string;
    tag: string;
    target: string;
    rel: string;
}, {}>;
export default _default;
