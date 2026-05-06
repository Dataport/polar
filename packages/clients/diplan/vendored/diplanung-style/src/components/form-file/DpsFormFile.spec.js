import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import DpsFormFile from "@/components/form-file/DpsFormFile.vue";
import { userEvent } from "@storybook/test";
import { getUniqueId } from "@/services/id.ts";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

const mockFile = new File(["content"], "filename.txt", { type: "text/plain" });

const getWrapper = () => {
  return mount(DpsFormFile, {
    props: {
      id: "DpsFormFileTest",
    },
    slots: {},
    global: {},
  });
};

describe("DpsFormFile", () => {
  let wrapper;

  beforeEach(() => {
    vi.mock("@/services/id.ts");
    vi.mocked(getUniqueId).mockReturnValue("TestID");

    wrapper = getWrapper();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test("builds", () => {
    expect(wrapper).toBeTruthy();
  });

  test("matches snapshot", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  describe("Template:", () => {
    test("correct ID gets set", async () => {
      const input = wrapper.find("#DpsFormFileTest");

      expect(wrapper.vm.uniqID).toBe("DpsFormFileTest");
      expect(input.exists()).toBe(true);
    });

    test("accept attribute gets set", async () => {
      await wrapper.setProps({ accept: ".xml, application/pdf" });
      const input = wrapper.find("#DpsFormFileTest");

      expect(input.exists()).toBe(true);
      expect(input.element.getAttribute("accept")).toBe(".xml, application/pdf");
    });

    test("multiple attribute gets set", async () => {
      await wrapper.setProps({ multiple: true });
      const input = wrapper.find("#DpsFormFileTest");

      expect(input.exists()).toBe(true);
      expect(input.element.hasAttribute("multiple")).toBe(true);
    });

    test("component gets disabled", async () => {
      await wrapper.setProps({ disabled: true });
      const div = wrapper.find(".dps-form-file");
      const input = wrapper.find("#DpsFormFileTest");

      expect(input.exists()).toBe(true);
      expect(div.exists()).toBe(true);

      expect(input.element.hasAttribute("disabled")).toBe(true);
      expect(div.classes("dps-form-file--disabled")).toBe(true);
    });

    test("title gets set", async () => {
      await wrapper.setProps({ title: "TestTitle" });
      const label = wrapper.find("label");

      expect(label.element.getAttribute("title")).toBe("TestTitle");
    });

    test("error state gets set", async () => {
      await wrapper.setProps({ error: true });
      const div = wrapper.find(".dps-form-file");

      expect(div.classes("dps-form-file--error")).toBe(true);
    });

    test("required attribute gets set", async () => {
      await wrapper.setProps({ required: true });
      const input = wrapper.find("#DpsFormFileTest");

      expect(input.exists()).toBe(true);
      expect(input.element.hasAttribute("required")).toBe(true);
    });
  });

  describe("Interactions:", () => {
    test("Click on input emits event containing file", async () => {
      const input = wrapper.find("#DpsFormFileTest");

      expect(input.exists()).toBe(true);

      await userEvent.upload(input.element, mockFile);

      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual(mockFile);
    });

    test("Click on multiple input emits event containing file array", async () => {
      await wrapper.setProps({ multiple: true });
      const input = wrapper.find("#DpsFormFileTest");

      expect(input.exists()).toBe(true);

      await userEvent.upload(input.element, mockFile);

      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual([mockFile]);
    });

    test("Cancelling input emits event with value null", async () => {
      const input = wrapper.find("#DpsFormFileTest");

      expect(input.exists()).toBe(true);

      await input.setValue("");
      await input.trigger("cancel");

      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual(null);
    });

    test("Cancelling multiple input emits event with empty array", async () => {
      await wrapper.setProps({ multiple: true });
      const input = wrapper.find("#DpsFormFileTest");

      expect(input.exists()).toBe(true);

      await input.setValue("");
      await input.trigger("cancel");

      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual([]);
    });
  });
});
