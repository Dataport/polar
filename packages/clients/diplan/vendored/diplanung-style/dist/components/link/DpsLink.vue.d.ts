import type { PropType } from "vue";
declare const _default: import("vue").DefineComponent<{
    /**
     * The URL that the hyperlink points to.
     */
    href: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Icon to be displayed in front of the link text.
     * Can be set to 'false' when using external links to
     * hide the icon.
     * @default undefined
     */
    icon: {
        type: (StringConstructor | BooleanConstructor)[];
        required: false;
        default: undefined;
    };
    /**
     * The relationship of the linked URL as space-separated
     * link types. "noopener noreferrer" gets set automatically
     * when "external" is true.
     * @default undefined
     */
    rel: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Where to display the linked URL,
     * as the name for a browsing context.
     * Gets set to "_blank" automatically when "external" is true.
     * @default undefined
     */
    target: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Whether the link is an external link.
     * @default false
     */
    external: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * How to format the link (telephone or email formatting).
     * @default undefined
     */
    format: {
        type: PropType<"telephone" | "email">;
        required: false;
        default: undefined;
    };
    /**
     * Whether the link should be a slightly darker blue.
     * @default false
     */
    darker: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}, unknown, unknown, {
    hrefAttribute(): string;
    relAttribute(): string | undefined;
    targetAttribute(): string | undefined;
    iconName(): string | undefined;
}, {
    handleClick(event: Event): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "click"[], "click", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * The URL that the hyperlink points to.
     */
    href: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Icon to be displayed in front of the link text.
     * Can be set to 'false' when using external links to
     * hide the icon.
     * @default undefined
     */
    icon: {
        type: (StringConstructor | BooleanConstructor)[];
        required: false;
        default: undefined;
    };
    /**
     * The relationship of the linked URL as space-separated
     * link types. "noopener noreferrer" gets set automatically
     * when "external" is true.
     * @default undefined
     */
    rel: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Where to display the linked URL,
     * as the name for a browsing context.
     * Gets set to "_blank" automatically when "external" is true.
     * @default undefined
     */
    target: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Whether the link is an external link.
     * @default false
     */
    external: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * How to format the link (telephone or email formatting).
     * @default undefined
     */
    format: {
        type: PropType<"telephone" | "email">;
        required: false;
        default: undefined;
    };
    /**
     * Whether the link should be a slightly darker blue.
     * @default false
     */
    darker: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}>> & {
    onClick?: ((...args: any[]) => any) | undefined;
}, {
    icon: string | boolean;
    target: string;
    rel: string;
    external: boolean;
    format: "email" | "telephone";
    darker: boolean;
}, {}>;
export default _default;
