import { defineStore } from "pinia";
import type { NewTodo } from "~/src/types/stores/HomePage/ShowModalStore";

export const useShowModalStore = defineStore("showModalStore", {
  state: () => ({
    showModal: false,
    newTodo: { title: "", description: "", points: 0 },
  }),
  getters: {
    getShowModal: (state) => state.showModal,
    getNewTodo: (state) => state.newTodo,
  },
  actions: {
    setShowModal(showModal: boolean) {
      this.showModal = showModal;
    },
    setNewTodo(newTodo: NewTodo) {
      this.newTodo = newTodo;
    },
    resetNewTodo() {
      this.newTodo = { title: "", description: "", points: 0 };
    },
  },
});
