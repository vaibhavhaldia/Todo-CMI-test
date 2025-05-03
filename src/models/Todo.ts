/**
 * Represents the Todo item as returned from the API
 */
export interface TodoDTO {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

/**
 * Represents our application's Todo domain model with additional metadata
 */
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string | Date;
}

/**
 * Represents the parameters required to create a new Todo
 */
export interface CreateTodoParams {
  title: string;
}

/**
 * Represents the filter options for Todo items
 */
export type TodoFilterOption = 'all' | 'active' | 'done';

/**
 * Represents the sort options for Todo items
 */
export type TodoSortOption = 'id' | 'recent';

/**
 * Factory function to convert a TodoDTO to our domain Todo model
 */
export function todoFromDTO(dto: TodoDTO): Todo {
  const now = new Date().toISOString();
  return {
    id: dto.id,
    title: dto.title,
    completed: dto.completed,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Factory function to create a new Todo item
 */
export function createTodo(params: CreateTodoParams, id: number): Todo {
  const now = new Date().toISOString();
  return {
    id,
    title: params.title,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
}
