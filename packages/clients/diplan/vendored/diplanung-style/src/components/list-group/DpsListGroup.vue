<script>
  export default {
    name: "DpsListGroup",
    props: {
      /**
       * Adds a border around the list group.
       * @default false
       */
      bordered: {
        type: Boolean,
        default: false,
        required: false,
      },
      /**
       * Specifies the HTML tag to use for the root element of the component.
       * @default "div"
       */
      tag: {
        type: String,
        default: "div",
        required: false,
      },
    },
  };
</script>

<template>
  <div class="dps-list-group">
    <div v-if="$slots.counter" class="dps-list-group__counter">
      <!-- @slot counter - Counter content -->
      <slot name="counter" />
    </div>
    <component
      :is="tag"
      class="dps-list-group__content"
      :class="{
        'dps-list-group__content--bordered': bordered,
      }"
    >
      <!-- @slot default - List group content -->
      <slot />
    </component>
  </div>
</template>
