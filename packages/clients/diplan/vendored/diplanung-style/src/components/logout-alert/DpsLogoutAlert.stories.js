import { ref } from "vue";

import DpsLogoutAlert from "@/components/logout-alert/DpsLogoutAlert.vue";
import DpsButton from "@/components/button/DpsButton.vue";

const meta = {
  title: "Vue/LogoutAlert",
  component: DpsLogoutAlert,
  argTypes: {},
  render: (args) => ({
    components: { DpsLogoutAlert, DpsButton },
    setup() {
      const expirationTime = ref(args.expirationTime || 0);
      const threshold = ref(args.threshold || 3);

      const setBeforeExpiration = () => {
        expirationTime.value = Date.now() / 1000 + 10;
      };

      const setBeforeThreshold = () => {
        expirationTime.value = Date.now() / 1000 + threshold.value * 60 + 10;
      };

      const setThreshold = () => {
        expirationTime.value = Date.now() / 1000 + threshold.value * 60;
      };

      setThreshold();

      return { args, setBeforeExpiration, setBeforeThreshold, setThreshold, expirationTime };
    },
    template: `
      <DpsLogoutAlert v-bind="args" :expiration-time="expirationTime" />

      <div style="
        display: flex; 
        gap: 8px; 
        padding-top: 16px; 
        border-top: 2px solid #aaa; 
        margin-top: 64px
      ">
        <DpsButton variant="secondary" size="sm" squared @click="setBeforeExpiration">Expiration in 10s</DpsButton>
        <DpsButton variant="secondary" size="sm" squared @click="setBeforeThreshold">Threshold in 10s</DpsButton>
        <DpsButton variant="secondary" size="sm" squared @click="setThreshold">Threshold now</DpsButton>
      </div>
    `,
  }),
};

export default meta;

export const Default = {
  args: {},
};

export const Threshold = {
  args: {
    threshold: 1000,
  },
};
