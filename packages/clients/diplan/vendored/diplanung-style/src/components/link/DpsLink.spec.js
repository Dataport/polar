import { afterEach, describe, test, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import DpsLink from "@/components/link/DpsLink.vue";

/*
1. ARRANGE
2. ACT
3. ASSERT
*/

const mockRouter = {
  push: vi.fn(),
};

afterEach(() => {
  mockRouter.push.mockClear();
});

describe("DpsLink", () => {
  // const formats = ["telephone", "email"];
  const defaultOptions = {
    props: {
      href: "test.html",
    },
    global: {
      mocks: {
        $router: mockRouter,
      },
    },
  };

  const wrapper = mount(DpsLink, defaultOptions);

  test("builds", () => {
    expect(wrapper).toBeTruthy();
  });

  test("matches snapshot", () => {
    expect(wrapper.wrapperElement).toMatchSnapshot();
  });

  describe("Template:", () => {
    describe("href='foo.html'", () => {
      const wrapper = mount(DpsLink, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          href: "foo.html",
        },
      });

      test("Wrapper has correct href attribute", () => {
        expect(wrapper.attributes("href")).toBe(wrapper.props().href);
      });
    });

    describe("icon='placeholder'", () => {
      const wrapper = mount(DpsLink, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          icon: "placeholder",
        },
      });

      test("Wrapper has correct icon", () => {
        const icon = wrapper.find(".dps-icon");

        expect(icon.exists()).toBe(true);

        expect(icon.classes("dps-icon--" + wrapper.props().icon)).toBe(true);
      });
    });

    describe("rel='noopener noreferrer'", () => {
      const wrapper = mount(DpsLink, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          rel: "noopener noreferrer",
        },
      });

      test("Wrapper has correct rel attribute", () => {
        expect(wrapper.attributes("rel")).toBe(wrapper.props().rel);
      });
    });

    describe("target='_blank'", () => {
      const wrapper = mount(DpsLink, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          target: "_blank",
        },
      });

      test("Wrapper has correct target attribute", () => {
        expect(wrapper.attributes("target")).toBe(wrapper.props().target);
      });
    });

    describe("external='true'", () => {
      const wrapper = mount(DpsLink, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          external: true,
        },
      });

      test("Wrapper has correct rel attribute", () => {
        expect(wrapper.attributes("rel")).toBe("noopener noreferrer");
      });

      test("Wrapper has correct target attribute", () => {
        expect(wrapper.attributes("target")).toBe("_blank");
      });

      test("Wrapper has correct icon", () => {
        const icon = wrapper.find(".dps-icon");

        expect(icon.exists()).toBe(true);

        expect(icon.classes("dps-icon--external-link")).toBe(true);
      });
    });

    describe("format='telephone'", () => {
      const wrapper = mount(DpsLink, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          format: "telephone",
          href: "(+49) 160 / 123-456-789",
        },
      });

      test("Wrapper has correct href attribute", () => {
        expect(wrapper.attributes("href")).toBe("tel:+49160123456789");
      });
    });

    describe("format='email'", () => {
      const wrapper = mount(DpsLink, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          format: "email",
          href: "foo@bar.com",
        },
      });

      test("Wrapper has correct href attribute", () => {
        expect(wrapper.attributes("href")).toBe("mailto:" + wrapper.props().href);
      });
    });

    describe("darker='true'", () => {
      const wrapper = mount(DpsLink, {
        ...defaultOptions,
        props: {
          ...defaultOptions.props,
          darker: true,
        },
      });

      test("Wrapper has correct class", () => {
        expect(wrapper.classes("dps-link--darker")).toBe(true);
      });
    });
  });

  describe("Interactions:", () => {
    describe("click", () => {
      const wrapper = mount(DpsLink, defaultOptions);

      test("Click on the element emits the click event", async () => {
        await wrapper.trigger("click");

        expect(wrapper.emitted().click).toBeTruthy();
      });

      // TODO Mocking doesn't work as expected, probably a problem within the component
      /*
      describe("external='true'", () => {
        const wrapper = mount(DpsLink, {
          ...defaultOptions,
          props: {
            ...defaultOptions.props,
            external: true,
          },
        });

        test("Click on the element doesn't emit the click event", async () => {
          await wrapper.trigger("click");

          expect(mockRouter.push).toHaveBeenCalledWith(wrapper.props().href);
        });
      });

      describe.each(formats)("format='%s'", (format) => {
        const wrapper = mount(DpsLink, {
          ...defaultOptions,
          props: {
            ...defaultOptions.props,
            format: format,
            href: format === "telephone" ? "(+49) 160 / 123-456-789" : "foo@bar.com",
          },
        });

        test("Click on the element pushes a new route to the $router", async () => {
          await wrapper.trigger("click");

          if (format === "telephone") {
            expect(mockRouter.push).toHaveBeenCalledWith("tel:+49160123456789");
          } else {
            expect(mockRouter.push).toHaveBeenCalledWith("mailto:" + wrapper.props().href);
          }
        });
      });
      */
    });
  });
});
