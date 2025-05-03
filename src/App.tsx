import React from 'react';
import { LogBox, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './store';
import AppNavigator from './navigation';

// Ignore specific warnings that are not relevant to the app
LogBox.ignoreLogs([
  'Remote debugger', // Common RN development warning
  'Immutable data', // Expected behavior with Redux Toolkit
]);

/**
 * Root component of the application
 */
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;