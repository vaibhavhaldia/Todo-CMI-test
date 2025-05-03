import React, { memo, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Animated,
  TextInput 
} from 'react-native';
import { getRelativeTimeString } from '../utils/dateUtils';
import { Todo } from '../models/Todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, title: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  const handleDelete = () => {
    // Animate removal
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDelete(todo.id);
    });
  };
  
  const handleToggle = () => {
    // Animate completion
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onToggle(todo.id);
    });
  };
  
  const handleEditSubmit = () => {
    if (editedTitle.trim() !== '') {
      onEdit(todo.id, editedTitle);
      setIsEditing(false);
    }
  };
  
  const startEditing = () => {
    setIsEditing(true);
  };
  
  const cancelEditing = () => {
    setEditedTitle(todo.title);
    setIsEditing(false);
  };
  
  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        },
        todo.completed && styles.completedContainer
      ]}
    >
      <TouchableOpacity
        style={styles.checkbox}
        onPress={handleToggle}
      >
        <View style={[
          styles.checkboxInner,
          todo.completed && styles.checkboxChecked
        ]}>
          {todo.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
      
      <View style={styles.content}>
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.input}
              value={editedTitle}
              onChangeText={setEditedTitle}
              autoFocus
              onBlur={cancelEditing}
              onSubmitEditing={handleEditSubmit}
            />
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.editButton} onPress={handleEditSubmit}>
                <Text style={styles.editButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton} onPress={cancelEditing}>
                <Text style={styles.editButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity onPress={startEditing} style={styles.titleContainer}>
            <Text 
              style={[
                styles.title,
                todo.completed && styles.completedTitle
              ]}
            >
              {todo.title}
            </Text>
            <Text style={styles.timestamp}>
              Updated {getRelativeTimeString(todo.updatedAt)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedContainer: {
    backgroundColor: '#f9f9f9',
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#000',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 20,
    color: '#ff3b30',
    fontWeight: 'bold',
  },
  editContainer: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    color: '#000',
  },
  editActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  editButton: {
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

// Memoize component to prevent unnecessary re-renders
export default memo(TodoItem);