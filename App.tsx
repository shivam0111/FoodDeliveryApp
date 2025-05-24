import React from 'react';
// import AppNavigator from './src/navigation/AppNavigator';
import RootNavigator from './src/navigation/RootNavigator';
// import { AuthProvider } from './src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/store';

export default function App() {
    return (
      // <AuthProvider>
      //   <AppNavigator />
      // </AuthProvider>
      <Provider store={store}>
        <NavigationContainer>
          <RootNavigator/>
        </NavigationContainer>
      </Provider>
    );
  }