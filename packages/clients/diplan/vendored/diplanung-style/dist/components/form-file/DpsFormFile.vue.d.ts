import { getUniqueId } from "@/services/id.ts";
import type { PropType } from "vue";
export interface DpsFormFileData {
    uniqID: string;
}
declare const _default: import("vue").DefineComponent<{
    /**
     * The unique identifier for the input (optional).
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * ModelValue of the input.
     * With inputs of type file, normally this is uni-directional.
     * However, you can clear the file input's selected files by setting the modelValue to either null
     * (for single mode) or an empty array [] (for multiple mode).
     * @default null
     */
    modelValue: {
        type: PropType<File | File[] | null>;
        required: false;
        default: null;
    };
    /**
     * Which file formats to accept.
     * Can be either file extension or mime-type or mixed
     * e.g. '.pdf', 'application/pdf' or '.pdf, application/pdf'
     * @default ""
     */
    accept: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Allows selecting multiple files at once.
     * @default false
     */
    multiple: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Disables the component.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Title for the search button.
     * Defaults to "Datei auswählen" if no title is set.
     * @default undefined
     */
    title: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Changes the state to error.
     * @default false
     */
    error: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Required attribute of the input.
     * @default false
     */
    required: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}, unknown, DpsFormFileData, {
    fileSearchTitle(): string;
}, {
    getUniqueId: typeof getUniqueId;
    handleSelectionChange(): void;
    resetSelection(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * The unique identifier for the input (optional).
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * ModelValue of the input.
     * With inputs of type file, normally this is uni-directional.
     * However, you can clear the file input's selected files by setting the modelValue to either null
     * (for single mode) or an empty array [] (for multiple mode).
     * @default null
     */
    modelValue: {
        type: PropType<File | File[] | null>;
        required: false;
        default: null;
    };
    /**
     * Which file formats to accept.
     * Can be either file extension or mime-type or mixed
     * e.g. '.pdf', 'application/pdf' or '.pdf, application/pdf'
     * @default ""
     */
    accept: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Allows selecting multiple files at once.
     * @default false
     */
    multiple: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Disables the component.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Title for the search button.
     * Defaults to "Datei auswählen" if no title is set.
     * @default undefined
     */
    title: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Changes the state to error.
     * @default false
     */
    error: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Required attribute of the input.
     * @default false
     */
    required: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    disabled: boolean;
    required: boolean;
    title: string;
    id: string;
    error: boolean;
    modelValue: File | File[] | null;
    multiple: boolean;
    accept: string;
}, {}>;
export default _default;
