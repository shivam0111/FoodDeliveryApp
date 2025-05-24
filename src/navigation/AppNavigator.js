import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import OTPScreen from '../screens/OTPScreen';
import HomeScreen from '../screens/HomeScreen';
import AdminDashboard from '../screens/AdminDashboard';
import CreateMenuItemScreen from '../screens/admin/CreateMenuItemScreen';
import EditMenuItemScreen from '../screens/admin/EditMenuItemScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OTPScreen" component={OTPScreen} />
        <Stack.Screen name="Home" component={HomeScreen}  />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: false }} />
        <Stack.Screen name="CreateMenuItem" component={CreateMenuItemScreen} />
        <Stack.Screen name="EditMenuItem" component={EditMenuItemScreen} />
{/* EditMenuItem */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
