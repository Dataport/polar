import * as Mr from "bootstrap";
import { defineComponent as ue, createBlock as W, openBlock as q, resolveDynamicComponent as Be, normalizeClass as R, withCtx as z, createElementVNode as $, resolveComponent as ae, createElementBlock as I, renderSlot as B, Fragment as oe, createCommentVNode as j, toDisplayString as G, renderList as Ae, createTextVNode as te, withDirectives as $e, vShow as Me, withModifiers as re, withKeys as ve, createVNode as ee, Transition as ou, createSlots as Qt, normalizeProps as je, guardReactiveProps as Ue, mergeProps as Br, nextTick as Rr } from "vue";
import vr from "vue-datepicker-next";
import de from "moment";
let Vr = 0;
function be(e = "", r = "") {
  const i = Math.random().toString(16).substring(2);
  return `${e}${i}${Vr++}${r}`;
}
const Fr = ue({
  name: "DpsIconButton",
  props: {
    /**
     * Icon to be displayed in the button.
     */
    icon: {
      type: String,
      required: !0
    },
    /**
     * Applies the 'danger' styles to the button.
     * @default false
     */
    danger: {
      type: Boolean,
      default: !1,
      required: !1
    },
    /**
     * Disables the button.
     * @default false
     */
    disabled: {
      type: Boolean,
      default: !1,
      required: !1
    },
    /**
     * Show a loading spinner.
     * @default undefined
     */
    loading: {
      type: Boolean,
      default: void 0,
      required: !1
    },
    /**
     * The HTML button type attribute. If undefined
     * the type defaults to 'button'.
     * @default undefined
     */
    type: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * The URL that the hyperlink points to.
     * If href is set an anchor
     * element is rendered instead of a button.
     * @default undefined
     */
    href: {
      type: String,
      required: !1,
      default: void 0
    }
  },
  emits: [
    /**
     * Emitted when the button gets clicked.
     */
    "click"
  ],
  computed: {
    typeAttribute() {
      if (!this.href)
        return this.type ? this.type : "button";
    }
  },
  methods: {
    handleClick(e) {
      this.disabled || this.loading ? e.preventDefault() : this.$emit("click", e);
    }
  }
}), K = (e, r) => {
  const i = e.__vccOpts || e;
  for (const [s, o] of r)
    i[s] = o;
  return i;
}, jr = ["role"];
function Ur(e, r, i, s, o, f) {
  return q(), W(Be(e.href ? "a" : "button"), {
    class: R(["dps-icon-button", {
      "dps-icon-button--danger": e.danger,
      "dps-icon-button--disabled": e.disabled,
      "dps-icon-button--loading": e.loading
    }]),
    type: e.typeAttribute,
    href: e.href,
    disabled: e.disabled || e.loading,
    onClick: e.handleClick
  }, {
    default: z(() => [
      $("span", {
        class: R(["dps-icon", {
          "dps-icon--ladeanimation": e.loading,
          ["dps-icon--" + e.icon]: !e.loading
        }]),
        role: e.loading ? "status" : void 0,
        "aria-hidden": "true"
      }, null, 10, jr)
    ]),
    _: 1
  }, 8, ["class", "type", "href", "disabled", "onClick"]);
}
const wr = /* @__PURE__ */ K(Fr, [["render", Ur]]), Hr = ue({
  name: "DpsActionMenu",
  components: { DpsIconButton: wr },
  props: {
    /**
     * The unique identifier for the menu.
     * @default undefined
     */
    id: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * The HTML tag to be used for the menu container.
     * @default "ul"
     */
    tag: {
      type: String,
      default: "ul",
      required: !1
    },
    /**
     * The icon to be used for the trigger button.
     * @default "more-horiz"
     */
    icon: {
      type: String,
      default: "more-horiz",
      required: !1
    },
    /**
     * The label for the trigger button.
     * @default ""
     */
    label: {
      type: String,
      default: "",
      required: !1
    },
    /**
     * The title attribute for the trigger button.
     * @default "Aktions-Menu öffnen"
     */
    title: {
      type: String,
      default: "Aktions-Menu öffnen",
      required: !1
    },
    /**
     * Whether to show a close button in the menu.
     * @default false
     */
    showCloseButton: {
      type: Boolean,
      default: !1,
      required: !1
    },
    /**
     * Whether to show a chevron icon in the trigger button.
     * @default false
     */
    showTriggerChevron: {
      type: Boolean,
      default: !1,
      required: !1
    },
    /**
     * The headline text for the menu.
     * @default undefined
     */
    headline: {
      type: String,
      default: void 0,
      required: !1
    },
    /**
     * Whether the menu should automatically close after an action is selected.
     * @default true
     */
    autoClose: {
      type: Boolean,
      default: !0,
      required: !1
    },
    /**
     * Whether the menu is disabled.
     * @default false
     */
    disabled: {
      type: Boolean,
      default: !1,
      required: !1
    }
  },
  emits: [
    /**
     * Emitted when the menu is hidden.
     * @event module:DpsActionMenu#hide
     */
    "hide",
    /**
     * Emitted when the menu is shown.
     * @event module:DpsActionMenu#show
     */
    "show"
  ],
  computed: {
    uniqueId() {
      return this.id ? this.id : be("dps-action-menu-");
    },
    dropdownElement() {
      return document.getElementById(this.uniqueId);
    },
    dropdownBootstrapElement() {
      if (this.dropdownElement)
        return new window.Bootstrap.Dropdown(this.dropdownElement);
    },
    isHeaderVisible() {
      return this.showCloseButton || this.headline;
    }
  },
  mounted() {
    this.dropdownElement && (this.dropdownElement.addEventListener("hide.bs.dropdown", (e) => {
      this.$emit("hide", e);
    }), this.dropdownElement.addEventListener("show.bs.dropdown", (e) => {
      this.$emit("show", e);
    }));
  }
}), zr = { class: "dps-action-menu" }, Gr = ["id", "title", "disabled", "data-bs-auto-close"], Yr = { class: "dps-action-menu__trigger-button-label" }, Wr = {
  key: 0,
  class: "dps-icon dps-icon--chevron-down"
}, Kr = ["aria-labelledby"], Jr = {
  key: 0,
  class: "dps-action-menu__dropdown-header"
}, Xr = {
  key: 0,
  class: "dps-action-menu__dropdown-headline"
};
function Qr(e, r, i, s, o, f) {
  const n = ae("DpsIconButton");
  return q(), I("div", zr, [
    B(e.$slots, "trigger", {}, () => [
      $("button", {
        id: e.uniqueId,
        type: "button",
        class: R(["dps-action-menu__trigger-button", {
          "dps-action-menu__trigger-button--icon": !e.label,
          "dps-action-menu__trigger-button--text": e.label,
          "dps-action-menu__trigger-button--disabled": e.disabled
        }]),
        title: e.title,
        disabled: e.disabled,
        "aria-label": "Toggle dropdown",
        "data-bs-toggle": "dropdown",
        "aria-expanded": "false",
        "data-bs-offset": "0,10",
        "data-bs-auto-close": e.autoClose ? "true" : "outside"
      }, [
        e.label ? (q(), I(oe, { key: 0 }, [
          $("span", Yr, G(e.label), 1),
          e.showTriggerChevron ? (q(), I("span", Wr)) : j("", !0)
        ], 64)) : (q(), I("span", {
          key: 1,
          class: R(["dps-icon", "dps-icon--" + e.icon])
        }, null, 2))
      ], 10, Gr)
    ]),
    $("div", {
      class: R(["dps-action-menu__dropdown dropdown-menu", { "dps-action-menu__dropdown--with-header": e.isHeaderVisible }]),
      "aria-labelledby": e.uniqueId
    }, [
      e.isHeaderVisible ? (q(), I("header", Jr, [
        e.headline ? (q(), I("div", Xr, G(e.headline), 1)) : j("", !0),
        e.showCloseButton ? (q(), W(n, {
          key: 1,
          class: "dps-action-menu__dropdown-close-button",
          title: "Schließen",
          "aria-label": "Schließen",
          icon: "close",
          onClick: r[0] || (r[0] = (c) => {
            var p;
            return (p = e.dropdownBootstrapElement) == null ? void 0 : p.hide();
          })
        })) : j("", !0)
      ])) : j("", !0),
      (q(), W(Be(e.tag), { class: "dps-action-menu__dropdown-list" }, {
        default: z(() => [
          B(e.$slots, "default")
        ]),
        _: 3
      }))
    ], 10, Kr)
  ]);
}
const Ua = /* @__PURE__ */ K(Hr, [["render", Qr]]), Zr = ue({
  name: "DpsActionMenuItem",
  props: {
    /**
     * The icon displayed before the menu item
     * @default undefined
     */
    icon: {
      type: String,
      default: void 0,
      required: !1
    },
    /**
     * The title attribute of the menu item
     * @default undefined
     */
    title: {
      type: String,
      default: void 0,
      required: !1
    },
    /**
     * Disables the menu item.
     * @default false
     */
    disabled: {
      type: Boolean,
      default: !1,
      required: !1
    },
    /**
     * The link target attribute.(e.g.: _blank)
     * @default undefined
     */
    target: {
      type: String,
      default: void 0,
      required: !1
    },
    /**
     * The URL that the hyperlink points to.
     * @default undefined
     */
    href: {
      type: String,
      default: void 0,
      required: !1
    },
    /**
     * The relationship of the linked URL as space-separated link types.
     * @default undefined
     */
    rel: {
      type: String,
      default: void 0,
      required: !1
    },
    /**
     * Applies the 'danger' styles (red on hover).
     * @default false
     */
    danger: {
      type: Boolean,
      default: !1,
      required: !1
    },
    /**
     * HTML tag of the wrapper element.
     * @default 'li'
     */
    tag: {
      type: String,
      default: "li"
    }
  },
  emits: [
    /**
     * Emitted when the element is clicked.
     * @event module:DPSActionMenuItem#click
     */
    "click"
  ],
  methods: {
    handleClick(e) {
      this.disabled || this.$emit("click", e);
    }
  }
}), ei = { class: "dps-action-menu-item__text" };
function ti(e, r, i, s, o, f) {
  return q(), W(Be(e.tag), { class: "dps-action-menu-item" }, {
    default: z(() => [
      (q(), W(Be(e.href ? "a" : "button"), {
        type: e.href ? void 0 : "button",
        href: e.href,
        rel: e.rel,
        target: e.target,
        title: e.title,
        class: R(["dps-action-menu-item__element", {
          "dps-action-menu-item__element--danger": e.danger,
          "dps-action-menu-item__element--disabled": e.disabled
        }]),
        disabled: e.disabled,
        onClick: e.handleClick
      }, {
        default: z(() => [
          e.icon ? (q(), I("span", {
            key: 0,
            class: R(["dps-action-menu-item__icon dps-icon", "dps-icon--" + e.icon])
          }, null, 2)) : j("", !0),
          $("span", ei, [
            B(e.$slots, "default")
          ])
        ]),
        _: 3
      }, 8, ["type", "href", "rel", "target", "title", "class", "disabled", "onClick"]))
    ]),
    _: 3
  });
}
const Ha = /* @__PURE__ */ K(Zr, [["render", ti]]), ui = ue({
  name: "DpsAlphabeticFilter",
  props: {
    /**
     * Array of available filter options.
     * @default ["A-G", "H-N", "O-U", "V-Z"]
     */
    options: {
      type: Array,
      default: () => ["A-G", "H-N", "O-U", "V-Z"],
      required: !1
    },
    /**
     * The modelValue
     * @default undefined
     */
    modelValue: {
      type: String,
      default: void 0,
      required: !1
    },
    /**
     * Requires some option to be active.
     * @default false
     */
    required: {
      type: Boolean,
      default: !1,
      required: !1
    },
    /**
     * Disables the component.
     * @default false
     */
    disabled: {
      type: Boolean,
      default: !1,
      required: !1
    }
  },
  emits: [
    /**
     * Emitted when the selected value changes.
     * @event module:DpsAlphabeticFilter#update:modelValue
     */
    "update:modelValue"
  ],
  methods: {
    selectOption(e) {
      let r = e;
      this.disabled || (this.required ? r !== this.modelValue && this.$emit("update:modelValue", r) : (r = r === this.modelValue ? void 0 : e, this.$emit("update:modelValue", r)));
    }
  }
}), ri = ["aria-selected", "disabled", "onClick"];
function ii(e, r, i, s, o, f) {
  return q(), I("ul", {
    role: "tablist",
    class: R(["dps-alphabetic-filter", { "dps-alphabetic-filter--disabled": e.disabled }])
  }, [
    (q(!0), I(oe, null, Ae(e.options, (n, c) => (q(), I("li", {
      key: "alphabetic-filter-" + c,
      class: "dps-alphabetic-filter__list-item",
      role: "presentation"
    }, [
      $("button", {
        class: R(["dps-alphabetic-filter__option-button", {
          "dps-alphabetic-filter__option-button--active": e.modelValue === n
        }]),
        type: "button",
        role: "tab",
        "aria-controls": "filter",
        "aria-selected": e.modelValue === n,
        disabled: e.disabled,
        onClick: (p) => e.selectOption(n)
      }, G(n), 11, ri)
    ]))), 128))
  ], 2);
}
const za = /* @__PURE__ */ K(ui, [["render", ii]]), ni = ue({
  name: "DpsBadge",
  props: {
    /**
     * Determines the styling of the badge.
     * @default undefined
     */
    variant: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Rounds the badge.
     * @default false
     */
    rounded: {
      type: Boolean,
      default: !1
    }
  }
});
function si(e, r, i, s, o, f) {
  return q(), I("span", {
    class: R(["dps-badge", {
      ["dps-badge--" + e.variant]: e.variant,
      "dps-badge--rounded": e.rounded
    }])
  }, [
    B(e.$slots, "default")
  ], 2);
}
const ai = /* @__PURE__ */ K(ni, [["render", si]]), li = ue({
  name: "DpsButton",
  props: {
    /**
     * The HTML button type (ignored when used as a link).
     * When not set defaults to 'button'.
     * @default undefined
     */
    type: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * The URL that the hyperlink points to.
     * When set the component will be rendered as an anchor element.
     * @default undefined
     */
    href: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Disables the button.
     * @default false
     */
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Determines the styling of the component.
     * @default undefined
     */
    variant: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Determines the size of the button.
     * @default undefined
     */
    size: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Squared edges.
     * @default false
     */
    squared: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Optional icon displayed inside the button.
     * @default undefined
     */
    icon: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Position of the icon.
     * @default 'start'
     */
    iconPosition: {
      type: String,
      required: !1,
      default: "start"
    },
    /**
     * Removes the padding.
     * @default false
     */
    noPadding: {
      type: Boolean,
      required: !1,
      default: !1
    },
    loading: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  emits: [
    /**
     * Emitted when the button gets clicked.
     * @event module:DpsButton#click
     */
    "click"
  ],
  computed: {
    typeAttribute() {
      if (!this.href)
        return this.type ? this.type : "button";
    }
  },
  methods: {
    handleClick(e) {
      this.disabled || this.loading ? e.preventDefault() : this.$emit("click", e);
    }
  }
}), oi = ["role"], di = {
  key: 1,
  class: "dps-button__text"
}, ci = ["role"], fi = {
  key: 1,
  class: "dps-button__text"
};
function hi(e, r, i, s, o, f) {
  return q(), W(Be(e.href ? "a" : "button"), {
    class: R(["dps-button", {
      "dps-button--squared": e.squared,
      ["dps-button--size-" + e.size]: e.size,
      ["dps-button--" + e.variant]: e.variant,
      "dps-button--disabled": e.disabled,
      "dps-button--loading": e.loading,
      "dps-button--no-padding": e.noPadding
    }]),
    type: e.typeAttribute,
    href: e.href,
    disabled: e.disabled || e.loading,
    onClick: e.handleClick
  }, {
    default: z(() => [
      e.icon || e.loading ? (q(), I(oe, { key: 0 }, [
        e.iconPosition === "start" ? (q(), I("span", {
          key: 0,
          class: R(["dps-icon", {
            "dps-icon--ladeanimation": e.loading,
            ["dps-icon--" + e.icon]: !e.loading
          }]),
          role: e.loading ? "status" : void 0,
          "aria-hidden": "true"
        }, null, 10, oi)) : j("", !0),
        e.$slots.default ? (q(), I("span", di, [
          B(e.$slots, "default")
        ])) : j("", !0),
        e.iconPosition === "end" ? (q(), I("span", {
          key: 2,
          class: R(["dps-icon", {
            "dps-icon--ladeanimation": e.loading,
            ["dps-icon--" + e.icon]: !e.loading
          }]),
          role: e.loading ? "status" : void 0,
          "aria-hidden": "true"
        }, null, 10, ci)) : j("", !0)
      ], 64)) : e.variant === "link" || e.variant === "link-darker" ? (q(), I("span", fi, [
        B(e.$slots, "default")
      ])) : B(e.$slots, "default", { key: 2 })
    ]),
    _: 3
  }, 8, ["class", "type", "href", "disabled", "onClick"]);
}
const rt = /* @__PURE__ */ K(li, [["render", hi]]), pi = ue({
  name: "DpsCollapsible",
  props: {
    /**
     * The unique identifier for the menu (optional).
     * @default undefined
     */
    id: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Collapsible expanded.
     * @default false
     */
    expanded: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Whether the collapsible can not be interacted with.
     * @default false
     */
    locked: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Size of the collapsible.
     * @default undefined
     */
    size: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Styling of the collapsible.
     * @default undefined
     */
    variant: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Headline text when collapsible is expanded.
     * @default undefined
     */
    toggleTextExpanded: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Headline text when collapsible is not expanded.
     * @default undefined
     */
    toggleText: {
      type: String,
      required: !1,
      default: void 0
    }
  },
  emits: [
    /**
     * Emitted immediately when collapsible content gets hidden.
     * @event module:DpsCollapsible#hide-collapsible
     */
    "hide-collapsible",
    /**
     * Emitted when collapsible content has been hidden (after CSS transitions).
     * @event module:DpsCollapsible#hidden-collapsible
     */
    "hidden-collapsible",
    /**
     * Emitted immediately when collapsible content gets shown.
     * @event module:DpsCollapsible#show-collapsible
     */
    "show-collapsible",
    /**
     * Emitted when collapsible content has been made visible (after CSS transitions).
     * @event module:DpsCollapsible#shown-collapsible
     */
    "shown-collapsible"
  ],
  data() {
    return {
      isExpanded: !1
    };
  },
  computed: {
    uniqueId() {
      return this.id ? this.id : be("dps-collapsible-");
    }
  },
  watch: {
    expanded(e) {
      this.isExpanded = e;
    }
  },
  mounted() {
    const e = this.$refs.collapsible;
    this.isExpanded = this.expanded, e && (e.addEventListener("hide.bs.collapse", (r) => {
      r.target === r.currentTarget && (r.stopPropagation(), this.isExpanded = !1, this.$emit("hide-collapsible", r));
    }), e.addEventListener("hidden.bs.collapse", (r) => {
      r.target === r.currentTarget && (r.stopPropagation(), this.$emit("hidden-collapsible", r));
    }), e.addEventListener("show.bs.collapse", (r) => {
      r.target === r.currentTarget && (r.stopPropagation(), this.isExpanded = !0, this.$emit("show-collapsible", r));
    }), e.addEventListener("shown.bs.collapse", (r) => {
      r.target === r.currentTarget && (r.stopPropagation(), this.$emit("shown-collapsible", r));
    }));
  }
}), bi = { class: "dps-collapsible__header" }, mi = ["data-bs-target", "aria-expanded", "aria-controls"], gi = ["id"], yi = { class: "dps-collapsible__body" };
function vi(e, r, i, s, o, f) {
  return q(), I("div", {
    class: R(["dps-collapsible", {
      "dps-collapsible--expanded": e.isExpanded,
      ["dps-collapsible--" + e.variant]: e.variant,
      ["dps-collapsible--size-" + e.size]: e.size
    }])
  }, [
    $("div", bi, [
      e.locked ? B(e.$slots, "header", { key: 0 }, () => [
        te(G(e.isExpanded && e.toggleTextExpanded || e.toggleText), 1)
      ]) : (q(), I("button", {
        key: 1,
        class: "dps-collapsible__trigger-button",
        type: "button",
        "data-bs-toggle": "collapse",
        "data-bs-target": "#" + e.uniqueId,
        "aria-expanded": e.expanded,
        "aria-controls": e.uniqueId
      }, [
        $("span", {
          class: R(["dps-icon", {
            "dps-icon--chevron-down": e.size === "lg" && e.variant !== "tertiary",
            "dps-icon--chevron-down-small": e.size !== "lg" && e.variant !== "tertiary",
            "dps-icon--plus": e.variant === "tertiary" && !e.isExpanded,
            "dps-icon--minus": e.variant === "tertiary" && e.isExpanded
          }])
        }, null, 2),
        B(e.$slots, "header", {}, () => [
          te(G(e.isExpanded && e.toggleTextExpanded || e.toggleText), 1)
        ])
      ], 8, mi))
    ]),
    $("div", {
      id: e.locked ? void 0 : e.uniqueId,
      ref: "collapsible",
      class: R(["dps-collapsible__collapsible collapse", { show: e.expanded }])
    }, [
      $("div", yi, [
        B(e.$slots, "default")
      ])
    ], 10, gi)
  ], 2);
}
const Ga = /* @__PURE__ */ K(pi, [["render", vi]]), wi = ue({
  name: "DpsFilterButton",
  props: {
    /**
     * Disables the button.
     * @default false
     */
    disabled: {
      type: Boolean,
      default: !1,
      required: !1
    },
    /**
     * Makes the button readonly.
     * @default false
     */
    readonly: {
      type: Boolean,
      default: !1,
      required: !1
    },
    /**
     * Title attribute of the button.
     * @default undefined
     */
    title: {
      type: String,
      default: void 0,
      required: !1
    }
  },
  emits: [
    /**
     * Emitted when the button is clicked.
     * @event module:DpsFilterButton#click
     */
    "click"
  ],
  computed: {
    titleAttribute() {
      return this.title ? this.title : "Filter entfernen";
    }
  },
  methods: {
    handleClick(e) {
      this.disabled || this.$emit("click", e);
    }
  }
}), Si = ["title", "disabled"], xi = /* @__PURE__ */ $("span", { class: "dps-icon dps-icon--close" }, null, -1);
function Ei(e, r, i, s, o, f) {
  return q(), I("button", {
    class: R(["dps-filter-button", {
      "dps-filter-button--disabled": e.disabled,
      "dps-filter-button--readonly": e.readonly
    }]),
    type: "button",
    title: e.titleAttribute,
    disabled: e.disabled || e.readonly,
    onClick: r[0] || (r[0] = (...n) => e.handleClick && e.handleClick(...n))
  }, [
    $("span", null, [
      B(e.$slots, "default")
    ]),
    xi
  ], 10, Si);
}
const Ai = /* @__PURE__ */ K(wi, [["render", Ei]]), ki = ue({
  name: "DpsFormCheckbox",
  props: {
    /**
     * The unique identifier for the checkbox (optional).
     * @default undefined
     */
    id: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * modelValue of the checkbox.
     * @default undefined
     */
    modelValue: {
      type: [String, Boolean, Number, Array],
      required: !1,
      default: void 0
    },
    /**
     * Name attribute of the input.
     * @default undefined
     */
    name: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Value attribute of the input.
     * @default true
     */
    value: {
      type: [String, Boolean, Number],
      required: !1,
      default: !0
    },
    /**
     * Title attribute of the component.
     * @default undefined
     */
    tooltip: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Disables the checkbox.
     * @default false
     */
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    },
    readonly: {
      type: Boolean,
      required: !1,
      default: !1
    },
    error: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Checkbox is displayed as block.
     * @default false
     */
    block: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Truncates the label.
     * @default false
     */
    truncate: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Hides the label.
     * @default false
     */
    hideLabel: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * The size of the component.
     * @default undefined
     */
    size: {
      type: String,
      required: !1,
      default: void 0
    }
  },
  emits: [
    /**
     * Emitted when the value changes.
     * @event module:DpsFormCheckbox#update:modelValue
     */
    "update:modelValue"
  ],
  computed: {
    uniqueId() {
      return this.id ? this.id : be("dps-form-checkbox-");
    },
    isChecked() {
      return Array.isArray(this.modelValue) ? this.modelValue.includes(this.value) : this.modelValue === this.value;
    }
  },
  methods: {
    handleChange(e) {
      const i = e.target.value;
      let s;
      Array.isArray(this.modelValue) ? (s = [...this.modelValue], this.modelValue.includes(i) ? s = s.filter((o) => o !== i) : s = [...s, i]) : typeof this.modelValue == "boolean" ? (s = !1, this.modelValue !== !!i && (s = !!i)) : typeof this.modelValue == "number" ? (s = 0, this.modelValue !== Number(i) && (s = Number(i))) : (s = "", this.modelValue !== i && (s = i)), this.$emit("update:modelValue", s);
    }
  }
}), qi = ["id", "name", "value", "checked", "disabled", "readonly"], Ti = ["for", "title"], Di = {
  key: 0,
  class: "sr-only"
};
function Ci(e, r, i, s, o, f) {
  return q(), I("div", {
    class: R(["dps-form-checkbox dps-input-wrapper", {
      ["dps-form-checkbox--size-" + e.size]: e.size,
      "dps-form-checkbox--block": e.block || e.truncate
    }])
  }, [
    $("input", {
      id: e.uniqueId,
      class: R(["dps-form-checkbox__input dps-checkbox", {
        ["dps-checkbox--size-" + e.size]: e.size,
        "dps-checkbox--error": e.error
      }]),
      type: "checkbox",
      name: e.name,
      value: e.value,
      checked: e.isChecked,
      disabled: e.disabled || e.readonly,
      readonly: e.readonly,
      onChange: r[0] || (r[0] = (...n) => e.handleChange && e.handleChange(...n))
    }, null, 42, qi),
    $("label", {
      for: e.uniqueId,
      title: e.tooltip,
      class: R(["dps-form-checkbox__label dps-label", {
        "dps-form-checkbox__label--input-only": e.hideLabel,
        "dps-text--ellipse": e.truncate
      }])
    }, [
      e.hideLabel ? (q(), I("span", Di, [
        B(e.$slots, "default")
      ])) : B(e.$slots, "default", { key: 1 })
    ], 10, Ti)
  ], 2);
}
const Zt = /* @__PURE__ */ K(ki, [["render", Ci]]);
function Oi(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Pi(e) {
  if (e.__esModule) return e;
  var r = e.default;
  if (typeof r == "function") {
    var i = function s() {
      return this instanceof s ? Reflect.construct(r, arguments, this.constructor) : r.apply(this, arguments);
    };
    i.prototype = r.prototype;
  } else i = {};
  return Object.defineProperty(i, "__esModule", { value: !0 }), Object.keys(e).forEach(function(s) {
    var o = Object.getOwnPropertyDescriptor(e, s);
    Object.defineProperty(i, s, o.get ? o : {
      enumerable: !0,
      get: function() {
        return e[s];
      }
    });
  }), i;
}
var Se = {}, xe = {}, ft = {}, Ee = {}, Ke = {}, du;
function Li() {
  return du || (du = 1, Object.defineProperty(Ke, "__esModule", { value: !0 }), Ke.default = new Uint16Array(
    // prettier-ignore
    'ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻 ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌'.split("").map(function(e) {
      return e.charCodeAt(0);
    })
  )), Ke;
}
var Je = {}, cu;
function Ii() {
  return cu || (cu = 1, Object.defineProperty(Je, "__esModule", { value: !0 }), Je.default = new Uint16Array(
    // prettier-ignore
    "Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map(function(e) {
      return e.charCodeAt(0);
    })
  )), Je;
}
var ht = {}, fu;
function hu() {
  return fu || (fu = 1, function(e) {
    var r;
    Object.defineProperty(e, "__esModule", { value: !0 }), e.replaceCodePoint = e.fromCodePoint = void 0;
    var i = /* @__PURE__ */ new Map([
      [0, 65533],
      // C1 Unicode control character reference replacements
      [128, 8364],
      [130, 8218],
      [131, 402],
      [132, 8222],
      [133, 8230],
      [134, 8224],
      [135, 8225],
      [136, 710],
      [137, 8240],
      [138, 352],
      [139, 8249],
      [140, 338],
      [142, 381],
      [145, 8216],
      [146, 8217],
      [147, 8220],
      [148, 8221],
      [149, 8226],
      [150, 8211],
      [151, 8212],
      [152, 732],
      [153, 8482],
      [154, 353],
      [155, 8250],
      [156, 339],
      [158, 382],
      [159, 376]
    ]);
    e.fromCodePoint = // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
    (r = String.fromCodePoint) !== null && r !== void 0 ? r : function(f) {
      var n = "";
      return f > 65535 && (f -= 65536, n += String.fromCharCode(f >>> 10 & 1023 | 55296), f = 56320 | f & 1023), n += String.fromCharCode(f), n;
    };
    function s(f) {
      var n;
      return f >= 55296 && f <= 57343 || f > 1114111 ? 65533 : (n = i.get(f)) !== null && n !== void 0 ? n : f;
    }
    e.replaceCodePoint = s;
    function o(f) {
      return (0, e.fromCodePoint)(s(f));
    }
    e.default = o;
  }(ht)), ht;
}
var pu;
function ut() {
  return pu || (pu = 1, function(e) {
    var r = Ee && Ee.__createBinding || (Object.create ? function(A, T, L, M) {
      M === void 0 && (M = L);
      var D = Object.getOwnPropertyDescriptor(T, L);
      (!D || ("get" in D ? !T.__esModule : D.writable || D.configurable)) && (D = { enumerable: !0, get: function() {
        return T[L];
      } }), Object.defineProperty(A, M, D);
    } : function(A, T, L, M) {
      M === void 0 && (M = L), A[M] = T[L];
    }), i = Ee && Ee.__setModuleDefault || (Object.create ? function(A, T) {
      Object.defineProperty(A, "default", { enumerable: !0, value: T });
    } : function(A, T) {
      A.default = T;
    }), s = Ee && Ee.__importStar || function(A) {
      if (A && A.__esModule) return A;
      var T = {};
      if (A != null) for (var L in A) L !== "default" && Object.prototype.hasOwnProperty.call(A, L) && r(T, A, L);
      return i(T, A), T;
    }, o = Ee && Ee.__importDefault || function(A) {
      return A && A.__esModule ? A : { default: A };
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.decodeXML = e.decodeHTMLStrict = e.decodeHTMLAttribute = e.decodeHTML = e.determineBranch = e.EntityDecoder = e.DecodingMode = e.BinTrieFlags = e.fromCodePoint = e.replaceCodePoint = e.decodeCodePoint = e.xmlDecodeTree = e.htmlDecodeTree = void 0;
    var f = o(/* @__PURE__ */ Li());
    e.htmlDecodeTree = f.default;
    var n = o(/* @__PURE__ */ Ii());
    e.xmlDecodeTree = n.default;
    var c = s(/* @__PURE__ */ hu());
    e.decodeCodePoint = c.default;
    var p = /* @__PURE__ */ hu();
    Object.defineProperty(e, "replaceCodePoint", { enumerable: !0, get: function() {
      return p.replaceCodePoint;
    } }), Object.defineProperty(e, "fromCodePoint", { enumerable: !0, get: function() {
      return p.fromCodePoint;
    } });
    var a;
    (function(A) {
      A[A.NUM = 35] = "NUM", A[A.SEMI = 59] = "SEMI", A[A.EQUALS = 61] = "EQUALS", A[A.ZERO = 48] = "ZERO", A[A.NINE = 57] = "NINE", A[A.LOWER_A = 97] = "LOWER_A", A[A.LOWER_F = 102] = "LOWER_F", A[A.LOWER_X = 120] = "LOWER_X", A[A.LOWER_Z = 122] = "LOWER_Z", A[A.UPPER_A = 65] = "UPPER_A", A[A.UPPER_F = 70] = "UPPER_F", A[A.UPPER_Z = 90] = "UPPER_Z";
    })(a || (a = {}));
    var l = 32, h;
    (function(A) {
      A[A.VALUE_LENGTH = 49152] = "VALUE_LENGTH", A[A.BRANCH_LENGTH = 16256] = "BRANCH_LENGTH", A[A.JUMP_TABLE = 127] = "JUMP_TABLE";
    })(h = e.BinTrieFlags || (e.BinTrieFlags = {}));
    function t(A) {
      return A >= a.ZERO && A <= a.NINE;
    }
    function u(A) {
      return A >= a.UPPER_A && A <= a.UPPER_F || A >= a.LOWER_A && A <= a.LOWER_F;
    }
    function m(A) {
      return A >= a.UPPER_A && A <= a.UPPER_Z || A >= a.LOWER_A && A <= a.LOWER_Z || t(A);
    }
    function v(A) {
      return A === a.EQUALS || m(A);
    }
    var y;
    (function(A) {
      A[A.EntityStart = 0] = "EntityStart", A[A.NumericStart = 1] = "NumericStart", A[A.NumericDecimal = 2] = "NumericDecimal", A[A.NumericHex = 3] = "NumericHex", A[A.NamedEntity = 4] = "NamedEntity";
    })(y || (y = {}));
    var d;
    (function(A) {
      A[A.Legacy = 0] = "Legacy", A[A.Strict = 1] = "Strict", A[A.Attribute = 2] = "Attribute";
    })(d = e.DecodingMode || (e.DecodingMode = {}));
    var g = (
      /** @class */
      function() {
        function A(T, L, M) {
          this.decodeTree = T, this.emitCodePoint = L, this.errors = M, this.state = y.EntityStart, this.consumed = 1, this.result = 0, this.treeIndex = 0, this.excess = 1, this.decodeMode = d.Strict;
        }
        return A.prototype.startEntity = function(T) {
          this.decodeMode = T, this.state = y.EntityStart, this.result = 0, this.treeIndex = 0, this.excess = 1, this.consumed = 1;
        }, A.prototype.write = function(T, L) {
          switch (this.state) {
            case y.EntityStart:
              return T.charCodeAt(L) === a.NUM ? (this.state = y.NumericStart, this.consumed += 1, this.stateNumericStart(T, L + 1)) : (this.state = y.NamedEntity, this.stateNamedEntity(T, L));
            case y.NumericStart:
              return this.stateNumericStart(T, L);
            case y.NumericDecimal:
              return this.stateNumericDecimal(T, L);
            case y.NumericHex:
              return this.stateNumericHex(T, L);
            case y.NamedEntity:
              return this.stateNamedEntity(T, L);
          }
        }, A.prototype.stateNumericStart = function(T, L) {
          return L >= T.length ? -1 : (T.charCodeAt(L) | l) === a.LOWER_X ? (this.state = y.NumericHex, this.consumed += 1, this.stateNumericHex(T, L + 1)) : (this.state = y.NumericDecimal, this.stateNumericDecimal(T, L));
        }, A.prototype.addToNumericResult = function(T, L, M, D) {
          if (L !== M) {
            var H = M - L;
            this.result = this.result * Math.pow(D, H) + parseInt(T.substr(L, H), D), this.consumed += H;
          }
        }, A.prototype.stateNumericHex = function(T, L) {
          for (var M = L; L < T.length; ) {
            var D = T.charCodeAt(L);
            if (t(D) || u(D))
              L += 1;
            else
              return this.addToNumericResult(T, M, L, 16), this.emitNumericEntity(D, 3);
          }
          return this.addToNumericResult(T, M, L, 16), -1;
        }, A.prototype.stateNumericDecimal = function(T, L) {
          for (var M = L; L < T.length; ) {
            var D = T.charCodeAt(L);
            if (t(D))
              L += 1;
            else
              return this.addToNumericResult(T, M, L, 10), this.emitNumericEntity(D, 2);
          }
          return this.addToNumericResult(T, M, L, 10), -1;
        }, A.prototype.emitNumericEntity = function(T, L) {
          var M;
          if (this.consumed <= L)
            return (M = this.errors) === null || M === void 0 || M.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
          if (T === a.SEMI)
            this.consumed += 1;
          else if (this.decodeMode === d.Strict)
            return 0;
          return this.emitCodePoint((0, c.replaceCodePoint)(this.result), this.consumed), this.errors && (T !== a.SEMI && this.errors.missingSemicolonAfterCharacterReference(), this.errors.validateNumericCharacterReference(this.result)), this.consumed;
        }, A.prototype.stateNamedEntity = function(T, L) {
          for (var M = this.decodeTree, D = M[this.treeIndex], H = (D & h.VALUE_LENGTH) >> 14; L < T.length; L++, this.excess++) {
            var Y = T.charCodeAt(L);
            if (this.treeIndex = x(M, D, this.treeIndex + Math.max(1, H), Y), this.treeIndex < 0)
              return this.result === 0 || // If we are parsing an attribute
              this.decodeMode === d.Attribute && // We shouldn't have consumed any characters after the entity,
              (H === 0 || // And there should be no invalid characters.
              v(Y)) ? 0 : this.emitNotTerminatedNamedEntity();
            if (D = M[this.treeIndex], H = (D & h.VALUE_LENGTH) >> 14, H !== 0) {
              if (Y === a.SEMI)
                return this.emitNamedEntityData(this.treeIndex, H, this.consumed + this.excess);
              this.decodeMode !== d.Strict && (this.result = this.treeIndex, this.consumed += this.excess, this.excess = 0);
            }
          }
          return -1;
        }, A.prototype.emitNotTerminatedNamedEntity = function() {
          var T, L = this, M = L.result, D = L.decodeTree, H = (D[M] & h.VALUE_LENGTH) >> 14;
          return this.emitNamedEntityData(M, H, this.consumed), (T = this.errors) === null || T === void 0 || T.missingSemicolonAfterCharacterReference(), this.consumed;
        }, A.prototype.emitNamedEntityData = function(T, L, M) {
          var D = this.decodeTree;
          return this.emitCodePoint(L === 1 ? D[T] & ~h.VALUE_LENGTH : D[T + 1], M), L === 3 && this.emitCodePoint(D[T + 2], M), M;
        }, A.prototype.end = function() {
          var T;
          switch (this.state) {
            case y.NamedEntity:
              return this.result !== 0 && (this.decodeMode !== d.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
            // Otherwise, emit a numeric entity if we have one.
            case y.NumericDecimal:
              return this.emitNumericEntity(0, 2);
            case y.NumericHex:
              return this.emitNumericEntity(0, 3);
            case y.NumericStart:
              return (T = this.errors) === null || T === void 0 || T.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
            case y.EntityStart:
              return 0;
          }
        }, A;
      }()
    );
    e.EntityDecoder = g;
    function w(A) {
      var T = "", L = new g(A, function(M) {
        return T += (0, c.fromCodePoint)(M);
      });
      return function(D, H) {
        for (var Y = 0, Q = 0; (Q = D.indexOf("&", Q)) >= 0; ) {
          T += D.slice(Y, Q), L.startEntity(H);
          var ne = L.write(
            D,
            // Skip the "&"
            Q + 1
          );
          if (ne < 0) {
            Y = Q + L.end();
            break;
          }
          Y = Q + ne, Q = ne === 0 ? Y + 1 : Y;
        }
        var se = T + D.slice(Y);
        return T = "", se;
      };
    }
    function x(A, T, L, M) {
      var D = (T & h.BRANCH_LENGTH) >> 7, H = T & h.JUMP_TABLE;
      if (D === 0)
        return H !== 0 && M === H ? L : -1;
      if (H) {
        var Y = M - H;
        return Y < 0 || Y >= D ? -1 : A[L + Y] - 1;
      }
      for (var Q = L, ne = Q + D - 1; Q <= ne; ) {
        var se = Q + ne >>> 1, qe = A[se];
        if (qe < M)
          Q = se + 1;
        else if (qe > M)
          ne = se - 1;
        else
          return A[se + D];
      }
      return -1;
    }
    e.determineBranch = x;
    var b = w(f.default), S = w(n.default);
    function E(A, T) {
      return T === void 0 && (T = d.Legacy), b(A, T);
    }
    e.decodeHTML = E;
    function k(A) {
      return b(A, d.Attribute);
    }
    e.decodeHTMLAttribute = k;
    function O(A) {
      return b(A, d.Strict);
    }
    e.decodeHTMLStrict = O;
    function P(A) {
      return S(A, d.Strict);
    }
    e.decodeXML = P;
  }(Ee)), Ee;
}
var bu;
function Sr() {
  return bu || (bu = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.QuoteType = void 0;
    var r = /* @__PURE__ */ ut(), i;
    (function(t) {
      t[t.Tab = 9] = "Tab", t[t.NewLine = 10] = "NewLine", t[t.FormFeed = 12] = "FormFeed", t[t.CarriageReturn = 13] = "CarriageReturn", t[t.Space = 32] = "Space", t[t.ExclamationMark = 33] = "ExclamationMark", t[t.Number = 35] = "Number", t[t.Amp = 38] = "Amp", t[t.SingleQuote = 39] = "SingleQuote", t[t.DoubleQuote = 34] = "DoubleQuote", t[t.Dash = 45] = "Dash", t[t.Slash = 47] = "Slash", t[t.Zero = 48] = "Zero", t[t.Nine = 57] = "Nine", t[t.Semi = 59] = "Semi", t[t.Lt = 60] = "Lt", t[t.Eq = 61] = "Eq", t[t.Gt = 62] = "Gt", t[t.Questionmark = 63] = "Questionmark", t[t.UpperA = 65] = "UpperA", t[t.LowerA = 97] = "LowerA", t[t.UpperF = 70] = "UpperF", t[t.LowerF = 102] = "LowerF", t[t.UpperZ = 90] = "UpperZ", t[t.LowerZ = 122] = "LowerZ", t[t.LowerX = 120] = "LowerX", t[t.OpeningSquareBracket = 91] = "OpeningSquareBracket";
    })(i || (i = {}));
    var s;
    (function(t) {
      t[t.Text = 1] = "Text", t[t.BeforeTagName = 2] = "BeforeTagName", t[t.InTagName = 3] = "InTagName", t[t.InSelfClosingTag = 4] = "InSelfClosingTag", t[t.BeforeClosingTagName = 5] = "BeforeClosingTagName", t[t.InClosingTagName = 6] = "InClosingTagName", t[t.AfterClosingTagName = 7] = "AfterClosingTagName", t[t.BeforeAttributeName = 8] = "BeforeAttributeName", t[t.InAttributeName = 9] = "InAttributeName", t[t.AfterAttributeName = 10] = "AfterAttributeName", t[t.BeforeAttributeValue = 11] = "BeforeAttributeValue", t[t.InAttributeValueDq = 12] = "InAttributeValueDq", t[t.InAttributeValueSq = 13] = "InAttributeValueSq", t[t.InAttributeValueNq = 14] = "InAttributeValueNq", t[t.BeforeDeclaration = 15] = "BeforeDeclaration", t[t.InDeclaration = 16] = "InDeclaration", t[t.InProcessingInstruction = 17] = "InProcessingInstruction", t[t.BeforeComment = 18] = "BeforeComment", t[t.CDATASequence = 19] = "CDATASequence", t[t.InSpecialComment = 20] = "InSpecialComment", t[t.InCommentLike = 21] = "InCommentLike", t[t.BeforeSpecialS = 22] = "BeforeSpecialS", t[t.SpecialStartSequence = 23] = "SpecialStartSequence", t[t.InSpecialTag = 24] = "InSpecialTag", t[t.BeforeEntity = 25] = "BeforeEntity", t[t.BeforeNumericEntity = 26] = "BeforeNumericEntity", t[t.InNamedEntity = 27] = "InNamedEntity", t[t.InNumericEntity = 28] = "InNumericEntity", t[t.InHexEntity = 29] = "InHexEntity";
    })(s || (s = {}));
    function o(t) {
      return t === i.Space || t === i.NewLine || t === i.Tab || t === i.FormFeed || t === i.CarriageReturn;
    }
    function f(t) {
      return t === i.Slash || t === i.Gt || o(t);
    }
    function n(t) {
      return t >= i.Zero && t <= i.Nine;
    }
    function c(t) {
      return t >= i.LowerA && t <= i.LowerZ || t >= i.UpperA && t <= i.UpperZ;
    }
    function p(t) {
      return t >= i.UpperA && t <= i.UpperF || t >= i.LowerA && t <= i.LowerF;
    }
    var a;
    (function(t) {
      t[t.NoValue = 0] = "NoValue", t[t.Unquoted = 1] = "Unquoted", t[t.Single = 2] = "Single", t[t.Double = 3] = "Double";
    })(a = e.QuoteType || (e.QuoteType = {}));
    var l = {
      Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]),
      CdataEnd: new Uint8Array([93, 93, 62]),
      CommentEnd: new Uint8Array([45, 45, 62]),
      ScriptEnd: new Uint8Array([60, 47, 115, 99, 114, 105, 112, 116]),
      StyleEnd: new Uint8Array([60, 47, 115, 116, 121, 108, 101]),
      TitleEnd: new Uint8Array([60, 47, 116, 105, 116, 108, 101])
      // `</title`
    }, h = (
      /** @class */
      function() {
        function t(u, m) {
          var v = u.xmlMode, y = v === void 0 ? !1 : v, d = u.decodeEntities, g = d === void 0 ? !0 : d;
          this.cbs = m, this.state = s.Text, this.buffer = "", this.sectionStart = 0, this.index = 0, this.baseState = s.Text, this.isSpecial = !1, this.running = !0, this.offset = 0, this.currentSequence = void 0, this.sequenceIndex = 0, this.trieIndex = 0, this.trieCurrent = 0, this.entityResult = 0, this.entityExcess = 0, this.xmlMode = y, this.decodeEntities = g, this.entityTrie = y ? r.xmlDecodeTree : r.htmlDecodeTree;
        }
        return t.prototype.reset = function() {
          this.state = s.Text, this.buffer = "", this.sectionStart = 0, this.index = 0, this.baseState = s.Text, this.currentSequence = void 0, this.running = !0, this.offset = 0;
        }, t.prototype.write = function(u) {
          this.offset += this.buffer.length, this.buffer = u, this.parse();
        }, t.prototype.end = function() {
          this.running && this.finish();
        }, t.prototype.pause = function() {
          this.running = !1;
        }, t.prototype.resume = function() {
          this.running = !0, this.index < this.buffer.length + this.offset && this.parse();
        }, t.prototype.getIndex = function() {
          return this.index;
        }, t.prototype.getSectionStart = function() {
          return this.sectionStart;
        }, t.prototype.stateText = function(u) {
          u === i.Lt || !this.decodeEntities && this.fastForwardTo(i.Lt) ? (this.index > this.sectionStart && this.cbs.ontext(this.sectionStart, this.index), this.state = s.BeforeTagName, this.sectionStart = this.index) : this.decodeEntities && u === i.Amp && (this.state = s.BeforeEntity);
        }, t.prototype.stateSpecialStartSequence = function(u) {
          var m = this.sequenceIndex === this.currentSequence.length, v = m ? (
            // If we are at the end of the sequence, make sure the tag name has ended
            f(u)
          ) : (
            // Otherwise, do a case-insensitive comparison
            (u | 32) === this.currentSequence[this.sequenceIndex]
          );
          if (!v)
            this.isSpecial = !1;
          else if (!m) {
            this.sequenceIndex++;
            return;
          }
          this.sequenceIndex = 0, this.state = s.InTagName, this.stateInTagName(u);
        }, t.prototype.stateInSpecialTag = function(u) {
          if (this.sequenceIndex === this.currentSequence.length) {
            if (u === i.Gt || o(u)) {
              var m = this.index - this.currentSequence.length;
              if (this.sectionStart < m) {
                var v = this.index;
                this.index = m, this.cbs.ontext(this.sectionStart, m), this.index = v;
              }
              this.isSpecial = !1, this.sectionStart = m + 2, this.stateInClosingTagName(u);
              return;
            }
            this.sequenceIndex = 0;
          }
          (u | 32) === this.currentSequence[this.sequenceIndex] ? this.sequenceIndex += 1 : this.sequenceIndex === 0 ? this.currentSequence === l.TitleEnd ? this.decodeEntities && u === i.Amp && (this.state = s.BeforeEntity) : this.fastForwardTo(i.Lt) && (this.sequenceIndex = 1) : this.sequenceIndex = +(u === i.Lt);
        }, t.prototype.stateCDATASequence = function(u) {
          u === l.Cdata[this.sequenceIndex] ? ++this.sequenceIndex === l.Cdata.length && (this.state = s.InCommentLike, this.currentSequence = l.CdataEnd, this.sequenceIndex = 0, this.sectionStart = this.index + 1) : (this.sequenceIndex = 0, this.state = s.InDeclaration, this.stateInDeclaration(u));
        }, t.prototype.fastForwardTo = function(u) {
          for (; ++this.index < this.buffer.length + this.offset; )
            if (this.buffer.charCodeAt(this.index - this.offset) === u)
              return !0;
          return this.index = this.buffer.length + this.offset - 1, !1;
        }, t.prototype.stateInCommentLike = function(u) {
          u === this.currentSequence[this.sequenceIndex] ? ++this.sequenceIndex === this.currentSequence.length && (this.currentSequence === l.CdataEnd ? this.cbs.oncdata(this.sectionStart, this.index, 2) : this.cbs.oncomment(this.sectionStart, this.index, 2), this.sequenceIndex = 0, this.sectionStart = this.index + 1, this.state = s.Text) : this.sequenceIndex === 0 ? this.fastForwardTo(this.currentSequence[0]) && (this.sequenceIndex = 1) : u !== this.currentSequence[this.sequenceIndex - 1] && (this.sequenceIndex = 0);
        }, t.prototype.isTagStartChar = function(u) {
          return this.xmlMode ? !f(u) : c(u);
        }, t.prototype.startSpecial = function(u, m) {
          this.isSpecial = !0, this.currentSequence = u, this.sequenceIndex = m, this.state = s.SpecialStartSequence;
        }, t.prototype.stateBeforeTagName = function(u) {
          if (u === i.ExclamationMark)
            this.state = s.BeforeDeclaration, this.sectionStart = this.index + 1;
          else if (u === i.Questionmark)
            this.state = s.InProcessingInstruction, this.sectionStart = this.index + 1;
          else if (this.isTagStartChar(u)) {
            var m = u | 32;
            this.sectionStart = this.index, !this.xmlMode && m === l.TitleEnd[2] ? this.startSpecial(l.TitleEnd, 3) : this.state = !this.xmlMode && m === l.ScriptEnd[2] ? s.BeforeSpecialS : s.InTagName;
          } else u === i.Slash ? this.state = s.BeforeClosingTagName : (this.state = s.Text, this.stateText(u));
        }, t.prototype.stateInTagName = function(u) {
          f(u) && (this.cbs.onopentagname(this.sectionStart, this.index), this.sectionStart = -1, this.state = s.BeforeAttributeName, this.stateBeforeAttributeName(u));
        }, t.prototype.stateBeforeClosingTagName = function(u) {
          o(u) || (u === i.Gt ? this.state = s.Text : (this.state = this.isTagStartChar(u) ? s.InClosingTagName : s.InSpecialComment, this.sectionStart = this.index));
        }, t.prototype.stateInClosingTagName = function(u) {
          (u === i.Gt || o(u)) && (this.cbs.onclosetag(this.sectionStart, this.index), this.sectionStart = -1, this.state = s.AfterClosingTagName, this.stateAfterClosingTagName(u));
        }, t.prototype.stateAfterClosingTagName = function(u) {
          (u === i.Gt || this.fastForwardTo(i.Gt)) && (this.state = s.Text, this.baseState = s.Text, this.sectionStart = this.index + 1);
        }, t.prototype.stateBeforeAttributeName = function(u) {
          u === i.Gt ? (this.cbs.onopentagend(this.index), this.isSpecial ? (this.state = s.InSpecialTag, this.sequenceIndex = 0) : this.state = s.Text, this.baseState = this.state, this.sectionStart = this.index + 1) : u === i.Slash ? this.state = s.InSelfClosingTag : o(u) || (this.state = s.InAttributeName, this.sectionStart = this.index);
        }, t.prototype.stateInSelfClosingTag = function(u) {
          u === i.Gt ? (this.cbs.onselfclosingtag(this.index), this.state = s.Text, this.baseState = s.Text, this.sectionStart = this.index + 1, this.isSpecial = !1) : o(u) || (this.state = s.BeforeAttributeName, this.stateBeforeAttributeName(u));
        }, t.prototype.stateInAttributeName = function(u) {
          (u === i.Eq || f(u)) && (this.cbs.onattribname(this.sectionStart, this.index), this.sectionStart = -1, this.state = s.AfterAttributeName, this.stateAfterAttributeName(u));
        }, t.prototype.stateAfterAttributeName = function(u) {
          u === i.Eq ? this.state = s.BeforeAttributeValue : u === i.Slash || u === i.Gt ? (this.cbs.onattribend(a.NoValue, this.index), this.state = s.BeforeAttributeName, this.stateBeforeAttributeName(u)) : o(u) || (this.cbs.onattribend(a.NoValue, this.index), this.state = s.InAttributeName, this.sectionStart = this.index);
        }, t.prototype.stateBeforeAttributeValue = function(u) {
          u === i.DoubleQuote ? (this.state = s.InAttributeValueDq, this.sectionStart = this.index + 1) : u === i.SingleQuote ? (this.state = s.InAttributeValueSq, this.sectionStart = this.index + 1) : o(u) || (this.sectionStart = this.index, this.state = s.InAttributeValueNq, this.stateInAttributeValueNoQuotes(u));
        }, t.prototype.handleInAttributeValue = function(u, m) {
          u === m || !this.decodeEntities && this.fastForwardTo(m) ? (this.cbs.onattribdata(this.sectionStart, this.index), this.sectionStart = -1, this.cbs.onattribend(m === i.DoubleQuote ? a.Double : a.Single, this.index), this.state = s.BeforeAttributeName) : this.decodeEntities && u === i.Amp && (this.baseState = this.state, this.state = s.BeforeEntity);
        }, t.prototype.stateInAttributeValueDoubleQuotes = function(u) {
          this.handleInAttributeValue(u, i.DoubleQuote);
        }, t.prototype.stateInAttributeValueSingleQuotes = function(u) {
          this.handleInAttributeValue(u, i.SingleQuote);
        }, t.prototype.stateInAttributeValueNoQuotes = function(u) {
          o(u) || u === i.Gt ? (this.cbs.onattribdata(this.sectionStart, this.index), this.sectionStart = -1, this.cbs.onattribend(a.Unquoted, this.index), this.state = s.BeforeAttributeName, this.stateBeforeAttributeName(u)) : this.decodeEntities && u === i.Amp && (this.baseState = this.state, this.state = s.BeforeEntity);
        }, t.prototype.stateBeforeDeclaration = function(u) {
          u === i.OpeningSquareBracket ? (this.state = s.CDATASequence, this.sequenceIndex = 0) : this.state = u === i.Dash ? s.BeforeComment : s.InDeclaration;
        }, t.prototype.stateInDeclaration = function(u) {
          (u === i.Gt || this.fastForwardTo(i.Gt)) && (this.cbs.ondeclaration(this.sectionStart, this.index), this.state = s.Text, this.sectionStart = this.index + 1);
        }, t.prototype.stateInProcessingInstruction = function(u) {
          (u === i.Gt || this.fastForwardTo(i.Gt)) && (this.cbs.onprocessinginstruction(this.sectionStart, this.index), this.state = s.Text, this.sectionStart = this.index + 1);
        }, t.prototype.stateBeforeComment = function(u) {
          u === i.Dash ? (this.state = s.InCommentLike, this.currentSequence = l.CommentEnd, this.sequenceIndex = 2, this.sectionStart = this.index + 1) : this.state = s.InDeclaration;
        }, t.prototype.stateInSpecialComment = function(u) {
          (u === i.Gt || this.fastForwardTo(i.Gt)) && (this.cbs.oncomment(this.sectionStart, this.index, 0), this.state = s.Text, this.sectionStart = this.index + 1);
        }, t.prototype.stateBeforeSpecialS = function(u) {
          var m = u | 32;
          m === l.ScriptEnd[3] ? this.startSpecial(l.ScriptEnd, 4) : m === l.StyleEnd[3] ? this.startSpecial(l.StyleEnd, 4) : (this.state = s.InTagName, this.stateInTagName(u));
        }, t.prototype.stateBeforeEntity = function(u) {
          this.entityExcess = 1, this.entityResult = 0, u === i.Number ? this.state = s.BeforeNumericEntity : u === i.Amp || (this.trieIndex = 0, this.trieCurrent = this.entityTrie[0], this.state = s.InNamedEntity, this.stateInNamedEntity(u));
        }, t.prototype.stateInNamedEntity = function(u) {
          if (this.entityExcess += 1, this.trieIndex = (0, r.determineBranch)(this.entityTrie, this.trieCurrent, this.trieIndex + 1, u), this.trieIndex < 0) {
            this.emitNamedEntity(), this.index--;
            return;
          }
          this.trieCurrent = this.entityTrie[this.trieIndex];
          var m = this.trieCurrent & r.BinTrieFlags.VALUE_LENGTH;
          if (m) {
            var v = (m >> 14) - 1;
            if (!this.allowLegacyEntity() && u !== i.Semi)
              this.trieIndex += v;
            else {
              var y = this.index - this.entityExcess + 1;
              y > this.sectionStart && this.emitPartial(this.sectionStart, y), this.entityResult = this.trieIndex, this.trieIndex += v, this.entityExcess = 0, this.sectionStart = this.index + 1, v === 0 && this.emitNamedEntity();
            }
          }
        }, t.prototype.emitNamedEntity = function() {
          if (this.state = this.baseState, this.entityResult !== 0) {
            var u = (this.entityTrie[this.entityResult] & r.BinTrieFlags.VALUE_LENGTH) >> 14;
            switch (u) {
              case 1: {
                this.emitCodePoint(this.entityTrie[this.entityResult] & ~r.BinTrieFlags.VALUE_LENGTH);
                break;
              }
              case 2: {
                this.emitCodePoint(this.entityTrie[this.entityResult + 1]);
                break;
              }
              case 3:
                this.emitCodePoint(this.entityTrie[this.entityResult + 1]), this.emitCodePoint(this.entityTrie[this.entityResult + 2]);
            }
          }
        }, t.prototype.stateBeforeNumericEntity = function(u) {
          (u | 32) === i.LowerX ? (this.entityExcess++, this.state = s.InHexEntity) : (this.state = s.InNumericEntity, this.stateInNumericEntity(u));
        }, t.prototype.emitNumericEntity = function(u) {
          var m = this.index - this.entityExcess - 1, v = m + 2 + +(this.state === s.InHexEntity);
          v !== this.index && (m > this.sectionStart && this.emitPartial(this.sectionStart, m), this.sectionStart = this.index + Number(u), this.emitCodePoint((0, r.replaceCodePoint)(this.entityResult))), this.state = this.baseState;
        }, t.prototype.stateInNumericEntity = function(u) {
          u === i.Semi ? this.emitNumericEntity(!0) : n(u) ? (this.entityResult = this.entityResult * 10 + (u - i.Zero), this.entityExcess++) : (this.allowLegacyEntity() ? this.emitNumericEntity(!1) : this.state = this.baseState, this.index--);
        }, t.prototype.stateInHexEntity = function(u) {
          u === i.Semi ? this.emitNumericEntity(!0) : n(u) ? (this.entityResult = this.entityResult * 16 + (u - i.Zero), this.entityExcess++) : p(u) ? (this.entityResult = this.entityResult * 16 + ((u | 32) - i.LowerA + 10), this.entityExcess++) : (this.allowLegacyEntity() ? this.emitNumericEntity(!1) : this.state = this.baseState, this.index--);
        }, t.prototype.allowLegacyEntity = function() {
          return !this.xmlMode && (this.baseState === s.Text || this.baseState === s.InSpecialTag);
        }, t.prototype.cleanup = function() {
          this.running && this.sectionStart !== this.index && (this.state === s.Text || this.state === s.InSpecialTag && this.sequenceIndex === 0 ? (this.cbs.ontext(this.sectionStart, this.index), this.sectionStart = this.index) : (this.state === s.InAttributeValueDq || this.state === s.InAttributeValueSq || this.state === s.InAttributeValueNq) && (this.cbs.onattribdata(this.sectionStart, this.index), this.sectionStart = this.index));
        }, t.prototype.shouldContinue = function() {
          return this.index < this.buffer.length + this.offset && this.running;
        }, t.prototype.parse = function() {
          for (; this.shouldContinue(); ) {
            var u = this.buffer.charCodeAt(this.index - this.offset);
            switch (this.state) {
              case s.Text: {
                this.stateText(u);
                break;
              }
              case s.SpecialStartSequence: {
                this.stateSpecialStartSequence(u);
                break;
              }
              case s.InSpecialTag: {
                this.stateInSpecialTag(u);
                break;
              }
              case s.CDATASequence: {
                this.stateCDATASequence(u);
                break;
              }
              case s.InAttributeValueDq: {
                this.stateInAttributeValueDoubleQuotes(u);
                break;
              }
              case s.InAttributeName: {
                this.stateInAttributeName(u);
                break;
              }
              case s.InCommentLike: {
                this.stateInCommentLike(u);
                break;
              }
              case s.InSpecialComment: {
                this.stateInSpecialComment(u);
                break;
              }
              case s.BeforeAttributeName: {
                this.stateBeforeAttributeName(u);
                break;
              }
              case s.InTagName: {
                this.stateInTagName(u);
                break;
              }
              case s.InClosingTagName: {
                this.stateInClosingTagName(u);
                break;
              }
              case s.BeforeTagName: {
                this.stateBeforeTagName(u);
                break;
              }
              case s.AfterAttributeName: {
                this.stateAfterAttributeName(u);
                break;
              }
              case s.InAttributeValueSq: {
                this.stateInAttributeValueSingleQuotes(u);
                break;
              }
              case s.BeforeAttributeValue: {
                this.stateBeforeAttributeValue(u);
                break;
              }
              case s.BeforeClosingTagName: {
                this.stateBeforeClosingTagName(u);
                break;
              }
              case s.AfterClosingTagName: {
                this.stateAfterClosingTagName(u);
                break;
              }
              case s.BeforeSpecialS: {
                this.stateBeforeSpecialS(u);
                break;
              }
              case s.InAttributeValueNq: {
                this.stateInAttributeValueNoQuotes(u);
                break;
              }
              case s.InSelfClosingTag: {
                this.stateInSelfClosingTag(u);
                break;
              }
              case s.InDeclaration: {
                this.stateInDeclaration(u);
                break;
              }
              case s.BeforeDeclaration: {
                this.stateBeforeDeclaration(u);
                break;
              }
              case s.BeforeComment: {
                this.stateBeforeComment(u);
                break;
              }
              case s.InProcessingInstruction: {
                this.stateInProcessingInstruction(u);
                break;
              }
              case s.InNamedEntity: {
                this.stateInNamedEntity(u);
                break;
              }
              case s.BeforeEntity: {
                this.stateBeforeEntity(u);
                break;
              }
              case s.InHexEntity: {
                this.stateInHexEntity(u);
                break;
              }
              case s.InNumericEntity: {
                this.stateInNumericEntity(u);
                break;
              }
              default:
                this.stateBeforeNumericEntity(u);
            }
            this.index++;
          }
          this.cleanup();
        }, t.prototype.finish = function() {
          this.state === s.InNamedEntity && this.emitNamedEntity(), this.sectionStart < this.index && this.handleTrailingData(), this.cbs.onend();
        }, t.prototype.handleTrailingData = function() {
          var u = this.buffer.length + this.offset;
          this.state === s.InCommentLike ? this.currentSequence === l.CdataEnd ? this.cbs.oncdata(this.sectionStart, u, 0) : this.cbs.oncomment(this.sectionStart, u, 0) : this.state === s.InNumericEntity && this.allowLegacyEntity() ? this.emitNumericEntity(!1) : this.state === s.InHexEntity && this.allowLegacyEntity() ? this.emitNumericEntity(!1) : this.state === s.InTagName || this.state === s.BeforeAttributeName || this.state === s.BeforeAttributeValue || this.state === s.AfterAttributeName || this.state === s.InAttributeName || this.state === s.InAttributeValueSq || this.state === s.InAttributeValueDq || this.state === s.InAttributeValueNq || this.state === s.InClosingTagName || this.cbs.ontext(this.sectionStart, u);
        }, t.prototype.emitPartial = function(u, m) {
          this.baseState !== s.Text && this.baseState !== s.InSpecialTag ? this.cbs.onattribdata(u, m) : this.cbs.ontext(u, m);
        }, t.prototype.emitCodePoint = function(u) {
          this.baseState !== s.Text && this.baseState !== s.InSpecialTag ? this.cbs.onattribentity(u) : this.cbs.ontextentity(u);
        }, t;
      }()
    );
    e.default = h;
  }(ft)), ft;
}
var mu;
function gu() {
  if (mu) return xe;
  mu = 1;
  var e = xe && xe.__createBinding || (Object.create ? function(y, d, g, w) {
    w === void 0 && (w = g);
    var x = Object.getOwnPropertyDescriptor(d, g);
    (!x || ("get" in x ? !d.__esModule : x.writable || x.configurable)) && (x = { enumerable: !0, get: function() {
      return d[g];
    } }), Object.defineProperty(y, w, x);
  } : function(y, d, g, w) {
    w === void 0 && (w = g), y[w] = d[g];
  }), r = xe && xe.__setModuleDefault || (Object.create ? function(y, d) {
    Object.defineProperty(y, "default", { enumerable: !0, value: d });
  } : function(y, d) {
    y.default = d;
  }), i = xe && xe.__importStar || function(y) {
    if (y && y.__esModule) return y;
    var d = {};
    if (y != null) for (var g in y) g !== "default" && Object.prototype.hasOwnProperty.call(y, g) && e(d, y, g);
    return r(d, y), d;
  };
  Object.defineProperty(xe, "__esModule", { value: !0 }), xe.Parser = void 0;
  var s = i(/* @__PURE__ */ Sr()), o = /* @__PURE__ */ ut(), f = /* @__PURE__ */ new Set([
    "input",
    "option",
    "optgroup",
    "select",
    "button",
    "datalist",
    "textarea"
  ]), n = /* @__PURE__ */ new Set(["p"]), c = /* @__PURE__ */ new Set(["thead", "tbody"]), p = /* @__PURE__ */ new Set(["dd", "dt"]), a = /* @__PURE__ */ new Set(["rt", "rp"]), l = /* @__PURE__ */ new Map([
    ["tr", /* @__PURE__ */ new Set(["tr", "th", "td"])],
    ["th", /* @__PURE__ */ new Set(["th"])],
    ["td", /* @__PURE__ */ new Set(["thead", "th", "td"])],
    ["body", /* @__PURE__ */ new Set(["head", "link", "script"])],
    ["li", /* @__PURE__ */ new Set(["li"])],
    ["p", n],
    ["h1", n],
    ["h2", n],
    ["h3", n],
    ["h4", n],
    ["h5", n],
    ["h6", n],
    ["select", f],
    ["input", f],
    ["output", f],
    ["button", f],
    ["datalist", f],
    ["textarea", f],
    ["option", /* @__PURE__ */ new Set(["option"])],
    ["optgroup", /* @__PURE__ */ new Set(["optgroup", "option"])],
    ["dd", p],
    ["dt", p],
    ["address", n],
    ["article", n],
    ["aside", n],
    ["blockquote", n],
    ["details", n],
    ["div", n],
    ["dl", n],
    ["fieldset", n],
    ["figcaption", n],
    ["figure", n],
    ["footer", n],
    ["form", n],
    ["header", n],
    ["hr", n],
    ["main", n],
    ["nav", n],
    ["ol", n],
    ["pre", n],
    ["section", n],
    ["table", n],
    ["ul", n],
    ["rt", a],
    ["rp", a],
    ["tbody", c],
    ["tfoot", c]
  ]), h = /* @__PURE__ */ new Set([
    "area",
    "base",
    "basefont",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "img",
    "input",
    "isindex",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ]), t = /* @__PURE__ */ new Set(["math", "svg"]), u = /* @__PURE__ */ new Set([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext",
    "annotation-xml",
    "foreignobject",
    "desc",
    "title"
  ]), m = /\s|\//, v = (
    /** @class */
    function() {
      function y(d, g) {
        g === void 0 && (g = {});
        var w, x, b, S, E;
        this.options = g, this.startIndex = 0, this.endIndex = 0, this.openTagStart = 0, this.tagname = "", this.attribname = "", this.attribvalue = "", this.attribs = null, this.stack = [], this.foreignContext = [], this.buffers = [], this.bufferOffset = 0, this.writeIndex = 0, this.ended = !1, this.cbs = d ?? {}, this.lowerCaseTagNames = (w = g.lowerCaseTags) !== null && w !== void 0 ? w : !g.xmlMode, this.lowerCaseAttributeNames = (x = g.lowerCaseAttributeNames) !== null && x !== void 0 ? x : !g.xmlMode, this.tokenizer = new ((b = g.Tokenizer) !== null && b !== void 0 ? b : s.default)(this.options, this), (E = (S = this.cbs).onparserinit) === null || E === void 0 || E.call(S, this);
      }
      return y.prototype.ontext = function(d, g) {
        var w, x, b = this.getSlice(d, g);
        this.endIndex = g - 1, (x = (w = this.cbs).ontext) === null || x === void 0 || x.call(w, b), this.startIndex = g;
      }, y.prototype.ontextentity = function(d) {
        var g, w, x = this.tokenizer.getSectionStart();
        this.endIndex = x - 1, (w = (g = this.cbs).ontext) === null || w === void 0 || w.call(g, (0, o.fromCodePoint)(d)), this.startIndex = x;
      }, y.prototype.isVoidElement = function(d) {
        return !this.options.xmlMode && h.has(d);
      }, y.prototype.onopentagname = function(d, g) {
        this.endIndex = g;
        var w = this.getSlice(d, g);
        this.lowerCaseTagNames && (w = w.toLowerCase()), this.emitOpenTag(w);
      }, y.prototype.emitOpenTag = function(d) {
        var g, w, x, b;
        this.openTagStart = this.startIndex, this.tagname = d;
        var S = !this.options.xmlMode && l.get(d);
        if (S)
          for (; this.stack.length > 0 && S.has(this.stack[this.stack.length - 1]); ) {
            var E = this.stack.pop();
            (w = (g = this.cbs).onclosetag) === null || w === void 0 || w.call(g, E, !0);
          }
        this.isVoidElement(d) || (this.stack.push(d), t.has(d) ? this.foreignContext.push(!0) : u.has(d) && this.foreignContext.push(!1)), (b = (x = this.cbs).onopentagname) === null || b === void 0 || b.call(x, d), this.cbs.onopentag && (this.attribs = {});
      }, y.prototype.endOpenTag = function(d) {
        var g, w;
        this.startIndex = this.openTagStart, this.attribs && ((w = (g = this.cbs).onopentag) === null || w === void 0 || w.call(g, this.tagname, this.attribs, d), this.attribs = null), this.cbs.onclosetag && this.isVoidElement(this.tagname) && this.cbs.onclosetag(this.tagname, !0), this.tagname = "";
      }, y.prototype.onopentagend = function(d) {
        this.endIndex = d, this.endOpenTag(!1), this.startIndex = d + 1;
      }, y.prototype.onclosetag = function(d, g) {
        var w, x, b, S, E, k;
        this.endIndex = g;
        var O = this.getSlice(d, g);
        if (this.lowerCaseTagNames && (O = O.toLowerCase()), (t.has(O) || u.has(O)) && this.foreignContext.pop(), this.isVoidElement(O))
          !this.options.xmlMode && O === "br" && ((x = (w = this.cbs).onopentagname) === null || x === void 0 || x.call(w, "br"), (S = (b = this.cbs).onopentag) === null || S === void 0 || S.call(b, "br", {}, !0), (k = (E = this.cbs).onclosetag) === null || k === void 0 || k.call(E, "br", !1));
        else {
          var P = this.stack.lastIndexOf(O);
          if (P !== -1)
            if (this.cbs.onclosetag)
              for (var A = this.stack.length - P; A--; )
                this.cbs.onclosetag(this.stack.pop(), A !== 0);
            else
              this.stack.length = P;
          else !this.options.xmlMode && O === "p" && (this.emitOpenTag("p"), this.closeCurrentTag(!0));
        }
        this.startIndex = g + 1;
      }, y.prototype.onselfclosingtag = function(d) {
        this.endIndex = d, this.options.xmlMode || this.options.recognizeSelfClosing || this.foreignContext[this.foreignContext.length - 1] ? (this.closeCurrentTag(!1), this.startIndex = d + 1) : this.onopentagend(d);
      }, y.prototype.closeCurrentTag = function(d) {
        var g, w, x = this.tagname;
        this.endOpenTag(d), this.stack[this.stack.length - 1] === x && ((w = (g = this.cbs).onclosetag) === null || w === void 0 || w.call(g, x, !d), this.stack.pop());
      }, y.prototype.onattribname = function(d, g) {
        this.startIndex = d;
        var w = this.getSlice(d, g);
        this.attribname = this.lowerCaseAttributeNames ? w.toLowerCase() : w;
      }, y.prototype.onattribdata = function(d, g) {
        this.attribvalue += this.getSlice(d, g);
      }, y.prototype.onattribentity = function(d) {
        this.attribvalue += (0, o.fromCodePoint)(d);
      }, y.prototype.onattribend = function(d, g) {
        var w, x;
        this.endIndex = g, (x = (w = this.cbs).onattribute) === null || x === void 0 || x.call(w, this.attribname, this.attribvalue, d === s.QuoteType.Double ? '"' : d === s.QuoteType.Single ? "'" : d === s.QuoteType.NoValue ? void 0 : null), this.attribs && !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname) && (this.attribs[this.attribname] = this.attribvalue), this.attribvalue = "";
      }, y.prototype.getInstructionName = function(d) {
        var g = d.search(m), w = g < 0 ? d : d.substr(0, g);
        return this.lowerCaseTagNames && (w = w.toLowerCase()), w;
      }, y.prototype.ondeclaration = function(d, g) {
        this.endIndex = g;
        var w = this.getSlice(d, g);
        if (this.cbs.onprocessinginstruction) {
          var x = this.getInstructionName(w);
          this.cbs.onprocessinginstruction("!".concat(x), "!".concat(w));
        }
        this.startIndex = g + 1;
      }, y.prototype.onprocessinginstruction = function(d, g) {
        this.endIndex = g;
        var w = this.getSlice(d, g);
        if (this.cbs.onprocessinginstruction) {
          var x = this.getInstructionName(w);
          this.cbs.onprocessinginstruction("?".concat(x), "?".concat(w));
        }
        this.startIndex = g + 1;
      }, y.prototype.oncomment = function(d, g, w) {
        var x, b, S, E;
        this.endIndex = g, (b = (x = this.cbs).oncomment) === null || b === void 0 || b.call(x, this.getSlice(d, g - w)), (E = (S = this.cbs).oncommentend) === null || E === void 0 || E.call(S), this.startIndex = g + 1;
      }, y.prototype.oncdata = function(d, g, w) {
        var x, b, S, E, k, O, P, A, T, L;
        this.endIndex = g;
        var M = this.getSlice(d, g - w);
        this.options.xmlMode || this.options.recognizeCDATA ? ((b = (x = this.cbs).oncdatastart) === null || b === void 0 || b.call(x), (E = (S = this.cbs).ontext) === null || E === void 0 || E.call(S, M), (O = (k = this.cbs).oncdataend) === null || O === void 0 || O.call(k)) : ((A = (P = this.cbs).oncomment) === null || A === void 0 || A.call(P, "[CDATA[".concat(M, "]]")), (L = (T = this.cbs).oncommentend) === null || L === void 0 || L.call(T)), this.startIndex = g + 1;
      }, y.prototype.onend = function() {
        var d, g;
        if (this.cbs.onclosetag) {
          this.endIndex = this.startIndex;
          for (var w = this.stack.length; w > 0; this.cbs.onclosetag(this.stack[--w], !0))
            ;
        }
        (g = (d = this.cbs).onend) === null || g === void 0 || g.call(d);
      }, y.prototype.reset = function() {
        var d, g, w, x;
        (g = (d = this.cbs).onreset) === null || g === void 0 || g.call(d), this.tokenizer.reset(), this.tagname = "", this.attribname = "", this.attribs = null, this.stack.length = 0, this.startIndex = 0, this.endIndex = 0, (x = (w = this.cbs).onparserinit) === null || x === void 0 || x.call(w, this), this.buffers.length = 0, this.bufferOffset = 0, this.writeIndex = 0, this.ended = !1;
      }, y.prototype.parseComplete = function(d) {
        this.reset(), this.end(d);
      }, y.prototype.getSlice = function(d, g) {
        for (; d - this.bufferOffset >= this.buffers[0].length; )
          this.shiftBuffer();
        for (var w = this.buffers[0].slice(d - this.bufferOffset, g - this.bufferOffset); g - this.bufferOffset > this.buffers[0].length; )
          this.shiftBuffer(), w += this.buffers[0].slice(0, g - this.bufferOffset);
        return w;
      }, y.prototype.shiftBuffer = function() {
        this.bufferOffset += this.buffers[0].length, this.writeIndex--, this.buffers.shift();
      }, y.prototype.write = function(d) {
        var g, w;
        if (this.ended) {
          (w = (g = this.cbs).onerror) === null || w === void 0 || w.call(g, new Error(".write() after done!"));
          return;
        }
        this.buffers.push(d), this.tokenizer.running && (this.tokenizer.write(d), this.writeIndex++);
      }, y.prototype.end = function(d) {
        var g, w;
        if (this.ended) {
          (w = (g = this.cbs).onerror) === null || w === void 0 || w.call(g, new Error(".end() after done!"));
          return;
        }
        d && this.write(d), this.ended = !0, this.tokenizer.end();
      }, y.prototype.pause = function() {
        this.tokenizer.pause();
      }, y.prototype.resume = function() {
        for (this.tokenizer.resume(); this.tokenizer.running && this.writeIndex < this.buffers.length; )
          this.tokenizer.write(this.buffers[this.writeIndex++]);
        this.ended && this.tokenizer.end();
      }, y.prototype.parseChunk = function(d) {
        this.write(d);
      }, y.prototype.done = function(d) {
        this.end(d);
      }, y;
    }()
  );
  return xe.Parser = v, xe;
}
var Ie = {}, pt = {}, yu;
function ze() {
  return yu || (yu = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.Doctype = e.CDATA = e.Tag = e.Style = e.Script = e.Comment = e.Directive = e.Text = e.Root = e.isTag = e.ElementType = void 0;
    var r;
    (function(s) {
      s.Root = "root", s.Text = "text", s.Directive = "directive", s.Comment = "comment", s.Script = "script", s.Style = "style", s.Tag = "tag", s.CDATA = "cdata", s.Doctype = "doctype";
    })(r = e.ElementType || (e.ElementType = {}));
    function i(s) {
      return s.type === r.Tag || s.type === r.Script || s.type === r.Style;
    }
    e.isTag = i, e.Root = r.Root, e.Text = r.Text, e.Directive = r.Directive, e.Comment = r.Comment, e.Script = r.Script, e.Style = r.Style, e.Tag = r.Tag, e.CDATA = r.CDATA, e.Doctype = r.Doctype;
  }(pt)), pt;
}
var F = {}, vu;
function wu() {
  if (vu) return F;
  vu = 1;
  var e = F && F.__extends || /* @__PURE__ */ function() {
    var b = function(S, E) {
      return b = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(k, O) {
        k.__proto__ = O;
      } || function(k, O) {
        for (var P in O) Object.prototype.hasOwnProperty.call(O, P) && (k[P] = O[P]);
      }, b(S, E);
    };
    return function(S, E) {
      if (typeof E != "function" && E !== null)
        throw new TypeError("Class extends value " + String(E) + " is not a constructor or null");
      b(S, E);
      function k() {
        this.constructor = S;
      }
      S.prototype = E === null ? Object.create(E) : (k.prototype = E.prototype, new k());
    };
  }(), r = F && F.__assign || function() {
    return r = Object.assign || function(b) {
      for (var S, E = 1, k = arguments.length; E < k; E++) {
        S = arguments[E];
        for (var O in S) Object.prototype.hasOwnProperty.call(S, O) && (b[O] = S[O]);
      }
      return b;
    }, r.apply(this, arguments);
  };
  Object.defineProperty(F, "__esModule", { value: !0 }), F.cloneNode = F.hasChildren = F.isDocument = F.isDirective = F.isComment = F.isText = F.isCDATA = F.isTag = F.Element = F.Document = F.CDATA = F.NodeWithChildren = F.ProcessingInstruction = F.Comment = F.Text = F.DataNode = F.Node = void 0;
  var i = /* @__PURE__ */ ze(), s = (
    /** @class */
    function() {
      function b() {
        this.parent = null, this.prev = null, this.next = null, this.startIndex = null, this.endIndex = null;
      }
      return Object.defineProperty(b.prototype, "parentNode", {
        // Read-write aliases for properties
        /**
         * Same as {@link parent}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.parent;
        },
        set: function(S) {
          this.parent = S;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(b.prototype, "previousSibling", {
        /**
         * Same as {@link prev}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.prev;
        },
        set: function(S) {
          this.prev = S;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(b.prototype, "nextSibling", {
        /**
         * Same as {@link next}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.next;
        },
        set: function(S) {
          this.next = S;
        },
        enumerable: !1,
        configurable: !0
      }), b.prototype.cloneNode = function(S) {
        return S === void 0 && (S = !1), w(this, S);
      }, b;
    }()
  );
  F.Node = s;
  var o = (
    /** @class */
    function(b) {
      e(S, b);
      function S(E) {
        var k = b.call(this) || this;
        return k.data = E, k;
      }
      return Object.defineProperty(S.prototype, "nodeValue", {
        /**
         * Same as {@link data}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.data;
        },
        set: function(E) {
          this.data = E;
        },
        enumerable: !1,
        configurable: !0
      }), S;
    }(s)
  );
  F.DataNode = o;
  var f = (
    /** @class */
    function(b) {
      e(S, b);
      function S() {
        var E = b !== null && b.apply(this, arguments) || this;
        return E.type = i.ElementType.Text, E;
      }
      return Object.defineProperty(S.prototype, "nodeType", {
        get: function() {
          return 3;
        },
        enumerable: !1,
        configurable: !0
      }), S;
    }(o)
  );
  F.Text = f;
  var n = (
    /** @class */
    function(b) {
      e(S, b);
      function S() {
        var E = b !== null && b.apply(this, arguments) || this;
        return E.type = i.ElementType.Comment, E;
      }
      return Object.defineProperty(S.prototype, "nodeType", {
        get: function() {
          return 8;
        },
        enumerable: !1,
        configurable: !0
      }), S;
    }(o)
  );
  F.Comment = n;
  var c = (
    /** @class */
    function(b) {
      e(S, b);
      function S(E, k) {
        var O = b.call(this, k) || this;
        return O.name = E, O.type = i.ElementType.Directive, O;
      }
      return Object.defineProperty(S.prototype, "nodeType", {
        get: function() {
          return 1;
        },
        enumerable: !1,
        configurable: !0
      }), S;
    }(o)
  );
  F.ProcessingInstruction = c;
  var p = (
    /** @class */
    function(b) {
      e(S, b);
      function S(E) {
        var k = b.call(this) || this;
        return k.children = E, k;
      }
      return Object.defineProperty(S.prototype, "firstChild", {
        // Aliases
        /** First child of the node. */
        get: function() {
          var E;
          return (E = this.children[0]) !== null && E !== void 0 ? E : null;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(S.prototype, "lastChild", {
        /** Last child of the node. */
        get: function() {
          return this.children.length > 0 ? this.children[this.children.length - 1] : null;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(S.prototype, "childNodes", {
        /**
         * Same as {@link children}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.children;
        },
        set: function(E) {
          this.children = E;
        },
        enumerable: !1,
        configurable: !0
      }), S;
    }(s)
  );
  F.NodeWithChildren = p;
  var a = (
    /** @class */
    function(b) {
      e(S, b);
      function S() {
        var E = b !== null && b.apply(this, arguments) || this;
        return E.type = i.ElementType.CDATA, E;
      }
      return Object.defineProperty(S.prototype, "nodeType", {
        get: function() {
          return 4;
        },
        enumerable: !1,
        configurable: !0
      }), S;
    }(p)
  );
  F.CDATA = a;
  var l = (
    /** @class */
    function(b) {
      e(S, b);
      function S() {
        var E = b !== null && b.apply(this, arguments) || this;
        return E.type = i.ElementType.Root, E;
      }
      return Object.defineProperty(S.prototype, "nodeType", {
        get: function() {
          return 9;
        },
        enumerable: !1,
        configurable: !0
      }), S;
    }(p)
  );
  F.Document = l;
  var h = (
    /** @class */
    function(b) {
      e(S, b);
      function S(E, k, O, P) {
        O === void 0 && (O = []), P === void 0 && (P = E === "script" ? i.ElementType.Script : E === "style" ? i.ElementType.Style : i.ElementType.Tag);
        var A = b.call(this, O) || this;
        return A.name = E, A.attribs = k, A.type = P, A;
      }
      return Object.defineProperty(S.prototype, "nodeType", {
        get: function() {
          return 1;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(S.prototype, "tagName", {
        // DOM Level 1 aliases
        /**
         * Same as {@link name}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.name;
        },
        set: function(E) {
          this.name = E;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(S.prototype, "attributes", {
        get: function() {
          var E = this;
          return Object.keys(this.attribs).map(function(k) {
            var O, P;
            return {
              name: k,
              value: E.attribs[k],
              namespace: (O = E["x-attribsNamespace"]) === null || O === void 0 ? void 0 : O[k],
              prefix: (P = E["x-attribsPrefix"]) === null || P === void 0 ? void 0 : P[k]
            };
          });
        },
        enumerable: !1,
        configurable: !0
      }), S;
    }(p)
  );
  F.Element = h;
  function t(b) {
    return (0, i.isTag)(b);
  }
  F.isTag = t;
  function u(b) {
    return b.type === i.ElementType.CDATA;
  }
  F.isCDATA = u;
  function m(b) {
    return b.type === i.ElementType.Text;
  }
  F.isText = m;
  function v(b) {
    return b.type === i.ElementType.Comment;
  }
  F.isComment = v;
  function y(b) {
    return b.type === i.ElementType.Directive;
  }
  F.isDirective = y;
  function d(b) {
    return b.type === i.ElementType.Root;
  }
  F.isDocument = d;
  function g(b) {
    return Object.prototype.hasOwnProperty.call(b, "children");
  }
  F.hasChildren = g;
  function w(b, S) {
    S === void 0 && (S = !1);
    var E;
    if (m(b))
      E = new f(b.data);
    else if (v(b))
      E = new n(b.data);
    else if (t(b)) {
      var k = S ? x(b.children) : [], O = new h(b.name, r({}, b.attribs), k);
      k.forEach(function(L) {
        return L.parent = O;
      }), b.namespace != null && (O.namespace = b.namespace), b["x-attribsNamespace"] && (O["x-attribsNamespace"] = r({}, b["x-attribsNamespace"])), b["x-attribsPrefix"] && (O["x-attribsPrefix"] = r({}, b["x-attribsPrefix"])), E = O;
    } else if (u(b)) {
      var k = S ? x(b.children) : [], P = new a(k);
      k.forEach(function(M) {
        return M.parent = P;
      }), E = P;
    } else if (d(b)) {
      var k = S ? x(b.children) : [], A = new l(k);
      k.forEach(function(M) {
        return M.parent = A;
      }), b["x-mode"] && (A["x-mode"] = b["x-mode"]), E = A;
    } else if (y(b)) {
      var T = new c(b.name, b.data);
      b["x-name"] != null && (T["x-name"] = b["x-name"], T["x-publicId"] = b["x-publicId"], T["x-systemId"] = b["x-systemId"]), E = T;
    } else
      throw new Error("Not implemented yet: ".concat(b.type));
    return E.startIndex = b.startIndex, E.endIndex = b.endIndex, b.sourceCodeLocation != null && (E.sourceCodeLocation = b.sourceCodeLocation), E;
  }
  F.cloneNode = w;
  function x(b) {
    for (var S = b.map(function(k) {
      return w(k, !0);
    }), E = 1; E < S.length; E++)
      S[E].prev = S[E - 1], S[E - 1].next = S[E];
    return S;
  }
  return F;
}
var Su;
function Oe() {
  return Su || (Su = 1, function(e) {
    var r = Ie && Ie.__createBinding || (Object.create ? function(c, p, a, l) {
      l === void 0 && (l = a);
      var h = Object.getOwnPropertyDescriptor(p, a);
      (!h || ("get" in h ? !p.__esModule : h.writable || h.configurable)) && (h = { enumerable: !0, get: function() {
        return p[a];
      } }), Object.defineProperty(c, l, h);
    } : function(c, p, a, l) {
      l === void 0 && (l = a), c[l] = p[a];
    }), i = Ie && Ie.__exportStar || function(c, p) {
      for (var a in c) a !== "default" && !Object.prototype.hasOwnProperty.call(p, a) && r(p, c, a);
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.DomHandler = void 0;
    var s = /* @__PURE__ */ ze(), o = /* @__PURE__ */ wu();
    i(/* @__PURE__ */ wu(), e);
    var f = {
      withStartIndices: !1,
      withEndIndices: !1,
      xmlMode: !1
    }, n = (
      /** @class */
      function() {
        function c(p, a, l) {
          this.dom = [], this.root = new o.Document(this.dom), this.done = !1, this.tagStack = [this.root], this.lastNode = null, this.parser = null, typeof a == "function" && (l = a, a = f), typeof p == "object" && (a = p, p = void 0), this.callback = p ?? null, this.options = a ?? f, this.elementCB = l ?? null;
        }
        return c.prototype.onparserinit = function(p) {
          this.parser = p;
        }, c.prototype.onreset = function() {
          this.dom = [], this.root = new o.Document(this.dom), this.done = !1, this.tagStack = [this.root], this.lastNode = null, this.parser = null;
        }, c.prototype.onend = function() {
          this.done || (this.done = !0, this.parser = null, this.handleCallback(null));
        }, c.prototype.onerror = function(p) {
          this.handleCallback(p);
        }, c.prototype.onclosetag = function() {
          this.lastNode = null;
          var p = this.tagStack.pop();
          this.options.withEndIndices && (p.endIndex = this.parser.endIndex), this.elementCB && this.elementCB(p);
        }, c.prototype.onopentag = function(p, a) {
          var l = this.options.xmlMode ? s.ElementType.Tag : void 0, h = new o.Element(p, a, void 0, l);
          this.addNode(h), this.tagStack.push(h);
        }, c.prototype.ontext = function(p) {
          var a = this.lastNode;
          if (a && a.type === s.ElementType.Text)
            a.data += p, this.options.withEndIndices && (a.endIndex = this.parser.endIndex);
          else {
            var l = new o.Text(p);
            this.addNode(l), this.lastNode = l;
          }
        }, c.prototype.oncomment = function(p) {
          if (this.lastNode && this.lastNode.type === s.ElementType.Comment) {
            this.lastNode.data += p;
            return;
          }
          var a = new o.Comment(p);
          this.addNode(a), this.lastNode = a;
        }, c.prototype.oncommentend = function() {
          this.lastNode = null;
        }, c.prototype.oncdatastart = function() {
          var p = new o.Text(""), a = new o.CDATA([p]);
          this.addNode(a), p.parent = a, this.lastNode = p;
        }, c.prototype.oncdataend = function() {
          this.lastNode = null;
        }, c.prototype.onprocessinginstruction = function(p, a) {
          var l = new o.ProcessingInstruction(p, a);
          this.addNode(l);
        }, c.prototype.handleCallback = function(p) {
          if (typeof this.callback == "function")
            this.callback(p, this.dom);
          else if (p)
            throw p;
        }, c.prototype.addNode = function(p) {
          var a = this.tagStack[this.tagStack.length - 1], l = a.children[a.children.length - 1];
          this.options.withStartIndices && (p.startIndex = this.parser.startIndex), this.options.withEndIndices && (p.endIndex = this.parser.endIndex), a.children.push(p), l && (p.prev = l, l.next = p), p.parent = a, this.lastNode = null;
        }, c;
      }()
    );
    e.DomHandler = n, e.default = n;
  }(Ie)), Ie;
}
var Ne = {}, fe = {}, me = {}, bt = {}, Ce = {}, Xe = {}, xu;
function Ni() {
  if (xu) return Xe;
  xu = 1, Object.defineProperty(Xe, "__esModule", { value: !0 });
  function e(r) {
    for (var i = 1; i < r.length; i++)
      r[i][0] += r[i - 1][0] + 1;
    return r;
  }
  return Xe.default = new Map(/* @__PURE__ */ e([[9, "&Tab;"], [0, "&NewLine;"], [22, "&excl;"], [0, "&quot;"], [0, "&num;"], [0, "&dollar;"], [0, "&percnt;"], [0, "&amp;"], [0, "&apos;"], [0, "&lpar;"], [0, "&rpar;"], [0, "&ast;"], [0, "&plus;"], [0, "&comma;"], [1, "&period;"], [0, "&sol;"], [10, "&colon;"], [0, "&semi;"], [0, { v: "&lt;", n: 8402, o: "&nvlt;" }], [0, { v: "&equals;", n: 8421, o: "&bne;" }], [0, { v: "&gt;", n: 8402, o: "&nvgt;" }], [0, "&quest;"], [0, "&commat;"], [26, "&lbrack;"], [0, "&bsol;"], [0, "&rbrack;"], [0, "&Hat;"], [0, "&lowbar;"], [0, "&DiacriticalGrave;"], [5, { n: 106, o: "&fjlig;" }], [20, "&lbrace;"], [0, "&verbar;"], [0, "&rbrace;"], [34, "&nbsp;"], [0, "&iexcl;"], [0, "&cent;"], [0, "&pound;"], [0, "&curren;"], [0, "&yen;"], [0, "&brvbar;"], [0, "&sect;"], [0, "&die;"], [0, "&copy;"], [0, "&ordf;"], [0, "&laquo;"], [0, "&not;"], [0, "&shy;"], [0, "&circledR;"], [0, "&macr;"], [0, "&deg;"], [0, "&PlusMinus;"], [0, "&sup2;"], [0, "&sup3;"], [0, "&acute;"], [0, "&micro;"], [0, "&para;"], [0, "&centerdot;"], [0, "&cedil;"], [0, "&sup1;"], [0, "&ordm;"], [0, "&raquo;"], [0, "&frac14;"], [0, "&frac12;"], [0, "&frac34;"], [0, "&iquest;"], [0, "&Agrave;"], [0, "&Aacute;"], [0, "&Acirc;"], [0, "&Atilde;"], [0, "&Auml;"], [0, "&angst;"], [0, "&AElig;"], [0, "&Ccedil;"], [0, "&Egrave;"], [0, "&Eacute;"], [0, "&Ecirc;"], [0, "&Euml;"], [0, "&Igrave;"], [0, "&Iacute;"], [0, "&Icirc;"], [0, "&Iuml;"], [0, "&ETH;"], [0, "&Ntilde;"], [0, "&Ograve;"], [0, "&Oacute;"], [0, "&Ocirc;"], [0, "&Otilde;"], [0, "&Ouml;"], [0, "&times;"], [0, "&Oslash;"], [0, "&Ugrave;"], [0, "&Uacute;"], [0, "&Ucirc;"], [0, "&Uuml;"], [0, "&Yacute;"], [0, "&THORN;"], [0, "&szlig;"], [0, "&agrave;"], [0, "&aacute;"], [0, "&acirc;"], [0, "&atilde;"], [0, "&auml;"], [0, "&aring;"], [0, "&aelig;"], [0, "&ccedil;"], [0, "&egrave;"], [0, "&eacute;"], [0, "&ecirc;"], [0, "&euml;"], [0, "&igrave;"], [0, "&iacute;"], [0, "&icirc;"], [0, "&iuml;"], [0, "&eth;"], [0, "&ntilde;"], [0, "&ograve;"], [0, "&oacute;"], [0, "&ocirc;"], [0, "&otilde;"], [0, "&ouml;"], [0, "&div;"], [0, "&oslash;"], [0, "&ugrave;"], [0, "&uacute;"], [0, "&ucirc;"], [0, "&uuml;"], [0, "&yacute;"], [0, "&thorn;"], [0, "&yuml;"], [0, "&Amacr;"], [0, "&amacr;"], [0, "&Abreve;"], [0, "&abreve;"], [0, "&Aogon;"], [0, "&aogon;"], [0, "&Cacute;"], [0, "&cacute;"], [0, "&Ccirc;"], [0, "&ccirc;"], [0, "&Cdot;"], [0, "&cdot;"], [0, "&Ccaron;"], [0, "&ccaron;"], [0, "&Dcaron;"], [0, "&dcaron;"], [0, "&Dstrok;"], [0, "&dstrok;"], [0, "&Emacr;"], [0, "&emacr;"], [2, "&Edot;"], [0, "&edot;"], [0, "&Eogon;"], [0, "&eogon;"], [0, "&Ecaron;"], [0, "&ecaron;"], [0, "&Gcirc;"], [0, "&gcirc;"], [0, "&Gbreve;"], [0, "&gbreve;"], [0, "&Gdot;"], [0, "&gdot;"], [0, "&Gcedil;"], [1, "&Hcirc;"], [0, "&hcirc;"], [0, "&Hstrok;"], [0, "&hstrok;"], [0, "&Itilde;"], [0, "&itilde;"], [0, "&Imacr;"], [0, "&imacr;"], [2, "&Iogon;"], [0, "&iogon;"], [0, "&Idot;"], [0, "&imath;"], [0, "&IJlig;"], [0, "&ijlig;"], [0, "&Jcirc;"], [0, "&jcirc;"], [0, "&Kcedil;"], [0, "&kcedil;"], [0, "&kgreen;"], [0, "&Lacute;"], [0, "&lacute;"], [0, "&Lcedil;"], [0, "&lcedil;"], [0, "&Lcaron;"], [0, "&lcaron;"], [0, "&Lmidot;"], [0, "&lmidot;"], [0, "&Lstrok;"], [0, "&lstrok;"], [0, "&Nacute;"], [0, "&nacute;"], [0, "&Ncedil;"], [0, "&ncedil;"], [0, "&Ncaron;"], [0, "&ncaron;"], [0, "&napos;"], [0, "&ENG;"], [0, "&eng;"], [0, "&Omacr;"], [0, "&omacr;"], [2, "&Odblac;"], [0, "&odblac;"], [0, "&OElig;"], [0, "&oelig;"], [0, "&Racute;"], [0, "&racute;"], [0, "&Rcedil;"], [0, "&rcedil;"], [0, "&Rcaron;"], [0, "&rcaron;"], [0, "&Sacute;"], [0, "&sacute;"], [0, "&Scirc;"], [0, "&scirc;"], [0, "&Scedil;"], [0, "&scedil;"], [0, "&Scaron;"], [0, "&scaron;"], [0, "&Tcedil;"], [0, "&tcedil;"], [0, "&Tcaron;"], [0, "&tcaron;"], [0, "&Tstrok;"], [0, "&tstrok;"], [0, "&Utilde;"], [0, "&utilde;"], [0, "&Umacr;"], [0, "&umacr;"], [0, "&Ubreve;"], [0, "&ubreve;"], [0, "&Uring;"], [0, "&uring;"], [0, "&Udblac;"], [0, "&udblac;"], [0, "&Uogon;"], [0, "&uogon;"], [0, "&Wcirc;"], [0, "&wcirc;"], [0, "&Ycirc;"], [0, "&ycirc;"], [0, "&Yuml;"], [0, "&Zacute;"], [0, "&zacute;"], [0, "&Zdot;"], [0, "&zdot;"], [0, "&Zcaron;"], [0, "&zcaron;"], [19, "&fnof;"], [34, "&imped;"], [63, "&gacute;"], [65, "&jmath;"], [142, "&circ;"], [0, "&caron;"], [16, "&breve;"], [0, "&DiacriticalDot;"], [0, "&ring;"], [0, "&ogon;"], [0, "&DiacriticalTilde;"], [0, "&dblac;"], [51, "&DownBreve;"], [127, "&Alpha;"], [0, "&Beta;"], [0, "&Gamma;"], [0, "&Delta;"], [0, "&Epsilon;"], [0, "&Zeta;"], [0, "&Eta;"], [0, "&Theta;"], [0, "&Iota;"], [0, "&Kappa;"], [0, "&Lambda;"], [0, "&Mu;"], [0, "&Nu;"], [0, "&Xi;"], [0, "&Omicron;"], [0, "&Pi;"], [0, "&Rho;"], [1, "&Sigma;"], [0, "&Tau;"], [0, "&Upsilon;"], [0, "&Phi;"], [0, "&Chi;"], [0, "&Psi;"], [0, "&ohm;"], [7, "&alpha;"], [0, "&beta;"], [0, "&gamma;"], [0, "&delta;"], [0, "&epsi;"], [0, "&zeta;"], [0, "&eta;"], [0, "&theta;"], [0, "&iota;"], [0, "&kappa;"], [0, "&lambda;"], [0, "&mu;"], [0, "&nu;"], [0, "&xi;"], [0, "&omicron;"], [0, "&pi;"], [0, "&rho;"], [0, "&sigmaf;"], [0, "&sigma;"], [0, "&tau;"], [0, "&upsi;"], [0, "&phi;"], [0, "&chi;"], [0, "&psi;"], [0, "&omega;"], [7, "&thetasym;"], [0, "&Upsi;"], [2, "&phiv;"], [0, "&piv;"], [5, "&Gammad;"], [0, "&digamma;"], [18, "&kappav;"], [0, "&rhov;"], [3, "&epsiv;"], [0, "&backepsilon;"], [10, "&IOcy;"], [0, "&DJcy;"], [0, "&GJcy;"], [0, "&Jukcy;"], [0, "&DScy;"], [0, "&Iukcy;"], [0, "&YIcy;"], [0, "&Jsercy;"], [0, "&LJcy;"], [0, "&NJcy;"], [0, "&TSHcy;"], [0, "&KJcy;"], [1, "&Ubrcy;"], [0, "&DZcy;"], [0, "&Acy;"], [0, "&Bcy;"], [0, "&Vcy;"], [0, "&Gcy;"], [0, "&Dcy;"], [0, "&IEcy;"], [0, "&ZHcy;"], [0, "&Zcy;"], [0, "&Icy;"], [0, "&Jcy;"], [0, "&Kcy;"], [0, "&Lcy;"], [0, "&Mcy;"], [0, "&Ncy;"], [0, "&Ocy;"], [0, "&Pcy;"], [0, "&Rcy;"], [0, "&Scy;"], [0, "&Tcy;"], [0, "&Ucy;"], [0, "&Fcy;"], [0, "&KHcy;"], [0, "&TScy;"], [0, "&CHcy;"], [0, "&SHcy;"], [0, "&SHCHcy;"], [0, "&HARDcy;"], [0, "&Ycy;"], [0, "&SOFTcy;"], [0, "&Ecy;"], [0, "&YUcy;"], [0, "&YAcy;"], [0, "&acy;"], [0, "&bcy;"], [0, "&vcy;"], [0, "&gcy;"], [0, "&dcy;"], [0, "&iecy;"], [0, "&zhcy;"], [0, "&zcy;"], [0, "&icy;"], [0, "&jcy;"], [0, "&kcy;"], [0, "&lcy;"], [0, "&mcy;"], [0, "&ncy;"], [0, "&ocy;"], [0, "&pcy;"], [0, "&rcy;"], [0, "&scy;"], [0, "&tcy;"], [0, "&ucy;"], [0, "&fcy;"], [0, "&khcy;"], [0, "&tscy;"], [0, "&chcy;"], [0, "&shcy;"], [0, "&shchcy;"], [0, "&hardcy;"], [0, "&ycy;"], [0, "&softcy;"], [0, "&ecy;"], [0, "&yucy;"], [0, "&yacy;"], [1, "&iocy;"], [0, "&djcy;"], [0, "&gjcy;"], [0, "&jukcy;"], [0, "&dscy;"], [0, "&iukcy;"], [0, "&yicy;"], [0, "&jsercy;"], [0, "&ljcy;"], [0, "&njcy;"], [0, "&tshcy;"], [0, "&kjcy;"], [1, "&ubrcy;"], [0, "&dzcy;"], [7074, "&ensp;"], [0, "&emsp;"], [0, "&emsp13;"], [0, "&emsp14;"], [1, "&numsp;"], [0, "&puncsp;"], [0, "&ThinSpace;"], [0, "&hairsp;"], [0, "&NegativeMediumSpace;"], [0, "&zwnj;"], [0, "&zwj;"], [0, "&lrm;"], [0, "&rlm;"], [0, "&dash;"], [2, "&ndash;"], [0, "&mdash;"], [0, "&horbar;"], [0, "&Verbar;"], [1, "&lsquo;"], [0, "&CloseCurlyQuote;"], [0, "&lsquor;"], [1, "&ldquo;"], [0, "&CloseCurlyDoubleQuote;"], [0, "&bdquo;"], [1, "&dagger;"], [0, "&Dagger;"], [0, "&bull;"], [2, "&nldr;"], [0, "&hellip;"], [9, "&permil;"], [0, "&pertenk;"], [0, "&prime;"], [0, "&Prime;"], [0, "&tprime;"], [0, "&backprime;"], [3, "&lsaquo;"], [0, "&rsaquo;"], [3, "&oline;"], [2, "&caret;"], [1, "&hybull;"], [0, "&frasl;"], [10, "&bsemi;"], [7, "&qprime;"], [7, { v: "&MediumSpace;", n: 8202, o: "&ThickSpace;" }], [0, "&NoBreak;"], [0, "&af;"], [0, "&InvisibleTimes;"], [0, "&ic;"], [72, "&euro;"], [46, "&tdot;"], [0, "&DotDot;"], [37, "&complexes;"], [2, "&incare;"], [4, "&gscr;"], [0, "&hamilt;"], [0, "&Hfr;"], [0, "&Hopf;"], [0, "&planckh;"], [0, "&hbar;"], [0, "&imagline;"], [0, "&Ifr;"], [0, "&lagran;"], [0, "&ell;"], [1, "&naturals;"], [0, "&numero;"], [0, "&copysr;"], [0, "&weierp;"], [0, "&Popf;"], [0, "&Qopf;"], [0, "&realine;"], [0, "&real;"], [0, "&reals;"], [0, "&rx;"], [3, "&trade;"], [1, "&integers;"], [2, "&mho;"], [0, "&zeetrf;"], [0, "&iiota;"], [2, "&bernou;"], [0, "&Cayleys;"], [1, "&escr;"], [0, "&Escr;"], [0, "&Fouriertrf;"], [1, "&Mellintrf;"], [0, "&order;"], [0, "&alefsym;"], [0, "&beth;"], [0, "&gimel;"], [0, "&daleth;"], [12, "&CapitalDifferentialD;"], [0, "&dd;"], [0, "&ee;"], [0, "&ii;"], [10, "&frac13;"], [0, "&frac23;"], [0, "&frac15;"], [0, "&frac25;"], [0, "&frac35;"], [0, "&frac45;"], [0, "&frac16;"], [0, "&frac56;"], [0, "&frac18;"], [0, "&frac38;"], [0, "&frac58;"], [0, "&frac78;"], [49, "&larr;"], [0, "&ShortUpArrow;"], [0, "&rarr;"], [0, "&darr;"], [0, "&harr;"], [0, "&updownarrow;"], [0, "&nwarr;"], [0, "&nearr;"], [0, "&LowerRightArrow;"], [0, "&LowerLeftArrow;"], [0, "&nlarr;"], [0, "&nrarr;"], [1, { v: "&rarrw;", n: 824, o: "&nrarrw;" }], [0, "&Larr;"], [0, "&Uarr;"], [0, "&Rarr;"], [0, "&Darr;"], [0, "&larrtl;"], [0, "&rarrtl;"], [0, "&LeftTeeArrow;"], [0, "&mapstoup;"], [0, "&map;"], [0, "&DownTeeArrow;"], [1, "&hookleftarrow;"], [0, "&hookrightarrow;"], [0, "&larrlp;"], [0, "&looparrowright;"], [0, "&harrw;"], [0, "&nharr;"], [1, "&lsh;"], [0, "&rsh;"], [0, "&ldsh;"], [0, "&rdsh;"], [1, "&crarr;"], [0, "&cularr;"], [0, "&curarr;"], [2, "&circlearrowleft;"], [0, "&circlearrowright;"], [0, "&leftharpoonup;"], [0, "&DownLeftVector;"], [0, "&RightUpVector;"], [0, "&LeftUpVector;"], [0, "&rharu;"], [0, "&DownRightVector;"], [0, "&dharr;"], [0, "&dharl;"], [0, "&RightArrowLeftArrow;"], [0, "&udarr;"], [0, "&LeftArrowRightArrow;"], [0, "&leftleftarrows;"], [0, "&upuparrows;"], [0, "&rightrightarrows;"], [0, "&ddarr;"], [0, "&leftrightharpoons;"], [0, "&Equilibrium;"], [0, "&nlArr;"], [0, "&nhArr;"], [0, "&nrArr;"], [0, "&DoubleLeftArrow;"], [0, "&DoubleUpArrow;"], [0, "&DoubleRightArrow;"], [0, "&dArr;"], [0, "&DoubleLeftRightArrow;"], [0, "&DoubleUpDownArrow;"], [0, "&nwArr;"], [0, "&neArr;"], [0, "&seArr;"], [0, "&swArr;"], [0, "&lAarr;"], [0, "&rAarr;"], [1, "&zigrarr;"], [6, "&larrb;"], [0, "&rarrb;"], [15, "&DownArrowUpArrow;"], [7, "&loarr;"], [0, "&roarr;"], [0, "&hoarr;"], [0, "&forall;"], [0, "&comp;"], [0, { v: "&part;", n: 824, o: "&npart;" }], [0, "&exist;"], [0, "&nexist;"], [0, "&empty;"], [1, "&Del;"], [0, "&Element;"], [0, "&NotElement;"], [1, "&ni;"], [0, "&notni;"], [2, "&prod;"], [0, "&coprod;"], [0, "&sum;"], [0, "&minus;"], [0, "&MinusPlus;"], [0, "&dotplus;"], [1, "&Backslash;"], [0, "&lowast;"], [0, "&compfn;"], [1, "&radic;"], [2, "&prop;"], [0, "&infin;"], [0, "&angrt;"], [0, { v: "&ang;", n: 8402, o: "&nang;" }], [0, "&angmsd;"], [0, "&angsph;"], [0, "&mid;"], [0, "&nmid;"], [0, "&DoubleVerticalBar;"], [0, "&NotDoubleVerticalBar;"], [0, "&and;"], [0, "&or;"], [0, { v: "&cap;", n: 65024, o: "&caps;" }], [0, { v: "&cup;", n: 65024, o: "&cups;" }], [0, "&int;"], [0, "&Int;"], [0, "&iiint;"], [0, "&conint;"], [0, "&Conint;"], [0, "&Cconint;"], [0, "&cwint;"], [0, "&ClockwiseContourIntegral;"], [0, "&awconint;"], [0, "&there4;"], [0, "&becaus;"], [0, "&ratio;"], [0, "&Colon;"], [0, "&dotminus;"], [1, "&mDDot;"], [0, "&homtht;"], [0, { v: "&sim;", n: 8402, o: "&nvsim;" }], [0, { v: "&backsim;", n: 817, o: "&race;" }], [0, { v: "&ac;", n: 819, o: "&acE;" }], [0, "&acd;"], [0, "&VerticalTilde;"], [0, "&NotTilde;"], [0, { v: "&eqsim;", n: 824, o: "&nesim;" }], [0, "&sime;"], [0, "&NotTildeEqual;"], [0, "&cong;"], [0, "&simne;"], [0, "&ncong;"], [0, "&ap;"], [0, "&nap;"], [0, "&ape;"], [0, { v: "&apid;", n: 824, o: "&napid;" }], [0, "&backcong;"], [0, { v: "&asympeq;", n: 8402, o: "&nvap;" }], [0, { v: "&bump;", n: 824, o: "&nbump;" }], [0, { v: "&bumpe;", n: 824, o: "&nbumpe;" }], [0, { v: "&doteq;", n: 824, o: "&nedot;" }], [0, "&doteqdot;"], [0, "&efDot;"], [0, "&erDot;"], [0, "&Assign;"], [0, "&ecolon;"], [0, "&ecir;"], [0, "&circeq;"], [1, "&wedgeq;"], [0, "&veeeq;"], [1, "&triangleq;"], [2, "&equest;"], [0, "&ne;"], [0, { v: "&Congruent;", n: 8421, o: "&bnequiv;" }], [0, "&nequiv;"], [1, { v: "&le;", n: 8402, o: "&nvle;" }], [0, { v: "&ge;", n: 8402, o: "&nvge;" }], [0, { v: "&lE;", n: 824, o: "&nlE;" }], [0, { v: "&gE;", n: 824, o: "&ngE;" }], [0, { v: "&lnE;", n: 65024, o: "&lvertneqq;" }], [0, { v: "&gnE;", n: 65024, o: "&gvertneqq;" }], [0, { v: "&ll;", n: new Map(/* @__PURE__ */ e([[824, "&nLtv;"], [7577, "&nLt;"]])) }], [0, { v: "&gg;", n: new Map(/* @__PURE__ */ e([[824, "&nGtv;"], [7577, "&nGt;"]])) }], [0, "&between;"], [0, "&NotCupCap;"], [0, "&nless;"], [0, "&ngt;"], [0, "&nle;"], [0, "&nge;"], [0, "&lesssim;"], [0, "&GreaterTilde;"], [0, "&nlsim;"], [0, "&ngsim;"], [0, "&LessGreater;"], [0, "&gl;"], [0, "&NotLessGreater;"], [0, "&NotGreaterLess;"], [0, "&pr;"], [0, "&sc;"], [0, "&prcue;"], [0, "&sccue;"], [0, "&PrecedesTilde;"], [0, { v: "&scsim;", n: 824, o: "&NotSucceedsTilde;" }], [0, "&NotPrecedes;"], [0, "&NotSucceeds;"], [0, { v: "&sub;", n: 8402, o: "&NotSubset;" }], [0, { v: "&sup;", n: 8402, o: "&NotSuperset;" }], [0, "&nsub;"], [0, "&nsup;"], [0, "&sube;"], [0, "&supe;"], [0, "&NotSubsetEqual;"], [0, "&NotSupersetEqual;"], [0, { v: "&subne;", n: 65024, o: "&varsubsetneq;" }], [0, { v: "&supne;", n: 65024, o: "&varsupsetneq;" }], [1, "&cupdot;"], [0, "&UnionPlus;"], [0, { v: "&sqsub;", n: 824, o: "&NotSquareSubset;" }], [0, { v: "&sqsup;", n: 824, o: "&NotSquareSuperset;" }], [0, "&sqsube;"], [0, "&sqsupe;"], [0, { v: "&sqcap;", n: 65024, o: "&sqcaps;" }], [0, { v: "&sqcup;", n: 65024, o: "&sqcups;" }], [0, "&CirclePlus;"], [0, "&CircleMinus;"], [0, "&CircleTimes;"], [0, "&osol;"], [0, "&CircleDot;"], [0, "&circledcirc;"], [0, "&circledast;"], [1, "&circleddash;"], [0, "&boxplus;"], [0, "&boxminus;"], [0, "&boxtimes;"], [0, "&dotsquare;"], [0, "&RightTee;"], [0, "&dashv;"], [0, "&DownTee;"], [0, "&bot;"], [1, "&models;"], [0, "&DoubleRightTee;"], [0, "&Vdash;"], [0, "&Vvdash;"], [0, "&VDash;"], [0, "&nvdash;"], [0, "&nvDash;"], [0, "&nVdash;"], [0, "&nVDash;"], [0, "&prurel;"], [1, "&LeftTriangle;"], [0, "&RightTriangle;"], [0, { v: "&LeftTriangleEqual;", n: 8402, o: "&nvltrie;" }], [0, { v: "&RightTriangleEqual;", n: 8402, o: "&nvrtrie;" }], [0, "&origof;"], [0, "&imof;"], [0, "&multimap;"], [0, "&hercon;"], [0, "&intcal;"], [0, "&veebar;"], [1, "&barvee;"], [0, "&angrtvb;"], [0, "&lrtri;"], [0, "&bigwedge;"], [0, "&bigvee;"], [0, "&bigcap;"], [0, "&bigcup;"], [0, "&diam;"], [0, "&sdot;"], [0, "&sstarf;"], [0, "&divideontimes;"], [0, "&bowtie;"], [0, "&ltimes;"], [0, "&rtimes;"], [0, "&leftthreetimes;"], [0, "&rightthreetimes;"], [0, "&backsimeq;"], [0, "&curlyvee;"], [0, "&curlywedge;"], [0, "&Sub;"], [0, "&Sup;"], [0, "&Cap;"], [0, "&Cup;"], [0, "&fork;"], [0, "&epar;"], [0, "&lessdot;"], [0, "&gtdot;"], [0, { v: "&Ll;", n: 824, o: "&nLl;" }], [0, { v: "&Gg;", n: 824, o: "&nGg;" }], [0, { v: "&leg;", n: 65024, o: "&lesg;" }], [0, { v: "&gel;", n: 65024, o: "&gesl;" }], [2, "&cuepr;"], [0, "&cuesc;"], [0, "&NotPrecedesSlantEqual;"], [0, "&NotSucceedsSlantEqual;"], [0, "&NotSquareSubsetEqual;"], [0, "&NotSquareSupersetEqual;"], [2, "&lnsim;"], [0, "&gnsim;"], [0, "&precnsim;"], [0, "&scnsim;"], [0, "&nltri;"], [0, "&NotRightTriangle;"], [0, "&nltrie;"], [0, "&NotRightTriangleEqual;"], [0, "&vellip;"], [0, "&ctdot;"], [0, "&utdot;"], [0, "&dtdot;"], [0, "&disin;"], [0, "&isinsv;"], [0, "&isins;"], [0, { v: "&isindot;", n: 824, o: "&notindot;" }], [0, "&notinvc;"], [0, "&notinvb;"], [1, { v: "&isinE;", n: 824, o: "&notinE;" }], [0, "&nisd;"], [0, "&xnis;"], [0, "&nis;"], [0, "&notnivc;"], [0, "&notnivb;"], [6, "&barwed;"], [0, "&Barwed;"], [1, "&lceil;"], [0, "&rceil;"], [0, "&LeftFloor;"], [0, "&rfloor;"], [0, "&drcrop;"], [0, "&dlcrop;"], [0, "&urcrop;"], [0, "&ulcrop;"], [0, "&bnot;"], [1, "&profline;"], [0, "&profsurf;"], [1, "&telrec;"], [0, "&target;"], [5, "&ulcorn;"], [0, "&urcorn;"], [0, "&dlcorn;"], [0, "&drcorn;"], [2, "&frown;"], [0, "&smile;"], [9, "&cylcty;"], [0, "&profalar;"], [7, "&topbot;"], [6, "&ovbar;"], [1, "&solbar;"], [60, "&angzarr;"], [51, "&lmoustache;"], [0, "&rmoustache;"], [2, "&OverBracket;"], [0, "&bbrk;"], [0, "&bbrktbrk;"], [37, "&OverParenthesis;"], [0, "&UnderParenthesis;"], [0, "&OverBrace;"], [0, "&UnderBrace;"], [2, "&trpezium;"], [4, "&elinters;"], [59, "&blank;"], [164, "&circledS;"], [55, "&boxh;"], [1, "&boxv;"], [9, "&boxdr;"], [3, "&boxdl;"], [3, "&boxur;"], [3, "&boxul;"], [3, "&boxvr;"], [7, "&boxvl;"], [7, "&boxhd;"], [7, "&boxhu;"], [7, "&boxvh;"], [19, "&boxH;"], [0, "&boxV;"], [0, "&boxdR;"], [0, "&boxDr;"], [0, "&boxDR;"], [0, "&boxdL;"], [0, "&boxDl;"], [0, "&boxDL;"], [0, "&boxuR;"], [0, "&boxUr;"], [0, "&boxUR;"], [0, "&boxuL;"], [0, "&boxUl;"], [0, "&boxUL;"], [0, "&boxvR;"], [0, "&boxVr;"], [0, "&boxVR;"], [0, "&boxvL;"], [0, "&boxVl;"], [0, "&boxVL;"], [0, "&boxHd;"], [0, "&boxhD;"], [0, "&boxHD;"], [0, "&boxHu;"], [0, "&boxhU;"], [0, "&boxHU;"], [0, "&boxvH;"], [0, "&boxVh;"], [0, "&boxVH;"], [19, "&uhblk;"], [3, "&lhblk;"], [3, "&block;"], [8, "&blk14;"], [0, "&blk12;"], [0, "&blk34;"], [13, "&square;"], [8, "&blacksquare;"], [0, "&EmptyVerySmallSquare;"], [1, "&rect;"], [0, "&marker;"], [2, "&fltns;"], [1, "&bigtriangleup;"], [0, "&blacktriangle;"], [0, "&triangle;"], [2, "&blacktriangleright;"], [0, "&rtri;"], [3, "&bigtriangledown;"], [0, "&blacktriangledown;"], [0, "&dtri;"], [2, "&blacktriangleleft;"], [0, "&ltri;"], [6, "&loz;"], [0, "&cir;"], [32, "&tridot;"], [2, "&bigcirc;"], [8, "&ultri;"], [0, "&urtri;"], [0, "&lltri;"], [0, "&EmptySmallSquare;"], [0, "&FilledSmallSquare;"], [8, "&bigstar;"], [0, "&star;"], [7, "&phone;"], [49, "&female;"], [1, "&male;"], [29, "&spades;"], [2, "&clubs;"], [1, "&hearts;"], [0, "&diamondsuit;"], [3, "&sung;"], [2, "&flat;"], [0, "&natural;"], [0, "&sharp;"], [163, "&check;"], [3, "&cross;"], [8, "&malt;"], [21, "&sext;"], [33, "&VerticalSeparator;"], [25, "&lbbrk;"], [0, "&rbbrk;"], [84, "&bsolhsub;"], [0, "&suphsol;"], [28, "&LeftDoubleBracket;"], [0, "&RightDoubleBracket;"], [0, "&lang;"], [0, "&rang;"], [0, "&Lang;"], [0, "&Rang;"], [0, "&loang;"], [0, "&roang;"], [7, "&longleftarrow;"], [0, "&longrightarrow;"], [0, "&longleftrightarrow;"], [0, "&DoubleLongLeftArrow;"], [0, "&DoubleLongRightArrow;"], [0, "&DoubleLongLeftRightArrow;"], [1, "&longmapsto;"], [2, "&dzigrarr;"], [258, "&nvlArr;"], [0, "&nvrArr;"], [0, "&nvHarr;"], [0, "&Map;"], [6, "&lbarr;"], [0, "&bkarow;"], [0, "&lBarr;"], [0, "&dbkarow;"], [0, "&drbkarow;"], [0, "&DDotrahd;"], [0, "&UpArrowBar;"], [0, "&DownArrowBar;"], [2, "&Rarrtl;"], [2, "&latail;"], [0, "&ratail;"], [0, "&lAtail;"], [0, "&rAtail;"], [0, "&larrfs;"], [0, "&rarrfs;"], [0, "&larrbfs;"], [0, "&rarrbfs;"], [2, "&nwarhk;"], [0, "&nearhk;"], [0, "&hksearow;"], [0, "&hkswarow;"], [0, "&nwnear;"], [0, "&nesear;"], [0, "&seswar;"], [0, "&swnwar;"], [8, { v: "&rarrc;", n: 824, o: "&nrarrc;" }], [1, "&cudarrr;"], [0, "&ldca;"], [0, "&rdca;"], [0, "&cudarrl;"], [0, "&larrpl;"], [2, "&curarrm;"], [0, "&cularrp;"], [7, "&rarrpl;"], [2, "&harrcir;"], [0, "&Uarrocir;"], [0, "&lurdshar;"], [0, "&ldrushar;"], [2, "&LeftRightVector;"], [0, "&RightUpDownVector;"], [0, "&DownLeftRightVector;"], [0, "&LeftUpDownVector;"], [0, "&LeftVectorBar;"], [0, "&RightVectorBar;"], [0, "&RightUpVectorBar;"], [0, "&RightDownVectorBar;"], [0, "&DownLeftVectorBar;"], [0, "&DownRightVectorBar;"], [0, "&LeftUpVectorBar;"], [0, "&LeftDownVectorBar;"], [0, "&LeftTeeVector;"], [0, "&RightTeeVector;"], [0, "&RightUpTeeVector;"], [0, "&RightDownTeeVector;"], [0, "&DownLeftTeeVector;"], [0, "&DownRightTeeVector;"], [0, "&LeftUpTeeVector;"], [0, "&LeftDownTeeVector;"], [0, "&lHar;"], [0, "&uHar;"], [0, "&rHar;"], [0, "&dHar;"], [0, "&luruhar;"], [0, "&ldrdhar;"], [0, "&ruluhar;"], [0, "&rdldhar;"], [0, "&lharul;"], [0, "&llhard;"], [0, "&rharul;"], [0, "&lrhard;"], [0, "&udhar;"], [0, "&duhar;"], [0, "&RoundImplies;"], [0, "&erarr;"], [0, "&simrarr;"], [0, "&larrsim;"], [0, "&rarrsim;"], [0, "&rarrap;"], [0, "&ltlarr;"], [1, "&gtrarr;"], [0, "&subrarr;"], [1, "&suplarr;"], [0, "&lfisht;"], [0, "&rfisht;"], [0, "&ufisht;"], [0, "&dfisht;"], [5, "&lopar;"], [0, "&ropar;"], [4, "&lbrke;"], [0, "&rbrke;"], [0, "&lbrkslu;"], [0, "&rbrksld;"], [0, "&lbrksld;"], [0, "&rbrkslu;"], [0, "&langd;"], [0, "&rangd;"], [0, "&lparlt;"], [0, "&rpargt;"], [0, "&gtlPar;"], [0, "&ltrPar;"], [3, "&vzigzag;"], [1, "&vangrt;"], [0, "&angrtvbd;"], [6, "&ange;"], [0, "&range;"], [0, "&dwangle;"], [0, "&uwangle;"], [0, "&angmsdaa;"], [0, "&angmsdab;"], [0, "&angmsdac;"], [0, "&angmsdad;"], [0, "&angmsdae;"], [0, "&angmsdaf;"], [0, "&angmsdag;"], [0, "&angmsdah;"], [0, "&bemptyv;"], [0, "&demptyv;"], [0, "&cemptyv;"], [0, "&raemptyv;"], [0, "&laemptyv;"], [0, "&ohbar;"], [0, "&omid;"], [0, "&opar;"], [1, "&operp;"], [1, "&olcross;"], [0, "&odsold;"], [1, "&olcir;"], [0, "&ofcir;"], [0, "&olt;"], [0, "&ogt;"], [0, "&cirscir;"], [0, "&cirE;"], [0, "&solb;"], [0, "&bsolb;"], [3, "&boxbox;"], [3, "&trisb;"], [0, "&rtriltri;"], [0, { v: "&LeftTriangleBar;", n: 824, o: "&NotLeftTriangleBar;" }], [0, { v: "&RightTriangleBar;", n: 824, o: "&NotRightTriangleBar;" }], [11, "&iinfin;"], [0, "&infintie;"], [0, "&nvinfin;"], [4, "&eparsl;"], [0, "&smeparsl;"], [0, "&eqvparsl;"], [5, "&blacklozenge;"], [8, "&RuleDelayed;"], [1, "&dsol;"], [9, "&bigodot;"], [0, "&bigoplus;"], [0, "&bigotimes;"], [1, "&biguplus;"], [1, "&bigsqcup;"], [5, "&iiiint;"], [0, "&fpartint;"], [2, "&cirfnint;"], [0, "&awint;"], [0, "&rppolint;"], [0, "&scpolint;"], [0, "&npolint;"], [0, "&pointint;"], [0, "&quatint;"], [0, "&intlarhk;"], [10, "&pluscir;"], [0, "&plusacir;"], [0, "&simplus;"], [0, "&plusdu;"], [0, "&plussim;"], [0, "&plustwo;"], [1, "&mcomma;"], [0, "&minusdu;"], [2, "&loplus;"], [0, "&roplus;"], [0, "&Cross;"], [0, "&timesd;"], [0, "&timesbar;"], [1, "&smashp;"], [0, "&lotimes;"], [0, "&rotimes;"], [0, "&otimesas;"], [0, "&Otimes;"], [0, "&odiv;"], [0, "&triplus;"], [0, "&triminus;"], [0, "&tritime;"], [0, "&intprod;"], [2, "&amalg;"], [0, "&capdot;"], [1, "&ncup;"], [0, "&ncap;"], [0, "&capand;"], [0, "&cupor;"], [0, "&cupcap;"], [0, "&capcup;"], [0, "&cupbrcap;"], [0, "&capbrcup;"], [0, "&cupcup;"], [0, "&capcap;"], [0, "&ccups;"], [0, "&ccaps;"], [2, "&ccupssm;"], [2, "&And;"], [0, "&Or;"], [0, "&andand;"], [0, "&oror;"], [0, "&orslope;"], [0, "&andslope;"], [1, "&andv;"], [0, "&orv;"], [0, "&andd;"], [0, "&ord;"], [1, "&wedbar;"], [6, "&sdote;"], [3, "&simdot;"], [2, { v: "&congdot;", n: 824, o: "&ncongdot;" }], [0, "&easter;"], [0, "&apacir;"], [0, { v: "&apE;", n: 824, o: "&napE;" }], [0, "&eplus;"], [0, "&pluse;"], [0, "&Esim;"], [0, "&Colone;"], [0, "&Equal;"], [1, "&ddotseq;"], [0, "&equivDD;"], [0, "&ltcir;"], [0, "&gtcir;"], [0, "&ltquest;"], [0, "&gtquest;"], [0, { v: "&leqslant;", n: 824, o: "&nleqslant;" }], [0, { v: "&geqslant;", n: 824, o: "&ngeqslant;" }], [0, "&lesdot;"], [0, "&gesdot;"], [0, "&lesdoto;"], [0, "&gesdoto;"], [0, "&lesdotor;"], [0, "&gesdotol;"], [0, "&lap;"], [0, "&gap;"], [0, "&lne;"], [0, "&gne;"], [0, "&lnap;"], [0, "&gnap;"], [0, "&lEg;"], [0, "&gEl;"], [0, "&lsime;"], [0, "&gsime;"], [0, "&lsimg;"], [0, "&gsiml;"], [0, "&lgE;"], [0, "&glE;"], [0, "&lesges;"], [0, "&gesles;"], [0, "&els;"], [0, "&egs;"], [0, "&elsdot;"], [0, "&egsdot;"], [0, "&el;"], [0, "&eg;"], [2, "&siml;"], [0, "&simg;"], [0, "&simlE;"], [0, "&simgE;"], [0, { v: "&LessLess;", n: 824, o: "&NotNestedLessLess;" }], [0, { v: "&GreaterGreater;", n: 824, o: "&NotNestedGreaterGreater;" }], [1, "&glj;"], [0, "&gla;"], [0, "&ltcc;"], [0, "&gtcc;"], [0, "&lescc;"], [0, "&gescc;"], [0, "&smt;"], [0, "&lat;"], [0, { v: "&smte;", n: 65024, o: "&smtes;" }], [0, { v: "&late;", n: 65024, o: "&lates;" }], [0, "&bumpE;"], [0, { v: "&PrecedesEqual;", n: 824, o: "&NotPrecedesEqual;" }], [0, { v: "&sce;", n: 824, o: "&NotSucceedsEqual;" }], [2, "&prE;"], [0, "&scE;"], [0, "&precneqq;"], [0, "&scnE;"], [0, "&prap;"], [0, "&scap;"], [0, "&precnapprox;"], [0, "&scnap;"], [0, "&Pr;"], [0, "&Sc;"], [0, "&subdot;"], [0, "&supdot;"], [0, "&subplus;"], [0, "&supplus;"], [0, "&submult;"], [0, "&supmult;"], [0, "&subedot;"], [0, "&supedot;"], [0, { v: "&subE;", n: 824, o: "&nsubE;" }], [0, { v: "&supE;", n: 824, o: "&nsupE;" }], [0, "&subsim;"], [0, "&supsim;"], [2, { v: "&subnE;", n: 65024, o: "&varsubsetneqq;" }], [0, { v: "&supnE;", n: 65024, o: "&varsupsetneqq;" }], [2, "&csub;"], [0, "&csup;"], [0, "&csube;"], [0, "&csupe;"], [0, "&subsup;"], [0, "&supsub;"], [0, "&subsub;"], [0, "&supsup;"], [0, "&suphsub;"], [0, "&supdsub;"], [0, "&forkv;"], [0, "&topfork;"], [0, "&mlcp;"], [8, "&Dashv;"], [1, "&Vdashl;"], [0, "&Barv;"], [0, "&vBar;"], [0, "&vBarv;"], [1, "&Vbar;"], [0, "&Not;"], [0, "&bNot;"], [0, "&rnmid;"], [0, "&cirmid;"], [0, "&midcir;"], [0, "&topcir;"], [0, "&nhpar;"], [0, "&parsim;"], [9, { v: "&parsl;", n: 8421, o: "&nparsl;" }], [44343, { n: new Map(/* @__PURE__ */ e([[56476, "&Ascr;"], [1, "&Cscr;"], [0, "&Dscr;"], [2, "&Gscr;"], [2, "&Jscr;"], [0, "&Kscr;"], [2, "&Nscr;"], [0, "&Oscr;"], [0, "&Pscr;"], [0, "&Qscr;"], [1, "&Sscr;"], [0, "&Tscr;"], [0, "&Uscr;"], [0, "&Vscr;"], [0, "&Wscr;"], [0, "&Xscr;"], [0, "&Yscr;"], [0, "&Zscr;"], [0, "&ascr;"], [0, "&bscr;"], [0, "&cscr;"], [0, "&dscr;"], [1, "&fscr;"], [1, "&hscr;"], [0, "&iscr;"], [0, "&jscr;"], [0, "&kscr;"], [0, "&lscr;"], [0, "&mscr;"], [0, "&nscr;"], [1, "&pscr;"], [0, "&qscr;"], [0, "&rscr;"], [0, "&sscr;"], [0, "&tscr;"], [0, "&uscr;"], [0, "&vscr;"], [0, "&wscr;"], [0, "&xscr;"], [0, "&yscr;"], [0, "&zscr;"], [52, "&Afr;"], [0, "&Bfr;"], [1, "&Dfr;"], [0, "&Efr;"], [0, "&Ffr;"], [0, "&Gfr;"], [2, "&Jfr;"], [0, "&Kfr;"], [0, "&Lfr;"], [0, "&Mfr;"], [0, "&Nfr;"], [0, "&Ofr;"], [0, "&Pfr;"], [0, "&Qfr;"], [1, "&Sfr;"], [0, "&Tfr;"], [0, "&Ufr;"], [0, "&Vfr;"], [0, "&Wfr;"], [0, "&Xfr;"], [0, "&Yfr;"], [1, "&afr;"], [0, "&bfr;"], [0, "&cfr;"], [0, "&dfr;"], [0, "&efr;"], [0, "&ffr;"], [0, "&gfr;"], [0, "&hfr;"], [0, "&ifr;"], [0, "&jfr;"], [0, "&kfr;"], [0, "&lfr;"], [0, "&mfr;"], [0, "&nfr;"], [0, "&ofr;"], [0, "&pfr;"], [0, "&qfr;"], [0, "&rfr;"], [0, "&sfr;"], [0, "&tfr;"], [0, "&ufr;"], [0, "&vfr;"], [0, "&wfr;"], [0, "&xfr;"], [0, "&yfr;"], [0, "&zfr;"], [0, "&Aopf;"], [0, "&Bopf;"], [1, "&Dopf;"], [0, "&Eopf;"], [0, "&Fopf;"], [0, "&Gopf;"], [1, "&Iopf;"], [0, "&Jopf;"], [0, "&Kopf;"], [0, "&Lopf;"], [0, "&Mopf;"], [1, "&Oopf;"], [3, "&Sopf;"], [0, "&Topf;"], [0, "&Uopf;"], [0, "&Vopf;"], [0, "&Wopf;"], [0, "&Xopf;"], [0, "&Yopf;"], [1, "&aopf;"], [0, "&bopf;"], [0, "&copf;"], [0, "&dopf;"], [0, "&eopf;"], [0, "&fopf;"], [0, "&gopf;"], [0, "&hopf;"], [0, "&iopf;"], [0, "&jopf;"], [0, "&kopf;"], [0, "&lopf;"], [0, "&mopf;"], [0, "&nopf;"], [0, "&oopf;"], [0, "&popf;"], [0, "&qopf;"], [0, "&ropf;"], [0, "&sopf;"], [0, "&topf;"], [0, "&uopf;"], [0, "&vopf;"], [0, "&wopf;"], [0, "&xopf;"], [0, "&yopf;"], [0, "&zopf;"]])) }], [8906, "&fflig;"], [0, "&filig;"], [0, "&fllig;"], [0, "&ffilig;"], [0, "&ffllig;"]])), Xe;
}
var mt = {}, Eu;
function Xt() {
  return Eu || (Eu = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.escapeText = e.escapeAttribute = e.escapeUTF8 = e.escape = e.encodeXML = e.getCodePoint = e.xmlReplacer = void 0, e.xmlReplacer = /["&'<>$\x80-\uFFFF]/g;
    var r = /* @__PURE__ */ new Map([
      [34, "&quot;"],
      [38, "&amp;"],
      [39, "&apos;"],
      [60, "&lt;"],
      [62, "&gt;"]
    ]);
    e.getCodePoint = // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    String.prototype.codePointAt != null ? function(o, f) {
      return o.codePointAt(f);
    } : (
      // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      function(o, f) {
        return (o.charCodeAt(f) & 64512) === 55296 ? (o.charCodeAt(f) - 55296) * 1024 + o.charCodeAt(f + 1) - 56320 + 65536 : o.charCodeAt(f);
      }
    );
    function i(o) {
      for (var f = "", n = 0, c; (c = e.xmlReplacer.exec(o)) !== null; ) {
        var p = c.index, a = o.charCodeAt(p), l = r.get(a);
        l !== void 0 ? (f += o.substring(n, p) + l, n = p + 1) : (f += "".concat(o.substring(n, p), "&#x").concat((0, e.getCodePoint)(o, p).toString(16), ";"), n = e.xmlReplacer.lastIndex += +((a & 64512) === 55296));
      }
      return f + o.substr(n);
    }
    e.encodeXML = i, e.escape = i;
    function s(o, f) {
      return function(c) {
        for (var p, a = 0, l = ""; p = o.exec(c); )
          a !== p.index && (l += c.substring(a, p.index)), l += f.get(p[0].charCodeAt(0)), a = p.index + 1;
        return l + c.substring(a);
      };
    }
    e.escapeUTF8 = s(/[&<>'"]/g, r), e.escapeAttribute = s(/["&\u00A0]/g, /* @__PURE__ */ new Map([
      [34, "&quot;"],
      [38, "&amp;"],
      [160, "&nbsp;"]
    ])), e.escapeText = s(/[&<>\u00A0]/g, /* @__PURE__ */ new Map([
      [38, "&amp;"],
      [60, "&lt;"],
      [62, "&gt;"],
      [160, "&nbsp;"]
    ]));
  }(mt)), mt;
}
var Au;
function ku() {
  if (Au) return Ce;
  Au = 1;
  var e = Ce && Ce.__importDefault || function(c) {
    return c && c.__esModule ? c : { default: c };
  };
  Object.defineProperty(Ce, "__esModule", { value: !0 }), Ce.encodeNonAsciiHTML = Ce.encodeHTML = void 0;
  var r = e(/* @__PURE__ */ Ni()), i = /* @__PURE__ */ Xt(), s = /[\t\n!-,./:-@[-`\f{-}$\x80-\uFFFF]/g;
  function o(c) {
    return n(s, c);
  }
  Ce.encodeHTML = o;
  function f(c) {
    return n(i.xmlReplacer, c);
  }
  Ce.encodeNonAsciiHTML = f;
  function n(c, p) {
    for (var a = "", l = 0, h; (h = c.exec(p)) !== null; ) {
      var t = h.index;
      a += p.substring(l, t);
      var u = p.charCodeAt(t), m = r.default.get(u);
      if (typeof m == "object") {
        if (t + 1 < p.length) {
          var v = p.charCodeAt(t + 1), y = typeof m.n == "number" ? m.n === v ? m.o : void 0 : m.n.get(v);
          if (y !== void 0) {
            a += y, l = c.lastIndex += 1;
            continue;
          }
        }
        m = m.v;
      }
      if (m !== void 0)
        a += m, l = t + 1;
      else {
        var d = (0, i.getCodePoint)(p, t);
        a += "&#x".concat(d.toString(16), ";"), l = c.lastIndex += +(d !== u);
      }
    }
    return a + p.substr(l);
  }
  return Ce;
}
var qu;
function _i() {
  return qu || (qu = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.decodeXMLStrict = e.decodeHTML5Strict = e.decodeHTML4Strict = e.decodeHTML5 = e.decodeHTML4 = e.decodeHTMLAttribute = e.decodeHTMLStrict = e.decodeHTML = e.decodeXML = e.DecodingMode = e.EntityDecoder = e.encodeHTML5 = e.encodeHTML4 = e.encodeNonAsciiHTML = e.encodeHTML = e.escapeText = e.escapeAttribute = e.escapeUTF8 = e.escape = e.encodeXML = e.encode = e.decodeStrict = e.decode = e.EncodingMode = e.EntityLevel = void 0;
    var r = /* @__PURE__ */ ut(), i = /* @__PURE__ */ ku(), s = /* @__PURE__ */ Xt(), o;
    (function(t) {
      t[t.XML = 0] = "XML", t[t.HTML = 1] = "HTML";
    })(o = e.EntityLevel || (e.EntityLevel = {}));
    var f;
    (function(t) {
      t[t.UTF8 = 0] = "UTF8", t[t.ASCII = 1] = "ASCII", t[t.Extensive = 2] = "Extensive", t[t.Attribute = 3] = "Attribute", t[t.Text = 4] = "Text";
    })(f = e.EncodingMode || (e.EncodingMode = {}));
    function n(t, u) {
      u === void 0 && (u = o.XML);
      var m = typeof u == "number" ? u : u.level;
      if (m === o.HTML) {
        var v = typeof u == "object" ? u.mode : void 0;
        return (0, r.decodeHTML)(t, v);
      }
      return (0, r.decodeXML)(t);
    }
    e.decode = n;
    function c(t, u) {
      var m;
      u === void 0 && (u = o.XML);
      var v = typeof u == "number" ? { level: u } : u;
      return (m = v.mode) !== null && m !== void 0 || (v.mode = r.DecodingMode.Strict), n(t, v);
    }
    e.decodeStrict = c;
    function p(t, u) {
      u === void 0 && (u = o.XML);
      var m = typeof u == "number" ? { level: u } : u;
      return m.mode === f.UTF8 ? (0, s.escapeUTF8)(t) : m.mode === f.Attribute ? (0, s.escapeAttribute)(t) : m.mode === f.Text ? (0, s.escapeText)(t) : m.level === o.HTML ? m.mode === f.ASCII ? (0, i.encodeNonAsciiHTML)(t) : (0, i.encodeHTML)(t) : (0, s.encodeXML)(t);
    }
    e.encode = p;
    var a = /* @__PURE__ */ Xt();
    Object.defineProperty(e, "encodeXML", { enumerable: !0, get: function() {
      return a.encodeXML;
    } }), Object.defineProperty(e, "escape", { enumerable: !0, get: function() {
      return a.escape;
    } }), Object.defineProperty(e, "escapeUTF8", { enumerable: !0, get: function() {
      return a.escapeUTF8;
    } }), Object.defineProperty(e, "escapeAttribute", { enumerable: !0, get: function() {
      return a.escapeAttribute;
    } }), Object.defineProperty(e, "escapeText", { enumerable: !0, get: function() {
      return a.escapeText;
    } });
    var l = /* @__PURE__ */ ku();
    Object.defineProperty(e, "encodeHTML", { enumerable: !0, get: function() {
      return l.encodeHTML;
    } }), Object.defineProperty(e, "encodeNonAsciiHTML", { enumerable: !0, get: function() {
      return l.encodeNonAsciiHTML;
    } }), Object.defineProperty(e, "encodeHTML4", { enumerable: !0, get: function() {
      return l.encodeHTML;
    } }), Object.defineProperty(e, "encodeHTML5", { enumerable: !0, get: function() {
      return l.encodeHTML;
    } });
    var h = /* @__PURE__ */ ut();
    Object.defineProperty(e, "EntityDecoder", { enumerable: !0, get: function() {
      return h.EntityDecoder;
    } }), Object.defineProperty(e, "DecodingMode", { enumerable: !0, get: function() {
      return h.DecodingMode;
    } }), Object.defineProperty(e, "decodeXML", { enumerable: !0, get: function() {
      return h.decodeXML;
    } }), Object.defineProperty(e, "decodeHTML", { enumerable: !0, get: function() {
      return h.decodeHTML;
    } }), Object.defineProperty(e, "decodeHTMLStrict", { enumerable: !0, get: function() {
      return h.decodeHTMLStrict;
    } }), Object.defineProperty(e, "decodeHTMLAttribute", { enumerable: !0, get: function() {
      return h.decodeHTMLAttribute;
    } }), Object.defineProperty(e, "decodeHTML4", { enumerable: !0, get: function() {
      return h.decodeHTML;
    } }), Object.defineProperty(e, "decodeHTML5", { enumerable: !0, get: function() {
      return h.decodeHTML;
    } }), Object.defineProperty(e, "decodeHTML4Strict", { enumerable: !0, get: function() {
      return h.decodeHTMLStrict;
    } }), Object.defineProperty(e, "decodeHTML5Strict", { enumerable: !0, get: function() {
      return h.decodeHTMLStrict;
    } }), Object.defineProperty(e, "decodeXMLStrict", { enumerable: !0, get: function() {
      return h.decodeXML;
    } });
  }(bt)), bt;
}
var _e = {}, Tu;
function $i() {
  return Tu || (Tu = 1, Object.defineProperty(_e, "__esModule", { value: !0 }), _e.attributeNames = _e.elementNames = void 0, _e.elementNames = new Map([
    "altGlyph",
    "altGlyphDef",
    "altGlyphItem",
    "animateColor",
    "animateMotion",
    "animateTransform",
    "clipPath",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "foreignObject",
    "glyphRef",
    "linearGradient",
    "radialGradient",
    "textPath"
  ].map(function(e) {
    return [e.toLowerCase(), e];
  })), _e.attributeNames = new Map([
    "definitionURL",
    "attributeName",
    "attributeType",
    "baseFrequency",
    "baseProfile",
    "calcMode",
    "clipPathUnits",
    "diffuseConstant",
    "edgeMode",
    "filterUnits",
    "glyphRef",
    "gradientTransform",
    "gradientUnits",
    "kernelMatrix",
    "kernelUnitLength",
    "keyPoints",
    "keySplines",
    "keyTimes",
    "lengthAdjust",
    "limitingConeAngle",
    "markerHeight",
    "markerUnits",
    "markerWidth",
    "maskContentUnits",
    "maskUnits",
    "numOctaves",
    "pathLength",
    "patternContentUnits",
    "patternTransform",
    "patternUnits",
    "pointsAtX",
    "pointsAtY",
    "pointsAtZ",
    "preserveAlpha",
    "preserveAspectRatio",
    "primitiveUnits",
    "refX",
    "refY",
    "repeatCount",
    "repeatDur",
    "requiredExtensions",
    "requiredFeatures",
    "specularConstant",
    "specularExponent",
    "spreadMethod",
    "startOffset",
    "stdDeviation",
    "stitchTiles",
    "surfaceScale",
    "systemLanguage",
    "tableValues",
    "targetX",
    "targetY",
    "textLength",
    "viewBox",
    "viewTarget",
    "xChannelSelector",
    "yChannelSelector",
    "zoomAndPan"
  ].map(function(e) {
    return [e.toLowerCase(), e];
  }))), _e;
}
var Du;
function Mi() {
  if (Du) return me;
  Du = 1;
  var e = me && me.__assign || function() {
    return e = Object.assign || function(x) {
      for (var b, S = 1, E = arguments.length; S < E; S++) {
        b = arguments[S];
        for (var k in b) Object.prototype.hasOwnProperty.call(b, k) && (x[k] = b[k]);
      }
      return x;
    }, e.apply(this, arguments);
  }, r = me && me.__createBinding || (Object.create ? function(x, b, S, E) {
    E === void 0 && (E = S);
    var k = Object.getOwnPropertyDescriptor(b, S);
    (!k || ("get" in k ? !b.__esModule : k.writable || k.configurable)) && (k = { enumerable: !0, get: function() {
      return b[S];
    } }), Object.defineProperty(x, E, k);
  } : function(x, b, S, E) {
    E === void 0 && (E = S), x[E] = b[S];
  }), i = me && me.__setModuleDefault || (Object.create ? function(x, b) {
    Object.defineProperty(x, "default", { enumerable: !0, value: b });
  } : function(x, b) {
    x.default = b;
  }), s = me && me.__importStar || function(x) {
    if (x && x.__esModule) return x;
    var b = {};
    if (x != null) for (var S in x) S !== "default" && Object.prototype.hasOwnProperty.call(x, S) && r(b, x, S);
    return i(b, x), b;
  };
  Object.defineProperty(me, "__esModule", { value: !0 }), me.render = void 0;
  var o = s(/* @__PURE__ */ ze()), f = /* @__PURE__ */ _i(), n = /* @__PURE__ */ $i(), c = /* @__PURE__ */ new Set([
    "style",
    "script",
    "xmp",
    "iframe",
    "noembed",
    "noframes",
    "plaintext",
    "noscript"
  ]);
  function p(x) {
    return x.replace(/"/g, "&quot;");
  }
  function a(x, b) {
    var S;
    if (x) {
      var E = ((S = b.encodeEntities) !== null && S !== void 0 ? S : b.decodeEntities) === !1 ? p : b.xmlMode || b.encodeEntities !== "utf8" ? f.encodeXML : f.escapeAttribute;
      return Object.keys(x).map(function(k) {
        var O, P, A = (O = x[k]) !== null && O !== void 0 ? O : "";
        return b.xmlMode === "foreign" && (k = (P = n.attributeNames.get(k)) !== null && P !== void 0 ? P : k), !b.emptyAttrs && !b.xmlMode && A === "" ? k : "".concat(k, '="').concat(E(A), '"');
      }).join(" ");
    }
  }
  var l = /* @__PURE__ */ new Set([
    "area",
    "base",
    "basefont",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "img",
    "input",
    "isindex",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ]);
  function h(x, b) {
    b === void 0 && (b = {});
    for (var S = ("length" in x) ? x : [x], E = "", k = 0; k < S.length; k++)
      E += t(S[k], b);
    return E;
  }
  me.render = h, me.default = h;
  function t(x, b) {
    switch (x.type) {
      case o.Root:
        return h(x.children, b);
      // @ts-expect-error We don't use `Doctype` yet
      case o.Doctype:
      case o.Directive:
        return y(x);
      case o.Comment:
        return w(x);
      case o.CDATA:
        return g(x);
      case o.Script:
      case o.Style:
      case o.Tag:
        return v(x, b);
      case o.Text:
        return d(x, b);
    }
  }
  var u = /* @__PURE__ */ new Set([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext",
    "annotation-xml",
    "foreignObject",
    "desc",
    "title"
  ]), m = /* @__PURE__ */ new Set(["svg", "math"]);
  function v(x, b) {
    var S;
    b.xmlMode === "foreign" && (x.name = (S = n.elementNames.get(x.name)) !== null && S !== void 0 ? S : x.name, x.parent && u.has(x.parent.name) && (b = e(e({}, b), { xmlMode: !1 }))), !b.xmlMode && m.has(x.name) && (b = e(e({}, b), { xmlMode: "foreign" }));
    var E = "<".concat(x.name), k = a(x.attribs, b);
    return k && (E += " ".concat(k)), x.children.length === 0 && (b.xmlMode ? (
      // In XML mode or foreign mode, and user hasn't explicitly turned off self-closing tags
      b.selfClosingTags !== !1
    ) : (
      // User explicitly asked for self-closing tags, even in HTML mode
      b.selfClosingTags && l.has(x.name)
    )) ? (b.xmlMode || (E += " "), E += "/>") : (E += ">", x.children.length > 0 && (E += h(x.children, b)), (b.xmlMode || !l.has(x.name)) && (E += "</".concat(x.name, ">"))), E;
  }
  function y(x) {
    return "<".concat(x.data, ">");
  }
  function d(x, b) {
    var S, E = x.data || "";
    return ((S = b.encodeEntities) !== null && S !== void 0 ? S : b.decodeEntities) !== !1 && !(!b.xmlMode && x.parent && c.has(x.parent.name)) && (E = b.xmlMode || b.encodeEntities !== "utf8" ? (0, f.encodeXML)(E) : (0, f.escapeText)(E)), E;
  }
  function g(x) {
    return "<![CDATA[".concat(x.children[0].data, "]]>");
  }
  function w(x) {
    return "<!--".concat(x.data, "-->");
  }
  return me;
}
var Cu;
function xr() {
  if (Cu) return fe;
  Cu = 1;
  var e = fe && fe.__importDefault || function(a) {
    return a && a.__esModule ? a : { default: a };
  };
  Object.defineProperty(fe, "__esModule", { value: !0 }), fe.innerText = fe.textContent = fe.getText = fe.getInnerHTML = fe.getOuterHTML = void 0;
  var r = /* @__PURE__ */ Oe(), i = e(/* @__PURE__ */ Mi()), s = /* @__PURE__ */ ze();
  function o(a, l) {
    return (0, i.default)(a, l);
  }
  fe.getOuterHTML = o;
  function f(a, l) {
    return (0, r.hasChildren)(a) ? a.children.map(function(h) {
      return o(h, l);
    }).join("") : "";
  }
  fe.getInnerHTML = f;
  function n(a) {
    return Array.isArray(a) ? a.map(n).join("") : (0, r.isTag)(a) ? a.name === "br" ? `
` : n(a.children) : (0, r.isCDATA)(a) ? n(a.children) : (0, r.isText)(a) ? a.data : "";
  }
  fe.getText = n;
  function c(a) {
    return Array.isArray(a) ? a.map(c).join("") : (0, r.hasChildren)(a) && !(0, r.isComment)(a) ? c(a.children) : (0, r.isText)(a) ? a.data : "";
  }
  fe.textContent = c;
  function p(a) {
    return Array.isArray(a) ? a.map(p).join("") : (0, r.hasChildren)(a) && (a.type === s.ElementType.Tag || (0, r.isCDATA)(a)) ? p(a.children) : (0, r.isText)(a) ? a.data : "";
  }
  return fe.innerText = p, fe;
}
var le = {}, Ou;
function Bi() {
  if (Ou) return le;
  Ou = 1, Object.defineProperty(le, "__esModule", { value: !0 }), le.prevElementSibling = le.nextElementSibling = le.getName = le.hasAttrib = le.getAttributeValue = le.getSiblings = le.getParent = le.getChildren = void 0;
  var e = /* @__PURE__ */ Oe();
  function r(a) {
    return (0, e.hasChildren)(a) ? a.children : [];
  }
  le.getChildren = r;
  function i(a) {
    return a.parent || null;
  }
  le.getParent = i;
  function s(a) {
    var l, h, t = i(a);
    if (t != null)
      return r(t);
    for (var u = [a], m = a.prev, v = a.next; m != null; )
      u.unshift(m), l = m, m = l.prev;
    for (; v != null; )
      u.push(v), h = v, v = h.next;
    return u;
  }
  le.getSiblings = s;
  function o(a, l) {
    var h;
    return (h = a.attribs) === null || h === void 0 ? void 0 : h[l];
  }
  le.getAttributeValue = o;
  function f(a, l) {
    return a.attribs != null && Object.prototype.hasOwnProperty.call(a.attribs, l) && a.attribs[l] != null;
  }
  le.hasAttrib = f;
  function n(a) {
    return a.name;
  }
  le.getName = n;
  function c(a) {
    for (var l, h = a.next; h !== null && !(0, e.isTag)(h); )
      l = h, h = l.next;
    return h;
  }
  le.nextElementSibling = c;
  function p(a) {
    for (var l, h = a.prev; h !== null && !(0, e.isTag)(h); )
      l = h, h = l.prev;
    return h;
  }
  return le.prevElementSibling = p, le;
}
var he = {}, Pu;
function Ri() {
  if (Pu) return he;
  Pu = 1, Object.defineProperty(he, "__esModule", { value: !0 }), he.prepend = he.prependChild = he.append = he.appendChild = he.replaceElement = he.removeElement = void 0;
  function e(n) {
    if (n.prev && (n.prev.next = n.next), n.next && (n.next.prev = n.prev), n.parent) {
      var c = n.parent.children, p = c.lastIndexOf(n);
      p >= 0 && c.splice(p, 1);
    }
    n.next = null, n.prev = null, n.parent = null;
  }
  he.removeElement = e;
  function r(n, c) {
    var p = c.prev = n.prev;
    p && (p.next = c);
    var a = c.next = n.next;
    a && (a.prev = c);
    var l = c.parent = n.parent;
    if (l) {
      var h = l.children;
      h[h.lastIndexOf(n)] = c, n.parent = null;
    }
  }
  he.replaceElement = r;
  function i(n, c) {
    if (e(c), c.next = null, c.parent = n, n.children.push(c) > 1) {
      var p = n.children[n.children.length - 2];
      p.next = c, c.prev = p;
    } else
      c.prev = null;
  }
  he.appendChild = i;
  function s(n, c) {
    e(c);
    var p = n.parent, a = n.next;
    if (c.next = a, c.prev = n, n.next = c, c.parent = p, a) {
      if (a.prev = c, p) {
        var l = p.children;
        l.splice(l.lastIndexOf(a), 0, c);
      }
    } else p && p.children.push(c);
  }
  he.append = s;
  function o(n, c) {
    if (e(c), c.parent = n, c.prev = null, n.children.unshift(c) !== 1) {
      var p = n.children[1];
      p.prev = c, c.next = p;
    } else
      c.next = null;
  }
  he.prependChild = o;
  function f(n, c) {
    e(c);
    var p = n.parent;
    if (p) {
      var a = p.children;
      a.splice(a.indexOf(n), 0, c);
    }
    n.prev && (n.prev.next = c), c.parent = p, c.prev = n.prev, c.next = n, n.prev = c;
  }
  return he.prepend = f, he;
}
var pe = {}, Lu;
function Er() {
  if (Lu) return pe;
  Lu = 1, Object.defineProperty(pe, "__esModule", { value: !0 }), pe.findAll = pe.existsOne = pe.findOne = pe.findOneChild = pe.find = pe.filter = void 0;
  var e = /* @__PURE__ */ Oe();
  function r(c, p, a, l) {
    return a === void 0 && (a = !0), l === void 0 && (l = 1 / 0), i(c, Array.isArray(p) ? p : [p], a, l);
  }
  pe.filter = r;
  function i(c, p, a, l) {
    for (var h = [], t = [p], u = [0]; ; ) {
      if (u[0] >= t[0].length) {
        if (u.length === 1)
          return h;
        t.shift(), u.shift();
        continue;
      }
      var m = t[0][u[0]++];
      if (c(m) && (h.push(m), --l <= 0))
        return h;
      a && (0, e.hasChildren)(m) && m.children.length > 0 && (u.unshift(0), t.unshift(m.children));
    }
  }
  pe.find = i;
  function s(c, p) {
    return p.find(c);
  }
  pe.findOneChild = s;
  function o(c, p, a) {
    a === void 0 && (a = !0);
    for (var l = null, h = 0; h < p.length && !l; h++) {
      var t = p[h];
      if ((0, e.isTag)(t))
        c(t) ? l = t : a && t.children.length > 0 && (l = o(c, t.children, !0));
      else continue;
    }
    return l;
  }
  pe.findOne = o;
  function f(c, p) {
    return p.some(function(a) {
      return (0, e.isTag)(a) && (c(a) || f(c, a.children));
    });
  }
  pe.existsOne = f;
  function n(c, p) {
    for (var a = [], l = [p], h = [0]; ; ) {
      if (h[0] >= l[0].length) {
        if (l.length === 1)
          return a;
        l.shift(), h.shift();
        continue;
      }
      var t = l[0][h[0]++];
      (0, e.isTag)(t) && (c(t) && a.push(t), t.children.length > 0 && (h.unshift(0), l.unshift(t.children)));
    }
  }
  return pe.findAll = n, pe;
}
var ye = {}, Iu;
function Ar() {
  if (Iu) return ye;
  Iu = 1, Object.defineProperty(ye, "__esModule", { value: !0 }), ye.getElementsByTagType = ye.getElementsByTagName = ye.getElementById = ye.getElements = ye.testElement = void 0;
  var e = /* @__PURE__ */ Oe(), r = /* @__PURE__ */ Er(), i = {
    tag_name: function(h) {
      return typeof h == "function" ? function(t) {
        return (0, e.isTag)(t) && h(t.name);
      } : h === "*" ? e.isTag : function(t) {
        return (0, e.isTag)(t) && t.name === h;
      };
    },
    tag_type: function(h) {
      return typeof h == "function" ? function(t) {
        return h(t.type);
      } : function(t) {
        return t.type === h;
      };
    },
    tag_contains: function(h) {
      return typeof h == "function" ? function(t) {
        return (0, e.isText)(t) && h(t.data);
      } : function(t) {
        return (0, e.isText)(t) && t.data === h;
      };
    }
  };
  function s(h, t) {
    return typeof t == "function" ? function(u) {
      return (0, e.isTag)(u) && t(u.attribs[h]);
    } : function(u) {
      return (0, e.isTag)(u) && u.attribs[h] === t;
    };
  }
  function o(h, t) {
    return function(u) {
      return h(u) || t(u);
    };
  }
  function f(h) {
    var t = Object.keys(h).map(function(u) {
      var m = h[u];
      return Object.prototype.hasOwnProperty.call(i, u) ? i[u](m) : s(u, m);
    });
    return t.length === 0 ? null : t.reduce(o);
  }
  function n(h, t) {
    var u = f(h);
    return u ? u(t) : !0;
  }
  ye.testElement = n;
  function c(h, t, u, m) {
    m === void 0 && (m = 1 / 0);
    var v = f(h);
    return v ? (0, r.filter)(v, t, u, m) : [];
  }
  ye.getElements = c;
  function p(h, t, u) {
    return u === void 0 && (u = !0), Array.isArray(t) || (t = [t]), (0, r.findOne)(s("id", h), t, u);
  }
  ye.getElementById = p;
  function a(h, t, u, m) {
    return u === void 0 && (u = !0), m === void 0 && (m = 1 / 0), (0, r.filter)(i.tag_name(h), t, u, m);
  }
  ye.getElementsByTagName = a;
  function l(h, t, u, m) {
    return u === void 0 && (u = !0), m === void 0 && (m = 1 / 0), (0, r.filter)(i.tag_type(h), t, u, m);
  }
  return ye.getElementsByTagType = l, ye;
}
var gt = {}, Nu;
function Vi() {
  return Nu || (Nu = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.uniqueSort = e.compareDocumentPosition = e.DocumentPosition = e.removeSubsets = void 0;
    var r = /* @__PURE__ */ Oe();
    function i(n) {
      for (var c = n.length; --c >= 0; ) {
        var p = n[c];
        if (c > 0 && n.lastIndexOf(p, c - 1) >= 0) {
          n.splice(c, 1);
          continue;
        }
        for (var a = p.parent; a; a = a.parent)
          if (n.includes(a)) {
            n.splice(c, 1);
            break;
          }
      }
      return n;
    }
    e.removeSubsets = i;
    var s;
    (function(n) {
      n[n.DISCONNECTED = 1] = "DISCONNECTED", n[n.PRECEDING = 2] = "PRECEDING", n[n.FOLLOWING = 4] = "FOLLOWING", n[n.CONTAINS = 8] = "CONTAINS", n[n.CONTAINED_BY = 16] = "CONTAINED_BY";
    })(s = e.DocumentPosition || (e.DocumentPosition = {}));
    function o(n, c) {
      var p = [], a = [];
      if (n === c)
        return 0;
      for (var l = (0, r.hasChildren)(n) ? n : n.parent; l; )
        p.unshift(l), l = l.parent;
      for (l = (0, r.hasChildren)(c) ? c : c.parent; l; )
        a.unshift(l), l = l.parent;
      for (var h = Math.min(p.length, a.length), t = 0; t < h && p[t] === a[t]; )
        t++;
      if (t === 0)
        return s.DISCONNECTED;
      var u = p[t - 1], m = u.children, v = p[t], y = a[t];
      return m.indexOf(v) > m.indexOf(y) ? u === c ? s.FOLLOWING | s.CONTAINED_BY : s.FOLLOWING : u === n ? s.PRECEDING | s.CONTAINS : s.PRECEDING;
    }
    e.compareDocumentPosition = o;
    function f(n) {
      return n = n.filter(function(c, p, a) {
        return !a.includes(c, p + 1);
      }), n.sort(function(c, p) {
        var a = o(c, p);
        return a & s.PRECEDING ? -1 : a & s.FOLLOWING ? 1 : 0;
      }), n;
    }
    e.uniqueSort = f;
  }(gt)), gt;
}
var He = {}, _u;
function Fi() {
  if (_u) return He;
  _u = 1, Object.defineProperty(He, "__esModule", { value: !0 }), He.getFeed = void 0;
  var e = /* @__PURE__ */ xr(), r = /* @__PURE__ */ Ar();
  function i(t) {
    var u = p(h, t);
    return u ? u.name === "feed" ? s(u) : o(u) : null;
  }
  He.getFeed = i;
  function s(t) {
    var u, m = t.children, v = {
      type: "atom",
      items: (0, r.getElementsByTagName)("entry", m).map(function(g) {
        var w, x = g.children, b = { media: c(x) };
        l(b, "id", "id", x), l(b, "title", "title", x);
        var S = (w = p("link", x)) === null || w === void 0 ? void 0 : w.attribs.href;
        S && (b.link = S);
        var E = a("summary", x) || a("content", x);
        E && (b.description = E);
        var k = a("updated", x);
        return k && (b.pubDate = new Date(k)), b;
      })
    };
    l(v, "id", "id", m), l(v, "title", "title", m);
    var y = (u = p("link", m)) === null || u === void 0 ? void 0 : u.attribs.href;
    y && (v.link = y), l(v, "description", "subtitle", m);
    var d = a("updated", m);
    return d && (v.updated = new Date(d)), l(v, "author", "email", m, !0), v;
  }
  function o(t) {
    var u, m, v = (m = (u = p("channel", t.children)) === null || u === void 0 ? void 0 : u.children) !== null && m !== void 0 ? m : [], y = {
      type: t.name.substr(0, 3),
      id: "",
      items: (0, r.getElementsByTagName)("item", t.children).map(function(g) {
        var w = g.children, x = { media: c(w) };
        l(x, "id", "guid", w), l(x, "title", "title", w), l(x, "link", "link", w), l(x, "description", "description", w);
        var b = a("pubDate", w) || a("dc:date", w);
        return b && (x.pubDate = new Date(b)), x;
      })
    };
    l(y, "title", "title", v), l(y, "link", "link", v), l(y, "description", "description", v);
    var d = a("lastBuildDate", v);
    return d && (y.updated = new Date(d)), l(y, "author", "managingEditor", v, !0), y;
  }
  var f = ["url", "type", "lang"], n = [
    "fileSize",
    "bitrate",
    "framerate",
    "samplingrate",
    "channels",
    "duration",
    "height",
    "width"
  ];
  function c(t) {
    return (0, r.getElementsByTagName)("media:content", t).map(function(u) {
      for (var m = u.attribs, v = {
        medium: m.medium,
        isDefault: !!m.isDefault
      }, y = 0, d = f; y < d.length; y++) {
        var g = d[y];
        m[g] && (v[g] = m[g]);
      }
      for (var w = 0, x = n; w < x.length; w++) {
        var g = x[w];
        m[g] && (v[g] = parseInt(m[g], 10));
      }
      return m.expression && (v.expression = m.expression), v;
    });
  }
  function p(t, u) {
    return (0, r.getElementsByTagName)(t, u, !0, 1)[0];
  }
  function a(t, u, m) {
    return m === void 0 && (m = !1), (0, e.textContent)((0, r.getElementsByTagName)(t, u, m, 1)).trim();
  }
  function l(t, u, m, v, y) {
    y === void 0 && (y = !1);
    var d = a(m, v, y);
    d && (t[u] = d);
  }
  function h(t) {
    return t === "rss" || t === "feed" || t === "rdf:RDF";
  }
  return He;
}
var $u;
function yt() {
  return $u || ($u = 1, function(e) {
    var r = Ne && Ne.__createBinding || (Object.create ? function(o, f, n, c) {
      c === void 0 && (c = n);
      var p = Object.getOwnPropertyDescriptor(f, n);
      (!p || ("get" in p ? !f.__esModule : p.writable || p.configurable)) && (p = { enumerable: !0, get: function() {
        return f[n];
      } }), Object.defineProperty(o, c, p);
    } : function(o, f, n, c) {
      c === void 0 && (c = n), o[c] = f[n];
    }), i = Ne && Ne.__exportStar || function(o, f) {
      for (var n in o) n !== "default" && !Object.prototype.hasOwnProperty.call(f, n) && r(f, o, n);
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.hasChildren = e.isDocument = e.isComment = e.isText = e.isCDATA = e.isTag = void 0, i(/* @__PURE__ */ xr(), e), i(/* @__PURE__ */ Bi(), e), i(/* @__PURE__ */ Ri(), e), i(/* @__PURE__ */ Er(), e), i(/* @__PURE__ */ Ar(), e), i(/* @__PURE__ */ Vi(), e), i(/* @__PURE__ */ Fi(), e);
    var s = /* @__PURE__ */ Oe();
    Object.defineProperty(e, "isTag", { enumerable: !0, get: function() {
      return s.isTag;
    } }), Object.defineProperty(e, "isCDATA", { enumerable: !0, get: function() {
      return s.isCDATA;
    } }), Object.defineProperty(e, "isText", { enumerable: !0, get: function() {
      return s.isText;
    } }), Object.defineProperty(e, "isComment", { enumerable: !0, get: function() {
      return s.isComment;
    } }), Object.defineProperty(e, "isDocument", { enumerable: !0, get: function() {
      return s.isDocument;
    } }), Object.defineProperty(e, "hasChildren", { enumerable: !0, get: function() {
      return s.hasChildren;
    } });
  }(Ne)), Ne;
}
var Mu;
function ji() {
  return Mu || (Mu = 1, function(e) {
    var r = Se && Se.__createBinding || (Object.create ? function(d, g, w, x) {
      x === void 0 && (x = w);
      var b = Object.getOwnPropertyDescriptor(g, w);
      (!b || ("get" in b ? !g.__esModule : b.writable || b.configurable)) && (b = { enumerable: !0, get: function() {
        return g[w];
      } }), Object.defineProperty(d, x, b);
    } : function(d, g, w, x) {
      x === void 0 && (x = w), d[x] = g[w];
    }), i = Se && Se.__setModuleDefault || (Object.create ? function(d, g) {
      Object.defineProperty(d, "default", { enumerable: !0, value: g });
    } : function(d, g) {
      d.default = g;
    }), s = Se && Se.__importStar || function(d) {
      if (d && d.__esModule) return d;
      var g = {};
      if (d != null) for (var w in d) w !== "default" && Object.prototype.hasOwnProperty.call(d, w) && r(g, d, w);
      return i(g, d), g;
    }, o = Se && Se.__importDefault || function(d) {
      return d && d.__esModule ? d : { default: d };
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.DomUtils = e.parseFeed = e.getFeed = e.ElementType = e.Tokenizer = e.createDomStream = e.parseDOM = e.parseDocument = e.DefaultHandler = e.DomHandler = e.Parser = void 0;
    var f = /* @__PURE__ */ gu(), n = /* @__PURE__ */ gu();
    Object.defineProperty(e, "Parser", { enumerable: !0, get: function() {
      return n.Parser;
    } });
    var c = /* @__PURE__ */ Oe(), p = /* @__PURE__ */ Oe();
    Object.defineProperty(e, "DomHandler", { enumerable: !0, get: function() {
      return p.DomHandler;
    } }), Object.defineProperty(e, "DefaultHandler", { enumerable: !0, get: function() {
      return p.DomHandler;
    } });
    function a(d, g) {
      var w = new c.DomHandler(void 0, g);
      return new f.Parser(w, g).end(d), w.root;
    }
    e.parseDocument = a;
    function l(d, g) {
      return a(d, g).children;
    }
    e.parseDOM = l;
    function h(d, g, w) {
      var x = new c.DomHandler(d, g, w);
      return new f.Parser(x, g);
    }
    e.createDomStream = h;
    var t = /* @__PURE__ */ Sr();
    Object.defineProperty(e, "Tokenizer", { enumerable: !0, get: function() {
      return o(t).default;
    } }), e.ElementType = s(/* @__PURE__ */ ze());
    var u = /* @__PURE__ */ yt(), m = /* @__PURE__ */ yt();
    Object.defineProperty(e, "getFeed", { enumerable: !0, get: function() {
      return m.getFeed;
    } });
    var v = { xmlMode: !0 };
    function y(d, g) {
      return g === void 0 && (g = v), (0, u.getFeed)(l(d, g));
    }
    e.parseFeed = y, e.DomUtils = s(/* @__PURE__ */ yt());
  }(Se)), Se;
}
var vt, Bu;
function Ui() {
  return Bu || (Bu = 1, vt = (e) => {
    if (typeof e != "string")
      throw new TypeError("Expected a string");
    return e.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
  }), vt;
}
var Qe = {}, Ru;
function Hi() {
  if (Ru) return Qe;
  Ru = 1, Object.defineProperty(Qe, "__esModule", { value: !0 });
  /*!
   * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   */
  function e(i) {
    return Object.prototype.toString.call(i) === "[object Object]";
  }
  function r(i) {
    var s, o;
    return e(i) === !1 ? !1 : (s = i.constructor, s === void 0 ? !0 : (o = s.prototype, !(e(o) === !1 || o.hasOwnProperty("isPrototypeOf") === !1)));
  }
  return Qe.isPlainObject = r, Qe;
}
var wt, Vu;
function zi() {
  if (Vu) return wt;
  Vu = 1;
  var e = function(g) {
    return r(g) && !i(g);
  };
  function r(d) {
    return !!d && typeof d == "object";
  }
  function i(d) {
    var g = Object.prototype.toString.call(d);
    return g === "[object RegExp]" || g === "[object Date]" || f(d);
  }
  var s = typeof Symbol == "function" && Symbol.for, o = s ? Symbol.for("react.element") : 60103;
  function f(d) {
    return d.$$typeof === o;
  }
  function n(d) {
    return Array.isArray(d) ? [] : {};
  }
  function c(d, g) {
    return g.clone !== !1 && g.isMergeableObject(d) ? v(n(d), d, g) : d;
  }
  function p(d, g, w) {
    return d.concat(g).map(function(x) {
      return c(x, w);
    });
  }
  function a(d, g) {
    if (!g.customMerge)
      return v;
    var w = g.customMerge(d);
    return typeof w == "function" ? w : v;
  }
  function l(d) {
    return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(d).filter(function(g) {
      return Object.propertyIsEnumerable.call(d, g);
    }) : [];
  }
  function h(d) {
    return Object.keys(d).concat(l(d));
  }
  function t(d, g) {
    try {
      return g in d;
    } catch {
      return !1;
    }
  }
  function u(d, g) {
    return t(d, g) && !(Object.hasOwnProperty.call(d, g) && Object.propertyIsEnumerable.call(d, g));
  }
  function m(d, g, w) {
    var x = {};
    return w.isMergeableObject(d) && h(d).forEach(function(b) {
      x[b] = c(d[b], w);
    }), h(g).forEach(function(b) {
      u(d, b) || (t(d, b) && w.isMergeableObject(g[b]) ? x[b] = a(b, w)(d[b], g[b], w) : x[b] = c(g[b], w));
    }), x;
  }
  function v(d, g, w) {
    w = w || {}, w.arrayMerge = w.arrayMerge || p, w.isMergeableObject = w.isMergeableObject || e, w.cloneUnlessOtherwiseSpecified = c;
    var x = Array.isArray(g), b = Array.isArray(d), S = x === b;
    return S ? x ? w.arrayMerge(d, g, w) : m(d, g, w) : c(g, w);
  }
  v.all = function(g, w) {
    if (!Array.isArray(g))
      throw new Error("first argument should be an array");
    return g.reduce(function(x, b) {
      return v(x, b, w);
    }, {});
  };
  var y = v;
  return wt = y, wt;
}
var tt = { exports: {} }, Gi = tt.exports, Fu;
function Yi() {
  return Fu || (Fu = 1, function(e) {
    (function(r, i) {
      e.exports ? e.exports = i() : r.parseSrcset = i();
    })(Gi, function() {
      return function(r) {
        function i(x) {
          return x === " " || // space
          x === "	" || // horizontal tab
          x === `
` || // new line
          x === "\f" || // form feed
          x === "\r";
        }
        function s(x) {
          var b, S = x.exec(r.substring(y));
          if (S)
            return b = S[0], y += b.length, b;
        }
        for (var o = r.length, f = /^[ \t\n\r\u000c]+/, n = /^[, \t\n\r\u000c]+/, c = /^[^ \t\n\r\u000c]+/, p = /[,]+$/, a = /^\d+$/, l = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/, h, t, u, m, v, y = 0, d = []; ; ) {
          if (s(n), y >= o)
            return d;
          h = s(c), t = [], h.slice(-1) === "," ? (h = h.replace(p, ""), w()) : g();
        }
        function g() {
          for (s(f), u = "", m = "in descriptor"; ; ) {
            if (v = r.charAt(y), m === "in descriptor")
              if (i(v))
                u && (t.push(u), u = "", m = "after descriptor");
              else if (v === ",") {
                y += 1, u && t.push(u), w();
                return;
              } else if (v === "(")
                u = u + v, m = "in parens";
              else if (v === "") {
                u && t.push(u), w();
                return;
              } else
                u = u + v;
            else if (m === "in parens")
              if (v === ")")
                u = u + v, m = "in descriptor";
              else if (v === "") {
                t.push(u), w();
                return;
              } else
                u = u + v;
            else if (m === "after descriptor" && !i(v))
              if (v === "") {
                w();
                return;
              } else
                m = "in descriptor", y -= 1;
            y += 1;
          }
        }
        function w() {
          var x = !1, b, S, E, k, O = {}, P, A, T, L, M;
          for (k = 0; k < t.length; k++)
            P = t[k], A = P[P.length - 1], T = P.substring(0, P.length - 1), L = parseInt(T, 10), M = parseFloat(T), a.test(T) && A === "w" ? ((b || S) && (x = !0), L === 0 ? x = !0 : b = L) : l.test(T) && A === "x" ? ((b || S || E) && (x = !0), M < 0 ? x = !0 : S = M) : a.test(T) && A === "h" ? ((E || S) && (x = !0), L === 0 ? x = !0 : E = L) : x = !0;
          x ? console && console.log && console.log("Invalid srcset descriptor found in '" + r + "' at '" + P + "'.") : (O.url = h, b && (O.w = b), S && (O.d = S), E && (O.h = E), d.push(O));
        }
      };
    });
  }(tt)), tt.exports;
}
var Ze = { exports: {} }, ju;
function Wi() {
  if (ju) return Ze.exports;
  ju = 1;
  var e = String, r = function() {
    return { isColorSupported: !1, reset: e, bold: e, dim: e, italic: e, underline: e, inverse: e, hidden: e, strikethrough: e, black: e, red: e, green: e, yellow: e, blue: e, magenta: e, cyan: e, white: e, gray: e, bgBlack: e, bgRed: e, bgGreen: e, bgYellow: e, bgBlue: e, bgMagenta: e, bgCyan: e, bgWhite: e, blackBright: e, redBright: e, greenBright: e, yellowBright: e, blueBright: e, magentaBright: e, cyanBright: e, whiteBright: e, bgBlackBright: e, bgRedBright: e, bgGreenBright: e, bgYellowBright: e, bgBlueBright: e, bgMagentaBright: e, bgCyanBright: e, bgWhiteBright: e };
  };
  return Ze.exports = r(), Ze.exports.createColors = r, Ze.exports;
}
const Ki = {}, Ji = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ki
}, Symbol.toStringTag, { value: "Module" })), ke = /* @__PURE__ */ Pi(Ji);
var St, Uu;
function eu() {
  if (Uu) return St;
  Uu = 1;
  let e = /* @__PURE__ */ Wi(), r = ke;
  class i extends Error {
    constructor(o, f, n, c, p, a) {
      super(o), this.name = "CssSyntaxError", this.reason = o, p && (this.file = p), c && (this.source = c), a && (this.plugin = a), typeof f < "u" && typeof n < "u" && (typeof f == "number" ? (this.line = f, this.column = n) : (this.line = f.line, this.column = f.column, this.endLine = n.line, this.endColumn = n.column)), this.setMessage(), Error.captureStackTrace && Error.captureStackTrace(this, i);
    }
    setMessage() {
      this.message = this.plugin ? this.plugin + ": " : "", this.message += this.file ? this.file : "<css input>", typeof this.line < "u" && (this.message += ":" + this.line + ":" + this.column), this.message += ": " + this.reason;
    }
    showSourceCode(o) {
      if (!this.source) return "";
      let f = this.source;
      o == null && (o = e.isColorSupported);
      let n = (u) => u, c = (u) => u, p = (u) => u;
      if (o) {
        let { bold: u, gray: m, red: v } = e.createColors(!0);
        c = (y) => u(v(y)), n = (y) => m(y), r && (p = (y) => r(y));
      }
      let a = f.split(/\r?\n/), l = Math.max(this.line - 3, 0), h = Math.min(this.line + 2, a.length), t = String(h).length;
      return a.slice(l, h).map((u, m) => {
        let v = l + 1 + m, y = " " + (" " + v).slice(-t) + " | ";
        if (v === this.line) {
          if (u.length > 160) {
            let g = 20, w = Math.max(0, this.column - g), x = Math.max(
              this.column + g,
              this.endColumn + g
            ), b = u.slice(w, x), S = n(y.replace(/\d/g, " ")) + u.slice(0, Math.min(this.column - 1, g - 1)).replace(/[^\t]/g, " ");
            return c(">") + n(y) + p(b) + `
 ` + S + c("^");
          }
          let d = n(y.replace(/\d/g, " ")) + u.slice(0, this.column - 1).replace(/[^\t]/g, " ");
          return c(">") + n(y) + p(u) + `
 ` + d + c("^");
        }
        return " " + n(y) + p(u);
      }).join(`
`);
    }
    toString() {
      let o = this.showSourceCode();
      return o && (o = `

` + o + `
`), this.name + ": " + this.message + o;
    }
  }
  return St = i, i.default = i, St;
}
var xt, Hu;
function kr() {
  if (Hu) return xt;
  Hu = 1;
  const e = {
    after: `
`,
    beforeClose: `
`,
    beforeComment: `
`,
    beforeDecl: `
`,
    beforeOpen: " ",
    beforeRule: `
`,
    colon: ": ",
    commentLeft: " ",
    commentRight: " ",
    emptyBody: "",
    indent: "    ",
    semicolon: !1
  };
  function r(s) {
    return s[0].toUpperCase() + s.slice(1);
  }
  class i {
    constructor(o) {
      this.builder = o;
    }
    atrule(o, f) {
      let n = "@" + o.name, c = o.params ? this.rawValue(o, "params") : "";
      if (typeof o.raws.afterName < "u" ? n += o.raws.afterName : c && (n += " "), o.nodes)
        this.block(o, n + c);
      else {
        let p = (o.raws.between || "") + (f ? ";" : "");
        this.builder(n + c + p, o);
      }
    }
    beforeAfter(o, f) {
      let n;
      o.type === "decl" ? n = this.raw(o, null, "beforeDecl") : o.type === "comment" ? n = this.raw(o, null, "beforeComment") : f === "before" ? n = this.raw(o, null, "beforeRule") : n = this.raw(o, null, "beforeClose");
      let c = o.parent, p = 0;
      for (; c && c.type !== "root"; )
        p += 1, c = c.parent;
      if (n.includes(`
`)) {
        let a = this.raw(o, null, "indent");
        if (a.length)
          for (let l = 0; l < p; l++) n += a;
      }
      return n;
    }
    block(o, f) {
      let n = this.raw(o, "between", "beforeOpen");
      this.builder(f + n + "{", o, "start");
      let c;
      o.nodes && o.nodes.length ? (this.body(o), c = this.raw(o, "after")) : c = this.raw(o, "after", "emptyBody"), c && this.builder(c), this.builder("}", o, "end");
    }
    body(o) {
      let f = o.nodes.length - 1;
      for (; f > 0 && o.nodes[f].type === "comment"; )
        f -= 1;
      let n = this.raw(o, "semicolon");
      for (let c = 0; c < o.nodes.length; c++) {
        let p = o.nodes[c], a = this.raw(p, "before");
        a && this.builder(a), this.stringify(p, f !== c || n);
      }
    }
    comment(o) {
      let f = this.raw(o, "left", "commentLeft"), n = this.raw(o, "right", "commentRight");
      this.builder("/*" + f + o.text + n + "*/", o);
    }
    decl(o, f) {
      let n = this.raw(o, "between", "colon"), c = o.prop + n + this.rawValue(o, "value");
      o.important && (c += o.raws.important || " !important"), f && (c += ";"), this.builder(c, o);
    }
    document(o) {
      this.body(o);
    }
    raw(o, f, n) {
      let c;
      if (n || (n = f), f && (c = o.raws[f], typeof c < "u"))
        return c;
      let p = o.parent;
      if (n === "before" && (!p || p.type === "root" && p.first === o || p && p.type === "document"))
        return "";
      if (!p) return e[n];
      let a = o.root();
      if (a.rawCache || (a.rawCache = {}), typeof a.rawCache[n] < "u")
        return a.rawCache[n];
      if (n === "before" || n === "after")
        return this.beforeAfter(o, n);
      {
        let l = "raw" + r(n);
        this[l] ? c = this[l](a, o) : a.walk((h) => {
          if (c = h.raws[f], typeof c < "u") return !1;
        });
      }
      return typeof c > "u" && (c = e[n]), a.rawCache[n] = c, c;
    }
    rawBeforeClose(o) {
      let f;
      return o.walk((n) => {
        if (n.nodes && n.nodes.length > 0 && typeof n.raws.after < "u")
          return f = n.raws.after, f.includes(`
`) && (f = f.replace(/[^\n]+$/, "")), !1;
      }), f && (f = f.replace(/\S/g, "")), f;
    }
    rawBeforeComment(o, f) {
      let n;
      return o.walkComments((c) => {
        if (typeof c.raws.before < "u")
          return n = c.raws.before, n.includes(`
`) && (n = n.replace(/[^\n]+$/, "")), !1;
      }), typeof n > "u" ? n = this.raw(f, null, "beforeDecl") : n && (n = n.replace(/\S/g, "")), n;
    }
    rawBeforeDecl(o, f) {
      let n;
      return o.walkDecls((c) => {
        if (typeof c.raws.before < "u")
          return n = c.raws.before, n.includes(`
`) && (n = n.replace(/[^\n]+$/, "")), !1;
      }), typeof n > "u" ? n = this.raw(f, null, "beforeRule") : n && (n = n.replace(/\S/g, "")), n;
    }
    rawBeforeOpen(o) {
      let f;
      return o.walk((n) => {
        if (n.type !== "decl" && (f = n.raws.between, typeof f < "u"))
          return !1;
      }), f;
    }
    rawBeforeRule(o) {
      let f;
      return o.walk((n) => {
        if (n.nodes && (n.parent !== o || o.first !== n) && typeof n.raws.before < "u")
          return f = n.raws.before, f.includes(`
`) && (f = f.replace(/[^\n]+$/, "")), !1;
      }), f && (f = f.replace(/\S/g, "")), f;
    }
    rawColon(o) {
      let f;
      return o.walkDecls((n) => {
        if (typeof n.raws.between < "u")
          return f = n.raws.between.replace(/[^\s:]/g, ""), !1;
      }), f;
    }
    rawEmptyBody(o) {
      let f;
      return o.walk((n) => {
        if (n.nodes && n.nodes.length === 0 && (f = n.raws.after, typeof f < "u"))
          return !1;
      }), f;
    }
    rawIndent(o) {
      if (o.raws.indent) return o.raws.indent;
      let f;
      return o.walk((n) => {
        let c = n.parent;
        if (c && c !== o && c.parent && c.parent === o && typeof n.raws.before < "u") {
          let p = n.raws.before.split(`
`);
          return f = p[p.length - 1], f = f.replace(/\S/g, ""), !1;
        }
      }), f;
    }
    rawSemicolon(o) {
      let f;
      return o.walk((n) => {
        if (n.nodes && n.nodes.length && n.last.type === "decl" && (f = n.raws.semicolon, typeof f < "u"))
          return !1;
      }), f;
    }
    rawValue(o, f) {
      let n = o[f], c = o.raws[f];
      return c && c.value === n ? c.raw : n;
    }
    root(o) {
      this.body(o), o.raws.after && this.builder(o.raws.after);
    }
    rule(o) {
      this.block(o, this.rawValue(o, "selector")), o.raws.ownSemicolon && this.builder(o.raws.ownSemicolon, o, "end");
    }
    stringify(o, f) {
      if (!this[o.type])
        throw new Error(
          "Unknown AST node type " + o.type + ". Maybe you need to change PostCSS stringifier."
        );
      this[o.type](o, f);
    }
  }
  return xt = i, i.default = i, xt;
}
var Et, zu;
function it() {
  if (zu) return Et;
  zu = 1;
  let e = kr();
  function r(i, s) {
    new e(s).stringify(i);
  }
  return Et = r, r.default = r, Et;
}
var et = {}, Gu;
function tu() {
  return Gu || (Gu = 1, et.isClean = Symbol("isClean"), et.my = Symbol("my")), et;
}
var At, Yu;
function nt() {
  if (Yu) return At;
  Yu = 1;
  let e = eu(), r = kr(), i = it(), { isClean: s, my: o } = tu();
  function f(p, a) {
    let l = new p.constructor();
    for (let h in p) {
      if (!Object.prototype.hasOwnProperty.call(p, h) || h === "proxyCache") continue;
      let t = p[h], u = typeof t;
      h === "parent" && u === "object" ? a && (l[h] = a) : h === "source" ? l[h] = t : Array.isArray(t) ? l[h] = t.map((m) => f(m, l)) : (u === "object" && t !== null && (t = f(t)), l[h] = t);
    }
    return l;
  }
  function n(p, a) {
    if (a && typeof a.offset < "u")
      return a.offset;
    let l = 1, h = 1, t = 0;
    for (let u = 0; u < p.length; u++) {
      if (h === a.line && l === a.column) {
        t = u;
        break;
      }
      p[u] === `
` ? (l = 1, h += 1) : l += 1;
    }
    return t;
  }
  class c {
    constructor(a = {}) {
      this.raws = {}, this[s] = !1, this[o] = !0;
      for (let l in a)
        if (l === "nodes") {
          this.nodes = [];
          for (let h of a[l])
            typeof h.clone == "function" ? this.append(h.clone()) : this.append(h);
        } else
          this[l] = a[l];
    }
    addToError(a) {
      if (a.postcssNode = this, a.stack && this.source && /\n\s{4}at /.test(a.stack)) {
        let l = this.source;
        a.stack = a.stack.replace(
          /\n\s{4}at /,
          `$&${l.input.from}:${l.start.line}:${l.start.column}$&`
        );
      }
      return a;
    }
    after(a) {
      return this.parent.insertAfter(this, a), this;
    }
    assign(a = {}) {
      for (let l in a)
        this[l] = a[l];
      return this;
    }
    before(a) {
      return this.parent.insertBefore(this, a), this;
    }
    cleanRaws(a) {
      delete this.raws.before, delete this.raws.after, a || delete this.raws.between;
    }
    clone(a = {}) {
      let l = f(this);
      for (let h in a)
        l[h] = a[h];
      return l;
    }
    cloneAfter(a = {}) {
      let l = this.clone(a);
      return this.parent.insertAfter(this, l), l;
    }
    cloneBefore(a = {}) {
      let l = this.clone(a);
      return this.parent.insertBefore(this, l), l;
    }
    error(a, l = {}) {
      if (this.source) {
        let { end: h, start: t } = this.rangeBy(l);
        return this.source.input.error(
          a,
          { column: t.column, line: t.line },
          { column: h.column, line: h.line },
          l
        );
      }
      return new e(a);
    }
    getProxyProcessor() {
      return {
        get(a, l) {
          return l === "proxyOf" ? a : l === "root" ? () => a.root().toProxy() : a[l];
        },
        set(a, l, h) {
          return a[l] === h || (a[l] = h, (l === "prop" || l === "value" || l === "name" || l === "params" || l === "important" || /* c8 ignore next */
          l === "text") && a.markDirty()), !0;
        }
      };
    }
    /* c8 ignore next 3 */
    markClean() {
      this[s] = !0;
    }
    markDirty() {
      if (this[s]) {
        this[s] = !1;
        let a = this;
        for (; a = a.parent; )
          a[s] = !1;
      }
    }
    next() {
      if (!this.parent) return;
      let a = this.parent.index(this);
      return this.parent.nodes[a + 1];
    }
    positionBy(a) {
      let l = this.source.start;
      if (a.index)
        l = this.positionInside(a.index);
      else if (a.word) {
        let h = "document" in this.source.input ? this.source.input.document : this.source.input.css, u = h.slice(
          n(h, this.source.start),
          n(h, this.source.end)
        ).indexOf(a.word);
        u !== -1 && (l = this.positionInside(u));
      }
      return l;
    }
    positionInside(a) {
      let l = this.source.start.column, h = this.source.start.line, t = "document" in this.source.input ? this.source.input.document : this.source.input.css, u = n(t, this.source.start), m = u + a;
      for (let v = u; v < m; v++)
        t[v] === `
` ? (l = 1, h += 1) : l += 1;
      return { column: l, line: h };
    }
    prev() {
      if (!this.parent) return;
      let a = this.parent.index(this);
      return this.parent.nodes[a - 1];
    }
    rangeBy(a) {
      let l = {
        column: this.source.start.column,
        line: this.source.start.line
      }, h = this.source.end ? {
        column: this.source.end.column + 1,
        line: this.source.end.line
      } : {
        column: l.column + 1,
        line: l.line
      };
      if (a.word) {
        let t = "document" in this.source.input ? this.source.input.document : this.source.input.css, m = t.slice(
          n(t, this.source.start),
          n(t, this.source.end)
        ).indexOf(a.word);
        m !== -1 && (l = this.positionInside(m), h = this.positionInside(
          m + a.word.length
        ));
      } else
        a.start ? l = {
          column: a.start.column,
          line: a.start.line
        } : a.index && (l = this.positionInside(a.index)), a.end ? h = {
          column: a.end.column,
          line: a.end.line
        } : typeof a.endIndex == "number" ? h = this.positionInside(a.endIndex) : a.index && (h = this.positionInside(a.index + 1));
      return (h.line < l.line || h.line === l.line && h.column <= l.column) && (h = { column: l.column + 1, line: l.line }), { end: h, start: l };
    }
    raw(a, l) {
      return new r().raw(this, a, l);
    }
    remove() {
      return this.parent && this.parent.removeChild(this), this.parent = void 0, this;
    }
    replaceWith(...a) {
      if (this.parent) {
        let l = this, h = !1;
        for (let t of a)
          t === this ? h = !0 : h ? (this.parent.insertAfter(l, t), l = t) : this.parent.insertBefore(l, t);
        h || this.remove();
      }
      return this;
    }
    root() {
      let a = this;
      for (; a.parent && a.parent.type !== "document"; )
        a = a.parent;
      return a;
    }
    toJSON(a, l) {
      let h = {}, t = l == null;
      l = l || /* @__PURE__ */ new Map();
      let u = 0;
      for (let m in this) {
        if (!Object.prototype.hasOwnProperty.call(this, m) || m === "parent" || m === "proxyCache") continue;
        let v = this[m];
        if (Array.isArray(v))
          h[m] = v.map((y) => typeof y == "object" && y.toJSON ? y.toJSON(null, l) : y);
        else if (typeof v == "object" && v.toJSON)
          h[m] = v.toJSON(null, l);
        else if (m === "source") {
          let y = l.get(v.input);
          y == null && (y = u, l.set(v.input, u), u++), h[m] = {
            end: v.end,
            inputId: y,
            start: v.start
          };
        } else
          h[m] = v;
      }
      return t && (h.inputs = [...l.keys()].map((m) => m.toJSON())), h;
    }
    toProxy() {
      return this.proxyCache || (this.proxyCache = new Proxy(this, this.getProxyProcessor())), this.proxyCache;
    }
    toString(a = i) {
      a.stringify && (a = a.stringify);
      let l = "";
      return a(this, (h) => {
        l += h;
      }), l;
    }
    warn(a, l, h) {
      let t = { node: this };
      for (let u in h) t[u] = h[u];
      return a.warn(l, t);
    }
    get proxyOf() {
      return this;
    }
  }
  return At = c, c.default = c, At;
}
var kt, Wu;
function st() {
  if (Wu) return kt;
  Wu = 1;
  let e = nt();
  class r extends e {
    constructor(s) {
      super(s), this.type = "comment";
    }
  }
  return kt = r, r.default = r, kt;
}
var qt, Ku;
function at() {
  if (Ku) return qt;
  Ku = 1;
  let e = nt();
  class r extends e {
    constructor(s) {
      s && typeof s.value < "u" && typeof s.value != "string" && (s = { ...s, value: String(s.value) }), super(s), this.type = "decl";
    }
    get variable() {
      return this.prop.startsWith("--") || this.prop[0] === "$";
    }
  }
  return qt = r, r.default = r, qt;
}
var Tt, Ju;
function Re() {
  if (Ju) return Tt;
  Ju = 1;
  let e = st(), r = at(), i = nt(), { isClean: s, my: o } = tu(), f, n, c, p;
  function a(t) {
    return t.map((u) => (u.nodes && (u.nodes = a(u.nodes)), delete u.source, u));
  }
  function l(t) {
    if (t[s] = !1, t.proxyOf.nodes)
      for (let u of t.proxyOf.nodes)
        l(u);
  }
  class h extends i {
    append(...u) {
      for (let m of u) {
        let v = this.normalize(m, this.last);
        for (let y of v) this.proxyOf.nodes.push(y);
      }
      return this.markDirty(), this;
    }
    cleanRaws(u) {
      if (super.cleanRaws(u), this.nodes)
        for (let m of this.nodes) m.cleanRaws(u);
    }
    each(u) {
      if (!this.proxyOf.nodes) return;
      let m = this.getIterator(), v, y;
      for (; this.indexes[m] < this.proxyOf.nodes.length && (v = this.indexes[m], y = u(this.proxyOf.nodes[v], v), y !== !1); )
        this.indexes[m] += 1;
      return delete this.indexes[m], y;
    }
    every(u) {
      return this.nodes.every(u);
    }
    getIterator() {
      this.lastEach || (this.lastEach = 0), this.indexes || (this.indexes = {}), this.lastEach += 1;
      let u = this.lastEach;
      return this.indexes[u] = 0, u;
    }
    getProxyProcessor() {
      return {
        get(u, m) {
          return m === "proxyOf" ? u : u[m] ? m === "each" || typeof m == "string" && m.startsWith("walk") ? (...v) => u[m](
            ...v.map((y) => typeof y == "function" ? (d, g) => y(d.toProxy(), g) : y)
          ) : m === "every" || m === "some" ? (v) => u[m](
            (y, ...d) => v(y.toProxy(), ...d)
          ) : m === "root" ? () => u.root().toProxy() : m === "nodes" ? u.nodes.map((v) => v.toProxy()) : m === "first" || m === "last" ? u[m].toProxy() : u[m] : u[m];
        },
        set(u, m, v) {
          return u[m] === v || (u[m] = v, (m === "name" || m === "params" || m === "selector") && u.markDirty()), !0;
        }
      };
    }
    index(u) {
      return typeof u == "number" ? u : (u.proxyOf && (u = u.proxyOf), this.proxyOf.nodes.indexOf(u));
    }
    insertAfter(u, m) {
      let v = this.index(u), y = this.normalize(m, this.proxyOf.nodes[v]).reverse();
      v = this.index(u);
      for (let g of y) this.proxyOf.nodes.splice(v + 1, 0, g);
      let d;
      for (let g in this.indexes)
        d = this.indexes[g], v < d && (this.indexes[g] = d + y.length);
      return this.markDirty(), this;
    }
    insertBefore(u, m) {
      let v = this.index(u), y = v === 0 ? "prepend" : !1, d = this.normalize(
        m,
        this.proxyOf.nodes[v],
        y
      ).reverse();
      v = this.index(u);
      for (let w of d) this.proxyOf.nodes.splice(v, 0, w);
      let g;
      for (let w in this.indexes)
        g = this.indexes[w], v <= g && (this.indexes[w] = g + d.length);
      return this.markDirty(), this;
    }
    normalize(u, m) {
      if (typeof u == "string")
        u = a(n(u).nodes);
      else if (typeof u > "u")
        u = [];
      else if (Array.isArray(u)) {
        u = u.slice(0);
        for (let y of u)
          y.parent && y.parent.removeChild(y, "ignore");
      } else if (u.type === "root" && this.type !== "document") {
        u = u.nodes.slice(0);
        for (let y of u)
          y.parent && y.parent.removeChild(y, "ignore");
      } else if (u.type)
        u = [u];
      else if (u.prop) {
        if (typeof u.value > "u")
          throw new Error("Value field is missed in node creation");
        typeof u.value != "string" && (u.value = String(u.value)), u = [new r(u)];
      } else if (u.selector || u.selectors)
        u = [new p(u)];
      else if (u.name)
        u = [new f(u)];
      else if (u.text)
        u = [new e(u)];
      else
        throw new Error("Unknown node type in node creation");
      return u.map((y) => (y[o] || h.rebuild(y), y = y.proxyOf, y.parent && y.parent.removeChild(y), y[s] && l(y), y.raws || (y.raws = {}), typeof y.raws.before > "u" && m && typeof m.raws.before < "u" && (y.raws.before = m.raws.before.replace(/\S/g, "")), y.parent = this.proxyOf, y));
    }
    prepend(...u) {
      u = u.reverse();
      for (let m of u) {
        let v = this.normalize(m, this.first, "prepend").reverse();
        for (let y of v) this.proxyOf.nodes.unshift(y);
        for (let y in this.indexes)
          this.indexes[y] = this.indexes[y] + v.length;
      }
      return this.markDirty(), this;
    }
    push(u) {
      return u.parent = this, this.proxyOf.nodes.push(u), this;
    }
    removeAll() {
      for (let u of this.proxyOf.nodes) u.parent = void 0;
      return this.proxyOf.nodes = [], this.markDirty(), this;
    }
    removeChild(u) {
      u = this.index(u), this.proxyOf.nodes[u].parent = void 0, this.proxyOf.nodes.splice(u, 1);
      let m;
      for (let v in this.indexes)
        m = this.indexes[v], m >= u && (this.indexes[v] = m - 1);
      return this.markDirty(), this;
    }
    replaceValues(u, m, v) {
      return v || (v = m, m = {}), this.walkDecls((y) => {
        m.props && !m.props.includes(y.prop) || m.fast && !y.value.includes(m.fast) || (y.value = y.value.replace(u, v));
      }), this.markDirty(), this;
    }
    some(u) {
      return this.nodes.some(u);
    }
    walk(u) {
      return this.each((m, v) => {
        let y;
        try {
          y = u(m, v);
        } catch (d) {
          throw m.addToError(d);
        }
        return y !== !1 && m.walk && (y = m.walk(u)), y;
      });
    }
    walkAtRules(u, m) {
      return m ? u instanceof RegExp ? this.walk((v, y) => {
        if (v.type === "atrule" && u.test(v.name))
          return m(v, y);
      }) : this.walk((v, y) => {
        if (v.type === "atrule" && v.name === u)
          return m(v, y);
      }) : (m = u, this.walk((v, y) => {
        if (v.type === "atrule")
          return m(v, y);
      }));
    }
    walkComments(u) {
      return this.walk((m, v) => {
        if (m.type === "comment")
          return u(m, v);
      });
    }
    walkDecls(u, m) {
      return m ? u instanceof RegExp ? this.walk((v, y) => {
        if (v.type === "decl" && u.test(v.prop))
          return m(v, y);
      }) : this.walk((v, y) => {
        if (v.type === "decl" && v.prop === u)
          return m(v, y);
      }) : (m = u, this.walk((v, y) => {
        if (v.type === "decl")
          return m(v, y);
      }));
    }
    walkRules(u, m) {
      return m ? u instanceof RegExp ? this.walk((v, y) => {
        if (v.type === "rule" && u.test(v.selector))
          return m(v, y);
      }) : this.walk((v, y) => {
        if (v.type === "rule" && v.selector === u)
          return m(v, y);
      }) : (m = u, this.walk((v, y) => {
        if (v.type === "rule")
          return m(v, y);
      }));
    }
    get first() {
      if (this.proxyOf.nodes)
        return this.proxyOf.nodes[0];
    }
    get last() {
      if (this.proxyOf.nodes)
        return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
    }
  }
  return h.registerParse = (t) => {
    n = t;
  }, h.registerRule = (t) => {
    p = t;
  }, h.registerAtRule = (t) => {
    f = t;
  }, h.registerRoot = (t) => {
    c = t;
  }, Tt = h, h.default = h, h.rebuild = (t) => {
    t.type === "atrule" ? Object.setPrototypeOf(t, f.prototype) : t.type === "rule" ? Object.setPrototypeOf(t, p.prototype) : t.type === "decl" ? Object.setPrototypeOf(t, r.prototype) : t.type === "comment" ? Object.setPrototypeOf(t, e.prototype) : t.type === "root" && Object.setPrototypeOf(t, c.prototype), t[o] = !0, t.nodes && t.nodes.forEach((u) => {
      h.rebuild(u);
    });
  }, Tt;
}
var Dt, Xu;
function uu() {
  if (Xu) return Dt;
  Xu = 1;
  let e = Re();
  class r extends e {
    constructor(s) {
      super(s), this.type = "atrule";
    }
    append(...s) {
      return this.proxyOf.nodes || (this.nodes = []), super.append(...s);
    }
    prepend(...s) {
      return this.proxyOf.nodes || (this.nodes = []), super.prepend(...s);
    }
  }
  return Dt = r, r.default = r, e.registerAtRule(r), Dt;
}
var Ct, Qu;
function ru() {
  if (Qu) return Ct;
  Qu = 1;
  let e = Re(), r, i;
  class s extends e {
    constructor(f) {
      super({ type: "document", ...f }), this.nodes || (this.nodes = []);
    }
    toResult(f = {}) {
      return new r(new i(), this, f).stringify();
    }
  }
  return s.registerLazyResult = (o) => {
    r = o;
  }, s.registerProcessor = (o) => {
    i = o;
  }, Ct = s, s.default = s, Ct;
}
var Ot, Zu;
function Xi() {
  if (Zu) return Ot;
  Zu = 1;
  let e = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
  return Ot = { nanoid: (s = 21) => {
    let o = "", f = s | 0;
    for (; f--; )
      o += e[Math.random() * 64 | 0];
    return o;
  }, customAlphabet: (s, o = 21) => (f = o) => {
    let n = "", c = f | 0;
    for (; c--; )
      n += s[Math.random() * s.length | 0];
    return n;
  } }, Ot;
}
var Pt, er;
function qr() {
  if (er) return Pt;
  er = 1;
  let { existsSync: e, readFileSync: r } = ke, { dirname: i, join: s } = ke, { SourceMapConsumer: o, SourceMapGenerator: f } = ke;
  function n(p) {
    return Buffer ? Buffer.from(p, "base64").toString() : window.atob(p);
  }
  class c {
    constructor(a, l) {
      if (l.map === !1) return;
      this.loadAnnotation(a), this.inline = this.startWith(this.annotation, "data:");
      let h = l.map ? l.map.prev : void 0, t = this.loadMap(l.from, h);
      !this.mapFile && l.from && (this.mapFile = l.from), this.mapFile && (this.root = i(this.mapFile)), t && (this.text = t);
    }
    consumer() {
      return this.consumerCache || (this.consumerCache = new o(this.text)), this.consumerCache;
    }
    decodeInline(a) {
      let l = /^data:application\/json;charset=utf-?8;base64,/, h = /^data:application\/json;base64,/, t = /^data:application\/json;charset=utf-?8,/, u = /^data:application\/json,/, m = a.match(t) || a.match(u);
      if (m)
        return decodeURIComponent(a.substr(m[0].length));
      let v = a.match(l) || a.match(h);
      if (v)
        return n(a.substr(v[0].length));
      let y = a.match(/data:application\/json;([^,]+),/)[1];
      throw new Error("Unsupported source map encoding " + y);
    }
    getAnnotationURL(a) {
      return a.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
    }
    isMap(a) {
      return typeof a != "object" ? !1 : typeof a.mappings == "string" || typeof a._mappings == "string" || Array.isArray(a.sections);
    }
    loadAnnotation(a) {
      let l = a.match(/\/\*\s*# sourceMappingURL=/g);
      if (!l) return;
      let h = a.lastIndexOf(l.pop()), t = a.indexOf("*/", h);
      h > -1 && t > -1 && (this.annotation = this.getAnnotationURL(a.substring(h, t)));
    }
    loadFile(a) {
      if (this.root = i(a), e(a))
        return this.mapFile = a, r(a, "utf-8").toString().trim();
    }
    loadMap(a, l) {
      if (l === !1) return !1;
      if (l) {
        if (typeof l == "string")
          return l;
        if (typeof l == "function") {
          let h = l(a);
          if (h) {
            let t = this.loadFile(h);
            if (!t)
              throw new Error(
                "Unable to load previous source map: " + h.toString()
              );
            return t;
          }
        } else {
          if (l instanceof o)
            return f.fromSourceMap(l).toString();
          if (l instanceof f)
            return l.toString();
          if (this.isMap(l))
            return JSON.stringify(l);
          throw new Error(
            "Unsupported previous source map format: " + l.toString()
          );
        }
      } else {
        if (this.inline)
          return this.decodeInline(this.annotation);
        if (this.annotation) {
          let h = this.annotation;
          return a && (h = s(i(a), h)), this.loadFile(h);
        }
      }
    }
    startWith(a, l) {
      return a ? a.substr(0, l.length) === l : !1;
    }
    withContent() {
      return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
    }
  }
  return Pt = c, c.default = c, Pt;
}
var Lt, tr;
function lt() {
  if (tr) return Lt;
  tr = 1;
  let { nanoid: e } = /* @__PURE__ */ Xi(), { isAbsolute: r, resolve: i } = ke, { SourceMapConsumer: s, SourceMapGenerator: o } = ke, { fileURLToPath: f, pathToFileURL: n } = ke, c = eu(), p = qr(), a = ke, l = Symbol("fromOffsetCache"), h = !!(s && o), t = !!(i && r);
  class u {
    constructor(v, y = {}) {
      if (v === null || typeof v > "u" || typeof v == "object" && !v.toString)
        throw new Error(`PostCSS received ${v} instead of CSS string`);
      if (this.css = v.toString(), this.css[0] === "\uFEFF" || this.css[0] === "￾" ? (this.hasBOM = !0, this.css = this.css.slice(1)) : this.hasBOM = !1, this.document = this.css, y.document && (this.document = y.document.toString()), y.from && (!t || /^\w+:\/\//.test(y.from) || r(y.from) ? this.file = y.from : this.file = i(y.from)), t && h) {
        let d = new p(this.css, y);
        if (d.text) {
          this.map = d;
          let g = d.consumer().file;
          !this.file && g && (this.file = this.mapResolve(g));
        }
      }
      this.file || (this.id = "<input css " + e(6) + ">"), this.map && (this.map.file = this.from);
    }
    error(v, y, d, g = {}) {
      let w, x, b;
      if (y && typeof y == "object") {
        let E = y, k = d;
        if (typeof E.offset == "number") {
          let O = this.fromOffset(E.offset);
          y = O.line, d = O.col;
        } else
          y = E.line, d = E.column;
        if (typeof k.offset == "number") {
          let O = this.fromOffset(k.offset);
          x = O.line, w = O.col;
        } else
          x = k.line, w = k.column;
      } else if (!d) {
        let E = this.fromOffset(y);
        y = E.line, d = E.col;
      }
      let S = this.origin(y, d, x, w);
      return S ? b = new c(
        v,
        S.endLine === void 0 ? S.line : { column: S.column, line: S.line },
        S.endLine === void 0 ? S.column : { column: S.endColumn, line: S.endLine },
        S.source,
        S.file,
        g.plugin
      ) : b = new c(
        v,
        x === void 0 ? y : { column: d, line: y },
        x === void 0 ? d : { column: w, line: x },
        this.css,
        this.file,
        g.plugin
      ), b.input = { column: d, endColumn: w, endLine: x, line: y, source: this.css }, this.file && (n && (b.input.url = n(this.file).toString()), b.input.file = this.file), b;
    }
    fromOffset(v) {
      let y, d;
      if (this[l])
        d = this[l];
      else {
        let w = this.css.split(`
`);
        d = new Array(w.length);
        let x = 0;
        for (let b = 0, S = w.length; b < S; b++)
          d[b] = x, x += w[b].length + 1;
        this[l] = d;
      }
      y = d[d.length - 1];
      let g = 0;
      if (v >= y)
        g = d.length - 1;
      else {
        let w = d.length - 2, x;
        for (; g < w; )
          if (x = g + (w - g >> 1), v < d[x])
            w = x - 1;
          else if (v >= d[x + 1])
            g = x + 1;
          else {
            g = x;
            break;
          }
      }
      return {
        col: v - d[g] + 1,
        line: g + 1
      };
    }
    mapResolve(v) {
      return /^\w+:\/\//.test(v) ? v : i(this.map.consumer().sourceRoot || this.map.root || ".", v);
    }
    origin(v, y, d, g) {
      if (!this.map) return !1;
      let w = this.map.consumer(), x = w.originalPositionFor({ column: y, line: v });
      if (!x.source) return !1;
      let b;
      typeof d == "number" && (b = w.originalPositionFor({ column: g, line: d }));
      let S;
      r(x.source) ? S = n(x.source) : S = new URL(
        x.source,
        this.map.consumer().sourceRoot || n(this.map.mapFile)
      );
      let E = {
        column: x.column,
        endColumn: b && b.column,
        endLine: b && b.line,
        line: x.line,
        url: S.toString()
      };
      if (S.protocol === "file:")
        if (f)
          E.file = f(S);
        else
          throw new Error("file: protocol is not available in this PostCSS build");
      let k = w.sourceContentFor(x.source);
      return k && (E.source = k), E;
    }
    toJSON() {
      let v = {};
      for (let y of ["hasBOM", "css", "file", "id"])
        this[y] != null && (v[y] = this[y]);
      return this.map && (v.map = { ...this.map }, v.map.consumerCache && (v.map.consumerCache = void 0)), v;
    }
    get from() {
      return this.file || this.id;
    }
  }
  return Lt = u, u.default = u, a && a.registerInput && a.registerInput(u), Lt;
}
var It, ur;
function Ge() {
  if (ur) return It;
  ur = 1;
  let e = Re(), r, i;
  class s extends e {
    constructor(f) {
      super(f), this.type = "root", this.nodes || (this.nodes = []);
    }
    normalize(f, n, c) {
      let p = super.normalize(f);
      if (n) {
        if (c === "prepend")
          this.nodes.length > 1 ? n.raws.before = this.nodes[1].raws.before : delete n.raws.before;
        else if (this.first !== n)
          for (let a of p)
            a.raws.before = n.raws.before;
      }
      return p;
    }
    removeChild(f, n) {
      let c = this.index(f);
      return !n && c === 0 && this.nodes.length > 1 && (this.nodes[1].raws.before = this.nodes[c].raws.before), super.removeChild(f);
    }
    toResult(f = {}) {
      return new r(new i(), this, f).stringify();
    }
  }
  return s.registerLazyResult = (o) => {
    r = o;
  }, s.registerProcessor = (o) => {
    i = o;
  }, It = s, s.default = s, e.registerRoot(s), It;
}
var Nt, rr;
function Tr() {
  if (rr) return Nt;
  rr = 1;
  let e = {
    comma(r) {
      return e.split(r, [","], !0);
    },
    space(r) {
      let i = [" ", `
`, "	"];
      return e.split(r, i);
    },
    split(r, i, s) {
      let o = [], f = "", n = !1, c = 0, p = !1, a = "", l = !1;
      for (let h of r)
        l ? l = !1 : h === "\\" ? l = !0 : p ? h === a && (p = !1) : h === '"' || h === "'" ? (p = !0, a = h) : h === "(" ? c += 1 : h === ")" ? c > 0 && (c -= 1) : c === 0 && i.includes(h) && (n = !0), n ? (f !== "" && o.push(f.trim()), f = "", n = !1) : f += h;
      return (s || f !== "") && o.push(f.trim()), o;
    }
  };
  return Nt = e, e.default = e, Nt;
}
var _t, ir;
function iu() {
  if (ir) return _t;
  ir = 1;
  let e = Re(), r = Tr();
  class i extends e {
    constructor(o) {
      super(o), this.type = "rule", this.nodes || (this.nodes = []);
    }
    get selectors() {
      return r.comma(this.selector);
    }
    set selectors(o) {
      let f = this.selector ? this.selector.match(/,\s*/) : null, n = f ? f[0] : "," + this.raw("between", "beforeOpen");
      this.selector = o.join(n);
    }
  }
  return _t = i, i.default = i, e.registerRule(i), _t;
}
var $t, nr;
function Qi() {
  if (nr) return $t;
  nr = 1;
  let e = uu(), r = st(), i = at(), s = lt(), o = qr(), f = Ge(), n = iu();
  function c(p, a) {
    if (Array.isArray(p)) return p.map((t) => c(t));
    let { inputs: l, ...h } = p;
    if (l) {
      a = [];
      for (let t of l) {
        let u = { ...t, __proto__: s.prototype };
        u.map && (u.map = {
          ...u.map,
          __proto__: o.prototype
        }), a.push(u);
      }
    }
    if (h.nodes && (h.nodes = p.nodes.map((t) => c(t, a))), h.source) {
      let { inputId: t, ...u } = h.source;
      h.source = u, t != null && (h.source.input = a[t]);
    }
    if (h.type === "root")
      return new f(h);
    if (h.type === "decl")
      return new i(h);
    if (h.type === "rule")
      return new n(h);
    if (h.type === "comment")
      return new r(h);
    if (h.type === "atrule")
      return new e(h);
    throw new Error("Unknown node type: " + p.type);
  }
  return $t = c, c.default = c, $t;
}
var Mt, sr;
function Dr() {
  if (sr) return Mt;
  sr = 1;
  let { dirname: e, relative: r, resolve: i, sep: s } = ke, { SourceMapConsumer: o, SourceMapGenerator: f } = ke, { pathToFileURL: n } = ke, c = lt(), p = !!(o && f), a = !!(e && i && r && s);
  class l {
    constructor(t, u, m, v) {
      this.stringify = t, this.mapOpts = m.map || {}, this.root = u, this.opts = m, this.css = v, this.originalCSS = v, this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute, this.memoizedFileURLs = /* @__PURE__ */ new Map(), this.memoizedPaths = /* @__PURE__ */ new Map(), this.memoizedURLs = /* @__PURE__ */ new Map();
    }
    addAnnotation() {
      let t;
      this.isInline() ? t = "data:application/json;base64," + this.toBase64(this.map.toString()) : typeof this.mapOpts.annotation == "string" ? t = this.mapOpts.annotation : typeof this.mapOpts.annotation == "function" ? t = this.mapOpts.annotation(this.opts.to, this.root) : t = this.outputFile() + ".map";
      let u = `
`;
      this.css.includes(`\r
`) && (u = `\r
`), this.css += u + "/*# sourceMappingURL=" + t + " */";
    }
    applyPrevMaps() {
      for (let t of this.previous()) {
        let u = this.toUrl(this.path(t.file)), m = t.root || e(t.file), v;
        this.mapOpts.sourcesContent === !1 ? (v = new o(t.text), v.sourcesContent && (v.sourcesContent = null)) : v = t.consumer(), this.map.applySourceMap(v, u, this.toUrl(this.path(m)));
      }
    }
    clearAnnotation() {
      if (this.mapOpts.annotation !== !1)
        if (this.root) {
          let t;
          for (let u = this.root.nodes.length - 1; u >= 0; u--)
            t = this.root.nodes[u], t.type === "comment" && t.text.startsWith("# sourceMappingURL=") && this.root.removeChild(u);
        } else this.css && (this.css = this.css.replace(/\n*\/\*#[\S\s]*?\*\/$/gm, ""));
    }
    generate() {
      if (this.clearAnnotation(), a && p && this.isMap())
        return this.generateMap();
      {
        let t = "";
        return this.stringify(this.root, (u) => {
          t += u;
        }), [t];
      }
    }
    generateMap() {
      if (this.root)
        this.generateString();
      else if (this.previous().length === 1) {
        let t = this.previous()[0].consumer();
        t.file = this.outputFile(), this.map = f.fromSourceMap(t, {
          ignoreInvalidMapping: !0
        });
      } else
        this.map = new f({
          file: this.outputFile(),
          ignoreInvalidMapping: !0
        }), this.map.addMapping({
          generated: { column: 0, line: 1 },
          original: { column: 0, line: 1 },
          source: this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>"
        });
      return this.isSourcesContent() && this.setSourcesContent(), this.root && this.previous().length > 0 && this.applyPrevMaps(), this.isAnnotation() && this.addAnnotation(), this.isInline() ? [this.css] : [this.css, this.map];
    }
    generateString() {
      this.css = "", this.map = new f({
        file: this.outputFile(),
        ignoreInvalidMapping: !0
      });
      let t = 1, u = 1, m = "<no source>", v = {
        generated: { column: 0, line: 0 },
        original: { column: 0, line: 0 },
        source: ""
      }, y, d;
      this.stringify(this.root, (g, w, x) => {
        if (this.css += g, w && x !== "end" && (v.generated.line = t, v.generated.column = u - 1, w.source && w.source.start ? (v.source = this.sourcePath(w), v.original.line = w.source.start.line, v.original.column = w.source.start.column - 1, this.map.addMapping(v)) : (v.source = m, v.original.line = 1, v.original.column = 0, this.map.addMapping(v))), d = g.match(/\n/g), d ? (t += d.length, y = g.lastIndexOf(`
`), u = g.length - y) : u += g.length, w && x !== "start") {
          let b = w.parent || { raws: {} };
          (!(w.type === "decl" || w.type === "atrule" && !w.nodes) || w !== b.last || b.raws.semicolon) && (w.source && w.source.end ? (v.source = this.sourcePath(w), v.original.line = w.source.end.line, v.original.column = w.source.end.column - 1, v.generated.line = t, v.generated.column = u - 2, this.map.addMapping(v)) : (v.source = m, v.original.line = 1, v.original.column = 0, v.generated.line = t, v.generated.column = u - 1, this.map.addMapping(v)));
        }
      });
    }
    isAnnotation() {
      return this.isInline() ? !0 : typeof this.mapOpts.annotation < "u" ? this.mapOpts.annotation : this.previous().length ? this.previous().some((t) => t.annotation) : !0;
    }
    isInline() {
      if (typeof this.mapOpts.inline < "u")
        return this.mapOpts.inline;
      let t = this.mapOpts.annotation;
      return typeof t < "u" && t !== !0 ? !1 : this.previous().length ? this.previous().some((u) => u.inline) : !0;
    }
    isMap() {
      return typeof this.opts.map < "u" ? !!this.opts.map : this.previous().length > 0;
    }
    isSourcesContent() {
      return typeof this.mapOpts.sourcesContent < "u" ? this.mapOpts.sourcesContent : this.previous().length ? this.previous().some((t) => t.withContent()) : !0;
    }
    outputFile() {
      return this.opts.to ? this.path(this.opts.to) : this.opts.from ? this.path(this.opts.from) : "to.css";
    }
    path(t) {
      if (this.mapOpts.absolute || t.charCodeAt(0) === 60 || /^\w+:\/\//.test(t)) return t;
      let u = this.memoizedPaths.get(t);
      if (u) return u;
      let m = this.opts.to ? e(this.opts.to) : ".";
      typeof this.mapOpts.annotation == "string" && (m = e(i(m, this.mapOpts.annotation)));
      let v = r(m, t);
      return this.memoizedPaths.set(t, v), v;
    }
    previous() {
      if (!this.previousMaps)
        if (this.previousMaps = [], this.root)
          this.root.walk((t) => {
            if (t.source && t.source.input.map) {
              let u = t.source.input.map;
              this.previousMaps.includes(u) || this.previousMaps.push(u);
            }
          });
        else {
          let t = new c(this.originalCSS, this.opts);
          t.map && this.previousMaps.push(t.map);
        }
      return this.previousMaps;
    }
    setSourcesContent() {
      let t = {};
      if (this.root)
        this.root.walk((u) => {
          if (u.source) {
            let m = u.source.input.from;
            if (m && !t[m]) {
              t[m] = !0;
              let v = this.usesFileUrls ? this.toFileUrl(m) : this.toUrl(this.path(m));
              this.map.setSourceContent(v, u.source.input.css);
            }
          }
        });
      else if (this.css) {
        let u = this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>";
        this.map.setSourceContent(u, this.css);
      }
    }
    sourcePath(t) {
      return this.mapOpts.from ? this.toUrl(this.mapOpts.from) : this.usesFileUrls ? this.toFileUrl(t.source.input.from) : this.toUrl(this.path(t.source.input.from));
    }
    toBase64(t) {
      return Buffer ? Buffer.from(t).toString("base64") : window.btoa(unescape(encodeURIComponent(t)));
    }
    toFileUrl(t) {
      let u = this.memoizedFileURLs.get(t);
      if (u) return u;
      if (n) {
        let m = n(t).toString();
        return this.memoizedFileURLs.set(t, m), m;
      } else
        throw new Error(
          "`map.absolute` option is not available in this PostCSS build"
        );
    }
    toUrl(t) {
      let u = this.memoizedURLs.get(t);
      if (u) return u;
      s === "\\" && (t = t.replace(/\\/g, "/"));
      let m = encodeURI(t).replace(/[#?]/g, encodeURIComponent);
      return this.memoizedURLs.set(t, m), m;
    }
  }
  return Mt = l, Mt;
}
var Bt, ar;
function Zi() {
  if (ar) return Bt;
  ar = 1;
  const e = 39, r = 34, i = 92, s = 47, o = 10, f = 32, n = 12, c = 9, p = 13, a = 91, l = 93, h = 40, t = 41, u = 123, m = 125, v = 59, y = 42, d = 58, g = 64, w = /[\t\n\f\r "#'()/;[\\\]{}]/g, x = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g, b = /.[\r\n"'(/\\]/, S = /[\da-f]/i;
  return Bt = function(k, O = {}) {
    let P = k.css.valueOf(), A = O.ignoreErrors, T, L, M, D, H, Y, Q, ne, se, qe, Ve = P.length, V = 0, Te = [], Pe = [];
    function Ye() {
      return V;
    }
    function Fe(C) {
      throw k.error("Unclosed " + C, V);
    }
    function ot() {
      return Pe.length === 0 && V >= Ve;
    }
    function dt(C) {
      if (Pe.length) return Pe.pop();
      if (V >= Ve) return;
      let _ = C ? C.ignoreUnclosed : !1;
      switch (T = P.charCodeAt(V), T) {
        case o:
        case f:
        case c:
        case p:
        case n: {
          D = V;
          do
            D += 1, T = P.charCodeAt(D);
          while (T === f || T === o || T === c || T === p || T === n);
          Y = ["space", P.slice(V, D)], V = D - 1;
          break;
        }
        case a:
        case l:
        case u:
        case m:
        case d:
        case v:
        case t: {
          let N = String.fromCharCode(T);
          Y = [N, N, V];
          break;
        }
        case h: {
          if (qe = Te.length ? Te.pop()[1] : "", se = P.charCodeAt(V + 1), qe === "url" && se !== e && se !== r && se !== f && se !== o && se !== c && se !== n && se !== p) {
            D = V;
            do {
              if (Q = !1, D = P.indexOf(")", D + 1), D === -1)
                if (A || _) {
                  D = V;
                  break;
                } else
                  Fe("bracket");
              for (ne = D; P.charCodeAt(ne - 1) === i; )
                ne -= 1, Q = !Q;
            } while (Q);
            Y = ["brackets", P.slice(V, D + 1), V, D], V = D;
          } else
            D = P.indexOf(")", V + 1), L = P.slice(V, D + 1), D === -1 || b.test(L) ? Y = ["(", "(", V] : (Y = ["brackets", L, V, D], V = D);
          break;
        }
        case e:
        case r: {
          H = T === e ? "'" : '"', D = V;
          do {
            if (Q = !1, D = P.indexOf(H, D + 1), D === -1)
              if (A || _) {
                D = V + 1;
                break;
              } else
                Fe("string");
            for (ne = D; P.charCodeAt(ne - 1) === i; )
              ne -= 1, Q = !Q;
          } while (Q);
          Y = ["string", P.slice(V, D + 1), V, D], V = D;
          break;
        }
        case g: {
          w.lastIndex = V + 1, w.test(P), w.lastIndex === 0 ? D = P.length - 1 : D = w.lastIndex - 2, Y = ["at-word", P.slice(V, D + 1), V, D], V = D;
          break;
        }
        case i: {
          for (D = V, M = !0; P.charCodeAt(D + 1) === i; )
            D += 1, M = !M;
          if (T = P.charCodeAt(D + 1), M && T !== s && T !== f && T !== o && T !== c && T !== p && T !== n && (D += 1, S.test(P.charAt(D)))) {
            for (; S.test(P.charAt(D + 1)); )
              D += 1;
            P.charCodeAt(D + 1) === f && (D += 1);
          }
          Y = ["word", P.slice(V, D + 1), V, D], V = D;
          break;
        }
        default: {
          T === s && P.charCodeAt(V + 1) === y ? (D = P.indexOf("*/", V + 2) + 1, D === 0 && (A || _ ? D = P.length : Fe("comment")), Y = ["comment", P.slice(V, D + 1), V, D], V = D) : (x.lastIndex = V + 1, x.test(P), x.lastIndex === 0 ? D = P.length - 1 : D = x.lastIndex - 2, Y = ["word", P.slice(V, D + 1), V, D], Te.push(Y), V = D);
          break;
        }
      }
      return V++, Y;
    }
    function We(C) {
      Pe.push(C);
    }
    return {
      back: We,
      endOfFile: ot,
      nextToken: dt,
      position: Ye
    };
  }, Bt;
}
var Rt, lr;
function en() {
  if (lr) return Rt;
  lr = 1;
  let e = uu(), r = st(), i = at(), s = Ge(), o = iu(), f = Zi();
  const n = {
    empty: !0,
    space: !0
  };
  function c(a) {
    for (let l = a.length - 1; l >= 0; l--) {
      let h = a[l], t = h[3] || h[2];
      if (t) return t;
    }
  }
  class p {
    constructor(l) {
      this.input = l, this.root = new s(), this.current = this.root, this.spaces = "", this.semicolon = !1, this.createTokenizer(), this.root.source = { input: l, start: { column: 1, line: 1, offset: 0 } };
    }
    atrule(l) {
      let h = new e();
      h.name = l[1].slice(1), h.name === "" && this.unnamedAtrule(h, l), this.init(h, l[2]);
      let t, u, m, v = !1, y = !1, d = [], g = [];
      for (; !this.tokenizer.endOfFile(); ) {
        if (l = this.tokenizer.nextToken(), t = l[0], t === "(" || t === "[" ? g.push(t === "(" ? ")" : "]") : t === "{" && g.length > 0 ? g.push("}") : t === g[g.length - 1] && g.pop(), g.length === 0)
          if (t === ";") {
            h.source.end = this.getPosition(l[2]), h.source.end.offset++, this.semicolon = !0;
            break;
          } else if (t === "{") {
            y = !0;
            break;
          } else if (t === "}") {
            if (d.length > 0) {
              for (m = d.length - 1, u = d[m]; u && u[0] === "space"; )
                u = d[--m];
              u && (h.source.end = this.getPosition(u[3] || u[2]), h.source.end.offset++);
            }
            this.end(l);
            break;
          } else
            d.push(l);
        else
          d.push(l);
        if (this.tokenizer.endOfFile()) {
          v = !0;
          break;
        }
      }
      h.raws.between = this.spacesAndCommentsFromEnd(d), d.length ? (h.raws.afterName = this.spacesAndCommentsFromStart(d), this.raw(h, "params", d), v && (l = d[d.length - 1], h.source.end = this.getPosition(l[3] || l[2]), h.source.end.offset++, this.spaces = h.raws.between, h.raws.between = "")) : (h.raws.afterName = "", h.params = ""), y && (h.nodes = [], this.current = h);
    }
    checkMissedSemicolon(l) {
      let h = this.colon(l);
      if (h === !1) return;
      let t = 0, u;
      for (let m = h - 1; m >= 0 && (u = l[m], !(u[0] !== "space" && (t += 1, t === 2))); m--)
        ;
      throw this.input.error(
        "Missed semicolon",
        u[0] === "word" ? u[3] + 1 : u[2]
      );
    }
    colon(l) {
      let h = 0, t, u, m;
      for (let [v, y] of l.entries()) {
        if (u = y, m = u[0], m === "(" && (h += 1), m === ")" && (h -= 1), h === 0 && m === ":")
          if (!t)
            this.doubleColon(u);
          else {
            if (t[0] === "word" && t[1] === "progid")
              continue;
            return v;
          }
        t = u;
      }
      return !1;
    }
    comment(l) {
      let h = new r();
      this.init(h, l[2]), h.source.end = this.getPosition(l[3] || l[2]), h.source.end.offset++;
      let t = l[1].slice(2, -2);
      if (/^\s*$/.test(t))
        h.text = "", h.raws.left = t, h.raws.right = "";
      else {
        let u = t.match(/^(\s*)([^]*\S)(\s*)$/);
        h.text = u[2], h.raws.left = u[1], h.raws.right = u[3];
      }
    }
    createTokenizer() {
      this.tokenizer = f(this.input);
    }
    decl(l, h) {
      let t = new i();
      this.init(t, l[0][2]);
      let u = l[l.length - 1];
      for (u[0] === ";" && (this.semicolon = !0, l.pop()), t.source.end = this.getPosition(
        u[3] || u[2] || c(l)
      ), t.source.end.offset++; l[0][0] !== "word"; )
        l.length === 1 && this.unknownWord(l), t.raws.before += l.shift()[1];
      for (t.source.start = this.getPosition(l[0][2]), t.prop = ""; l.length; ) {
        let g = l[0][0];
        if (g === ":" || g === "space" || g === "comment")
          break;
        t.prop += l.shift()[1];
      }
      t.raws.between = "";
      let m;
      for (; l.length; )
        if (m = l.shift(), m[0] === ":") {
          t.raws.between += m[1];
          break;
        } else
          m[0] === "word" && /\w/.test(m[1]) && this.unknownWord([m]), t.raws.between += m[1];
      (t.prop[0] === "_" || t.prop[0] === "*") && (t.raws.before += t.prop[0], t.prop = t.prop.slice(1));
      let v = [], y;
      for (; l.length && (y = l[0][0], !(y !== "space" && y !== "comment")); )
        v.push(l.shift());
      this.precheckMissedSemicolon(l);
      for (let g = l.length - 1; g >= 0; g--) {
        if (m = l[g], m[1].toLowerCase() === "!important") {
          t.important = !0;
          let w = this.stringFrom(l, g);
          w = this.spacesFromEnd(l) + w, w !== " !important" && (t.raws.important = w);
          break;
        } else if (m[1].toLowerCase() === "important") {
          let w = l.slice(0), x = "";
          for (let b = g; b > 0; b--) {
            let S = w[b][0];
            if (x.trim().startsWith("!") && S !== "space")
              break;
            x = w.pop()[1] + x;
          }
          x.trim().startsWith("!") && (t.important = !0, t.raws.important = x, l = w);
        }
        if (m[0] !== "space" && m[0] !== "comment")
          break;
      }
      l.some((g) => g[0] !== "space" && g[0] !== "comment") && (t.raws.between += v.map((g) => g[1]).join(""), v = []), this.raw(t, "value", v.concat(l), h), t.value.includes(":") && !h && this.checkMissedSemicolon(l);
    }
    doubleColon(l) {
      throw this.input.error(
        "Double colon",
        { offset: l[2] },
        { offset: l[2] + l[1].length }
      );
    }
    emptyRule(l) {
      let h = new o();
      this.init(h, l[2]), h.selector = "", h.raws.between = "", this.current = h;
    }
    end(l) {
      this.current.nodes && this.current.nodes.length && (this.current.raws.semicolon = this.semicolon), this.semicolon = !1, this.current.raws.after = (this.current.raws.after || "") + this.spaces, this.spaces = "", this.current.parent ? (this.current.source.end = this.getPosition(l[2]), this.current.source.end.offset++, this.current = this.current.parent) : this.unexpectedClose(l);
    }
    endFile() {
      this.current.parent && this.unclosedBlock(), this.current.nodes && this.current.nodes.length && (this.current.raws.semicolon = this.semicolon), this.current.raws.after = (this.current.raws.after || "") + this.spaces, this.root.source.end = this.getPosition(this.tokenizer.position());
    }
    freeSemicolon(l) {
      if (this.spaces += l[1], this.current.nodes) {
        let h = this.current.nodes[this.current.nodes.length - 1];
        h && h.type === "rule" && !h.raws.ownSemicolon && (h.raws.ownSemicolon = this.spaces, this.spaces = "", h.source.end = this.getPosition(l[2]), h.source.end.offset += h.raws.ownSemicolon.length);
      }
    }
    // Helpers
    getPosition(l) {
      let h = this.input.fromOffset(l);
      return {
        column: h.col,
        line: h.line,
        offset: l
      };
    }
    init(l, h) {
      this.current.push(l), l.source = {
        input: this.input,
        start: this.getPosition(h)
      }, l.raws.before = this.spaces, this.spaces = "", l.type !== "comment" && (this.semicolon = !1);
    }
    other(l) {
      let h = !1, t = null, u = !1, m = null, v = [], y = l[1].startsWith("--"), d = [], g = l;
      for (; g; ) {
        if (t = g[0], d.push(g), t === "(" || t === "[")
          m || (m = g), v.push(t === "(" ? ")" : "]");
        else if (y && u && t === "{")
          m || (m = g), v.push("}");
        else if (v.length === 0)
          if (t === ";")
            if (u) {
              this.decl(d, y);
              return;
            } else
              break;
          else if (t === "{") {
            this.rule(d);
            return;
          } else if (t === "}") {
            this.tokenizer.back(d.pop()), h = !0;
            break;
          } else t === ":" && (u = !0);
        else t === v[v.length - 1] && (v.pop(), v.length === 0 && (m = null));
        g = this.tokenizer.nextToken();
      }
      if (this.tokenizer.endOfFile() && (h = !0), v.length > 0 && this.unclosedBracket(m), h && u) {
        if (!y)
          for (; d.length && (g = d[d.length - 1][0], !(g !== "space" && g !== "comment")); )
            this.tokenizer.back(d.pop());
        this.decl(d, y);
      } else
        this.unknownWord(d);
    }
    parse() {
      let l;
      for (; !this.tokenizer.endOfFile(); )
        switch (l = this.tokenizer.nextToken(), l[0]) {
          case "space":
            this.spaces += l[1];
            break;
          case ";":
            this.freeSemicolon(l);
            break;
          case "}":
            this.end(l);
            break;
          case "comment":
            this.comment(l);
            break;
          case "at-word":
            this.atrule(l);
            break;
          case "{":
            this.emptyRule(l);
            break;
          default:
            this.other(l);
            break;
        }
      this.endFile();
    }
    precheckMissedSemicolon() {
    }
    raw(l, h, t, u) {
      let m, v, y = t.length, d = "", g = !0, w, x;
      for (let b = 0; b < y; b += 1)
        m = t[b], v = m[0], v === "space" && b === y - 1 && !u ? g = !1 : v === "comment" ? (x = t[b - 1] ? t[b - 1][0] : "empty", w = t[b + 1] ? t[b + 1][0] : "empty", !n[x] && !n[w] ? d.slice(-1) === "," ? g = !1 : d += m[1] : g = !1) : d += m[1];
      if (!g) {
        let b = t.reduce((S, E) => S + E[1], "");
        l.raws[h] = { raw: b, value: d };
      }
      l[h] = d;
    }
    rule(l) {
      l.pop();
      let h = new o();
      this.init(h, l[0][2]), h.raws.between = this.spacesAndCommentsFromEnd(l), this.raw(h, "selector", l), this.current = h;
    }
    spacesAndCommentsFromEnd(l) {
      let h, t = "";
      for (; l.length && (h = l[l.length - 1][0], !(h !== "space" && h !== "comment")); )
        t = l.pop()[1] + t;
      return t;
    }
    // Errors
    spacesAndCommentsFromStart(l) {
      let h, t = "";
      for (; l.length && (h = l[0][0], !(h !== "space" && h !== "comment")); )
        t += l.shift()[1];
      return t;
    }
    spacesFromEnd(l) {
      let h, t = "";
      for (; l.length && (h = l[l.length - 1][0], h === "space"); )
        t = l.pop()[1] + t;
      return t;
    }
    stringFrom(l, h) {
      let t = "";
      for (let u = h; u < l.length; u++)
        t += l[u][1];
      return l.splice(h, l.length - h), t;
    }
    unclosedBlock() {
      let l = this.current.source.start;
      throw this.input.error("Unclosed block", l.line, l.column);
    }
    unclosedBracket(l) {
      throw this.input.error(
        "Unclosed bracket",
        { offset: l[2] },
        { offset: l[2] + 1 }
      );
    }
    unexpectedClose(l) {
      throw this.input.error(
        "Unexpected }",
        { offset: l[2] },
        { offset: l[2] + 1 }
      );
    }
    unknownWord(l) {
      throw this.input.error(
        "Unknown word",
        { offset: l[0][2] },
        { offset: l[0][2] + l[0][1].length }
      );
    }
    unnamedAtrule(l, h) {
      throw this.input.error(
        "At-rule without name",
        { offset: h[2] },
        { offset: h[2] + h[1].length }
      );
    }
  }
  return Rt = p, Rt;
}
var Vt, or;
function nu() {
  if (or) return Vt;
  or = 1;
  let e = Re(), r = lt(), i = en();
  function s(o, f) {
    let n = new r(o, f), c = new i(n);
    try {
      c.parse();
    } catch (p) {
      throw process.env.NODE_ENV !== "production" && p.name === "CssSyntaxError" && f && f.from && (/\.scss$/i.test(f.from) ? p.message += `
You tried to parse SCSS with the standard CSS parser; try again with the postcss-scss parser` : /\.sass/i.test(f.from) ? p.message += `
You tried to parse Sass with the standard CSS parser; try again with the postcss-sass parser` : /\.less$/i.test(f.from) && (p.message += `
You tried to parse Less with the standard CSS parser; try again with the postcss-less parser`)), p;
    }
    return c.root;
  }
  return Vt = s, s.default = s, e.registerParse(s), Vt;
}
var Ft, dr;
function Cr() {
  if (dr) return Ft;
  dr = 1;
  class e {
    constructor(i, s = {}) {
      if (this.type = "warning", this.text = i, s.node && s.node.source) {
        let o = s.node.rangeBy(s);
        this.line = o.start.line, this.column = o.start.column, this.endLine = o.end.line, this.endColumn = o.end.column;
      }
      for (let o in s) this[o] = s[o];
    }
    toString() {
      return this.node ? this.node.error(this.text, {
        index: this.index,
        plugin: this.plugin,
        word: this.word
      }).message : this.plugin ? this.plugin + ": " + this.text : this.text;
    }
  }
  return Ft = e, e.default = e, Ft;
}
var jt, cr;
function su() {
  if (cr) return jt;
  cr = 1;
  let e = Cr();
  class r {
    constructor(s, o, f) {
      this.processor = s, this.messages = [], this.root = o, this.opts = f, this.css = void 0, this.map = void 0;
    }
    toString() {
      return this.css;
    }
    warn(s, o = {}) {
      o.plugin || this.lastPlugin && this.lastPlugin.postcssPlugin && (o.plugin = this.lastPlugin.postcssPlugin);
      let f = new e(s, o);
      return this.messages.push(f), f;
    }
    warnings() {
      return this.messages.filter((s) => s.type === "warning");
    }
    get content() {
      return this.css;
    }
  }
  return jt = r, r.default = r, jt;
}
var Ut, fr;
function Or() {
  if (fr) return Ut;
  fr = 1;
  let e = {};
  return Ut = function(i) {
    e[i] || (e[i] = !0, typeof console < "u" && console.warn && console.warn(i));
  }, Ut;
}
var Ht, hr;
function Pr() {
  if (hr) return Ht;
  hr = 1;
  let e = Re(), r = ru(), i = Dr(), s = nu(), o = su(), f = Ge(), n = it(), { isClean: c, my: p } = tu(), a = Or();
  const l = {
    atrule: "AtRule",
    comment: "Comment",
    decl: "Declaration",
    document: "Document",
    root: "Root",
    rule: "Rule"
  }, h = {
    AtRule: !0,
    AtRuleExit: !0,
    Comment: !0,
    CommentExit: !0,
    Declaration: !0,
    DeclarationExit: !0,
    Document: !0,
    DocumentExit: !0,
    Once: !0,
    OnceExit: !0,
    postcssPlugin: !0,
    prepare: !0,
    Root: !0,
    RootExit: !0,
    Rule: !0,
    RuleExit: !0
  }, t = {
    Once: !0,
    postcssPlugin: !0,
    prepare: !0
  }, u = 0;
  function m(x) {
    return typeof x == "object" && typeof x.then == "function";
  }
  function v(x) {
    let b = !1, S = l[x.type];
    return x.type === "decl" ? b = x.prop.toLowerCase() : x.type === "atrule" && (b = x.name.toLowerCase()), b && x.append ? [
      S,
      S + "-" + b,
      u,
      S + "Exit",
      S + "Exit-" + b
    ] : b ? [S, S + "-" + b, S + "Exit", S + "Exit-" + b] : x.append ? [S, u, S + "Exit"] : [S, S + "Exit"];
  }
  function y(x) {
    let b;
    return x.type === "document" ? b = ["Document", u, "DocumentExit"] : x.type === "root" ? b = ["Root", u, "RootExit"] : b = v(x), {
      eventIndex: 0,
      events: b,
      iterator: 0,
      node: x,
      visitorIndex: 0,
      visitors: []
    };
  }
  function d(x) {
    return x[c] = !1, x.nodes && x.nodes.forEach((b) => d(b)), x;
  }
  let g = {};
  class w {
    constructor(b, S, E) {
      this.stringified = !1, this.processed = !1;
      let k;
      if (typeof S == "object" && S !== null && (S.type === "root" || S.type === "document"))
        k = d(S);
      else if (S instanceof w || S instanceof o)
        k = d(S.root), S.map && (typeof E.map > "u" && (E.map = {}), E.map.inline || (E.map.inline = !1), E.map.prev = S.map);
      else {
        let O = s;
        E.syntax && (O = E.syntax.parse), E.parser && (O = E.parser), O.parse && (O = O.parse);
        try {
          k = O(S, E);
        } catch (P) {
          this.processed = !0, this.error = P;
        }
        k && !k[p] && e.rebuild(k);
      }
      this.result = new o(b, k, E), this.helpers = { ...g, postcss: g, result: this.result }, this.plugins = this.processor.plugins.map((O) => typeof O == "object" && O.prepare ? { ...O, ...O.prepare(this.result) } : O);
    }
    async() {
      return this.error ? Promise.reject(this.error) : this.processed ? Promise.resolve(this.result) : (this.processing || (this.processing = this.runAsync()), this.processing);
    }
    catch(b) {
      return this.async().catch(b);
    }
    finally(b) {
      return this.async().then(b, b);
    }
    getAsyncError() {
      throw new Error("Use process(css).then(cb) to work with async plugins");
    }
    handleError(b, S) {
      let E = this.result.lastPlugin;
      try {
        if (S && S.addToError(b), this.error = b, b.name === "CssSyntaxError" && !b.plugin)
          b.plugin = E.postcssPlugin, b.setMessage();
        else if (E.postcssVersion && process.env.NODE_ENV !== "production") {
          let k = E.postcssPlugin, O = E.postcssVersion, P = this.result.processor.version, A = O.split("."), T = P.split(".");
          (A[0] !== T[0] || parseInt(A[1]) > parseInt(T[1])) && console.error(
            "Unknown error from PostCSS plugin. Your current PostCSS version is " + P + ", but " + k + " uses " + O + ". Perhaps this is the source of the error below."
          );
        }
      } catch (k) {
        console && console.error && console.error(k);
      }
      return b;
    }
    prepareVisitors() {
      this.listeners = {};
      let b = (S, E, k) => {
        this.listeners[E] || (this.listeners[E] = []), this.listeners[E].push([S, k]);
      };
      for (let S of this.plugins)
        if (typeof S == "object")
          for (let E in S) {
            if (!h[E] && /^[A-Z]/.test(E))
              throw new Error(
                `Unknown event ${E} in ${S.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`
              );
            if (!t[E])
              if (typeof S[E] == "object")
                for (let k in S[E])
                  k === "*" ? b(S, E, S[E][k]) : b(
                    S,
                    E + "-" + k.toLowerCase(),
                    S[E][k]
                  );
              else typeof S[E] == "function" && b(S, E, S[E]);
          }
      this.hasListener = Object.keys(this.listeners).length > 0;
    }
    async runAsync() {
      this.plugin = 0;
      for (let b = 0; b < this.plugins.length; b++) {
        let S = this.plugins[b], E = this.runOnRoot(S);
        if (m(E))
          try {
            await E;
          } catch (k) {
            throw this.handleError(k);
          }
      }
      if (this.prepareVisitors(), this.hasListener) {
        let b = this.result.root;
        for (; !b[c]; ) {
          b[c] = !0;
          let S = [y(b)];
          for (; S.length > 0; ) {
            let E = this.visitTick(S);
            if (m(E))
              try {
                await E;
              } catch (k) {
                let O = S[S.length - 1].node;
                throw this.handleError(k, O);
              }
          }
        }
        if (this.listeners.OnceExit)
          for (let [S, E] of this.listeners.OnceExit) {
            this.result.lastPlugin = S;
            try {
              if (b.type === "document") {
                let k = b.nodes.map(
                  (O) => E(O, this.helpers)
                );
                await Promise.all(k);
              } else
                await E(b, this.helpers);
            } catch (k) {
              throw this.handleError(k);
            }
          }
      }
      return this.processed = !0, this.stringify();
    }
    runOnRoot(b) {
      this.result.lastPlugin = b;
      try {
        if (typeof b == "object" && b.Once) {
          if (this.result.root.type === "document") {
            let S = this.result.root.nodes.map(
              (E) => b.Once(E, this.helpers)
            );
            return m(S[0]) ? Promise.all(S) : S;
          }
          return b.Once(this.result.root, this.helpers);
        } else if (typeof b == "function")
          return b(this.result.root, this.result);
      } catch (S) {
        throw this.handleError(S);
      }
    }
    stringify() {
      if (this.error) throw this.error;
      if (this.stringified) return this.result;
      this.stringified = !0, this.sync();
      let b = this.result.opts, S = n;
      b.syntax && (S = b.syntax.stringify), b.stringifier && (S = b.stringifier), S.stringify && (S = S.stringify);
      let k = new i(S, this.result.root, this.result.opts).generate();
      return this.result.css = k[0], this.result.map = k[1], this.result;
    }
    sync() {
      if (this.error) throw this.error;
      if (this.processed) return this.result;
      if (this.processed = !0, this.processing)
        throw this.getAsyncError();
      for (let b of this.plugins) {
        let S = this.runOnRoot(b);
        if (m(S))
          throw this.getAsyncError();
      }
      if (this.prepareVisitors(), this.hasListener) {
        let b = this.result.root;
        for (; !b[c]; )
          b[c] = !0, this.walkSync(b);
        if (this.listeners.OnceExit)
          if (b.type === "document")
            for (let S of b.nodes)
              this.visitSync(this.listeners.OnceExit, S);
          else
            this.visitSync(this.listeners.OnceExit, b);
      }
      return this.result;
    }
    then(b, S) {
      return process.env.NODE_ENV !== "production" && ("from" in this.opts || a(
        "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
      )), this.async().then(b, S);
    }
    toString() {
      return this.css;
    }
    visitSync(b, S) {
      for (let [E, k] of b) {
        this.result.lastPlugin = E;
        let O;
        try {
          O = k(S, this.helpers);
        } catch (P) {
          throw this.handleError(P, S.proxyOf);
        }
        if (S.type !== "root" && S.type !== "document" && !S.parent)
          return !0;
        if (m(O))
          throw this.getAsyncError();
      }
    }
    visitTick(b) {
      let S = b[b.length - 1], { node: E, visitors: k } = S;
      if (E.type !== "root" && E.type !== "document" && !E.parent) {
        b.pop();
        return;
      }
      if (k.length > 0 && S.visitorIndex < k.length) {
        let [P, A] = k[S.visitorIndex];
        S.visitorIndex += 1, S.visitorIndex === k.length && (S.visitors = [], S.visitorIndex = 0), this.result.lastPlugin = P;
        try {
          return A(E.toProxy(), this.helpers);
        } catch (T) {
          throw this.handleError(T, E);
        }
      }
      if (S.iterator !== 0) {
        let P = S.iterator, A;
        for (; A = E.nodes[E.indexes[P]]; )
          if (E.indexes[P] += 1, !A[c]) {
            A[c] = !0, b.push(y(A));
            return;
          }
        S.iterator = 0, delete E.indexes[P];
      }
      let O = S.events;
      for (; S.eventIndex < O.length; ) {
        let P = O[S.eventIndex];
        if (S.eventIndex += 1, P === u) {
          E.nodes && E.nodes.length && (E[c] = !0, S.iterator = E.getIterator());
          return;
        } else if (this.listeners[P]) {
          S.visitors = this.listeners[P];
          return;
        }
      }
      b.pop();
    }
    walkSync(b) {
      b[c] = !0;
      let S = v(b);
      for (let E of S)
        if (E === u)
          b.nodes && b.each((k) => {
            k[c] || this.walkSync(k);
          });
        else {
          let k = this.listeners[E];
          if (k && this.visitSync(k, b.toProxy()))
            return;
        }
    }
    warnings() {
      return this.sync().warnings();
    }
    get content() {
      return this.stringify().content;
    }
    get css() {
      return this.stringify().css;
    }
    get map() {
      return this.stringify().map;
    }
    get messages() {
      return this.sync().messages;
    }
    get opts() {
      return this.result.opts;
    }
    get processor() {
      return this.result.processor;
    }
    get root() {
      return this.sync().root;
    }
    get [Symbol.toStringTag]() {
      return "LazyResult";
    }
  }
  return w.registerPostcss = (x) => {
    g = x;
  }, Ht = w, w.default = w, f.registerLazyResult(w), r.registerLazyResult(w), Ht;
}
var zt, pr;
function tn() {
  if (pr) return zt;
  pr = 1;
  let e = Dr(), r = nu();
  const i = su();
  let s = it(), o = Or();
  class f {
    constructor(c, p, a) {
      p = p.toString(), this.stringified = !1, this._processor = c, this._css = p, this._opts = a, this._map = void 0;
      let l, h = s;
      this.result = new i(this._processor, l, this._opts), this.result.css = p;
      let t = this;
      Object.defineProperty(this.result, "root", {
        get() {
          return t.root;
        }
      });
      let u = new e(h, l, this._opts, p);
      if (u.isMap()) {
        let [m, v] = u.generate();
        m && (this.result.css = m), v && (this.result.map = v);
      } else
        u.clearAnnotation(), this.result.css = u.css;
    }
    async() {
      return this.error ? Promise.reject(this.error) : Promise.resolve(this.result);
    }
    catch(c) {
      return this.async().catch(c);
    }
    finally(c) {
      return this.async().then(c, c);
    }
    sync() {
      if (this.error) throw this.error;
      return this.result;
    }
    then(c, p) {
      return process.env.NODE_ENV !== "production" && ("from" in this._opts || o(
        "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
      )), this.async().then(c, p);
    }
    toString() {
      return this._css;
    }
    warnings() {
      return [];
    }
    get content() {
      return this.result.css;
    }
    get css() {
      return this.result.css;
    }
    get map() {
      return this.result.map;
    }
    get messages() {
      return [];
    }
    get opts() {
      return this.result.opts;
    }
    get processor() {
      return this.result.processor;
    }
    get root() {
      if (this._root)
        return this._root;
      let c, p = r;
      try {
        c = p(this._css, this._opts);
      } catch (a) {
        this.error = a;
      }
      if (this.error)
        throw this.error;
      return this._root = c, c;
    }
    get [Symbol.toStringTag]() {
      return "NoWorkResult";
    }
  }
  return zt = f, f.default = f, zt;
}
var Gt, br;
function un() {
  if (br) return Gt;
  br = 1;
  let e = ru(), r = Pr(), i = tn(), s = Ge();
  class o {
    constructor(n = []) {
      this.version = "8.5.2", this.plugins = this.normalize(n);
    }
    normalize(n) {
      let c = [];
      for (let p of n)
        if (p.postcss === !0 ? p = p() : p.postcss && (p = p.postcss), typeof p == "object" && Array.isArray(p.plugins))
          c = c.concat(p.plugins);
        else if (typeof p == "object" && p.postcssPlugin)
          c.push(p);
        else if (typeof p == "function")
          c.push(p);
        else if (typeof p == "object" && (p.parse || p.stringify)) {
          if (process.env.NODE_ENV !== "production")
            throw new Error(
              "PostCSS syntaxes cannot be used as plugins. Instead, please use one of the syntax/parser/stringifier options as outlined in your PostCSS runner documentation."
            );
        } else
          throw new Error(p + " is not a PostCSS plugin");
      return c;
    }
    process(n, c = {}) {
      return !this.plugins.length && !c.parser && !c.stringifier && !c.syntax ? new i(this, n, c) : new r(this, n, c);
    }
    use(n) {
      return this.plugins = this.plugins.concat(this.normalize([n])), this;
    }
  }
  return Gt = o, o.default = o, s.registerProcessor(o), e.registerProcessor(o), Gt;
}
var Yt, mr;
function rn() {
  if (mr) return Yt;
  mr = 1;
  let e = uu(), r = st(), i = Re(), s = eu(), o = at(), f = ru(), n = Qi(), c = lt(), p = Pr(), a = Tr(), l = nt(), h = nu(), t = un(), u = su(), m = Ge(), v = iu(), y = it(), d = Cr();
  function g(...w) {
    return w.length === 1 && Array.isArray(w[0]) && (w = w[0]), new t(w);
  }
  return g.plugin = function(x, b) {
    let S = !1;
    function E(...O) {
      console && console.warn && !S && (S = !0, console.warn(
        x + `: postcss.plugin was deprecated. Migration guide:
https://evilmartians.com/chronicles/postcss-8-plugin-migration`
      ), process.env.LANG && process.env.LANG.startsWith("cn") && console.warn(
        x + `: 里面 postcss.plugin 被弃用. 迁移指南:
https://www.w3ctech.com/topic/2226`
      ));
      let P = b(...O);
      return P.postcssPlugin = x, P.postcssVersion = new t().version, P;
    }
    let k;
    return Object.defineProperty(E, "postcss", {
      get() {
        return k || (k = E()), k;
      }
    }), E.process = function(O, P, A) {
      return g([E(A)]).process(O, P);
    }, E;
  }, g.stringify = y, g.parse = h, g.fromJSON = n, g.list = a, g.comment = (w) => new r(w), g.atRule = (w) => new e(w), g.decl = (w) => new o(w), g.rule = (w) => new v(w), g.root = (w) => new m(w), g.document = (w) => new f(w), g.CssSyntaxError = s, g.Declaration = o, g.Container = i, g.Processor = t, g.Document = f, g.Comment = r, g.Warning = d, g.AtRule = e, g.Result = u, g.Input = c, g.Rule = v, g.Root = m, g.Node = l, p.registerPostcss(g), Yt = g, g.default = g, Yt;
}
var Wt, gr;
function nn() {
  if (gr) return Wt;
  gr = 1;
  const e = /* @__PURE__ */ ji(), r = Ui(), { isPlainObject: i } = Hi(), s = zi(), o = Yi(), { parse: f } = rn(), n = [
    "img",
    "audio",
    "video",
    "picture",
    "svg",
    "object",
    "map",
    "iframe",
    "embed"
  ], c = ["script", "style"];
  function p(y, d) {
    y && Object.keys(y).forEach(function(g) {
      d(y[g], g);
    });
  }
  function a(y, d) {
    return {}.hasOwnProperty.call(y, d);
  }
  function l(y, d) {
    const g = [];
    return p(y, function(w) {
      d(w) && g.push(w);
    }), g;
  }
  function h(y) {
    for (const d in y)
      if (a(y, d))
        return !1;
    return !0;
  }
  function t(y) {
    return y.map(function(d) {
      if (!d.url)
        throw new Error("URL missing");
      return d.url + (d.w ? ` ${d.w}w` : "") + (d.h ? ` ${d.h}h` : "") + (d.d ? ` ${d.d}x` : "");
    }).join(", ");
  }
  Wt = m;
  const u = /^[^\0\t\n\f\r /<=>]+$/;
  function m(y, d, g) {
    if (y == null)
      return "";
    typeof y == "number" && (y = y.toString());
    let w = "", x = "";
    function b(C, _) {
      const N = this;
      this.tag = C, this.attribs = _ || {}, this.tagPosition = w.length, this.text = "", this.mediaChildren = [], this.updateParentNodeText = function() {
        if (H.length) {
          const U = H[H.length - 1];
          U.text += N.text;
        }
      }, this.updateParentNodeMediaChildren = function() {
        H.length && n.includes(this.tag) && H[H.length - 1].mediaChildren.push(this.tag);
      };
    }
    d = Object.assign({}, m.defaults, d), d.parser = Object.assign({}, v, d.parser);
    const S = function(C) {
      return d.allowedTags === !1 || (d.allowedTags || []).indexOf(C) > -1;
    };
    c.forEach(function(C) {
      S(C) && !d.allowVulnerableTags && console.warn(`

⚠️ Your \`allowedTags\` option includes, \`${C}\`, which is inherently
vulnerable to XSS attacks. Please remove it from \`allowedTags\`.
Or, to disable this warning, add the \`allowVulnerableTags\` option
and ensure you are accounting for this risk.

`);
    });
    const E = d.nonTextTags || [
      "script",
      "style",
      "textarea",
      "option"
    ];
    let k, O;
    d.allowedAttributes && (k = {}, O = {}, p(d.allowedAttributes, function(C, _) {
      k[_] = [];
      const N = [];
      C.forEach(function(U) {
        typeof U == "string" && U.indexOf("*") >= 0 ? N.push(r(U).replace(/\\\*/g, ".*")) : k[_].push(U);
      }), N.length && (O[_] = new RegExp("^(" + N.join("|") + ")$"));
    }));
    const P = {}, A = {}, T = {};
    p(d.allowedClasses, function(C, _) {
      if (k && (a(k, _) || (k[_] = []), k[_].push("class")), P[_] = C, Array.isArray(C)) {
        const N = [];
        P[_] = [], T[_] = [], C.forEach(function(U) {
          typeof U == "string" && U.indexOf("*") >= 0 ? N.push(r(U).replace(/\\\*/g, ".*")) : U instanceof RegExp ? T[_].push(U) : P[_].push(U);
        }), N.length && (A[_] = new RegExp("^(" + N.join("|") + ")$"));
      }
    });
    const L = {};
    let M;
    p(d.transformTags, function(C, _) {
      let N;
      typeof C == "function" ? N = C : typeof C == "string" && (N = m.simpleTransform(C)), _ === "*" ? M = N : L[_] = N;
    });
    let D, H, Y, Q, ne, se, qe = !1;
    V();
    const Ve = new e.Parser({
      onopentag: function(C, _) {
        if (d.enforceHtmlBoundary && C === "html" && V(), ne) {
          se++;
          return;
        }
        const N = new b(C, _);
        H.push(N);
        let U = !1;
        const ge = !!N.text;
        let ce;
        if (a(L, C) && (ce = L[C](C, _), N.attribs = _ = ce.attribs, ce.text !== void 0 && (N.innerText = ce.text), C !== ce.tagName && (N.name = C = ce.tagName, Q[D] = ce.tagName)), M && (ce = M(C, _), N.attribs = _ = ce.attribs, C !== ce.tagName && (N.name = C = ce.tagName, Q[D] = ce.tagName)), (!S(C) || d.disallowedTagsMode === "recursiveEscape" && !h(Y) || d.nestingLimit != null && D >= d.nestingLimit) && (U = !0, Y[D] = !0, (d.disallowedTagsMode === "discard" || d.disallowedTagsMode === "completelyDiscard") && E.indexOf(C) !== -1 && (ne = !0, se = 1), Y[D] = !0), D++, U) {
          if (d.disallowedTagsMode === "discard" || d.disallowedTagsMode === "completelyDiscard")
            return;
          x = w, w = "";
        }
        w += "<" + C, C === "script" && (d.allowedScriptHostnames || d.allowedScriptDomains) && (N.innerText = ""), (!k || a(k, C) || k["*"]) && p(_, function(ie, Z) {
          if (!u.test(Z)) {
            delete N.attribs[Z];
            return;
          }
          if (ie === "" && !d.allowedEmptyAttributes.includes(Z) && (d.nonBooleanAttributes.includes(Z) || d.nonBooleanAttributes.includes("*"))) {
            delete N.attribs[Z];
            return;
          }
          let ct = !1;
          if (!k || a(k, C) && k[C].indexOf(Z) !== -1 || k["*"] && k["*"].indexOf(Z) !== -1 || a(O, C) && O[C].test(Z) || O["*"] && O["*"].test(Z))
            ct = !0;
          else if (k && k[C]) {
            for (const J of k[C])
              if (i(J) && J.name && J.name === Z) {
                ct = !0;
                let X = "";
                if (J.multiple === !0) {
                  const Le = ie.split(" ");
                  for (const De of Le)
                    J.values.indexOf(De) !== -1 && (X === "" ? X = De : X += " " + De);
                } else J.values.indexOf(ie) >= 0 && (X = ie);
                ie = X;
              }
          }
          if (ct) {
            if (d.allowedSchemesAppliedToAttributes.indexOf(Z) !== -1 && Pe(C, ie)) {
              delete N.attribs[Z];
              return;
            }
            if (C === "script" && Z === "src") {
              let J = !0;
              try {
                const X = Ye(ie);
                if (d.allowedScriptHostnames || d.allowedScriptDomains) {
                  const Le = (d.allowedScriptHostnames || []).find(function(we) {
                    return we === X.url.hostname;
                  }), De = (d.allowedScriptDomains || []).find(function(we) {
                    return X.url.hostname === we || X.url.hostname.endsWith(`.${we}`);
                  });
                  J = Le || De;
                }
              } catch {
                J = !1;
              }
              if (!J) {
                delete N.attribs[Z];
                return;
              }
            }
            if (C === "iframe" && Z === "src") {
              let J = !0;
              try {
                const X = Ye(ie);
                if (X.isRelativeUrl)
                  J = a(d, "allowIframeRelativeUrls") ? d.allowIframeRelativeUrls : !d.allowedIframeHostnames && !d.allowedIframeDomains;
                else if (d.allowedIframeHostnames || d.allowedIframeDomains) {
                  const Le = (d.allowedIframeHostnames || []).find(function(we) {
                    return we === X.url.hostname;
                  }), De = (d.allowedIframeDomains || []).find(function(we) {
                    return X.url.hostname === we || X.url.hostname.endsWith(`.${we}`);
                  });
                  J = Le || De;
                }
              } catch {
                J = !1;
              }
              if (!J) {
                delete N.attribs[Z];
                return;
              }
            }
            if (Z === "srcset")
              try {
                let J = o(ie);
                if (J.forEach(function(X) {
                  Pe("srcset", X.url) && (X.evil = !0);
                }), J = l(J, function(X) {
                  return !X.evil;
                }), J.length)
                  ie = t(l(J, function(X) {
                    return !X.evil;
                  })), N.attribs[Z] = ie;
                else {
                  delete N.attribs[Z];
                  return;
                }
              } catch {
                delete N.attribs[Z];
                return;
              }
            if (Z === "class") {
              const J = P[C], X = P["*"], Le = A[C], De = T[C], we = A["*"], lu = [
                Le,
                we
              ].concat(De).filter(function($r) {
                return $r;
              });
              if (J && X ? ie = We(ie, s(J, X), lu) : ie = We(ie, J || X, lu), !ie.length) {
                delete N.attribs[Z];
                return;
              }
            }
            if (Z === "style") {
              if (d.parseStyleAttributes)
                try {
                  const J = f(C + " {" + ie + "}", { map: !1 }), X = Fe(J, d.allowedStyles);
                  if (ie = ot(X), ie.length === 0) {
                    delete N.attribs[Z];
                    return;
                  }
                } catch {
                  typeof window < "u" && console.warn('Failed to parse "' + C + " {" + ie + `}", If you're running this in a browser, we recommend to disable style parsing: options.parseStyleAttributes: false, since this only works in a node environment due to a postcss dependency, More info: https://github.com/apostrophecms/sanitize-html/issues/547`), delete N.attribs[Z];
                  return;
                }
              else if (d.allowedStyles)
                throw new Error("allowedStyles option cannot be used together with parseStyleAttributes: false.");
            }
            w += " " + Z, ie && ie.length ? w += '="' + Te(ie, !0) + '"' : d.allowedEmptyAttributes.includes(Z) && (w += '=""');
          } else
            delete N.attribs[Z];
        }), d.selfClosing.indexOf(C) !== -1 ? w += " />" : (w += ">", N.innerText && !ge && !d.textFilter && (w += Te(N.innerText), qe = !0)), U && (w = x + Te(w), x = "");
      },
      ontext: function(C) {
        if (ne)
          return;
        const _ = H[H.length - 1];
        let N;
        if (_ && (N = _.tag, C = _.innerText !== void 0 ? _.innerText : C), d.disallowedTagsMode === "completelyDiscard" && !S(N))
          C = "";
        else if ((d.disallowedTagsMode === "discard" || d.disallowedTagsMode === "completelyDiscard") && (N === "script" || N === "style"))
          w += C;
        else {
          const U = Te(C, !1);
          d.textFilter && !qe ? w += d.textFilter(U, N) : qe || (w += U);
        }
        if (H.length) {
          const U = H[H.length - 1];
          U.text += C;
        }
      },
      onclosetag: function(C, _) {
        if (ne)
          if (se--, !se)
            ne = !1;
          else
            return;
        const N = H.pop();
        if (!N)
          return;
        if (N.tag !== C) {
          H.push(N);
          return;
        }
        ne = d.enforceHtmlBoundary ? C === "html" : !1, D--;
        const U = Y[D];
        if (U) {
          if (delete Y[D], d.disallowedTagsMode === "discard" || d.disallowedTagsMode === "completelyDiscard") {
            N.updateParentNodeText();
            return;
          }
          x = w, w = "";
        }
        if (Q[D] && (C = Q[D], delete Q[D]), d.exclusiveFilter && d.exclusiveFilter(N)) {
          w = w.substr(0, N.tagPosition);
          return;
        }
        if (N.updateParentNodeMediaChildren(), N.updateParentNodeText(), // Already output />
        d.selfClosing.indexOf(C) !== -1 || // Escaped tag, closing tag is implied
        _ && !S(C) && ["escape", "recursiveEscape"].indexOf(d.disallowedTagsMode) >= 0) {
          U && (w = x, x = "");
          return;
        }
        w += "</" + C + ">", U && (w = x + Te(w), x = ""), qe = !1;
      }
    }, d.parser);
    return Ve.write(y), Ve.end(), w;
    function V() {
      w = "", D = 0, H = [], Y = {}, Q = {}, ne = !1, se = 0;
    }
    function Te(C, _) {
      return typeof C != "string" && (C = C + ""), d.parser.decodeEntities && (C = C.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), _ && (C = C.replace(/"/g, "&quot;"))), C = C.replace(/&(?![a-zA-Z0-9#]{1,20};)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), _ && (C = C.replace(/"/g, "&quot;")), C;
    }
    function Pe(C, _) {
      for (_ = _.replace(/[\x00-\x20]+/g, ""); ; ) {
        const ge = _.indexOf("<!--");
        if (ge === -1)
          break;
        const ce = _.indexOf("-->", ge + 4);
        if (ce === -1)
          break;
        _ = _.substring(0, ge) + _.substring(ce + 3);
      }
      const N = _.match(/^([a-zA-Z][a-zA-Z0-9.\-+]*):/);
      if (!N)
        return _.match(/^[/\\]{2}/) ? !d.allowProtocolRelative : !1;
      const U = N[1].toLowerCase();
      return a(d.allowedSchemesByTag, C) ? d.allowedSchemesByTag[C].indexOf(U) === -1 : !d.allowedSchemes || d.allowedSchemes.indexOf(U) === -1;
    }
    function Ye(C) {
      if (C = C.replace(/^(\w+:)?\s*[\\/]\s*[\\/]/, "$1//"), C.startsWith("relative:"))
        throw new Error("relative: exploit attempt");
      let _ = "relative://relative-site";
      for (let ge = 0; ge < 100; ge++)
        _ += `/${ge}`;
      const N = new URL(C, _);
      return {
        isRelativeUrl: N && N.hostname === "relative-site" && N.protocol === "relative:",
        url: N
      };
    }
    function Fe(C, _) {
      if (!_)
        return C;
      const N = C.nodes[0];
      let U;
      return _[N.selector] && _["*"] ? U = s(
        _[N.selector],
        _["*"]
      ) : U = _[N.selector] || _["*"], U && (C.nodes[0].nodes = N.nodes.reduce(dt(U), [])), C;
    }
    function ot(C) {
      return C.nodes[0].nodes.reduce(function(_, N) {
        return _.push(
          `${N.prop}:${N.value}${N.important ? " !important" : ""}`
        ), _;
      }, []).join(";");
    }
    function dt(C) {
      return function(_, N) {
        return a(C, N.prop) && C[N.prop].some(function(ge) {
          return ge.test(N.value);
        }) && _.push(N), _;
      };
    }
    function We(C, _, N) {
      return _ ? (C = C.split(/\s+/), C.filter(function(U) {
        return _.indexOf(U) !== -1 || N.some(function(ge) {
          return ge.test(U);
        });
      }).join(" ")) : C;
    }
  }
  const v = {
    decodeEntities: !0
  };
  return m.defaults = {
    allowedTags: [
      // Sections derived from MDN element categories and limited to the more
      // benign categories.
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element
      // Content sectioning
      "address",
      "article",
      "aside",
      "footer",
      "header",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "hgroup",
      "main",
      "nav",
      "section",
      // Text content
      "blockquote",
      "dd",
      "div",
      "dl",
      "dt",
      "figcaption",
      "figure",
      "hr",
      "li",
      "main",
      "ol",
      "p",
      "pre",
      "ul",
      // Inline text semantics
      "a",
      "abbr",
      "b",
      "bdi",
      "bdo",
      "br",
      "cite",
      "code",
      "data",
      "dfn",
      "em",
      "i",
      "kbd",
      "mark",
      "q",
      "rb",
      "rp",
      "rt",
      "rtc",
      "ruby",
      "s",
      "samp",
      "small",
      "span",
      "strong",
      "sub",
      "sup",
      "time",
      "u",
      "var",
      "wbr",
      // Table content
      "caption",
      "col",
      "colgroup",
      "table",
      "tbody",
      "td",
      "tfoot",
      "th",
      "thead",
      "tr"
    ],
    // Tags that cannot be boolean
    nonBooleanAttributes: [
      "abbr",
      "accept",
      "accept-charset",
      "accesskey",
      "action",
      "allow",
      "alt",
      "as",
      "autocapitalize",
      "autocomplete",
      "blocking",
      "charset",
      "cite",
      "class",
      "color",
      "cols",
      "colspan",
      "content",
      "contenteditable",
      "coords",
      "crossorigin",
      "data",
      "datetime",
      "decoding",
      "dir",
      "dirname",
      "download",
      "draggable",
      "enctype",
      "enterkeyhint",
      "fetchpriority",
      "for",
      "form",
      "formaction",
      "formenctype",
      "formmethod",
      "formtarget",
      "headers",
      "height",
      "hidden",
      "high",
      "href",
      "hreflang",
      "http-equiv",
      "id",
      "imagesizes",
      "imagesrcset",
      "inputmode",
      "integrity",
      "is",
      "itemid",
      "itemprop",
      "itemref",
      "itemtype",
      "kind",
      "label",
      "lang",
      "list",
      "loading",
      "low",
      "max",
      "maxlength",
      "media",
      "method",
      "min",
      "minlength",
      "name",
      "nonce",
      "optimum",
      "pattern",
      "ping",
      "placeholder",
      "popover",
      "popovertarget",
      "popovertargetaction",
      "poster",
      "preload",
      "referrerpolicy",
      "rel",
      "rows",
      "rowspan",
      "sandbox",
      "scope",
      "shape",
      "size",
      "sizes",
      "slot",
      "span",
      "spellcheck",
      "src",
      "srcdoc",
      "srclang",
      "srcset",
      "start",
      "step",
      "style",
      "tabindex",
      "target",
      "title",
      "translate",
      "type",
      "usemap",
      "value",
      "width",
      "wrap",
      // Event handlers
      "onauxclick",
      "onafterprint",
      "onbeforematch",
      "onbeforeprint",
      "onbeforeunload",
      "onbeforetoggle",
      "onblur",
      "oncancel",
      "oncanplay",
      "oncanplaythrough",
      "onchange",
      "onclick",
      "onclose",
      "oncontextlost",
      "oncontextmenu",
      "oncontextrestored",
      "oncopy",
      "oncuechange",
      "oncut",
      "ondblclick",
      "ondrag",
      "ondragend",
      "ondragenter",
      "ondragleave",
      "ondragover",
      "ondragstart",
      "ondrop",
      "ondurationchange",
      "onemptied",
      "onended",
      "onerror",
      "onfocus",
      "onformdata",
      "onhashchange",
      "oninput",
      "oninvalid",
      "onkeydown",
      "onkeypress",
      "onkeyup",
      "onlanguagechange",
      "onload",
      "onloadeddata",
      "onloadedmetadata",
      "onloadstart",
      "onmessage",
      "onmessageerror",
      "onmousedown",
      "onmouseenter",
      "onmouseleave",
      "onmousemove",
      "onmouseout",
      "onmouseover",
      "onmouseup",
      "onoffline",
      "ononline",
      "onpagehide",
      "onpageshow",
      "onpaste",
      "onpause",
      "onplay",
      "onplaying",
      "onpopstate",
      "onprogress",
      "onratechange",
      "onreset",
      "onresize",
      "onrejectionhandled",
      "onscroll",
      "onscrollend",
      "onsecuritypolicyviolation",
      "onseeked",
      "onseeking",
      "onselect",
      "onslotchange",
      "onstalled",
      "onstorage",
      "onsubmit",
      "onsuspend",
      "ontimeupdate",
      "ontoggle",
      "onunhandledrejection",
      "onunload",
      "onvolumechange",
      "onwaiting",
      "onwheel"
    ],
    disallowedTagsMode: "discard",
    allowedAttributes: {
      a: ["href", "name", "target"],
      // We don't currently allow img itself by default, but
      // these attributes would make sense if we did.
      img: ["src", "srcset", "alt", "title", "width", "height", "loading"]
    },
    allowedEmptyAttributes: [
      "alt"
    ],
    // Lots of these won't come up by default because we don't allow them
    selfClosing: ["img", "br", "hr", "area", "base", "basefont", "input", "link", "meta"],
    // URL schemes we permit
    allowedSchemes: ["http", "https", "ftp", "mailto", "tel"],
    allowedSchemesByTag: {},
    allowedSchemesAppliedToAttributes: ["href", "src", "cite"],
    allowProtocolRelative: !0,
    enforceHtmlBoundary: !1,
    parseStyleAttributes: !0
  }, m.simpleTransform = function(y, d, g) {
    return g = g === void 0 ? !0 : g, d = d || {}, function(w, x) {
      let b;
      if (g)
        for (b in d)
          x[b] = d[b];
      else
        x = d;
      return {
        tagName: y,
        attribs: x
      };
    };
  }, Wt;
}
var sn = /* @__PURE__ */ nn();
const au = /* @__PURE__ */ Oi(sn), an = ue({
  name: "DpsFormCheckboxGroup",
  components: {
    DpsFormCheckbox: Zt
  },
  props: {
    /**
     * The unique identifier for the checkbox group (optional).
     * @default undefined
     */
    id: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * modelValue of the checkbox group.
     * @default undefined
     */
    modelValue: {
      type: Array,
      required: !1,
      default: void 0
    },
    /**
     * Name attribute of the checkboxes.
     * @default undefined
     */
    name: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Label for the checkbox group.
     * @default undefined
     */
    label: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Whether the label should be visually hidden.
     * @default false
     */
    hideLabel: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Array of checkbox data to be displayed.
     */
    options: {
      type: Array,
      required: !0
    },
    /**
     * Key to use for the checkbox values.
     * @default "value"
     */
    optionValue: {
      type: String,
      required: !1,
      default: "value"
    },
    /**
     * Key to use for the checkbox labels.
     * @default "label"
     */
    optionLabel: {
      type: String,
      required: !1,
      default: "label"
    },
    /**
     * Disables the checkbox group.
     * @default false
     */
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Checkboxes displayed in line.
     * @default false
     */
    inline: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Truncates the labels.
     * @default false
     */
    truncate: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Size of the checkboxes.
     * @default undefined
     */
    size: {
      type: String,
      required: !1,
      default: void 0
    }
  },
  emits: [
    /**
     * Emitted when one of the values changes.
     * @event module:DpsFormCheckboxGroup#update:modelValue
     */
    "update:modelValue"
  ],
  data() {
    return {
      selected: void 0
    };
  },
  computed: {
    mappedOptions() {
      const e = [];
      return this.options.forEach((r) => {
        let i = {};
        typeof r != "object" ? (i[this.optionValue] = r, i[this.optionLabel] = r) : i = JSON.parse(JSON.stringify(r)), e.push(i);
      }), e;
    },
    uniqueId() {
      return this.id ? this.id : be("dps-form-checkbox-group-");
    }
  },
  created() {
    this.selected = this.modelValue;
  },
  methods: {
    handleChange(e) {
      this.selected = e, this.$emit("update:modelValue", e);
    },
    getLabelContent(e) {
      const r = e[this.optionLabel];
      return typeof r == "string" ? au(r) : r.toString();
    }
  }
}), ln = ["id"], on = { class: "dps-input-wrapper" }, dn = ["innerHTML"];
function cn(e, r, i, s, o, f) {
  const n = ae("DpsFormCheckbox");
  return q(), I("fieldset", {
    id: e.uniqueId,
    class: R(["dps-form-checkbox-group", { "dps-form-checkbox-group--inline": e.inline }])
  }, [
    e.label ? (q(), I("legend", {
      key: 0,
      class: R(["dps-label", { "visually-hidden": e.hideLabel }])
    }, G(e.label), 3)) : j("", !0),
    $("div", on, [
      (q(!0), I(oe, null, Ae(e.mappedOptions, (c, p) => (q(), W(n, {
        id: e.uniqueId + "-option-" + p,
        key: "option-" + p,
        name: e.name,
        value: c[e.optionValue],
        disabled: e.disabled || c.disabled,
        readonly: c.readonly,
        error: c.error,
        block: !e.inline,
        truncate: e.truncate,
        tooltip: c.tooltip,
        size: e.size,
        "model-value": e.selected,
        "onUpdate:modelValue": e.handleChange
      }, {
        default: z(() => [
          $("span", {
            innerHTML: e.getLabelContent(c)
          }, null, 8, dn)
        ]),
        _: 2
      }, 1032, ["id", "name", "value", "disabled", "readonly", "error", "block", "truncate", "tooltip", "size", "model-value", "onUpdate:modelValue"]))), 128))
    ])
  ], 10, ln);
}
const Ya = /* @__PURE__ */ K(an, [["render", cn]]), fn = ue({
  name: "DpsFormGroup",
  props: {
    /**
     * Unique ID for the component (optional).
     * @default undefined
     */
    id: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Description text shown under the content.
     * @default undefined
     */
    description: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Label for the group.
     * @default undefined
     */
    label: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * ID of the element the label is for.
     * @default undefined
     */
    labelFor: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Whether the label should be visually hidden.
     * @default false
     */
    hideLabel: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Text shown on success.
     * @default undefined
     */
    successFeedback: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Text shown on error.
     * @default undefined
     */
    errorFeedback: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Whether the input is valid or not.
     * `undefined` if the state is neutral.
     * @default undefined
     */
    valid: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    /**
     * Whether the group is disabled.
     * @default false
     */
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  computed: {
    uniqueId() {
      return this.id ? this.id : be("dps-form-group-");
    },
    hasError() {
      return this.valid === !1;
    },
    hasSuccess() {
      return this.valid === !0;
    },
    ariaDescribedby() {
      const e = [];
      if (this.description && e.push(this.uniqueId + "__description"), this.successFeedback && this.hasSuccess && e.push(this.uniqueId + "__success-feedback"), this.errorFeedback && this.hasError && e.push(this.uniqueId + "__error-feedback"), e.length)
        return e.join(" ");
    }
  }
}), hn = ["id", "aria-invalid"], pn = ["id", "for"], bn = ["id"], mn = ["id"], gn = ["id"];
function yn(e, r, i, s, o, f) {
  return q(), I("div", {
    id: e.uniqueId,
    class: R(["dps-form-group", {
      "dps-form-group--disabled": e.disabled
    }]),
    role: "group",
    "aria-invalid": e.hasError ? "true" : void 0
  }, [
    e.label ? (q(), I("label", {
      key: 0,
      id: e.uniqueId + "__label",
      for: e.labelFor,
      class: R(["dps-form-group__label", { "visually-hidden": e.hideLabel }])
    }, G(e.label), 11, pn)) : j("", !0),
    $("div", null, [
      B(e.$slots, "default", {
        slotProps: {
          success: e.hasSuccess,
          error: e.hasError,
          disabled: e.disabled,
          description: e.description,
          ariaDescribedby: e.ariaDescribedby
        }
      }),
      e.errorFeedback ? $e((q(), I("div", {
        key: 0,
        id: e.uniqueId + "__error-feedback",
        tabindex: "-1",
        "aria-live": "assertive",
        class: "dps-form-group__feedback dps-form-group__feedback--error"
      }, G(e.errorFeedback), 9, bn)), [
        [Me, e.hasError]
      ]) : j("", !0),
      e.successFeedback ? $e((q(), I("div", {
        key: 1,
        id: e.uniqueId + "__success-feedback",
        tabindex: "-1",
        "aria-live": "assertive",
        class: "dps-form-group__feedback dps-form-group__feedback--success"
      }, G(e.successFeedback), 9, mn)), [
        [Me, e.hasSuccess]
      ]) : j("", !0),
      e.description ? (q(), I("div", {
        key: 2,
        id: e.uniqueId + "__description",
        tabindex: "-1",
        class: "dps-form-group__description"
      }, G(e.description), 9, gn)) : j("", !0)
    ])
  ], 10, hn);
}
const Lr = /* @__PURE__ */ K(fn, [["render", yn]]), vn = ue({
  name: "DpsFormInput",
  props: {
    /**
     * Unique ID of the input field.
     * @default undefined
     */
    id: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * ModelValue of the input.
     * @default undefined
     */
    modelValue: {
      type: [String, Number],
      required: !1,
      default: void 0
    },
    /**
     * Icon displayed at the end of the input field.
     * @default undefined
     */
    icon: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Placeholder text.
     * @default undefined
     */
    placeholder: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Title attribute of the input.
     * @default undefined
     */
    title: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Makes the field readonly.
     * @default false
     */
    readonly: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Disables the field.
     * @default false
     */
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * The maximum string length that the user can enter.
     * @default -1
     */
    maxlength: {
      type: Number,
      required: !1,
      default: -1
    },
    /**
     * The type of the input field.
     * @default "text"
     */
    type: {
      type: String,
      required: !1,
      default: "text"
    },
    /**
     * The step attribute specifying the granularity number values have to
     * adhere to.
     * @default 1
     */
    step: {
      type: Number,
      required: !1,
      default: 1
    },
    /**
     * The minimum value to accept for this input.
     * @default undefined
     */
    min: {
      type: Number,
      required: !1,
      default: void 0
    },
    /**
     * The maximum value to accept for this input.
     * @default undefined
     */
    max: {
      type: Number,
      required: !1,
      default: void 0
    },
    /**
     * Pattern the value must match to be valid.
     * @default undefined
     */
    pattern: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Required field.
     * @default false
     */
    required: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Aria label for the input.
     * @default undefined
     */
    ariaLabel: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * ID of the element that labels the input.
     * @default undefined
     */
    ariaLabelledby: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * ID of the element that describes the input.
     * @default undefined
     */
    ariaDescribedby: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Vertical size of the input field.
     * @default undefined
     */
    size: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Displays the success state.
     * @default false
     */
    success: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Displays the error state.
     * @default false
     */
    error: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  emits: [
    /**
     * Emitted when the value changes.
     * @event module:DpsFormInput#update:modelValue
     */
    "update:modelValue",
    /**
     * Emitted on keyup.
     * @event module:DpsFormInput#keyup
     */
    "keyup",
    /**
     * Emitted on keydown.
     * @event module:DpsFormInput#keydown
     */
    "keydown",
    /**
     * Emitted on blur.
     * @event module:DpsFormInput#blur
     */
    "blur",
    /**
     * Emitted on focus.
     * @event module:DpsFormInput#focus
     */
    "focus"
  ],
  computed: {
    iconName() {
      if (this.icon)
        return this.icon;
      if (this.error)
        return "warning";
      if (this.success)
        return "check";
    },
    showSearchCancelButton() {
      var e;
      return this.type === "search" && typeof this.modelValue == "string" && ((e = this.modelValue) == null ? void 0 : e.length) > 0;
    }
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    },
    cancelSearch() {
      this.$emit("update:modelValue", ""), this.focus();
    },
    handleInput(e) {
      const i = e.target.value;
      this.$emit("update:modelValue", i);
    }
  }
}), wn = ["id", "value", "type", "step", "min", "max", "placeholder", "title", "pattern", "required", "readonly", "disabled", "maxlength", "aria-label", "aria-describedby", "aria-labelledby"];
function Sn(e, r, i, s, o, f) {
  return q(), I("div", {
    class: R(["dps-form-input dps-input-wrapper", {
      "dps-form-input--success": e.success,
      "dps-form-input--error": e.error
    }])
  }, [
    $("input", {
      id: e.id,
      ref: "input",
      value: e.modelValue,
      class: R(["dps-input", {
        "dps-input--success": e.success,
        "dps-input--error": e.error,
        "dps-input--size-sm": e.size === "sm",
        "dps-input--icon": e.iconName
      }]),
      type: e.type,
      step: e.type === "number" ? e.step : void 0,
      min: e.type === "number" ? e.min : void 0,
      max: e.type === "number" ? e.max : void 0,
      placeholder: e.placeholder,
      title: e.title,
      pattern: e.pattern,
      required: e.required,
      readonly: e.readonly,
      disabled: e.disabled,
      maxlength: e.maxlength,
      "aria-label": e.ariaLabel,
      "aria-describedby": e.ariaDescribedby,
      "aria-labelledby": e.ariaLabelledby,
      onKeyup: r[0] || (r[0] = re((n) => e.$emit("keyup", n), ["stop"])),
      onKeydown: r[1] || (r[1] = re((n) => e.$emit("keydown", n), ["stop"])),
      onBlur: r[2] || (r[2] = re((n) => e.$emit("blur", n), ["stop"])),
      onFocus: r[3] || (r[3] = re((n) => e.$emit("focus", n), ["stop"])),
      onInput: r[4] || (r[4] = (...n) => e.handleInput && e.handleInput(...n))
    }, null, 42, wn),
    e.showSearchCancelButton ? (q(), I("button", {
      key: 0,
      type: "button",
      class: "dps-form-input__search-cancel-button dps-icon dps-icon--close",
      title: "Eingabe zurücksetzen",
      onClick: r[5] || (r[5] = (...n) => e.cancelSearch && e.cancelSearch(...n))
    })) : e.iconName ? (q(), I("span", {
      key: 1,
      class: R(["dps-icon", "dps-icon--" + e.iconName])
    }, null, 2)) : j("", !0)
  ], 2);
}
const Wa = /* @__PURE__ */ K(vn, [["render", Sn]]), xn = ue({
  name: "DpsFormRadio",
  props: {
    /**
     * Unique ID for the radio (optional)
     * @default undefined
     */
    id: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * ModelValue of the radio.
     * @default undefined
     */
    modelValue: {
      type: [String, Boolean, Number],
      required: !1,
      default: void 0
    },
    /**
     * Name attribute of the radio input.
     */
    name: {
      type: String,
      required: !0
    },
    /**
     * Value of the radio input.
     */
    value: {
      type: [String, Boolean, Number],
      required: !0
    },
    /**
     * Disables the radio input.
     * @default false
     */
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    },
    readonly: {
      type: Boolean,
      required: !1,
      default: !1
    },
    error: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Displays the component as a block.
     * @default false
     */
    block: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Truncates the label.
     * @default false
     */
    truncate: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Hides the label.
     * @default false
     */
    hideLabel: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  emits: [
    /**
     * Emitted when the selected value changes.
     * @event module:DpsFormRadio#update:modelValue
     */
    "update:modelValue"
  ],
  computed: {
    uniqueId() {
      return this.id ? this.id : be("dps-form-radio-");
    },
    isChecked() {
      return this.modelValue === this.value;
    }
  },
  methods: {
    handleChange(e) {
      const i = e.target.value;
      this.$emit("update:modelValue", i);
    }
  }
}), En = ["id", "name", "value", "checked", "disabled", "readonly"], An = ["for"], kn = {
  key: 0,
  class: "sr-only"
};
function qn(e, r, i, s, o, f) {
  return q(), I("div", {
    class: R(["dps-form-radio dps-input-wrapper", { "dps-form-radio--block": e.block || e.truncate }])
  }, [
    $("input", {
      id: e.uniqueId,
      class: R(["dps-form-radio__input dps-radio", { "dps-radio--error": e.error }]),
      type: "radio",
      name: e.name,
      value: e.value,
      checked: e.isChecked,
      disabled: e.disabled || e.readonly,
      readonly: e.readonly,
      onChange: r[0] || (r[0] = (...n) => e.handleChange && e.handleChange(...n))
    }, null, 42, En),
    $("label", {
      for: e.uniqueId,
      class: R(["dps-form-radio__label dps-label", {
        "dps-form-radio__label--input-only": e.hideLabel,
        "dps-text--ellipse": e.truncate
      }])
    }, [
      e.hideLabel ? (q(), I("span", kn, [
        B(e.$slots, "default")
      ])) : B(e.$slots, "default", { key: 1 })
    ], 10, An)
  ], 2);
}
const Tn = /* @__PURE__ */ K(xn, [["render", qn]]), Dn = ue({
  name: "DpsFormRadioGroup",
  components: {
    DpsFormRadio: Tn
  },
  props: {
    /**
     * The unique identifier for the radio group (optional).
     * @default undefined
     */
    id: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * ModelValue of the radio group.
     * @default undefined
     */
    modelValue: {
      type: [String, Boolean, Number],
      required: !1,
      default: void 0
    },
    /**
     * Name of the radio inputs.
     */
    name: {
      type: String,
      required: !0
    },
    /**
     * Label for the radio group.
     * @default undefined
     */
    label: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Whether the label should be visually hidden.
     * @default false
     */
    hideLabel: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Array of options to be displayed.
     */
    options: {
      type: Array,
      required: !0
    },
    /**
     * Which key to use for the option value.
     * @default "value"
     */
    optionValue: {
      type: String,
      required: !1,
      default: "value"
    },
    /**
     * Which key to use for the option label.
     * @default "label"
     */
    optionLabel: {
      type: String,
      required: !1,
      default: "label"
    },
    /**
     * Whether the radio group should be disabled.
     * @default false
     */
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Whether the radio inputs should be displayed in line.
     * @default false
     */
    inline: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Whether the labels should be truncated.
     * @default false
     */
    truncate: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  emits: [
    /**
     * Emitted when the selected value changes.
     * @event module:DpsFormRadioGroup#update:modelValue
     */
    "update:modelValue"
  ],
  data() {
    return {
      selected: void 0
    };
  },
  computed: {
    mappedOptions() {
      const e = [];
      return this.options.forEach((r) => {
        let i = {};
        typeof r != "object" ? (i[this.optionValue] = r, i[this.optionLabel] = r) : i = JSON.parse(JSON.stringify(r)), e.push(i);
      }), e;
    },
    uniqueId() {
      return this.id ? this.id : be("dps-form-radio-group-");
    }
  },
  watch: {
    modelValue(e) {
      this.selected = e;
    }
  },
  created() {
    this.selected = this.modelValue;
  },
  methods: {
    handleChange(e) {
      this.$emit("update:modelValue", e);
    },
    getLabelContent(e) {
      const r = e[this.optionLabel];
      return typeof r == "string" ? au(r) : r.toString();
    }
  }
}), Cn = ["id"], On = { class: "dps-input-wrapper" }, Pn = ["innerHTML"];
function Ln(e, r, i, s, o, f) {
  const n = ae("DpsFormRadio");
  return q(), I("fieldset", {
    id: e.uniqueId,
    class: R(["dps-form-radio-group", { "dps-form-radio-group--inline": e.inline }])
  }, [
    e.label ? (q(), I("legend", {
      key: 0,
      class: R(["dps-label", { "visually-hidden": e.hideLabel }])
    }, G(e.label), 3)) : j("", !0),
    $("div", On, [
      (q(!0), I(oe, null, Ae(e.mappedOptions, (c, p) => (q(), W(n, {
        id: e.uniqueId + "-option-" + p,
        key: "option-" + p,
        name: e.name,
        value: c[e.optionValue],
        disabled: e.disabled || c.disabled,
        readonly: c.readonly,
        error: c.error,
        block: !e.inline,
        truncate: e.truncate,
        "model-value": e.selected,
        "onUpdate:modelValue": e.handleChange
      }, {
        default: z(() => [
          $("span", {
            innerHTML: e.getLabelContent(c)
          }, null, 8, Pn)
        ]),
        _: 2
      }, 1032, ["id", "name", "value", "disabled", "readonly", "error", "block", "truncate", "model-value", "onUpdate:modelValue"]))), 128))
    ])
  ], 10, Cn);
}
const Ka = /* @__PURE__ */ K(Dn, [["render", Ln]]);
function Kt(e) {
  return e === 0 ? !1 : Array.isArray(e) && e.length === 0 ? !0 : !e;
}
function In(e) {
  return (...r) => !e(...r);
}
function Nn(e, r) {
  return e === void 0 && (e = "undefined"), e === null && (e = "null"), e === !1 && (e = "false"), e.toString().toLowerCase().indexOf(r.trim()) !== -1;
}
function Ir(e, r, i, s) {
  return r ? e.filter((o) => Nn(s(o, i), r)).sort((o, f) => s(o, i).length - s(f, i).length) : e;
}
function _n(e) {
  return e.filter((r) => !r.$isLabel);
}
function Jt(e, r) {
  return (i) => i.reduce((s, o) => o[e] && o[e].length ? (s.push({
    $groupLabel: o[r],
    $isLabel: !0
  }), s.concat(o[e])) : s, []);
}
function $n(e, r, i, s, o) {
  return (f) => f.map((n) => {
    if (!n[i])
      return console.warn("Options passed to vue-multiselect do not contain groups, despite the config."), [];
    const c = Ir(n[i], e, r, o);
    return c.length ? {
      [s]: n[s],
      [i]: c
    } : [];
  });
}
const yr = (...e) => (r) => e.reduce((i, s) => s(i), r);
var Mn = {
  data() {
    return {
      search: "",
      isOpen: !1,
      preferredOpenDirection: "below",
      optimizedHeight: this.maxHeight
    };
  },
  props: {
    /**
     * Decide whether to filter the results based on search query.
     * Useful for async filtering, where we search through more complex data.
     * @type {Boolean}
     */
    internalSearch: {
      type: Boolean,
      default: !0
    },
    /**
     * Array of available options: Objects, Strings or Integers.
     * If array of objects, visible label will default to option.label.
     * If `labal` prop is passed, label will equal option['label']
     * @type {Array}
     */
    options: {
      type: Array,
      required: !0
    },
    /**
     * Equivalent to the `multiple` attribute on a `<select>` input.
     * @default false
     * @type {Boolean}
     */
    multiple: {
      type: Boolean,
      default: !1
    },
    /**
     * Key to compare objects
     * @default 'id'
     * @type {String}
     */
    trackBy: {
      type: String
    },
    /**
     * Label to look for in option Object
     * @default 'label'
     * @type {String}
     */
    label: {
      type: String
    },
    /**
     * Enable/disable search in options
     * @default true
     * @type {Boolean}
     */
    searchable: {
      type: Boolean,
      default: !0
    },
    /**
     * Clear the search input after `)
     * @default true
     * @type {Boolean}
     */
    clearOnSelect: {
      type: Boolean,
      default: !0
    },
    /**
     * Hide already selected options
     * @default false
     * @type {Boolean}
     */
    hideSelected: {
      type: Boolean,
      default: !1
    },
    /**
     * Equivalent to the `placeholder` attribute on a `<select>` input.
     * @default 'Select option'
     * @type {String}
     */
    placeholder: {
      type: String,
      default: "Select option"
    },
    /**
     * Allow to remove all selected values
     * @default true
     * @type {Boolean}
     */
    allowEmpty: {
      type: Boolean,
      default: !0
    },
    /**
     * Reset this.internalValue, this.search after this.internalValue changes.
     * Useful if want to create a stateless dropdown.
     * @default false
     * @type {Boolean}
     */
    resetAfter: {
      type: Boolean,
      default: !1
    },
    /**
     * Enable/disable closing after selecting an option
     * @default true
     * @type {Boolean}
     */
    closeOnSelect: {
      type: Boolean,
      default: !0
    },
    /**
     * Function to interpolate the custom label
     * @default false
     * @type {Function}
     */
    customLabel: {
      type: Function,
      default(e, r) {
        return Kt(e) ? "" : r ? e[r] : e;
      }
    },
    /**
     * Disable / Enable tagging
     * @default false
     * @type {Boolean}
     */
    taggable: {
      type: Boolean,
      default: !1
    },
    /**
     * String to show when highlighting a potential tag
     * @default 'Press enter to create a tag'
     * @type {String}
    */
    tagPlaceholder: {
      type: String,
      default: "Press enter to create a tag"
    },
    /**
     * By default new tags will appear above the search results.
     * Changing to 'bottom' will revert this behaviour
     * and will proritize the search results
     * @default 'top'
     * @type {String}
    */
    tagPosition: {
      type: String,
      default: "top"
    },
    /**
     * Number of allowed selected options. No limit if 0.
     * @default 0
     * @type {Number}
    */
    max: {
      type: [Number, Boolean],
      default: !1
    },
    /**
     * Will be passed with all events as second param.
     * Useful for identifying events origin.
     * @default null
     * @type {String|Integer}
    */
    id: {
      default: null
    },
    /**
     * Limits the options displayed in the dropdown
     * to the first X options.
     * @default 1000
     * @type {Integer}
    */
    optionsLimit: {
      type: Number,
      default: 1e3
    },
    /**
     * Name of the property containing
     * the group values
     * @default 1000
     * @type {String}
    */
    groupValues: {
      type: String
    },
    /**
     * Name of the property containing
     * the group label
     * @default 1000
     * @type {String}
    */
    groupLabel: {
      type: String
    },
    /**
     * Allow to select all group values
     * by selecting the group label
     * @default false
     * @type {Boolean}
     */
    groupSelect: {
      type: Boolean,
      default: !1
    },
    /**
     * Array of keyboard keys to block
     * when selecting
     * @default 1000
     * @type {String}
    */
    blockKeys: {
      type: Array,
      default() {
        return [];
      }
    },
    /**
     * Prevent from wiping up the search value
     * @default false
     * @type {Boolean}
    */
    preserveSearch: {
      type: Boolean,
      default: !1
    },
    /**
     * Select 1st options if value is empty
     * @default false
     * @type {Boolean}
    */
    preselectFirst: {
      type: Boolean,
      default: !1
    },
    /**
     * Prevent autofocus
     * @default false
     * @type {Boolean}
    */
    preventAutofocus: {
      type: Boolean,
      default: !1
    }
  },
  mounted() {
    !this.multiple && this.max && console.warn("[Vue-Multiselect warn]: Max prop should not be used when prop Multiple equals false."), this.preselectFirst && !this.internalValue.length && this.options.length && this.select(this.filteredOptions[0]);
  },
  computed: {
    internalValue() {
      return this.modelValue || this.modelValue === 0 ? Array.isArray(this.modelValue) ? this.modelValue : [this.modelValue] : [];
    },
    filteredOptions() {
      const e = this.search || "", r = e.toLowerCase().trim();
      let i = this.options.concat();
      return this.internalSearch ? i = this.groupValues ? this.filterAndFlat(i, r, this.label) : Ir(i, r, this.label, this.customLabel) : i = this.groupValues ? Jt(this.groupValues, this.groupLabel)(i) : i, i = this.hideSelected ? i.filter(In(this.isSelected)) : i, this.taggable && r.length && !this.isExistingOption(r) && (this.tagPosition === "bottom" ? i.push({ isTag: !0, label: e }) : i.unshift({ isTag: !0, label: e })), i.slice(0, this.optionsLimit);
    },
    valueKeys() {
      return this.trackBy ? this.internalValue.map((e) => e[this.trackBy]) : this.internalValue;
    },
    optionKeys() {
      return (this.groupValues ? this.flatAndStrip(this.options) : this.options).map((r) => this.customLabel(r, this.label).toString().toLowerCase());
    },
    currentOptionLabel() {
      return this.multiple ? this.searchable ? "" : this.placeholder : this.internalValue.length ? this.getOptionLabel(this.internalValue[0]) : this.searchable ? "" : this.placeholder;
    }
  },
  watch: {
    internalValue: {
      handler() {
        this.resetAfter && this.internalValue.length && (this.search = "", this.$emit("update:modelValue", this.multiple ? [] : null));
      },
      deep: !0
    },
    search() {
      this.$emit("search-change", this.search);
    }
  },
  emits: ["open", "search-change", "close", "select", "update:modelValue", "remove", "tag"],
  methods: {
    /**
     * Returns the internalValue in a way it can be emited to the parent
     * @returns {Object||Array||String||Integer}
     */
    getValue() {
      return this.multiple ? this.internalValue : this.internalValue.length === 0 ? null : this.internalValue[0];
    },
    /**
     * Filters and then flattens the options list
     * @param  {Array}
     * @return {Array} returns a filtered and flat options list
     */
    filterAndFlat(e, r, i) {
      return yr(
        $n(r, i, this.groupValues, this.groupLabel, this.customLabel),
        Jt(this.groupValues, this.groupLabel)
      )(e);
    },
    /**
     * Flattens and then strips the group labels from the options list
     * @param  {Array}
     * @return {Array} returns a flat options list without group labels
     */
    flatAndStrip(e) {
      return yr(
        Jt(this.groupValues, this.groupLabel),
        _n
      )(e);
    },
    /**
     * Updates the search value
     * @param  {String}
     */
    updateSearch(e) {
      this.search = e;
    },
    /**
     * Finds out if the given query is already present
     * in the available options
     * @param  {String}
     * @return {Boolean} returns true if element is available
     */
    isExistingOption(e) {
      return this.options ? this.optionKeys.indexOf(e) > -1 : !1;
    },
    /**
     * Finds out if the given element is already present
     * in the result value
     * @param  {Object||String||Integer} option passed element to check
     * @returns {Boolean} returns true if element is selected
     */
    isSelected(e) {
      const r = this.trackBy ? e[this.trackBy] : e;
      return this.valueKeys.indexOf(r) > -1;
    },
    /**
     * Finds out if the given option is disabled
     * @param  {Object||String||Integer} option passed element to check
     * @returns {Boolean} returns true if element is disabled
     */
    isOptionDisabled(e) {
      return !!e.$isDisabled;
    },
    /**
     * Returns empty string when options is null/undefined
     * Returns tag query if option is tag.
     * Returns the customLabel() results and casts it to string.
     *
     * @param  {Object||String||Integer} Passed option
     * @returns {Object||String}
     */
    getOptionLabel(e) {
      if (Kt(e)) return "";
      if (e.isTag) return e.label;
      if (e.$isLabel) return e.$groupLabel;
      const r = this.customLabel(e, this.label);
      return Kt(r) ? "" : r;
    },
    /**
     * Add the given option to the list of selected options
     * or sets the option as the selected option.
     * If option is already selected -> remove it from the results.
     *
     * @param  {Object||String||Integer} option to select/deselect
     * @param  {Boolean} block removing
     */
    select(e, r) {
      if (e.$isLabel && this.groupSelect) {
        this.selectGroup(e);
        return;
      }
      if (!(this.blockKeys.indexOf(r) !== -1 || this.disabled || e.$isDisabled || e.$isLabel) && !(this.max && this.multiple && this.internalValue.length === this.max) && !(r === "Tab" && !this.pointerDirty)) {
        if (e.isTag)
          this.$emit("tag", e.label, this.id), this.search = "", this.closeOnSelect && !this.multiple && this.deactivate();
        else {
          if (this.isSelected(e)) {
            r !== "Tab" && this.removeElement(e);
            return;
          }
          this.multiple ? this.$emit("update:modelValue", this.internalValue.concat([e])) : this.$emit("update:modelValue", e), this.$emit("select", e, this.id), this.clearOnSelect && (this.search = "");
        }
        this.closeOnSelect && this.deactivate();
      }
    },
    /**
     * Add the given group options to the list of selected options
     * If all group optiona are already selected -> remove it from the results.
     *
     * @param  {Object||String||Integer} group to select/deselect
     */
    selectGroup(e) {
      const r = this.options.find((i) => i[this.groupLabel] === e.$groupLabel);
      if (r) {
        if (this.wholeGroupSelected(r)) {
          this.$emit("remove", r[this.groupValues], this.id);
          const i = this.internalValue.filter(
            (s) => r[this.groupValues].indexOf(s) === -1
          );
          this.$emit("update:modelValue", i);
        } else {
          let i = r[this.groupValues].filter(
            (s) => !(this.isOptionDisabled(s) || this.isSelected(s))
          );
          this.max && i.splice(this.max - this.internalValue.length), this.$emit("select", i, this.id), this.$emit(
            "update:modelValue",
            this.internalValue.concat(i)
          );
        }
        this.closeOnSelect && this.deactivate();
      }
    },
    /**
     * Helper to identify if all values in a group are selected
     *
     * @param {Object} group to validated selected values against
     */
    wholeGroupSelected(e) {
      return e[this.groupValues].every(
        (r) => this.isSelected(r) || this.isOptionDisabled(r)
      );
    },
    /**
     * Helper to identify if all values in a group are disabled
     *
     * @param {Object} group to check for disabled values
     */
    wholeGroupDisabled(e) {
      return e[this.groupValues].every(this.isOptionDisabled);
    },
    /**
     * Removes the given option from the selected options.
     * Additionally checks this.allowEmpty prop if option can be removed when
     * it is the last selected option.
     *
     * @param  {type} option description
     * @return {type}        description
     */
    removeElement(e, r = !0) {
      if (this.disabled || e.$isDisabled) return;
      if (!this.allowEmpty && this.internalValue.length <= 1) {
        this.deactivate();
        return;
      }
      const i = typeof e == "object" ? this.valueKeys.indexOf(e[this.trackBy]) : this.valueKeys.indexOf(e);
      if (this.multiple) {
        const s = this.internalValue.slice(0, i).concat(this.internalValue.slice(i + 1));
        this.$emit("update:modelValue", s);
      } else
        this.$emit("update:modelValue", null);
      this.$emit("remove", e, this.id), this.closeOnSelect && r && this.deactivate();
    },
    /**
     * Calls this.removeElement() with the last element
     * from this.internalValue (selected element Array)
     *
     * @fires this#removeElement
     */
    removeLastElement() {
      this.blockKeys.indexOf("Delete") === -1 && this.search.length === 0 && Array.isArray(this.internalValue) && this.internalValue.length && this.removeElement(this.internalValue[this.internalValue.length - 1], !1);
    },
    /**
     * Opens the multiselect’s dropdown.
     * Sets this.isOpen to TRUE
     */
    activate() {
      this.isOpen || this.disabled || (this.adjustPosition(), this.groupValues && this.pointer === 0 && this.filteredOptions.length && (this.pointer = 1), this.isOpen = !0, this.searchable ? (this.preserveSearch || (this.search = ""), this.preventAutofocus || this.$nextTick(() => this.$refs.search && this.$refs.search.focus())) : this.preventAutofocus || typeof this.$el < "u" && this.$el.focus(), this.$emit("open", this.id));
    },
    /**
     * Closes the multiselect’s dropdown.
     * Sets this.isOpen to FALSE
     */
    deactivate() {
      this.isOpen && (this.isOpen = !1, this.searchable ? this.$refs.search !== null && typeof this.$refs.search < "u" && this.$refs.search.blur() : typeof this.$el < "u" && this.$el.blur(), this.preserveSearch || (this.search = ""), this.$emit("close", this.getValue(), this.id));
    },
    /**
     * Call this.activate() or this.deactivate()
     * depending on this.isOpen value.
     *
     * @fires this#activate || this#deactivate
     * @property {Boolean} isOpen indicates if dropdown is open
     */
    toggle() {
      this.isOpen ? this.deactivate() : this.activate();
    },
    /**
     * Updates the hasEnoughSpace variable used for
     * detecting where to expand the dropdown
     */
    adjustPosition() {
      if (typeof window > "u") return;
      const e = this.$el.getBoundingClientRect().top, r = window.innerHeight - this.$el.getBoundingClientRect().bottom;
      r > this.maxHeight || r > e || this.openDirection === "below" || this.openDirection === "bottom" ? (this.preferredOpenDirection = "below", this.optimizedHeight = Math.min(r - 40, this.maxHeight)) : (this.preferredOpenDirection = "above", this.optimizedHeight = Math.min(e - 40, this.maxHeight));
    }
  }
}, Bn = {
  data() {
    return {
      pointer: 0,
      pointerDirty: !1
    };
  },
  props: {
    /**
     * Enable/disable highlighting of the pointed value.
     * @type {Boolean}
     * @default true
     */
    showPointer: {
      type: Boolean,
      default: !0
    },
    optionHeight: {
      type: Number,
      default: 40
    }
  },
  computed: {
    pointerPosition() {
      return this.pointer * this.optionHeight;
    },
    visibleElements() {
      return this.optimizedHeight / this.optionHeight;
    }
  },
  watch: {
    filteredOptions() {
      this.pointerAdjust();
    },
    isOpen() {
      this.pointerDirty = !1;
    },
    pointer() {
      this.$refs.search && this.$refs.search.setAttribute("aria-activedescendant", this.id + "-" + this.pointer.toString());
    }
  },
  methods: {
    optionHighlight(e, r) {
      return {
        "multiselect__option--highlight": e === this.pointer && this.showPointer,
        "multiselect__option--selected": this.isSelected(r)
      };
    },
    groupHighlight(e, r) {
      if (!this.groupSelect)
        return [
          "multiselect__option--disabled",
          { "multiselect__option--group": r.$isLabel }
        ];
      const i = this.options.find((s) => s[this.groupLabel] === r.$groupLabel);
      return i && !this.wholeGroupDisabled(i) ? [
        "multiselect__option--group",
        { "multiselect__option--highlight": e === this.pointer && this.showPointer },
        { "multiselect__option--group-selected": this.wholeGroupSelected(i) }
      ] : "multiselect__option--disabled";
    },
    addPointerElement({ key: e } = "Enter") {
      this.filteredOptions.length > 0 && this.select(this.filteredOptions[this.pointer], e), this.pointerReset();
    },
    pointerForward() {
      this.pointer < this.filteredOptions.length - 1 && (this.pointer++, this.$refs.list.scrollTop <= this.pointerPosition - (this.visibleElements - 1) * this.optionHeight && (this.$refs.list.scrollTop = this.pointerPosition - (this.visibleElements - 1) * this.optionHeight), this.filteredOptions[this.pointer] && this.filteredOptions[this.pointer].$isLabel && !this.groupSelect && this.pointerForward()), this.pointerDirty = !0;
    },
    pointerBackward() {
      this.pointer > 0 ? (this.pointer--, this.$refs.list.scrollTop >= this.pointerPosition && (this.$refs.list.scrollTop = this.pointerPosition), this.filteredOptions[this.pointer] && this.filteredOptions[this.pointer].$isLabel && !this.groupSelect && this.pointerBackward()) : this.filteredOptions[this.pointer] && this.filteredOptions[0].$isLabel && !this.groupSelect && this.pointerForward(), this.pointerDirty = !0;
    },
    pointerReset() {
      this.closeOnSelect && (this.pointer = 0, this.$refs.list && (this.$refs.list.scrollTop = 0));
    },
    pointerAdjust() {
      this.pointer >= this.filteredOptions.length - 1 && (this.pointer = this.filteredOptions.length ? this.filteredOptions.length - 1 : 0), this.filteredOptions.length > 0 && this.filteredOptions[this.pointer].$isLabel && !this.groupSelect && this.pointerForward();
    },
    pointerSet(e) {
      this.pointer = e, this.pointerDirty = !0;
    }
  }
}, Nr = {
  name: "vue-multiselect",
  mixins: [Mn, Bn],
  compatConfig: {
    MODE: 3,
    ATTR_ENUMERATED_COERCION: !1
  },
  props: {
    /**
       * name attribute to match optional label element
       * @default ''
       * @type {String}
       */
    name: {
      type: String,
      default: ""
    },
    /**
       * Presets the selected options value.
       * @type {Object||Array||String||Integer}
       */
    modelValue: {
      type: null,
      default() {
        return [];
      }
    },
    /**
       * String to show when pointing to an option
       * @default 'Press enter to select'
       * @type {String}
       */
    selectLabel: {
      type: String,
      default: "Press enter to select"
    },
    /**
       * String to show when pointing to an option
       * @default 'Press enter to select'
       * @type {String}
       */
    selectGroupLabel: {
      type: String,
      default: "Press enter to select group"
    },
    /**
       * String to show next to selected option
       * @default 'Selected'
       * @type {String}
       */
    selectedLabel: {
      type: String,
      default: "Selected"
    },
    /**
       * String to show when pointing to an already selected option
       * @default 'Press enter to remove'
       * @type {String}
       */
    deselectLabel: {
      type: String,
      default: "Press enter to remove"
    },
    /**
       * String to show when pointing to an already selected option
       * @default 'Press enter to remove'
       * @type {String}
       */
    deselectGroupLabel: {
      type: String,
      default: "Press enter to deselect group"
    },
    /**
       * Decide whether to show pointer labels
       * @default true
       * @type {Boolean}
       */
    showLabels: {
      type: Boolean,
      default: !0
    },
    /**
       * Limit the display of selected options. The rest will be hidden within the limitText string.
       * @default 99999
       * @type {Integer}
       */
    limit: {
      type: Number,
      default: 99999
    },
    /**
       * Sets maxHeight style value of the dropdown
       * @default 300
       * @type {Integer}
       */
    maxHeight: {
      type: Number,
      default: 300
    },
    /**
       * Function that process the message shown when selected
       * elements pass the defined limit.
       * @default 'and * more'
       * @param {Int} count Number of elements more than limit
       * @type {Function}
       */
    limitText: {
      type: Function,
      default: (e) => `and ${e} more`
    },
    /**
       * Set true to trigger the loading spinner.
       * @default False
       * @type {Boolean}
       */
    loading: {
      type: Boolean,
      default: !1
    },
    /**
       * Disables the multiselect if true.
       * @default false
       * @type {Boolean}
       */
    disabled: {
      type: Boolean,
      default: !1
    },
    /**
       * Fixed opening direction
       * @default ''
       * @type {String}
       */
    openDirection: {
      type: String,
      default: ""
    },
    /**
       * Shows slot with message about empty options
       * @default true
       * @type {Boolean}
       */
    showNoOptions: {
      type: Boolean,
      default: !0
    },
    showNoResults: {
      type: Boolean,
      default: !0
    },
    tabindex: {
      type: Number,
      default: 0
    }
  },
  computed: {
    hasOptionGroup() {
      return this.groupValues && this.groupLabel && this.groupSelect;
    },
    isSingleLabelVisible() {
      return (this.singleValue || this.singleValue === 0) && (!this.isOpen || !this.searchable) && !this.visibleValues.length;
    },
    isPlaceholderVisible() {
      return !this.internalValue.length && (!this.searchable || !this.isOpen);
    },
    visibleValues() {
      return this.multiple ? this.internalValue.slice(0, this.limit) : [];
    },
    singleValue() {
      return this.internalValue[0];
    },
    deselectLabelText() {
      return this.showLabels ? this.deselectLabel : "";
    },
    deselectGroupLabelText() {
      return this.showLabels ? this.deselectGroupLabel : "";
    },
    selectLabelText() {
      return this.showLabels ? this.selectLabel : "";
    },
    selectGroupLabelText() {
      return this.showLabels ? this.selectGroupLabel : "";
    },
    selectedLabelText() {
      return this.showLabels ? this.selectedLabel : "";
    },
    inputStyle() {
      return this.searchable || this.multiple && this.modelValue && this.modelValue.length ? this.isOpen ? { width: "100%" } : { width: "0", position: "absolute", padding: "0" } : "";
    },
    contentStyle() {
      return this.options.length ? { display: "inline-block" } : { display: "block" };
    },
    isAbove() {
      return this.openDirection === "above" || this.openDirection === "top" ? !0 : this.openDirection === "below" || this.openDirection === "bottom" ? !1 : this.preferredOpenDirection === "above";
    },
    showSearchInput() {
      return this.searchable && (this.hasSingleSelectedSlot && (this.visibleSingleValue || this.visibleSingleValue === 0) ? this.isOpen : !0);
    }
  }
};
const Rn = {
  ref: "tags",
  class: "multiselect__tags"
}, Vn = { class: "multiselect__tags-wrap" }, Fn = { class: "multiselect__spinner" }, jn = { key: 0 }, Un = { class: "multiselect__option" }, Hn = { class: "multiselect__option" }, zn = /* @__PURE__ */ te("No elements found. Consider changing the search query."), Gn = { class: "multiselect__option" }, Yn = /* @__PURE__ */ te("List is empty.");
function Wn(e, r, i, s, o, f) {
  return q(), W("div", {
    tabindex: e.searchable ? -1 : i.tabindex,
    class: [{ "multiselect--active": e.isOpen, "multiselect--disabled": i.disabled, "multiselect--above": f.isAbove, "multiselect--has-options-group": f.hasOptionGroup }, "multiselect"],
    onFocus: r[14] || (r[14] = (n) => e.activate()),
    onBlur: r[15] || (r[15] = (n) => e.searchable ? !1 : e.deactivate()),
    onKeydown: [
      r[16] || (r[16] = ve(re((n) => e.pointerForward(), ["self", "prevent"]), ["down"])),
      r[17] || (r[17] = ve(re((n) => e.pointerBackward(), ["self", "prevent"]), ["up"]))
    ],
    onKeypress: r[18] || (r[18] = ve(re((n) => e.addPointerElement(n), ["stop", "self"]), ["enter", "tab"])),
    onKeyup: r[19] || (r[19] = ve((n) => e.deactivate(), ["esc"])),
    role: "combobox",
    "aria-owns": "listbox-" + e.id
  }, [
    B(e.$slots, "caret", { toggle: e.toggle }, () => [
      ee(
        "div",
        {
          onMousedown: r[1] || (r[1] = re((n) => e.toggle(), ["prevent", "stop"])),
          class: "multiselect__select"
        },
        null,
        32
        /* HYDRATE_EVENTS */
      )
    ]),
    B(e.$slots, "clear", { search: e.search }),
    ee(
      "div",
      Rn,
      [
        B(e.$slots, "selection", {
          search: e.search,
          remove: e.removeElement,
          values: f.visibleValues,
          isOpen: e.isOpen
        }, () => [
          $e(ee(
            "div",
            Vn,
            [
              (q(!0), W(
                oe,
                null,
                Ae(f.visibleValues, (n, c) => B(e.$slots, "tag", {
                  option: n,
                  search: e.search,
                  remove: e.removeElement
                }, () => [
                  (q(), W("span", {
                    class: "multiselect__tag",
                    key: c
                  }, [
                    ee("span", {
                      textContent: G(e.getOptionLabel(n))
                    }, null, 8, ["textContent"]),
                    ee("i", {
                      tabindex: "1",
                      onKeypress: ve(re((p) => e.removeElement(n), ["prevent"]), ["enter"]),
                      onMousedown: re((p) => e.removeElement(n), ["prevent"]),
                      class: "multiselect__tag-icon"
                    }, null, 40, ["onKeypress", "onMousedown"])
                  ]))
                ])),
                256
                /* UNKEYED_FRAGMENT */
              ))
            ],
            512
            /* NEED_PATCH */
          ), [
            [Me, f.visibleValues.length > 0]
          ]),
          e.internalValue && e.internalValue.length > i.limit ? B(e.$slots, "limit", { key: 0 }, () => [
            ee("strong", {
              class: "multiselect__strong",
              textContent: G(i.limitText(e.internalValue.length - i.limit))
            }, null, 8, ["textContent"])
          ]) : j("v-if", !0)
        ]),
        ee(ou, { name: "multiselect__loading" }, {
          default: z(() => [
            B(e.$slots, "loading", {}, () => [
              $e(ee(
                "div",
                Fn,
                null,
                512
                /* NEED_PATCH */
              ), [
                [Me, i.loading]
              ])
            ])
          ]),
          _: 3
          /* FORWARDED */
        }),
        e.searchable ? (q(), W("input", {
          key: 0,
          ref: "search",
          name: i.name,
          id: e.id,
          type: "text",
          autocomplete: "off",
          spellcheck: !1,
          placeholder: e.placeholder,
          style: f.inputStyle,
          value: e.search,
          disabled: i.disabled,
          tabindex: i.tabindex,
          onInput: r[2] || (r[2] = (n) => e.updateSearch(n.target.value)),
          onFocus: r[3] || (r[3] = re((n) => e.activate(), ["prevent"])),
          onBlur: r[4] || (r[4] = re((n) => e.deactivate(), ["prevent"])),
          onKeyup: r[5] || (r[5] = ve((n) => e.deactivate(), ["esc"])),
          onKeydown: [
            r[6] || (r[6] = ve(re((n) => e.pointerForward(), ["prevent"]), ["down"])),
            r[7] || (r[7] = ve(re((n) => e.pointerBackward(), ["prevent"]), ["up"])),
            r[9] || (r[9] = ve(re((n) => e.removeLastElement(), ["stop"]), ["delete"]))
          ],
          onKeypress: r[8] || (r[8] = ve(re((n) => e.addPointerElement(n), ["prevent", "stop", "self"]), ["enter"])),
          class: "multiselect__input",
          "aria-controls": "listbox-" + e.id
        }, null, 44, ["name", "id", "placeholder", "value", "disabled", "tabindex", "aria-controls"])) : j("v-if", !0),
        f.isSingleLabelVisible ? (q(), W(
          "span",
          {
            key: 1,
            class: "multiselect__single",
            onMousedown: r[10] || (r[10] = re((...n) => e.toggle && e.toggle(...n), ["prevent"]))
          },
          [
            B(e.$slots, "singleLabel", { option: f.singleValue }, () => [
              te(
                G(e.currentOptionLabel),
                1
                /* TEXT */
              )
            ])
          ],
          32
          /* HYDRATE_EVENTS */
        )) : j("v-if", !0),
        f.isPlaceholderVisible ? (q(), W(
          "span",
          {
            key: 2,
            class: "multiselect__placeholder",
            onMousedown: r[11] || (r[11] = re((...n) => e.toggle && e.toggle(...n), ["prevent"]))
          },
          [
            B(e.$slots, "placeholder", {}, () => [
              te(
                G(e.placeholder),
                1
                /* TEXT */
              )
            ])
          ],
          32
          /* HYDRATE_EVENTS */
        )) : j("v-if", !0)
      ],
      512
      /* NEED_PATCH */
    ),
    ee(ou, { name: "multiselect" }, {
      default: z(() => [
        $e(ee(
          "div",
          {
            class: "multiselect__content-wrapper",
            onFocus: r[12] || (r[12] = (...n) => e.activate && e.activate(...n)),
            tabindex: "-1",
            onMousedown: r[13] || (r[13] = re(() => {
            }, ["prevent"])),
            style: { maxHeight: e.optimizedHeight + "px" },
            ref: "list"
          },
          [
            ee("ul", {
              class: "multiselect__content",
              style: f.contentStyle,
              role: "listbox",
              id: "listbox-" + e.id
            }, [
              B(e.$slots, "beforeList"),
              e.multiple && e.max === e.internalValue.length ? (q(), W("li", jn, [
                ee("span", Un, [
                  B(e.$slots, "maxElements", {}, () => [
                    te(
                      "Maximum of " + G(e.max) + " options selected. First remove a selected option to select another.",
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ])) : j("v-if", !0),
              !e.max || e.internalValue.length < e.max ? (q(!0), W(
                oe,
                { key: 1 },
                Ae(e.filteredOptions, (n, c) => (q(), W("li", {
                  class: "multiselect__element",
                  key: c,
                  id: e.id + "-" + c,
                  role: n && (n.$isLabel || n.$isDisabled) ? null : "option"
                }, [
                  n && (n.$isLabel || n.$isDisabled) ? j("v-if", !0) : (q(), W("span", {
                    key: 0,
                    class: [e.optionHighlight(c, n), "multiselect__option"],
                    onClick: re((p) => e.select(n), ["stop"]),
                    onMouseenter: re((p) => e.pointerSet(c), ["self"]),
                    "data-select": n && n.isTag ? e.tagPlaceholder : f.selectLabelText,
                    "data-selected": f.selectedLabelText,
                    "data-deselect": f.deselectLabelText
                  }, [
                    B(e.$slots, "option", {
                      option: n,
                      search: e.search,
                      index: c
                    }, () => [
                      ee(
                        "span",
                        null,
                        G(e.getOptionLabel(n)),
                        1
                        /* TEXT */
                      )
                    ])
                  ], 42, ["onClick", "onMouseenter", "data-select", "data-selected", "data-deselect"])),
                  n && (n.$isLabel || n.$isDisabled) ? (q(), W("span", {
                    key: 1,
                    "data-select": e.groupSelect && f.selectGroupLabelText,
                    "data-deselect": e.groupSelect && f.deselectGroupLabelText,
                    class: [e.groupHighlight(c, n), "multiselect__option"],
                    onMouseenter: re((p) => e.groupSelect && e.pointerSet(c), ["self"]),
                    onMousedown: re((p) => e.selectGroup(n), ["prevent"])
                  }, [
                    B(e.$slots, "option", {
                      option: n,
                      search: e.search,
                      index: c
                    }, () => [
                      ee(
                        "span",
                        null,
                        G(e.getOptionLabel(n)),
                        1
                        /* TEXT */
                      )
                    ])
                  ], 42, ["data-select", "data-deselect", "onMouseenter", "onMousedown"])) : j("v-if", !0)
                ], 8, ["id", "role"]))),
                128
                /* KEYED_FRAGMENT */
              )) : j("v-if", !0),
              $e(ee(
                "li",
                null,
                [
                  ee("span", Hn, [
                    B(e.$slots, "noResult", { search: e.search }, () => [
                      zn
                    ])
                  ])
                ],
                512
                /* NEED_PATCH */
              ), [
                [Me, i.showNoResults && e.filteredOptions.length === 0 && e.search && !i.loading]
              ]),
              $e(ee(
                "li",
                null,
                [
                  ee("span", Gn, [
                    B(e.$slots, "noOptions", {}, () => [
                      Yn
                    ])
                  ])
                ],
                512
                /* NEED_PATCH */
              ), [
                [Me, i.showNoOptions && (e.options.length === 0 || f.hasOptionGroup === !0 && e.filteredOptions.length === 0) && !e.search && !i.loading]
              ]),
              B(e.$slots, "afterList")
            ], 12, ["id"])
          ],
          36
          /* STYLE, HYDRATE_EVENTS */
        ), [
          [Me, e.isOpen]
        ])
      ]),
      _: 3
      /* FORWARDED */
    })
  ], 42, ["tabindex", "aria-owns"]);
}
Nr.render = Wn;
const Kn = ue({
  name: "DpsFormSelect",
  components: { DpsFilterButton: Ai, Multiselect: Nr },
  props: {
    /**
     * Unique ID of the select (optional).
     * @default undefined
     */
    id: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Size of the select.
     * @default undefined
     */
    size: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Style variant of the select.
     * @default undefined
     */
    variant: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Hides tags for selected elements (only for multiple).
     * @default false
     */
    hideTags: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * ModelValue for the select.
     * @default undefined
     */
    modelValue: {
      type: [String, Number, Array, Object],
      required: !1,
      default: void 0
    },
    /**
     * Key for the label text in the option object.
     * @default "label"
     */
    optionLabel: {
      type: String,
      required: !1,
      default: "label"
    },
    /**
     * Key for the value in the option object.
     * @default "value"
     */
    optionValue: {
      type: String,
      required: !1,
      default: "value"
    },
    /**
     * Makes the select readonly.
     * @default false
     */
    readonly: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Requires a value to be selected.
     * @default false
     */
    required: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Title attribute of the select.
     * @default props.placeholder
     */
    title: {
      type: String,
      required: !1,
      default(e) {
        return e.placeholder;
      }
    },
    /**
     * Label for the select.
     * @default undefined
     */
    label: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Icon placed before the select in the simple variant.
     * @default undefined
     */
    icon: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Success state of the select.
     * @default false
     */
    success: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Error state of the select.
     * @default false
     */
    error: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Aligns the dropdown left or right.
     * @default "start"
     */
    align: {
      type: String,
      required: !1,
      default: "start"
    },
    // -----------------------
    // Vue-Multiselect
    // -----------------------
    /**
     * Array of available options: Objects, Strings or Integers. If array of objects, visible label will default to option.label.
     */
    options: {
      type: Array,
      required: !0
    },
    /**
     * Clear the search input after `select()`. Use only when multiple is true.
     * @default true
     */
    clearOnSelect: {
      type: Boolean,
      required: !1,
      default: !0
    },
    /**
     * Enable/disable closing after selecting an option
     * @default true
     */
    closeOnSelect: {
      type: Boolean,
      required: !1,
      default: !0
    },
    /**
     * Enable/disable the multiselect.
     * @default false
     */
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Number of allowed selected options.
     * @default undefined
     */
    max: {
      type: Number,
      required: !1,
      default: void 0
    },
    /**
     * Equivalent to the multiple attribute on a `<select>` input.
     * @default false
     */
    multiple: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Fixed opening direction (instead of auto). Options are "above"/"top" or "below"/"bottom"
     * @default ""
     */
    openDirection: {
      type: String,
      required: !1,
      default: ""
    },
    /**
     * Equivalent to the placeholder attribute on a `<select>` input.
     * @default "Bitte wählen"
     */
    placeholder: {
      type: String,
      required: !1,
      default: "Bitte wählen"
    },
    /**
     * Selects the first option if initial value is empty
     * @default false
     */
    preselectFirst: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * If set to true, will preserve the search query when opening/closing the component.
     * @default false
     */
    preserveSearch: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Add / removes search input.
     * @default false
     */
    searchable: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  emits: [
    /**
     * Emitted when a value gets selected.
     */
    "select",
    /**
     * Emitted after removing an option.
     */
    "remove",
    /**
     * Emitted after the search query changes.
     */
    "search-change",
    /**
     * Emitted after user attempts to add a tag.
     */
    "tag",
    /**
     * Emitted when the dropdown opens. Useful for detecting when touched.
     */
    "open",
    /**
     * Emitted when the dropdown closes.
     */
    "close",
    /**
     * Emitted after this.modelValue changes.
     */
    "update:modelValue"
  ],
  data() {
    return {
      selected: void 0,
      multiselectEl: null
    };
  },
  computed: {
    uniqueId() {
      return this.id ? this.id : be("dps-form-select-");
    },
    multiselectOptions() {
      const e = [];
      for (const r of this.options)
        if (typeof r != "object") {
          const i = {};
          i[this.optionValue] = r, i[this.optionLabel] = r, e.push(i);
        } else
          e.push(r);
      return e;
    }
  },
  watch: {
    modelValue(e) {
      this.selected = e;
    },
    selected(e, r) {
      JSON.stringify(e) !== JSON.stringify(r) && this.$emit("update:modelValue", e);
    }
  },
  mounted() {
    const e = this.$refs.multiselect;
    this.multiselectEl = e == null ? void 0 : e.$el, this.improveMultiselectAccessibility(), this.improveElementAccessibility(), this.improveContentAccessibility();
  },
  created() {
    this.selected = this.modelValue;
  },
  methods: {
    improveMultiselectAccessibility() {
      var e, r;
      (e = this.multiselectEl) == null || e.setAttribute("aria-expanded", "false"), (r = this.multiselectEl) == null || r.setAttribute("aria-controls", "listbox-" + this.uniqueId);
    },
    improveContentAccessibility() {
      var r;
      const e = (r = this.multiselectEl) == null ? void 0 : r.querySelector(".multiselect__content");
      e && (e.ariaLabel = "Auswahlliste");
    },
    improveElementAccessibility() {
      var s, o, f;
      const e = (s = this.multiselectEl) == null ? void 0 : s.querySelectorAll(".multiselect__option");
      if (e)
        for (const n of Array.from(e)) {
          const c = n.parentElement;
          c != null && c.classList.contains("multiselect__element") && (n.classList.contains("multiselect__option--selected") ? c.ariaSelected = "true" : c.ariaSelected = "false");
        }
      const r = (o = this.multiselectEl) == null ? void 0 : o.querySelectorAll(
        ".multiselect__content > li:not(.multiselect__element)"
      );
      if (r)
        for (const n of Array.from(r))
          n.role = "option";
      const i = (f = this.multiselectEl) == null ? void 0 : f.querySelector(
        ".multiselect__input"
      );
      i && (i.placeholder = "Suchbegriff ...");
    },
    handleSelect(e) {
      this.$emit("select", e), this.$nextTick(() => {
        this.improveElementAccessibility();
      });
    },
    handleRemove(e) {
      this.$emit("remove", e), this.$nextTick(() => {
        this.improveElementAccessibility();
      });
    },
    handleOpen(e) {
      var r;
      this.$emit("open", e), (r = this.multiselectEl) == null || r.setAttribute("aria-expanded", "true"), this.$nextTick(() => {
        this.setSearchInputWidth();
      });
    },
    handleClose(e) {
      var r;
      this.$emit("close", e), (r = this.multiselectEl) == null || r.setAttribute("aria-expanded", "false");
    },
    handleTag(e) {
      this.$emit("tag", e);
    },
    handleSearchChange(e) {
      this.$emit("search-change", e);
    },
    setSearchInputWidth() {
      var s, o;
      const r = (s = this.multiselectEl) == null ? void 0 : s.querySelector(
        ".multiselect__input"
      ), i = (o = this.multiselectEl) == null ? void 0 : o.querySelector(
        ".multiselect__content"
      );
      if (r && i) {
        const f = i.offsetWidth;
        r.style.setProperty("--width", f - 12 + "px");
      }
    }
  }
}), Jn = {
  key: 0,
  class: "multiselect__option-checkbox"
}, Xn = /* @__PURE__ */ $("span", { class: "dps-icon dps-icon--check" }, null, -1), Qn = [
  Xn
], Zn = { class: "multiselect__option-label" }, es = {
  key: 2,
  class: "multiselect__option-checkbox"
}, ts = /* @__PURE__ */ $("span", { class: "dps-icon dps-icon--check" }, null, -1), us = [
  ts
], rs = {
  key: 0,
  class: "multiselect__single multiselect__single--label"
}, is = {
  key: 1,
  class: "multiselect__placeholder multiselect__placeholder--label"
}, ns = {
  key: 1,
  class: "multiselect__tags-wrap"
}, ss = { class: "multiselect__option-results" }, as = { class: "multiselect__option-results" }, ls = { class: "multiselect__option-results" };
function os(e, r, i, s, o, f) {
  const n = ae("DpsFilterButton"), c = ae("Multiselect");
  return q(), W(c, {
    id: e.uniqueId,
    ref: "multiselect",
    modelValue: e.selected,
    "onUpdate:modelValue": r[0] || (r[0] = (p) => e.selected = p),
    class: R(["dps-form-select", {
      "dps-form-select--readonly": e.readonly,
      "dps-form-select--multiple": e.multiple,
      "dps-form-select--searchable": e.searchable,
      "dps-form-select--labelled": e.label,
      "dps-form-select--filter": e.variant === "filter",
      "dps-form-select--simple": e.variant === "simple",
      "dps-form-select--size-sm": e.size === "sm",
      "dps-form-select--success": e.success,
      "dps-form-select--error": e.error,
      "dps-form-select--align-end": e.align === "end"
    }]),
    options: e.multiselectOptions,
    "allow-empty": !e.required,
    "clear-on-select": e.clearOnSelect,
    "close-on-select": e.closeOnSelect,
    disabled: e.disabled || e.readonly,
    label: e.optionLabel,
    max: e.max,
    multiple: e.multiple,
    "open-direction": e.openDirection,
    placeholder: e.placeholder,
    "preselect-first": e.preselectFirst,
    "preserve-search": e.preserveSearch,
    searchable: e.searchable,
    "track-by": e.optionValue,
    title: e.title,
    onClose: e.handleClose,
    onOpen: e.handleOpen,
    onRemove: e.handleRemove,
    onSearchChange: e.handleSearchChange,
    onSelect: e.handleSelect,
    onTag: e.handleTag
  }, Qt({
    option: z((p) => [
      e.multiple ? (q(), I("span", Jn, Qn)) : j("", !0),
      p.option.icon ? (q(), I("span", {
        key: 1,
        class: R(["multiselect__option-icon dps-icon", "dps-icon--" + p.option.icon])
      }, null, 2)) : j("", !0),
      $("span", Zn, [
        B(e.$slots, "option", je(Ue(p)), () => [
          te(G(p.option[e.optionLabel]), 1)
        ])
      ]),
      e.multiple ? j("", !0) : (q(), I("span", es, us))
    ]),
    tag: z((p) => [
      ee(n, {
        disabled: e.disabled,
        readonly: e.readonly,
        onClick: (a) => p.remove(p.option)
      }, {
        default: z(() => [
          B(e.$slots, "tag", je(Ue(p)), () => [
            te(G(p.option[e.optionLabel]), 1)
          ])
        ]),
        _: 2
      }, 1032, ["disabled", "readonly", "onClick"])
    ]),
    noOptions: z(() => [
      $("span", ss, [
        B(e.$slots, "noOptions", {}, () => [
          te("Keine Elemente")
        ])
      ])
    ]),
    noResult: z(() => [
      $("span", as, [
        B(e.$slots, "noResult", {}, () => [
          te(" Es wurden keine Elemente gefunden. ")
        ])
      ])
    ]),
    maxElements: z(() => [
      $("span", ls, [
        B(e.$slots, "maxElements", {}, () => [
          te(" Maximale Anzahl von Elementen erreicht. Bitte zuerst ein Element abwählen bevor Sie eine erneute Auswahl treffen. ")
        ])
      ])
    ]),
    _: 2
  }, [
    e.multiple ? {
      name: "selection",
      fn: z((p) => [
        p.values.length === 0 || e.hideTags ? (q(), I(oe, { key: 0 }, [
          e.label ? (q(), I("div", rs, G(e.label), 1)) : (q(), I("div", is, [
            B(e.$slots, "selection", je(Ue(p)), () => [
              te(G(e.placeholder), 1)
            ])
          ]))
        ], 64)) : (q(), I("div", ns, [
          (q(!0), I(oe, null, Ae(p.values, (a, l) => (q(), W(n, {
            key: "option-" + l,
            disabled: e.disabled,
            readonly: e.readonly,
            onClick: (h) => p.remove(a)
          }, {
            default: z(() => [
              B(e.$slots, "selection", Br({ ref_for: !0 }, p, { option: a }), () => [
                te(G(a[e.optionLabel]), 1)
              ])
            ]),
            _: 2
          }, 1032, ["disabled", "readonly", "onClick"]))), 128))
        ]))
      ]),
      key: "0"
    } : {
      name: "selection",
      fn: z((p) => [
        e.variant === "simple" && e.icon ? (q(), I("span", {
          key: 0,
          class: R(["dps-icon dps-icon--" + e.icon])
        }, null, 2)) : j("", !0),
        e.label ? (q(), I("div", {
          key: 1,
          class: "multiselect__single multiselect__single--label"
        }, G(e.label), 1)) : j("", !0),
        e.modelValue && e.modelValue[e.optionLabel] ? (q(), I("div", {
          key: 2,
          class: "multiselect__placeholder multiselect__placeholder--label"
        }, [
          B(e.$slots, "selection", je(Ue(p)), () => [
            te(G(e.modelValue[e.optionLabel]), 1)
          ])
        ])) : (q(), I("div", {
          key: 3,
          class: "multiselect__placeholder multiselect__placeholder--label"
        }, [
          B(e.$slots, "selection", je(Ue(p)), () => [
            te(G(e.placeholder), 1)
          ])
        ]))
      ]),
      key: "1"
    },
    e.$slots.beforeList ? {
      name: "beforeList",
      fn: z(() => [
        B(e.$slots, "beforeList")
      ]),
      key: "2"
    } : void 0,
    e.$slots.afterList ? {
      name: "afterList",
      fn: z(() => [
        B(e.$slots, "afterList")
      ]),
      key: "3"
    } : void 0
  ]), 1032, ["id", "modelValue", "class", "options", "allow-empty", "clear-on-select", "close-on-select", "disabled", "label", "max", "multiple", "open-direction", "placeholder", "preselect-first", "preserve-search", "searchable", "track-by", "title", "onClose", "onOpen", "onRemove", "onSearchChange", "onSelect", "onTag"]);
}
const _r = /* @__PURE__ */ K(Kn, [["render", os]]), ds = ue({
  name: "DpsFormTextarea",
  props: {
    /**
     * ModelValue of the textarea.
     * @default undefined
     */
    modelValue: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Sets whether the textarea is resizable, and if so, in which directions.
     * @default false
     */
    resizable: {
      type: [Boolean, String],
      required: !1,
      default: !1
    },
    /**
     * Success state of the textarea.
     * @default false
     */
    success: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Error state of the textarea.
     * @default false
     */
    error: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * The number of visible text lines.
     * @default 3
     */
    rows: {
      type: Number,
      required: !1,
      default: 3
    },
    /**
     * Makes the textarea readonly.
     * @default false
     */
    readonly: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Disables the textarea.
     * @default false
     */
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  emits: [
    /**
     * Emitted when the value changes.
     */
    "update:modelValue"
  ],
  methods: {
    handleInput(e) {
      const i = e.target.value;
      this.$emit("update:modelValue", i);
    }
  }
}), cs = ["value", "rows", "readonly", "disabled"];
function fs(e, r, i, s, o, f) {
  return q(), I("textarea", {
    class: R(["dps-form-textarea dps-textarea", {
      "dps-form-textarea--resize": e.resizable === !0,
      "dps-form-textarea--resize-v": e.resizable === "vertical",
      "dps-form-textarea--resize-h": e.resizable === "horizontal",
      "dps-form-textarea--success": e.success,
      "dps-form-textarea--error": e.error
    }]),
    value: e.modelValue,
    rows: e.rows,
    readonly: e.readonly,
    disabled: e.disabled,
    onInput: r[0] || (r[0] = (...n) => e.handleInput && e.handleInput(...n))
  }, null, 42, cs);
}
const Ja = /* @__PURE__ */ K(ds, [["render", fs]]), hs = ue({
  name: "DpsLink",
  props: {
    /**
     * The URL that the hyperlink points to.
     */
    href: {
      type: String,
      required: !0
    },
    /**
     * Icon to be displayed in front of the link text.
     * Can be set to 'false' when using external links to
     * hide the icon.
     * @default undefined
     */
    icon: {
      type: [String, Boolean],
      required: !1,
      default: void 0
    },
    /**
     * The relationship of the linked URL as space-separated
     * link types. "noopener noreferrer" gets set automatically
     * when "external" is true.
     * @default undefined
     */
    rel: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Where to display the linked URL,
     * as the name for a browsing context.
     * Gets set to "_blank" automatically when "external" is true.
     * @default undefined
     */
    target: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Whether the link is an external link.
     * @default false
     */
    external: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * How to format the link (telephone or email formatting).
     * @default undefined
     */
    format: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Whether the link should be a slightly darker blue.
     * @default false
     */
    darker: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  emits: [
    /**
     * Emitted when the link is clicked.
     */
    "click"
  ],
  computed: {
    hrefAttribute() {
      return this.format === "telephone" ? "tel:" + this.href.replaceAll(" ", "").replaceAll("-", "").replaceAll("/", "").replaceAll("(", "").replaceAll(")", "") : this.format === "email" ? "mailto:" + this.href.replaceAll(" ", "") : this.href;
    },
    relAttribute() {
      if (this.rel)
        return this.rel;
      if (this.external)
        return "noopener noreferrer";
    },
    targetAttribute() {
      if (this.target)
        return this.target;
      if (this.external)
        return "_blank";
    },
    iconName() {
      if (this.icon !== !1) {
        if (this.icon && typeof this.icon == "string")
          return this.icon;
        if (this.external)
          return "external-link";
      }
    }
  },
  methods: {
    handleClick(e) {
      !this.external && !this.format && (e.preventDefault(), this.$router && this.$router.push(this.hrefAttribute)), this.$emit("click", e);
    }
  }
}), ps = ["href", "rel", "target"];
function bs(e, r, i, s, o, f) {
  return q(), I("a", {
    class: R(["dps-link", {
      "dps-link--icon": e.iconName,
      "dps-link--darker": e.darker
    }]),
    href: e.hrefAttribute,
    rel: e.relAttribute,
    target: e.targetAttribute,
    onClick: r[0] || (r[0] = (...n) => e.handleClick && e.handleClick(...n))
  }, [
    e.iconName ? (q(), I(oe, { key: 0 }, [
      $("span", {
        class: R(["dps-icon", "dps-icon--" + e.iconName])
      }, null, 2),
      $("span", null, [
        B(e.$slots, "default")
      ])
    ], 64)) : B(e.$slots, "default", { key: 1 })
  ], 10, ps);
}
const Xa = /* @__PURE__ */ K(hs, [["render", bs]]), ms = ue({
  name: "DpsSortSelect",
  components: { DpsFormSelect: _r },
  props: {
    /**
     * Unique ID of the select (optional).
     * @default undefined
     */
    id: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Array of options to be displayed.
     */
    options: {
      type: Array,
      required: !0
    },
    /**
     * ModelValue of the select.
     */
    modelValue: {
      type: String,
      required: !0
    },
    /**
     * Title attribute of the select.
     * @default "Sortierung anpassen"
     */
    title: {
      type: String,
      default: "Sortierung anpassen",
      required: !1
    },
    /**
     * Disables the select.
     * @default false
     */
    disabled: {
      type: Boolean,
      default: !1,
      required: !1
    }
  },
  emits: [
    /**
     * Emitted when the selected value changes.
     */
    "update:modelValue"
  ],
  data() {
    return {
      selected: void 0
    };
  },
  computed: {
    uniqueId() {
      return this.id ? this.id : be("dps-sort-select-");
    }
  },
  watch: {
    modelValue() {
      this.setSelectedOption();
    }
  },
  created() {
    this.setSelectedOption();
  },
  methods: {
    setSelectedOption() {
      let e = this.options[0];
      for (const r of this.options)
        r.value === this.modelValue && (e = r);
      this.selected = e;
    },
    handleChange(e) {
      this.$emit("update:modelValue", e.value);
    }
  }
});
function gs(e, r, i, s, o, f) {
  const n = ae("DpsFormSelect");
  return q(), W(n, {
    id: e.uniqueId,
    class: R(["dps-sort-select", { "dps-sort-select--disabled": e.disabled }]),
    "model-value": e.selected,
    options: e.options,
    disabled: e.disabled,
    title: e.title,
    required: "",
    "onUpdate:modelValue": e.handleChange
  }, null, 8, ["id", "class", "model-value", "options", "disabled", "title", "onUpdate:modelValue"]);
}
const Qa = /* @__PURE__ */ K(ms, [["render", gs]]), ys = ue({
  name: "DpsAlert",
  props: {
    /**
     * The variant determines the color and icon of the alert.
     * @default undefined
     */
    variant: {
      type: String,
      default: void 0,
      required: !1
    },
    /**
     * Headline of the alert.
     * @default undefined
     */
    heading: {
      type: String,
      default: void 0,
      required: !1
    },
    /**
     * Hides the icon.
     * @default false
     */
    hideIcon: {
      type: Boolean,
      default: !1,
      required: !1
    }
  },
  computed: {
    variantIcon() {
      return {
        info: "information",
        warning: "warning",
        success: "success",
        error: "warning"
      }[this.variant ?? "info"];
    }
  },
  methods: {
    sanitizeHtml: au
  }
}), vs = {
  key: 0,
  class: "dps-alert__icon-wrapper"
}, ws = { class: "dps-alert__content-wrapper" }, Ss = ["innerHTML"];
function xs(e, r, i, s, o, f) {
  return q(), I("div", {
    class: R(["dps-alert", { ["dps-alert--" + e.variant]: e.variant }])
  }, [
    e.hideIcon ? j("", !0) : (q(), I("div", vs, [
      $("span", {
        class: R(["dps-icon", "dps-icon--" + e.variantIcon])
      }, null, 2)
    ])),
    $("div", ws, [
      e.heading ? (q(), I("header", {
        key: 0,
        class: "dps-alert__content-header",
        innerHTML: e.sanitizeHtml(e.heading)
      }, null, 8, Ss)) : j("", !0),
      B(e.$slots, "default")
    ])
  ], 2);
}
const Es = /* @__PURE__ */ K(ys, [["render", xs]]), As = ue({
  name: "DpsInputGroup",
  props: {
    /**
     * Whether there should be no gap between the
     * elements.
     */
    collapsed: {
      type: Boolean,
      required: !1,
      default: !1
    }
  }
}), ks = {
  key: 0,
  class: "dps-input-group__content dps-input-group__content--prepend"
}, qs = { class: "dps-input-group__content dps-input-group__content--default" }, Ts = {
  key: 1,
  class: "dps-input-group__content dps-input-group__content--append"
};
function Ds(e, r, i, s, o, f) {
  return q(), I("div", {
    role: "group",
    class: R(["dps-input-group", { "dps-input-group--collapsed": e.collapsed }])
  }, [
    e.$slots.prepend ? (q(), I("div", ks, [
      B(e.$slots, "prepend")
    ])) : j("", !0),
    $("div", qs, [
      B(e.$slots, "default")
    ]),
    e.$slots.append ? (q(), I("div", Ts, [
      B(e.$slots, "append")
    ])) : j("", !0)
  ], 2);
}
const Cs = /* @__PURE__ */ K(As, [["render", Ds]]), Os = ue({
  name: "DpsFormFile",
  props: {
    /**
     * The unique identifier for the input (optional).
     * @default undefined
     */
    id: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * ModelValue of the input.
     * With inputs of type file, normally this is uni-directional.
     * However, you can clear the file input's selected files by setting the modelValue to either null
     * (for single mode) or an empty array [] (for multiple mode).
     * @default null
     */
    modelValue: {
      type: [File, Array, null],
      required: !1,
      default: null
    },
    /**
     * Which file formats to accept.
     * Can be either file extension or mime-type or mixed
     * e.g. '.pdf', 'application/pdf' or '.pdf, application/pdf'
     * @default ""
     */
    accept: {
      type: String,
      required: !1,
      default: ""
    },
    /**
     * Allows selecting multiple files at once.
     * @default false
     */
    multiple: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Disables the component.
     * @default false
     */
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Title for the search button.
     * Defaults to "Datei auswählen" if no title is set.
     * @default undefined
     */
    title: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Changes the state to error.
     * @default false
     */
    error: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Required attribute of the input.
     * @default false
     */
    required: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  emits: [
    /**
     * Emitted when the file selection changes.
     * @event module:DpsFormFile#update:modelValue
     */
    "update:modelValue"
  ],
  data() {
    return {
      uniqID: this.id ?? be("dps-form-file-")
    };
  },
  computed: {
    fileSearchTitle() {
      return this.title ?? `Datei${this.multiple ? "en" : ""} auswählen`;
    }
  },
  watch: {
    modelValue: {
      handler(e) {
        (!e || this.multiple && !e.length) && (this.$refs.fileInput.value = "");
      }
    }
  },
  methods: {
    getUniqueId: be,
    handleSelectionChange() {
      const e = this.$refs.fileInput.files;
      e.length === 0 ? this.$emit("update:modelValue", this.multiple ? [] : null) : this.$emit("update:modelValue", this.multiple ? Array.from(e) : e[0]);
    },
    resetSelection() {
      this.$refs.fileInput.value = "", this.$emit("update:modelValue", this.multiple ? [] : null);
    }
  }
}), Ps = ["for", "title"], Ls = /* @__PURE__ */ $("span", {
  class: "dps-icon dps-icon--search",
  "aria-hidden": "true"
}, null, -1), Is = { class: "sr-only" }, Ns = ["id", "accept", "required", "multiple", "disabled"];
function _s(e, r, i, s, o, f) {
  return q(), I("div", {
    class: R(["dps-form-file", {
      "dps-form-file--selected": e.multiple && Array.isArray(e.modelValue) ? e.modelValue.length : e.modelValue,
      "dps-form-file--disabled": e.disabled,
      "dps-form-file--error": e.error
    }])
  }, [
    $("label", {
      for: e.uniqID,
      title: e.fileSearchTitle
    }, [
      Ls,
      $("span", Is, G(e.fileSearchTitle), 1)
    ], 8, Ps),
    $("input", {
      id: e.uniqID,
      ref: "fileInput",
      type: "file",
      class: "dps-form-file__input",
      accept: e.accept,
      required: e.required,
      multiple: e.multiple ? !0 : void 0,
      disabled: e.disabled,
      onChange: r[0] || (r[0] = (...n) => e.handleSelectionChange && e.handleSelectionChange(...n)),
      onCancel: r[1] || (r[1] = (...n) => e.resetSelection && e.resetSelection(...n)),
      onClick: r[2] || (r[2] = (n) => n.target.value = "")
    }, null, 40, Ns)
  ], 2);
}
const $s = /* @__PURE__ */ K(Os, [["render", _s]]), Ms = {
  name: "DpsPagination",
  components: {
    DpsFormGroup: Lr,
    DpsButton: rt,
    DpsFormSelect: _r
  },
  props: {
    /**
     * Total Number of Elements
     * @required
     */
    numberOfElements: {
      type: Number,
      required: !0
    },
    /**
     * Label of pagination menu for accessibilty ("aria-label")
     * @default undefined
     */
    ariaLabel: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * ID of the HTML element the pagination is controlling for accessibility ("aria-controls")
     * @default undefined
     */
    ariaContentId: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Configure select options for "elements per page"
     * @default [25, 50, 100]
     */
    elementsPerPageOptions: {
      type: Array,
      required: !1,
      default() {
        return [25, 50, 100];
      }
    },
    /**
     * Configure maximum number of page buttons in pagination
     * @default 5
     */
    numberOfPageNumbers: {
      type: Number,
      required: !1,
      default: 5
    },
    /**
     * Set number of pages as prop if the calculation should not be handled automatically (e.g. for serverside pagination). A note for migration: Was "pagesFromServer"
     * @default null
     */
    numberOfPagesAsProp: {
      type: Number,
      required: !1,
      default: null
    },
    /**
     * Set current page as prop (e.g. for serverside pagination)
     * @default null
     */
    currentPageAsProp: {
      type: Number,
      required: !1,
      default: void 0
    },
    /**
     * Set default option for "elements per page". If not set the first option will be selected. This is useful e.g. when resetting the page size to default on removing filters.
     */
    elementsPerPageAsProp: {
      type: Number,
      required: !1,
      default: void 0
    }
  },
  emits: [
    /**
     * Emitted when the pagination is updated
     * @event module:DpsPagination#shownElements
     */
    "updatePagination"
    // TODO fix naming
  ],
  data() {
    return {
      elementsPerPage: this.elementsPerPageAsProp ? {
        value: this.elementsPerPageAsProp,
        label: this.elementsPerPageAsProp
      } : {
        value: this.elementsPerPageOptions[0],
        label: this.elementsPerPageOptions[0]
      },
      currentPage: this.currentPageAsProp ?? 1,
      paginationButtons: []
    };
  },
  computed: {
    uniqueId() {
      return be("dps-pagination-");
    },
    /**
     * Number of Pages
     * @return {number}
     */
    numberOfPages() {
      return this.numberOfPagesAsProp ?? Math.ceil(this.numberOfElements / this.elementsPerPage.value);
    },
    /**
     * calculates Page Numbers to be shown on the buttons,
     * shows all if numberOfPages is smaller than numberOfPageNumbers
     * @return {number|*[]}
     */
    shownPageNumbers() {
      if (this.numberOfPages <= this.numberOfPageNumbers)
        return this.numberOfPages;
      {
        let e = Math.ceil(this.numberOfPageNumbers / 2);
        const r = Math.floor(this.numberOfPageNumbers / 2), i = [];
        for (let s = -r; s < e; s++)
          this.currentPage + s > 0 && this.currentPage + s <= this.numberOfPages ? i.push(this.currentPage + s) : this.currentPage + e <= this.numberOfPages && e++;
        return i;
      }
    },
    /**
     * calculates which elements will be shown on the current page
     * @return {object} {elementsPerPage: default.elementsPerPageAsProp, start: (number|number), end: number, currentPage: number}
     */
    shownElements() {
      const r = (this.currentPage - 1) * this.elementsPerPage.value ?? 0, i = r + this.elementsPerPage.value < this.numberOfElements ? r + this.elementsPerPage.value - 1 : this.numberOfElements - 1;
      return {
        start: r,
        end: i,
        elementsPerPage: this.elementsPerPage.value,
        currentPage: this.currentPage
      };
    }
  },
  watch: {
    elementsPerPage() {
      this.currentPage = 1, this.$emit("updatePagination", this.shownElements);
    },
    currentPage() {
      this.$nextTick(() => {
        this.updatePaginationButtons(), this.paginationButtons.forEach((e) => {
          e.removeEventListener("keydown", this.onPageButtonKeydown), e.addEventListener("keydown", this.onPageButtonKeydown);
        });
      });
    },
    currentPageAsProp() {
      this.currentPageAsProp && (this.currentPage = this.currentPageAsProp, this.$emit("updatePagination", this.shownElements));
    }
  },
  async mounted() {
    this.updatePaginationButtons(), this.paginationButtons.forEach((e) => {
      e.addEventListener("keydown", this.onPageButtonKeydown);
    });
  },
  beforeUnmount() {
    this.paginationButtons.forEach((e) => {
      e.removeEventListener("keydown", this.onPageButtonKeydown);
    });
  },
  methods: {
    onPageButtonKeydown(e) {
      const { key: r, currentTarget: i } = e;
      let s = this.paginationButtons.indexOf(i), o;
      switch (r) {
        case "Left":
        case "ArrowLeft":
          s = s > 0 ? s - 1 : this.paginationButtons.length - 1, o = this.paginationButtons[s], this.setFocusToPaginationItem(o);
          break;
        case "Right":
        case "ArrowRight":
          s = s < this.paginationButtons.length - 1 ? s + 1 : 0, o = this.paginationButtons[s], this.setFocusToPaginationItem(o);
          break;
        case " ":
        case "Enter":
          i.click();
          break;
      }
    },
    isPrintableCharacter(e) {
      return e.length === 1 && e.match(/\S/);
    },
    updatePaginationButtons() {
      this.paginationButtons = this.$refs.paginationMenu ? Array.from(this.$refs.paginationMenu.getElementsByTagName("button")).filter(
        (e) => !e.disabled
      ) : [];
    },
    setFocusToPaginationItem(e) {
      this.paginationButtons.forEach((r) => {
        r.tabIndex = -1;
      }), e.tabIndex = 0, e.focus();
    },
    /**
     * updates value of current page
     * @param {Number|String} page number of page or inc/dec
     * @return void
     */
    updatePage(e) {
      e === "inc" ? this.currentPage < this.numberOfPages && this.currentPage++ : e === "dec" ? this.currentPage > 1 && this.currentPage-- : this.currentPage = e, this.$emit("updatePagination", this.shownElements);
    }
  }
}, Bs = { class: "dps-pagination" }, Rs = ["aria-label"], Vs = { role: "presentation" }, Fs = { role: "presentation" }, js = { role: "presentation" }, Us = { role: "presentation" }, Hs = { class: "dps-pagination__select-container" };
function zs(e, r, i, s, o, f) {
  const n = ae("DpsButton"), c = ae("DpsFormSelect"), p = ae("DpsFormGroup");
  return q(), I("div", Bs, [
    $("ul", {
      ref: "paginationMenu",
      role: "menubar",
      "aria-label": i.ariaLabel ?? "Paginierung",
      class: "dps-pagination__buttons"
    }, [
      $("li", Vs, [
        ee(n, {
          role: "menuitem",
          "aria-controls": i.ariaContentId,
          title: "erste Seite",
          "aria-label": "erste Seite",
          "aria-disabled": o.currentPage === 1 || f.numberOfPages === 0,
          disabled: o.currentPage === 1 || f.numberOfPages === 0,
          tabindex: "-1",
          variant: "secondary",
          icon: "chevron-left-double-small",
          squared: "",
          size: "lg",
          onClick: r[0] || (r[0] = (a) => f.updatePage(1))
        }, null, 8, ["aria-controls", "aria-disabled", "disabled"])
      ]),
      $("li", Fs, [
        ee(n, {
          role: "menuitem",
          "aria-controls": i.ariaContentId,
          title: "Seite zurück",
          "aria-label": "Seite zurück",
          "aria-disabled": o.currentPage === 1 || f.numberOfPages === 0,
          disabled: o.currentPage === 1 || f.numberOfPages === 0,
          tabindex: "-1",
          variant: "secondary",
          icon: "chevron-left-small",
          squared: "",
          size: "lg",
          onClick: r[1] || (r[1] = (a) => f.updatePage("dec"))
        }, null, 8, ["aria-controls", "aria-disabled", "disabled"])
      ]),
      (q(!0), I(oe, null, Ae(f.shownPageNumbers, (a) => (q(), I("li", {
        key: a,
        ref_for: !0,
        ref: "paginationItem",
        role: "presentation"
      }, [
        ee(n, {
          role: "menuitemradio",
          "aria-controls": i.ariaContentId,
          title: `Seite ${a}`,
          "aria-label": `Seite ${a}`,
          "aria-checked": a === o.currentPage,
          "aria-posinset": a,
          "aria-setsize": f.numberOfPages,
          tabindex: a === o.currentPage ? "0" : "-1",
          class: R(a === o.currentPage ? "active" : ""),
          variant: "secondary",
          squared: "",
          size: "lg",
          onClick: (l) => f.updatePage(a)
        }, {
          default: z(() => [
            te(G(a), 1)
          ]),
          _: 2
        }, 1032, ["aria-controls", "title", "aria-label", "aria-checked", "aria-posinset", "aria-setsize", "tabindex", "class", "onClick"])
      ]))), 128)),
      $("li", js, [
        ee(n, {
          role: "menuitem",
          "aria-controls": i.ariaContentId,
          title: "nächste Seite",
          "aria-label": "nächste Seite",
          "aria-disabled": o.currentPage === f.numberOfPages || f.numberOfPages === 0,
          disabled: o.currentPage === f.numberOfPages || f.numberOfPages === 0,
          tabindex: "-1",
          variant: "secondary",
          icon: "chevron-right-small",
          squared: "",
          size: "lg",
          onClick: r[2] || (r[2] = (a) => f.updatePage("inc"))
        }, null, 8, ["aria-controls", "aria-disabled", "disabled"])
      ]),
      $("li", Us, [
        ee(n, {
          role: "menuitem",
          "aria-controls": i.ariaContentId,
          title: "letzte Seite",
          "aria-label": "letzte Seite",
          "aria-disabled": o.currentPage === f.numberOfPages || f.numberOfPages === 0,
          disabled: o.currentPage === f.numberOfPages || f.numberOfPages === 0,
          tabindex: "-1",
          variant: "secondary",
          icon: "chevron-right-double-small",
          squared: "",
          size: "lg",
          onClick: r[3] || (r[3] = (a) => f.updatePage(f.numberOfPages))
        }, null, 8, ["aria-controls", "aria-disabled", "disabled"])
      ])
    ], 8, Rs),
    $("div", Hs, [
      ee(p, {
        label: "Treffer pro Seite",
        "label-for": "pagination-select-" + f.uniqueId
      }, {
        default: z(() => [
          ee(c, {
            id: "pagination-select-" + f.uniqueId,
            modelValue: o.elementsPerPage,
            "onUpdate:modelValue": r[4] || (r[4] = (a) => o.elementsPerPage = a),
            "aria-label": "Treffer pro Seite",
            options: i.elementsPerPageOptions,
            required: "",
            title: "Treffer pro Seite"
          }, null, 8, ["id", "modelValue", "options"])
        ]),
        _: 1
      }, 8, ["label-for"])
    ])
  ]);
}
const Za = /* @__PURE__ */ K(Ms, [["render", zs]]), Gs = {
  name: "DpsFormToggle",
  props: {
    /**
     * The unique identifier for the input element.
     * @default undefined
     */
    id: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * The current value of the toggle switch (on/off).
     * @default false
     */
    modelValue: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * The title attribute for the input element, shown as a tooltip on hover.
     * @default undefined
     */
    title: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Disables the toggle switch when set to true.
     * @default false
     */
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * An ARIA label for accessibility, describing the input element.
     * @default undefined
     */
    ariaLabel: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * ID of an element that labels the input element.
     * @default undefined
     */
    ariaLabelledby: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * ID of an element that describes the input element.
     * @default undefined
     */
    ariaDescribedby: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Size of the toggle switch. Can be 'sm' for small, 'md' for medium, or undefined for default.
     * @default undefined
     */
    size: {
      type: String,
      required: !1,
      default: void 0,
      validator(e) {
        return [void 0, "sm", "md"].includes(e);
      }
    }
  },
  emits: [
    /**
     * Emitted when the toggle switch's value changes.
     * @event update:modelValue
     * @type { boolean }
     */
    "update:modelValue"
  ]
}, Ys = { class: "dps-form-toggle dps-input-wrapper" }, Ws = ["title"], Ks = ["id", "checked", "disabled", "aria-label", "aria-describedby", "aria-labelledby"], Js = {
  key: 0,
  class: "dps-form-toggle__label"
};
function Xs(e, r, i, s, o, f) {
  return q(), I("div", Ys, [
    $("label", {
      title: i.title,
      class: "dps-form-toggle__container"
    }, [
      $("input", {
        id: i.id,
        ref: "input",
        type: "checkbox",
        checked: i.modelValue,
        class: "dps-toggle",
        disabled: i.disabled,
        "aria-label": i.ariaLabel,
        "aria-describedby": i.ariaDescribedby,
        "aria-labelledby": i.ariaLabelledby,
        onChange: r[0] || (r[0] = (n) => e.$emit("update:modelValue", n.target.checked))
      }, null, 40, Ks),
      $("span", {
        class: R([{ ["dps-form-toggle__slider--size-" + i.size]: i.size }, "dps-form-toggle__slider"])
      }, null, 2),
      e.$slots.default ? (q(), I("span", Js, [
        B(e.$slots, "default")
      ])) : j("", !0)
    ], 8, Ws)
  ]);
}
const el = /* @__PURE__ */ K(Gs, [["render", Xs]]), Qs = ue({
  name: "DpsLogoutAlert",
  components: { DpsButton: rt, DpsAlert: Es },
  props: {
    /**
     * Defines when the current session expires (UNIX timestamp in seconds)
     */
    expirationTime: {
      type: Number,
      required: !0
    },
    /**
     * Defines how many minutes before the logout the alert should be visible
     * @default 3
     */
    threshold: {
      type: Number,
      default: 3,
      required: !1
    }
  },
  emits: [
    /**
     * Emitted when the user clicks the "Neu anmelden" button
     */
    "click"
  ],
  data() {
    return {
      interval: null,
      minutesToLogout: null
    };
  },
  computed: {
    showLogoutAlert() {
      return this.minutesToLogout <= this.threshold;
    }
  },
  watch: {
    expirationTime() {
      this.startInterval();
    }
  },
  created() {
    this.startInterval();
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
  methods: {
    startInterval() {
      this.setMinutesToLogout(), clearInterval(this.interval), this.minutesToLogout > 0 && (this.interval = setInterval(this.setMinutesToLogout, 1e3));
    },
    setMinutesToLogout() {
      const e = this.expirationTime * 1e3, r = Date.now(), i = e - r;
      this.minutesToLogout = Math.ceil(i / 1e3 / 60), this.minutesToLogout <= 0 && clearInterval(this.interval);
    },
    handleClick() {
      this.$emit("click");
    }
  }
}), Zs = /* @__PURE__ */ $("b", null, "Hinweis:", -1);
function ea(e, r, i, s, o, f) {
  const n = ae("DpsButton"), c = ae("DpsAlert");
  return e.showLogoutAlert ? (q(), W(c, {
    key: 0,
    variant: "info",
    class: "dps-logout-alert"
  }, {
    default: z(() => [
      $("div", null, [
        Zs,
        te(" Aus Sicherheitsgründen werden Sie in "),
        $("b", null, [
          e.minutesToLogout > 0 ? (q(), I(oe, { key: 0 }, [
            te(G(e.minutesToLogout) + " " + G(e.minutesToLogout === 1 ? "Minute" : "Minuten"), 1)
          ], 64)) : (q(), I(oe, { key: 1 }, [
            te("Kürze")
          ], 64)),
          te(" automatisch ausgeloggt. ")
        ]),
        te(" Bitte melden Sie sich anschließend erneut an. ")
      ]),
      ee(n, {
        class: "dps-logout-alert__logout-button",
        variant: "secondary",
        size: "sm",
        onClick: e.handleClick
      }, {
        default: z(() => [
          te(" Neu anmelden ")
        ]),
        _: 1
      }, 8, ["onClick"])
    ]),
    _: 1
  })) : j("", !0);
}
const tl = /* @__PURE__ */ K(Qs, [["render", ea]]);
var ta = {
  months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  monthsShort: ["Jan", "Feb", "März", "Apr", "Mai", "Juni", "Juli", "Aug", "Sep", "Okt", "Nov", "Dez"],
  weekdays: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
  weekdaysShort: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
  weekdaysMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
  firstDayOfWeek: 1,
  firstWeekContainsDate: 4
};
const ua = {
  formatLocale: ta,
  yearFormat: "YYYY",
  monthFormat: "MMM",
  monthBeforeYear: !0
};
vr.locale("de", ua);
const ra = {
  name: "DpsFormDatepicker",
  components: {
    DpsFormCheckbox: Zt,
    DpsButton: rt,
    DatePickerNext: vr
  },
  props: {
    /**
     * Sets the initial date in the format `YYYY-MM-DD`.
     * Example: `2024-10-02`.
     */
    initialDate: {
      type: String,
      default: ""
    },
    /**
     * Enables the checkbox next to the date picker.
     */
    hasCheckbox: {
      type: Boolean,
      default: !1
    },
    /**
     * Sets the initial state of the checkbox.
     */
    isCheckboxChecked: {
      type: Boolean,
      default: !1
    },
    /**
     * Title for the checkbox.
     */
    checkboxTitle: {
      type: String,
      default: ""
    },
    /**
     * An array of dates that should be grayed out.
     * Can either be an array of dates or an array of objects containing a "from" and "to" date and an optional title.
     * Example: `[new Date(2024, 9, 15)]` or `[{from: "01.02.2025", to: "10.02.2025", title: "Beispieltermin"}]`.
     */
    dateBlackList: {
      type: Array,
      default() {
        return [];
      }
    },
    /**
     * Watch for external updates.
     */
    watchForExternalUpdates: {
      type: Boolean,
      default: !1
    },
    /**
     * Sets the start and end dates for the range.
     * Example: `{ beginn: new Date(), ende: new Date() }`.
     */
    zeitraum: {
      type: Object,
      default() {
        return {};
      }
    },
    /**
     * Disables the date picker when true.
     */
    disabled: {
      type: Boolean,
      default: !1
    },
    /**
     * Placeholder text for the input field.
     */
    placeholder: {
      type: String,
      default: "TT.MM.JJJJ"
    },
    /**
     * Enables range selection mode.
     */
    range: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Additional attributes for the input element.
     */
    inputAttr: {
      type: Object,
      default() {
        return {};
      }
    },
    /**
     * Allows the date picker to be cleared when set to true.
     */
    clearable: {
      type: Boolean,
      default: !0
    },
    /**
     * Enables manual input in the date field when set to true.
     */
    editable: {
      type: Boolean,
      default: !0
    }
  },
  emits: [
    /**
     * Emitted when the selected date value changes.
     * @event date-picker-value
     */
    "date-picker-value",
    /**
     * Emitted when the checkbox state changes.
     * @event is-checkbox-checked
     */
    "is-checkbox-checked",
    /**
     * Emitted when the date picker is opened.
     * @event date-picker-opened
     */
    "date-picker-opened",
    /**
     * Emitted when a date is selected.
     * @event pick-element
     */
    "pick-element",
    /**
     * Emitted when the date range is updated.
     * @event update-range
     */
    "update-range",
    /**
     * Emitted when the duration is updated.
     * @event update-termindauer
     */
    "update-termindauer",
    /**
     * Emitted when the start or end dates are changed.
     * @event start-end
     */
    "start-end"
  ],
  data() {
    return {
      KEY_ARROW_RIGHT: "ArrowRight",
      KEY_ARROW_LEFT: "ArrowLeft",
      KEY_ARROW_UP: "ArrowUp",
      KEY_ARROW_DOWN: "ArrowDown",
      KEY_ENTER: "Enter",
      KEY_ESCAPE: "Escape",
      KEY_TAB: "Tab",
      defaultDate: this.getDefaultDate(),
      dauer: null,
      dateBlackListFinal: [],
      startDate: this.zeitraum && this.zeitraum.beginn ? de(this.zeitraum.beginn).format("DD.MM.YYYY") : "",
      endDate: this.zeitraum && this.zeitraum.ende ? de(this.zeitraum.ende).format("DD.MM.YYYY") : "",
      datepicker: null,
      datepickerPopup: null,
      cssClasses: {
        popup: "mx-datepicker-popup",
        header: "mx-calendar-header",
        calendarContent: "mx-calendar-content",
        rows: "tr.mx-date-row:not(.d-none)",
        firstRow: "mx-date-row:first-of-type",
        lastRow: "mx-date-row:last-of-type",
        cellsInCurrentMonth: "td.cell:not(.not-current-month)",
        hidden: "d-none",
        blackDate: "black-date",
        dayView: "mx-calendar-panel-date",
        monthView: "mx-calendar-panel-month",
        yearView: "mx-calendar-panel-year"
      },
      heights: {
        contentHeightSm: 225,
        contentHeightMd: 268,
        contentHeightLg: 308
      },
      isOpenDatepicker: !1,
      isChecked: !1
    };
  },
  watch: {
    initialDate: {
      deep: !0,
      handler(e) {
        this.watchForExternalUpdates && (this.defaultDate = e ? new Date(e) : "");
      }
    },
    zeitraum: {
      deep: !0,
      handler(e) {
        e && (this.startDate = e.beginn ? de(e.beginn).format("DD.MM.YYYY") : "", this.endDate = e.ende ? de(e.ende).format("DD.MM.YYYY") : "", this.defaultDate = this.getDefaultDate());
      }
    },
    defaultDate: {
      deep: !0,
      handler(e) {
        this.range && (this.startDate = e[0] ? de(e[0]).format("DD.MM.YYYY") : "", this.endDate = e[1] ? de(e[1]).format("DD.MM.YYYY") : "", e.length || (this.updateRange(), this.$emit("update-termindauer", "", "", 0)));
      }
    }
  },
  mounted() {
    this.datepicker = this.$refs.datepicker, this.isChecked = this.isCheckboxChecked, this.calculateFinalBlacklist(), this.range ? this.calcDateDifference() : this.defaultDate = new Date(this.initialDate);
  },
  methods: {
    /**
     * Handles the behavior when confirm button is clicked
     * Ensures popup doesn't reopen immediately after closing
     */
    handleConfirm() {
      this.isOpenDatepicker = !1, this.$nextTick(() => {
        this.$refs.datepicker.getElementsByTagName("input")[0].blur();
      });
    },
    /**
     * Toggles the datepicker open state.
     * Can be used for both click and keyup.enter events.
     * @returns {void}
     */
    toggleDatepicker() {
      this.isOpenDatepicker || (this.isOpenDatepicker = !0, this.$nextTick(() => {
        this.handleOpen();
      }));
    },
    /**
     * returns valid moment date or null
     * @param   {string} dateString string to parse
     * @returns {moment.Moment} date or null
     */
    getMomentDate(e) {
      return e ? de(e, "DD.MM.YYYY") : null;
    },
    /**
     * calculates the duration between dates
     * @param {Array} datesArr selected date as Array or empty
     * @returns {void}
     */
    calcDateDifference(e = []) {
      if (e.length < 2 || e.some((s) => s === null)) return;
      const r = this.getMomentDate(e[0]), i = this.getMomentDate(e[1]);
      this.dauer = i.diff(r, "days") || 0, this.$emit("start-end", {
        beginn: r.format("YYYY-MM-DD"),
        ende: i.format("YYYY-MM-DD")
      }), this.$emit("update-termindauer", r, i, this.dauer);
    },
    /**
     * Check if the date changed in the datepicker range
     * @returns {void}
     */
    updateRange() {
      let e = "", r = "";
      if (this.startDate && this.endDate) {
        const i = this.getMomentDate(this.startDate), s = this.getMomentDate(this.endDate);
        this.dauer = s.diff(i, "days") || 0, e = i.format("YYYY-MM-DD"), r = s.format("YYYY-MM-DD");
      }
      this.$emit("update-range", {
        beginn: e,
        ende: r,
        dauer: this.dauer
      });
    },
    /**
     * function to get the defaultDate from zeitraum
     * @return {object}
     */
    getDefaultDate() {
      var e, r;
      return this.range ? (e = this.zeitraum) != null && e.beginn && ((r = this.zeitraum) != null && r.ende) ? [
        new Date(de(this.zeitraum.beginn).format("MM.DD.YYYY")),
        new Date(de(this.zeitraum.ende).format("MM.DD.YYYY"))
      ] : [] : this.initialDate ? new Date(this.initialDate) : "";
    },
    /**
     * Moves focus to a different cell in the datepicker based on the given offset.
     * @param {number} dayOffset - The number of days to move the focus by.
     * @param {HTMLElement} currentPanel - The currently active panel containing the date cells (day, month, or year view).
     * @returns {void}
     */
    moveFocus(e, r) {
      if (!r) return;
      const i = Array.from(r.querySelectorAll(".cell"));
      if (i.length === 0) return;
      const s = document.activeElement, o = i.findIndex((n) => n === s);
      if (o === -1) {
        this.setFocusOnCell(i[0]);
        return;
      }
      const f = o + e;
      f >= 0 && f < i.length && this.updateFocus(i[o], i[f]);
    },
    /**
     * Sets focus on a specific cell in the datepicker.
     * @param {HTMLElement} cell - The cell to focus.
     * @returns {void}
     */
    setFocusOnCell(e) {
      this.datepickerPopup.querySelectorAll(".cell").forEach((i) => i.classList.remove("focused")), e.tabIndex = 0, e.classList.add("focused"), e.focus();
    },
    /**
     * Updates focus by removing focus from the old cell and applying it to the new cell.
     * @param {HTMLElement} oldCell - The previously focused cell.
     * @param {HTMLElement} newCell - The new cell to focus on.
     * @returns {void}
     */
    updateFocus(e, r) {
      e && (e.classList.remove("focused"), e.tabIndex = -1), r && this.setFocusOnCell(r);
    },
    /**
     * Handles keydown events for navigating within the datepicker panels.
     *
     * This function manages navigation within day, month, and year views based on
     * arrow keys, handles the "Enter" key to simulate clicks, and ensures focus trapping
     * within the datepicker. It also manages specific transitions when navigating between
     * different calendar panels in range view.
     *
     * @param {KeyboardEvent} event - The keyboard event object containing information about the key pressed.
     *
     * @returns {void}
     */
    handleKeydown(e) {
      const r = document.activeElement, i = !!r.closest(".mx-calendar-panel-date"), s = !!r.closest(".mx-calendar-panel-month"), o = !!r.closest(".mx-calendar-panel-year"), f = i ? r.closest(".mx-calendar-panel-date") : s ? r.closest(".mx-calendar-panel-month") : o ? r.closest(".mx-calendar-panel-year") : null, n = {
        [this.KEY_ARROW_RIGHT]: i || s || o ? 1 : 0,
        [this.KEY_ARROW_LEFT]: i || s || o ? -1 : 0,
        [this.KEY_ARROW_UP]: i ? -7 : s ? -3 : o ? -2 : 0,
        [this.KEY_ARROW_DOWN]: i ? 7 : s ? 3 : o ? 2 : 0
      };
      (e.key === this.KEY_ARROW_UP || e.key === this.KEY_ARROW_DOWN) && e.preventDefault();
      const c = n[e.key] || 0;
      if (c !== 0 && f) {
        const p = e.key === this.KEY_ARROW_RIGHT ? "right" : e.key === this.KEY_ARROW_LEFT ? "left" : e.key === this.KEY_ARROW_UP ? "up" : e.key === this.KEY_ARROW_DOWN ? "down" : null;
        i && p ? this.handleDayViewBoundaryMove(c, f, p) : this.moveFocus(c, f);
      }
      e.key === this.KEY_ENTER && this.handleEnterKey(e), e.key === this.KEY_ESCAPE && (this.isOpenDatepicker = !1, this.resetFocusToCurrentDatepickerInput()), this.trapFocus(e);
    },
    /**
     * Handles focus movement in the day view, including crossing boundaries between calendar panels.
     * @param {number} moveStep - The number of steps to move the focus by (positive for forward, negative for backward).
     * @param {HTMLElement} currentPanel - The currently active panel (day view) containing the date cells.
     * @param {string} direction - The direction of movement (e.g., 'left', 'right', 'up', 'down').
     * @returns {void}
     */
    handleDayViewBoundaryMove(e, r, i) {
      const s = Array.from(
        r.querySelectorAll(".cell:not(.not-current-month)")
      );
      if (s.length === 0) return;
      const o = document.activeElement, f = s.findIndex((c) => c === o);
      if (f === -1) {
        this.setFocusOnCell(s[0]);
        return;
      }
      const n = f + e;
      switch (i) {
        case "down":
        case "up":
          n >= 0 && n < s.length && this.updateFocus(s[f], s[n]);
          break;
        case "right":
          if (n >= s.length) {
            const c = r.nextElementSibling;
            if (c) {
              const p = Array.from(
                c.querySelectorAll(".cell:not(.not-current-month)")
              );
              p.length > 0 && this.setFocusOnCell(p[0]);
            }
          } else
            this.updateFocus(s[f], s[n]);
          break;
        case "left":
          if (n < 0) {
            const c = r.previousElementSibling;
            if (c) {
              const p = Array.from(
                c.querySelectorAll(".cell:not(.not-current-month)")
              );
              p.length > 0 && this.setFocusOnCell(p[p.length - 1]);
            }
          } else
            this.updateFocus(s[f], s[n]);
          break;
      }
    },
    /**
     * Handles the behavior when the "Enter" key is pressed.
     * @param {KeyboardEvent} event - The keyboard event object.
     * @returns {void}
     */
    handleEnterKey(e) {
      e.target.click(), this.$nextTick(() => {
        const r = document.querySelector(".mx-calendar-panel-year"), i = document.querySelector(".mx-calendar-panel-month"), s = r ? r.querySelector("td.cell.active") : i ? i.querySelector("td.cell.active") : null;
        s && (s.setAttribute("tabindex", "0"), s.focus());
      });
    },
    /**
     * Sets up an event listener for the datepicker popup.
     * @returns {void}
     */
    setPopupEventListener() {
      this.$nextTick(() => {
        this.datepickerPopup && this.datepickerPopup.addEventListener("keydown", this.handleKeydown);
      });
    },
    /**
     * Checks and sets the focus on either 'today' or 'active' cell after the DOM updates.
     * @returns {void}
     */
    checkAndSetCellFocus() {
      this.$nextTick(() => {
        if (!this.datepickerPopup) return;
        const e = this.datepickerPopup.querySelectorAll(".mx-calendar-panel-year"), r = this.datepickerPopup.querySelectorAll(".mx-calendar-panel-month"), i = this.datepickerPopup.querySelectorAll(".mx-calendar-panel-date");
        if (e.length) {
          const s = e[0], o = s.querySelector("td.cell.active") || s.querySelector("td.cell");
          o && this.setFocusOnCell(o);
          return;
        }
        if (r.length) {
          const s = r[0], o = s.querySelector("td.cell.active") || s.querySelector("td.cell");
          o && this.setFocusOnCell(o);
          return;
        }
        if (i.length) {
          const s = i[0], o = s.querySelector(".cell.active") || s.querySelector(".cell.today") || s.querySelector(".cell:not(.not-current-month)");
          o && this.setFocusOnCell(o);
        }
      });
    },
    /**
     * Traps focus within the datepicker popup for improved accessibility.
     * @param {KeyboardEvent} event - The keyboard event object.
     * @returns {void}
     */
    trapFocus(e) {
      const r = this.getFocusableElements();
      if (r.length === 0)
        return;
      const [i, s] = [
        r[0],
        r[r.length - 1]
      ];
      e.key === this.KEY_TAB && this.handleTabNavigation(e, i, s);
    },
    /**
     * Retrieves all focusable elements inside the datepickerPopup.
     * @returns {HTMLElement[]} Array of focusable elements.
     */
    getFocusableElements() {
      const e = this.datepickerPopup.querySelectorAll(
        'input, a, .mx-calendar-panel-month button, .mx-calendar-panel-year button, .mx-calendar-panel-date button:not(.mx-btn-icon-double-left), [tabindex]:not([tabindex="-1"]), .mx-datepicker-footer button'
      );
      return Array.from(e).filter((r) => {
        const i = window.getComputedStyle(r);
        return r.offsetWidth > 0 && r.offsetHeight > 0 && i.visibility !== "hidden" && i.display !== "none";
      });
    },
    /**
     * Handles Tab and Shift+Tab navigation for focus trapping.
     * @param {KeyboardEvent} event - The keyboard event object.
     * @param {HTMLElement} firstElement - The first focusable element.
     * @param {HTMLElement} lastElement - The last focusable element.
     * @returns {void}
     */
    handleTabNavigation(e, r, i) {
      const s = e.shiftKey;
      s && document.activeElement === r ? (i.focus(), e.preventDefault()) : !s && document.activeElement === i && (r.focus(), e.preventDefault());
    },
    /**
     * Resets the focus back to the current datepicker input element.
     * @returns {void}
     */
    resetFocusToCurrentDatepickerInput() {
      this.$nextTick(() => {
        this.$refs.datepicker.getElementsByTagName("input")[0].select();
      });
    },
    /**
     * Improves the accessibility of navigation buttons in the datepicker.
     * Sets titles for previous, next, month, and year buttons for better understanding and accessibility.
     * @returns {void}
     */
    improveNavigationButtonAccessibility() {
      this.$nextTick(() => {
        if (!this.datepickerPopup) return;
        Object.entries({
          ".mx-calendar-header .mx-btn-icon-left, .mx-calendar-header .mx-btn-icon-double-left": "Zurück",
          ".mx-calendar-header .mx-btn-icon-right, .mx-calendar-header .mx-btn-icon-double-right": "Weiter",
          ".mx-calendar-header .mx-btn-current-month": "Monat",
          ".mx-calendar-header .mx-btn-current-year": "Jahr"
        }).forEach(([r, i]) => {
          this.datepickerPopup.querySelectorAll(r).forEach((o) => {
            o.title = i;
          });
        });
      });
    },
    /**
     * Sets titles to each cell in the datepicker.
     * The title is set to the text content of the cell for better accessibility.
     * @returns {void}
     */
    setCellTitles() {
      this.$nextTick(() => {
        if (!this.datepickerPopup) return;
        this.datepickerPopup.querySelectorAll(
          ".mx-calendar-panel-month .mx-calendar-content .cell, .mx-calendar-panel-year .mx-calendar-content .cell"
        ).forEach((r) => {
          r.title = r.textContent.trim();
        });
      });
    },
    /**
     * run functions to customize the datepicker
     * @returns {void}
     */
    customizeDatePicker() {
      this.setDateBlacklist(), this.hideRowsNotInCurrentMonth();
    },
    /**
     * Sets CSS classes and titles for black and white days based on the provided lists.
     * @param {Array} dateList - The list of dates to process.
     * @returns {void}
     */
    async setDateList(e) {
      if (await this.selectDatepickerPopup(), !this.datepickerPopup) return;
      const r = this.datepickerPopup.querySelectorAll(
        `.${this.cssClasses.calendarContent}`
      );
      r && (r.forEach((i) => {
        i.querySelectorAll(`.${this.cssClasses.blackDate}`).forEach((o) => {
          o.classList.remove(this.cssClasses.blackDate), o.removeAttribute("data-tooltip");
        });
      }), e.forEach((i) => {
        const o = (i instanceof Date ? de(i) : i.date).format("YYYY-MM-DD");
        r.forEach((f) => {
          const n = f.querySelector(`.cell[title='${o}']`);
          n && this.addDateClass(n, i.title || "");
        });
      }));
    },
    /**
     * Adds the specified CSS class and updates attributes for the date cell.
     * @param {Element} dateCell - The cell element for the date.
     * @param {string} zusatz - Additional label for the date (if available).
     * @returns {void}
     */
    addDateClass(e, r) {
      e.classList.add(this.cssClasses.blackDate);
      const i = r || "";
      i && (e.setAttribute("aria-label", e.getAttribute("title")), e.setAttribute("title", i));
    },
    async setDateBlacklist() {
      this.setDateList(this.dateBlackListFinal);
    },
    /**
     * Hide first or last row if all days in the calendar row are in the new month
     * @returns {void}
     */
    async hideRowsNotInCurrentMonth() {
      if (await this.selectDatepickerPopup(), !this.datepickerPopup) return;
      const e = this.datepickerPopup.querySelectorAll(
        `.${this.cssClasses.calendarContent}`
      );
      for (const r of e) {
        const i = r.querySelectorAll("tr.mx-date-row");
        for (const f of i) {
          const c = f.querySelectorAll(
            this.cssClasses.cellsInCurrentMonth
          ).length > 0;
          f.classList.toggle(this.cssClasses.hidden, !c);
        }
        const o = r.querySelectorAll(
          `tr.mx-date-row:not(.${this.cssClasses.hidden})`
        ).length;
        o === 0 ? r.style.setProperty("--mx-content-height", "0px") : o < 5 ? r.style.setProperty("--mx-content-height", this.heights.contentHeightSm + "px") : o === 5 ? r.style.setProperty("--mx-content-height", this.heights.contentHeightMd + "px") : r.style.setProperty("--mx-content-height", this.heights.contentHeightLg + "px");
      }
    },
    /**
     * select popup element and customize the datepicker
     * @returns {void}
     */
    async handleOpen() {
      this.isChecked = this.isCheckboxChecked, await this.selectDatepickerPopup(), this.datepickerPopup && (this.customizeDatePicker(), this.improveNavigationButtonAccessibility(), this.setCellTitles(), this.checkAndSetCellFocus(), this.setPopupEventListener(), this.$emit("date-picker-opened"));
    },
    handleClose() {
      this.datepickerPopup.removeEventListener("keydown", this.handleKeydown), this.updateRange(), this.isOpenDatepicker = !1, this.resetFocusToCurrentDatepickerInput();
    },
    /**
     * function to handle the calendar change event. customize the popup element.
     * @returns {void}
     */
    handleCalendarChange() {
      this.customizeDatePicker(), this.improveNavigationButtonAccessibility(), this.setCellTitles(), this.$nextTick(() => {
        this.hideRowsNotInCurrentMonth();
      });
    },
    /**
     * function to select the popup element of the datepicker after it was opened
     * @returns {Promise}
     */
    selectDatepickerPopup() {
      return new Promise((e, r) => {
        this.datepickerPopup && e(), this.$nextTick(() => {
          this.datepickerPopup = document.querySelector(`.${this.cssClasses.popup}`), this.datepickerPopup && e(), r();
        });
      });
    },
    updateCheckbox(e) {
      this.$emit("is-checkbox-checked", e);
    },
    /**
     * function to handle the change event. set the start date and emits the date-picker-value event.
     * @emits date-picker-value
     * @returns {void}
     */
    handleChange(e) {
      if (!e) {
        this.$emit("date-picker-value", null);
        return;
      }
      const r = (i) => de(i, de.ISO_8601, !0).isValid() ? de(i).format("DD.MM.YYYY") : de(i, "DD.MM.YYYY").format("DD.MM.YYYY");
      if (this.range)
        e.length < 1 || e[0] === null ? (this.startDate = "", this.endDate = "") : (this.startDate = r(e[0]), this.endDate = this.startDate, e.length >= 2 && e[1] !== null && (this.endDate = r(e[1]), this.calcDateDifference(e)));
      else {
        const i = r(e);
        this.$emit("date-picker-value", i);
      }
      this.handleConfirm(), this.$nextTick(() => {
        this.checkAndSetCellFocus(), this.resetFocusToCurrentDatepickerInput();
      });
    },
    handlePanelChange() {
      this.$nextTick(() => {
        this.improveNavigationButtonAccessibility(), this.setCellTitles(), this.checkAndSetCellFocus(), this.setPopupEventListener();
      });
    },
    /**
     * creates a list of all blacklisted dates and the corresponding titles.
     */
    calculateFinalBlacklist() {
      Array.isArray(this.dateBlackList) ? this.dateBlackList[0] instanceof Date ? this.dateBlackListFinal = this.dateBlackList : this.dateBlackList.forEach((e) => {
        if (e.to && e.from) {
          const r = de(e.from), s = de(e.to).diff(r, "days");
          for (let o = 0; o <= s; o++)
            this.dateBlackListFinal.push({
              date: de(e.from).add(o, "days"),
              title: e.title
            });
        }
      }) : this.dateBlackListFinal = [];
    }
  }
}, ia = /* @__PURE__ */ $("span", { class: "dps-icon dps-icon--calender" }, null, -1);
function na(e, r, i, s, o, f) {
  const n = ae("DpsFormCheckbox"), c = ae("DpsButton"), p = ae("DatePickerNext");
  return q(), W(p, {
    ref: "datepicker",
    value: o.defaultDate,
    "onUpdate:value": r[1] || (r[1] = (a) => o.defaultDate = a),
    class: R(["dps-form-datepicker", { "dps-form-datepicker--range": i.range }]),
    format: "DD.MM.YYYY",
    type: "date",
    open: o.isOpenDatepicker,
    range: i.range,
    "popup-class": "dps-form-datepicker__popup" + (i.range ? " range" : ""),
    placeholder: i.range ? o.startDate && o.endDate ? `${o.startDate} - ${o.endDate}` : "TT.MM.JJJJ - TT.MM.JJJJ" : i.placeholder,
    separator: " - ",
    disabled: i.disabled,
    "input-attr": i.inputAttr,
    clearable: i.clearable,
    editable: i.editable,
    confirm: i.range,
    "confirm-text": "Übernehmen",
    onClick: f.toggleDatepicker,
    onKeydown: ve(re(f.toggleDatepicker, ["stop", "prevent"]), ["enter"]),
    onClose: f.handleClose,
    onCalendarChange: f.handleCalendarChange,
    onChange: f.handleChange,
    onPick: r[2] || (r[2] = (a) => e.$emit("pick-element", a)),
    onPanelChange: f.handlePanelChange
  }, Qt({
    "icon-calendar": z(() => [
      ia
    ]),
    _: 2
  }, [
    i.range || i.hasCheckbox ? {
      name: "footer",
      fn: z(() => [
        i.hasCheckbox ? (q(), W(n, {
          key: 0,
          modelValue: o.isChecked,
          "onUpdate:modelValue": [
            r[0] || (r[0] = (a) => o.isChecked = a),
            f.updateCheckbox
          ],
          title: i.checkboxTitle
        }, {
          default: z(() => [
            te(G(i.checkboxTitle), 1)
          ]),
          _: 1
        }, 8, ["modelValue", "title", "onUpdate:modelValue"])) : j("", !0),
        i.range ? (q(), W(c, {
          key: 1,
          class: "dps-form-datepicker__button-cancel",
          variant: "secondary",
          title: "Abbrechen",
          size: "sm",
          onClick: f.handleClose
        }, {
          default: z(() => [
            te(" Abbrechen ")
          ]),
          _: 1
        }, 8, ["onClick"])) : j("", !0)
      ]),
      key: "0"
    } : void 0
  ]), 1032, ["value", "class", "open", "range", "popup-class", "placeholder", "disabled", "input-attr", "clearable", "editable", "confirm", "onClick", "onKeydown", "onClose", "onCalendarChange", "onChange", "onPanelChange"]);
}
const ul = /* @__PURE__ */ K(ra, [["render", na]]), sa = ue({
  name: "DpsUploadFormGroup",
  components: { DpsFormFile: $s, DpsFormGroup: Lr, DpsButton: rt, DpsInputGroup: Cs },
  props: {
    /**
     * The unique identifier for the input (optional).
     * @default undefined
     */
    id: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * The label for the component.
     * @default ""
     */
    label: {
      type: String,
      required: !1,
      default: ""
    },
    /**
     * Hides the label.
     * @default false
     */
    hideLabel: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * The label for the upload button.
     * @default "Hochladen"
     */
    uploadButtonLabel: {
      type: String,
      required: !1,
      default: "Hochladen"
    },
    /**
     * The title for the upload button.
     * Defaults to the button label if no title is set.
     * @default undefined
     */
    uploadButtonTitle: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Which file formats to accept.
     * Can be either file extension or mime-type or mixed
     * e.g. ['.pdf'], ['application/pdf'] or ['.pdf', 'application/pdf']
     * @default []
     */
    fileAccept: {
      type: Array,
      required: !1,
      default() {
        return [];
      }
    },
    /**
     * Allows selecting multiple files at once.
     * @default false
     */
    fileMultiple: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Disables the component.
     * @default false
     */
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Title for the search button.
     * Defaults to the label if no title is set.
     * @default undefined
     */
    title: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Disables the upload button.
     * @default false
     */
    disableUploadButton: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Displays the component without the upload button.
     * @default false
     */
    hideUploadButton: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * Changes the state to error and displays the provided error message.
     * @default ""
     */
    uploadErrorMessage: {
      type: String,
      required: !1,
      default: ""
    },
    /**
     * Required attribute of the input.
     * @default false
     */
    fileRequired: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  emits: [
    /**
     * Emitted when the file selection changes.
     * @event module:DpsFormFile#input
     */
    "input",
    /**
     * Emitted when the upload button gets clicked.
     * @event module:DpsFormFile#upload
     */
    "upload"
  ],
  data() {
    return {
      hasError: !1,
      filesSelected: null,
      uniqID: this.id ?? be("dps-upload-form-group-"),
      rerenderCounter: 0
    };
  },
  computed: {
    fileSearchTitle() {
      return this.title ?? this.label;
    },
    acceptedFilesAsString() {
      if (Array.isArray(this.fileAccept))
        return this.fileAccept.join(", ");
    },
    acceptedFilesDescription() {
      var e;
      return this.acceptedFilesAsString ? `${((e = this.fileAccept) == null ? void 0 : e.length) > 1 ? "Erlaubte Dateiformate" : "Erlaubtes Dateiformat"}: ${this.acceptedFilesAsString}` : void 0;
    },
    acceptedFilesErrorMessage() {
      var e;
      return this.acceptedFilesAsString ? `Die ${this.fileMultiple ? "gewählten Dateien entsprechen" : "gewählte Datei entspricht"} nicht ${((e = this.fileAccept) == null ? void 0 : e.length) > 1 ? "den erlaubten Dateiformaten" : "dem erlaubten Dateiformat"}` : "";
    },
    errorMessage() {
      return this.uploadErrorMessage ? this.uploadErrorMessage : this.acceptedFilesErrorMessage;
    },
    isUploadButtonDisabled() {
      var e;
      return !(Array.isArray(this.filesSelected) ? (e = this.filesSelected) != null && e.length : this.filesSelected) || this.disabled || this.disableUploadButton;
    }
  },
  watch: {
    uploadErrorMessage(e) {
      e && (this.hasError = !0);
    }
  },
  mounted() {
    this.hasError = !!this.uploadErrorMessage;
  },
  methods: {
    validateFileType(e) {
      const r = "." + e.name.split(".").pop();
      return this.fileAccept.includes(e.type) || this.fileAccept.includes(r);
    },
    handleSelectionChange(e) {
      if (!e)
        return this.filesSelected = null, this.$emit("input", this.filesSelected), !1;
      if (this.filesSelected = Array.isArray(e) ? e : [e], this.acceptedFilesAsString && !Array.from(this.filesSelected).reduce(
        (i, s) => i && s && this.validateFileType(s),
        !0
      ))
        return this.resetSelection(!0), !1;
      this.hasError = !1, this.$emit("input", this.filesSelected);
    },
    // May be called as an API method from outside - do not remove!
    resetSelection(e = !1) {
      this.filesSelected = this.fileMultiple ? [] : null, this.rerenderCounter++, this.$emit("input", this.filesSelected), this.hasError = e;
    }
  },
  expose: ["resetSelection"]
});
function aa(e, r, i, s, o, f) {
  const n = ae("DpsFormFile"), c = ae("DpsButton"), p = ae("DpsInputGroup"), a = ae("DpsFormGroup");
  return q(), W(a, {
    id: e.uniqID + "-form-group",
    class: R(["dps-upload-form-group", { "dps-upload-form-group--disabled": e.disabled }]),
    label: e.label,
    "hide-label": e.hideLabel,
    description: e.acceptedFilesDescription,
    "error-feedback": e.errorMessage,
    valid: !e.hasError,
    disabled: e.disabled
  }, {
    default: z(() => [
      ee(p, {
        id: e.uniqID + "-input-group",
        collapsed: "",
        class: "dps-upload-form-group__input-group"
      }, {
        default: z(() => [
          (q(), W(n, {
            id: e.uniqID,
            key: "file-input-" + e.rerenderCounter,
            ref: "fileInput",
            "model-value": e.filesSelected,
            accept: e.acceptedFilesAsString,
            multiple: e.fileMultiple,
            disabled: e.disabled,
            error: e.hasError,
            title: e.fileSearchTitle,
            required: e.fileRequired,
            "onUpdate:modelValue": e.handleSelectionChange
          }, null, 8, ["id", "model-value", "accept", "multiple", "disabled", "error", "title", "required", "onUpdate:modelValue"]))
        ]),
        append: z(() => [
          e.hideUploadButton ? j("", !0) : (q(), W(c, {
            key: 0,
            title: e.uploadButtonTitle ?? e.uploadButtonLabel,
            class: R(["dps-upload-form-group__upload-button", {
              "dps-upload-form-group__upload-button--error": e.hasError,
              "dps-upload-form-group__upload-button--all-disabled": e.disabled
            }]),
            squared: "",
            size: "lg",
            disabled: e.isUploadButtonDisabled,
            onClick: r[0] || (r[0] = (l) => e.$emit("upload", e.uniqID))
          }, {
            default: z(() => [
              te(G(e.uploadButtonLabel), 1)
            ]),
            _: 1
          }, 8, ["title", "class", "disabled"]))
        ]),
        _: 1
      }, 8, ["id"])
    ]),
    _: 1
  }, 8, ["id", "class", "label", "hide-label", "description", "error-feedback", "valid", "disabled"]);
}
const rl = /* @__PURE__ */ K(sa, [["render", aa]]), la = {
  name: "DpsListGroup",
  props: {
    /**
     * Adds a border around the list group.
     * @default false
     */
    bordered: {
      type: Boolean,
      default: !1,
      required: !1
    },
    /**
     * Specifies the HTML tag to use for the root element of the component.
     * @default "div"
     */
    tag: {
      type: String,
      default: "div",
      required: !1
    }
  }
}, oa = { class: "dps-list-group" }, da = {
  key: 0,
  class: "dps-list-group__counter"
};
function ca(e, r, i, s, o, f) {
  return q(), I("div", oa, [
    e.$slots.counter ? (q(), I("div", da, [
      B(e.$slots, "counter")
    ])) : j("", !0),
    (q(), W(Be(i.tag), {
      class: R(["dps-list-group__content", {
        "dps-list-group__content--bordered": i.bordered
      }])
    }, {
      default: z(() => [
        B(e.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]))
  ]);
}
const il = /* @__PURE__ */ K(la, [["render", ca]]), fa = ue({
  name: "DpsListGroupItem",
  components: { DpsBadge: ai, DpsIconButton: wr },
  props: {
    /**
     * The unique identifier for the collapsible element. This identifier is used to associate the
     * collapsible content with its corresponding trigger for accessibility and Bootstrap's collapse functionality.
     *
     * @default undefined
     */
    collapseId: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Specifies the HTML tag to use for the root element.
     * @default "div"
     */
    tag: {
      type: String,
      required: !1,
      default: "div"
    },
    /**
     * The URL that the hyperlink points to.
     * @default undefined
     */
    href: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Indicates whether the collapsible row content is initially expanded.
     * When set to true, the collapsible content will be visible by default.
     *
     * @default false
     */
    expanded: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  emits: [
    /**
     * This event is fired immediately when the show method has been called.
     */
    "show",
    /**
     * This event is fired immediately when the hide method has been called.
     */
    "hide"
  ],
  data() {
    return {
      isExpanded: !1
    };
  },
  computed: {
    uniqueId() {
      return this.collapseId ? this.collapseId : be("dps-list-group-item-");
    },
    computedTag() {
      return this.href ? "a" : this.tag;
    },
    isCollapsible() {
      return !!this.$slots["collapsible-content"];
    }
  },
  watch: {
    expanded(e) {
      this.isExpanded = e;
    }
  },
  mounted() {
    const e = this.$refs.collapsible;
    this.isExpanded = this.expanded, e && (e.addEventListener("hide.bs.collapse", () => {
      this.isExpanded = !1, this.$emit("hide");
    }), e.addEventListener("show.bs.collapse", () => {
      this.isExpanded = !0, this.$emit("show");
    }));
  },
  methods: {
    handleEnter() {
      this.isCollapsible && this.$refs.trigger.click();
    }
  }
}), ha = ["data-bs-target", "aria-controls", "aria-expanded"], pa = { class: "dps-list-group-item__collapse" }, ba = ["id"], ma = { class: "dps-list-group-item__collapsible-content" };
function ga(e, r, i, s, o, f) {
  return q(), W(Be(e.computedTag), {
    class: R(["dps-list-group-item", {
      "dps-list-group-item--collapsible": e.isCollapsible,
      "dps-list-group-item--expanded": e.isCollapsible && e.isExpanded
    }]),
    href: e.href
  }, {
    default: z(() => [
      e.isCollapsible ? (q(), I(oe, { key: 0 }, [
        $("div", {
          ref: "trigger",
          class: "dps-list-group-item__trigger",
          "data-bs-toggle": "collapse",
          "data-bs-target": "#" + e.uniqueId,
          "aria-controls": e.uniqueId,
          "aria-expanded": e.expanded,
          tabindex: "0",
          role: "button",
          onKeydown: r[0] || (r[0] = ve((...n) => e.handleEnter && e.handleEnter(...n), ["enter"]))
        }, [
          B(e.$slots, "default")
        ], 40, ha),
        $("div", pa, [
          $("div", {
            id: e.uniqueId,
            ref: "collapsible",
            class: R(["collapse", { show: e.expanded }])
          }, [
            $("div", ma, [
              B(e.$slots, "collapsible-content")
            ])
          ], 10, ba)
        ])
      ], 64)) : B(e.$slots, "default", { key: 1 })
    ]),
    _: 3
  }, 8, ["class", "href"]);
}
const nl = /* @__PURE__ */ K(fa, [["render", ga]]), ya = ue({
  name: "DpsTableRow",
  props: {
    /**
     * The unique identifier for the collapsible element. This identifier is used to associate the
     * collapsible content with its corresponding trigger for accessibility and Bootstrap's collapse functionality.
     * @default undefined
     */
    collapseId: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * The number of columns the collapsible content should span when expanded.
     * This controls the width of the collapsible content.
     *
     * @default undefined
     */
    collapseColspan: {
      type: Number,
      required: !1,
      default: void 0
    },
    /**
     * The starting position (column index) where the collapsible content should be displayed.
     * This can be used to create an offset within the row.
     *
     * @default 0
     */
    collapseColstart: {
      type: Number,
      required: !1,
      default: 0
    },
    /**
     * Indicates whether the collapsible row content is initially expanded.
     * When set to true, the collapsible content will be visible by default.
     *
     * @default false
     */
    expanded: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  emits: [
    /**
     * This event is fired immediately when the show method has been called.
     */
    "show",
    /**
     * This event is fired immediately when the hide method has been called.
     */
    "hide"
  ],
  data() {
    return {
      isExpanded: !1
    };
  },
  computed: {
    uniqueId() {
      return this.collapseId ? this.collapseId : be("dps-table-row-");
    },
    isCollapsible() {
      return !!this.$slots["collapsible-content"];
    }
  },
  watch: {
    expanded(e) {
      this.isExpanded = e;
    }
  },
  mounted() {
    const e = this.$refs.collapsible;
    this.isExpanded = this.expanded, e && (e.addEventListener("hide.bs.collapse", () => {
      this.isExpanded = !1, this.$emit("hide");
    }), e.addEventListener("show.bs.collapse", () => {
      this.isExpanded = !0, this.$emit("show");
    }));
  },
  methods: {
    handleEnter() {
      this.isCollapsible && this.$refs.mainElement.click();
    }
  }
}), va = ["data-bs-toggle", "data-bs-target", "aria-expanded", "aria-controls", "tabindex", "role"], wa = {
  key: 0,
  class: "dps-table-row dps-table-row--collapse"
}, Sa = ["colspan"], xa = ["colspan"], Ea = ["id"], Aa = { class: "dps-table-row__collapsible-content" };
function ka(e, r, i, s, o, f) {
  return q(), I(oe, null, [
    $("tr", {
      ref: "mainElement",
      class: R(["dps-table-row", {
        "dps-table-row--collapsible": e.isCollapsible,
        "dps-table-row--expanded": e.isCollapsible && e.isExpanded
      }]),
      "data-bs-toggle": e.isCollapsible ? "collapse" : void 0,
      "data-bs-target": e.isCollapsible ? "#" + e.uniqueId : void 0,
      "aria-expanded": e.isCollapsible ? e.expanded : void 0,
      "aria-controls": e.isCollapsible ? e.uniqueId : void 0,
      tabindex: e.isCollapsible ? "0" : void 0,
      role: e.isCollapsible ? "button" : void 0,
      onKeydown: r[0] || (r[0] = ve((...n) => e.handleEnter && e.handleEnter(...n), ["enter"]))
    }, [
      B(e.$slots, "default")
    ], 42, va),
    e.isCollapsible ? (q(), I("tr", wa, [
      e.collapseColstart > 0 ? (q(), I("td", {
        key: 0,
        colspan: e.collapseColstart
      }, null, 8, Sa)) : j("", !0),
      $("td", { colspan: e.collapseColspan }, [
        $("div", {
          id: e.uniqueId,
          ref: "collapsible",
          class: R(["collapse", { show: e.expanded }])
        }, [
          $("div", Aa, [
            B(e.$slots, "collapsible-content")
          ])
        ], 10, Ea)
      ], 8, xa)
    ])) : j("", !0)
  ], 64);
}
const qa = /* @__PURE__ */ K(ya, [["render", ka]]), Ta = ue({
  name: "DpsTable",
  components: { DpsTableRow: qa, DpsFormCheckbox: Zt },
  props: {
    /**
     * An array of field definition objects, each defining the properties of a table column.
     *
     * @default []
     */
    fields: {
      type: Array,
      default() {
        return [];
      }
    },
    /**
     * An array of data objects to be displayed in the table rows.
     * Each object should match the structure defined by the `fields` array.
     *
     * @default []
     */
    items: {
      type: Array,
      default() {
        return [];
      }
    },
    /**
     * Whether to hide the table header while keeping it accessible for screen readers.
     * This is useful for visually minimalist tables while maintaining accessibility.
     *
     * @default false
     */
    hideHeader: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * The key  of the field currently being used for sorting the table.
     * Should correspond to one of the `key` values defined in the `fields` array.
     *
     * @default undefined
     */
    sortBy: {
      type: String,
      required: !1,
      default: void 0
    },
    /**
     * Indicates whether the sorting is in descending order.
     * When set to `true`, the table will be sorted in descending order; otherwise, it will be in ascending order.
     *
     * @default false
     */
    sortDesc: {
      type: Boolean,
      required: !1,
      default: !1
    },
    /**
     * The starting column index where the collapsible content should be displayed.
     * This can create an offset within the table row for the collapsible section.
     *
     * @default undefined
     */
    collapseColstart: {
      type: Number,
      required: !1,
      default: void 0
    },
    /**
     * The number of columns the collapsible content should span when expanded.
     * Determines the width of the collapsible content section.
     *
     * @default undefined
     */
    collapseColspan: {
      type: Number,
      required: !1,
      default: void 0
    }
  },
  emits: [
    /**
     * Emitted when the sortBy property changes.
     *
     * @event update:sort-by
     * @property {string} - The key of the field being sorted. Corresponds to the `key` property in the `fields` array.
     */
    "update:sort-by",
    /**
     * Emitted when the sortDesc property changes.
     *
     * @event update:sort-desc
     * @property {boolean} - Indicates the sort direction. `true` for descending order, `false` for ascending order.
     */
    "update:sort-desc",
    /**
     * Emitted when the status of a header checkbox changes.
     *
     * @event change-checked
     * @property {number} - The key of the field whose checkbox status was changed.
     */
    "change-checked"
  ],
  data() {
    return {
      isScrollable: !1,
      isScrolledToRight: !1,
      isScrolledToLeft: !0
    };
  },
  computed: {
    hasCustomTemplate() {
      return !!this.$slots["table-row"];
    },
    stickyColumns() {
      return this.fields.reduce((e, r, i) => (r.sticky && e.push(i), e), []);
    },
    sortedItems() {
      const e = this.fields.map((i) => i.key);
      if (this.sortBy === void 0 || !e.includes(this.sortBy))
        return this.items;
      const r = (i) => {
        const s = new Date(i);
        return !isNaN(s.getTime());
      };
      return this.items.slice().sort((i, s) => {
        const o = this.sortBy, f = i[o], n = s[o];
        if (r(f) && r(n)) {
          const a = String(f), l = String(n);
          return this.sortDesc ? new Date(l).getTime() - new Date(a).getTime() : new Date(a).getTime() - new Date(l).getTime();
        }
        const c = (f || "").toString().toLowerCase(), p = (n || "").toString().toLowerCase();
        return this.sortDesc ? p.localeCompare(c) : c.localeCompare(p);
      });
    },
    ariaSort() {
      return this.fields.reduce(
        (e, r) => (e[r.key] = r.sortable ? this.sortBy === r.key ? this.sortDesc ? "descending" : "ascending" : "none" : void 0, e),
        {}
      );
    }
  },
  watch: {
    items: {
      handler() {
        Rr(this.setStickyStyles);
      },
      deep: !0
    },
    isScrollable() {
      this.setStickyStyles();
    }
  },
  mounted() {
    this.observeTableWidth(), this.observeScrollPos();
  },
  methods: {
    updateSorting(e) {
      e.sortable && (e.key !== this.sortBy ? (this.$emit("update:sort-by", e.key), this.$emit("update:sort-desc", !1)) : this.$emit("update:sort-desc", !this.sortDesc));
    },
    observeTableWidth() {
      const e = this.$refs.table, r = this.$refs.tableWrapper, i = new ResizeObserver(() => {
        e.clientWidth && r.clientWidth && (this.isScrollable = e.clientWidth > r.clientWidth);
      });
      i.observe(r), i.observe(e);
    },
    observeScrollPos() {
      const e = this.$refs.tableWrapper;
      e.addEventListener("scroll", () => {
        this.isScrolledToRight = e.scrollWidth - e.scrollLeft - e.clientWidth < 2, this.isScrolledToLeft = e.scrollLeft < 2;
      });
    },
    setStickyStyles() {
      const e = this.$refs.table, r = this.$refs.tableWrapper;
      if (this.stickyColumns.length === 0)
        return;
      r.scrollLeft = 0;
      const i = e.querySelectorAll("tr");
      for (const s of Array.from(i)) {
        const o = s.querySelectorAll("th, td");
        for (const [f, n] of Array.from(o).entries())
          n.style.removeProperty("left"), n.removeAttribute("data-sticky"), this.stickyColumns.includes(+f) && (n.setAttribute("data-sticky", ""), n.style.left = +f !== this.stickyColumns[0] ? `${o[f - 1].getBoundingClientRect().width + 1}px` : `${n.offsetLeft}px`);
      }
    }
  }
}), Da = {
  ref: "tableWrapper",
  class: "table-responsive"
}, Ca = {
  ref: "table",
  class: "table"
}, Oa = ["title", "aria-colindex", "aria-sort", "tabindex", "onClick"], Pa = {
  key: 1,
  class: "dps-table__header-label"
}, La = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  width: "16",
  height: "17",
  viewBox: "0 0 16 17",
  fill: "none"
}, Ia = ["fill"], Na = ["fill"];
function _a(e, r, i, s, o, f) {
  const n = ae("DpsFormCheckbox"), c = ae("DpsTableRow");
  return q(), I("div", {
    class: R(["dps-table", {
      "dps-table--scroll-shadow-right": e.isScrollable && !e.isScrolledToRight,
      "dps-table--scroll-shadow-left": e.isScrollable && !e.isScrolledToLeft,
      "dps-table--sticky": e.stickyColumns.length > 0
    }])
  }, [
    $("div", Da, [
      $("table", Ca, [
        $("thead", {
          class: R({ "visually-hidden": e.hideHeader })
        }, [
          $("tr", null, [
            (q(!0), I(oe, null, Ae(e.fields, (p, a) => (q(), I("th", {
              key: "th-" + a,
              class: R(p.class),
              title: p.sortable ? `Reihenfolge der Spalte "${p.label}" ändern` : void 0,
              scope: "col",
              "aria-colindex": a + 1,
              "aria-sort": e.ariaSort[p.key],
              tabindex: p.sortable ? "0" : void 0,
              onClick: (l) => e.updateSorting(p)
            }, [
              p.checkbox ? (q(), W(n, {
                key: 0,
                modelValue: p.checkboxChecked,
                "onUpdate:modelValue": [(l) => p.checkboxChecked = l, (l) => e.$emit("change-checked", a)],
                tooltip: p.label,
                "hide-label": !0,
                disabled: p.checkboxDisabled
              }, {
                default: z(() => [
                  te(G(p.label), 1)
                ]),
                _: 2
              }, 1032, ["modelValue", "onUpdate:modelValue", "tooltip", "disabled"])) : (q(), I("div", Pa, [
                te(G(p.label) + " ", 1),
                p.sortable ? (q(), I("svg", La, [
                  $("path", {
                    "fill-rule": "evenodd",
                    "clip-rule": "evenodd",
                    d: "M4.19526 6.0286C3.93491 6.28895 3.93491 6.71106 4.19526 6.97141C4.45561 7.23175 4.87772 7.23175 5.13807 6.97141L8 4.10948L10.8619 6.97141C11.1223 7.23175 11.5444 7.23176 11.8047 6.97141C12.0651 6.71106 12.0651 6.28895 11.8047 6.0286L8.47141 2.69526C8.34638 2.57024 8.17681 2.5 8 2.5C7.82319 2.5 7.65362 2.57024 7.5286 2.69526L4.19526 6.0286Z",
                    fill: e.sortBy === p.key && !e.sortDesc ? "#04071A" : "#C8CACC"
                  }, null, 8, Ia),
                  $("path", {
                    "fill-rule": "evenodd",
                    "clip-rule": "evenodd",
                    d: "M11.8047 10.9714C12.0651 10.7111 12.0651 10.289 11.8047 10.0286C11.5444 9.76829 11.1223 9.76829 10.8619 10.0286L8 12.8906L5.13807 10.0286C4.87772 9.76829 4.45561 9.76829 4.19526 10.0286C3.93491 10.289 3.93491 10.7111 4.19526 10.9714L7.5286 14.3048C7.78895 14.5651 8.21106 14.5651 8.47141 14.3048L11.8047 10.9714Z",
                    fill: e.sortBy === p.key && e.sortDesc ? "#04071A" : "#C8CACC"
                  }, null, 8, Na)
                ])) : j("", !0)
              ]))
            ], 10, Oa))), 128))
          ])
        ], 2),
        $("tbody", null, [
          e.hasCustomTemplate ? (q(!0), I(oe, { key: 0 }, Ae(e.sortedItems, (p, a) => (q(), W(c, {
            key: "table-row-" + a,
            "collapse-colspan": e.collapseColspan ?? e.fields.length,
            "collapse-colstart": e.collapseColstart
          }, Qt({
            default: z(() => [
              B(e.$slots, "table-row", { content: p })
            ]),
            _: 2
          }, [
            e.$slots["table-row-collapsible-content"] ? {
              name: "collapsible-content",
              fn: z(() => [
                B(e.$slots, "table-row-collapsible-content", { content: p })
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["collapse-colspan", "collapse-colstart"]))), 128)) : (q(!0), I(oe, { key: 1 }, Ae(e.sortedItems, (p, a) => (q(), I("tr", { key: a }, [
            (q(!0), I(oe, null, Ae(e.fields, (l, h) => (q(), I("td", {
              key: a + "-" + h
            }, G(p[l.key] ?? "-"), 1))), 128))
          ]))), 128))
        ])
      ], 512)
    ], 512)
  ], 2);
}
const sl = /* @__PURE__ */ K(Ta, [["render", _a]]), $a = ue({
  name: "DpsLoadingSpinner",
  props: {
    /**
     * Aria label for the spinner.
     * @default undefined
     */
    ariaLabel: {
      type: String,
      required: !1,
      default: "Laden"
    }
  }
}), Ma = ["aria-label"], Ba = /* @__PURE__ */ $("span", { class: "dps-icon dps-icon--ladeanimation" }, null, -1);
function Ra(e, r, i, s, o, f) {
  return q(), I("div", {
    class: "dps-loading-spinner align-content-center d-flex gap-2",
    "aria-busy": "true",
    "aria-label": e.ariaLabel
  }, [
    B(e.$slots, "default"),
    Ba
  ], 8, Ma);
}
const al = /* @__PURE__ */ K($a, [["render", Ra]]);
function ll(e) {
  const r = e.querySelectorAll("[data-sticky]");
  for (const i of Array.from(r)) {
    const { width: s, height: o } = i.getBoundingClientRect(), f = i.closest("tr");
    i.style.width = `${s}px`, i.style.minWidth = `${s}px`, i.style.height = `${o}px`, f && (f.style.height = `${o}px`);
  }
}
window.Bootstrap = Mr;
export {
  Ua as DpsActionMenu,
  Ha as DpsActionMenuItem,
  Es as DpsAlert,
  za as DpsAlphabeticFilter,
  ai as DpsBadge,
  rt as DpsButton,
  Ga as DpsCollapsible,
  Ai as DpsFilterButton,
  Zt as DpsFormCheckbox,
  Ya as DpsFormCheckboxGroup,
  ul as DpsFormDatepicker,
  $s as DpsFormFile,
  Lr as DpsFormGroup,
  Wa as DpsFormInput,
  Tn as DpsFormRadio,
  Ka as DpsFormRadioGroup,
  _r as DpsFormSelect,
  Ja as DpsFormTextarea,
  el as DpsFormToggle,
  wr as DpsIconButton,
  Cs as DpsInputGroup,
  Xa as DpsLink,
  il as DpsListGroup,
  nl as DpsListGroupItem,
  al as DpsLoadingSpinner,
  tl as DpsLogoutAlert,
  Za as DpsPagination,
  Qa as DpsSortSelect,
  sl as DpsTable,
  qa as DpsTableRow,
  rl as DpsUploadFormGroup,
  be as getUniqueId,
  ll as setStickyColumnStyles
};
