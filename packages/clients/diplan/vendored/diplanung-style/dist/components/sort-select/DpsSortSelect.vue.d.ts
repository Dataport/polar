import { DpsFormSelectOption } from "@/components/form-select/DpsFormSelect.vue";
import type { PropType } from "vue";
export interface DpsSortSelectData {
    selected: undefined | DpsFormSelectOption;
}
declare const _default: import("vue").DefineComponent<{
    /**
     * Unique ID of the select (optional).
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Array of options to be displayed.
     */
    options: {
        type: PropType<DpsFormSelectOption[]>;
        required: true;
    };
    /**
     * ModelValue of the select.
     */
    modelValue: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Title attribute of the select.
     * @default "Sortierung anpassen"
     */
    title: {
        type: StringConstructor;
        default: string;
        required: false;
    };
    /**
     * Disables the select.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
}, unknown, DpsSortSelectData, {
    uniqueId(): string;
}, {
    setSelectedOption(): void;
    handleChange(payload: DpsFormSelectOption): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Unique ID of the select (optional).
     * @default undefined
     */
    id: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Array of options to be displayed.
     */
    options: {
        type: PropType<DpsFormSelectOption[]>;
        required: true;
    };
    /**
     * ModelValue of the select.
     */
    modelValue: {
        type: StringConstructor;
        required: true;
    };
    /**
     * Title attribute of the select.
     * @default "Sortierung anpassen"
     */
    title: {
        type: StringConstructor;
        default: string;
        required: false;
    };
    /**
     * Disables the select.
     * @default false
     */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    disabled: boolean;
    title: string;
    id: string;
}, {}>;
export default _default;
