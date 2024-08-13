import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserFromStorage } from './features/auth/authSlice';
import { loadTodosFromStorage } from './features/todos/todosSlice';
import { TodoApp } from './features/todos/TodoApp';
import { LoginComponent } from './features/auth/LoginComponent';
import { ProfileComponent } from './features/auth/ProfileComponent';

export const MainApp = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(loadUserFromStorage(dispatch));
    if (user) {
      dispatch(loadTodosFromStorage(dispatch));
    }
  }, [dispatch, user]);

  return (
    <View style={styles.mainContainer}>
      {!user ? (
        <LoginComponent />
      ) : (
        <View style={styles.todoContainer}>
          <ProfileComponent />
          <TodoApp />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  todoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
