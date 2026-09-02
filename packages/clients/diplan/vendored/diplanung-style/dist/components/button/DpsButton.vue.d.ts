import type { PropType } from "vue";
declare const _default: import("vue").DefineComponent<{
    /**
     * The HTML button type (ignored when used as a link).
     * When not set defaults to 'button'.
     * @default undefined
     */
    type: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * The URL that the hyperlink points to.
     * When set the component will be rendered as an anchor element.
     * @default undefined
     */
    href: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Disables the button.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Determines the styling of the component.
     * @default undefined
     */
    variant: {
        type: PropType<"secondary" | "link" | "link-darker">;
        required: false;
        default: undefined;
    };
    /**
     * Determines the size of the button.
     * @default undefined
     */
    size: {
        type: PropType<"sm" | "lg">;
        required: false;
        default: undefined;
    };
    /**
     * Squared edges.
     * @default false
     */
    squared: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Optional icon displayed inside the button.
     * @default undefined
     */
    icon: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Position of the icon.
     * @default 'start'
     */
    iconPosition: {
        type: PropType<"start" | "end">;
        required: false;
        default: string;
    };
    /**
     * Removes the padding.
     * @default false
     */
    noPadding: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    loading: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}, unknown, unknown, {
    typeAttribute(): string | undefined;
}, {
    handleClick(event: Event): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "click"[], "click", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * The HTML button type (ignored when used as a link).
     * When not set defaults to 'button'.
     * @default undefined
     */
    type: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * The URL that the hyperlink points to.
     * When set the component will be rendered as an anchor element.
     * @default undefined
     */
    href: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Disables the button.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Determines the styling of the component.
     * @default undefined
     */
    variant: {
        type: PropType<"secondary" | "link" | "link-darker">;
        required: false;
        default: undefined;
    };
    /**
     * Determines the size of the button.
     * @default undefined
     */
    size: {
        type: PropType<"sm" | "lg">;
        required: false;
        default: undefined;
    };
    /**
     * Squared edges.
     * @default false
     */
    squared: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Optional icon displayed inside the button.
     * @default undefined
     */
    icon: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Position of the icon.
     * @default 'start'
     */
    iconPosition: {
        type: PropType<"start" | "end">;
        required: false;
        default: string;
    };
    /**
     * Removes the padding.
     * @default false
     */
    noPadding: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    loading: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}>> & {
    onClick?: ((...args: any[]) => any) | undefined;
}, {
    icon: string;
    disabled: boolean;
    loading: boolean;
    type: string;
    href: string;
    size: "sm" | "lg";
    variant: "link" | "secondary" | "link-darker";
    squared: boolean;
    iconPosition: "start" | "end";
    noPadding: boolean;
}, {}>;
export default _default;
