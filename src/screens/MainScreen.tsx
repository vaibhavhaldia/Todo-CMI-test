import React, { useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList,
  ActivityIndicator,
  Text,
  RefreshControl,
  Animated,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

// Import components
import TodoItem from '../components/TodoItem';
import TodoFilter from '../components/TodoFilter';
import TodoSort from '../components/TodoSort';
import TodoCounter from '../components/TodoCounter';

// Import Redux hooks and actions
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchTodos,
  toggleTodo,
  deleteTodo,
  updateTodo,
  setFilterOption,
  setSortOption,
  selectFilteredSortedTodos,
  selectTotalCount,
  selectCompletedCount,
  selectLoading,
  selectError,
  selectFilterOption,
  selectSortOption
} from '../store/todoSlice';

// Import types
import { RootStackParamList } from '../navigation';
import { Todo, TodoFilterOption, TodoSortOption } from '../models/Todo';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

/**
 * Main screen component that displays the list of todos
 */
const MainScreen: React.FC = () => {
  const navigation = useNavigation<MainScreenNavigationProp>();
  const dispatch = useAppDispatch();
  
  // Select data from Redux store using selectors
  const todos = useAppSelector(selectFilteredSortedTodos);
  const totalCount = useAppSelector(selectTotalCount);
  const completedCount = useAppSelector(selectCompletedCount);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const filterOption = useAppSelector(selectFilterOption);
  const sortOption = useAppSelector(selectSortOption);
  
  // Fetch todos on initial load
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);
  
  // Handler functions - memoize them to prevent unnecessary re-renders
  const handleToggleTodo = useCallback((id: number) => {
    dispatch(toggleTodo(id));
  }, [dispatch]);
  
  const handleDeleteTodo = useCallback((id: number) => {
    dispatch(deleteTodo(id));
  }, [dispatch]);
  
  const handleEditTodo = useCallback((id: number, title: string) => {
    dispatch(updateTodo({ todoId: id, title }));
  }, [dispatch]);
  
  const navigateToEditTodo = useCallback((todoId: number) => {
    navigation.navigate('AddTodo', { todoId });
  }, [navigation]);
  
  const handleRefresh = useCallback(() => {
    dispatch(fetchTodos());
  }, [dispatch]);
  
  const handleFilterChange = useCallback((filter: TodoFilterOption) => {
    dispatch(setFilterOption(filter));
  }, [dispatch]);
  
  const handleSortChange = useCallback((sort: TodoSortOption) => {
    dispatch(setSortOption(sort));
  }, [dispatch]);
  
  // Render item for FlatList - memoize it
  const renderTodoItem = useCallback(({ item }: { item: Todo }) => (
    <TodoItem
      todo={item}
      onToggle={handleToggleTodo}
      onDelete={handleDeleteTodo}
      onEdit={handleEditTodo}
    />
  ), [handleToggleTodo, handleDeleteTodo, handleEditTodo]);
  
  // Memoize key extractor
  const keyExtractor = useCallback((item: Todo) => item.id.toString(), []);
  
  return (
    <View style={styles.container}>
      {/* Controls section */}
      <View style={styles.controlsContainer}>
        <TodoCounter 
          total={totalCount} 
          completed={completedCount}
        />
        
        <View style={styles.filterSortContainer}>
          <TodoFilter 
            currentFilter={filterOption}
            onFilterChange={handleFilterChange}
          />
          
          <TodoSort
            currentSort={sortOption}
            onSortChange={handleSortChange}
          />
        </View>
      </View>
      
      {/* Todos list */}
      {loading && todos.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading todos...</Text>
        </View>
      ) : (
        <FlatList
          data={todos}
          renderItem={renderTodoItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              tintColor="#000"
              colors={['#000']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {error 
                  ? `Error: ${error}` 
                  : "No todos found. Add some!"}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  controlsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterSortContainer: {
    marginTop: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32, // Add extra padding at the bottom
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default MainScreen;