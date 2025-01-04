import { defineStore } from "pinia";
import type { NewTodo } from "~/src/types/stores/HomePage/ShowModalStore";
import type Todo from "~/src/types/stores/TodoStore/Todo";
import type CurrentDate from "~/src/types/stores/DateStore/Date";

export const useTodoStore = defineStore("todoStore", {
  state: () => ({
    todoList: [] as Todo[],
  }),
  getters: {
    getTodoList: (state) => state.todoList,
    getTodosByDate: (state) => (date: CurrentDate) => {
      return state.todoList.filter(
        (todo) =>
          todo.year === date.fullYear &&
          todo.month === date.month &&
          todo.day === date.day
      );
    },
  },
  actions: {
    addTodoList(payload: NewTodo, date: CurrentDate) {
      this.todoList.push({
        id: this.todoList.length + 1,
        title: payload.title,
        description: payload.description,
        points: payload.points,
        completed: false,
        year: date.fullYear,
        month: date.month,
        day: date.day,
      });
    },
    changeTodoIsCompleted(payload: { id: number }) {
      const todo = this.todoList.find((todo) => todo.id === payload.id);
      if (todo) todo.completed = !todo.completed;
    },
    getOneTodo(payload: { id: number }) {
      return this.todoList.find((todo) => todo.id === payload.id);
    },
    deleteTodo(payload: { id: number }) {
      this.todoList = this.todoList.filter((todo) => todo.id !== payload.id);
    },
  },
});
