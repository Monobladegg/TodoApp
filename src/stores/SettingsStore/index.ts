import { defineStore } from "pinia";
import type Settings from "~/src/types/stores/SettingsStore/Settings";

export const useSettingsStore = defineStore("settingsStore", {
  state: () => ({
    settings: {
      showPoints: true,
      showCompleted: true,
    } as Settings,
  }),
  getters: {
    getSettings: (state) => state.settings,
  },
  actions: {
    changeShowPoints(showPoints: boolean) {
      this.settings.showPoints = showPoints;
    },
    changeShowCompleted(showCompleted: boolean) {
      this.settings.showCompleted = showCompleted;
    },
  },
});
