import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TodoList } from './TodoList';
import { AddTodo } from './AddTodo';

export const TodoApp = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TODO APP</Text>
      <AddTodo />
      <TodoList />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  }
});
