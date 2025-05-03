import { TodoDTO, todoFromDTO, Todo, CreateTodoParams } from '../models/Todo';

/**
 * Base URL for the Todo API
 */
const API_URL = 'https://jsonplaceholder.typicode.com/todos';

/**
 * Service for interacting with the Todo API
 */
export const todoApi = {
  /**
   * Fetches all todos from the API
   * @returns A promise that resolves to an array of Todo items
   */
  async fetchTodos(): Promise<Todo[]> {
    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: TodoDTO[] = await response.json();
      return data.map(todoFromDTO);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      throw error;
    }
  },
  
  /**
   * Creates a new todo on the API
   * Note: JSONPlaceholder doesn't actually create new items, but simulates it
   * @param todo The todo item to create
   * @returns A promise that resolves to the created Todo item
   */
  async createTodo(params: CreateTodoParams): Promise<Todo> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: params.title,
          completed: false,
          userId: 1, // Using a fixed userId for simplicity
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: TodoDTO = await response.json();
      return todoFromDTO(data);
    } catch (error) {
      console.error('Failed to create todo:', error);
      throw error;
    }
  },
  
  /**
   * Updates a todo on the API
   * Note: JSONPlaceholder doesn't actually update items, but simulates it
   * @param todo The todo item to update
   * @returns A promise that resolves to the updated Todo item
   */
  async updateTodo(todo: Todo): Promise<Todo> {
    try {
      const response = await fetch(`${API_URL}/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: todo.id,
          title: todo.title,
          completed: todo.completed,
          userId: 1, // Using a fixed userId for simplicity
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      // JSONPlaceholder returns the updated todo
      const data: TodoDTO = await response.json();
      
      // Preserve our local timestamps but update other fields
      return {
        ...todoFromDTO(data),
        createdAt: todo.createdAt,
        updatedAt: new Date(), // Update the updatedAt timestamp
      };
    } catch (error) {
      console.error('Failed to update todo:', error);
      throw error;
    }
  },
  
  /**
   * Deletes a todo from the API
   * Note: JSONPlaceholder doesn't actually delete items, but simulates it
   * @param id The id of the todo to delete
   * @returns A promise that resolves when the todo is deleted
   */
  async deleteTodo(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to delete todo:', error);
      throw error;
    }
  },
};