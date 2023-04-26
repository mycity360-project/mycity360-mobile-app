import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CustomNavigation from './CustomNavigation';
import AdDescription from '../screens/AdDescription';
import WhatAreYouOffering from '../screens/WhatAreYouOffering';
import SubCategory from '../screens/SubCategory';
import IncludeSomeDetails from '../screens/IncludeSomeDetails';
import UploadAdPhotos from '../screens/UploadAdPhotos';
import ServiceDescription from '../screens/ServiceDescription';
import CategorySearch from '../screens/CategorySearch';
import TextSearch from '../screens/TextSearch';
import Location from '../screens/Location';
import QuestionsScreen from '../screens/QuestionsScreen';
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
      <RootStack.Screen name="UploadAdPhotos" component={UploadAdPhotos} />
      <RootStack.Screen
        name="ServiceDescription"
        component={ServiceDescription}
      />
      <RootStack.Screen name="CategorySearch" component={CategorySearch} />
      <RootStack.Screen name="TextSearch" component={TextSearch} />
      <RootStack.Screen name="Location" component={Location} />
      <RootStack.Screen name="QuestionsScreen" component={QuestionsScreen} />
    </RootStack.Navigator>
  );
}
