import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from './src/store';
import { TodoApp } from './src/features/todos/TodoApp';
import { login, logout } from './src/features/auth/authSlice';

// Component đăng ký
const RegisterComponent = ({ setIsRegistering }) => {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleRegister = () => {
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Validation Error", "All fields must be filled");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Validation Error", "Invalid email format");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match");
      return;
    }
    // Handle registration logic here
    console.log("Registering user:", username, email);
  };

  return (
    <View style={styles.authContainer}>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter username"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm password"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.switchButton]}
          onPress={() => setIsRegistering(false)}
        >
          <Text style={styles.buttonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Component đăng nhập
const LoginComponent = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isRegistering, setIsRegistering] = React.useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert("Validation Error", "Please enter username and password");
      return;
    }
    const userData = { username, password };
    dispatch(login(userData));
    await AsyncStorage.setItem('user', JSON.stringify(userData)); // Save user data
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.header}>
        {isRegistering ? "Create a New Account" : "Login"}
      </Text>
      {isRegistering ? (
        <RegisterComponent setIsRegistering={setIsRegistering} />
      ) : (
        <>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.switchButton]}
              onPress={() => setIsRegistering(true)}
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

// Component hiển thị thông tin người dùng
const ProfileComponent = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(logout());
    await AsyncStorage.removeItem('user'); // Clear user data
  };

  if (!user) {
    return <Text style={styles.message}>Please log in</Text>;
  }

  return (
    <View style={styles.profileContainer}>
      <Text style={styles.message}>Welcome, {user.username} 🎉</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

// Component chính của ứng dụng
const MainApp = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        dispatch(login(JSON.parse(storedUser))); // Restore user session
      }
    };
    loadUser();
  }, [dispatch]);

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

export default function App() {
  return (
    <Provider store={store}>
      <MainApp />
      <StatusBar style="auto" />
    </Provider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  authContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '90%',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 40,
    borderColor: 'green',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 4,
  },
  header: {
    fontSize: 25,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 2,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: 'green',
  },
  registerButton: {
    backgroundColor: 'red',
  },
  switchButton: {
    backgroundColor: 'blue',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  todoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 20,
  },
  message: {
    fontSize: 20,
    marginRight: 20,
  },
  logoutText: {
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
