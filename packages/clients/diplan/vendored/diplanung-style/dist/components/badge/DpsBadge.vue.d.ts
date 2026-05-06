import type { PropType } from "vue";
declare const _default: import("vue").DefineComponent<{
    /**
     * Determines the styling of the badge.
     * @default undefined
     */
    variant: {
        type: PropType<"info" | "success" | "warning" | "error" | "outline" | "primary">;
        required: false;
        default: undefined;
    };
    /**
     * Rounds the badge.
     * @default false
     */
    rounded: {
        type: BooleanConstructor;
        default: boolean;
    };
}, unknown, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Determines the styling of the badge.
     * @default undefined
     */
    variant: {
        type: PropType<"info" | "success" | "warning" | "error" | "outline" | "primary">;
        required: false;
        default: undefined;
    };
    /**
     * Rounds the badge.
     * @default false
     */
    rounded: {
        type: BooleanConstructor;
        default: boolean;
    };
}>>, {
    variant: "error" | "info" | "success" | "warning" | "outline" | "primary";
    rounded: boolean;
}, {}>;
export default _default;
