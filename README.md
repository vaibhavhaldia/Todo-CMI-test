# React Native Todo App

A feature-rich Todo application built with React Native and TypeScript. The app uses Redux for state management and follows a domain-driven design approach.

## Features

- Fetch TODO items from an API
- Display a list of TODO items with completed status
- Add, edit, delete, and mark TODO items as completed
- Task statistics (total and completed)
- Sort by ID or Most Recent
- Filter by All, Active, or Done
- Animations for adding, completing, and deleting items
- Proper timestamps management (created_at and updated_at)
- Full TypeScript support

## Project Structure

The project follows a clean architecture approach with a clear domain model:

- `src/api`: API services for data fetching
- `src/components`: Reusable components like TodoItem, TodoFilter, etc.
- `src/models`: Domain models and type definitions
- `src/navigation`: Navigation configuration using React Navigation
- `src/screens`: Main screens of the application
- `src/stores`: Redux stores for state management
- `src/utils`: Utility functions

## Installation

1. Make sure you have React Native development environment set up. If not, follow the [official guide](https://reactnative.dev/docs/environment-setup).

2. Clone the repository and install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the Metro server:

```bash
npm start
# or
yarn start
```

4. Run the app on a simulator or device:

```bash
# For iOS
npm run ios
# or
yarn ios

# For Android
npm run android
# or
yarn android
```

## Technology Stack

- React Native
- TypeScript
- Redux for state management
- React Navigation for routing
- Animated API for animations

## Performance Optimizations

The app includes several performance optimizations:

- Component memoization to prevent unnecessary re-renders
- Optimistic updates for better user experience
- Proper React hooks usage (useCallback, useMemo)
- List virtualization with FlatList
- Animations optimized with useNativeDriver where possible
