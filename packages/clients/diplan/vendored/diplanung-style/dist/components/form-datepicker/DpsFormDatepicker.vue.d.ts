declare const _default: import("vue").DefineComponent<{
    /**
     * Sets the initial date in the format `YYYY-MM-DD`.
     * Example: `2024-10-02`.
     */
    initialDate: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Enables the checkbox next to the date picker.
     */
    hasCheckbox: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Sets the initial state of the checkbox.
     */
    isCheckboxChecked: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Title for the checkbox.
     */
    checkboxTitle: {
        type: StringConstructor;
        default: string;
    };
    /**
     * An array of dates that should be grayed out.
     * Can either be an array of dates or an array of objects containing a "from" and "to" date and an optional title.
     * Example: `[new Date(2024, 9, 15)]` or `[{from: "01.02.2025", to: "10.02.2025", title: "Beispieltermin"}]`.
     */
    dateBlackList: {
        type: ArrayConstructor;
        default(): never[];
    };
    /**
     * Watch for external updates.
     */
    watchForExternalUpdates: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Sets the start and end dates for the range.
     * Example: `{ beginn: new Date(), ende: new Date() }`.
     */
    zeitraum: {
        type: ObjectConstructor;
        default(): {};
    };
    /**
     * Disables the date picker when true.
     */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Placeholder text for the input field.
     */
    placeholder: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Enables range selection mode.
     */
    range: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Additional attributes for the input element.
     */
    inputAttr: {
        type: ObjectConstructor;
        default(): {};
    };
    /**
     * Allows the date picker to be cleared when set to true.
     */
    clearable: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Enables manual input in the date field when set to true.
     */
    editable: {
        type: BooleanConstructor;
        default: boolean;
    };
}, any, {
    KEY_ARROW_RIGHT: string;
    KEY_ARROW_LEFT: string;
    KEY_ARROW_UP: string;
    KEY_ARROW_DOWN: string;
    KEY_ENTER: string;
    KEY_ESCAPE: string;
    KEY_TAB: string;
    defaultDate: any;
    dauer: null;
    dateBlackListFinal: never[];
    startDate: string;
    endDate: string;
    datepicker: null;
    datepickerPopup: null;
    cssClasses: {
        popup: string;
        header: string;
        calendarContent: string;
        rows: string;
        firstRow: string;
        lastRow: string;
        cellsInCurrentMonth: string;
        hidden: string;
        blackDate: string;
        dayView: string;
        monthView: string;
        yearView: string;
    };
    heights: {
        contentHeightSm: number;
        contentHeightMd: number;
        contentHeightLg: number;
    };
    isOpenDatepicker: boolean;
    isChecked: boolean;
}, {}, {
    /**
     * Handles the behavior when confirm button is clicked
     * Ensures popup doesn't reopen immediately after closing
     */
    handleConfirm(): void;
    /**
     * Toggles the datepicker open state.
     * Can be used for both click and keyup.enter events.
     * @returns {void}
     */
    toggleDatepicker(): void;
    /**
     * returns valid moment date or null
     * @param   {string} dateString string to parse
     * @returns {moment.Moment} date or null
     */
    getMomentDate(dateString: string): moment.Moment;
    /**
     * calculates the duration between dates
     * @param {Array} datesArr selected date as Array or empty
     * @returns {void}
     */
    calcDateDifference(datesArr?: any[]): void;
    /**
     * Check if the date changed in the datepicker range
     * @returns {void}
     */
    updateRange(): void;
    /**
     * function to get the defaultDate from zeitraum
     * @return {object}
     */
    getDefaultDate(): object;
    /**
     * Moves focus to a different cell in the datepicker based on the given offset.
     * @param {number} dayOffset - The number of days to move the focus by.
     * @param {HTMLElement} currentPanel - The currently active panel containing the date cells (day, month, or year view).
     * @returns {void}
     */
    moveFocus(dayOffset: number, currentPanel: HTMLElement): void;
    /**
     * Sets focus on a specific cell in the datepicker.
     * @param {HTMLElement} cell - The cell to focus.
     * @returns {void}
     */
    setFocusOnCell(cell: HTMLElement): void;
    /**
     * Updates focus by removing focus from the old cell and applying it to the new cell.
     * @param {HTMLElement} oldCell - The previously focused cell.
     * @param {HTMLElement} newCell - The new cell to focus on.
     * @returns {void}
     */
    updateFocus(oldCell: HTMLElement, newCell: HTMLElement): void;
    /**
     * Handles keydown events for navigating within the datepicker panels.
     *
     * This function manages navigation within day, month, and year views based on
     * arrow keys, handles the "Enter" key to simulate clicks, and ensures focus trapping
     * within the datepicker. It also manages specific transitions when navigating between
     * different calendar panels in range view.
     *
     * @param {KeyboardEvent} event - The keyboard event object containing information about the key pressed.
     *
     * @returns {void}
     */
    handleKeydown(event: KeyboardEvent): void;
    /**
     * Handles focus movement in the day view, including crossing boundaries between calendar panels.
     * @param {number} moveStep - The number of steps to move the focus by (positive for forward, negative for backward).
     * @param {HTMLElement} currentPanel - The currently active panel (day view) containing the date cells.
     * @param {string} direction - The direction of movement (e.g., 'left', 'right', 'up', 'down').
     * @returns {void}
     */
    handleDayViewBoundaryMove(moveStep: number, currentPanel: HTMLElement, direction: string): void;
    /**
     * Handles the behavior when the "Enter" key is pressed.
     * @param {KeyboardEvent} event - The keyboard event object.
     * @returns {void}
     */
    handleEnterKey(event: KeyboardEvent): void;
    /**
     * Sets up an event listener for the datepicker popup.
     * @returns {void}
     */
    setPopupEventListener(): void;
    /**
     * Checks and sets the focus on either 'today' or 'active' cell after the DOM updates.
     * @returns {void}
     */
    checkAndSetCellFocus(): void;
    /**
     * Traps focus within the datepicker popup for improved accessibility.
     * @param {KeyboardEvent} event - The keyboard event object.
     * @returns {void}
     */
    trapFocus(event: KeyboardEvent): void;
    /**
     * Retrieves all focusable elements inside the datepickerPopup.
     * @returns {HTMLElement[]} Array of focusable elements.
     */
    getFocusableElements(): HTMLElement[];
    /**
     * Handles Tab and Shift+Tab navigation for focus trapping.
     * @param {KeyboardEvent} event - The keyboard event object.
     * @param {HTMLElement} firstElement - The first focusable element.
     * @param {HTMLElement} lastElement - The last focusable element.
     * @returns {void}
     */
    handleTabNavigation(event: KeyboardEvent, firstElement: HTMLElement, lastElement: HTMLElement): void;
    /**
     * Resets the focus back to the current datepicker input element.
     * @returns {void}
     */
    resetFocusToCurrentDatepickerInput(): void;
    /**
     * Improves the accessibility of navigation buttons in the datepicker.
     * Sets titles for previous, next, month, and year buttons for better understanding and accessibility.
     * @returns {void}
     */
    improveNavigationButtonAccessibility(): void;
    /**
     * Sets titles to each cell in the datepicker.
     * The title is set to the text content of the cell for better accessibility.
     * @returns {void}
     */
    setCellTitles(): void;
    /**
     * run functions to customize the datepicker
     * @returns {void}
     */
    customizeDatePicker(): void;
    /**
     * Sets CSS classes and titles for black and white days based on the provided lists.
     * @param {Array} dateList - The list of dates to process.
     * @returns {void}
     */
    setDateList(dateList: any[]): void;
    /**
     * Adds the specified CSS class and updates attributes for the date cell.
     * @param {Element} dateCell - The cell element for the date.
     * @param {string} zusatz - Additional label for the date (if available).
     * @returns {void}
     */
    addDateClass(dateCell: Element, zusatz: string): void;
    setDateBlacklist(): Promise<void>;
    /**
     * Hide first or last row if all days in the calendar row are in the new month
     * @returns {void}
     */
    hideRowsNotInCurrentMonth(): void;
    /**
     * select popup element and customize the datepicker
     * @returns {void}
     */
    handleOpen(): void;
    handleClose(): void;
    /**
     * function to handle the calendar change event. customize the popup element.
     * @returns {void}
     */
    handleCalendarChange(): void;
    /**
     * function to select the popup element of the datepicker after it was opened
     * @returns {Promise}
     */
    selectDatepickerPopup(): Promise<any>;
    updateCheckbox(value: any): void;
    /**
     * function to handle the change event. set the start date and emits the date-picker-value event.
     * @emits date-picker-value
     * @returns {void}
     */
    handleChange(selectedDates: any): void;
    handlePanelChange(): void;
    /**
     * creates a list of all blacklisted dates and the corresponding titles.
     */
    calculateFinalBlacklist(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("date-picker-value" | "is-checkbox-checked" | "date-picker-opened" | "pick-element" | "update-range" | "update-termindauer" | "start-end")[], "date-picker-value" | "is-checkbox-checked" | "date-picker-opened" | "pick-element" | "update-range" | "update-termindauer" | "start-end", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Sets the initial date in the format `YYYY-MM-DD`.
     * Example: `2024-10-02`.
     */
    initialDate: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Enables the checkbox next to the date picker.
     */
    hasCheckbox: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Sets the initial state of the checkbox.
     */
    isCheckboxChecked: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Title for the checkbox.
     */
    checkboxTitle: {
        type: StringConstructor;
        default: string;
    };
    /**
     * An array of dates that should be grayed out.
     * Can either be an array of dates or an array of objects containing a "from" and "to" date and an optional title.
     * Example: `[new Date(2024, 9, 15)]` or `[{from: "01.02.2025", to: "10.02.2025", title: "Beispieltermin"}]`.
     */
    dateBlackList: {
        type: ArrayConstructor;
        default(): never[];
    };
    /**
     * Watch for external updates.
     */
    watchForExternalUpdates: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Sets the start and end dates for the range.
     * Example: `{ beginn: new Date(), ende: new Date() }`.
     */
    zeitraum: {
        type: ObjectConstructor;
        default(): {};
    };
    /**
     * Disables the date picker when true.
     */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Placeholder text for the input field.
     */
    placeholder: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Enables range selection mode.
     */
    range: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    /**
     * Additional attributes for the input element.
     */
    inputAttr: {
        type: ObjectConstructor;
        default(): {};
    };
    /**
     * Allows the date picker to be cleared when set to true.
     */
    clearable: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Enables manual input in the date field when set to true.
     */
    editable: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    "onDate-picker-value"?: ((...args: any[]) => any) | undefined;
    "onIs-checkbox-checked"?: ((...args: any[]) => any) | undefined;
    "onDate-picker-opened"?: ((...args: any[]) => any) | undefined;
    "onPick-element"?: ((...args: any[]) => any) | undefined;
    "onUpdate-range"?: ((...args: any[]) => any) | undefined;
    "onUpdate-termindauer"?: ((...args: any[]) => any) | undefined;
    "onStart-end"?: ((...args: any[]) => any) | undefined;
}, {
    disabled: boolean;
    range: boolean;
    placeholder: string;
    initialDate: string;
    zeitraum: Record<string, any>;
    hasCheckbox: boolean;
    isCheckboxChecked: boolean;
    checkboxTitle: string;
    dateBlackList: unknown[];
    watchForExternalUpdates: boolean;
    inputAttr: Record<string, any>;
    clearable: boolean;
    editable: boolean;
}, {}>;
export default _default;
import moment from "moment";
