<template>
  <div
    id="polar-plugin-scales"
    :title="$t('common:plugins.scale.label')"
    :aria-label="$t('common:plugins.scale.label')"
  >
    <span class="scale-as-a-ratio">
      {{ scaleToOne }}
    </span>
    <span class="scale-line">
      {{ scaleWithUnit }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'PolarScale',
  computed: {
    ...mapGetters('plugin/scale', ['scaleToOne', 'scaleWithUnit']),
  },
})
</script>

<style lang="scss">
#polar-plugin-scales {
  display: flex;
  flex-direction: row;

  text-align: center;
  font-size: 14px;
  gap: 4px;
  margin: 4px;

  > span {
    background: #ffffffcc;
    border-radius: 2px;
    border-width: 0px 2px 2px 2px;
    border-style: solid;
  }

  .scale-line {
    display: inline-block;
    border-color: black;

    width: 2cm;
  }

  .scale-as-a-ratio {
    display: inline-block;
    white-space: nowrap;
    /* keeping border so texts align well */
    border-color: transparent;

    padding-left: 1em;
    padding-right: 1em;
  }

  @media only screen and (max-width: 768px) {
    flex-direction: column-reverse;
  }
}
</style>
