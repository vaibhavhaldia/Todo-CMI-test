import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TodoSortOption } from '../models/Todo';

interface TodoSortProps {
  currentSort: TodoSortOption;
  onSortChange: (sort: TodoSortOption) => void;
}

const TodoSort: React.FC<TodoSortProps> = ({ currentSort, onSortChange }) => {
  const sortOptions: { value: TodoSortOption; label: string }[] = [
    { value: 'id', label: 'ID' },
    { value: 'recent', label: 'Most Recent' },
  ];
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sort by:</Text>
      <View style={styles.sortButtons}>
        {sortOptions.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.sortButton,
              currentSort === option.value && styles.activeSortButton
            ]}
            onPress={() => onSortChange(option.value)}
          >
            <Text 
              style={[
                styles.sortButtonText,
                currentSort === option.value && styles.activeSortButtonText
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
  sortButtons: {
    flexDirection: 'row',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeSortButton: {
    backgroundColor: '#000',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#333',
  },
  activeSortButtonText: {
    color: '#fff',
  },
});

// Memoize component to prevent unnecessary re-renders
export default memo(TodoSort);