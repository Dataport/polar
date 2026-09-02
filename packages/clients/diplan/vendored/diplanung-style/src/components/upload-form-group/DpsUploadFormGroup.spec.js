import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import DpsUploadFormGroup from "@/components/upload-form-group/DpsUploadFormGroup.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

const getWrapper = () => {
  return mount(DpsUploadFormGroup, {
    props: {
      id: "DpsUploadFormGroupTest",
    },
    slots: {},
    global: {},
  });
};

describe("DpsUploadFormGroup", () => {
  let wrapper;

  beforeEach(() => {
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
    test("label gets displayed", async () => {
      await wrapper.setProps({ label: "Testlabel" });
      const label = wrapper.find(".dps-form-group__label");

      expect(label.exists()).toBe(true);
      expect(label.element.innerHTML).toBe("Testlabel");
    });

    test("label gets hidden", async () => {
      await wrapper.setProps({ label: "Testlabel", hideLabel: true });
      const label = wrapper.find(".dps-form-group__label");

      expect(label.exists()).toBe(true);
      expect(label.classes().includes("visually-hidden")).toBe(true);
    });

    test("upload button label and title get set", async () => {
      await wrapper.setProps({ uploadButtonLabel: "Buttonlabel" });
      const button = wrapper.find(".dps-button");

      expect(button.exists()).toBe(true);
      expect(button.element.innerHTML.includes("Buttonlabel")).toBe(true);
      expect(button.element.getAttribute("title")).toBe("Buttonlabel");

      await wrapper.setProps({ uploadButtonTitle: "Buttontitle" });
      expect(button.element.getAttribute("title")).toBe("Buttontitle");
    });

    test("accept attribute and description gets set", async () => {
      await wrapper.setProps({ fileAccept: [".xml", "application/pdf"] });
      const input = wrapper.find("#DpsUploadFormGroupTest");
      const description = wrapper.find("#DpsUploadFormGroupTest-form-group__description");

      expect(input.exists()).toBe(true);
      expect(input.element.getAttribute("accept")).toBe(".xml, application/pdf");
      expect(description.exists()).toBe(true);
      expect(description.element.innerHTML).toBe("Erlaubte Dateiformate: .xml, application/pdf");
    });

    test("multiple attribute gets set", async () => {
      await wrapper.setProps({ fileMultiple: true });
      const input = wrapper.find("#DpsUploadFormGroupTest");

      expect(input.exists()).toBe(true);
      expect(input.element.hasAttribute("multiple")).toBe(true);
    });

    test("component gets disabled", async () => {
      await wrapper.setProps({ disabled: true });
      const formGroup = wrapper.find(".dps-form-file--disabled");
      const input = wrapper.find("#DpsUploadFormGroupTest");
      const button = wrapper.find(".dps-button");

      expect(input.exists()).toBe(true);
      expect(formGroup.exists()).toBe(true);
      expect(button.exists()).toBe(true);

      expect(input.element.hasAttribute("disabled")).toBe(true);
      expect(button.element.hasAttribute("disabled")).toBe(true);
    });

    test("title gets set", async () => {
      await wrapper.setProps({ label: "Testlabel" });
      const inputLabel = wrapper.find(".dps-form-file > label");

      expect(inputLabel.element.getAttribute("title")).toBe("Testlabel");
      await wrapper.setProps({ title: "Testtitle" });

      expect(inputLabel.element.getAttribute("title")).toBe("Testtitle");
    });

    test("disable upload button", async () => {
      await wrapper.setProps({ disableUploadButton: true });
      await wrapper.setData({ filesSelected: [File] });
      const button = wrapper.find(".dps-button");

      expect(button.exists()).toBe(true);
      expect(button.element.hasAttribute("disabled")).toBe(true);
    });

    test("gets displayed without button", async () => {
      await wrapper.setProps({ hideUploadButton: true });
      const button = wrapper.find(".dps-button");

      expect(button.exists()).toBe(false);
    });

    test("shows error message", async () => {
      await wrapper.setProps({ uploadErrorMessage: "Lorem ipsum dolor sit amet" });
      const formGroup = wrapper.getComponent({ name: "DpsFormGroup" });
      const formFileError = wrapper.find(".dps-form-file--error");

      expect(formGroup.exists()).toBe(true);
      expect(formFileError.exists()).toBe(true);
      expect(formGroup.props("valid")).toBe(false);
      expect(formGroup.props("errorFeedback")).toBe("Lorem ipsum dolor sit amet");
    });
  });

  describe("Interactions:", () => {
    test("Selecting a file emits input event", async () => {
      const input = wrapper.find("#DpsUploadFormGroupTest");

      expect(input.exists()).toBe(true);
      await input.setValue("");
      await input.trigger("click");
      expect(wrapper.emitted().input).toBeTruthy();
    });

    test("Click on upload button emits upload event with id", async () => {
      const button = wrapper.find(".dps-button");

      await wrapper.setData({ filesSelected: [File] });

      expect(button.exists()).toBe(true);
      await button.trigger("click");
      expect(wrapper.emitted().upload).toBeTruthy();
      expect(wrapper.emitted().upload[0][0]).toBe("DpsUploadFormGroupTest");
    });

    test("Validate file format", async () => {
      const mockFile = new File(["content"], "testFile.txt", { type: "text/plain" });
      const input = wrapper.find("#DpsUploadFormGroupTest");

      await wrapper.setProps({ fileAccept: [".xml"] });
      Object.defineProperty(input.element, "files", {
        value: [mockFile],
        writable: false,
      });
      await input.trigger("change");

      const error = wrapper.find(".dps-form-group__feedback--error");

      expect(error.exists()).toBe(true);
      expect(error.wrapperElement.innerHTML).toBe(
        "Die gewählte Datei entspricht nicht dem erlaubten Dateiformat",
      );
    });
  });
});
