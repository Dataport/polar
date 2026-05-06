import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsFormInput from "@/components/form-input/DpsFormInput.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsFormInput", () => {
  const types = ["text", "url", "email", "number", "search"];
  const sizes = ["sm"];

  const wrapper = mount(DpsFormInput, {
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
    describe("placeholder='Placeholder'", () => {
      const wrapper = mount(DpsFormInput, {
        props: {
          placeholder: "Placeholder",
        },
      });

      test("Input has correct placeholder attribute", () => {
        const input = wrapper.find(".dps-input");

        expect(input.exists()).toBe(true);

        expect(input.attributes("placeholder")).toBe(wrapper.props().placeholder);
      });
    });

    describe("id='dps-form-input-test'", () => {
      const wrapper = mount(DpsFormInput, {
        props: {
          id: "dps-form-input-test",
        },
      });

      test("Input has correct id attribute", () => {
        const input = wrapper.find(".dps-input");

        expect(input.exists()).toBe(true);

        expect(input.attributes("id")).toBe(wrapper.props().id);
      });
    });

    describe("icon='placeholder'", () => {
      const wrapper = mount(DpsFormInput, {
        props: {
          icon: "placeholder",
        },
      });

      test("Icon is in template", () => {
        const icon = wrapper.find(".dps-icon");

        expect(icon.exists()).toBe(true);
      });

      test("Icon has correct CSS class", () => {
        const icon = wrapper.find(".dps-icon");

        expect(icon.classes("dps-icon--" + wrapper.props().icon)).toBe(true);
      });
    });

    describe("title='Title'", () => {
      const wrapper = mount(DpsFormInput, {
        props: {
          title: "Title",
        },
      });

      test("Input has correct title attribute", () => {
        const input = wrapper.find(".dps-input");

        expect(input.exists()).toBe(true);

        expect(input.attributes("title")).toBe(wrapper.props().title);
      });
    });

    describe("readonly='true'", () => {
      const wrapper = mount(DpsFormInput, {
        props: {
          readonly: true,
        },
      });

      test("Input has correct readonly attribute", () => {
        const input = wrapper.find(".dps-input");

        expect(input.exists()).toBe(true);

        expect(input.attributes("readonly")).toBeDefined();
      });
    });

    describe("disabled='true'", () => {
      const wrapper = mount(DpsFormInput, {
        props: {
          disabled: true,
        },
      });

      test("Input has correct disabled attribute", () => {
        const input = wrapper.find(".dps-input");

        expect(input.exists()).toBe(true);

        expect(input.attributes("disabled")).toBeDefined();
      });
    });

    describe("maxlength='100'", () => {
      const wrapper = mount(DpsFormInput, {
        props: {
          maxlength: 100,
        },
      });

      test("Input has correct maxlength attribute", () => {
        const input = wrapper.find(".dps-input");

        expect(input.exists()).toBe(true);

        expect(input.attributes("maxlength")).toBe(wrapper.props().maxlength.toString());
      });
    });

    describe.each(types)("type='%s'", (type) => {
      const wrapper = mount(DpsFormInput, {
        props: {
          type: type,
        },
      });

      test("Input has correct type attribute", () => {
        const input = wrapper.find(".dps-input");

        expect(input.exists()).toBe(true);

        expect(input.attributes("type")).toBe(type);
      });
    });

    describe("step='2'", () => {
      const wrapper = mount(DpsFormInput, {
        props: {
          type: "number",
          step: 2,
        },
      });

      test("Input has correct step attribute", () => {
        const input = wrapper.find(".dps-input");

        expect(input.exists()).toBe(true);

        expect(input.attributes("step")).toBe(wrapper.props().step.toString());
      });
    });

    describe("min='5'", () => {
      const wrapper = mount(DpsFormInput, {
        props: {
          type: "number",
          min: 5,
        },
      });

      test("Input has correct min attribute", () => {
        const input = wrapper.find(".dps-input");

        expect(input.exists()).toBe(true);

        expect(input.attributes("min")).toBe(wrapper.props().min.toString());
      });
    });

    describe("max='10'", () => {
      const wrapper = mount(DpsFormInput, {
        props: {
          type: "number",
          max: 10,
        },
      });

      test("Input has correct max attribute", () => {
        const input = wrapper.find(".dps-input");

        expect(input.exists()).toBe(true);

        expect(input.attributes("max")).toBe(wrapper.props().max.toString());
      });
    });

    describe("pattern='[A-Za-z]{3}'", () => {
      const wrapper = mount(DpsFormInput, {
        props: {
          pattern: "[A-Za-z]{3}",
        },
      });

      test("Input has correct pattern attribute", () => {
        const input = wrapper.find(".dps-input");

        expect(input.exists()).toBe(true);

        expect(input.attributes("pattern")).toBe(wrapper.props().pattern);
      });
    });

    describe("required='true'", () => {
      const wrapper = mount(DpsFormInput, {
        props: {
          required: true,
        },
      });

      test("Input has correct required attribute", () => {
        const input = wrapper.find(".dps-input");

        expect(input.exists()).toBe(true);

        expect(input.attributes("required")).toBeDefined();
      });
    });

    describe("ariaLabel='Aria label'", () => {
      const wrapper = mount(DpsFormInput, {
        props: {
          ariaLabel: "Aria label",
        },
      });

      test("Input has correct aria-label attribute", () => {
        const input = wrapper.find(".dps-input");

        expect(input.attributes("aria-label")).toBe(wrapper.props().ariaLabel);
      });
    });

    describe("ariaLabelledBy='input-label'", () => {
      const wrapper = mount(DpsFormInput, {
        props: {
          ariaLabelledBy: "input-label",
        },
      });

      test("Input has correct aria-labelledby attribute", () => {
        const input = wrapper.find(".dps-input");

        expect(input.attributes("aria-labelledby")).toBe(wrapper.props().ariaLabelledby);
      });
    });

    describe("ariaDescribedBy='input-description'", () => {
      const wrapper = mount(DpsFormInput, {
        props: {
          ariaDescribedBy: "input-description",
        },
      });

      test("Input has correct aria-describedby attribute", () => {
        const input = wrapper.find(".dps-input");

        expect(input.attributes("aria-describedby")).toBe(wrapper.props().ariaDescribedBy);
      });
    });

    describe.each(sizes)("size='%s'", (size) => {
      const wrapper = mount(DpsFormInput, {
        props: {
          size: size,
        },
      });

      test("Input has necessary modifier CSS class", () => {
        const input = wrapper.find(".dps-input");

        expect(input.exists()).toBe(true);

        expect(input.classes("dps-input--size-" + size)).toBe(true);
      });
    });

    describe("success='true'", () => {
      const wrapper = mount(DpsFormInput, {
        props: {
          success: true,
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-form-input--success")).toBe(true);
      });

      test("Input has necessary modifier CSS class", () => {
        const input = wrapper.find(".dps-input");

        expect(input.exists()).toBe(true);

        expect(input.classes("dps-input--success")).toBe(true);
      });

      test("Status icon is in template", () => {
        const icon = wrapper.find(".dps-icon");

        expect(icon.exists()).toBe(true);

        expect(icon.classes("dps-icon--check")).toBe(true);
      });
    });

    describe("error='true'", () => {
      const wrapper = mount(DpsFormInput, {
        props: {
          error: true,
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-form-input--error")).toBe(true);
      });

      test("Input has necessary modifier CSS class", () => {
        const input = wrapper.find(".dps-input");

        expect(input.exists()).toBe(true);

        expect(input.classes("dps-input--error")).toBe(true);
      });

      test("Status icon is in template", () => {
        const icon = wrapper.find(".dps-icon");

        expect(icon.exists()).toBe(true);

        expect(icon.classes("dps-icon--warning")).toBe(true);
      });
    });
  });

  describe("Interactions:", () => {
    describe("keyup", () => {
      const wrapper = mount(DpsFormInput);

      test("Emits the correct keyup event", async () => {
        const input = wrapper.find(".dps-input");

        await input.trigger("keyup");

        expect(wrapper.emitted()["keyup"]).toBeDefined();
      });
    });

    describe("keydown", () => {
      const wrapper = mount(DpsFormInput);

      test("Emits the correct keydown event", async () => {
        const input = wrapper.find(".dps-input");

        await input.trigger("keydown", { key: "a" });

        expect(wrapper.emitted()["keydown"]).toBeDefined();
      });
    });

    describe("blur", () => {
      const wrapper = mount(DpsFormInput);

      test("Emits the correct blur event", async () => {
        const input = wrapper.find(".dps-input");

        await input.trigger("blur");

        expect(wrapper.emitted()["blur"]).toBeDefined();
      });
    });

    describe("focus", () => {
      test("Emits the correct focus event", async () => {
        const wrapper = mount(DpsFormInput);
        const input = wrapper.find(".dps-input");

        await input.trigger("focus");

        expect(wrapper.emitted()["focus"]).toBeDefined();
      });

      test.todo("event is emitted - via method", () => {
        // ...
      });
    });

    describe("update:modelValue", () => {
      const wrapper = mount(DpsFormInput);

      test("Emits the correct update:modelValue event", async () => {
        const input = wrapper.find(".dps-input");

        await input.setValue("test");

        expect(wrapper.emitted()["update:modelValue"]).toEqual([["test"]]);
      });
    });
  });
});
