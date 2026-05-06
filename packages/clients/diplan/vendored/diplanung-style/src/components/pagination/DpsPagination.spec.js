// TODO Refactoring: Internal tests^, coverage 86%
import { shallowMount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import DpsPagination from "@/components/pagination/DpsPagination.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsPagination", function () {
  const numberOfElements = 200;

  const wrapper = shallowMount(DpsPagination, {
    props: {
      numberOfElements: numberOfElements,
    },
    global: {
      mocks: {},
    },
  });

  it("number of pages should be 8", function () {
    expect(wrapper.vm.numberOfPages).to.equal(8);
  });

  it("shown page numbers should be 1 to 6", function () {
    expect(wrapper.vm.shownPageNumbers).to.eql([1, 2, 3, 4, 5]);
  });

  it("shownElements should be 0 to 24", function () {
    expect(wrapper.vm.shownElements).to.eql({
      elementsPerPage: 25,
      start: 0,
      end: 24,
      currentPage: 1,
    });
  });

  it("should go to next page", function () {
    wrapper.vm.updatePage("inc");
    expect(wrapper.vm.currentPage).to.equal(2);
    expect(wrapper.emitted().updatePagination[0][0]).to.eql({
      elementsPerPage: 25,
      start: 25,
      end: 49,
      currentPage: 2,
    });
    expect(wrapper.vm.shownPageNumbers).to.eql([1, 2, 3, 4, 5]);
  });

  it("should update shown pages", function () {
    wrapper.vm.updatePage(5);
    expect(wrapper.vm.currentPage).to.equal(5);
    expect(wrapper.vm.shownPageNumbers).to.eql([3, 4, 5, 6, 7]);
  });

  it("should update elements per page", async function () {
    wrapper.vm.$data.elementsPerPage = { value: 100, label: 100 };
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.elementsPerPage.value).to.equal(100);
    expect(wrapper.vm.currentPage).to.equal(1);
    expect(wrapper.vm.shownElements).to.eql({
      elementsPerPage: 100,
      start: 0,
      end: 99,
      currentPage: 1,
    });
    expect(wrapper.vm.numberOfPages).to.equal(2);
  });
});
