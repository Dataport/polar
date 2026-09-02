import type { PropType } from "vue";
export interface DpsCollapsibleData {
    isExpanded: boolean;
}
declare const _default: import("vue").DefineComponent<{
    /**
     * The unique identifier for the menu (optional).
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Collapsible expanded.
     * @default false
     */
    expanded: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Whether the collapsible can not be interacted with.
     * @default false
     */
    locked: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Size of the collapsible.
     * @default undefined
     */
    size: {
        type: PropType<"lg">;
        required: false;
        default: undefined;
    };
    /**
     * Styling of the collapsible.
     * @default undefined
     */
    variant: {
        type: PropType<"secondary" | "tertiary">;
        required: false;
        default: undefined;
    };
    /**
     * Headline text when collapsible is expanded.
     * @default undefined
     */
    toggleTextExpanded: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Headline text when collapsible is not expanded.
     * @default undefined
     */
    toggleText: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
}, unknown, DpsCollapsibleData, {
    uniqueId(): string;
}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("hide-collapsible" | "hidden-collapsible" | "show-collapsible" | "shown-collapsible")[], "hide-collapsible" | "hidden-collapsible" | "show-collapsible" | "shown-collapsible", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * The unique identifier for the menu (optional).
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Collapsible expanded.
     * @default false
     */
    expanded: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Whether the collapsible can not be interacted with.
     * @default false
     */
    locked: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Size of the collapsible.
     * @default undefined
     */
    size: {
        type: PropType<"lg">;
        required: false;
        default: undefined;
    };
    /**
     * Styling of the collapsible.
     * @default undefined
     */
    variant: {
        type: PropType<"secondary" | "tertiary">;
        required: false;
        default: undefined;
    };
    /**
     * Headline text when collapsible is expanded.
     * @default undefined
     */
    toggleTextExpanded: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Headline text when collapsible is not expanded.
     * @default undefined
     */
    toggleText: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
}>> & {
    "onHide-collapsible"?: ((...args: any[]) => any) | undefined;
    "onHidden-collapsible"?: ((...args: any[]) => any) | undefined;
    "onShow-collapsible"?: ((...args: any[]) => any) | undefined;
    "onShown-collapsible"?: ((...args: any[]) => any) | undefined;
}, {
    size: "lg";
    id: string;
    variant: "secondary" | "tertiary";
    expanded: boolean;
    locked: boolean;
    toggleTextExpanded: string;
    toggleText: string;
}, {}>;
export default _default;
