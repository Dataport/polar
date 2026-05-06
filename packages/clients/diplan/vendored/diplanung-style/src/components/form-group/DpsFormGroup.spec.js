import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsFormGroup from "@/components/form-group/DpsFormGroup.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsFormGroup", () => {
  const wrapper = mount(DpsFormGroup, {
    props: {
      id: "form-group-1",
    },
  });

  test("builds", () => {
    expect(wrapper).toBeTruthy();
  });

  test("matches snapshot", () => {
    expect(wrapper.wrapperElement).toMatchSnapshot();
  });

  describe("Template:", () => {
    describe("id='form-group-test'", () => {
      const wrapper = mount(DpsFormGroup, {
        props: {
          id: "form-group-test",
        },
      });

      test("Wrapper has correct id", () => {
        expect(wrapper.attributes("id")).toBe(wrapper.props().id);
      });
    });

    describe("label='Label'", () => {
      const wrapper = mount(DpsFormGroup, {
        props: {
          id: "form-group-1",
          label: "Label",
        },
      });

      test("Label is in template", () => {
        const label = wrapper.find(".dps-form-group__label");

        expect(label.exists()).toBe(true);

        expect(label.text()).toBe(wrapper.props().label);
      });

      test("Label has correct id", () => {
        const label = wrapper.find(".dps-form-group__label");

        expect(label.attributes("id")).toBe(wrapper.props().id + "__label");
      });
    });

    describe("labelFor='form-test'", () => {
      const wrapper = mount(DpsFormGroup, {
        props: {
          id: "form-group-1",
          label: "Label",
          labelFor: "form-test",
        },
      });

      test("Label has correct for attribute", () => {
        const label = wrapper.find(".dps-form-group__label");

        expect(label.exists()).toBe(true);

        expect(label.text()).toBe(wrapper.props().label);

        expect(label.attributes("for")).toBe(wrapper.props().labelFor);
      });
    });

    describe("successFeedback='This is the success feedback!'", () => {
      const wrapper = mount(DpsFormGroup, {
        props: {
          id: "form-group-1",
          successFeedback: "This is the success feedback!",
          valid: true,
        },
      });
      const feedback = wrapper.find(".dps-form-group__feedback--success");

      test("Success feedback is in template", () => {
        expect(feedback.exists()).toBe(true);
      });

      test("Success feedback has correct id attribute", () => {
        expect(feedback.attributes("id")).toBe(wrapper.props().id + "__success-feedback");
      });

      test("Success feedback shows correct text", () => {
        expect(feedback.text()).toBe(wrapper.props().successFeedback);
      });
    });

    describe("errorFeedback='This is the error feedback!'", () => {
      const wrapper = mount(DpsFormGroup, {
        props: {
          id: "form-group-1",
          errorFeedback: "This is the error feedback!",
          valid: false,
        },
      });

      const feedback = wrapper.find(".dps-form-group__feedback--error");

      test("Error feedback is in template", () => {
        expect(feedback.exists()).toBe(true);
      });

      test("Error feedback has correct id attribute", () => {
        expect(feedback.attributes("id")).toBe(wrapper.props().id + "__error-feedback");
      });

      test("Error feedback shows correct text", () => {
        expect(feedback.text()).toBe(wrapper.props().errorFeedback);
      });
    });

    describe("description='Description'", () => {
      const wrapper = mount(DpsFormGroup, {
        props: {
          id: "form-group-1",
          description: "Description",
        },
      });
      const description = wrapper.find(".dps-form-group__description");

      test("Description is in template", () => {
        expect(description.exists()).toBe(true);
      });

      test("Description has correct id attribute", () => {
        expect(description.attributes("id")).toBe(wrapper.props().id + "__description");
      });

      test("Description shows correct text", () => {
        expect(description.text()).toBe(wrapper.props().description);
      });
    });

    describe("hideLabel='true'", () => {
      const wrapper = mount(DpsFormGroup, {
        props: {
          id: "form-group-1",
          hideLabel: true,
          label: "Label",
        },
      });

      test("Label hat necessary visually-hidden CSS class", () => {
        const label = wrapper.find(".dps-form-group__label");

        expect(label.exists()).toBe(true);

        expect(label.classes("visually-hidden")).toBe(true);
      });
    });

    describe("valid='true'", () => {
      const wrapper = mount(DpsFormGroup, {
        props: {
          id: "form-group-1",
          valid: true,
        },
      });

      test("Internal value of hasError is false", () => {
        expect(wrapper.vm.hasError).toBe(false);
      });

      test("Internal value of hasSuccess is true", () => {
        expect(wrapper.vm.hasSuccess).toBe(true);
      });
    });

    describe("valid='false'", () => {
      const wrapper = mount(DpsFormGroup, {
        props: {
          id: "form-group-1",
          valid: false,
        },
      });

      test("Wrapper has necessary ARIA attribute", () => {
        expect(wrapper.attributes("aria-invalid")).toBe("true");
      });

      test("Internal value of hasError is true", () => {
        expect(wrapper.vm.hasError).toBe(true);
      });

      test("Internal value of hasSuccess is false", () => {
        expect(wrapper.vm.hasSuccess).toBe(false);
      });
    });

    describe("disabled='true'", () => {
      const wrapper = mount(DpsFormGroup, {
        props: {
          disabled: true,
        },
      });

      test("Wrapper has necessary CSS modifier class", () => {
        expect(wrapper.classes("dps-form-group--disabled")).toBe(true);
      });
    });

    // TODO test slot props
  });
});
