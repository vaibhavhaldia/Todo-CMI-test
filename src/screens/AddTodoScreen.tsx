import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Import Redux hooks and actions
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addTodo, updateTodo, selectAllTodos, selectLoading } from '../store/todoSlice';

// Import types
import { RootStackParamList } from '../navigation';

type AddTodoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddTodo'>;
type AddTodoScreenRouteProp = RouteProp<RootStackParamList, 'AddTodo'>;

/**
 * Screen for adding or editing a todo
 */
const AddTodoScreen: React.FC = () => {
  const navigation = useNavigation<AddTodoScreenNavigationProp>();
  const route = useRoute<AddTodoScreenRouteProp>();
  const dispatch = useAppDispatch();
  
  // Select data from Redux store
  const todos = useAppSelector(selectAllTodos);
  const loading = useAppSelector(selectLoading);
  
  // Get the todoId from route params if editing
  const todoId = route.params?.todoId;
  
  // State for the todo title
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateYAnim = React.useRef(new Animated.Value(20)).current;
  
  // If editing, populate the form with the todo data
  useEffect(() => {
    if (todoId !== undefined) {
      const todo = todos.find(t => t.id === todoId);
      if (todo) {
        setTitle(todo.title);
      } else {
        // Todo not found, go back
        Alert.alert('Error', 'Todo not found');
        navigation.goBack();
      }
    }
    
    // Animate the form entering
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [todoId, navigation, fadeAnim, translateYAnim, todos]);
  
  const handleSubmit = async () => {
    // Validate input
    if (title.trim() === '') {
      Alert.alert('Error', 'Please enter a todo title');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (todoId !== undefined) {
        // Update existing todo
        await dispatch(updateTodo({ todoId, title })).unwrap();
      } else {
        // Add new todo
        await dispatch(addTodo({ title })).unwrap();
      }
      
      // Close keyboard and go back
      Keyboard.dismiss();
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigation.goBack();
  };
  
  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.formContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
          },
        ]}
      >
        <Text style={styles.label}>
          {todoId !== undefined ? 'Edit Todo' : 'Add New Todo'}
        </Text>
        
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="What needs to be done?"
          placeholderTextColor="#aaa"
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.saveButton, isSubmitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>
                {todoId !== undefined ? 'Update' : 'Add'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#f9f9f9',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#000',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default AddTodoScreen;