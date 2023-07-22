import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import VerifyOtp from '../screens/VerifyOtp';
import WebViewScreen from '../screens/WebViewScreen';
import ForgotPassword from '../screens/ForgotPassword';
import ResetPassword from '../screens/ResetPassword';
const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
      <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
}
