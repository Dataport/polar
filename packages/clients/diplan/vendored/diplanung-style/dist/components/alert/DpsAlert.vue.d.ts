import sanitizeHtml from "sanitize-html";
import type { PropType } from "vue";
declare const _default: import("vue").DefineComponent<{
    /**
     * The variant determines the color and icon of the alert.
     * @default undefined
     */
    variant: {
        type: PropType<"warning" | "error" | "info" | "success">;
        default: undefined;
        required: false;
    };
    /**
     * Headline of the alert.
     * @default undefined
     */
    heading: {
        type: StringConstructor;
        default: undefined;
        required: false;
    };
    /**
     * Hides the icon.
     * @default false
     */
    hideIcon: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
}, unknown, unknown, {
    variantIcon(): string;
}, {
    sanitizeHtml: typeof sanitizeHtml;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * The variant determines the color and icon of the alert.
     * @default undefined
     */
    variant: {
        type: PropType<"warning" | "error" | "info" | "success">;
        default: undefined;
        required: false;
    };
    /**
     * Headline of the alert.
     * @default undefined
     */
    heading: {
        type: StringConstructor;
        default: undefined;
        required: false;
    };
    /**
     * Hides the icon.
     * @default false
     */
    hideIcon: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
}>>, {
    variant: "error" | "info" | "success" | "warning";
    heading: string;
    hideIcon: boolean;
}, {}>;
export default _default;
