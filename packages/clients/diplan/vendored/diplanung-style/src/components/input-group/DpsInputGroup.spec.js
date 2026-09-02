import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsInputGroup from "@/components/input-group/DpsInputGroup.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsInputGroup", () => {
  const wrapper = mount(DpsInputGroup, {
    props: {
      id: "inputGroup1",
    },
    slots: {},
    global: {},
  });

  test("builds", () => {
    expect(wrapper).toBeTruthy();
  });

  test("matches snapshot", () => {
    expect(wrapper.wrapperElement).toMatchSnapshot();
  });

  describe("Template:", () => {
    test.todo("DpsInputGroup");
  });

  describe("Interactions:", () => {
    test.todo("DpsInputGroup");
  });
});
