import { defineStore } from "pinia";
import type Day from "~/src/types/stores/DayStore/Day";

export const useDayStore = defineStore("dayStore", {
  state: () => ({
    day: {
      points: 0,
      completeTodo: 0,
    } as Day,
  }),
  getters: {
    getDay: (state) => state.day,
    getTotalPoints: (state) => state.day.points,
    getCompletedTodos: (state) => state.day.completeTodo,
  },
  actions: {
    changePoints(points: number) {
      this.day.points = points;
    },
    changeCompleteTodo(completeTodo: number) {
      this.day.completeTodo = completeTodo;
    },
  },
});
