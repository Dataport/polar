declare const _default: import("vue").DefineComponent<{
    /**
     * Total Number of Elements
     * @required
     */
    numberOfElements: {
        type: NumberConstructor;
        required: true;
    };
    /**
     * Label of pagination menu for accessibilty ("aria-label")
     * @default undefined
     */
    ariaLabel: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * ID of the HTML element the pagination is controlling for accessibility ("aria-controls")
     * @default undefined
     */
    ariaContentId: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Configure select options for "elements per page"
     * @default [25, 50, 100]
     */
    elementsPerPageOptions: {
        type: ArrayConstructor;
        required: false;
        default(): number[];
    };
    /**
     * Configure maximum number of page buttons in pagination
     * @default 5
     */
    numberOfPageNumbers: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    /**
     * Set number of pages as prop if the calculation should not be handled automatically (e.g. for serverside pagination). A note for migration: Was "pagesFromServer"
     * @default null
     */
    numberOfPagesAsProp: {
        type: NumberConstructor;
        required: false;
        default: null;
    };
    /**
     * Set current page as prop (e.g. for serverside pagination)
     * @default null
     */
    currentPageAsProp: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Set default option for "elements per page". If not set the first option will be selected. This is useful e.g. when resetting the page size to default on removing filters.
     */
    elementsPerPageAsProp: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
}, any, {
    elementsPerPage: {
        value: unknown;
        label: unknown;
    };
    currentPage: number;
    paginationButtons: never[];
}, {
    uniqueId(): string;
    /**
     * Number of Pages
     * @return {number}
     */
    numberOfPages(): number;
    /**
     * calculates Page Numbers to be shown on the buttons,
     * shows all if numberOfPages is smaller than numberOfPageNumbers
     * @return {number|*[]}
     */
    shownPageNumbers(): number | any[];
    /**
     * calculates which elements will be shown on the current page
     * @return {object} {elementsPerPage: default.elementsPerPageAsProp, start: (number|number), end: number, currentPage: number}
     */
    shownElements(): object;
}, {
    onPageButtonKeydown(ev: any): void;
    isPrintableCharacter(str: any): any;
    updatePaginationButtons(): void;
    setFocusToPaginationItem(newElem: any): void;
    /**
     * updates value of current page
     * @param {Number|String} page number of page or inc/dec
     * @return void
     */
    updatePage(page: number | string): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "updatePagination"[], "updatePagination", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Total Number of Elements
     * @required
     */
    numberOfElements: {
        type: NumberConstructor;
        required: true;
    };
    /**
     * Label of pagination menu for accessibilty ("aria-label")
     * @default undefined
     */
    ariaLabel: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * ID of the HTML element the pagination is controlling for accessibility ("aria-controls")
     * @default undefined
     */
    ariaContentId: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Configure select options for "elements per page"
     * @default [25, 50, 100]
     */
    elementsPerPageOptions: {
        type: ArrayConstructor;
        required: false;
        default(): number[];
    };
    /**
     * Configure maximum number of page buttons in pagination
     * @default 5
     */
    numberOfPageNumbers: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    /**
     * Set number of pages as prop if the calculation should not be handled automatically (e.g. for serverside pagination). A note for migration: Was "pagesFromServer"
     * @default null
     */
    numberOfPagesAsProp: {
        type: NumberConstructor;
        required: false;
        default: null;
    };
    /**
     * Set current page as prop (e.g. for serverside pagination)
     * @default null
     */
    currentPageAsProp: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Set default option for "elements per page". If not set the first option will be selected. This is useful e.g. when resetting the page size to default on removing filters.
     */
    elementsPerPageAsProp: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
}>> & {
    onUpdatePagination?: ((...args: any[]) => any) | undefined;
}, {
    ariaLabel: string;
    currentPageAsProp: number;
    ariaContentId: string;
    elementsPerPageOptions: unknown[];
    numberOfPageNumbers: number;
    numberOfPagesAsProp: number;
    elementsPerPageAsProp: number;
}, {}>;
export default _default;
