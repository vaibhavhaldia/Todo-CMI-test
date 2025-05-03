import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { 
  Todo, 
  TodoDTO, 
  CreateTodoParams, 
  todoFromDTO, 
  TodoFilterOption, 
  TodoSortOption,
  createTodo
} from '../models/Todo';
import { todoApi } from '../api/TodoApi';

/**
 * Interface for the Todo state in Redux
 */
interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  filterOption: TodoFilterOption;
  sortOption: TodoSortOption;
}

/**
 * Initial state for the Todo slice
 */
const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
  filterOption: 'all',
  sortOption: 'id',
};

/**
 * Async thunk to fetch todos from the API
 */
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      return await todoApi.fetchTodos();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch todos');
    }
  }
);

/**
 * Async thunk to add a new todo
 */
export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (params: CreateTodoParams, { getState, rejectWithValue }) => {
    try {
      // Create a local todo with a temporary ID for optimistic update
      const state = getState() as { todos: TodoState };
      const newId = state.todos.todos.length > 0 
        ? Math.max(...state.todos.todos.map(todo => todo.id)) + 1 
        : 1;
      
      const newTodo = createTodo(params, newId);
      
      // Send to API (mostly for demonstration)
      await todoApi.createTodo(params);
      
      return newTodo;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add todo');
    }
  }
);

/**
 * Async thunk to toggle a todo's completed status
 */
export const toggleTodo = createAsyncThunk(
  'todos/toggleTodo',
  async (todoId: number, { getState, rejectWithValue }) => {
    const state = getState() as { todos: TodoState };
    const todo = state.todos.todos.find(t => t.id === todoId);
    
    if (!todo) {
      return rejectWithValue(`Todo with id ${todoId} not found`);
    }
    
    try {
      // Create updated todo
      const updatedTodo = {
        ...todo,
        completed: !todo.completed,
        updatedAt: new Date().toISOString(), // Use ISO string
      };
      
      // Send to API
      await todoApi.updateTodo(updatedTodo);
      
      return updatedTodo;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to toggle todo');
    }
  }
);

/**
 * Async thunk to update a todo
 */
export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async (
    { todoId, title, completed }: { todoId: number; title?: string; completed?: boolean },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as { todos: TodoState };
    const todo = state.todos.todos.find(t => t.id === todoId);
    
    if (!todo) {
      return rejectWithValue(`Todo with id ${todoId} not found`);
    }
    
    try {
      // Create updated todo
      const updatedTodo = {
        ...todo,
        title: title !== undefined ? title : todo.title,
        completed: completed !== undefined ? completed : todo.completed,
        updatedAt: new Date().toISOString(), // Use ISO string
      };
      
      // Send to API
      await todoApi.updateTodo(updatedTodo);
      
      return updatedTodo;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update todo');
    }
  }
);

/**
 * Async thunk to delete a todo
 */
export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (todoId: number, { rejectWithValue }) => {
    try {
      await todoApi.deleteTodo(todoId);
      return todoId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete todo');
    }
  }
);

/**
 * Create the todo slice with reducers and actions
 */
const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Synchronous actions
    setFilterOption: (state, action: PayloadAction<TodoFilterOption>) => {
      state.filterOption = action.payload;
    },
    setSortOption: (state, action: PayloadAction<TodoSortOption>) => {
      state.sortOption = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch todos reducers
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
        state.loading = false;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Add todo reducers
    builder
      .addCase(addTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
        state.loading = false;
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Toggle todo reducers
    builder
      .addCase(toggleTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(toggleTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Update todo reducers
    builder
      .addCase(updateTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Delete todo reducers
    builder
      .addCase(deleteTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter(todo => todo.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export synchronous actions
export const { setFilterOption, setSortOption } = todoSlice.actions;

// Export selectors
export const selectAllTodos = (state: { todos: TodoState }) => state.todos.todos;
export const selectLoading = (state: { todos: TodoState }) => state.todos.loading;
export const selectError = (state: { todos: TodoState }) => state.todos.error;
export const selectFilterOption = (state: { todos: TodoState }) => state.todos.filterOption;
export const selectSortOption = (state: { todos: TodoState }) => state.todos.sortOption;

// Base selectors
const selectTodos = (state: { todos: TodoState }) => state.todos.todos;
const selectFilter = (state: { todos: TodoState }) => state.todos.filterOption;
const selectSort = (state: { todos: TodoState }) => state.todos.sortOption;

/**
 * Memoized selector for filtered and sorted todos
 */
export const selectFilteredSortedTodos = createSelector(
  [selectTodos, selectFilter, selectSort],
  (todos, filterOption, sortOption) => {
    // Apply filter
    let result = todos;
    
    if (filterOption === 'active') {
      result = result.filter(todo => !todo.completed);
    } else if (filterOption === 'done') {
      result = result.filter(todo => todo.completed);
    }
    
    // Apply sort
    return [...result].sort((a, b) => {
      if (sortOption === 'recent') {
        // Convert string dates to Date objects before comparing
        const dateA = new Date(a.updatedAt);
        const dateB = new Date(b.updatedAt);
        return dateB.getTime() - dateA.getTime();
      } else {
        return a.id - b.id;
      }
    });
  }
);

/**
 * Selector for total todos count
 */
export const selectTotalCount = (state: { todos: TodoState }) => 
  state.todos.todos.length;

/**
 * Selector for completed todos count
 */
export const selectCompletedCount = (state: { todos: TodoState }) => 
  state.todos.todos.filter(todo => todo.completed).length;

export default todoSlice.reducer;