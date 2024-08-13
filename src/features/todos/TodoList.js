import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTodo } from './todosSlice';

export const TodoList = () => {
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => dispatch(toggleTodo({ id: item.id }))}>
      <View style={styles.todoItem}>
        <Text style={[styles.todoText, item.completed && styles.completedTodo]}>
          {item.text}
        </Text>
        <Text style={styles.status}>
          {item.completed ? '🍀Đã hoàn thành🍀' : '✏️Chưa làm'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={todos}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  todoItem: {
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoText: {
    fontSize: 18,
  },
  completedTodo: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  status: {
    fontSize: 14,
    fontStyle: 'italic',
    marginLeft: 20,
  },
});
