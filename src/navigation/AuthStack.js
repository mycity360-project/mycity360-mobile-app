import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import OnBoarding from '../screens/OnBoarding';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import VerifyOtp from '../screens/VerifyOtp';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        name="OnBoarding"
        component={OnBoarding}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="VerifyOtp"
        component={VerifyOtp}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
