import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DpsFormSelect from "@/components/form-select/DpsFormSelect.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

describe("DpsFormSelect", () => {
  const variants = ["filter", "simple"];
  const sizes = ["sm"];
  const openDirections = ["above", "top", "below", "bottom"];
  const options = [
    {
      value: "opt-1",
      label: "Option 1",
    },
    {
      value: "opt-2",
      label: "Option 2",
    },
    {
      value: "opt-3",
      label: "Option 3",
    },
    {
      value: "opt-4",
      label: "Option 4",
    },
  ];
  const defaultOptions = {
    props: {
      id: "DpsFormSelect",
      options: options,
    },
    attachTo: document.body,
  };

  const wrapper = mount(DpsFormSelect, defaultOptions);

  test("builds", () => {
    expect(wrapper).toBeTruthy();
  });

  test("matches snapshot", () => {
    expect(wrapper.wrapperElement).toMatchSnapshot();
  });

  describe("Template:", () => {
    describe("placeholder='Placeholder'", () => {
      const wrapper = mount(DpsFormSelect, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          placeholder: "Placeholder",
        },
        global: {
          stubs: {
            Multiselect: true,
          },
        },
      });

      test("Wrapper has necessary placeholder attribute", () => {
        expect(wrapper.attributes("placeholder")).toBe(wrapper.props().placeholder);
      });

      test("Placeholder is in template", () => {
        const wrapper = mount(DpsFormSelect, {
          ...defaultOptions,
          props: {
            ...defaultOptions.props,
            placeholder: "Placeholder",
          },
        });
        const label = wrapper.find(".multiselect__placeholder--label");

        expect(label.exists()).toBe(true);

        expect(label.text()).toBe(wrapper.props().placeholder);
      });

      describe("multiple='true'", () => {
        const wrapper = mount(DpsFormSelect, {
          ...defaultOptions,
          props: {
            ...defaultOptions.props,
            placeholder: "Placeholder",
          },
        });

        test("Placeholder is in template", () => {
          const label = wrapper.find(".multiselect__placeholder--label");

          expect(label.exists()).toBe(true);

          expect(label.text()).toBe(wrapper.props().placeholder);
        });
      });

      describe("modelValue='option-1'", () => {
        const wrapper = mount(DpsFormSelect, {
          ...defaultOptions,
          props: {
            ...defaultOptions.props,
            placeholder: "Placeholder",
            modelValue: options[0],
          },
        });

        test("Placeholder is in template", () => {
          const label = wrapper.find(".multiselect__placeholder--label");

          expect(label.exists()).toBe(true);

          expect(label.text()).toBe(options[0].label);
        });
      });
    });

    describe("id='select-test'", () => {
      const wrapper = mount(DpsFormSelect, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          id: "select-test",
        },
      });

      test("Wrapper has necessary aria-controls attribute", () => {
        expect(wrapper.attributes("aria-controls")).toBe("listbox-" + wrapper.props().id);
      });

      test("Wrapper has necessary id attribute", () => {
        const wrapper = mount(DpsFormSelect, {
          ...defaultOptions,
          props: {
            ...defaultOptions.props,
            id: "select-test",
          },
          global: {
            stubs: {
              Multiselect: true,
            },
          },
        });

        expect(wrapper.attributes("id")).toBe(wrapper.props().id);
      });
    });

    describe.each(sizes)("size='%s'", (size) => {
      const wrapper = mount(DpsFormSelect, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          size: size,
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-form-select--size-" + size)).toBe(true);
      });
    });

    describe.each(variants)("variant='%s'", (variant) => {
      const wrapper = mount(DpsFormSelect, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          variant: variant,
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-form-select--" + variant)).toBe(true);
      });

      if (variant === "simple") {
        wrapper.setProps({ icon: "placeholder" });

        test("Icon is in template and has correct CSS class", () => {
          const icon = wrapper.find(".multiselect__tags > .dps-icon");

          expect(icon.exists()).toBe(true);

          expect(icon.classes("dps-icon--" + wrapper.props().icon)).toBe(true);
        });
      }
    });

    describe("align='end'", () => {
      const wrapper = mount(DpsFormSelect, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          align: "end",
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-form-select--align-" + wrapper.props().align)).toBe(true);
      });
    });

    describe("optionLabel='name'", () => {
      const specialOptions = options.map(({ label, ...rest }) => ({ ...rest, name: label }));
      const wrapper = mount(DpsFormSelect, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          options: specialOptions,
          optionLabel: "name",
        },
      });

      test("Options have the correct label", () => {
        const optionLabel = wrapper.findAll(".multiselect__option-label");
        let valid = optionLabel.length > 0;

        for (const key in optionLabel) {
          const el = optionLabel[key];

          if (specialOptions[key].name !== el.text()) {
            valid = false;
          }
        }

        expect(valid).toBe(true);
      });

      test.todo("#tag DpsFilterButton > props.option[optionLabel]");

      test.todo("#selection DpsFilterButton > props.option[optionLabel]");

      test("Computed property multiselectOptions equals specified options", () => {
        expect(wrapper.vm.multiselectOptions).toStrictEqual(specialOptions);
      });

      test("Wrapper has necessary label attribute", () => {
        const wrapper = mount(DpsFormSelect, {
          ...defaultOptions,
          props: {
            ...defaultOptions.props,
            options: specialOptions,
            optionLabel: "name",
          },
          global: {
            stubs: {
              Multiselect: true,
            },
          },
        });

        expect(wrapper.attributes("label")).toBe(wrapper.props().optionLabel);
      });
    });

    describe("optionValue='code'", () => {
      const specialOptions = options.map(({ value, ...rest }) => ({ ...rest, code: value }));
      const wrapper = mount(DpsFormSelect, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          options: specialOptions,
          optionValue: "code",
        },
        global: {
          stubs: {
            Multiselect: true,
          },
        },
      });

      test("Wrapper has necessary track-by attribute", () => {
        expect(wrapper.attributes("track-by")).toBe(wrapper.props().optionValue);
      });

      test("Computed property multiselectOptions equals specified options", () => {
        expect(wrapper.vm.multiselectOptions).toStrictEqual(specialOptions);
      });
    });

    describe("readonly='true'", () => {
      // const wrapper = mount(DpsFormSelect, {
      //   ...defaultOptions,
      //   props: {
      //     ...defaultOptions.props,
      //     readonly: true,
      //   },
      // });

      test.todo("#tag DpsFilterButton readonly");

      test.todo("#selection .multiselect__tags-wrap DpsFilterButton readonly");

      test("Wrapper has necessary disabled attribute", () => {
        const wrapper = mount(DpsFormSelect, {
          ...defaultOptions,
          props: {
            ...defaultOptions.props,
            readonly: true,
          },
          global: {
            stubs: {
              Multiselect: true,
            },
          },
        });

        expect(wrapper.attributes("disabled")).toBe(wrapper.props().readonly.toString());
      });
    });

    describe("required='true'", () => {
      const wrapper = mount(DpsFormSelect, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          required: true,
        },
        global: {
          stubs: {
            Multiselect: true,
          },
        },
      });

      test("Wrapper has necessary allow-empty attribute", () => {
        expect(wrapper.attributes("allow-empty")).toBe((!wrapper.props().required).toString());
      });
    });

    describe("title='Title'", () => {
      const wrapper = mount(DpsFormSelect, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          title: "Title",
        },
      });

      test("Wrapper has necessary title attribute", () => {
        expect(wrapper.attributes("title")).toBe(wrapper.props().title);
      });
    });

    describe("label='Label'", () => {
      // const wrapper = mount(DpsFormSelect, {
      //   ...defaultOptions,
      //   props: {
      //     ...defaultOptions.props,
      //     label: "Label",
      //   },
      // });

      test.todo("wrapper .dps-form-select--labelled");

      test.todo("#selection multiselect__single--label");
    });

    describe("success='true'", () => {
      const wrapper = mount(DpsFormSelect, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          success: true,
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-form-select--success")).toBe(true);
      });
    });

    describe("error='true'", () => {
      const wrapper = mount(DpsFormSelect, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          error: true,
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-form-select--error")).toBe(true);
      });
    });

    describe("clearOnSelect='false'", () => {
      const wrapper = mount(DpsFormSelect, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          clearOnSelect: false,
        },
        global: {
          stubs: {
            Multiselect: true,
          },
        },
      });

      test("Wrapper has necessary clear-on-select attribute", () => {
        expect(wrapper.attributes("clear-on-select")).toBe(
          wrapper.props().clearOnSelect.toString(),
        );
      });
    });

    describe("closeOnSelect='false'", () => {
      const wrapper = mount(DpsFormSelect, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          closeOnSelect: false,
        },
        global: {
          stubs: {
            Multiselect: true,
          },
        },
      });

      test("Wrapper has necessary close-on-select attribute", () => {
        expect(wrapper.attributes("close-on-select")).toBe(
          wrapper.props().closeOnSelect.toString(),
        );
      });
    });

    describe("disabled='true'", () => {
      const wrapper = mount(DpsFormSelect, {
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

      test.todo("tag slot > DpsFilterButton disabled");

      test.todo("selection slot > DpsFilterButton disabled");
    });

    describe("max='3'", () => {
      test("Wrapper has necessary max attribute", () => {
        const wrapper = mount(DpsFormSelect, {
          ...defaultOptions,
          props: {
            ...defaultOptions.props,
            max: 3,
          },
          global: {
            stubs: {
              Multiselect: true,
            },
          },
        });

        expect(wrapper.attributes("max")).toBe(wrapper.props().max.toString());
      });

      test.todo("maxElements slot");
    });

    describe("multiple='true'", () => {
      const wrapper = mount(DpsFormSelect, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          multiple: true,
        },
      });

      test("Wrapper has necessary modifier CSS class", () => {
        expect(wrapper.classes("dps-form-select--multiple")).toBe(true);
      });

      test("Checkbox is in template", () => {
        const checkbox = wrapper.find(".multiselect__option-checkbox");

        expect(checkbox.exists()).toBe(true);

        expect(checkbox.find(".dps-icon--check").exists()).toBe(true);
      });

      test.todo("selection slot content");

      test("Wrapper has necessary multiple attribute", () => {
        const wrapper = mount(DpsFormSelect, {
          ...defaultOptions,
          props: {
            ...defaultOptions.props,
            multiple: true,
          },
          global: {
            stubs: {
              Multiselect: true,
            },
          },
        });

        expect(wrapper.attributes("multiple")).toBe(wrapper.props().multiple.toString());
      });

      describe("hideTags='true'", () => {
        describe("label='Label'", () => {
          const wrapper = mount(DpsFormSelect, {
            ...defaultOptions,
            props: {
              ...defaultOptions.props,
              multiple: true,
              hideTags: true,
              label: "Label",
            },
          });
          const label = wrapper.find(".multiselect__single--label");

          test("Label is in template", () => {
            expect(label.exists()).toBe(true);

            expect(label.text()).toBe(wrapper.props().label);
          });
        });

        describe("placeholder='Placeholder'", () => {
          const wrapper = mount(DpsFormSelect, {
            ...defaultOptions,
            props: {
              ...defaultOptions.props,
              multiple: true,
              hideTags: true,
              placeholder: "Placeholder",
            },
          });
          const label = wrapper.find(".multiselect__placeholder--label");

          test("Label is in template", () => {
            expect(label.exists()).toBe(true);

            expect(label.text()).toBe(wrapper.props().placeholder);
          });
        });
      });
    });

    describe.each(openDirections)("openDirection='%s'", (openDirection) => {
      const wrapper = mount(DpsFormSelect, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          openDirection: openDirection,
        },
        global: {
          stubs: {
            Multiselect: true,
          },
        },
      });

      test("Wrapper has necessary opendirection attribute", () => {
        expect(wrapper.attributes("opendirection")).toBe(openDirection);
      });
    });

    describe("preselectFirst='true'", () => {
      const wrapper = mount(DpsFormSelect, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          preselectFirst: true,
        },
        global: {
          stubs: {
            Multiselect: true,
          },
        },
      });

      test("Wrapper has necessary preselect-first attribute", () => {
        expect(wrapper.attributes("preselect-first")).toBe(
          wrapper.props().preselectFirst.toString(),
        );
      });
    });

    describe("preserveSearch='true'", () => {
      const wrapper = mount(DpsFormSelect, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          preserveSearch: true,
        },
        global: {
          stubs: {
            Multiselect: true,
          },
        },
      });

      test("Wrapper has necessary preserve-search attribute", () => {
        expect(wrapper.attributes("preserve-search")).toBe(
          wrapper.props().preserveSearch.toString(),
        );
      });
    });

    describe("searchable='true'", () => {
      const wrapper = mount(DpsFormSelect, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          searchable: true,
        },
        global: {
          stubs: {
            Multiselect: true,
          },
        },
      });

      test("Wrapper has necessary searchable attribute", () => {
        expect(wrapper.attributes("searchable")).toBe(wrapper.props().searchable.toString());
      });
    });

    describe("Option Icon", () => {
      test.todo("DpsFormSelect");
    });
  });

  describe("Interactions:", () => {
    describe("select", () => {
      test.todo("DpsFormSelect");
    });

    describe("remove", () => {
      test.todo("DpsFormSelect");
    });

    describe("search-change", () => {
      test.todo("DpsFormSelect");
    });

    describe("tag", () => {
      test.todo("DpsFormSelect");
    });

    describe("open", () => {
      test.todo("DpsFormSelect");
    });

    describe("close", () => {
      test.todo("DpsFormSelect");
    });

    describe("update", () => {
      test.todo("DpsFormSelect");
    });
  });
});
