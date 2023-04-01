import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeTabs from './customNavigation';
import AdDescription from '../screens/AdDescription';
import WhatAreYouOffering from '../screens/WhatAreYouOffering';
import SubCategory from '../screens/SubCategory';
import IncludeSomeDetails from '../screens/IncludeSomeDetails';
import UploadYourPhotos from '../screens/UploadYourPhotos';
import VerifyOtp from '../screens/VerifyOtp';
import {AuthContext} from '../context/AuthContext';
import {useContext} from 'react';
const RootStack = createNativeStackNavigator();

export default function AppStack() {
  // const {showVerifyOtpScreen} = useContext(AuthContext);
  // let screen = {showVerifyOtpScreen} ? (
  //   <RootStack.Screen name="VerifyOTP" component={VerifyOtp} />
  // ) : (
  //   <RootStack.Screen name="HomeTabs" component={HomeTabs} />
  // );

  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      {/* {screen} */}
      <RootStack.Screen name="HomeTabs" component={HomeTabs} />
      <RootStack.Screen name="AdDescription" component={AdDescription} />
      <RootStack.Screen
        name="WhatAreYouOffering"
        component={WhatAreYouOffering}
      />
      <RootStack.Screen name="SubCategory" component={SubCategory} />
      <RootStack.Screen
        name="IncludeSomeDetails"
        component={IncludeSomeDetails}
      />
      <RootStack.Screen name="UploadYourPhotos" component={UploadYourPhotos} />
      {/* <RootStack.Screen name="VerifyOTP" component={VerifyOtp} /> */}
    </RootStack.Navigator>
  );
}
