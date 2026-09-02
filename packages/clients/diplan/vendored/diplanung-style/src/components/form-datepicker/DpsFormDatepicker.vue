<script>
  // using DatePickerNext to prevent name collision with current component.
  import DatePickerNext from "vue-datepicker-next";
  import "vue-datepicker-next/locale/de.es"; /* Lokalisierung des DatePickers */
  import moment from "moment";
  import DpsButton from "@/components/button/DpsButton.vue";
  import DpsFormCheckbox from "@/components/form-checkbox/DpsFormCheckbox.vue";

  export default {
    name: "DpsFormDatepicker",
    components: {
      DpsFormCheckbox,
      DpsButton,
      DatePickerNext,
    },
    props: {
      /**
       * Sets the initial date in the format `YYYY-MM-DD`.
       * Example: `2024-10-02`.
       */
      initialDate: {
        type: String,
        default: "",
      },
      /**
       * Enables the checkbox next to the date picker.
       */
      hasCheckbox: {
        type: Boolean,
        default: false,
      },
      /**
       * Sets the initial state of the checkbox.
       */
      isCheckboxChecked: {
        type: Boolean,
        default: false,
      },
      /**
       * Title for the checkbox.
       */
      checkboxTitle: {
        type: String,
        default: "",
      },
      /**
       * An array of dates that should be grayed out.
       * Can either be an array of dates or an array of objects containing a "from" and "to" date and an optional title.
       * Example: `[new Date(2024, 9, 15)]` or `[{from: "01.02.2025", to: "10.02.2025", title: "Beispieltermin"}]`.
       */
      dateBlackList: {
        type: Array,
        default() {
          return [];
        },
      },
      /**
       * Watch for external updates.
       */
      watchForExternalUpdates: {
        type: Boolean,
        default: false,
      },
      /**
       * Sets the start and end dates for the range.
       * Example: `{ beginn: new Date(), ende: new Date() }`.
       */
      zeitraum: {
        type: Object,
        default() {
          return {};
        },
      },
      /**
       * Disables the date picker when true.
       */
      disabled: {
        type: Boolean,
        default: false,
      },
      /**
       * Placeholder text for the input field.
       */
      placeholder: {
        type: String,
        default: "TT.MM.JJJJ",
      },
      /**
       * Enables range selection mode.
       */
      range: {
        type: Boolean,
        required: false,
        default: false,
      },
      /**
       * Additional attributes for the input element.
       */
      inputAttr: {
        type: Object,
        default() {
          return {};
        },
      },
      /**
       * Allows the date picker to be cleared when set to true.
       */
      clearable: {
        type: Boolean,
        default: true,
      },
      /**
       * Enables manual input in the date field when set to true.
       */
      editable: {
        type: Boolean,
        default: true,
      },
    },
    emits: [
      /**
       * Emitted when the selected date value changes.
       * @event date-picker-value
       */
      "date-picker-value",

      /**
       * Emitted when the checkbox state changes.
       * @event is-checkbox-checked
       */
      "is-checkbox-checked",

      /**
       * Emitted when the date picker is opened.
       * @event date-picker-opened
       */
      "date-picker-opened",

      /**
       * Emitted when a date is selected.
       * @event pick-element
       */
      "pick-element",

      /**
       * Emitted when the date range is updated.
       * @event update-range
       */
      "update-range",

      /**
       * Emitted when the duration is updated.
       * @event update-termindauer
       */
      "update-termindauer",

      /**
       * Emitted when the start or end dates are changed.
       * @event start-end
       */
      "start-end",
    ],
    data() {
      return {
        KEY_ARROW_RIGHT: "ArrowRight",
        KEY_ARROW_LEFT: "ArrowLeft",
        KEY_ARROW_UP: "ArrowUp",
        KEY_ARROW_DOWN: "ArrowDown",
        KEY_ENTER: "Enter",
        KEY_ESCAPE: "Escape",
        KEY_TAB: "Tab",
        defaultDate: this.getDefaultDate(),
        dauer: null,
        dateBlackListFinal: [],
        startDate:
          this.zeitraum && this.zeitraum.beginn
            ? moment(this.zeitraum.beginn).format("DD.MM.YYYY")
            : "",
        endDate:
          this.zeitraum && this.zeitraum.ende
            ? moment(this.zeitraum.ende).format("DD.MM.YYYY")
            : "",
        datepicker: null,
        datepickerPopup: null,
        cssClasses: {
          popup: "mx-datepicker-popup",
          header: "mx-calendar-header",
          calendarContent: "mx-calendar-content",
          rows: "tr.mx-date-row:not(.d-none)",
          firstRow: "mx-date-row:first-of-type",
          lastRow: "mx-date-row:last-of-type",
          cellsInCurrentMonth: "td.cell:not(.not-current-month)",
          hidden: "d-none",
          blackDate: "black-date",
          dayView: "mx-calendar-panel-date",
          monthView: "mx-calendar-panel-month",
          yearView: "mx-calendar-panel-year",
        },
        heights: {
          contentHeightSm: 225,
          contentHeightMd: 268,
          contentHeightLg: 308,
        },
        isOpenDatepicker: false,
        isChecked: false,
      };
    },
    watch: {
      initialDate: {
        deep: true,
        handler(newInitialDate) {
          if (this.watchForExternalUpdates) {
            this.defaultDate = newInitialDate ? new Date(newInitialDate) : "";
          }
        },
      },
      zeitraum: {
        deep: true,
        handler(value) {
          if (value) {
            this.startDate = value.beginn ? moment(value.beginn).format("DD.MM.YYYY") : "";
            this.endDate = value.ende ? moment(value.ende).format("DD.MM.YYYY") : "";
            this.defaultDate = this.getDefaultDate();
          }
        },
      },
      defaultDate: {
        deep: true,
        handler(value) {
          if (this.range) {
            this.startDate = value[0] ? moment(value[0]).format("DD.MM.YYYY") : "";
            this.endDate = value[1] ? moment(value[1]).format("DD.MM.YYYY") : "";

            // update range when datepicker gets reset
            if (!value.length) {
              this.updateRange();
              this.$emit("update-termindauer", "", "", 0);
            }
          }
        },
      },
    },
    mounted() {
      this.datepicker = this.$refs.datepicker;
      this.isChecked = this.isCheckboxChecked;
      this.calculateFinalBlacklist();

      if (this.range) {
        this.calcDateDifference();
      } else {
        this.defaultDate = new Date(this.initialDate);
      }
    },
    methods: {
      /**
       * Handles the behavior when confirm button is clicked
       * Ensures popup doesn't reopen immediately after closing
       */
      handleConfirm() {
        this.isOpenDatepicker = false;
        this.$nextTick(() => {
          this.$refs.datepicker.getElementsByTagName("input")[0].blur();
        });
      },

      /**
       * Toggles the datepicker open state.
       * Can be used for both click and keyup.enter events.
       * @returns {void}
       */
      toggleDatepicker() {
        if (!this.isOpenDatepicker) {
          this.isOpenDatepicker = true;
          this.$nextTick(() => {
            this.handleOpen();
          });
        }
      },

      /**
       * returns valid moment date or null
       * @param   {string} dateString string to parse
       * @returns {moment.Moment} date or null
       */
      getMomentDate(dateString) {
        if (dateString) {
          return moment(dateString, "DD.MM.YYYY");
        }

        return null;
      },

      /**
       * calculates the duration between dates
       * @param {Array} datesArr selected date as Array or empty
       * @returns {void}
       */
      calcDateDifference(datesArr = []) {
        // return if no values exist
        if (datesArr.length < 2 || datesArr.some((date) => date === null)) return;

        // get moment dates
        const startMoment = this.getMomentDate(datesArr[0]);
        const endMoment = this.getMomentDate(datesArr[1]);

        // calculate range of start and end date
        this.dauer = endMoment.diff(startMoment, "days") || 0;

        this.$emit("start-end", {
          beginn: startMoment.format("YYYY-MM-DD"),
          ende: endMoment.format("YYYY-MM-DD"),
        });

        this.$emit("update-termindauer", startMoment, endMoment, this.dauer);
      },
      /**
       * Check if the date changed in the datepicker range
       * @returns {void}
       */
      updateRange() {
        let beginn = "";
        let ende = "";

        if (this.startDate && this.endDate) {
          // get moment dates
          const startMoment = this.getMomentDate(this.startDate);
          const endMoment = this.getMomentDate(this.endDate);

          // calculate range of start and end date
          this.dauer = endMoment.diff(startMoment, "days") || 0;

          beginn = startMoment.format("YYYY-MM-DD");
          ende = endMoment.format("YYYY-MM-DD");
        }

        // reformat dates
        this.$emit("update-range", {
          beginn: beginn,
          ende: ende,
          dauer: this.dauer,
        });
      },
      /**
       * function to get the defaultDate from zeitraum
       * @return {object}
       */
      getDefaultDate() {
        if (this.range) {
          return this.zeitraum?.beginn && this.zeitraum?.ende
            ? [
                new Date(moment(this.zeitraum.beginn).format("MM.DD.YYYY")),
                new Date(moment(this.zeitraum.ende).format("MM.DD.YYYY")),
              ]
            : [];
        } else {
          return this.initialDate ? new Date(this.initialDate) : "";
        }
      },
      /**
       * Moves focus to a different cell in the datepicker based on the given offset.
       * @param {number} dayOffset - The number of days to move the focus by.
       * @param {HTMLElement} currentPanel - The currently active panel containing the date cells (day, month, or year view).
       * @returns {void}
       */
      moveFocus(dayOffset, currentPanel) {
        // Check that currentPanel is not undefined or null
        if (!currentPanel) return;

        // Collect all cells from the current panel (day, month, year)
        const dateCells = Array.from(currentPanel.querySelectorAll(".cell"));

        // Exit if there are no date cells
        if (dateCells.length === 0) return;

        // Find the index of the currently focused cell using document.activeElement
        const focusedElement = document.activeElement;
        const focusedIndex = dateCells.findIndex((cell) => cell === focusedElement);

        // If no cell is currently focused, focus the first cell and exit
        if (focusedIndex === -1) {
          this.setFocusOnCell(dateCells[0]);
          return;
        }

        // Calculate the new index based on the offset
        const newIndex = focusedIndex + dayOffset;

        // Check if we are moving up or down and ensure we stay within the current panel
        if (newIndex >= 0 && newIndex < dateCells.length) {
          this.updateFocus(dateCells[focusedIndex], dateCells[newIndex]);
        }
      },
      /**
       * Sets focus on a specific cell in the datepicker.
       * @param {HTMLElement} cell - The cell to focus.
       * @returns {void}
       */
      setFocusOnCell(cell) {
        // Remove 'focused' class from all cells first
        const allCells = this.datepickerPopup.querySelectorAll(".cell");

        allCells.forEach((c) => c.classList.remove("focused"));

        // Set tabindex and add 'focused' class to the target cell
        cell.tabIndex = 0;
        cell.classList.add("focused");
        cell.focus();
      },

      /**
       * Updates focus by removing focus from the old cell and applying it to the new cell.
       * @param {HTMLElement} oldCell - The previously focused cell.
       * @param {HTMLElement} newCell - The new cell to focus on.
       * @returns {void}
       */
      updateFocus(oldCell, newCell) {
        // Remove focus from the old cell
        if (oldCell) {
          oldCell.classList.remove("focused");
          oldCell.tabIndex = -1;
        }

        // Set focus on the new cell
        if (newCell) {
          this.setFocusOnCell(newCell);
        }
      },

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
      handleKeydown(event) {
        const focusedElement = document.activeElement;

        // Determine if the focus is within day, month, or year view
        const isDayView = !!focusedElement.closest(".mx-calendar-panel-date");
        const isMonthView = !!focusedElement.closest(".mx-calendar-panel-month");
        const isYearView = !!focusedElement.closest(".mx-calendar-panel-year");

        // Get the current panel (day, month, or year)
        const currentPanel = isDayView
          ? focusedElement.closest(".mx-calendar-panel-date")
          : isMonthView
            ? focusedElement.closest(".mx-calendar-panel-month")
            : isYearView
              ? focusedElement.closest(".mx-calendar-panel-year")
              : null;

        // Mapping arrow keys to move steps for each view type
        const keyMoveMapping = {
          [this.KEY_ARROW_RIGHT]: isDayView || isMonthView || isYearView ? 1 : 0,
          [this.KEY_ARROW_LEFT]: isDayView || isMonthView || isYearView ? -1 : 0,
          [this.KEY_ARROW_UP]: isDayView ? -7 : isMonthView ? -3 : isYearView ? -2 : 0,
          [this.KEY_ARROW_DOWN]: isDayView ? 7 : isMonthView ? 3 : isYearView ? 2 : 0,
        };

        // Prevent default scrolling behavior for ArrowUp and ArrowDown keys
        if (event.key === this.KEY_ARROW_UP || event.key === this.KEY_ARROW_DOWN) {
          event.preventDefault();
        }

        // Get the moveStep for the pressed key, default to 0 if not found
        const moveStep = keyMoveMapping[event.key] || 0;

        // Apply the calculated move step if it's not zero and currentPanel is defined
        if (moveStep !== 0 && currentPanel) {
          // Determine direction of movement
          const direction =
            event.key === this.KEY_ARROW_RIGHT
              ? "right"
              : event.key === this.KEY_ARROW_LEFT
                ? "left"
                : event.key === this.KEY_ARROW_UP
                  ? "up"
                  : event.key === this.KEY_ARROW_DOWN
                    ? "down"
                    : null;

          if (isDayView && direction) {
            this.handleDayViewBoundaryMove(moveStep, currentPanel, direction);
          } else {
            // Move the focus within the current panel (day, month, or year)
            this.moveFocus(moveStep, currentPanel);
          }
        }

        // Handle the "Enter" key to simulate a click
        if (event.key === this.KEY_ENTER) {
          this.handleEnterKey(event);
        }

        // Close the datepicker and reset focus on "Escape"
        if (event.key === this.KEY_ESCAPE) {
          this.isOpenDatepicker = false;
          this.resetFocusToCurrentDatepickerInput();
        }

        // Call trapFocus to ensure focus stays within the datepicker
        this.trapFocus(event);
      },
      /**
       * Handles focus movement in the day view, including crossing boundaries between calendar panels.
       * @param {number} moveStep - The number of steps to move the focus by (positive for forward, negative for backward).
       * @param {HTMLElement} currentPanel - The currently active panel (day view) containing the date cells.
       * @param {string} direction - The direction of movement (e.g., 'left', 'right', 'up', 'down').
       * @returns {void}
       */
      handleDayViewBoundaryMove(moveStep, currentPanel, direction) {
        // Collecting all cells from the current panel (day view)
        const dateCells = Array.from(
          currentPanel.querySelectorAll(".cell:not(.not-current-month)"),
        );

        // Checking if there is at least one cell
        if (dateCells.length === 0) return;

        // Finding the index of the currently focused cell using document.activeElement
        const focusedElement = document.activeElement;
        const focusedIndex = dateCells.findIndex((cell) => cell === focusedElement);

        // If no cell is currently focused, focus the first cell and exit
        if (focusedIndex === -1) {
          this.setFocusOnCell(dateCells[0]);
          return;
        }

        // Calculating the new index based on the movement
        const newIndex = focusedIndex + moveStep;

        switch (direction) {
          case "down":
          case "up":
            // If moving down or up, just try to move vertically within the same calendar
            if (newIndex >= 0 && newIndex < dateCells.length) {
              this.updateFocus(dateCells[focusedIndex], dateCells[newIndex]);
            }
            break;

          case "right":
            if (newIndex >= dateCells.length) {
              // If moving right and crossing the boundary of the current calendar
              const nextCalendar = currentPanel.nextElementSibling;

              if (nextCalendar) {
                const nextDateCells = Array.from(
                  nextCalendar.querySelectorAll(".cell:not(.not-current-month)"),
                );

                if (nextDateCells.length > 0) {
                  this.setFocusOnCell(nextDateCells[0]);
                }
              }
            } else {
              // Move focus within the current calendar to the right
              this.updateFocus(dateCells[focusedIndex], dateCells[newIndex]);
            }
            break;

          case "left":
            if (newIndex < 0) {
              // If moving left and crossing the boundary of the current calendar
              const previousCalendar = currentPanel.previousElementSibling;

              if (previousCalendar) {
                const previousDateCells = Array.from(
                  previousCalendar.querySelectorAll(".cell:not(.not-current-month)"),
                );

                if (previousDateCells.length > 0) {
                  this.setFocusOnCell(previousDateCells[previousDateCells.length - 1]);
                }
              }
            } else {
              // Move focus within the current calendar to the left
              this.updateFocus(dateCells[focusedIndex], dateCells[newIndex]);
            }
            break;

          default:
            break;
        }
      },
      /**
       * Handles the behavior when the "Enter" key is pressed.
       * @param {KeyboardEvent} event - The keyboard event object.
       * @returns {void}
       */
      handleEnterKey(event) {
        // Simulate a click action
        event.target.click();

        // Wait for DOM update and focus on active cell in month or year view
        this.$nextTick(() => {
          const isYearView = document.querySelector(".mx-calendar-panel-year");
          const isMonthView = document.querySelector(".mx-calendar-panel-month");

          const activeCell = isYearView
            ? isYearView.querySelector("td.cell.active")
            : isMonthView
              ? isMonthView.querySelector("td.cell.active")
              : null;

          if (activeCell) {
            activeCell.setAttribute("tabindex", "0");
            activeCell.focus();
          }
        });
      },

      /**
       * Sets up an event listener for the datepicker popup.
       * @returns {void}
       */
      setPopupEventListener() {
        // Set focus to the first button and add keydown listener after the DOM updates
        this.$nextTick(() => {
          if (this.datepickerPopup) {
            this.datepickerPopup.addEventListener("keydown", this.handleKeydown);
          }
        });
      },

      /**
       * Checks and sets the focus on either 'today' or 'active' cell after the DOM updates.
       * @returns {void}
       */
      checkAndSetCellFocus() {
        // Set focus to the 'today' or 'active' cell after the DOM updates
        this.$nextTick(() => {
          if (!this.datepickerPopup) return;

          const yearPanels = this.datepickerPopup.querySelectorAll(".mx-calendar-panel-year");
          const monthPanels = this.datepickerPopup.querySelectorAll(".mx-calendar-panel-month");
          const dayPanels = this.datepickerPopup.querySelectorAll(".mx-calendar-panel-date");

          // If there's at least one year panel, we're in the year view
          if (yearPanels.length) {
            // Instead of taking the last panel, focus on the left (first) panel:
            const leftYearPanel = yearPanels[0];
            // or yearPanels.length > 1 ? yearPanels[0] : yearPanels[0] — basically just index [0]

            const activeYearCell =
              leftYearPanel.querySelector("td.cell.active") ||
              leftYearPanel.querySelector("td.cell");

            if (activeYearCell) {
              this.setFocusOnCell(activeYearCell);
            }
            return;
          }

          // If not in the year view, check if the month view is open
          if (monthPanels.length) {
            // Take the first (left) panel
            const leftMonthPanel = monthPanels[0];

            const activeMonthCell =
              leftMonthPanel.querySelector("td.cell.active") ||
              leftMonthPanel.querySelector("td.cell");

            if (activeMonthCell) {
              this.setFocusOnCell(activeMonthCell);
            }
            return;
          }

          // Otherwise, we're likely in the day view
          if (dayPanels.length) {
            // Again, focus on the first (left) panel
            const leftDayPanel = dayPanels[0];

            const activeDayCell =
              leftDayPanel.querySelector(".cell.active") ||
              leftDayPanel.querySelector(".cell.today") ||
              leftDayPanel.querySelector(".cell:not(.not-current-month)");

            if (activeDayCell) {
              this.setFocusOnCell(activeDayCell);
            }
          }
        });
      },

      /**
       * Traps focus within the datepicker popup for improved accessibility.
       * @param {KeyboardEvent} event - The keyboard event object.
       * @returns {void}
       */
      trapFocus(event) {
        // Select all potential focusable elements inside the datepickerPopup
        const focusableElements = this.getFocusableElements();

        // Exit if no focusable elements are found
        if (focusableElements.length === 0) {
          return;
        }

        // Get the first and last focusable elements
        const [firstElement, lastElement] = [
          focusableElements[0],
          focusableElements[focusableElements.length - 1],
        ];

        // Handling Tab and Shift+Tab navigation for focus trapping
        if (event.key === this.KEY_TAB) {
          this.handleTabNavigation(event, firstElement, lastElement);
        }
      },

      /**
       * Retrieves all focusable elements inside the datepickerPopup.
       * @returns {HTMLElement[]} Array of focusable elements.
       */
      getFocusableElements() {
        const allFocusableElements = this.datepickerPopup.querySelectorAll(
          "input, a, .mx-calendar-panel-month button," +
            " .mx-calendar-panel-year button," +
            " .mx-calendar-panel-date button:not(.mx-btn-icon-double-left)," +
            ' [tabindex]:not([tabindex="-1"]), .mx-datepicker-footer button',
        );

        // Filter out elements that are not visible
        return Array.from(allFocusableElements).filter((element) => {
          const style = window.getComputedStyle(element);

          return (
            element.offsetWidth > 0 &&
            element.offsetHeight > 0 &&
            style.visibility !== "hidden" &&
            style.display !== "none"
          );
        });
      },

      /**
       * Handles Tab and Shift+Tab navigation for focus trapping.
       * @param {KeyboardEvent} event - The keyboard event object.
       * @param {HTMLElement} firstElement - The first focusable element.
       * @param {HTMLElement} lastElement - The last focusable element.
       * @returns {void}
       */
      handleTabNavigation(event, firstElement, lastElement) {
        const isShiftTab = event.shiftKey;

        // Move focus accordingly based on which element is currently focused
        if (isShiftTab && document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        } else if (!isShiftTab && document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      },

      /**
       * Resets the focus back to the current datepicker input element.
       * @returns {void}
       */
      resetFocusToCurrentDatepickerInput() {
        this.$nextTick(() => {
          this.$refs.datepicker.getElementsByTagName("input")[0].select();
        });
      },

      /**
       * Improves the accessibility of navigation buttons in the datepicker.
       * Sets titles for previous, next, month, and year buttons for better understanding and accessibility.
       * @returns {void}
       */
      improveNavigationButtonAccessibility() {
        this.$nextTick(() => {
          if (!this.datepickerPopup) return;

          // Mapping of selectors to their respective titles for different buttons
          const buttonTitles = {
            ".mx-calendar-header .mx-btn-icon-left, .mx-calendar-header .mx-btn-icon-double-left":
              "Zurück",
            ".mx-calendar-header .mx-btn-icon-right, .mx-calendar-header .mx-btn-icon-double-right":
              "Weiter",
            ".mx-calendar-header .mx-btn-current-month": "Monat",
            ".mx-calendar-header .mx-btn-current-year": "Jahr",
          };

          // Iterate over the selectors and set titles to the respective buttons
          Object.entries(buttonTitles).forEach(([selector, title]) => {
            const buttons = this.datepickerPopup.querySelectorAll(selector);

            buttons.forEach((button) => {
              button.title = title;
            });
          });
        });
      },

      /**
       * Sets titles to each cell in the datepicker.
       * The title is set to the text content of the cell for better accessibility.
       * @returns {void}
       */
      setCellTitles() {
        this.$nextTick(() => {
          if (!this.datepickerPopup) return;

          // Select all cell elements in the month and year views of the datepicker
          const cells = this.datepickerPopup.querySelectorAll(
            ".mx-calendar-panel-month " +
              ".mx-calendar-content .cell, " +
              ".mx-calendar-panel-year " +
              ".mx-calendar-content .cell",
          );

          // Set the title of each cell to its text content
          cells.forEach((cell) => {
            cell.title = cell.textContent.trim();
          });
        });
      },

      /**
       * run functions to customize the datepicker
       * @returns {void}
       */
      customizeDatePicker() {
        this.setDateBlacklist();

        this.hideRowsNotInCurrentMonth();
      },

      /**
       * Sets CSS classes and titles for black and white days based on the provided lists.
       * @param {Array} dateList - The list of dates to process.
       * @returns {void}
       */
      async setDateList(dateList) {
        // Select popup element
        await this.selectDatepickerPopup();

        // Return if no popup element exists
        if (!this.datepickerPopup) return;

        const calendarContents = this.datepickerPopup.querySelectorAll(
          `.${this.cssClasses.calendarContent}`,
        );

        // If no dates are visible, stop processing
        if (!calendarContents) return;

        // First, remove existing 'blackDate' class from all previously marked cells in both calendars
        calendarContents.forEach((calendarContent) => {
          const blackDateCells = calendarContent.querySelectorAll(`.${this.cssClasses.blackDate}`);

          blackDateCells.forEach((cell) => {
            cell.classList.remove(this.cssClasses.blackDate);
            cell.removeAttribute("data-tooltip");
          });
        });

        dateList.forEach((date) => {
          const localDate = date instanceof Date ? moment(date) : date.date;

          const formattedDate = localDate.format("YYYY-MM-DD");

          // Apply the class to both calendars in the range view
          calendarContents.forEach((calendarContent) => {
            // Find the corresponding cell in the current calendar
            const dateCell = calendarContent.querySelector(`.cell[title='${formattedDate}']`);

            // Add CSS class if the cell exists
            if (dateCell) {
              this.addDateClass(dateCell, date.title || "");
            }
          });
        });
      },

      /**
       * Adds the specified CSS class and updates attributes for the date cell.
       * @param {Element} dateCell - The cell element for the date.
       * @param {string} zusatz - Additional label for the date (if available).
       * @returns {void}
       */
      addDateClass(dateCell, zusatz) {
        dateCell.classList.add(this.cssClasses.blackDate);

        const dateTitle = zusatz || "";

        // Update title and aria-label attributes if a corresponding label entry exists
        if (dateTitle) {
          dateCell.setAttribute("aria-label", dateCell.getAttribute("title"));
          dateCell.setAttribute("title", dateTitle);
        }
      },

      async setDateBlacklist() {
        this.setDateList(this.dateBlackListFinal);
      },

      /**
       * Hide first or last row if all days in the calendar row are in the new month
       * @returns {void}
       */
      async hideRowsNotInCurrentMonth() {
        // Select popup element
        await this.selectDatepickerPopup();

        // Return if no popup element exists
        if (!this.datepickerPopup) return;

        // Get calendar panels
        const popupContent = this.datepickerPopup.querySelectorAll(
          `.${this.cssClasses.calendarContent}`,
        );

        for (const panel of popupContent) {
          // Select all <tr> rows without filtering by 'd-none'
          const rows = panel.querySelectorAll("tr.mx-date-row");

          for (const row of rows) {
            // Check all <td> elements in the row that are 'cell' and do not have the 'not-current-month' class
            const cellsInRowInCurrentMonth = row.querySelectorAll(
              this.cssClasses.cellsInCurrentMonth,
            );
            const shouldShowRow = cellsInRowInCurrentMonth.length > 0;

            // Toggle the 'hidden' class
            row.classList.toggle(this.cssClasses.hidden, !shouldShowRow);
          }

          // Now re-count how many remain visible
          const finalVisibleRows = panel.querySelectorAll(
            `tr.mx-date-row:not(.${this.cssClasses.hidden})`,
          );
          const visibleCount = finalVisibleRows.length;

          // Adjust panel height
          if (visibleCount === 0) {
            // No visible rows
            panel.style.setProperty("--mx-content-height", "0px");
          } else if (visibleCount < 5) {
            // 1–4 visible rows
            panel.style.setProperty("--mx-content-height", this.heights.contentHeightSm + "px");
          } else if (visibleCount === 5) {
            // Exactly 5 rows
            panel.style.setProperty("--mx-content-height", this.heights.contentHeightMd + "px");
          } else {
            // More than 5 rows
            panel.style.setProperty("--mx-content-height", this.heights.contentHeightLg + "px");
          }
        }
      },

      /**
       * select popup element and customize the datepicker
       * @returns {void}
       */
      async handleOpen() {
        this.isChecked = this.isCheckboxChecked;
        // get popup element
        await this.selectDatepickerPopup();

        if (this.datepickerPopup) {
          // customize datepicker: remove unnecessary row, add css classes to date cells
          this.customizeDatePicker();

          this.improveNavigationButtonAccessibility();

          this.setCellTitles();

          this.checkAndSetCellFocus();

          this.setPopupEventListener();

          this.$emit("date-picker-opened");
        }
      },
      handleClose() {
        this.datepickerPopup.removeEventListener("keydown", this.handleKeydown);
        this.updateRange();
        this.isOpenDatepicker = false;
        this.resetFocusToCurrentDatepickerInput();
      },

      /**
       * function to handle the calendar change event. customize the popup element.
       * @returns {void}
       */
      handleCalendarChange() {
        // customize datepicker: remove unnecessary row, add css classes to date cells
        this.customizeDatePicker();

        this.improveNavigationButtonAccessibility();

        this.setCellTitles();

        this.$nextTick(() => {
          this.hideRowsNotInCurrentMonth();
        });
      },

      /**
       * function to select the popup element of the datepicker after it was opened
       * @returns {Promise}
       */
      selectDatepickerPopup() {
        return new Promise((resolve, reject) => {
          // no need to do anything if popup exists
          if (this.datepickerPopup) resolve();

          this.$nextTick(() => {
            this.datepickerPopup = document.querySelector(`.${this.cssClasses.popup}`);
            if (this.datepickerPopup) resolve();

            reject();
          });
        });
      },

      updateCheckbox(value) {
        this.$emit("is-checkbox-checked", value);
      },

      /**
       * function to handle the change event. set the start date and emits the date-picker-value event.
       * @emits date-picker-value
       * @returns {void}
       */
      handleChange(selectedDates) {
        if (!selectedDates) {
          this.$emit("date-picker-value", null);
          return;
        }
        const formatDate = (date) =>
          moment(date, moment.ISO_8601, true).isValid()
            ? moment(date).format("DD.MM.YYYY")
            : moment(date, "DD.MM.YYYY").format("DD.MM.YYYY");

        // Single date processing
        if (!this.range) {
          const formattedDate = formatDate(selectedDates);

          this.$emit("date-picker-value", formattedDate);
        } else {
          // Range date processing
          if (selectedDates.length < 1 || selectedDates[0] === null) {
            this.startDate = "";
            this.endDate = "";
          } else {
            this.startDate = formatDate(selectedDates[0]);
            this.endDate = this.startDate;

            if (selectedDates.length >= 2 && selectedDates[1] !== null) {
              this.endDate = formatDate(selectedDates[1]);
              this.calcDateDifference(selectedDates);
            }
          }
        }
        this.handleConfirm();
        this.$nextTick(() => {
          // Reset the focus after the DOM update
          this.checkAndSetCellFocus();
          this.resetFocusToCurrentDatepickerInput();
        });
      },

      handlePanelChange() {
        this.$nextTick(() => {
          this.improveNavigationButtonAccessibility();

          this.setCellTitles();

          this.checkAndSetCellFocus();

          this.setPopupEventListener();
        });
      },
      /**
       * creates a list of all blacklisted dates and the corresponding titles.
       */
      calculateFinalBlacklist() {
        if (!Array.isArray(this.dateBlackList)) {
          this.dateBlackListFinal = [];
        } else if (this.dateBlackList[0] instanceof Date) {
          this.dateBlackListFinal = this.dateBlackList;
        } else {
          this.dateBlackList.forEach((date) => {
            if (date.to && date.from) {
              const fromDate = moment(date.from);
              const toDate = moment(date.to);
              const diff = toDate.diff(fromDate, "days");

              for (let i = 0; i <= diff; i++) {
                this.dateBlackListFinal.push({
                  date: moment(date.from).add(i, "days"),
                  title: date.title,
                });
              }
            }
          });
        }
      },
    },
  };
</script>

<template>
  <DatePickerNext
    ref="datepicker"
    v-model:value="defaultDate"
    class="dps-form-datepicker"
    :class="{ 'dps-form-datepicker--range': range }"
    format="DD.MM.YYYY"
    type="date"
    :open="isOpenDatepicker"
    :range="range"
    :popup-class="'dps-form-datepicker__popup' + (range ? ' range' : '')"
    :placeholder="
      range
        ? startDate && endDate
          ? `${startDate} - ${endDate}`
          : 'TT.MM.JJJJ - TT.MM.JJJJ'
        : placeholder
    "
    separator=" - "
    :disabled="disabled"
    :input-attr="inputAttr"
    :clearable="clearable"
    :editable="editable"
    :confirm="range"
    confirm-text="Übernehmen"
    @click="toggleDatepicker"
    @keydown.enter.stop.prevent="toggleDatepicker"
    @close="handleClose"
    @calendar-change="handleCalendarChange"
    @change="handleChange"
    @pick="$emit('pick-element', $event)"
    @panel-change="handlePanelChange"
  >
    <template v-if="range || hasCheckbox" #footer>
      <DpsFormCheckbox
        v-if="hasCheckbox"
        v-model="isChecked"
        :title="checkboxTitle"
        @update:model-value="updateCheckbox"
      >
        {{ checkboxTitle }}
      </DpsFormCheckbox>
      <DpsButton
        v-if="range"
        class="dps-form-datepicker__button-cancel"
        variant="secondary"
        title="Abbrechen"
        size="sm"
        @click="handleClose"
      >
        Abbrechen
      </DpsButton>
    </template>
    <template #icon-calendar>
      <span class="dps-icon dps-icon--calender"></span>
    </template>
  </DatePickerNext>
</template>
