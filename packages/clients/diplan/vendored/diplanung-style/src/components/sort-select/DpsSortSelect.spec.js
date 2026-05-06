import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsSortSelect from "@/components/sort-select/DpsSortSelect.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsSortSelect", () => {
  const options = [
    {
      label: "Name Mustervorlage A-Z",
      value: "name_asc",
    },
    {
      label: "Name Mustervorlage Z-A",
      value: "name_desc",
    },
  ];
  const defaultOptions = {
    props: {
      id: "DpsSortSelect",
      options: options,
      modelValue: "name_asc",
    },
    attachTo: document.body,
  };

  const wrapper = mount(DpsSortSelect, defaultOptions);

  test("builds", () => {
    expect(wrapper).toBeTruthy();
  });

  test("matches snapshot", () => {
    expect(wrapper.wrapperElement).toMatchSnapshot();
  });

  describe("Template:", () => {
    describe("id='undefined'", () => {
      const wrapper = mount(DpsSortSelect, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          id: undefined,
        },
        global: {
          stubs: {
            Multiselect: true,
          },
        },
      });

      test("Wrapper has a unique id", () => {
        expect(wrapper.attributes("id")).toContain("dps-sort-select-");
      });
    });

    describe("title='Title'", () => {
      const wrapper = mount(DpsSortSelect, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          title: "Title",
        },
        global: {
          stubs: {
            Multiselect: true,
          },
        },
      });

      test("Wrapper has necessary title attribute", () => {
        expect(wrapper.attributes("title")).toBe(wrapper.props().title);
      });
    });

    describe("disabled='true'", () => {
      const wrapper = mount(DpsSortSelect, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          disabled: true,
        },
        global: {
          stubs: {
            Multiselect: true,
          },
        },
      });

      test("Wrapper has necessary disabled attribute", () => {
        expect(wrapper.attributes("disabled")).toBe(wrapper.props().disabled.toString());
      });
    });
  });

  describe("Interactions:", () => {
    describe("modelValue", () => {
      const wrapper = mount(DpsSortSelect, {
        ...defaultOptions,
        global: {
          stubs: {
            Multiselect: true,
          },
        },
      });

      test("Change of modelValue updates selected value", async () => {
        const oldValue = options.find((option) => option.value === wrapper.props().modelValue);

        expect(wrapper.vm.selected).toStrictEqual(oldValue);

        await wrapper.setProps({ modelValue: options[1].value });

        const newValue = options.find((option) => option.value === wrapper.props().modelValue);

        expect(wrapper.vm.selected).toStrictEqual(newValue);
      });
    });
  });
});
