import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsIconButton from "@/components/icon-button/DpsIconButton.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsIconButton", () => {
  const wrapper = mount(DpsIconButton, {
    props: {
      icon: "placeholder",
    },
  });

  test("builds", () => {
    expect(wrapper).toBeTruthy();
  });

  test("matches snapshot", () => {
    expect(wrapper.wrapperElement).toMatchSnapshot();
  });

  describe("Template:", () => {
    test.todo("DpsIconButton");
  });

  describe("Interactions:", () => {
    test.todo("DpsIconButton");
  });
});
