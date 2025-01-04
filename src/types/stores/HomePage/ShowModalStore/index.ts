export interface NewTodo {
  title: string;
  description: string;
  points: number;
}

export default interface ShowModal {
  showModal: boolean;
  newTodo: NewTodo;
}