import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsFormTextarea from "@/components/form-textarea/DpsFormTextarea.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsFormTextarea", () => {
  const wrapper = mount(DpsFormTextarea, {
    props: {},
    attachTo: document.body,
  });

  test("builds", () => {
    expect(wrapper).toBeTruthy();
  });

  test("matches snapshot", () => {
    expect(wrapper.wrapperElement).toMatchSnapshot();
  });

  describe("Template:", () => {
    describe("resizable=''", () => {
      test.todo("DpsFormTextarea");
    });

    describe("success=''", () => {
      test.todo("DpsFormTextarea");
    });

    describe("error=''", () => {
      test.todo("DpsFormTextarea");
    });

    describe("rows=''", () => {
      test.todo("DpsFormTextarea");
    });

    describe("readonly=''", () => {
      test.todo("DpsFormTextarea");
    });

    describe("disabled=''", () => {
      test.todo("DpsFormTextarea");
    });
  });

  describe("Interactions:", () => {
    describe("update", () => {
      test.todo("DpsFormTextarea");
    });
  });
});
