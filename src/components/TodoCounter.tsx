import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TodoCounterProps {
  total: number;
  completed: number;
}

const TodoCounter: React.FC<TodoCounterProps> = ({ total, completed }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        <Text style={styles.counts}>{completed}</Text> of <Text style={styles.counts}>{total}</Text> tasks completed
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  counts: {
    fontWeight: 'bold',
  },
});

// Memoize component to prevent unnecessary re-renders
export default memo(TodoCounter);