<script setup lang="ts">
import { useRoute } from "vue-router";
import "primeicons/primeicons.css";
import { useDayStore } from "~/src/stores/DayStore";
import { useDateStore } from "~/src/stores/DateStore/Date";
import { useShowModalStore } from "~/src/stores/HomePage/ShowModalStore";
import { useTodoStore } from "~/src/stores/TodoStore";
import { watch, computed } from "vue";

interface Todo {
  id: number;
  title: string;
  description: string;
  points: number;
  completed: boolean;
}

// Store instantiation
const dayStore = useDayStore();
const dateStore = useDateStore();
const showModalStore = useShowModalStore();
const todoStore = useTodoStore();
const route = useRoute();

// Computed properties
const currentTodos = computed(() =>
  todoStore.getTodosByDate(dateStore.getDate)
);

const formattedDate = computed(() => ({
  year: dateStore.getFullYear,
  month: dateStore.getMonth,
  day: dateStore.getDay,
}));

// Watch route parameters for date changes
watch(
  () => route.params,
  () => {
    const { year, month, day } = route.params;
    try {
      const parsedYear = parseYear(String(year));
      dateStore.setCurrentDate({
        fullYear: parsedYear,
        month: parseInt(String(month)),
        day: parseInt(String(day)),
      });
    } catch (error) {
      console.error("Invalid date parameters:", error);
      // Redirect to current date or show error message
    }
  },
  { immediate: true }
);

// Helper functions
function parseYear(yearStr: string): number {
  const parsedYear = parseInt(yearStr);

  if (parsedYear < 100) {
    return parsedYear + (parsedYear < 50 ? 2000 : 1900);
  }

  if (parsedYear < 1950 || parsedYear > 2050) {
    throw new Error("Year must be between 1950 and 2050");
  }

  return parsedYear;
}

// Action handlers
const addTodo = () => {
  const newTodo = showModalStore.getNewTodo;

  if (!newTodo.title.trim()) {
    alert("Title is required!");
    return;
  }

  todoStore.addTodoList(newTodo, dateStore.getDate);
  showModalStore.setShowModal(false);
  showModalStore.resetNewTodo();
};

const changeCompleteTodo = (id: number) => {
  const todo = todoStore.getOneTodo({ id });
  if (!todo) return;

  todoStore.changeTodoIsCompleted({ id });
  dayStore.changeCompleteTodo(id);

  if (todo.points) {
    dayStore.changePoints(todo.points);
  }
};

const deleteTodo = async (id: number) => {
  await todoStore.deleteTodo({ id });
};

const closeModal = () => {
  showModalStore.setShowModal(false);
  showModalStore.resetNewTodo();
};
</script>

<template>
  <main>
    <header>
      <h1>Todo App</h1>
      <nav>
        <NuxtLink to="/settings" class="settings-link">Settings</NuxtLink>
      </nav>
    </header>

    <section class="content">
      <h2>
        Date: {{ formattedDate.year }}/{{ formattedDate.month }}/{{
          formattedDate.day
        }}
      </h2>

      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">Points:</span>
          <span class="stat-value">{{ dayStore.getTotalPoints }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Completed:</span>
          <span class="stat-value">{{ dayStore.getCompletedTodos }}</span>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="todo-header">
        <h2>Todo List</h2>
        <button
          class="add-button"
          title="Add Todo"
          @click="showModalStore.setShowModal(true)"
        >
          <i class="pi pi-plus-circle"></i>
        </button>
      </div>

      <TransitionGroup name="list" tag="ul" class="todo-list">
        <li
          v-for="todo in currentTodos"
          :key="todo.id"
          :class="['todo-item', { completed: todo.completed }]"
        >
          <div class="todo-content">
            <h3>{{ todo.title }}</h3>
            <p class="description">{{ todo.description }}</p>
            <p class="points">Points: {{ todo.points }}</p>
          </div>

          <div class="buttons">
            <button
              class="complete-button"
              @click="changeCompleteTodo(todo.id)"
              :disabled="todo.completed"
            >
              {{ todo.completed ? "Completed" : "Complete" }}
            </button>
            <button class="delete-button" @click="deleteTodo(todo.id)">
              Delete
            </button>
          </div>
        </li>
      </TransitionGroup>

      <p v-if="currentTodos.length === 0" class="empty-state">
        No todos for today. Add one to get started!
      </p>
    </section>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModalStore.getShowModal" class="modal">
          <div class="modal-content">
            <h3>Add New Todo</h3>
            <form @submit.prevent="addTodo">
              <div class="form-group">
                <label for="title">Title:</label>
                <input
                  id="title"
                  v-model="showModalStore.getNewTodo.title"
                  type="text"
                  placeholder="Enter todo title"
                  required
                />
              </div>

              <div class="form-group">
                <label for="description">Description:</label>
                <textarea
                  id="description"
                  v-model="showModalStore.getNewTodo.description"
                  placeholder="Enter todo description"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label for="points">Points:</label>
                <input
                  id="points"
                  v-model.number="showModalStore.getNewTodo.points"
                  type="number"
                  min="0"
                  placeholder="Enter points"
                />
              </div>

              <div class="modal-actions">
                <button type="button" @click="closeModal">Cancel</button>
                <button type="submit">Add Todo</button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<style lang="scss">
:root {
  --primary-color: #007acc;
  --danger-color: #dc3545;
  --success-color: #28a745;
  --background-color: #f9f9f9;
  --border-color: #e0e0e0;
  --text-color: #333;
  --shadow-color: rgba(0, 0, 0, 0.1);
}

* {
  font-family: "Nunito", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: 16px;
  line-height: 1.6;
  padding: 20px;
}

main {
  max-width: 800px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px var(--shadow-color);
  padding: 24px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--border-color);
  margin-bottom: 24px;

  h1 {
    font-size: 28px;
    color: var(--primary-color);
    font-weight: 600;
  }
}

