import type { PropType } from "vue";
export interface DpsUploadFormGroupData {
    hasError: boolean;
    filesSelected: File | File[] | null;
    uniqID: string;
    rerenderCounter: number;
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
     * The label for the component.
     * @default ""
     */
    label: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Hides the label.
     * @default false
     */
    hideLabel: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * The label for the upload button.
     * @default "Hochladen"
     */
    uploadButtonLabel: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * The title for the upload button.
     * Defaults to the button label if no title is set.
     * @default undefined
     */
    uploadButtonTitle: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Which file formats to accept.
     * Can be either file extension or mime-type or mixed
     * e.g. ['.pdf'], ['application/pdf'] or ['.pdf', 'application/pdf']
     * @default []
     */
    fileAccept: {
        type: PropType<string[]>;
        required: false;
        default(): never[];
    };
    /**
     * Allows selecting multiple files at once.
     * @default false
     */
    fileMultiple: {
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
     * Defaults to the label if no title is set.
     * @default undefined
     */
    title: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Disables the upload button.
     * @default false
     */
    disableUploadButton: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Displays the component without the upload button.
     * @default false
     */
    hideUploadButton: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Changes the state to error and displays the provided error message.
     * @default ""
     */
    uploadErrorMessage: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Required attribute of the input.
     * @default false
     */
    fileRequired: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}, unknown, DpsUploadFormGroupData, {
    fileSearchTitle(): string;
    acceptedFilesAsString(): string | undefined;
    acceptedFilesDescription(): string | undefined;
    acceptedFilesErrorMessage(): string;
    errorMessage(): string;
    isUploadButtonDisabled(): boolean;
}, {
    validateFileType(fileObj: File): boolean;
    handleSelectionChange(selectedFiles: File | File[] | null): false | undefined;
    resetSelection(onError?: boolean): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("input" | "upload")[], "input" | "upload", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
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
     * The label for the component.
     * @default ""
     */
    label: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Hides the label.
     * @default false
     */
    hideLabel: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * The label for the upload button.
     * @default "Hochladen"
     */
    uploadButtonLabel: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * The title for the upload button.
     * Defaults to the button label if no title is set.
     * @default undefined
     */
    uploadButtonTitle: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Which file formats to accept.
     * Can be either file extension or mime-type or mixed
     * e.g. ['.pdf'], ['application/pdf'] or ['.pdf', 'application/pdf']
     * @default []
     */
    fileAccept: {
        type: PropType<string[]>;
        required: false;
        default(): never[];
    };
    /**
     * Allows selecting multiple files at once.
     * @default false
     */
    fileMultiple: {
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
     * Defaults to the label if no title is set.
     * @default undefined
     */
    title: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Disables the upload button.
     * @default false
     */
    disableUploadButton: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Displays the component without the upload button.
     * @default false
     */
    hideUploadButton: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Changes the state to error and displays the provided error message.
     * @default ""
     */
    uploadErrorMessage: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Required attribute of the input.
     * @default false
     */
    fileRequired: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}>> & {
    onInput?: ((...args: any[]) => any) | undefined;
    onUpload?: ((...args: any[]) => any) | undefined;
}, {
    disabled: boolean;
    label: string;
    title: string;
    id: string;
    hideLabel: boolean;
    uploadErrorMessage: string;
    uploadButtonLabel: string;
    uploadButtonTitle: string;
    fileAccept: string[];
    fileMultiple: boolean;
    disableUploadButton: boolean;
    hideUploadButton: boolean;
    fileRequired: boolean;
}, {}>;
export default _default;
