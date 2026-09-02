<script>
  import { defineComponent } from "vue";
  import DpsAlert from "@/components/alert/DpsAlert.vue";
  import DpsButton from "@/components/button/DpsButton.vue";

  export default defineComponent({
    name: "DpsLogoutAlert",
    components: { DpsButton, DpsAlert },
    props: {
      /**
       * Defines when the current session expires (UNIX timestamp in seconds)
       */
      expirationTime: {
        type: Number,
        required: true,
      },
      /**
       * Defines how many minutes before the logout the alert should be visible
       * @default 3
       */
      threshold: {
        type: Number,
        default: 3,
        required: false,
      },
    },
    emits: [
      /**
       * Emitted when the user clicks the "Neu anmelden" button
       */
      "click",
    ],
    data() {
      return {
        interval: null,
        minutesToLogout: null,
      };
    },
    computed: {
      showLogoutAlert() {
        return this.minutesToLogout <= this.threshold;
      },
    },
    watch: {
      expirationTime() {
        this.startInterval();
      },
    },
    created() {
      this.startInterval();
    },
    beforeUnmount() {
      clearInterval(this.interval);
    },
    methods: {
      startInterval() {
        this.setMinutesToLogout();

        clearInterval(this.interval);

        if (this.minutesToLogout > 0) {
          this.interval = setInterval(this.setMinutesToLogout, 1000);
        }
      },
      setMinutesToLogout() {
        const expirationTime = this.expirationTime * 1000;
        const currentTime = Date.now();
        const timeRemaining = expirationTime - currentTime;

        this.minutesToLogout = Math.ceil(timeRemaining / 1000 / 60);

        if (this.minutesToLogout <= 0) {
          clearInterval(this.interval);
        }
      },
      handleClick() {
        this.$emit("click");
      },
    },
  });
</script>

<template>
  <DpsAlert v-if="showLogoutAlert" variant="info" class="dps-logout-alert">
    <div>
      <b>Hinweis:</b>

      Aus Sicherheitsgründen werden Sie in

      <b>
        <template v-if="minutesToLogout > 0">
          {{ minutesToLogout }} {{ minutesToLogout === 1 ? "Minute" : "Minuten" }}
        </template>
        <template v-else>Kürze</template>

        automatisch ausgeloggt.
      </b>

      Bitte melden Sie sich anschließend erneut an.
    </div>

    <DpsButton
      class="dps-logout-alert__logout-button"
      variant="secondary"
      size="sm"
      @click="handleClick"
    >
      Neu anmelden
    </DpsButton>
  </DpsAlert>
</template>