.settings-link {
  font-size: 18px;
  color: var(--primary-color);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 122, 204, 0.1);
  }
}

.content {
  margin-bottom: 24px;
}

.stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #f0f8ff;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 2px 4px var(--shadow-color);
}

.stat-item {
  text-align: center;

  .stat-label {
    font-size: 16px;
    color: var(--text-color);
    margin-right: 8px;
  }

  .stat-value {
    font-size: 20px;
    font-weight: 600;
    color: var(--primary-color);
  }
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    font-size: 24px;
    font-weight: 600;
  }
}

.add-button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--primary-color);
  font-size: 24px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
}

.todo-list {
  list-style: none;
}

.todo-item {
  background: #ffffff;
  margin-bottom: 12px;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px var(--shadow-color);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px var(--shadow-color);
  }

  &.completed {
    background: #d4edda;
    border-color: var(--success-color);

    h3 {
      text-decoration: line-through;
      color: #155724;
    }
  }

  .todo-content {
    margin-bottom: 12px;

    h3 {
      font-size: 18px;
      margin-bottom: 8px;
      color: var(--text-color);
    }

    .description {
      color: #666;
      margin-bottom: 8px;
    }

    .points {
      font-weight: 600;
      color: var(--primary-color);
    }
  }
}

.buttons {
  display: flex;
  gap: 10px;

  button {
    flex: 1;
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(1px);
    }
  }

  .complete-button {
    background: var(--primary-color);
    color: white;

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }

  .delete-button {
    background: var(--danger-color);
    color: white;
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

  h3 {
    font-size: 24px;
    margin-bottom: 20px;
    color: var(--text-color);
  }
}

.form-group {
  margin-bottom: 16px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }

  input,
  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 16px;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;

    &:first-child {
      background: #ccc;
      color: white;
    }

    &:last-child {
      background: var(--primary-color);
      color: white;
    }

    &:hover {
      transform: translateY(-1px);
      filter: brightness(110%);
    }
  }
}

// Transitions
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.empty-state {
  text-align: center;
  color: #666;
  padding: 40px 0;
  font-style: italic;
}

@media (max-width: 600px) {
  main {
    padding: 16px;
  }

  .stats {
    flex-direction: column;
    gap: 16px;
  }

  .buttons {
    flex-direction: column;
  }

  .modal-content {
    padding: 16px;
    margin: 16px;
  }

  .todo-header {
    h2 {
      font-size: 20px;
    }
  }

  .todo-item {
    padding: 12px;

    h3 {
      font-size: 16px;
    }
  }
}

// Accessibility improvements
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

// Dark mode support
@media (prefers-color-scheme: dark) {
  :root {
    --primary-color: #0099ff;
    --danger-color: #ff4d4d;
    --success-color: #2ecc71;
    --background-color: #1a1a1a;
    --border-color: #333;
    --text-color: #fff;
    --shadow-color: rgba(0, 0, 0, 0.3);
  }

  body {
    background-color: #121212;
  }

  main {
    background: #1e1e1e;
  }

  .todo-item {
    background: #262626;

    &.completed {
      background: #1b3320;
    }

    .description {
      color: #bbb;
    }
  }

  .modal-content {
    background: #262626;
  }

  input,
  textarea {
    background: #333;
    color: #fff;

    &::placeholder {
      color: #888;
    }
  }

  .stats {
    background-color: #262626;
  }

  .empty-state {
    color: #888;
  }
}

// Print styles
@media print {
  body {
    background: none;
    color: black;
  }

  main {
    box-shadow: none;
    max-width: none;
    margin: 0;
  }

  .buttons,
  .add-button,
  .settings-link {
    display: none;
  }

  .todo-item {
    break-inside: avoid;
    border: 1px solid #ccc;
    margin-bottom: 10px;
    page-break-inside: avoid;
  }
}

// Focus styles
:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}

// Custom scrollbar
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--background-color);
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #005999;
}

// Loading state
.loading {
  opacity: 0.7;
  pointer-events: none;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 24px;
    height: 24px;
    margin: -12px;
    border: 2px solid var(--primary-color);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// Error state
.error {
  border-color: var(--danger-color);
  animation: shake 0.5s linear;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

// Success feedback
.success-feedback {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--success-color);
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
