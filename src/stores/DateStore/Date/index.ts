import { defineStore } from "pinia";
import type CurrentDate from "~/src/types/stores/DateStore/Date";

export const useDateStore = defineStore("dateStore", {
  state: () => ({
    date: { fullYear: 0, month: 0, day: 0 } as CurrentDate,
  }),
  getters: {
    getDate: (state) => state.date,
    getFullYear: (state) => state.date.fullYear,
    getMonth: (state) => state.date.month,
    getDay: (state) => state.date.day,
  },
  actions: {
    setCurrentDate(date: CurrentDate) {
      this.date = date;
    },
  },
});
