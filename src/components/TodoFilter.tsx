import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TodoFilterOption } from '../models/Todo';

interface TodoFilterProps {
  currentFilter: TodoFilterOption;
  onFilterChange: (filter: TodoFilterOption) => void;
}

const TodoFilter: React.FC<TodoFilterProps> = ({ currentFilter, onFilterChange }) => {
  const filters: TodoFilterOption[] = ['all', 'active', 'done'];
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Filter:</Text>
      <View style={styles.filterButtons}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              currentFilter === filter && styles.activeFilterButton
            ]}
            onPress={() => onFilterChange(filter)}
          >
            <Text 
              style={[
                styles.filterButtonText,
                currentFilter === filter && styles.activeFilterButtonText
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
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
  filterButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeFilterButton: {
    backgroundColor: '#000',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#333',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
});

// Memoize component to prevent unnecessary re-renders
export default memo(TodoFilter);