import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      saveUserToStorage(state.user);
    },
    logout: (state) => {
      state.user = null;
      removeUserFromStorage();
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

const saveUserToStorage = async (user) => {
  try {
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem('@user', jsonValue);
  } catch (e) {
    console.error("Error saving user", e);
  }
};

const removeUserFromStorage = async () => {
  try {
    await AsyncStorage.removeItem('@user');
  } catch (e) {
    console.error("Error removing user", e);
  }
};

export const loadUserFromStorage = async (dispatch) => {
  try {
    const jsonValue = await AsyncStorage.getItem('@user');
    if (jsonValue != null) {
      const user = JSON.parse(jsonValue);
      dispatch(setUser(user));
    }
  } catch (e) {
    console.error("Error loading user", e);
  }
};

export const { login, logout, setUser } = authSlice.actions;

export default authSlice.reducer;
