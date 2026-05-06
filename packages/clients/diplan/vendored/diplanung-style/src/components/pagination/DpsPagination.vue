<script>
  // TODO Refactoring: https://bootstrap-vue.org/docs/components/pagination
  import DpsButton from "@/components/button/DpsButton.vue";
  import DpsFormGroup from "@/components/form-group/DpsFormGroup.vue";
  import DpsFormSelect from "@/components/form-select/DpsFormSelect.vue";
  import { getUniqueId } from "@/services/id.ts";

  export default {
    name: "DpsPagination",
    components: {
      DpsFormGroup,
      DpsButton,
      DpsFormSelect,
    },
    props: {
      /**
       * Total Number of Elements
       * @required
       */
      numberOfElements: {
        type: Number,
        required: true,
      },
      /**
       * Label of pagination menu for accessibilty ("aria-label")
       * @default undefined
       */
      ariaLabel: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * ID of the HTML element the pagination is controlling for accessibility ("aria-controls")
       * @default undefined
       */
      ariaContentId: {
        type: String,
        required: false,
        default: undefined,
      },
      /**
       * Configure select options for "elements per page"
       * @default [25, 50, 100]
       */
      elementsPerPageOptions: {
        type: Array,
        required: false,
        default() {
          return [25, 50, 100];
        },
      },
      /**
       * Configure maximum number of page buttons in pagination
       * @default 5
       */
      numberOfPageNumbers: {
        type: Number,
        required: false,
        default: 5,
      },
      /**
       * Set number of pages as prop if the calculation should not be handled automatically (e.g. for serverside pagination). A note for migration: Was "pagesFromServer"
       * @default null
       */
      numberOfPagesAsProp: {
        type: Number,
        required: false,
        default: null,
      },
      /**
       * Set current page as prop (e.g. for serverside pagination)
       * @default null
       */
      currentPageAsProp: {
        type: Number,
        required: false,
        default: undefined,
      },
      /**
       * Set default option for "elements per page". If not set the first option will be selected. This is useful e.g. when resetting the page size to default on removing filters.
       */
      elementsPerPageAsProp: {
        type: Number,
        required: false,
        default: undefined,
      },
    },
    emits: [
      /**
       * Emitted when the pagination is updated
       * @event module:DpsPagination#shownElements
       */
      "updatePagination", // TODO fix naming
    ],
    data() {
      return {
        elementsPerPage: this.elementsPerPageAsProp
          ? {
              value: this.elementsPerPageAsProp,
              label: this.elementsPerPageAsProp,
            }
          : {
              value: this.elementsPerPageOptions[0],
              label: this.elementsPerPageOptions[0],
            },
        currentPage: this.currentPageAsProp ?? 1,
        paginationButtons: [],
      };
    },
    computed: {
      uniqueId() {
        return getUniqueId("dps-pagination-");
      },
      /**
       * Number of Pages
       * @return {number}
       */
      numberOfPages() {
        return (
          this.numberOfPagesAsProp ?? Math.ceil(this.numberOfElements / this.elementsPerPage.value)
        );
      },
      /**
       * calculates Page Numbers to be shown on the buttons,
       * shows all if numberOfPages is smaller than numberOfPageNumbers
       * @return {number|*[]}
       */
      shownPageNumbers() {
        if (this.numberOfPages <= this.numberOfPageNumbers) {
          return this.numberOfPages;
        } else {
          let numberNextPages = Math.ceil(this.numberOfPageNumbers / 2);
          const numberPrevPages = Math.floor(this.numberOfPageNumbers / 2);
          const sPages = [];

          for (let i = -numberPrevPages; i < numberNextPages; i++) {
            if (this.currentPage + i > 0 && this.currentPage + i <= this.numberOfPages) {
              sPages.push(this.currentPage + i);
            } else if (this.currentPage + numberNextPages <= this.numberOfPages) {
              numberNextPages++;
            }
          }

          return sPages;
        }
      },
      /**
       * calculates which elements will be shown on the current page
       * @return {object} {elementsPerPage: default.elementsPerPageAsProp, start: (number|number), end: number, currentPage: number}
       */
      shownElements() {
        const calculateStart = (this.currentPage - 1) * this.elementsPerPage.value;
        const start = calculateStart ?? 0;
        const end =
          start + this.elementsPerPage.value < this.numberOfElements
            ? start + this.elementsPerPage.value - 1
            : this.numberOfElements - 1;

        return {
          start,
          end,
          elementsPerPage: this.elementsPerPage.value,
          currentPage: this.currentPage,
        };
      },
    },
    watch: {
      elementsPerPage() {
        this.currentPage = 1;
        this.$emit("updatePagination", this.shownElements);
      },
      currentPage() {
        this.$nextTick(() => {
          this.updatePaginationButtons();

          this.paginationButtons.forEach((btnElem) => {
            btnElem.removeEventListener("keydown", this.onPageButtonKeydown);
            btnElem.addEventListener("keydown", this.onPageButtonKeydown);
          });
        });
      },
      currentPageAsProp() {
        if (this.currentPageAsProp) {
          this.currentPage = this.currentPageAsProp;
          this.$emit("updatePagination", this.shownElements);
        }
      },
    },
    async mounted() {
      this.updatePaginationButtons();

      this.paginationButtons.forEach((btnElem) => {
        btnElem.addEventListener("keydown", this.onPageButtonKeydown);
      });
    },
    beforeUnmount() {
      this.paginationButtons.forEach((btnElem) => {
        btnElem.removeEventListener("keydown", this.onPageButtonKeydown);
      });
    },
    methods: {
      onPageButtonKeydown(ev) {
        const { key, currentTarget } = ev;
        let index = this.paginationButtons.indexOf(currentTarget);
        let newElem = undefined;

        switch (key) {
          case "Left":
          case "ArrowLeft":
            index = index > 0 ? index - 1 : this.paginationButtons.length - 1;
            newElem = this.paginationButtons[index];

            this.setFocusToPaginationItem(newElem);
            break;

          case "Right":
          case "ArrowRight":
            index = index < this.paginationButtons.length - 1 ? index + 1 : 0;
            newElem = this.paginationButtons[index];

            this.setFocusToPaginationItem(newElem);
            break;

          case " ":
          case "Enter":
            currentTarget.click();
            break;

          default:
            break;
        }
      },
      isPrintableCharacter(str) {
        return str.length === 1 && str.match(/\S/);
      },
      updatePaginationButtons() {
        this.paginationButtons = this.$refs.paginationMenu
          ? Array.from(this.$refs.paginationMenu.getElementsByTagName("button")).filter(
              (elem) => !elem.disabled,
            )
          : [];
      },
      setFocusToPaginationItem(newElem) {
        this.paginationButtons.forEach((btnElem) => {
          btnElem.tabIndex = -1;
        });

        newElem.tabIndex = 0;
        newElem.focus();
      },
      /**
       * updates value of current page
       * @param {Number|String} page number of page or inc/dec
       * @return void
       */
      updatePage(page) {
        if (page === "inc") {
          if (this.currentPage < this.numberOfPages) {
            this.currentPage++;
          }
        } else if (page === "dec") {
          if (this.currentPage > 1) {
            this.currentPage--;
          }
        } else {
          this.currentPage = page;
        }

        this.$emit("updatePagination", this.shownElements);
      },
    },
  };
