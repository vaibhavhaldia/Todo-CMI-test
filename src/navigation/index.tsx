import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import MainScreen from '../screens/MainScreen';
import AddTodoScreen from '../screens/AddTodoScreen';

// Define the stack parameter list
export type RootStackParamList = {
  Main: undefined;
  AddTodo: { 
    todoId?: number;  // Optional todoId for editing existing todos
  };
};

// Create stack navigator with type
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          cardStyle: { backgroundColor: '#f8f8f8' },
        }}
      >
        <Stack.Screen 
          name="Main" 
          component={MainScreen}
          options={({navigation}) => ({
            title: 'TODO List',
            headerRight: () => (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('AddTodo')}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="AddTodo" 
          component={AddTodoScreen}
          options={({ route }) => ({
            title: route.params?.todoId ? 'Edit Todo' : 'Add Todo',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  addButton: {
    marginRight: 16,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: -2, // Fine-tune vertical alignment
  },
});

export default AppNavigator;