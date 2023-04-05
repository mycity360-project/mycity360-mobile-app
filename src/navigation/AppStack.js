import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import CustomNavigation from './CustomNavigation';
import AdDescription from '../screens/AdDescription';
import WhatAreYouOffering from '../screens/WhatAreYouOffering';
import SubCategory from '../screens/SubCategory';
import IncludeSomeDetails from '../screens/IncludeSomeDetails';
import UploadYourPhotos from '../screens/UploadYourPhotos';
import ServiceDescription from '../screens/ServiceDescription';
import AdSearch from '../screens/AdSearch';
const RootStack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      <RootStack.Screen name="HomeTabs" component={CustomNavigation} />
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
      <RootStack.Screen
        name="ServiceDescription"
        component={ServiceDescription}
      />
      <RootStack.Screen name="AdSearch" component={AdSearch} />
    </RootStack.Navigator>
  );
}
