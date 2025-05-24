import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../utils/tokenService'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (userData, token) => {
    setUser(userData);
    setToken(token);
    setAuthToken(token); // ✅ Sync token with axios
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    await AsyncStorage.setItem('token', token);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setAuthToken(null); // ✅ Clear from tokenService
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
  };

  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem('user');
    const storedToken = await AsyncStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setAuthToken(storedToken); // ✅ Load into tokenService on app start
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