</script>

<template>
  <div class="dps-pagination">
    <ul
      ref="paginationMenu"
      role="menubar"
      :aria-label="ariaLabel ?? 'Paginierung'"
      class="dps-pagination__buttons"
    >
      <li role="presentation">
        <DpsButton
          role="menuitem"
          :aria-controls="ariaContentId"
          title="erste Seite"
          aria-label="erste Seite"
          :aria-disabled="currentPage === 1 || numberOfPages === 0"
          :disabled="currentPage === 1 || numberOfPages === 0"
          tabindex="-1"
          variant="secondary"
          icon="chevron-left-double-small"
          squared
          size="lg"
          @click="updatePage(1)"
        />
      </li>
      <li role="presentation">
        <DpsButton
          role="menuitem"
          :aria-controls="ariaContentId"
          title="Seite zurück"
          aria-label="Seite zurück"
          :aria-disabled="currentPage === 1 || numberOfPages === 0"
          :disabled="currentPage === 1 || numberOfPages === 0"
          tabindex="-1"
          variant="secondary"
          icon="chevron-left-small"
          squared
          size="lg"
          @click="updatePage('dec')"
        />
      </li>
      <li v-for="page in shownPageNumbers" :key="page" ref="paginationItem" role="presentation">
        <DpsButton
          role="menuitemradio"
          :aria-controls="ariaContentId"
          :title="`Seite ${page}`"
          :aria-label="`Seite ${page}`"
          :aria-checked="page === currentPage"
          :aria-posinset="page"
          :aria-setsize="numberOfPages"
          :tabindex="page === currentPage ? '0' : '-1'"
          :class="page === currentPage ? 'active' : ''"
          variant="secondary"
          squared
          size="lg"
          @click="updatePage(page)"
        >
          {{ page }}
        </DpsButton>
      </li>
      <li role="presentation">
        <DpsButton
          role="menuitem"
          :aria-controls="ariaContentId"
          title="nächste Seite"
          aria-label="nächste Seite"
          :aria-disabled="currentPage === numberOfPages || numberOfPages === 0"
          :disabled="currentPage === numberOfPages || numberOfPages === 0"
          tabindex="-1"
          variant="secondary"
          icon="chevron-right-small"
          squared
          size="lg"
          @click="updatePage('inc')"
        />
      </li>
      <li role="presentation">
        <DpsButton
          role="menuitem"
          :aria-controls="ariaContentId"
          title="letzte Seite"
          aria-label="letzte Seite"
          :aria-disabled="currentPage === numberOfPages || numberOfPages === 0"
          :disabled="currentPage === numberOfPages || numberOfPages === 0"
          tabindex="-1"
          variant="secondary"
          icon="chevron-right-double-small"
          squared
          size="lg"
          @click="updatePage(numberOfPages)"
        />
      </li>
    </ul>
    <div class="dps-pagination__select-container">
      <DpsFormGroup label="Treffer pro Seite" :label-for="'pagination-select-' + uniqueId">
        <DpsFormSelect
          :id="'pagination-select-' + uniqueId"
          v-model="elementsPerPage"
          aria-label="Treffer pro Seite"
          :options="elementsPerPageOptions"
          required
          title="Treffer pro Seite"
        />
      </DpsFormGroup>
    </div>
  </div>
</template>
